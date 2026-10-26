/*!
 * DUCKCHEON KOREA (dctrade.co.kr) Private Invisible Pageview Tracker
 * - 100% invisible to normal visitors (zero DOM elements, zero visible UI).
 * - Tracks daily (KST Asia/Seoul) and cumulative pageviews per page slug and across the blog.
 * - Filters out headless browsers (navigator.webdriver), bots/crawlers, and ?notrack=1 checks.
 * - Private owner-only view mode when visiting with ?admin=9616.
 */
(function () {
  'use strict';

  var AMAZON_ASSOCIATE_TAG = "dctrade-20"; // Set Store ID here (e.g. "dctrade-20") to auto-apply to all Amazon links site-wide
  var NAMESPACE = 'dctrade_kr_priv_9616';
  var API_BASE = 'https://abacus.jasoncameron.dev';

  function getActiveAmazonTag() {
    var tag = (AMAZON_ASSOCIATE_TAG || '').trim();
    try {
      var override = (localStorage.getItem('dctrade_amazon_tag') || localStorage.getItem('studio_amazon_tag') || '').trim();
      if (override) tag = override;
    } catch (e) {}
    return tag;
  }

  function applyAmazonAssociateLinks() {
    var tag = getActiveAmazonTag();
    var links = document.querySelectorAll('a[href*="amazon.com"], a[data-amazon-link]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var rawHref = a.getAttribute('href') || '';
      if (!rawHref) continue;
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'nofollow sponsored noopener');
      if (tag) {
        try {
          var u = new URL(rawHref, window.location.origin);
          if (/amazon\./i.test(u.hostname)) {
            u.searchParams.set('tag', tag);
            a.setAttribute('href', u.toString());
          }
        } catch (e) {}
      }
    }
  }

  function fnv1aHex8(str) {
    var h = 0x811c9dc5;
    var bytes = new TextEncoder().encode(str);
    for (var i = 0; i < bytes.length; i++) {
      h ^= bytes[i];
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  }

  function shortSlug(slug) {
    var clean = String(slug || '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'home';
    if (clean.length <= 44) return clean;
    return clean.slice(0, 35) + '_' + fnv1aHex8(clean);
  }

  function getKstDateString(offsetDays) {
    var offset = (typeof offsetDays === 'number' ? offsetDays : 0) * 86400000;
    var kstMs = Date.now() + (9 * 3600000) + offset;
    return new Date(kstMs).toISOString().slice(0, 10);
  }

  function detectPageInfo() {
    var path = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    var lower = path.toLowerCase();

    if (lower === '/' || lower === '/index.html') {
      return { slug: 'home', isBlog: false };
    }
    if (lower === '/blog' || lower === '/blog/index.html') {
      return { slug: 'blog-index', isBlog: true };
    }
    if (lower.indexOf('/blog/') === 0) {
      var name = lower.slice(6).replace(/\.html$/i, '').replace(/^\/+|\/+$/g, '') || 'blog-index';
      return { slug: name, isBlog: true };
    }
    var seg = lower.split('/').pop().replace(/\.html$/i, '') || 'page';
    return { slug: seg, isBlog: false };
  }

  function shouldTrack(params) {
    if (params.get('force_track') === '1') return true;
    if (params.get('notrack') === '1') return false;
    if (params.get('admin') === '9616') return false;
    if (typeof navigator !== 'undefined' && navigator.webdriver) return false;

    var ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
    if (/bot|crawl|spider|slurp|headless|lighthouse|pagespeed|gtmetrix|pingdom|python|curl|wget|playwright|puppeteer/i.test(ua)) {
      return false;
    }

    var host = (window.location.hostname || '').toLowerCase();
    if (!host || host === 'localhost' || host === '127.0.0.1' || window.location.protocol === 'file:') {
      return false;
    }

    return true;
  }

  function hitKey(key) {
    try {
      fetch(API_BASE + '/hit/' + NAMESPACE + '/' + encodeURIComponent(key), {
        method: 'GET',
        mode: 'cors',
        keepalive: true,
        cache: 'no-store'
      }).catch(function () {});
    } catch (e) {}
  }

  function getKey(key) {
    return fetch(API_BASE + '/get/' + NAMESPACE + '/' + encodeURIComponent(key), {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store'
    })
      .then(function (res) {
        if (!res.ok) return 0;
        return res.json().then(function (data) {
          return (data && typeof data.value === 'number') ? data.value : 0;
        });
      })
      .catch(function () { return 0; });
  }

  function renderAdminToast(info, today, yesterday) {
    var sKey = shortSlug(info.slug);
    Promise.all([
      getKey('day__' + yesterday + '__' + sKey),
      getKey('day__' + today + '__' + sKey),
      getKey('total__' + sKey),
      getKey('day__' + yesterday + '__all_blog'),
      getKey('day__' + today + '__all_blog'),
      getKey('total__all_blog')
    ]).then(function (vals) {
      var bar = document.createElement('div');
      bar.id = 'dctrade-admin-toast';
      bar.style.cssText = [
        'position:fixed',
        'top:12px',
        'left:50%',
        'transform:translateX(-50%)',
        'z-index:999999',
        'background:rgba(15,23,42,0.95)',
        'color:#f8fafc',
        'padding:10px 18px',
        'border-radius:999px',
        'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
        'font-size:13px',
        'font-weight:600',
        'box-shadow:0 10px 25px rgba(0,0,0,0.35)',
        'border:1px solid rgba(182,141,64,0.6)',
        'display:flex',
        'align-items:center',
        'gap:12px',
        'max-width:94vw',
        'white-space:nowrap',
        'overflow-x:auto'
      ].join(';');

      bar.innerHTML =
        '<span>🔒 <strong>관리자 전용 조회수</strong></span>' +
        '<span style="color:#cbd5e1;">|</span>' +
        '<span>현재 페이지: 어제 <strong style="color:#fbbf24;">' + vals[0] + '</strong> · 오늘 <strong style="color:#38bdf8;">' + vals[1] + '</strong> · 누적 <strong>' + vals[2] + '</strong></span>' +
        '<span style="color:#cbd5e1;">|</span>' +
        '<span>블로그 전체: 어제 <strong style="color:#fbbf24;">' + vals[3] + '</strong> · 오늘 <strong style="color:#38bdf8;">' + vals[4] + '</strong> · 누적 <strong>' + vals[5] + '</strong></span>' +
        '<button type="button" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;padding:0 4px;" onclick="this.parentElement.remove()">✕</button>';

      if (document.body) {
        document.body.appendChild(bar);
      } else {
        document.addEventListener('DOMContentLoaded', function () {
          document.body.appendChild(bar);
        });
      }
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyAmazonAssociateLinks);
    } else {
      applyAmazonAssociateLinks();
    }

    var params;
    try {
      params = new URLSearchParams(window.location.search || '');
    } catch (e) {
      params = { get: function () { return null; } };
    }

    var info = detectPageInfo();
    var today = getKstDateString(0);
    var yesterday = getKstDateString(-1);
    var sKey = shortSlug(info.slug);

    if (params.get('admin') === '9616') {
      renderAdminToast(info, today, yesterday);
      return;
    }

    if (!shouldTrack(params)) return;

    // 60-second same-tab reload guard to avoid accidental F5 double-counting
    var dedupeKey = 'dct_pv_' + today + '_' + sKey;
    if (params.get('force_track') !== '1') {
      try {
        var lastTs = parseInt(sessionStorage.getItem(dedupeKey) || '0', 10);
        if (lastTs && (Date.now() - lastTs) < 60000) {
          return;
        }
        sessionStorage.setItem(dedupeKey, String(Date.now()));
      } catch (e) {}
    }

    hitKey('day__' + today + '__' + sKey);
    hitKey('total__' + sKey);

    if (info.isBlog) {
      hitKey('day__' + today + '__all_blog');
      hitKey('total__all_blog');
    }
  }

  window.DCTradeTracker = {
    namespace: NAMESPACE,
    amazonAssociateTag: AMAZON_ASSOCIATE_TAG,
    getActiveAmazonTag: getActiveAmazonTag,
    applyAmazonAssociateLinks: applyAmazonAssociateLinks,
    shortSlug: shortSlug,
    getKstDateString: getKstDateString,
    getKey: getKey
  };

  init();
})();
