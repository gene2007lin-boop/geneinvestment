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

