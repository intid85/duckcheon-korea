/*!
 * DUCKCHEON KOREA (dctrade.co.kr) Private Invisible Pageview Tracker & Blog Reviews/Q&A Engine
 * - 100% invisible pageview tracker to normal visitors.
 * - Tracks daily (KST Asia/Seoul) and cumulative pageviews per page slug and across the blog.
 * - Filters out headless browsers (navigator.webdriver), bots/crawlers, and ?notrack=1 checks.
 * - Private owner-only view & comment moderation mode when visiting with ?admin=9616.
 * - Automatically mounts/hydrates the no-login Customer Reviews & Buyer Q&A section (#dctrade-comments)
 *   on individual blog post pages (/blog/*.html, excluding /blog/index.html) backed by Supabase REST API.
 */
(function () {
  'use strict';

  var AMAZON_ASSOCIATE_TAG = "dctrade-20"; // Set Store ID here (e.g. "dctrade-20") to auto-apply to all Amazon links site-wide
  var NAMESPACE = 'dctrade_kr_priv_9616';
  var API_BASE = 'https://abacus.jasoncameron.dev';

  var SUPABASE_URL = 'https://zaahvfqfwtcpfvmuiics.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_p6l26OduwxiW0iexCMReRQ_Hk3OviTl';
  var COMMENTS_TABLE = 'dctrade_blog_comments';

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
      return { slug: 'home', isBlog: false, isBlogArticle: false };
    }
    if (lower === '/blog' || lower === '/blog/index.html' || /\/blog\/index\.html$/i.test(lower)) {
      return { slug: 'blog-index', isBlog: true, isBlogArticle: false };
    }
    var blogMatch = lower.match(/\/blog\/([^\/]+?)(?:\.html)?$/i);
    if (blogMatch && blogMatch[1]) {
      var name = blogMatch[1].replace(/\.html$/i, '').replace(/^\/+|\/+$/g, '') || 'blog-index';
      return {
        slug: name,
        isBlog: true,
        isBlogArticle: name !== 'index' && name !== 'blog-index'
      };
    }
    var seg = lower.split('/').pop().replace(/\.html$/i, '') || 'page';
    return { slug: seg, isBlog: false, isBlogArticle: false };
  }

  function isAdminMode(params) {
    try {
      if (params && params.get('admin') === '9616') {
        localStorage.setItem('dctrade_admin_pin', '9616');
        return true;
      }
      if (params && params.get('admin') === '0') {
        localStorage.removeItem('dctrade_admin_pin');
        return false;
      }
      return localStorage.getItem('dctrade_admin_pin') === '9616';
    } catch (e) {
      return Boolean(params && params.get('admin') === '9616');
    }
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
        '<span>🔒 <strong>관리자 모드 (조회수 & 댓글 삭제 활성)</strong></span>' +
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

  /* ==========================================================================
   * Customer Reviews & Buyer Q&A Widget (Supabase Cloud Backend)
   * ========================================================================== */
  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatCommentDate(isoStr) {
    if (!isoStr) return 'Just now';
    try {
      var d = new Date(isoStr);
      if (isNaN(d.getTime())) return 'Recent';
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Recent';
    }
  }

  function getRoleBadgeMeta(buyerType) {
    var raw = String(buyerType || '').toLowerCase();
    if (raw.indexOf('wholesale') !== -1 || raw.indexOf('distributor') !== -1 || raw.indexOf('b2b') !== -1) {
      return {
        icon: '🏢',
        label: 'B2B Buyer / Distributor',
        cls: 'dct-role-b2b'
      };
    }
    if (raw.indexOf('esthetician') !== -1 || raw.indexOf('clinic') !== -1 || raw.indexOf('spa') !== -1) {
      return {
        icon: '💆‍♀️',
        label: 'Clinic / Esthetician',
        cls: 'dct-role-clinic'
      };
    }
    return {
      icon: '🛍️',
      label: 'Verified Skincare User (Retail)',
      cls: 'dct-role-retail'
    };
  }

  function renderStarsText(rating) {
    var r = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));
    var full = '';
    var empty = '';
    for (var i = 0; i < r; i++) full += '★';
    for (var j = r; j < 5; j++) empty += '☆';
    return '<span class="dct-stars-filled" aria-label="' + r + ' out of 5 stars">' + full + '</span>' +
           (empty ? '<span class="dct-stars-empty">' + empty + '</span>' : '');
  }

  function injectCommentsStyles() {
    if (document.getElementById('dctrade-comments-styles')) return;
    var style = document.createElement('style');
    style.id = 'dctrade-comments-styles';
    style.textContent = [
      '.comments-section { margin: 44px 0 12px; padding-top: 32px; border-top: 2px solid #E2E8F0; font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif; color: #1E293B; }',
      '.dct-comments-shell { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; padding: 28px 28px 30px; box-shadow: 0 12px 32px rgba(15, 30, 46, 0.05); }',
      '.dct-comments-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid #E2E8F0; margin-bottom: 22px; }',
      '.dct-comments-title-wrap { flex: 1 1 320px; }',
      '.dct-verified-badge { display: inline-flex; align-items: center; gap: 6px; background: #F4EFE6; color: #8C6826; border: 1px solid rgba(182, 141, 64, 0.35); font-size: 0.74rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 11px; border-radius: 999px; margin-bottom: 8px; }',
      '.dct-comments-heading { font-family: "Cormorant Garamond", Georgia, serif; font-size: 1.85rem; font-weight: 700; color: #0F1E2E; margin: 0 0 4px; line-height: 1.2; }',
      '.dct-comments-sub { font-size: 0.88rem; color: #64748B; margin: 0; }',
      '.dct-rating-summary-box { display: flex; align-items: center; gap: 14px; background: linear-gradient(135deg, #0F1E2E 0%, #1B324B 100%); color: #FFFFFF; padding: 12px 20px; border-radius: 16px; border: 1px solid rgba(182, 141, 64, 0.45); }',
      '.dct-rating-big { font-size: 1.95rem; font-weight: 800; color: #FBBF24; line-height: 1; letter-spacing: -0.02em; }',
      '.dct-rating-meta { display: flex; flex-direction: column; gap: 2px; }',
      '.dct-rating-stars-bar { color: #FBBF24; font-size: 0.98rem; letter-spacing: 1px; line-height: 1.1; }',
      '.dct-rating-count { font-size: 0.78rem; color: rgba(255, 255, 255, 0.82); font-weight: 600; }',
      '.dct-form-card { background: #FAF8F5; border: 1px solid #E5DEC9; border-radius: 16px; padding: 20px 22px; margin-bottom: 26px; }',
      '.dct-form-title { font-size: 1.02rem; font-weight: 800; color: #0F1E2E; margin: 0 0 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }',
      '.dct-form-title span.dct-no-login-tag { font-size: 0.75rem; font-weight: 600; color: #475569; background: #FFFFFF; border: 1px solid #CBD5E1; padding: 3px 10px; border-radius: 999px; }',
      '.dct-star-picker-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }',
      '.dct-star-picker-label { font-size: 0.84rem; font-weight: 700; color: #1E293B; }',
      '.dct-star-buttons { display: inline-flex; align-items: center; gap: 4px; background: #FFFFFF; border: 1px solid #CBD5E1; padding: 4px 10px; border-radius: 999px; }',
      '.dct-star-btn { background: none; border: none; cursor: pointer; font-size: 1.35rem; line-height: 1; padding: 2px 3px; color: #CBD5E1; transition: transform 0.12s ease, color 0.12s ease; }',
      '.dct-star-btn.active { color: #F59E0B; }',
      '.dct-star-btn:hover { transform: scale(1.15); }',
      '.dct-star-score-text { font-size: 0.82rem; font-weight: 700; color: #B68D40; margin-left: 4px; }',
      '.dct-role-pills { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-bottom: 14px; }',
      '.dct-role-pill-label { display: flex; align-items: center; justify-content: center; gap: 6px; background: #FFFFFF; border: 1.5px solid #CBD5E1; border-radius: 10px; padding: 9px 10px; font-size: 0.8rem; font-weight: 700; color: #334155; cursor: pointer; transition: all 0.15s ease; user-select: none; text-align: center; margin: 0; }',
      '.dct-role-pill-label input { display: none; }',
      '.dct-role-pill-label.selected { background: #0F1E2E; color: #FFFFFF; border-color: #0F1E2E; box-shadow: 0 4px 12px rgba(15, 30, 46, 0.16); }',
      '.dct-input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }',
      '.dct-field { display: flex; flex-direction: column; gap: 5px; }',
      '.dct-field label { font-size: 0.78rem; font-weight: 700; color: #334155; }',
      '.dct-field input, .dct-field select, .dct-field textarea { width: 100%; box-sizing: border-box; font-family: inherit; font-size: 0.9rem; color: #0F1E2E; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 10px; padding: 10px 12px; transition: border-color 0.15s ease, box-shadow 0.15s ease; }',
      '.dct-field input:focus, .dct-field select:focus, .dct-field textarea:focus { outline: none; border-color: #B68D40; box-shadow: 0 0 0 3px rgba(182, 141, 64, 0.18); }',
      '.dct-field textarea { resize: vertical; min-height: 88px; line-height: 1.55; }',
      '.dct-form-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-top: 12px; }',
      '.dct-form-note { font-size: 0.78rem; color: #64748B; }',
      '.dct-submit-btn { background: #B68D40; color: #FFFFFF; font-family: inherit; font-size: 0.9rem; font-weight: 800; border: none; border-radius: 999px; padding: 11px 22px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 6px 16px rgba(182, 141, 64, 0.28); transition: all 0.15s ease; }',
      '.dct-submit-btn:hover:not(:disabled) { background: #9c7632; transform: translateY(-1px); }',
      '.dct-submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }',
      '.dct-status-msg { font-size: 0.84rem; font-weight: 700; margin-top: 10px; display: none; padding: 9px 13px; border-radius: 10px; }',
      '.dct-status-msg.ok { display: block; background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }',
      '.dct-status-msg.err { display: block; background: #FEF2F2; color: #991B1B; border: 1px solid #FECACA; }',
      '.dct-comments-list { display: flex; flex-direction: column; gap: 14px; }',
      '.dct-comment-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; padding: 18px 20px; transition: border-color 0.15s ease; }',
      '.dct-comment-card:hover { border-color: #CBD5E1; }',
      '.dct-comment-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }',
      '.dct-author-block { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }',
      '.dct-avatar { width: 34px; height: 34px; border-radius: 50%; background: #0F1E2E; color: #F4EFE6; font-weight: 800; font-size: 0.86rem; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }',
      '.dct-author-name { font-weight: 800; font-size: 0.95rem; color: #0F1E2E; }',
      '.dct-country-badge { font-size: 0.75rem; font-weight: 700; color: #475569; background: #F1F5F9; padding: 3px 9px; border-radius: 999px; border: 1px solid #E2E8F0; }',
      '.dct-role-badge { font-size: 0.73rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; }',
      '.dct-role-retail { background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }',
      '.dct-role-b2b { background: #E0F2FE; color: #075985; border: 1px solid #BAE6FD; }',
      '.dct-role-clinic { background: #F3E8FF; color: #6B21A8; border: 1px solid #E9D5FF; }',
      '.dct-comment-right { display: flex; align-items: center; gap: 10px; }',
      '.dct-stars-filled { color: #F59E0B; font-size: 0.95rem; letter-spacing: 1px; }',
      '.dct-stars-empty { color: #CBD5E1; font-size: 0.95rem; letter-spacing: 1px; }',
      '.dct-comment-date { font-size: 0.76rem; color: #94A3B8; font-weight: 600; }',
      '.dct-comment-body { font-size: 0.94rem; line-height: 1.68; color: #1E293B; margin: 0; white-space: pre-line; word-break: break-word; }',
      '.dct-admin-del-btn { background: #FEE2E2; color: #B91C1C; border: 1px solid #FCA5A5; border-radius: 8px; padding: 4px 9px; font-size: 0.74rem; font-weight: 800; cursor: pointer; transition: background 0.15s ease; }',
      '.dct-admin-del-btn:hover { background: #FECACA; }',
      '.dct-empty-state { text-align: center; padding: 26px 16px; color: #64748B; font-size: 0.9rem; background: #F8FAFC; border-radius: 12px; border: 1px dashed #CBD5E1; }',
      '@media (max-width: 768px) {',
      '  .comments-section { margin: 28px 0 8px; padding-top: 20px; }',
      '  .dct-comments-shell { padding: 18px 15px 20px; border-radius: 15px; }',
      '  .dct-comments-heading { font-size: 1.42rem; }',
      '  .dct-rating-summary-box { width: 100%; justify-content: space-between; padding: 10px 15px; border-radius: 12px; box-sizing: border-box; }',
      '  .dct-rating-big { font-size: 1.65rem; }',
      '  .dct-form-card { padding: 15px 14px; border-radius: 13px; margin-bottom: 18px; }',
      '  .dct-input-grid { grid-template-columns: 1fr; gap: 10px; }',
      '  .dct-role-pills { grid-template-columns: 1fr; gap: 6px; }',
      '  .dct-role-pill-label { padding: 8px 10px; font-size: 0.78rem; justify-content: flex-start; }',
      '  .dct-submit-btn { width: 100%; justify-content: center; padding: 11px 16px; }',
      '  .dct-comment-card { padding: 14px 14px; border-radius: 12px; }',
      '  .dct-comment-body { font-size: 0.88rem; line-height: 1.58; }',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function fetchPostComments(postSlug) {
    var url = SUPABASE_URL + '/rest/v1/' + COMMENTS_TABLE +
      '?post_slug=eq.' + encodeURIComponent(postSlug) +
      '&select=id,post_slug,author_name,country,buyer_type,rating,content,created_at' +
      '&order=created_at.desc&limit=50';
    return fetch(url, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Accept': 'application/json'
      },
      cache: 'no-store'
    }).then(function (res) {
      if (!res.ok) throw new Error('Failed to load reviews');
      return res.json();
    });
  }

  function insertPostComment(payload) {
    var url = SUPABASE_URL + '/rest/v1/' + COMMENTS_TABLE;
    return fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          throw new Error(t || 'Failed to submit comment');
        });
      }
      return res.json();
    });
  }

  function deletePostCommentAdmin(commentId, adminPin) {
    var url = SUPABASE_URL + '/rest/v1/rpc/delete_dctrade_comment';
    return fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        p_id: commentId,
        p_admin_pin: String(adminPin || '9616')
      })
    }).then(function (res) {
      if (!res.ok) throw new Error('Delete failed');
      return res.json();
    });
  }

  function updateJsonLdReviews(postSlug, comments) {
    if (!Array.isArray(comments) || comments.length === 0) return;
    try {
      var sum = 0;
      for (var i = 0; i < comments.length; i++) {
        sum += (parseInt(comments[i].rating, 10) || 5);
      }
      var avg = (sum / comments.length).toFixed(1);
      var pageTitle = (document.querySelector('h1') && document.querySelector('h1').textContent) || document.title || postSlug;

      var existing = document.getElementById('dctrade-reviews-jsonld');
      if (!existing) {
        existing = document.createElement('script');
        existing.type = 'application/ld+json';
        existing.id = 'dctrade-reviews-jsonld';
        document.head.appendChild(existing);
      }

      var schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': pageTitle.replace(/\s*\|.*$/, '').trim(),
        'brand': {
          '@type': 'Brand',
          'name': 'DUCKCHEON KOREA K-Beauty Curation'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': avg,
          'bestRating': '5',
          'worstRating': '1',
          'ratingCount': String(comments.length),
          'reviewCount': String(comments.length)
        },
        'review': comments.slice(0, 10).map(function (c) {
          return {
            '@type': 'Review',
            'author': {
              '@type': 'Person',
              'name': c.author_name || 'Verified Reviewer'
            },
            'datePublished': (c.created_at || new Date().toISOString()).slice(0, 10),
            'reviewBody': c.content || '',
            'reviewRating': {
              '@type': 'Rating',
              'ratingValue': String(c.rating || 5),
              'bestRating': '5',
              'worstRating': '1'
            }
          };
        })
      };
      existing.textContent = JSON.stringify(schemaObj);
    } catch (e) {}
  }

  function mountBlogComments(info, params) {
    if (!info || !info.isBlogArticle) return;

    injectCommentsStyles();

    var container = document.getElementById('dctrade-comments');
    if (!container) {
      container = document.createElement('section');
      container.id = 'dctrade-comments';
      container.className = 'comments-section';
      var article = document.querySelector('article');
      var ctaBox = document.getElementById('b2b-cta');
      if (ctaBox && ctaBox.parentNode) {
        ctaBox.parentNode.insertBefore(container, ctaBox.nextSibling);
      } else if (article) {
        article.appendChild(container);
      } else {
        var mainWrap = document.querySelector('.container') || document.body;
        mainWrap.appendChild(container);
      }
    }

    var postSlug = container.getAttribute('data-post-slug') || info.slug;
    var adminActive = isAdminMode(params);
    var selectedRating = 5;

    container.innerHTML =
      '<div class="dct-comments-shell">' +
        '<div class="dct-comments-top">' +
          '<div class="dct-comments-title-wrap">' +
            '<span class="dct-verified-badge">✨ Verified K-Beauty Community &amp; Buyer Q&amp;A</span>' +
            '<h2 class="dct-comments-heading">Customer Reviews &amp; Global Buyer Q&amp;A</h2>' +
            '<p class="dct-comments-sub">Share your skincare experience or leave a retail / B2B wholesale question below — no login required.</p>' +
          '</div>' +
          '<div class="dct-rating-summary-box" id="dct-rating-summary">' +
            '<div class="dct-rating-big" id="dct-avg-score">5.0 ★</div>' +
            '<div class="dct-rating-meta">' +
              '<div class="dct-rating-stars-bar" id="dct-avg-stars">★★★★★</div>' +
              '<div class="dct-rating-count" id="dct-total-reviews">Loading community reviews...</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<form class="dct-form-card" id="dct-comment-form" novalidate>' +
          '<div class="dct-form-title">' +
            '<span>✍️ Write a Product Review or Ask a Sourcing Question</span>' +
            '<span class="dct-no-login-tag">⚡ Instant Post · No Sign-Up Required</span>' +
          '</div>' +

          '<div class="dct-star-picker-row">' +
            '<span class="dct-star-picker-label">Your Rating:</span>' +
            '<div class="dct-star-buttons" id="dct-star-picker" role="radiogroup" aria-label="Star Rating">' +
              '<button type="button" class="dct-star-btn active" data-star="1" aria-label="1 Star">★</button>' +
              '<button type="button" class="dct-star-btn active" data-star="2" aria-label="2 Stars">★</button>' +
              '<button type="button" class="dct-star-btn active" data-star="3" aria-label="3 Stars">★</button>' +
              '<button type="button" class="dct-star-btn active" data-star="4" aria-label="4 Stars">★</button>' +
              '<button type="button" class="dct-star-btn active" data-star="5" aria-label="5 Stars">★</button>' +
            '</div>' +
            '<span class="dct-star-score-text" id="dct-star-label">5.0 / 5 (Highly Recommended)</span>' +
          '</div>' +

          '<div class="dct-role-pills" id="dct-role-pills">' +
            '<label class="dct-role-pill-label selected">' +
              '<input type="radio" name="buyer_type" value="Retail Customer" checked />' +
              '<span>🛍️ Skincare User (Retail)</span>' +
            '</label>' +
            '<label class="dct-role-pill-label">' +
              '<input type="radio" name="buyer_type" value="Wholesale / Distributor" />' +
              '<span>🏢 B2B Buyer / Distributor</span>' +
            '</label>' +
            '<label class="dct-role-pill-label">' +
              '<input type="radio" name="buyer_type" value="Esthetician / Clinic" />' +
              '<span>💆‍♀️ Clinic / Esthetician</span>' +
            '</label>' +
          '</div>' +

          '<div class="dct-input-grid">' +
            '<div class="dct-field">' +
              '<label for="dct-author-input">Name or Nickname *</label>' +
              '<input type="text" id="dct-author-input" name="author_name" maxlength="80" placeholder="e.g., Sarah M. or GlowBeauty LLC" required />' +
            '</div>' +
            '<div class="dct-field">' +
              '<label for="dct-country-input">Country / Region</label>' +
              '<input type="text" id="dct-country-input" name="country" list="dct-country-list" maxlength="80" placeholder="e.g., United States, UAE, Singapore, UK..." />' +
              '<datalist id="dct-country-list">' +
                '<option value="United States"></option>' +
                '<option value="United Arab Emirates"></option>' +
                '<option value="Singapore"></option>' +
                '<option value="United Kingdom"></option>' +
                '<option value="Canada"></option>' +
                '<option value="Australia"></option>' +
                '<option value="Germany"></option>' +
                '<option value="Japan"></option>' +
                '<option value="Malaysia"></option>' +
                '<option value="Republic of Korea"></option>' +
              '</datalist>' +
            '</div>' +
          '</div>' +

          '<div style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;" aria-hidden="true">' +
            '<label for="dct-hp-website">Website</label>' +
            '<input type="text" id="dct-hp-website" name="website_url" tabindex="-1" autocomplete="off" />' +
          '</div>' +

          '<div class="dct-field">' +
            '<label for="dct-content-input">Review or Buyer Question *</label>' +
            '<textarea id="dct-content-input" name="content" maxlength="1500" placeholder="Share your experience with this Korean skincare product, or ask a question about bulk wholesale MOQ / retail shipping..." required></textarea>' +
          '</div>' +

          '<div class="dct-form-footer">' +
            '<span class="dct-form-note">🔒 Published immediately · Direct B2B quotes also available via WhatsApp (+82 10-2754-9616)</span>' +
            '<button type="submit" class="dct-submit-btn" id="dct-submit-btn">Post Review / Question →</button>' +
          '</div>' +
          '<div class="dct-status-msg" id="dct-status-msg" role="status"></div>' +
        '</form>' +

        '<div class="dct-comments-list" id="dct-comments-list">' +
          '<div class="dct-empty-state">Loading verified reviews &amp; questions...</div>' +
        '</div>' +
      '</div>';

    var starLabels = {
      1: '1.0 / 5 (Poor)',
      2: '2.0 / 5 (Fair)',
      3: '3.0 / 5 (Good)',
      4: '4.0 / 5 (Very Good)',
      5: '5.0 / 5 (Highly Recommended)'
    };

    var starBtns = container.querySelectorAll('.dct-star-btn');
    var starLabelEl = document.getElementById('dct-star-label');
    function updateStarUI(val) {
      selectedRating = val;
      for (var i = 0; i < starBtns.length; i++) {
        var s = parseInt(starBtns[i].getAttribute('data-star'), 10);
        if (s <= val) {
          starBtns[i].classList.add('active');
        } else {
          starBtns[i].classList.remove('active');
        }
      }
      if (starLabelEl) starLabelEl.textContent = starLabels[val] || '5.0 / 5';
    }

    for (var i = 0; i < starBtns.length; i++) {
      starBtns[i].addEventListener('click', function () {
        var val = parseInt(this.getAttribute('data-star'), 10) || 5;
        updateStarUI(val);
      });
    }

    var roleLabels = container.querySelectorAll('.dct-role-pill-label');
    for (var j = 0; j < roleLabels.length; j++) {
      roleLabels[j].addEventListener('click', function () {
        for (var k = 0; k < roleLabels.length; k++) {
          roleLabels[k].classList.remove('selected');
        }
        this.classList.add('selected');
        var radio = this.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    }

    var currentComments = [];

    function renderCommentsList() {
      var listEl = document.getElementById('dct-comments-list');
      var avgScoreEl = document.getElementById('dct-avg-score');
      var avgStarsEl = document.getElementById('dct-avg-stars');
      var totalEl = document.getElementById('dct-total-reviews');
      if (!listEl) return;

      if (!currentComments.length) {
        avgScoreEl.textContent = '5.0 ★';
        avgStarsEl.textContent = '★★★★★';
        totalEl.textContent = 'Be the first to review';
        listEl.innerHTML = '<div class="dct-empty-state">No reviews yet for this article. Be the first to share your thoughts or ask a question above!</div>';
        return;
      }

      var total = currentComments.length;
      var sum = 0;
      for (var idx = 0; idx < total; idx++) {
        sum += (parseInt(currentComments[idx].rating, 10) || 5);
      }
      var avg = (sum / total).toFixed(1);
      avgScoreEl.textContent = avg + ' ★';
      var rounded = Math.round(sum / total);
      var starsStr = '';
      for (var s = 0; s < 5; s++) starsStr += (s < rounded ? '★' : '☆');
      avgStarsEl.textContent = starsStr;
      totalEl.textContent = 'Based on ' + total + ' verified ' + (total === 1 ? 'entry' : 'entries');

      updateJsonLdReviews(postSlug, currentComments);

      listEl.innerHTML = currentComments.map(function (item) {
        var name = escapeHtml(item.author_name || 'Anonymous');
        var initial = escapeHtml(String(item.author_name || 'K').trim().charAt(0).toUpperCase() || 'K');
        var country = escapeHtml((item.country || '').trim());
        var roleMeta = getRoleBadgeMeta(item.buyer_type);
        var dateStr = escapeHtml(formatCommentDate(item.created_at));
        var contentHtml = escapeHtml(item.content || '');
        var idAttr = escapeHtml(item.id || '');

        return (
          '<div class="dct-comment-card" data-comment-id="' + idAttr + '">' +
            '<div class="dct-comment-head">' +
              '<div class="dct-author-block">' +
                '<span class="dct-avatar" aria-hidden="true">' + initial + '</span>' +
                '<span class="dct-author-name">' + name + '</span>' +
                (country ? '<span class="dct-country-badge">🌍 ' + country + '</span>' : '') +
                '<span class="dct-role-badge ' + roleMeta.cls + '">' + roleMeta.icon + ' ' + roleMeta.label + '</span>' +
              '</div>' +
              '<div class="dct-comment-right">' +
                renderStarsText(item.rating) +
                '<span class="dct-comment-date">' + dateStr + '</span>' +
                (adminActive && item.id
                  ? '<button type="button" class="dct-admin-del-btn" data-del-id="' + idAttr + '" title="관리자 권한으로 이 댓글 삭제">[🗑️ 삭제]</button>'
                  : '') +
              '</div>' +
            '</div>' +
            '<p class="dct-comment-body">' + contentHtml + '</p>' +
          '</div>'
        );
      }).join('');

      if (adminActive) {
        var delBtns = listEl.querySelectorAll('.dct-admin-del-btn');
        for (var b = 0; b < delBtns.length; b++) {
          delBtns[b].addEventListener('click', function () {
            var cid = this.getAttribute('data-del-id');
            if (!cid) return;
            var btn = this;
            btn.disabled = true;
            btn.textContent = '삭제 중...';
            deletePostCommentAdmin(cid, '9616')
              .then(function () {
                currentComments = currentComments.filter(function (c) { return String(c.id) !== String(cid); });
                renderCommentsList();
              })
              .catch(function (err) {
                btn.disabled = false;
                btn.textContent = '[🗑️ 삭제]';
                alert('댓글 삭제 중 오류가 발생했습니다: ' + (err && err.message ? err.message : 'Unknown error'));
              });
          });
        }
      }
    }

    function loadAndRender() {
      fetchPostComments(postSlug)
        .then(function (rows) {
          currentComments = Array.isArray(rows) ? rows : [];
          renderCommentsList();
        })
        .catch(function () {
          var listEl = document.getElementById('dct-comments-list');
          if (listEl) {
            listEl.innerHTML = '<div class="dct-empty-state">Unable to load community reviews right now. Please refresh to try again.</div>';
          }
        });
    }

    loadAndRender();

    var formEl = document.getElementById('dct-comment-form');
    var statusEl = document.getElementById('dct-status-msg');
    var submitBtn = document.getElementById('dct-submit-btn');

    function showStatus(msg, isError) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = 'dct-status-msg ' + (isError ? 'err' : 'ok');
    }

    if (formEl) {
      formEl.addEventListener('submit', function (e) {
        e.preventDefault();
        var hp = document.getElementById('dct-hp-website');
        if (hp && hp.value) {
          showStatus('✅ Thank you! Your review has been submitted.', false);
          formEl.reset();
          return;
        }

        try {
          var lastPostTs = parseInt(sessionStorage.getItem('dct_last_comment_ts') || '0', 10);
          if (lastPostTs && (Date.now() - lastPostTs) < 15000) {
            showStatus('⏳ Please wait a few seconds before posting another comment.', true);
            return;
          }
        } catch (err) {}

        var authorInput = document.getElementById('dct-author-input');
        var countryInput = document.getElementById('dct-country-input');
        var contentInput = document.getElementById('dct-content-input');
        var checkedRole = container.querySelector('input[name="buyer_type"]:checked');

        var authorName = (authorInput ? authorInput.value : '').trim();
        var countryVal = (countryInput ? countryInput.value : '').trim();
        var contentVal = (contentInput ? contentInput.value : '').trim();
        var buyerTypeVal = checkedRole ? checkedRole.value : 'Retail Customer';

        if (!authorName) {
          showStatus('⚠️ Please enter your name or nickname.', true);
          if (authorInput) authorInput.focus();
          return;
        }
        if (contentVal.length < 2) {
          showStatus('⚠️ Please write a review or question (at least 2 characters).', true);
          if (contentInput) contentInput.focus();
          return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';
        if (statusEl) statusEl.className = 'dct-status-msg';

        insertPostComment({
          post_slug: postSlug,
          author_name: authorName.slice(0, 80),
          country: countryVal.slice(0, 80),
          buyer_type: buyerTypeVal,
          rating: selectedRating,
          content: contentVal.slice(0, 1500)
        })
          .then(function (insertedRows) {
            try {
              sessionStorage.setItem('dct_last_comment_ts', String(Date.now()));
            } catch (err) {}

            var newRow = (Array.isArray(insertedRows) && insertedRows[0]) ? insertedRows[0] : {
              id: '',
              post_slug: postSlug,
              author_name: authorName,
              country: countryVal,
              buyer_type: buyerTypeVal,
              rating: selectedRating,
              content: contentVal,
              created_at: new Date().toISOString()
            };
            currentComments.unshift(newRow);
            renderCommentsList();

            hitKey('comments__' + shortSlug(postSlug));
            hitKey('comments__all_blog');

            if (contentInput) contentInput.value = '';
            updateStarUI(5);
            showStatus('✅ Thank you! Your review / question is now live below.', false);
          })
          .catch(function () {
            showStatus('❌ Could not post your comment right now. Please check your connection and try again.', true);
          })
          .finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post Review / Question →';
          });
      });
    }
  }

  function init() {
    var params;
    try {
      params = new URLSearchParams(window.location.search || '');
    } catch (e) {
      params = { get: function () { return null; } };
    }

    var info = detectPageInfo();

    function onDomReady() {
      applyAmazonAssociateLinks();
      mountBlogComments(info, params);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onDomReady);
    } else {
      onDomReady();
    }

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
    getKey: getKey,
    mountBlogComments: mountBlogComments
  };

  init();
})();
