// Simple IndexedDB helper (promisified)
const DB_NAME = 'smart-notes-db';
const STORE = 'notes';
function openDB(){
  return new Promise((res,rej)=>{
    const r = indexedDB.open(DB_NAME,1);
    r.onupgradeneeded = ()=>{ r.result.createObjectStore(STORE,{keyPath:'id',autoIncrement:true}) }
    r.onsuccess = ()=>res(r.result);
    r.onerror = ()=>rej(r.error);
  })
}
async function putNote(note){ const db = await openDB(); return new Promise((res,rej)=>{ const tx = db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(note); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error) }) }
async function getAllNotes(){ const db = await openDB(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE); const req = tx.objectStore(STORE).getAll(); req.onsuccess=()=>res(req.result); req.onerror=()=>rej(req.error) }) }
async function clearNotes(){ const db = await openDB(); return new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readwrite'); const req = tx.objectStore(STORE).clear(); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error) }) }

function shortSummary(text, maxWords=30){ return text.split(/\s+/).slice(0,maxWords).join(' ') + (text.split(/\s+/).length>maxWords? '…':'') }

function el(id){return document.getElementById(id)}

async function render(){ const list = el('notes-list'); list.innerHTML=''; const notes = await getAllNotes(); const filter = el('filter-tags').value.trim().toLowerCase(); const q = el('search-notes').value.trim().toLowerCase();
  notes.sort((a,b)=>b.updatedAt - a.updatedAt).forEach(n=>{
    const tags = (n.tags||[]).map(t=>t.trim()).filter(Boolean);
    if(filter && !tags.map(t=>t.toLowerCase()).includes(filter)) return;
    const text = `${n.title||''} ${n.text||''}`.toLowerCase(); if(q && !text.includes(q)) return;
    const card = document.createElement('div'); card.className='note-card';
    card.innerHTML = `<div class="note-meta"><strong>${n.title||'(no title)'}</strong><span>${new Date(n.updatedAt).toLocaleString()}</span></div><div class="note-body"><p>${shortSummary(n.text,40)}</p></div><div class="note-tags">${tags.map(t=>`<span class=\"tag\">${t}</span>`).join(' ')}</div><div style="margin-top:8px"><button class=\"btn\" data-id=\"${n.id}\" data-action=\"open\">Open</button> <button class=\"btn\" data-id=\"${n.id}\" data-action=\"delete\">Delete</button></div>`;
    list.appendChild(card);
  })
}

async function init(){
  el('save-note').addEventListener('click', async ()=>{
    const title = el('note-title').value.trim(); const text = el('note-text').value.trim(); const tags = (el('note-tags').value||'').split(',').map(s=>s.trim()).filter(Boolean);
    if(!text){ alert('Please write something.'); return }
    const note = {title,text,tags,updatedAt:Date.now()}; await putNote(note); el('note-text').value=''; el('note-title').value=''; el('note-tags').value=''; render();
  })
  el('clear-all').addEventListener('click', async ()=>{ if(confirm('Clear all notes?')){ await clearNotes(); render() } })
  el('export-md').addEventListener('click', async ()=>{
    const notes = await getAllNotes(); const md = notes.map(n=>`# ${n.title||'(no title)'}\n\n${n.text}\n\nTags: ${(n.tags||[]).join(', ')}\n\n---`).join('\n\n'); const blob=new Blob([md],{type:'text/markdown'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='smart-notes.md'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  })
  el('filter-tags').addEventListener('input', ()=>render()); el('search-notes').addEventListener('input', ()=>render());

  // delegate open/delete buttons
  document.getElementById('notes-list').addEventListener('click', async (e)=>{
    const btn = e.target.closest('button'); if(!btn) return; const id = Number(btn.dataset.id); const action = btn.dataset.action;
    if(action==='delete'){ const db = await openDB(); const tx = db.transaction(STORE,'readwrite'); tx.objectStore(STORE).delete(id); tx.oncomplete=()=>render(); }
    if(action==='open'){ const db = await openDB(); const req = db.transaction(STORE).objectStore(STORE).get(id); req.onsuccess=()=>{
      const n = req.result; if(!n) return; el('note-title').value = n.title||''; el('note-text').value = n.text||''; el('note-tags').value = (n.tags||[]).join(', ');
    } }
  })

  // initialize DB and render
  await openDB(); render();
}

document.addEventListener('DOMContentLoaded', init);
