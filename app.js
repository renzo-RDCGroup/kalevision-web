/* ============================================================
   KALEVISIÓN — Interactividad demo
   Carrito en memoria, navegación, formularios (CRM-ready),
   recomendador con IA y animaciones.
   ============================================================ */

/* ---------- Navegación móvil ---------- */
function toggleNav(){
  const n=document.querySelector('.navlinks');
  if(n) n.classList.toggle('show');
}

/* ---------- Carrito (en memoria, demo) ---------- */
const Cart = {
  items: [],
  add(name, price, img){
    this.items.push({name, price, img: img||''});
    this.render();
    this.open();
  },
  remove(i){ this.items.splice(i,1); this.render(); },
  total(){ return this.items.reduce((s,x)=>s+x.price,0); },
  open(){ document.getElementById('drawer')?.classList.add('open'); document.getElementById('overlay')?.classList.add('show'); },
  close(){ document.getElementById('drawer')?.classList.remove('open'); document.getElementById('overlay')?.classList.remove('show'); },
  render(){
    const body=document.getElementById('cart-body');
    const count=document.querySelector('.cart-count');
    const totalEl=document.getElementById('cart-total');
    if(count) count.textContent=this.items.length;
    if(totalEl) totalEl.textContent='S/ '+this.total().toFixed(2);
    if(!body) return;
    if(this.items.length===0){ body.innerHTML='<p class="muted" style="text-align:center;margin-top:30px">Tu carrito está vacío.</p>'; return; }
    body.innerHTML=this.items.map((x,i)=>`
      <div class="citem">
        <div class="citem__img">${x.img?`<img src="${x.img}" alt="">`:''}</div>
        <div><div class="citem__t">${x.name}</div><div class="citem__p">S/ ${x.price.toFixed(2)}</div></div>
        <button onclick="Cart.remove(${i})" aria-label="Quitar">&times;</button>
      </div>`).join('');
  }
};

function checkout(){
  if(Cart.items.length===0){ alert('Agrega productos antes de continuar.'); return; }
  const body=document.getElementById('cart-body');
  body.innerHTML=`<div style="text-align:center;padding:30px 10px">
    <div style="font-size:2.6rem">✅</div>
    <h3 style="margin:10px 0;color:var(--navy)">¡Pedido confirmado!</h3>
    <p class="muted" style="font-size:.9rem">Demo: en la versión final el pago se procesa con Niubiz / Mercado Pago / Izipay y el pedido entra automáticamente al CRM.</p></div>`;
  document.getElementById('cart-foot').style.display='none';
  Cart.items=[];
  const count=document.querySelector('.cart-count'); if(count) count.textContent='0';
}

/* ---------- Filtros de tienda ---------- */
function filterShop(cat, el){
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.product').forEach(p=>{
    p.style.display = (cat==='all'||p.dataset.cat===cat) ? '' : 'none';
  });
}

/* ---------- Formularios (CRM-ready) ----------
   En producción, fetch() a tu endpoint de HubSpot / n8n / webhook.
   Aquí mostramos el estado de éxito como demostración. */
function handleForm(e, msgId){
  e.preventDefault();
  // const data = Object.fromEntries(new FormData(e.target));
  // fetch('https://TU-CRM-O-WEBHOOK/endpoint', {method:'POST', body: JSON.stringify(data)})
  e.target.reset();
  const m=document.getElementById(msgId);
  if(m) m.classList.add('show');
  return false;
}

/* ---------- Recomendador con IA (demo) ---------- */
const Quiz = {
  step:0, answers:{},
  qs:[
    {q:'¿Para qué usarás más tus lentes?', opts:[['Pantallas / oficina','screen'],['Conducir','drive'],['Uso diario','daily'],['Sol / exterior','sun']]},
    {q:'¿Qué es lo más importante para ti?', opts:[['Visión nítida','sharp'],['Comodidad','comfort'],['Estética / delgadez','thin'],['Protección','protect']]}
  ],
  pick(val, el){
    el.parentElement.querySelectorAll('.qopt').forEach(o=>o.classList.remove('sel'));
    el.classList.add('sel');
    this.answers[this.step]=val;
    setTimeout(()=>this.next(),250);
  },
  next(){
    this.step++;
    if(this.step<this.qs.length){ this.render(); } else { this.result(); }
  },
  render(){
    const c=document.getElementById('quiz-body'); if(!c) return;
    const q=this.qs[this.step];
    c.innerHTML=`<div class="eyebrow" style="color:var(--teal)">Paso ${this.step+1} de ${this.qs.length}</div>
      <h3 style="font-size:1.4rem;margin:12px 0 6px">${q.q}</h3>
      <div class="quiz__opts">${q.opts.map(o=>`<div class="qopt" onclick="Quiz.pick('${o[1]}',this)">${o[0]}</div>`).join('')}</div>`;
  },
  result(){
    const map={
      screen:['Vimax Office + filtro luz azul','Diseñado para pantallas: reduce fatiga visual y descansa tus ojos.'],
      drive:['Vimax SE + antirreflejo premium','Máxima nitidez y menos reflejos al conducir de noche.'],
      daily:['Vimax Adaptative','Lente progresiva con IA que se adapta a tu día a día de PRATS.'],
      sun:['Lentes fotocromáticas + UV total','Se oscurecen al sol y protegen al 100% de los rayos UV.']
    };
    const r=map[this.answers[0]]||map.daily;
    const c=document.getElementById('quiz-body');
    c.innerHTML=`<div class="eyebrow" style="color:var(--teal)">Recomendación con IA</div>
      <h3 style="font-size:1.5rem;margin:12px 0 6px">${r[0]}</h3>
      <p style="color:rgba(255,255,255,.82)">${r[1]}</p>
      <div class="quiz__result show"><strong>Tecnología PRATS, 100% robotizada.</strong> Un asesor de Kalevisión te contactará para finalizar tu medida exacta.</div>
      <div style="display:flex;gap:12px;margin-top:20px;flex-wrap:wrap">
        <a href="tienda.html" class="btn btn--primary">Ver lentes recomendados</a>
        <button class="btn btn--ghost" onclick="Quiz.reset()">Volver a empezar</button>
      </div>`;
  },
  reset(){ this.step=0; this.answers={}; this.render(); }
};

/* ---------- Asistente flotante (demo) ---------- */
function aiAssistant(){
  alert('🤖 Asistente IA de Kalevisión\n\nDemo: aquí se abriría un chatbot 24/7 que responde dudas, recomienda lentes, agenda citas y captura leads automáticamente hacia tu CRM — sin intervención humana.');
}

/* ---------- Animaciones al hacer scroll ---------- */
function initReveal(){
  const els=document.querySelectorAll('.reveal');
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.12});
  els.forEach(el=>io.observe(el));
}

document.addEventListener('DOMContentLoaded',()=>{
  initReveal();
  Cart.render();
  if(document.getElementById('quiz-body')) Quiz.render();
});
