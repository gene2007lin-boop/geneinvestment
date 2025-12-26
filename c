// Basic client-side "AI-like" assistant using simple tokenization + cosine similarity
// Loads data from data/content.json injected as a script tag (see index.html)

(() => {
  const contentEl = document.getElementById('content-json');
  let DATA = {
    about: {text: "Hello — edit data/content.json to replace this text."},
    projects: [],
    skills: [],
    contact: [],
    faq: []
  };

  try {
    // The script tag has type=application/json and contains JSON; parse if present
    if (contentEl) {
      DATA = JSON.parse(contentEl.textContent);
    }
  } catch (e) {
    console.warn('Failed to parse content.json, using defaults', e);
  }

  // Populate page
  document.getElementById('site-name').textContent = DATA.name || 'Your Name';
  document.getElementById('site-tagline').textContent = DATA.tagline || '前端工程師 / 開發者';
  document.getElementById('year').textContent = new Date().getFullYear();

  const aboutContentEl = document.getElementById('about-content');
  aboutContentEl.innerHTML = `<p>${(DATA.about && DATA.about.text) || ''}</p>`;

  const projectsList = document.getElementById('projects-list');
  (DATA.projects || []).forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${escapeHtml(p.title)}</h3>
      <p>${escapeHtml(p.desc)}</p>
      ${p.link ? `<p><a href="${escapeAttr(p.link)}" target="_blank" rel="noopener">查看專案</a></p>` : ''}`;
    projectsList.appendChild(card);
  });

  const skillsList = document.getElementById('skills-list');
  (DATA.skills || []).forEach(s => {
    const el = document.createElement('span');
    el.textContent = s;
    skillsList.appendChild(el);
  });

  const contactList = document.getElementById('contact-list');
  if (DATA.contact && DATA.contact.length) {
    contactList.innerHTML = DATA.contact.map(c => {
      if (c.type === 'email') return `<a href="mailto:${escapeAttr(c.value)}">${escapeHtml(c.label || c.value)}</a>`;
      return `<a href="${escapeAttr(c.value)}" target="_blank" rel="noopener">${escapeHtml(c.label || c.value)}</a>`;
    }).join(' · ');
  } else {
    contactList.textContent = 'No contact info — edit data/content.json';
  }

  // ============ Simple text similarity model ============
  // Build a small vector index from DATA (about, faq, project descriptions)
  const docs = [];
  function addDoc(id, title, text, meta = {}) {
    docs.push({id, title, text, meta});
  }
  // Add about
  if (DATA.about && DATA.about.text) addDoc('about', 'About', DATA.about.text);
  (DATA.faq || []).forEach((f, i) => addDoc(`faq-${i}`, 'FAQ', f));
  (DATA.projects || []).forEach((p, i) => addDoc(`project-${i}`, p.title, p.desc, {link: p.link}));

  // Tokenize and compute TF vectors
  const STOP = new Set(["the","a","an","and","or","is","are","of","在","與","的","是","我","你","他"]);
  function tokenize(s){
    return (s || '').toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu,' ')
      .split(/\s+/)
      .filter(Boolean)
      .filter(t => !STOP.has(t));
  }
  function tf(tokens){
    const m = new Map();
    tokens.forEach(t => m.set(t, (m.get(t)||0)+1));
    return m;
  }
  function dot(a,b){
    let out = 0;
    for (const [k,v] of a.entries()){
      if (b.has(k)) out += v * b.get(k);
    }
    return out;
  }
  function norm(m){
    let s=0; for (const v of m.values()) s+=v*v; return Math.sqrt(s);
  }

  // Precompute doc vectors
  docs.forEach(d => {
    const toks = tokenize(d.text + ' ' + (d.title||''));
    d.tokens = toks;
    d.vec = tf(toks);
    d.norm = norm(d.vec) || 1;
  });

  function findBestMatches(query, topN=3){
    const qtoks = tokenize(query);
    const qvec = tf(qtoks);
    const qnorm = norm(qvec) || 1;
    const scored = docs.map(d => {
      const score = dot(d.vec, qvec) / (d.norm * qnorm);
      return {doc:d,score};
    }).sort((a,b)=>b.score-a.score);
    return scored.slice(0, topN).filter(s=>s.score>0);
  }

  // ============ Assistant UI ============
  const toggleBtn = document.getElementById('assistant-toggle');
  const panel = document.getElementById('assistant-panel');
  const closeBtn = document.getElementById('assistant-close');
  const sendBtn = document.getElementById('assistant-send');
  const input = document.getElementById('assistant-input');
  const messages = document.getElementById('messages');
  const voiceBtn = document.getElementById('voice-btn');
  const rewriteBtn = document.getElementById('rewrite-email');
  const summarizeBtn = document.getElementById('summarize');
  let lastAnswer = '';

  function addMessage(text, who='bot'){
    const el = document.createElement('div');
    el.className = 'msg ' + (who==='user'?'user':'bot');
    el.innerHTML = `<div>${escapeHtml(text)}</div>`;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  toggleBtn.addEventListener('click', () => {
    panel.classList.toggle('hidden');
  });
  closeBtn.addEventListener('click', () => panel.classList.add('hidden'));

  sendBtn.addEventListener('click', onSend);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') onSend();
  });

  function onSend(){
    const q = input.value.trim();
    if(!q) return;
    addMessage(q,'user');
    input.value = '';
    handleQuery(q);
  }

  function handleQuery(q){
    const matches = findBestMatches(q, 3);
    if (!matches.length){
      const fallback = `抱歉，我沒在資料中找到明確答案。你可以試試其他問法，例如："介紹你的專案" 或 "你的技能有哪些"。`;
      addMessage(fallback,'bot');
      lastAnswer = fallback;
      return;
    }
    const top = matches[0];
    const lines = [];
    lines.push(`${top.doc.title}: ${top.doc.text}`);
    if (top.doc.meta && top.doc.meta.link) {
      lines.push(`來源連結: ${top.doc.meta.link}`);
    }
    const out = lines.join('\n\n');
    addMessage(out,'bot');
    lastAnswer = out;
  }

  // Simple "generate email" — fill a template using lastAnswer
  rewriteBtn.addEventListener('click', () => {
    if (!lastAnswer) { addMessage('先問一個問題取得答案，再用此功能生成 Email 範本。','bot'); return; }
    const subject = `關於：${shorten(firstLine(lastAnswer), 60)}`;
    const body = `您好，\n\n我想和您分享以下資料：\n\n${lastAnswer}\n\n期待您的回覆。\n\n謝謝，\n${DATA.name || 'Your Name'}`;
    const email = `Subject: ${subject}\n\n${body}`;
    addMessage(email,'bot');
    lastAnswer = email;
  });

  summarizeBtn.addEventListener('click', () => {
    if (!lastAnswer) { addMessage('先取得回答，才能摘要它。','bot'); return; }
    const s = summarizeText(lastAnswer);
    addMessage(`摘要： ${s}`,'bot');
    lastAnswer = s;
  });

  // Short helpers
  function firstLine(s){ return s.split('\n')[0] || s; }
  function shorten(s, n){ return s.length>n ? s.slice(0,n-1)+'…' : s; }
  function summarizeText(s){
    // crude summarizer: take first two sentences (split on punctuation)
    const parts = s.match(/[^\.!\?。！？]+[\.!\?。！？]?/g) || [s];
    return parts.slice(0,2).join(' ').trim();
  }

  // Voice input (optional)
  let recog = null;
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recog = new SpeechRecognition();
    recog.lang = 'zh-TW';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = (e) => {
      const text = e.results[0][0].transcript;
      input.value = text;
      onSend();
    };
    recog.onerror = (e) => {
      console.warn('speech error', e);
      addMessage('Voice recognition error','bot');
    };
  } else {
    voiceBtn.disabled = true;
    voiceBtn.title = 'Your browser does not support SpeechRecognition';
  }

  voiceBtn.addEventListener('click', () => {
    if (!recog) return;
    try {
      recog.start();
    } catch (e) { console.warn(e); }
  });

  // Utilities: simple escaping
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, (m)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));}
  function escapeAttr(s){ return escapeHtml(s).replace(/"/g,'&quot;'); }

})();