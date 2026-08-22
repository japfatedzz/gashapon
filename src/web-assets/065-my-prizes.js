import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.105.0/+esm';
const sb22=createClient('https://tpckinppyknqbssiesej.supabase.co','sb_publishable_ik22BBTe5L9A8VyBpJbrrQ_9rsMwY05',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

if(!window.__gfcMyPrizesV22){
  window.__gfcMyPrizesV22=true;
  let currentUser=null;
  let currentRole=null;
  let renderTimer=null;
  const imageCache=new Map();

  const style=document.createElement('style');
  style.textContent=`
    #gfc22PlayerBar{display:none;margin:12px auto 14px;width:min(980px,calc(100% - 24px));padding:0 2px;box-sizing:border-box}
    #gfc22PlayerBar.show{display:block}
    #gfc22MyPrizesBtn{width:100%;border:1px solid #ffffff24;border-radius:14px;background:linear-gradient(135deg,#111a39,#1b2650);color:#fff;padding:12px 16px;font:900 11px/1 ui-monospace,monospace;letter-spacing:.08em;box-shadow:0 8px 22px #0005;cursor:pointer}
    #gfc22MyPrizesBtn:active{transform:scale(.99)}
    #gfc22Modal{position:fixed;inset:0;z-index:2147486000;background:#02040ad9;display:grid;place-items:center;padding:12px;backdrop-filter:blur(8px)}
    #gfc22Modal.gfc22-hide{display:none}
    .gfc22-panel{width:min(880px,96vw);max-height:90vh;overflow:auto;box-sizing:border-box;border:1px solid #63eaff38;border-radius:20px;background:linear-gradient(180deg,#111936,#070c1d);box-shadow:0 28px 90px #000a;padding:18px;position:relative;color:#fff}
    .gfc22-close{position:absolute;right:12px;top:12px;width:36px;height:36px;border:1px solid #ffffff25;border-radius:11px;background:#10182f;color:#fff;font-size:21px;cursor:pointer}
    .gfc22-tag{font:900 9px/1 ui-monospace,monospace;color:#6deaff;letter-spacing:.16em;margin-bottom:8px}
    .gfc22-title{margin:0 48px 4px 0;font-size:25px}
    .gfc22-sub{margin:0 0 14px;color:#9aa9c8;font-size:12px}
    .gfc22-summary{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 13px}
    .gfc22-chip{padding:6px 9px;border-radius:999px;border:1px solid #61eaff3d;color:#a6f4ff;background:#091228;font:800 9px/1 ui-monospace,monospace}
    .gfc22-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .gfc22-card{display:grid;grid-template-columns:88px minmax(0,1fr);gap:11px;border:1px solid #ffffff14;border-radius:14px;background:#091024;overflow:hidden;min-height:88px}
    .gfc22-pic{width:88px;height:100%;min-height:88px;background:#111936;display:grid;place-items:center;color:#71809f;font:800 8px/1 ui-monospace,monospace;overflow:hidden}
    .gfc22-pic img{width:100%;height:100%;object-fit:cover;cursor:zoom-in}
    .gfc22-body{padding:11px 11px 11px 0;min-width:0}
    .gfc22-name{font-size:14px;font-weight:850;overflow-wrap:anywhere}
    .gfc22-category{margin-top:4px;color:#c6d2ed;font-size:11px}
    .gfc22-meta{margin-top:6px;color:#8f9db9;font-size:10px;line-height:1.45}
    .gfc22-empty,.gfc22-loading{grid-column:1/-1;padding:32px 16px;text-align:center;border:1px dashed #ffffff20;border-radius:14px;color:#8997b4}
    .gfc22-error{grid-column:1/-1;padding:16px;border:1px solid #ff6f9650;border-radius:12px;color:#ffb3c6;background:#3a102050}
    .gfc22-photo{position:fixed;inset:0;z-index:2147486100;background:#000e;display:grid;place-items:center;padding:14px}
    .gfc22-photo.gfc22-hide{display:none}
    .gfc22-photowrap{max-width:min(1100px,96vw);max-height:92vh;display:flex;flex-direction:column;gap:8px;align-items:center}
    .gfc22-photowrap img{max-width:100%;max-height:84vh;object-fit:contain;border-radius:14px}
    .gfc22-photocap{font-weight:800}
    .gfc22-closephoto{border:1px solid #687ba8;background:#151d3b;color:#fff;border-radius:10px;padding:9px 12px;font:850 9px/1 ui-monospace,monospace;cursor:pointer}
    @media(max-width:720px){#gfc22Modal{padding:6px;place-items:stretch}.gfc22-panel{width:auto;max-height:none;height:calc(100vh - 12px);border-radius:18px;padding:17px 11px}.gfc22-list{grid-template-columns:1fr}.gfc22-card{grid-template-columns:80px minmax(0,1fr)}.gfc22-pic{width:80px}}
  `;
  document.head.append(style);

  document.body.insertAdjacentHTML('beforeend',`<div id="gfc22Modal" class="gfc22-hide" aria-hidden="true"><section class="gfc22-panel"><button id="gfc22Close" class="gfc22-close" type="button">×</button><div class="gfc22-tag">PLAYER COLLECTION</div><h2 class="gfc22-title">My Prizes</h2><p class="gfc22-sub">Every successful capsule draw is saved here.</p><div id="gfc22Summary" class="gfc22-summary"></div><div id="gfc22List" class="gfc22-list"></div></section></div><div id="gfc22Photo" class="gfc22-photo gfc22-hide"><div class="gfc22-photowrap"><img id="gfc22PhotoImg" alt="Prize"><div id="gfc22PhotoCap" class="gfc22-photocap"></div><button id="gfc22PhotoClose" class="gfc22-closephoto" type="button">CLOSE</button></div></div>`);

  const modal=document.getElementById('gfc22Modal');
  const list=document.getElementById('gfc22List');
  const summary=document.getElementById('gfc22Summary');
  const photo=document.getElementById('gfc22Photo');
  const photoImg=document.getElementById('gfc22PhotoImg');
  const photoCap=document.getElementById('gfc22PhotoCap');

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmt=t=>{try{return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(t))}catch{return String(t||'')}};

  async function signed(path){
    if(!path)return null;
    const hit=imageCache.get(path);
    if(hit&&hit.exp>Date.now())return hit.url;
    const {data,error}=await sb22.storage.from('prize-images').createSignedUrl(path,3600);
    if(error)return null;
    imageCache.set(path,{url:data.signedUrl,exp:Date.now()+3000000});
    return data.signedUrl;
  }

  function ensureButton(){
    let bar=document.getElementById('gfc22PlayerBar');
    if(!bar){
      bar=document.createElement('div');
      bar.id='gfc22PlayerBar';
      bar.innerHTML='<button id="gfc22MyPrizesBtn" type="button">MY PRIZES</button>';
      bar.querySelector('button').addEventListener('click',openModal);
    }
    const main=document.querySelector('main')||document.body;
    if(bar.parentElement!==main){
      const inventory=document.getElementById('gfc21InventoryBar');
      if(inventory?.parentElement===main)inventory.insertAdjacentElement('afterend',bar);
      else main.insertBefore(bar,main.firstChild);
    }
    bar.classList.toggle('show',!!currentUser&&['player','admin','master'].includes(currentRole));
    return bar;
  }

  async function loadWins(){
    if(!currentUser)return;
    list.innerHTML='<div class="gfc22-loading">Loading your prizes…</div>';
    summary.innerHTML='';
    const [{data:wins,error:we},{data:machines,error:me}]=await Promise.all([
      sb22.from('wins').select('id,prize_name,created_at,machine_id,user_id,category_name,item_name,item_image_path').eq('user_id',currentUser.id).order('created_at',{ascending:false}).limit(100),
      sb22.from('gashapon_machines').select('id,name')
    ]);
    if(we){list.innerHTML=`<div class="gfc22-error">${esc(we.message||'Unable to load prizes.')}</div>`;return}
    const machineMap=new Map((me?[]:(machines||[])).map(m=>[m.id,m.name]));
    const rows=wins||[];
    summary.innerHTML=`<span class="gfc22-chip">${rows.length} SAVED PRIZE${rows.length===1?'':'S'}</span>`;
    if(!rows.length){list.innerHTML='<div class="gfc22-empty">No prizes yet. Your successful capsule draws will appear here.</div>';return}
    const urls=new Map();
    await Promise.all(rows.map(async r=>{if(r.item_image_path)urls.set(r.id,await signed(r.item_image_path))}));
    list.innerHTML=rows.map(r=>{
      const name=r.item_name||r.prize_name||'Prize';
      const cat=r.category_name||'Prize';
      const machine=machineMap.get(r.machine_id)||'Gashapon';
      const url=urls.get(r.id);
      return `<article class="gfc22-card"><div class="gfc22-pic">${url?`<img src="${esc(url)}" data-gfc22-full="${esc(url)}" data-gfc22-caption="${esc(name)}" alt="${esc(name)}">`:'NO IMAGE'}</div><div class="gfc22-body"><div class="gfc22-name">${esc(name)}</div><div class="gfc22-category">${esc(cat)}</div><div class="gfc22-meta">${esc(machine)}<br>${esc(fmt(r.created_at))}</div></div></article>`;
    }).join('');
  }

  async function openModal(){
    if(!currentUser)return;
    modal.classList.remove('gfc22-hide');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    await loadWins();
  }

  function closeModal(){
    modal.classList.add('gfc22-hide');
    modal.setAttribute('aria-hidden','true');
    if(photo.classList.contains('gfc22-hide'))document.body.style.overflow='';
  }

  function openPhoto(url,cap){photoImg.src=url;photoCap.textContent=cap||'';photo.classList.remove('gfc22-hide')}
  function closePhoto(){photo.classList.add('gfc22-hide');photoImg.removeAttribute('src');if(modal.classList.contains('gfc22-hide'))document.body.style.overflow=''}

  document.getElementById('gfc22Close').addEventListener('click',closeModal);
  document.getElementById('gfc22PhotoClose').addEventListener('click',closePhoto);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal();const img=e.target.closest?.('[data-gfc22-full]');if(img)openPhoto(img.dataset.gfc22Full,img.dataset.gfc22Caption)});
  photo.addEventListener('click',e=>{if(e.target===photo)closePhoto()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!photo.classList.contains('gfc22-hide'))closePhoto();else if(!modal.classList.contains('gfc22-hide'))closeModal()}});

  async function refreshSession(){
    const {data}=await sb22.auth.getSession();
    currentUser=data?.session?.user||null;
    if(!currentUser){currentRole=null;ensureButton();return}
    const {data:role,error}=await sb22.rpc('current_app_role');
    currentRole=error?null:role;
    ensureButton();
  }

  new MutationObserver(()=>{
    clearTimeout(renderTimer);
    renderTimer=setTimeout(ensureButton,120);
  }).observe(document.body,{childList:true,subtree:true});

  sb22.auth.onAuthStateChange(()=>setTimeout(refreshSession,80));
  refreshSession();
}
