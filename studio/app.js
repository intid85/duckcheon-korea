/* =========================================================================
   통합 AI 블로그 스튜디오 & 워드프레스형 비주얼 에디터 (v2.6 Multi-Niche)
   ========================================================================= */

const DEFAULT_NICHES = {
  travel: {
    id: 'travel',
    name: '여행 · 코스 · 맛집',
    icon: '✈️',
    title: '여행 블로그 (국내·해외 여행 / 코스·맛집·명소)',
    desc: '생생한 현장감과 동선·비용·꿀팁 요약표가 포함된 고품질 여행 포스팅을 자동 구성하거나 워드프레스처럼 직접 작성합니다.',
    constraint: '📌 공공누리·무료 상업용 사진 출처 및 여행 준비물 쇼핑커넥트 문단 자동 지원',
    lang: 'ko',
    tones: [
      { value: 'friendly', label: '친근한 네이버 이웃 사람톤 (~했어요 / 다녀온 솔직 후기)' },
      { value: 'guide', label: '깔끔한 여행 가이드북 톤 (~합니다 / 핵심 코스 정리)' },
      { value: 'emotional', label: '감성 브런치·매거진 에세이 톤' }
    ],
    presets: [
      { label: '🏝️ 제주 성산일출봉 & 섭지코지 1박2일', topic: '제주 성산일출봉 & 섭지코지 1박 2일 여행 코스 및 근처 맛집·준비물', memo: '성산일출봉 무료/유료 코스 비교, 광치기해변 포토존, 섭지코지 산책로, 아침 해장국 & 흑돼지 코스, 편한 운동화/바람막이 준비물' },
      { label: '🌊 강릉 안목해변 카페거리 & 경포대 당일치기', topic: '강릉 KTX 뚜벅이 당일치기 코스 (안목해변 카페거리·경포호·중앙시장)', memo: '서울역 KTX 동선, 순두부젤라또, 경포호 자전거 대여, 강릉 중앙시장 먹거리 리스트' },
      { label: '🏯 교토 3박 4일 자유여행 핵심 동선', topic: '일본 교토 3박 4일 자유여행 코스 (청수사·아라시야마·후시미이나리 오전 오픈런)', memo: '교토 버스 1일권 변경사항, 오전 7시 오픈런 팁, 편한 트레킹화 및 보조배터리 필수' },
      { label: '🌸 울산 중구 원도심 & 태화강 국가정원 산책', topic: '울산 중구 원도심 골목 산책 & 태화강 국가정원 십리대숲 반나절 코스', memo: '울산 큰애기야시장, 태화강 국가정원 은하수길 야경, 주차장 꿀팁' }
    ],
    photos: [
      'https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  kbeauty: {
    id: 'kbeauty',
    name: 'K-뷰티 영문 · 유망 중소 발굴 (dctrade.co.kr)',
    icon: '💄',
    title: 'K-Beauty Global Magazine & Korean Indie/SME Hidden Gems (dctrade.co.kr)',
    desc: '화해(Hwahae)·올리브영에서 검증된 한국 강소·인디 K-뷰티 아이템의 혁신 성분과 제형을 글로벌 바이어·소비자에게 영문으로 소개하고 DUCKCHEON KOREA 소싱 문의로 연결합니다.',
    constraint: '✅ 한국 강소·인디 K-뷰티 발굴 프리셋 탑재 · 모자이크 없는 선명한 무지(Unbranded) 제형 사진 · 하단 DUCKCHEON KOREA 공식 소싱 카드',
    lang: 'en',
    tones: [
      { value: 'editorial', label: 'Global K-Beauty & Indie Discovery Editorial (Allure / Vogue Style English)' },
      { value: 'derma', label: 'Korean SME Lab & Ingredient Breakdown (Clinical & Clear English)' },
      { value: 'routine', label: 'Friendly K-Skincare Routine Guide (Warm Step-by-Step English)' }
    ],
    presets: [
      { label: '🇰🇷 한국 강소·인디 K-뷰티 숨은 명품 5선 (Hwahae & Olive Young Indie Picks)', topic: 'Korea’s Rising Indie & SME K-Beauty Hidden Gems: 2026 Hwahae & Olive Young Trending Formulations', memo: 'Spotlight Heartleaf calming toner pads, fermented rice brightening serum, weightless vegan sun serum, and peel-off bio-collagen wrapping mask from agile Korean SME labs' },
      { label: '🌿 어성초·시카 진정 토너패드 & 국내 중소 더마 코스메틱 제형 집중 분석', topic: 'Heartleaf (Houttuynia Cordata) & Cica Calming Toner Pads: Why Korean Indie Derma Labs Lead Sensitive Skin Care', memo: 'Dual-textured embossed organic cotton pads, sub-acidic pH 5.5 calming essence, 3-minute quick cooling toner pack routine' },
      { label: '✨ 쌀 발효(Rice Ferment) & 비건 선세럼: 해외에서 뜨는 한국 인디 스킨케어', topic: 'Fermented Rice Bran & Weightless Vegan Sun Serums: The Next Wave of Korean Indie Glass-Skin Essentials', memo: 'Modern Hanbang fermentation with niacinamide + zero white-cast SPF50+ PA++++ probiotic sun essence texture' },
      { label: '💧 콜라겐 랩핑 마스크 & 하이드로겔 팩: 한국 강소 제조사 신제형 트렌드', topic: 'Peel-Off Bio-Collagen Wrapping Masks & Melting Hydrogel Sheets: Texture Innovation from Korean Cosmetics Labs', memo: 'Overnight elasticity film formation, 300-Dalton low-molecular collagen absorption, instant glass-skin luminosity' },
      { label: '🧬 PDRN·엑소좀·스피큘 홈케어 앰플: 한국 클리닉 더마 라인업 소개', topic: 'Why Korean PDRN, Cica Exosome & Micro-Spicule Booster Ampoules Are Redefining Home-Clinic Skincare in 2026', memo: 'Focus on lightweight hydrogel texture, soothing redness, layering with ceramide barrier cream, clinical active delivery' }
    ],
    photos: [
      'https://dctrade.co.kr/assets/indie-toner-pads.jpg?v=2',
      'https://dctrade.co.kr/assets/indie-rice-serum.jpg?v=2',
      'https://dctrade.co.kr/assets/indie-sun-serum.jpg?v=2',
      'https://dctrade.co.kr/assets/indie-collagen-mask.jpg?v=2',
      'https://dctrade.co.kr/assets/ampoule-cica.jpg?v=2',
      'https://dctrade.co.kr/assets/hydrogel-cream.jpg?v=2',
      'https://dctrade.co.kr/assets/skincare.jpg?v=2'
    ]
  },
  shopping: {
    id: 'shopping',
    name: '쇼핑커넥트 · 실사용 리뷰',
    icon: '🛍️',
    title: '쇼핑커넥트 · 가전/생활용품 클린 비교 리뷰',
    desc: '과장 광고 금칙어를 배제하고 스펙 비교표·장단점·실사용 체감 포인트를 정리해 전환율 높은 리뷰 글을 완성합니다.',
    constraint: '🛡️ 클린 리뷰 필터: 과장 금칙어 배제 + 공정위 파트너스/쇼핑커넥트 수수료 문구 자동 지원',
    lang: 'ko',
    tones: [
      { value: 'honest', label: '내돈내산·실사용 꼼꼼 비교 톤 (~써보니 / 장단점 중심)' },
      { value: 'spec', label: '스펙·가성비 분석 전문가 톤 (~비교해보겠습니다)' }
    ],
    presets: [
      { label: '🧳 기내용 20인치 폴리카보네이트 캐리어 비교', topic: '20인치 기내용 캐리어 고르는 법 & 확장형 저소음 바퀴 실사용 비교', memo: 'HINOMOTO 휠 소음 차이, 프론트 오픈 포켓 유무, 무게 2.8kg 이하 체크포인트' },
      { label: '🔋 기내반입 20000mAh PD 고속충전 보조배터리', topic: '해외여행 기내반입 가능한 20000mAh C타입 고속 보조배터리 선택 기준', memo: 'Wh 표기 확인법, 노트북+스마트폰 동시 충전 출력(65W), 일체형 케이블 편의성' },
      { label: '👟 장시간 걷기 편한 여행용 워킹화 추천 포인트', topic: '하루 2만 보 걷는 여행용 쿠셔닝 운동화 선택 가이드 & 착화감 비교', memo: '발볼 넓이, 미드솔 복원력, 비 오는 날 미끄럼 방지 아웃솔 체크' }
    ],
    photos: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  custom: {
    id: 'custom',
    name: '자유 주제 (워드프레스 직필)',
    icon: '✍️',
    title: '자유 주제 & 워드프레스 스타일 직접 글쓰기',
    desc: '맛집, 캠핑, IT, 재테크 등 어떤 주제든 제한 없이 AI 초안을 뽑거나 워드프레스 서식 툴바로 바로 작성해 발행합니다.',
    constraint: '💡 GitHub 블로그는 네이버 저품질·금칙어 검열 없이 자유로운 주제와 외부 링크 배치가 가능합니다.',
    lang: 'ko',
    tones: [
      { value: 'friendly', label: '친근하고 읽기 편한 블로그 이웃 톤' },
      { value: 'guide', label: '전문적이고 체계적인 정보 정리 톤' },
      { value: 'magazine', label: '깔끔한 칼럼·에디토리얼 톤' }
    ],
    presets: [
      { label: '⛺ 주말 근교 감성 오토캠핑 준비 리스트', topic: '초보 캠퍼를 위한 봄·가을 1박 2일 오토캠핑 필수 장비 & 먹거리 체크리스트', memo: '텐트 타프 세팅 순서, 실패 없는 캠핑 밀키트 3가지, 매너타임 꿀팁' },
      { label: '💻 2026 개인 블로그 GitHub Pages 수익화 가이드', topic: '네이버 저품질 걱정 없는 나만의 GitHub 블로그 만들기 & 구글 SEO 글쓰기 전략', memo: '워드프레스처럼 쉽게 글 올리는 방법, 구글 서치콘솔 색인, 애드센스 및 제휴 링크 활용' }
    ],
    photos: [
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80'
    ]
  }
};

let allNiches = { ...DEFAULT_NICHES };
let activeNicheId = 'travel';
let currentPost = {
  nicheId: 'travel',
  topic: '',
  selectedTitle: '',
  titles: [],
  slug: '',
  tags: [],
  sections: [],
  photos: []
};
let pendingPhotoUploadIdx = null;

function initStudio() {
  loadSavedCustomNiches();
  loadSettingsToUI();
  renderNicheTabs();
  selectNiche('travel', false);
  updateDraftCountBadge();

  // Preload initial rich sample post so the dashboard looks immediately alive
  const samplePreset = DEFAULT_NICHES.travel.presets[0];
  document.getElementById('topicInput').value = samplePreset.topic;
  document.getElementById('memoInput').value = samplePreset.memo;
  generateInstantPost(samplePreset.topic, samplePreset.memo, 5);
}

function loadSavedCustomNiches() {
  try {
    const raw = localStorage.getItem('studio_custom_niches');
    if (raw) {
      const parsed = JSON.parse(raw);
      allNiches = { ...DEFAULT_NICHES, ...parsed };
    }
  } catch (e) {
    console.warn(e);
  }
}

function renderNicheTabs() {
  const wrap = document.getElementById('nicheTabsContainer');
  if (!wrap) return;
  const tabsHtml = Object.values(allNiches).map(n => `
    <button type="button" class="niche-tab ${n.id === activeNicheId ? 'active' : ''}" onclick="selectNiche('${n.id}', true)">
      <span>${n.icon}</span> <span>${n.name}</span>
    </button>
  `).join('');
  wrap.innerHTML = tabsHtml + `
    <button type="button" class="niche-tab add-tab" onclick="openModal('customNicheModal')">
      ➕ 새 분야 탭 추가
    </button>
  `;
}

function selectNiche(nicheId, loadSample = true) {
  if (!allNiches[nicheId]) nicheId = 'travel';
  activeNicheId = nicheId;
  const n = allNiches[nicheId];
  renderNicheTabs();

  document.getElementById('activeNicheIcon').textContent = n.icon;
  document.getElementById('activeNicheTitle').textContent = n.title;
  document.getElementById('activeNicheDesc').textContent = n.desc;

  const badge = document.getElementById('nicheConstraintBadge');
  if (n.constraint) {
    badge.style.display = 'block';
    badge.textContent = n.constraint;
  } else {
    badge.style.display = 'none';
  }

  // Render tone options
  const toneSel = document.getElementById('toneSelect');
  toneSel.innerHTML = (n.tones || DEFAULT_NICHES.travel.tones)
    .map(t => `<option value="${t.value}">${t.label}</option>`).join('');

  // Toggle niche option panels
  document.getElementById('travelOptionsGroup').style.display = nicheId === 'travel' ? 'block' : 'none';
  document.getElementById('kbeautyOptionsGroup').style.display = nicheId === 'kbeauty' ? 'block' : 'none';
  document.getElementById('shoppingOptionsGroup').style.display = nicheId === 'shopping' ? 'block' : 'none';
  document.getElementById('customOptionsGroup').style.display = (!['travel', 'kbeauty', 'shopping'].includes(nicheId)) ? 'block' : 'none';

  // Render presets
  const chipWrap = document.getElementById('presetChipsContainer');
  chipWrap.innerHTML = (n.presets || []).map((p, idx) => `
    <button type="button" class="preset-chip" onclick="applyPreset(${idx})">${p.label}</button>
  `).join('');

  if (loadSample && n.presets && n.presets[0]) {
    applyPreset(0);
  }
}

function applyPreset(idx) {
  const n = allNiches[activeNicheId];
  if (!n || !n.presets || !n.presets[idx]) return;
  const p = n.presets[idx];
  document.getElementById('topicInput').value = p.topic;
  document.getElementById('memoInput').value = p.memo || '';
  generateInstantPost(p.topic, p.memo || '', parseInt(document.getElementById('photoCountSelect').value || '5', 10));
  showToast(`⚡ '${p.label}' 초안과 사진이 에디터에 로드되었습니다!`);
}

function makeSlug(text) {
  const ascii = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
  const today = new Date().toISOString().slice(0, 10);
  if (ascii.length >= 6) return `${ascii.slice(0, 48)}-${today}`;
  return `${activeNicheId}-post-${today}-${Math.floor(100 + Math.random() * 899)}`;
}

function buildTitlesForTopic(topic, isEnglish) {
  const clean = topic.trim() || '제주 성산일출봉 1박 2일 여행 코스';
  if (isEnglish) {
    return [
      `${clean}: The Complete 2026 K-Beauty Routine & Ingredient Guide`,
      `Inside Korean Skincare Science: How ${clean.slice(0, 42)} Transforms Skin Texture`,
      `Dermatologist-Inspired K-Beauty: Why ${clean.slice(0, 38)} Is Trending Globally`,
      `Glass Skin Without Irritation: Step-by-Step Layering Guide for ${clean.slice(0, 35)}`,
      `2026 K-Beauty Formulation Spotlight: Texture, Key Actives & Daily Application Tips`
    ];
  }
  return [
    `${clean} 총정리 (실제 동선·소요시간·실패 없는 꿀팁 비교표)`,
    `직접 다녀와 본 ${clean}, 초보자도 한눈에 보는 핵심 체크리스트 5가지`,
    `2026 최신판 | ${clean} 추천 코스부터 준비물·예산까지 한 번에 정리`,
    `현지인도 아끼는 ${clean} 알짜배기 포인트 & 사진 잘 나오는 시간대`,
    `후회 없는 선택! ${clean} 방문 전 꼭 알아두면 좋은 장단점 솔직 정리`
  ];
}

function generateInstantPost(topic, memo, photoCount = 5) {
  const n = allNiches[activeNicheId] || DEFAULT_NICHES.travel;
  const isEn = n.lang === 'en' || (activeNicheId === 'custom' && document.getElementById('customLangSelect')?.value === 'en');
  const titles = buildTitlesForTopic(topic, isEn);
  const pool = n.photos || DEFAULT_NICHES.travel.photos;

  const photos = [];
  for (let i = 0; i < photoCount; i++) {
    const url = pool[i % pool.length];
    photos.push({
      id: `photo-${i + 1}`,
      url,
      caption: isEn
        ? `Figure ${i + 1}. Clean unbranded K-Beauty texture & skincare application visual (${topic.slice(0, 36)})`
        : `사진 ${i + 1}. ${topic.slice(0, 28)} 현장 분위기 및 핵심 체크 포인트`,
      prompt: isEn
        ? `Editorial macro skincare photography, unbranded glass dropper and hydrogel cream texture on clean stone surface, natural morning sunlight, crystal clear sharp focus, no mosaic, no blur, no text, no logo, 8k`
        : `Realistic Korean travel & lifestyle photography of ${topic}, bright natural daylight, candid angle, clean composition, crystal clear sharp focus, no mosaic, no blur, no text overlay, high detail`
    });
  }

  let sections = [];
  if (isEn) {
    sections = [
      {
        heading: `1. Why Korea’s Agile Indie & SME Skincare Labs Lead Global Innovation in 2026`,
        html: `<p>Today’s biggest K-Beauty breakthroughs are born in <strong>South Korea’s agile SME and indie cosmetic laboratories</strong>—brands that top local consumer rankings on Hwahae and Olive Young before going viral worldwide. Focusing on <em>${topic}</em>, Korean indie formulators combine high-purity clinical actives, clean vegan botanical extracts, and sensorial textures that absorb weightlessly into the skin.</p>
               <blockquote>"What sets Korean indie and SME skincare apart is speed-to-innovation and clinical transparency—pairing traditional Korean botanicals like Heartleaf and Fermented Rice with next-generation bio-actives."</blockquote>`
      },
      {
        heading: `2. Trending Korean Indie Categories, Key Actives & Texture Comparison`,
        html: `<p>Here is how Korea’s top-rated indie formulations compare across active ingredients, texture, and daily skin benefits:</p>
               <table>
                 <thead><tr><th>K-Beauty Indie Category</th><th>Key Korean Active Ingredients</th><th>Texture & Skin Feel</th><th>Why Korean Consumers Love It</th></tr></thead>
                 <tbody>
                   <tr><td><strong>Heartleaf & Cica Toner Pads</strong></td><td>Houttuynia Cordata, Madecassoside, Panthenol</td><td>Dual-sided embossed cotton soaked in watery essence</td><td>Doubles as a gentle daily wipe and a 3-minute cooling sheet mask</td></tr>
                   <tr><td><strong>Fermented Rice Glow Serum</strong></td><td> Yeoju/Icheon Rice Bran Ferment, Niacinamide, Probiotics</td><td>Milky, non-sticky essence drop</td><td>Brightens dull tone and creates dewy glass-skin luminosity</td></tr>
                   <tr><td><strong>Vegan Probiotic Sun Serum</strong></td><td>Rice Extract, Bio-Ferments, Broad-Spectrum UV Filters</td><td>Weightless hydrating lotion-serum</td><td>Zero white cast, zero eye-sting, layers smoothly under makeup</td></tr>
                   <tr><td><strong>Bio-Collagen Wrapping Mask</strong></td><td>300-Dalton Low-Molecular Collagen, Peptides, PDRN</td><td>Glossy peel-off hydrogel film</td><td>Locks in overnight moisture and visibly plumps fine lines by morning</td></tr>
                 </tbody>
               </table>
               <p>${memo ? `<strong>Formulation & Curation Note:</strong> ${memo}` : ''}</p>`
      },
      {
        heading: `3. Step-by-Step Daily Glass-Skin Layering Routine`,
        html: `<p>Start by placing two chilled Heartleaf calming toner pads onto the cheeks for 3 minutes to lower skin temperature. Follow with 2–3 drops of fermented rice or PDRN ampoule pressed gently into damp skin. In the morning, finish with two finger-lengths of weightless vegan sun serum; at night, seal in your actives with a ceramide barrier cream or an overnight bio-collagen wrapping mask.</p>`
      }
    ];
    if (document.getElementById('optKbeautyCtaCard')?.checked !== false) {
      sections.push({
        heading: `4. Source Authentic Korean SME & Indie K-Beauty with DUCKCHEON KOREA`,
        html: `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px 18px;">
                 <p style="margin-bottom:6px;"><strong>🏢 DUCKCHEON KOREA | Official Korean SME & Indie K-Beauty Sourcing Partner</strong></p>
                 <p style="margin-bottom:8px;">Looking to discover and source authentic, high-performing Korean SME and Indie skincare brands directly from South Korea? DUCKCHEON KOREA curates verified trending K-Beauty lines for global retailers, distributors, and partners.</p>
                 <p style="margin:0;">🌐 Official Website: <a href="https://dctrade.co.kr" target="_blank" rel="noopener"><strong>https://dctrade.co.kr</strong></a> &nbsp;|&nbsp; 💬 WeChat ID: <strong>intid85</strong> &nbsp;|&nbsp; 📱 WhatsApp: <a href="https://wa.me/821027549616" target="_blank" rel="noopener"><strong>+82 10-2754-9616</strong></a></p>
               </div>`
      });
    }
  } else {
    const memoLine = memo ? `<p><strong>📌 핵심 체크 메모:</strong> ${memo}</p>` : '';
    sections = [
      {
        heading: `1. ${topic} 한눈에 보는 핵심 요약 & 방문 이유`,
        html: `<p>요즘 계절에 딱 다녀오기 좋은 <strong>${topic}</strong> 코스를 정리해 보았습니다. 막상 출발하려고 하면 주차장 위치부터 소요 시간, 그리고 함께 들르기 좋은 주변 코스까지 은근히 챙겨야 할 디테일이 많은데요. 직접 확인한 알짜 동선과 실전 팁을 보기 쉽게 정리했습니다.</p>
               ${memoLine}
               <blockquote>💡 <strong>오늘 글 핵심 요약:</strong> 오전 혼잡 시간대를 피하는 오픈런 타이밍 + 실패 없는 준비물 체크리스트까지 한 번에 확인하세요!</blockquote>`
      },
      {
        heading: `2. 시간대별 추천 코스 & 핵심 비교표`,
        html: `<p>초행길이라도 헤매지 않고 바로 따라갈 수 있도록 핵심 구간별 특징과 예상 소요시간을 표로 정리했습니다.</p>
               <table>
                 <thead><tr><th>구간 / 체크포인트</th><th>추천 시간대 & 소요시간</th><th>실전 꿀팁 & 주의사항</th></tr></thead>
                 <tbody>
                   <tr><td><strong>1코스 · 메인 포인트</strong></td><td>오전 09:00~11:00 (약 1시간 30분)</td><td>오전 빛이 가장 예쁘고 주차 여유가 넉넉함</td></tr>
                   <tr><td><strong>2코스 · 점심 & 카페 휴식</strong></td><td>11:30~13:30 (약 2시간)</td><td>웨이팅 피하려면 11시 30분 이전 입장 추천</td></tr>
                   <tr><td><strong>3코스 · 산책 & 포토존</strong></td><td>14:00~16:30 (약 2시간)</td><td>바닷바람·일교차 대비 가벼운 겉옷과 편한 신발 필수</td></tr>
                 </tbody>
               </table>`
      },
      {
        heading: `3. 현장 분위기 & 실패 없는 방문 팁`,
        html: `<p>특히 사진이 잘 나오는 포인트는 입구에서 도보 10분 정도 들어간 전망 구간입니다. 주말에는 오후 1시 이후 차량이 몰릴 수 있으니 가급적 오전 일찍 이동하시는 걸 추천해요. 가족 단위나 부모님과 함께 가더라도 경사가 완만한 우회 산책로를 선택하면 부담 없이 둘러볼 수 있습니다.</p>`
      }
    ];

    if (activeNicheId === 'travel' && document.getElementById('optTravelShoppingConnect')?.checked !== false) {
      sections.push({
        heading: `4. 🎒 떠나기 전 챙기면 발이 편해지는 실전 준비물`,
        html: `<p>이번 코스처럼 하루 1만 보 이상 걷거나 바람이 부는 야외 일정에는 <strong>가벼운 방풍 바람막이, 쿠셔닝 좋은 워킹화, 그리고 대용량 PD 고속충전 보조배터리</strong>를 미리 챙기시면 여행 피로도가 확 줄어듭니다.</p>
               <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:10px;padding:12px 15px;">
                 <p style="margin:0;font-size:13.5px;">👉 <strong>여행자 많이 찾는 경량 캐리어·보조배터리·트레킹 준비물 모아보기:</strong> <a href="https://shopping.naver.com" target="_blank" rel="noopener">네이버 쇼핑 인기 여행 준비물 확인하기</a></p>
               </div>`
      });
    }
    if (activeNicheId === 'travel' && document.getElementById('optTravelPhotoLicense')?.checked !== false) {
      sections.push({
        heading: `5. 📸 사진 출처 및 이용 안내`,
        html: `<p style="font-size:12.5px;color:#64748b;">※ 본 포스팅에 포함된 이미지는 직접 촬영 사진, 무료 상업용 스톡(Unsplash License), 또는 한국관광공사 포토코리아(공공누리 제1유형) 가이드라인을 준수하여 활용되었습니다.</p>`
      });
    }
    if (activeNicheId === 'shopping' && document.getElementById('optShoppingDisclosure')?.checked !== false) {
      const linkVal = document.getElementById('shoppingLinkInput')?.value?.trim() || 'https://shopping.naver.com';
      sections.push({
        heading: `4. 상세 스펙 확인 및 안내`,
        html: `<p><a href="${linkVal}" target="_blank" rel="noopener" style="display:inline-block;background:#059669;color:#fff;padding:9px 16px;border-radius:8px;text-decoration:none;font-weight:700;">👉 실시간 상세 스펙 및 사용 후기 보러가기</a></p>
               <p style="font-size:12px;color:#64748b;">※ 이 포스팅은 네이버 쇼핑커넥트 / 제휴 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.</p>`
      });
    }
  }

  currentPost = {
    nicheId: activeNicheId,
    topic,
    selectedTitle: titles[0],
    titles,
    slug: makeSlug(titles[0]),
    tags: isEn ? ['#KBeauty', '#KoreanSkincare', '#SkinBarrier', '#Cosmetics'] : ['#여행코스', '#국내여행', '#주말가볼만한곳', '#꿀팁정리'],
    sections,
    photos
  };

  renderPostToEditor();
}

async function handleGeneratePost() {
  const topic = document.getElementById('topicInput').value.trim() || '제주 성산일출봉 & 섭지코지 1박 2일 코스';
  const memo = document.getElementById('memoInput').value.trim();
  const photoCount = parseInt(document.getElementById('photoCountSelect').value || '5', 10);
  const mode = document.getElementById('genModeSelect').value;
  const apiKey = localStorage.getItem('studio_deepseek_key') || '';

  if ((mode === 'deepseek' || (mode === 'auto' && apiKey)) && apiKey) {
    const btn = document.getElementById('generatePostBtn');
    const orig = btn.innerHTML;
    btn.innerHTML = '⏳ DeepSeek AI가 원고와 제목 5개를 작성 중입니다...';
    btn.disabled = true;
    try {
      generateInstantPost(topic, memo, photoCount);
      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are an expert blog editor. Return clean HTML paragraphs and headings.' },
            { role: 'user', content: `Write an engaging blog post section about: ${topic}. Additional notes: ${memo}` }
          ],
          temperature: 0.7
        })
      });
      if (res.ok) {
        const data = await res.json();
        const aiText = data.choices?.[0]?.message?.content;
        if (aiText) {
          currentPost.sections[0].html = `<div>${aiText.replace(/\n\n/g, '</p><p>')}</div>`;
          renderPostToEditor();
        }
      }
      showToast('✨ DeepSeek AI 블로그 원고 생성이 완료되었습니다!');
    } catch (e) {
      console.warn(e);
      showToast('⚡ 즉시 초안 엔진으로 원고와 사진을 완성했습니다.');
    } finally {
      btn.innerHTML = orig;
      btn.disabled = false;
    }
  } else {
    generateInstantPost(topic, memo, photoCount);
    showToast('✨ 블로그 글 + 추천 제목 5선 + 고화질 사진 배치가 완료되었습니다!');
  }
}

function renderPostToEditor() {
  // Titles
  const titlesWrap = document.getElementById('recommendedTitlesList');
  titlesWrap.innerHTML = currentPost.titles.map((t, idx) => `
    <div class="title-option-item ${t === currentPost.selectedTitle ? 'selected' : ''}" onclick="selectRecommendedTitle(${idx})">
      <div><span class="title-num">추천 ${idx + 1}</span> ${t}</div>
      <span style="font-size:11.5px;font-weight:700;">클릭하여 적용</span>
    </div>
  `).join('');

  document.getElementById('activePostTitleInput').value = currentPost.selectedTitle;
  document.getElementById('activePostSlugInput').value = currentPost.slug;
  document.getElementById('pmCountText').textContent = currentPost.photos.length;
  document.getElementById('activeTagsPreview').innerHTML = currentPost.tags.map(tag => `<span class="tag-chip">${tag}</span>`).join('');

  // Interleave sections & photos inside WordPress visual editor canvas
  const canvas = document.getElementById('blogEditorCanvas');
  let htmlParts = [];
  const maxLen = Math.max(currentPost.sections.length, currentPost.photos.length);

  for (let i = 0; i < maxLen; i++) {
    if (i < currentPost.photos.length) {
      const p = currentPost.photos[i];
      htmlParts.push(`
        <div class="editor-photo-card" data-photo-idx="${i}" contenteditable="false">
          <div class="photo-preview-wrap">
            <img src="${p.url}" alt="${p.caption.replace(/"/g, '&quot;')}" id="editorPhotoImg_${i}" />
            <span class="photo-badge-overlay">📸 사진 #${i + 1} (무료 상업용 / 무지 에셋)</span>
          </div>
          <div class="photo-card-controls">
            <input type="text" class="photo-caption-input" value="${p.caption.replace(/"/g, '&quot;')}" oninput="updatePhotoCaption(${i}, this.value)" placeholder="사진 설명(캡션/ALT 태그)을 입력하세요" />
            <div class="photo-btn-row">
              <span class="prompt-pill" title="${p.prompt.replace(/"/g, '&quot;')}">🎨 프롬프트: ${p.prompt}</span>
              <div style="display:flex;gap:5px;flex-wrap:wrap;">
                <button type="button" class="mini-btn" onclick="cycleSingleStockPhoto(${i})">🔄 다른 무료 사진</button>
                <button type="button" class="mini-btn" onclick="triggerLocalPhotoUpload(${i})">📂 내 사진 넣기</button>
                <button type="button" class="mini-btn accent" onclick="generateSingleFalImage(${i})">✨ fal AI 생성</button>
                <button type="button" class="mini-btn" onclick="copyPhotoPrompt(${i})">📋 프롬프트 복사</button>
              </div>
            </div>
          </div>
        </div>
      `);
    }
    if (i < currentPost.sections.length) {
      const s = currentPost.sections[i];
      htmlParts.push(`
        <div class="editable-block" contenteditable="true" oninput="updateCharCounter()">
          <h2>${s.heading}</h2>
          ${s.html}
        </div>
      `);
    }
  }

  canvas.innerHTML = htmlParts.join('\n');
  updateCharCounter();
}

/* WordPress-style Toolbar Formatting Actions */
function wpFormat(action) {
  const canvas = document.getElementById('blogEditorCanvas');
  if (!canvas) return;

  if (action === 'bold') {
    document.execCommand('bold', false, null);
    return;
  }
  if (action === 'underline') {
    document.execCommand('underline', false, null);
    return;
  }
  if (action === 'highlight') {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      document.execCommand('hiliteColor', false, '#fef08a');
    } else {
      appendBlockToEditor(`<p><span style="background:#fef08a;padding:2px 6px;border-radius:4px;font-weight:700;">💡 여기에 형광펜 강조 문구를 입력하세요.</span></p>`);
    }
    return;
  }
  if (action === 'h2') {
    appendBlockToEditor(`<h2>새 소제목 (클릭하여 수정하세요)</h2><p>여기에 본문 내용을 자유롭게 작성하세요.</p>`);
  } else if (action === 'h3') {
    appendBlockToEditor(`<h3>보조 소제목 포인트</h3><p>세부 설명을 여기에 입력하세요.</p>`);
  } else if (action === 'quote') {
    appendBlockToEditor(`<blockquote>💬 핵심 요약이나 강조하고 싶은 인용구를 여기에 작성하세요.</blockquote>`);
  } else if (action === 'hr') {
    appendBlockToEditor(`<hr style="border:none;border-top:2px dashed #cbd5e1;margin:20px 0;" />`);
  } else if (action === 'table') {
    appendBlockToEditor(`
      <table>
        <thead><tr><th>항목</th><th>핵심 내용</th><th>비고 / 추천 포인트</th></tr></thead>
        <tbody>
          <tr><td>구분 1</td><td>주요 특징을 입력하세요</td><td>추천</td></tr>
          <tr><td>구분 2</td><td>비교 내용을 입력하세요</td><td>참고</td></tr>
        </tbody>
      </table>
    `);
  } else if (action === 'uploadPhoto') {
    currentPost.photos.push({
      id: `photo-${currentPost.photos.length + 1}`,
      url: (allNiches[activeNicheId]?.photos || DEFAULT_NICHES.travel.photos)[0],
      caption: '내 컴퓨터에서 업로드한 사진 설명',
      prompt: 'Custom uploaded photo'
    });
    renderPostToEditor();
    triggerLocalPhotoUpload(currentPost.photos.length - 1);
  } else if (action === 'aiPhoto') {
    const pool = allNiches[activeNicheId]?.photos || DEFAULT_NICHES.travel.photos;
    const nextUrl = pool[currentPost.photos.length % pool.length];
    currentPost.photos.push({
      id: `photo-${currentPost.photos.length + 1}`,
      url: nextUrl,
      caption: `추가 사진 #${currentPost.photos.length + 1}. 설명을 입력하세요`,
      prompt: `High quality editorial blog photo for ${currentPost.topic || 'travel & lifestyle'}, natural lighting`
    });
    renderPostToEditor();
    showToast('🖼️ 새 사진 블록이 본문에 추가되었습니다!');
  } else if (action === 'link') {
    const url = prompt('삽입할 링크 주소(URL)를 입력하세요:', 'https://dctrade.co.kr');
    if (!url) return;
    const label = prompt('버튼 또는 링크에 표시할 텍스트를 입력하세요:', '👉 공식 홈페이지 자세히 보기') || url;
    appendBlockToEditor(`<p><a href="${url}" target="_blank" rel="noopener" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700;">${label}</a></p>`);
  }
}

function appendBlockToEditor(htmlSnippet) {
  const canvas = document.getElementById('blogEditorCanvas');
  const div = document.createElement('div');
  div.className = 'editable-block';
  div.contentEditable = 'true';
  div.setAttribute('oninput', 'updateCharCounter()');
  div.innerHTML = htmlSnippet;
  canvas.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'center' });
  updateCharCounter();
  showToast('✍️ 워드프레스 블록이 본문에 추가되었습니다.');
}

function startBlankWordpressPost() {
  currentPost.selectedTitle = '새 블로그 포스트 제목을 입력하세요';
  currentPost.slug = makeSlug('new-wordpress-post');
  currentPost.sections = [
    {
      heading: '1. 첫 번째 소제목을 입력하세요',
      html: '<p>워드프레스처럼 자유롭게 글을 작성해 보세요. 위쪽 서식 툴바에서 <strong>소제목(H2), 형광펜, 표 넣기, 내 사진 넣기, 링크 버튼</strong>을 원클릭으로 추가할 수 있습니다.</p>'
    }
  ];
  currentPost.photos = [
    {
      id: 'photo-1',
      url: (allNiches[activeNicheId]?.photos || DEFAULT_NICHES.travel.photos)[0],
      caption: '대표 썸네일 사진 설명을 입력하세요',
      prompt: 'Clean high resolution blog hero image'
    }
  ];
  renderPostToEditor();
  document.getElementById('activePostTitleInput').focus();
  showToast('📝 빈 워드프레스 에디터가 준비되었습니다!');
}

function selectRecommendedTitle(idx) {
  if (!currentPost.titles[idx]) return;
  currentPost.selectedTitle = currentPost.titles[idx];
  currentPost.slug = makeSlug(currentPost.selectedTitle);
  renderPostToEditor();
  showToast(`🎯 대표 제목이 '추천 ${idx + 1}'으로 변경되었습니다.`);
}

function regenerateTitlesOnly() {
  const isEn = (allNiches[activeNicheId]?.lang === 'en');
  const base = buildTitlesForTopic(currentPost.topic || '인기 블로그 주제', isEn);
  currentPost.titles = base.map((t, i) => (i === 0 ? `🔥 ${t}` : t));
  currentPost.selectedTitle = currentPost.titles[0];
  renderPostToEditor();
  showToast('🔄 추천 제목 5선을 새롭게 구성했습니다!');
}

function syncTitleFromInput(val) {
  currentPost.selectedTitle = val;
  currentPost.slug = makeSlug(val);
  document.getElementById('activePostSlugInput').value = currentPost.slug;
}

function updateCharCounter() {
  const canvas = document.getElementById('blogEditorCanvas');
  if (!canvas) return;
  const textOnly = (canvas.innerText || '').replace(/\s+/g, '');
  const badge = document.getElementById('charCounterBadge');
  if (badge) {
    badge.textContent = `공백 제외 ${textOnly.length.toLocaleString()}자 · 사진 ${currentPost.photos.length}장`;
  }
}

/* Photo Controls */
function updatePhotoCaption(idx, val) {
  if (currentPost.photos[idx]) currentPost.photos[idx].caption = val;
}

function cycleSingleStockPhoto(idx) {
  const pool = allNiches[activeNicheId]?.photos || DEFAULT_NICHES.travel.photos;
  const cur = currentPost.photos[idx]?.url;
  const curPoolIdx = pool.indexOf(cur);
  const nextUrl = pool[(curPoolIdx + 1) % pool.length];
  currentPost.photos[idx].url = nextUrl;
  const imgEl = document.getElementById(`editorPhotoImg_${idx}`);
  if (imgEl) imgEl.src = nextUrl;
  showToast(`🖼️ 사진 #${idx + 1}이 다른 무료 사진으로 교체되었습니다.`);
}

function shuffleAllStockPhotos() {
  const pool = [...(allNiches[activeNicheId]?.photos || DEFAULT_NICHES.travel.photos)].sort(() => Math.random() - 0.5);
  currentPost.photos.forEach((p, i) => {
    p.url = pool[i % pool.length];
  });
  renderPostToEditor();
  showToast('🔄 전체 사진이 새로운 무료 고화질 조합으로 교체되었습니다!');
}

function triggerLocalPhotoUpload(idx) {
  pendingPhotoUploadIdx = idx;
  const inp = document.getElementById('hiddenPhotoFileInput');
  if (inp) {
    inp.value = '';
    inp.click();
  }
}

function handlePhotoFileSelected(event) {
  const file = event.target.files?.[0];
  if (!file || pendingPhotoUploadIdx === null) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    if (currentPost.photos[pendingPhotoUploadIdx]) {
      currentPost.photos[pendingPhotoUploadIdx].url = e.target.result;
      renderPostToEditor();
      showToast('📷 내 컴퓨터 사진이 본문에 삽입되었습니다!');
    }
  };
  reader.readAsDataURL(file);
}

function copyPhotoPrompt(idx) {
  const p = currentPost.photos[idx]?.prompt || '';
  navigator.clipboard?.writeText(p);
  showToast('📋 AI 이미지 생성 프롬프트가 복사되었습니다!');
}

async function generateSingleFalImage(idx) {
  const falKey = localStorage.getItem('studio_fal_key') || '';
  if (!falKey) {
    openModal('settingsModal');
    showToast('⚙️ fal.ai API Key를 설정하면 실시간 AI 사진 생성이 가능합니다. (현재는 무료 스톡 교체 지원)');
    return;
  }
  const model = localStorage.getItem('studio_fal_model') || 'fal-ai/flux/schnell';
  const ratio = localStorage.getItem('studio_fal_ratio') || 'landscape_16_9';
  const prompt = currentPost.photos[idx]?.prompt || currentPost.topic;
  showToast(`🎨 사진 #${idx + 1} fal AI 이미지 생성 중...`);
  try {
    const res = await fetch(`https://fal.run/${model}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Key ${falKey}` },
      body: JSON.stringify({ prompt, image_size: ratio, num_images: 1 })
    });
    const data = await res.json();
    const imgUrl = data.images?.[0]?.url;
    if (imgUrl) {
      currentPost.photos[idx].url = imgUrl;
      renderPostToEditor();
      showToast(`✨ 사진 #${idx + 1} fal AI 생성 완료!`);
    }
  } catch (e) {
    showToast('⚠️ fal AI 호출 중 오류가 발생했습니다.');
  }
}

async function generateAllFalImages() {
  for (let i = 0; i < currentPost.photos.length; i++) {
    await generateSingleFalImage(i);
    if (!localStorage.getItem('studio_fal_key')) break;
  }
}

/* Export & Copy for Naver / Tistory */
function buildCleanExportHtml(fullPage = false) {
  const title = document.getElementById('activePostTitleInput')?.value || currentPost.selectedTitle;
  const canvas = document.getElementById('blogEditorCanvas');
  const clone = canvas.cloneNode(true);

  // Convert interactive photo cards into clean figure + img tags
  clone.querySelectorAll('.editor-photo-card').forEach((card, i) => {
    const p = currentPost.photos[i] || {};
    const fig = document.createElement('figure');
    fig.style.cssText = 'margin:22px 0;text-align:center;';
    fig.innerHTML = `
      <img src="${p.url || ''}" alt="${(p.caption || title).replace(/"/g, '&quot;')}" style="max-width:100%;height:auto;border-radius:10px;filter:none !important;backdrop-filter:none !important;" />
      <figcaption style="font-size:13px;color:#64748b;margin-top:6px;">${p.caption || ''}</figcaption>
    `;
    card.replaceWith(fig);
  });

  clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));

  const bodyContent = `
    <article style="max-width:820px;margin:0 auto;font-family:'Pretendard',sans-serif;line-height:1.8;color:#0f172a;">
      <h1 style="font-size:28px;font-weight:800;margin-bottom:14px;">${title}</h1>
      <p style="font-size:13px;color:#64748b;margin-bottom:24px;">Published: ${new Date().toISOString().slice(0, 10)} · ${currentPost.tags.join(' ')}</p>
      ${clone.innerHTML}
    </article>
  `;

  if (!fullPage) return bodyContent;
  return `<!DOCTYPE html>
<html lang="${allNiches[activeNicheId]?.lang || 'ko'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${title} - ${currentPost.topic}" />
</head>
<body style="background:#f8fafc;padding:32px 16px;margin:0;">
  <div style="background:#ffffff;max-width:860px;margin:0 auto;padding:36px 28px;border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
    ${bodyContent}
  </div>
</body>
</html>`;
}

async function copyForNaverTistory() {
  const html = buildCleanExportHtml(false);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const plain = tempDiv.innerText;

  try {
    if (window.ClipboardItem) {
      const item = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plain], { type: 'text/plain' })
      });
      await navigator.clipboard.write([item]);
    } else {
      await navigator.clipboard.writeText(plain);
    }
    showToast('📋 네이버 블로그·티스토리용 서식+사진이 클립보드에 복사되었습니다! (Ctrl+V로 붙여넣기)');
  } catch (e) {
    await navigator.clipboard.writeText(plain);
    showToast('📋 본문 텍스트가 복사되었습니다!');
  }
}

function toggleDownloadMenu() {
  const m = document.getElementById('downloadMenu');
  if (m) m.style.display = m.style.display === 'none' ? 'block' : 'none';
}

function downloadPostFile(ext) {
  document.getElementById('downloadMenu').style.display = 'none';
  const slug = document.getElementById('activePostSlugInput').value || 'blog-post';
  let content = '';
  let mime = 'text/plain;charset=utf-8';

  if (ext === 'html') {
    content = buildCleanExportHtml(true);
    mime = 'text/html;charset=utf-8';
  } else if (ext === 'md') {
    content = `# ${currentPost.selectedTitle}\n\n` + currentPost.sections.map((s, i) => {
      const p = currentPost.photos[i];
      const imgMd = p ? `![${p.caption}](${p.url})\n\n` : '';
      return `${imgMd}## ${s.heading}\n\n${s.html.replace(/<[^>]+>/g, '')}\n`;
    }).join('\n');
  } else {
    content = `${currentPost.selectedTitle}\n\n` + document.getElementById('blogEditorCanvas').innerText;
  }

  const blob = new Blob([content], { type: mime });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${slug}.${ext}`;
  a.click();
  showToast(`💾 ${slug}.${ext} 파일이 다운로드되었습니다.`);
}

/* Modals, Settings, Custom Niche & Drafts */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'flex';
  if (id === 'draftsModal') renderDraftsList();
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function openPublishModal() {
  const slug = document.getElementById('activePostSlugInput').value || makeSlug(currentPost.selectedTitle);
  document.getElementById('pubFilePath').value = `blog/${slug}.html`;
  const savedToken = localStorage.getItem('studio_github_token') || '';
  if (savedToken) document.getElementById('pubGithubToken').value = savedToken;
  openModal('publishModal');
}

function onPubRepoPresetChange(val) {
  if (val !== 'custom') {
    document.getElementById('pubGithubRepo').value = val;
  }
}

async function executeGithubPublish() {
  const token = document.getElementById('pubGithubToken').value.trim();
  const repo = document.getElementById('pubGithubRepo').value.trim() || 'intid85/duckcheon-korea';
  const path = document.getElementById('pubFilePath').value.trim() || `blog/${currentPost.slug}.html`;
  const resBox = document.getElementById('publishResultBox');

  if (!token) {
    resBox.style.display = 'block';
    resBox.innerHTML = '⚠️ GitHub Personal Access Token을 입력해 주세요. (한 번 입력하면 브라우저에 저장됩니다)';
    return;
  }
  localStorage.setItem('studio_github_token', token);
  resBox.style.display = 'block';
  resBox.innerHTML = '⏳ GitHub 저장소에 HTML 포스트를 커밋·배포 중입니다...';

  try {
    const htmlContent = buildCleanExportHtml(true);
    const b64 = btoa(unescape(encodeURIComponent(htmlContent)));
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

    let sha = undefined;
    const check = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
    if (check.ok) {
      const existing = await check.json();
      sha = existing.sha;
    }

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        message: `Publish blog post: ${currentPost.selectedTitle}`,
        content: b64,
        ...(sha ? { sha } : {})
      })
    });

    if (putRes.ok) {
      const liveUrl = repo === 'intid85/duckcheon-korea'
        ? `https://dctrade.co.kr/${path}`
        : `https://intid85.github.io/${repo.split('/')[1]}/${path}`;
      resBox.innerHTML = `✅ <strong>발행 성공!</strong> <a href="${liveUrl}" target="_blank" rel="noopener">${liveUrl}</a>`;
      showToast('🚀 GitHub 블로그에 포스트가 성공적으로 발행되었습니다!');
    } else {
      const err = await putRes.json();
      resBox.innerHTML = `❌ 발행 오류: ${err.message || putRes.statusText}`;
    }
  } catch (e) {
    resBox.innerHTML = `❌ 네트워크 오류: ${e.message}`;
  }
}

function saveSettings() {
  localStorage.setItem('studio_deepseek_key', document.getElementById('settingDeepseekKey').value.trim());
  localStorage.setItem('studio_fal_key', document.getElementById('settingFalKey').value.trim());
  localStorage.setItem('studio_fal_model', document.getElementById('settingFalModel').value);
  localStorage.setItem('studio_fal_ratio', document.getElementById('settingFalRatio').value);
  localStorage.setItem('studio_github_token', document.getElementById('settingGithubToken').value.trim());
  localStorage.setItem('studio_github_repo', document.getElementById('settingGithubRepo').value.trim());
  loadSettingsToUI();
  closeModal('settingsModal');
  showToast('💾 API 및 GitHub 설정이 저장되었습니다.');
}

function loadSettingsToUI() {
  const dsKey = localStorage.getItem('studio_deepseek_key') || '';
  const falKey = localStorage.getItem('studio_fal_key') || '';
  const ghToken = localStorage.getItem('studio_github_token') || '';
  if (document.getElementById('settingDeepseekKey')) document.getElementById('settingDeepseekKey').value = dsKey;
  if (document.getElementById('settingFalKey')) document.getElementById('settingFalKey').value = falKey;
  if (document.getElementById('settingGithubToken')) document.getElementById('settingGithubToken').value = ghToken;

  document.getElementById('deepseekStatusText').textContent = dsKey ? 'API 연결됨 (실시간)' : '즉시 초안 모드 (무료)';
  document.getElementById('falStatusText').textContent = falKey ? 'fal AI 연결됨' : '무료 스톡 + 프롬프트';
}

function updateCostEstimate() {
  const mode = document.getElementById('genModeSelect').value;
  const costEl = document.getElementById('estimatedCostText');
  if (mode === 'deepseek') {
    costEl.textContent = '약 ₩3.2 / 편 (DeepSeek API 실시간 생성)';
  } else {
    costEl.textContent = '₩0 (즉시 초안 엔진 · 무료)';
  }
}

function saveNewCustomNiche() {
  const name = document.getElementById('newNicheName').value.trim();
  if (!name) return showToast('⚠️ 분야 이름을 입력해 주세요.');
  const emoji = document.getElementById('newNicheEmoji').value.trim() || '✍️';
  const lang = document.getElementById('newNicheLang').value;
  const presetsRaw = document.getElementById('newNichePresets').value.trim();
  const id = 'custom_' + Date.now();

  const presets = presetsRaw
    ? presetsRaw.split(',').map(s => ({ label: `${emoji} ${s.trim()}`, topic: s.trim(), memo: '' }))
    : [{ label: `${emoji} ${name} 추천 가이드`, topic: `${name} 핵심 정보 및 꿀팁 정리`, memo: '' }];

  const newNiche = {
    id,
    name,
    icon: emoji,
    title: `${name} 전문 블로그`,
    desc: '나만의 맞춤 카테고리 설정으로 빠르고 일관된 포스팅을 생성합니다.',
    constraint: '',
    lang,
    tones: DEFAULT_NICHES.travel.tones,
    presets,
    photos: DEFAULT_NICHES.custom.photos
  };

  allNiches[id] = newNiche;
  const customOnly = {};
  Object.keys(allNiches).forEach(k => {
    if (!DEFAULT_NICHES[k]) customOnly[k] = allNiches[k];
  });
  localStorage.setItem('studio_custom_niches', JSON.stringify(customOnly));

  closeModal('customNicheModal');
  selectNiche(id, true);
  showToast(`➕ '${name}' 분야 탭이 추가되었습니다!`);
}

function saveCurrentDraftManual() {
  const drafts = JSON.parse(localStorage.getItem('studio_saved_drafts') || '[]');
  drafts.unshift({
    id: Date.now(),
    date: new Date().toLocaleString('ko-KR'),
    title: document.getElementById('activePostTitleInput').value || currentPost.selectedTitle,
    post: JSON.parse(JSON.stringify(currentPost))
  });
  localStorage.setItem('studio_saved_drafts', JSON.stringify(drafts.slice(0, 30)));
  updateDraftCountBadge();
  showToast('🗂️ 현재 글이 내 보관함에 저장되었습니다!');
}

function updateDraftCountBadge() {
  const drafts = JSON.parse(localStorage.getItem('studio_saved_drafts') || '[]');
  const el = document.getElementById('draftCountBadge');
  if (el) el.textContent = drafts.length;
}

function renderDraftsList() {
  const wrap = document.getElementById('draftsListContainer');
  const drafts = JSON.parse(localStorage.getItem('studio_saved_drafts') || '[]');
  if (!drafts.length) {
    wrap.innerHTML = '<p style="color:#64748b;padding:12px 0;">보관된 글이 없습니다. 상단 [🗂️ 보관함 저장] 버튼을 눌러 저장해 보세요.</p>';
    return;
  }
  wrap.innerHTML = drafts.map((d, idx) => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px;">
      <div>
        <strong>${d.title}</strong>
        <div style="font-size:11.5px;color:#64748b;">저장일시: ${d.date}</div>
      </div>
      <button class="mini-btn" onclick="loadDraftByIndex(${idx})">📂 불러오기</button>
    </div>
  `).join('');
}

function loadDraftByIndex(idx) {
  const drafts = JSON.parse(localStorage.getItem('studio_saved_drafts') || '[]');
  if (!drafts[idx]) return;
  currentPost = drafts[idx].post;
  activeNicheId = currentPost.nicheId || 'travel';
  renderNicheTabs();
  renderPostToEditor();
  closeModal('draftsModal');
  showToast('📂 보관함에서 글을 불러왔습니다!');
}

function clearAllDrafts() {
  localStorage.removeItem('studio_saved_drafts');
  updateDraftCountBadge();
  renderDraftsList();
  showToast('🗑️ 보관함을 비웠습니다.');
}

function toggleTheme() {
  const b = document.body;
  const next = b.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  b.setAttribute('data-theme', next);
  document.getElementById('themeToggleBtn').textContent = next === 'dark' ? '☀️' : '🌙';
}

function showToast(msg) {
  const wrap = document.getElementById('toastContainer');
  if (!wrap) return;
  const item = document.createElement('div');
  item.className = 'toast-item';
  item.textContent = msg;
  wrap.appendChild(item);
  setTimeout(() => item.remove(), 3200);
}

window.addEventListener('DOMContentLoaded', initStudio);
