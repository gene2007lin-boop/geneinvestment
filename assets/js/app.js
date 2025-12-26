const el = (s)=>document.querySelector(s)
const els = (s)=>document.querySelectorAll(s)

document.addEventListener('DOMContentLoaded',async()=>{
  const res = await fetch('data/content.json').then(r=>r.json()).catch(()=>null)
  const data = res||{
    name:'你的名字',
    tagline:'前端工程師',
    about:'這是一段關於你的簡短自介。',
    projects:[],
    skills:[],
    contact:'you@example.com'
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
