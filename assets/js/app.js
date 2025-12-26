const el = (s)=>document.querySelector(s)
const els = (s)=>document.querySelectorAll(s)

document.addEventListener('DOMContentLoaded',async()=>{
  const res = await fetch('data/content.json').then(r=>r.json()).catch(()=>null)
  const data = res||{
      name: '你的名字',
      tagline: '前端工程師',
      about: '這是一段關於你的簡短自介。',
      projects: [],
      skills: [],
      contact: 'you@example.com'
  }

  el('#site-name').innerHTML = `你好，我是 <span>${data.name}</span>`
  el('#site-tagline').textContent = data.tagline
  el('#about-text').textContent = data.about
  el('#brand').textContent = data.name
  el('#year').textContent = new Date().getFullYear()

  const projectsList = el('#projects-list')
  data.projects.forEach(p=>{
    const d=document.createElement('div');d.className='card'
    d.innerHTML = `<h3>${p.title}</h3><p>${p.desc}</p><p><a href="${p.link}" target="_blank">Live / Repo</a></p>`
    projectsList.appendChild(d)
  })

  const skillsList = el('#skills-list')
  data.skills.forEach(s=>{const c=document.createElement('span');c.className='chip';c.textContent=s;skillsList.appendChild(c)})

  el('#contact-list').innerHTML = `<a href="mailto:${data.contact}">${data.contact}</a>`

  // menu
  el('#menu-btn').addEventListener('click',()=>{
    const n=el('#nav-links'); n.style.display = n.style.display==='block' ? '': 'block'
  })
})
  // Merged assistant + site population (adapted from original client-side assistant)
  (async function(){
    function el(s){return document.querySelector(s)}
    function els(s){return document.querySelectorAll(s)}

    let DATA = {
      name: 'Gene Lin',
      tagline: '前端工程師 / 靜態網站範例',
      about: {text: '這是一個靜態個人網站範例。'},
      projects: [],
      skills: [],
      contact: []
    };

    try {
      const resp = await fetch('data/content.json');
      if (resp.ok) DATA = await resp.json();
    } catch(e){ console.warn('Failed to load content.json', e) }

    // Populate basic fields
    if (el('#site-name')) el('#site-name').innerHTML = `你好，我是 <span>${DATA.name}</span>`;
    if (el('#site-tagline')) el('#site-tagline').textContent = DATA.tagline || '';
    if (el('#year')) el('#year').textContent = new Date().getFullYear();
    if (el('#brand')) el('#brand').textContent = DATA.name || '';

    if (el('#about-text')) el('#about-text').textContent = (DATA.about && (DATA.about.text||DATA.about)) || '';
    if (el('#about-content')) el('#about-content').innerHTML = `<p>${(DATA.about && DATA.about.text) || ''}</p>`;

    const projectsList = el('#projects-list');
    if (projectsList && (DATA.projects || []).length){
      DATA.projects.forEach(p=>{
        const card = document.createElement('div'); card.className='card';
        card.innerHTML = `<h3>${p.title}</h3><p>${p.desc}</p>${p.link?`<p><a href="${p.link}" target="_blank" rel="noopener">查看專案</a></p>`:''}`;
        projectsList.appendChild(card);
      })
    }

    const skillsList = el('#skills-list');
    if (skillsList && (DATA.skills||[]).length){
      DATA.skills.forEach(s=>{const c=document.createElement('span');c.className='chip';c.textContent=s;skillsList.appendChild(c)})
    }

    const contactList = el('#contact-list');
    if (contactList){
      if (Array.isArray(DATA.contact)){
        contactList.innerHTML = DATA.contact.map(c=>{
          if (c.type === 'email') return `<a href=\"mailto:${c.value}\">${c.value}</a>`;
          return c.type === 'link' ? `<a href=\"${c.value}\" target=\"_blank\">${c.label||c.value}</a>` : `${c.value}`;
        }).join(' · ');
      } else if (typeof DATA.contact === 'string'){
        contactList.innerHTML = `<a href=\"mailto:${DATA.contact}\">${DATA.contact}</a>`;
      }
    }

    // Render social icons in header (if container exists)
    const socialEl = el('#social-links');
    if (socialEl && Array.isArray(DATA.contact)){
      const getIcon = (label)=>{
        const l = (label||'').toLowerCase();
        if (l.includes('github')) return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .5a12 12 0 00-3.8 23.4c.6.1.8-.2.8-.5v-1.9c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.8 1.6 2.3 2.1.4.2.9.2 1.3.2s.9 0 1.3-.2c1.5-.5 1.3-2 2.3-2.1 0 0 .6-1.1 1.7-1.2 0 0 1.1 0 .1.7 0 0-.7.3-1.2 1.5 0 0-.7 2.1-4 1.4v1.9c0 .3.2.6.8.5A12 12 0 0012 .5z"/></svg>';
        if (l.includes('linkedin')) return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5a2.5 2.5 0 11-.001 5.001A2.5 2.5 0 014.98 3.5zM3 9h4v12H3zM9 9h3.8v1.6h.1c.5-.9 1.8-1.6 3.7-1.6 4 0 4.7 2.6 4.7 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8-1.7 0-2 1.4-2 2.7V21H9V9z"/></svg>';
        if (l.includes('twitter')) return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.23 4.23 0 001.85-2.33c-.82.5-1.72.86-2.68 1.06A4.18 4.18 0 0015.5 4c-2.3 0-4.18 1.86-4.18 4.16 0 .33.04.66.11.97C7.69 9.99 4.07 8.1 1.64 5.16c-.36.62-.57 1.33-.57 2.09 0 1.44.73 2.71 1.84 3.46a4.12 4.12 0 01-1.9-.52v.05c0 2.02 1.44 3.7 3.35 4.09-.35.1-.72.15-1.09.15-.27 0-.54-.03-.8-.08.54 1.66 2.06 2.87 3.87 2.9A8.4 8.4 0 012 19.54a11.8 11.8 0 006.29 1.84c7.55 0 11.68-6.26 11.68-11.68v-.53A8.2 8.2 0 0024 6.6a8.2 8.2 0 01-2.36.65z"/></svg>';
        return '';
      }
      DATA.contact.filter(c=>c.type==='link').forEach(c=>{
        const a = document.createElement('a');
        a.href = c.value; a.target = '_blank'; a.rel='noopener'; a.title = c.label || c.value;
        a.innerHTML = getIcon(c.label || c.value) || (c.label || c.value);
        socialEl.appendChild(a);
      })
    }

    // === Assistant logic (simple TF cosine similarity) ===
    const docs = [];
    function addDoc(id,title,text,meta={}){ if (text) docs.push({id,title,text,meta}) }
    if (DATA.about && DATA.about.text) addDoc('about','About', DATA.about.text);
    (DATA.faq||[]).forEach((f,i)=>addDoc(`faq-${i}`,'FAQ',f));
    (DATA.projects||[]).forEach((p,i)=>addDoc(`project-${i}`, p.title, p.desc, {link:p.link}));

    const STOP = new Set(["the","a","an","and","or","is","are","of","在","與","的","是","我","你","他"]);
    function tokenize(s){return (s||'').toLowerCase().replace(/[^^\p{L}\p{N}\s]/gu,' ').split(/\s+/).filter(Boolean).filter(t=>!STOP.has(t))}
    function tf(tokens){const m=new Map();tokens.forEach(t=>m.set(t,(m.get(t)||0)+1));return m}
    function dot(a,b){let out=0;for(const [k,v] of a.entries()) if(b.has(k)) out+=v*b.get(k); return out}
    function norm(m){let s=0;for(const v of m.values()) s+=v*v; return Math.sqrt(s)}
    docs.forEach(d=>{const toks=tokenize(d.text+' '+(d.title||'')); d.tokens=toks; d.vec=tf(toks); d.norm=norm(d.vec)||1})
    function findBestMatches(query, topN=3){const qtoks=tokenize(query); const qvec=tf(qtoks); const qnorm=norm(qvec)||1; return docs.map(d=>({doc:d,score:dot(d.vec,qvec)/(d.norm*qnorm)})).sort((a,b)=>b.score-a.score).slice(0,topN).filter(s=>s.score>0)}

    // Assistant UI wiring (if present)
    const toggleBtn = el('#assistant-toggle');
    const panel = el('#assistant-panel');
    const closeBtn = el('#assistant-close');
    const sendBtn = el('#assistant-send');
    const input = el('#assistant-input');
    const messages = el('#messages');
    const voiceBtn = el('#voice-btn');
    const rewriteBtn = el('#rewrite-email');
    const summarizeBtn = el('#summarize');
    let lastAnswer = '';

    function addMessage(text, who='bot'){ if(!messages) return; const m=document.createElement('div'); m.className='msg '+(who==='user'?'user':'bot'); m.innerHTML=`<div>${escapeHtml(text)}</div>`; messages.appendChild(m); messages.scrollTop=messages.scrollHeight }

    if (toggleBtn && panel) toggleBtn.addEventListener('click',()=>panel.classList.toggle('hidden'));
    if (closeBtn) closeBtn.addEventListener('click',()=>panel.classList.add('hidden'));
    if (sendBtn && input) { sendBtn.addEventListener('click', onSend); input.addEventListener('keydown', e=>{ if(e.key==='Enter') onSend() }) }

    function onSend(){ const q = input && input.value && input.value.trim(); if(!q) return; addMessage(q,'user'); if(input) input.value=''; handleQuery(q) }
    function handleQuery(q){ const matches = findBestMatches(q,3); if(!matches.length){ const fallback='抱歉，我沒在資料中找到明確答案。試試其他問法。'; addMessage(fallback,'bot'); lastAnswer=fallback; return } const top=matches[0]; const lines=[]; lines.push(`${top.doc.title}: ${top.doc.text}`); if(top.doc.meta && top.doc.meta.link) lines.push(`來源連結: ${top.doc.meta.link}`); const out=lines.join('\n\n'); addMessage(out,'bot'); lastAnswer=out }

    if (rewriteBtn) rewriteBtn.addEventListener('click', ()=>{ if(!lastAnswer){ addMessage('先問一個問題取得答案，再用此功能生成 Email 範本。','bot'); return } const subject=`關於：${shorten(firstLine(lastAnswer),60)}`; const body=`您好，\n\n我想和您分享以下資料：\n\n${lastAnswer}\n\n期待您的回覆。\n\n謝謝，\n${DATA.name||'Your Name'}`; const email=`Subject: ${subject}\n\n${body}`; addMessage(email,'bot'); lastAnswer=email })
    if (summarizeBtn) summarizeBtn.addEventListener('click', ()=>{ if(!lastAnswer){ addMessage('先取得回答，才能摘要它。','bot'); return } const s=summarizeText(lastAnswer); addMessage(`摘要： ${s}`,'bot'); lastAnswer=s })

    // helpers
    function firstLine(s){return s.split('\n')[0]||s}
    function shorten(s,n){return s.length>n? s.slice(0,n-1)+'…': s}
    function summarizeText(s){ const parts = s.match(/[^\.\!\?。！？]+[\.\!\?。！？]?/g) || [s]; return parts.slice(0,2).join(' ').trim() }
    function escapeHtml(s){ return String(s).replace(/[&<>\"']/g, (m)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])) }

    // menu toggle
    const menuBtn = el('#menu-btn'); if (menuBtn){ menuBtn.addEventListener('click', ()=>{ const n=el('#nav-links'); n.style.display = n.style.display==='block' ? '': 'block' }) }

  })();

  // Additional features: theme toggle, contact form, project search, assistant actions, service worker
  (function(){
    function el(s){return document.querySelector(s)}
    // Theme toggle
    const themeToggle = el('#theme-toggle');
    const root = document.documentElement;
    function applyTheme(t){ if(t==='light') document.body.classList.add('theme-light'); else document.body.classList.remove('theme-light'); localStorage.setItem('theme', t) }
    const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
    applyTheme(saved);
    if(themeToggle){ themeToggle.addEventListener('click', ()=>{ const next = document.body.classList.contains('theme-light') ? 'dark' : 'light'; applyTheme(next) }) }

    // Contact form
    const form = el('#contact-form');
    if(form){
      const status = el('#cf-status');
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const name = el('#cf-name').value.trim();
        const email = el('#cf-email').value.trim();
        const msg = el('#cf-message').value.trim();
        if(!name||!email||!msg){ status.textContent='Please fill all fields.'; return }
        const subject = encodeURIComponent(`Contact from ${name}`);
        const body = encodeURIComponent(`${msg}\n\nFrom: ${name} <${email}>`);
        const mailto = `mailto:genelin41@hotmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailto;
        status.textContent = 'Opening mail client...';
      });
      el('#cf-clear').addEventListener('click', ()=>{ el('#cf-name').value=''; el('#cf-email').value=''; el('#cf-message').value=''; if(el('#cf-status')) el('#cf-status').textContent=''; })
    }

    // Project search
    const search = el('#project-search');
    if(search){
      search.addEventListener('input', ()=>{
        const q = search.value.trim().toLowerCase();
        const cards = document.querySelectorAll('#projects-list .card');
        cards.forEach(c=>{
          const text = (c.textContent||'').toLowerCase();
          c.style.display = q ? (text.includes(q) ? '' : 'none') : '';
        })
      })
    }

    // Assistant: add copy and source buttons to bot messages
    const messagesContainer = el('#messages');
    const origAddMessage = window.__orig_addMessage__;
    // We didn't expose original; instead augment existing DOM after messages appended via mutation observer
    if(messagesContainer){
      const mo = new MutationObserver((list)=>{
        for(const rec of list){
          for(const n of rec.addedNodes){
            if(!(n instanceof HTMLElement)) continue;
            if(n.classList.contains('msg') && !n.dataset.enhanced){
              n.dataset.enhanced = '1';
              if(n.classList.contains('bot')){
                const actions = document.createElement('div'); actions.className='actions';
                const copyBtn = document.createElement('button'); copyBtn.className='action-btn'; copyBtn.textContent='Copy';
                copyBtn.addEventListener('click', ()=>{ navigator.clipboard.writeText(n.innerText).then(()=>{ copyBtn.textContent='Copied'; setTimeout(()=>copyBtn.textContent='Copy',1200) }) });
                actions.appendChild(copyBtn);
                // find source link in text
                const txt = n.innerText || '';
                const m = txt.match(/來源連結:\s*(https?:\/\/[^\s]+)/);
                if(m){ const linkBtn = document.createElement('a'); linkBtn.className='action-btn'; linkBtn.textContent='Open source'; linkBtn.href = m[1]; linkBtn.target='_blank'; linkBtn.rel='noopener'; actions.appendChild(linkBtn); }
                n.appendChild(actions);
              }
            }
          }
        }
      });
      mo.observe(messagesContainer,{childList:true,subtree:false});
    }

    // Service worker registration
    if('serviceWorker' in navigator){
      navigator.serviceWorker.register('/sw.js').catch(()=>console.warn('SW register failed'));
    }

  })();


