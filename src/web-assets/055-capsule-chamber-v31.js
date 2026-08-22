import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.105.0/+esm';
const sb31=createClient('https://tpckinppyknqbssiesej.supabase.co','sb_publishable_ik22BBTe5L9A8VyBpJbrrQ_9rsMwY05',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

if(!window.__gfcCapsuleChamberV31){
  window.__gfcCapsuleChamberV31=true;
  const S={machines:[],cats:[],items:[],machine:null,rows:[],urls:new Map(),timer:null,busy:false,rendering:false,channel:null};
  const norm=s=>String(s??'').replace(/\s+/g,' ').trim().toLowerCase();
  const visible=el=>{if(!el)return false;const st=getComputedStyle(el),r=el.getBoundingClientRect();return st.display!=='none'&&st.visibility!=='hidden'&&r.width>120&&r.height>100};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const css=document.createElement('style');
  css.textContent=`
  .anime-machine .capsule-display.gfc31-display{display:block!important;position:absolute!important;inset:18px 18px 48px!important;padding:0!important;overflow:hidden!important;pointer-events:none!important}
  .anime-machine .capsule-display.gfc31-display .inventory-capsule{display:none!important}
  .gfc31-ball{--x:50%;--y:30%;--rot:0deg;--h:280;position:absolute;left:var(--x);bottom:var(--y);width:clamp(56px,16%,82px);aspect-ratio:1;border-radius:50%;transform:translateX(-50%) rotate(var(--rot));filter:drop-shadow(0 7px 7px #02061c62);animation:gfc31-idle 3.6s ease-in-out infinite alternate;animation-delay:var(--delay,0s);will-change:transform;z-index:var(--z,2)}
  .gfc31-ball.gfc31-premium{filter:drop-shadow(0 7px 7px #02061c66) drop-shadow(0 0 10px #ffe36b66)}
  .gfc31-core{position:absolute;inset:13%;border-radius:44%;overflow:hidden;display:grid;place-items:center;z-index:1;background:radial-gradient(circle at 38% 32%,#fff9,transparent 24%),linear-gradient(145deg,hsl(var(--h) 88% 83% / .9),hsl(var(--h) 74% 58% / .64));box-shadow:inset 0 0 12px #fff7}
  .gfc31-core img{width:70%;height:70%;object-fit:contain;border-radius:20%;filter:saturate(.94) contrast(1.03);opacity:.78}
  .gfc31-core span{font-size:clamp(15px,4vw,23px);filter:drop-shadow(0 1px 2px #0003)}
  .gfc31-top,.gfc31-bottom{position:absolute;left:0;right:0;height:50%;z-index:3;border:2px solid #fffffff0;box-sizing:border-box;backdrop-filter:blur(.8px)}
  .gfc31-top{top:0;border-radius:999px 999px 10px 10px;background:linear-gradient(155deg,#ffffffcf 0 11%,hsl(var(--h) 82% 88% / .66) 20%,hsl(var(--h) 72% 65% / .58) 82%);box-shadow:inset 7px 8px 11px #fff8,inset -7px -8px 12px hsl(var(--h) 65% 30% / .18)}
  .gfc31-bottom{bottom:0;border-radius:10px 10px 999px 999px;background:linear-gradient(165deg,hsl(var(--h) 68% 71% / .62),hsl(var(--h) 76% 88% / .78));box-shadow:inset 7px -8px 11px #fff7,inset -7px 7px 12px hsl(var(--h) 65% 30% / .16)}
  .gfc31-seam{position:absolute;left:4%;right:4%;top:calc(50% - 3px);height:6px;border-radius:999px;z-index:5;background:linear-gradient(180deg,#fff,#d7dff4 48%,#8b95bb 52%,#fff);box-shadow:0 1px 3px #07102c66}
  .gfc31-glint{position:absolute;left:20%;top:14%;width:23%;height:13%;border-radius:999px;z-index:6;background:#fff;opacity:.68;transform:rotate(-28deg);filter:blur(.2px)}
  .gfc31-ball.gfc31-new{animation:gfc31-enter .46s cubic-bezier(.2,.9,.25,1.25),gfc31-idle 3.6s .46s ease-in-out infinite alternate}
  .gfc31-display.gfc31-shaking .gfc31-ball{animation:gfc31-jostle .62s ease-in-out both!important}
  .gfc31-ball.gfc31-dispensing{animation:gfc31-dispense .72s cubic-bezier(.42,0,.65,1) forwards!important;z-index:20!important}
  .gfc31-empty{position:absolute;inset:16% 8% 20%;display:grid;place-items:center;text-align:center;color:#c9d2ec;font:900 12px/1.5 ui-monospace,monospace;letter-spacing:.14em;border:1px dashed #ffffff35;border-radius:18px;background:#08122b55}
  @keyframes gfc31-idle{0%{transform:translateX(-50%) translateY(0) rotate(var(--rot))}100%{transform:translateX(-50%) translateY(-4px) rotate(calc(var(--rot) + 2deg))}}
  @keyframes gfc31-enter{0%{opacity:0;transform:translateX(-50%) translateY(-30px) scale(.7) rotate(calc(var(--rot) - 12deg))}72%{opacity:1;transform:translateX(-50%) translateY(5px) scale(1.05) rotate(calc(var(--rot) + 4deg))}100%{transform:translateX(-50%) translateY(0) scale(1) rotate(var(--rot))}}
  @keyframes gfc31-jostle{0%{transform:translateX(-50%) translate(0,0) rotate(var(--rot))}18%{transform:translateX(-50%) translate(-8px,-4px) rotate(calc(var(--rot) - 10deg))}38%{transform:translateX(-50%) translate(9px,-1px) rotate(calc(var(--rot) + 11deg))}58%{transform:translateX(-50%) translate(-5px,3px) rotate(calc(var(--rot) - 6deg))}78%{transform:translateX(-50%) translate(4px,-2px) rotate(calc(var(--rot) + 5deg))}100%{transform:translateX(-50%) translate(0,0) rotate(var(--rot))}}
  @keyframes gfc31-dispense{0%{opacity:1;transform:translateX(-50%) translate(0,0) scale(1) rotate(var(--rot))}38%{transform:translateX(-50%) translate(9px,18px) scale(.96) rotate(calc(var(--rot) + 24deg))}72%{opacity:1;transform:translateX(-50%) translate(-6px,105px) scale(.82) rotate(calc(var(--rot) + 80deg))}100%{opacity:0;transform:translateX(-50%) translate(0,205px) scale(.58) rotate(calc(var(--rot) + 150deg))}}
  @media(max-width:430px){.gfc31-ball{width:clamp(52px,17%,70px)}.anime-machine .capsule-display.gfc31-display{inset:14px 12px 44px!important}}
  `;
  document.head.append(css);

  const layouts={
    1:[['50%','20%','-3deg',6]],
    2:[['38%','14%','-9deg',5],['62%','15%','8deg',6]],
    3:[['31%','12%','-11deg',5],['52%','10%','7deg',6],['69%','24%','-6deg',4]],
    4:[['27%','12%','-12deg',5],['48%','9%','8deg',6],['68%','13%','-7deg',5],['48%','30%','-4deg',4]],
    5:[['25%','11%','-13deg',6],['47%','8%','7deg',7],['69%','12%','-7deg',6],['35%','31%','8deg',4],['60%','32%','-10deg',5]],
    6:[['22%','10%','-13deg',7],['43%','7%','8deg',8],['65%','11%','-7deg',7],['31%','31%','7deg',5],['53%','29%','-9deg',6],['72%','32%','11deg',4]],
    7:[['20%','10%','-13deg',8],['40%','7%','8deg',9],['60%','10%','-7deg',8],['77%','14%','10deg',7],['29%','31%','7deg',5],['50%','30%','-9deg',6],['69%','34%','11deg',4]]
  };

  const hueFor=name=>{const n=norm(name);if(n.includes('sticker'))return 316;if(n.includes('snack')||n.includes('food'))return 195;if(n.includes('toy'))return 267;if(n.includes('station'))return 42;if(n.includes('premium'))return 34;let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))%360;return h||280};
  const iconFor=name=>{const n=norm(name);if(n.includes('sticker'))return '✦';if(n.includes('snack')||n.includes('food'))return '◆';if(n.includes('toy'))return '★';if(n.includes('station'))return '✎';if(n.includes('premium'))return '✧';return '●'};
  const displayEl=()=>[...document.querySelectorAll('.capsule-display')].filter(visible).sort((a,b)=>b.getBoundingClientRect().width-a.getBoundingClientRect().width)[0]||document.querySelector('.capsule-display');

  async function signed(path){if(!path)return null;const hit=S.urls.get(path);if(hit&&hit.exp>Date.now())return hit.url;const {data,error}=await sb31.storage.from('prize-images').createSignedUrl(path,3600);if(error)return null;S.urls.set(path,{url:data.signedUrl,exp:Date.now()+3000000});return data.signedUrl}

  async function loadCatalog(){
    const [{data:m,error:me},{data:c,error:ce},{data:i,error:ie}]=await Promise.all([
      sb31.from('gashapon_machines').select('id,name,enabled,sort_order').order('sort_order',{ascending:true}),
      sb31.from('prizes').select('id,name,enabled,machine_id,created_at').order('created_at',{ascending:true}),
      sb31.from('prize_items').select('id,category_id,name,stock,enabled').order('created_at',{ascending:true})
    ]);
    if(me)throw me;if(ce)throw ce;if(ie)throw ie;S.machines=m||[];S.cats=c||[];S.items=i||[];
  }
  const catItems=id=>S.items.filter(i=>i.category_id===id);
  const total=id=>catItems(id).filter(i=>i.enabled).reduce((n,i)=>n+(Number(i.stock)||0),0);
  function poolHeading(){return [...document.querySelectorAll('h1,h2,h3,h4,h5')].find(h=>visible(h)&&norm(h.textContent)==='prize pool')||null}
  function poolRoot(){const h=poolHeading();if(!h)return null;let p=h.parentElement;for(let n=0;n<5&&p;n++,p=p.parentElement){const t=norm(p.textContent);if(t.includes('current machine')&&t.includes('prize pool')&&t.includes('left'))return p}return h.parentElement}
  function detectMachine(){const root=poolRoot();if(!root)return S.machines.find(m=>m.enabled)||S.machines[0]||null;let best=null,bestScore=-1;for(const m of S.machines){let score=0;for(const c of S.cats.filter(x=>x.machine_id===m.id)){const t=total(c.id),needle=norm(c.name);const found=[...root.querySelectorAll('article,div,button')].some(el=>visible(el)&&norm(el.textContent).includes(needle)&&norm(el.textContent).includes(`${t} left`));if(found)score++}if(score>bestScore){bestScore=score;best=m}}return best||S.machines.find(m=>m.enabled)||S.machines[0]||null}

  async function renderRows(rows,oldIds=new Set()){
    const host=displayEl();if(!host)return;
    S.rendering=true;
    host.classList.add('gfc31-display');
    if(!rows.length){host.innerHTML='<div class="gfc31-empty">SOLD OUT<br>NO CAPSULES AVAILABLE</div>';S.rendering=false;return}
    const urls=new Map();await Promise.all(rows.map(async r=>{if(r.item_image_path)urls.set(r.prize_item_id,await signed(r.item_image_path))}));
    const lay=layouts[Math.min(7,rows.length)]||layouts[7];
    host.innerHTML=rows.slice(0,7).map((r,idx)=>{const p=lay[idx]||['50%','20%','0deg',idx+2],h=hueFor(r.category_name),u=urls.get(r.prize_item_id),premium=norm(r.category_name).includes('premium'),fresh=!oldIds.has(r.prize_item_id);return `<div class="gfc31-ball ${premium?'gfc31-premium':''} ${fresh?'gfc31-new':''}" data-gfc31-item="${r.prize_item_id}" title="${esc(r.item_name)}" style="--x:${p[0]};--y:${p[1]};--rot:${p[2]};--z:${p[3]};--h:${h};--delay:${(-idx*.31).toFixed(2)}s"><span class="gfc31-core">${u?`<img src="${esc(u)}" alt="">`:`<span>${iconFor(r.category_name)}</span>`}</span><span class="gfc31-top"></span><span class="gfc31-bottom"></span><span class="gfc31-seam"></span><span class="gfc31-glint"></span></div>`}).join('');
    requestAnimationFrame(()=>{S.rendering=false});
  }

  async function refreshDisplay(){
    if(S.busy)return;S.busy=true;
    try{
      const {data:session}=await sb31.auth.getSession();if(!session?.session)return;
      await loadCatalog();const machine=detectMachine();if(!machine)return;const changed=S.machine?.id!==machine.id;S.machine=machine;
      const oldIds=changed?new Set():new Set(S.rows.map(r=>r.prize_item_id));
      const {data,error}=await sb31.rpc('get_machine_display_items',{p_machine_id:machine.id});if(error)throw error;
      S.rows=data||[];await renderRows(S.rows,oldIds);
    }catch(e){console.warn('Phase 3.1 chamber:',e?.message||e)}finally{S.busy=false}
  }

  function shake(){const host=displayEl();if(!host)return;host.classList.remove('gfc31-shaking');void host.offsetWidth;host.classList.add('gfc31-shaking');setTimeout(()=>host.classList.remove('gfc31-shaking'),680)}
  async function onWin(row){
    if(!S.machine||row?.machine_id!==S.machine.id)return;
    const skipLive=window.__gfc31SkipLiveDispense===true;
    if(window.__gfc31MotionPromise){try{await window.__gfc31MotionPromise}catch{}}
    const host=displayEl();const ball=host?.querySelector(`[data-gfc31-item="${CSS.escape(row.prize_item_id||'')}"]`);
    if(ball&&!skipLive){ball.classList.remove('gfc31-new');ball.classList.add('gfc31-dispensing')}
    setTimeout(refreshDisplay,720);
  }

  document.addEventListener('click',e=>{if(e.target.closest?.('.machine-knob,.knob-zone'))shake()},true);

  const observer=new MutationObserver(muts=>{
    if(S.rendering)return;
    if(muts.every(m=>m.target?.closest?.('.capsule-display.gfc31-display')))return;
    clearTimeout(S.timer);S.timer=setTimeout(refreshDisplay,260);
  });
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});

  S.channel=sb31.channel('gfc31-wins').on('postgres_changes',{event:'INSERT',schema:'public',table:'wins'},payload=>onWin(payload.new)).subscribe();
  sb31.auth.onAuthStateChange(()=>setTimeout(refreshDisplay,180));
  setTimeout(refreshDisplay,320);
}
