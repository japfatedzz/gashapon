
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.105.0/+esm';
const sb31d=createClient('https://tpckinppyknqbssiesej.supabase.co','sb_publishable_ik22BBTe5L9A8VyBpJbrrQ_9rsMwY05',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

if(!window.__gfcCapsuleVideoOverlayV31D){
  window.__gfcCapsuleVideoOverlayV31D=true;
  let active=null;
  let winnerId=null;
  let currentUserId=null;
  let cleanupTimer=null;

  const style=document.createElement('style');
  style.textContent=`
    .gfc31d-overlay{position:fixed;z-index:2147486200;overflow:hidden;pointer-events:none;border-radius:22px;contain:layout paint;will-change:opacity;opacity:1;transition:opacity .18s ease-out}
    .gfc31d-overlay.gfc31d-fade{opacity:0}
    .gfc31d-clone{position:absolute!important;inset:auto!important;bottom:auto!important;margin:0!important;animation:none!important;transition:none!important;will-change:transform,opacity;transform:none!important;filter:drop-shadow(0 10px 9px #02061c88)!important}
    .gfc31d-flash{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 72%,#c4f8ff22,transparent 46%);opacity:0;animation:gfc31d-flash .95s ease-out both}
    @keyframes gfc31d-flash{0%{opacity:0}20%{opacity:.9}100%{opacity:0}}
  `;
  document.head.append(style);

  const chamber=()=>document.querySelector('.capsule-display.gfc31-display')||document.querySelector('.capsule-display');
  const balls=host=>[...(host?.querySelectorAll('.gfc31-ball')||[])].filter(x=>!x.classList.contains('gfc31-dispensing')).slice(0,7);

  function clearOverlay(){
    clearTimeout(cleanupTimer);
    if(active?.overlay?.isConnected)active.overlay.remove();
    active=null;winnerId=null;
  }

  function cloneChamber(){
    const host=chamber();
    const live=balls(host);
    if(!host||!live.length)return null;
    const hr=host.getBoundingClientRect();
    if(hr.width<80||hr.height<80)return null;

    const overlay=document.createElement('div');
    overlay.className='gfc31d-overlay';
    Object.assign(overlay.style,{left:`${hr.left}px`,top:`${hr.top}px`,width:`${hr.width}px`,height:`${hr.height}px`});
    overlay.innerHTML='<div class="gfc31d-flash"></div>';

    const clones=[];
    live.forEach((src,idx)=>{
      const r=src.getBoundingClientRect();
      const c=src.cloneNode(true);
      c.classList.add('gfc31d-clone');
      c.classList.remove('gfc31-new','gfc31-dispensing');
      Object.assign(c.style,{
        left:`${r.left-hr.left}px`,top:`${r.top-hr.top}px`,width:`${r.width}px`,height:`${r.height}px`,
        transform:'none',opacity:'1'
      });
      overlay.appendChild(c);
      clones.push({el:c,id:src.dataset.gfc31Item||'',idx});
    });
    document.documentElement.appendChild(overlay);
    return {host,overlay,clones,rect:hr};
  }

  function rollKeyframes(i){
    const dir=i%2===0?1:-1;
    const band=i%3;
    const spin=dir*(300+i*44);
    const x1=dir*(18+band*9), y1=-(18+band*7);
    const x2=-dir*(34+band*13), y2=(band===1?6:-5);
    const x3=dir*(48-band*6), y3=-(28+(2-band)*6);
    const x4=-dir*(20+band*8), y4=10+band*3;
    return [
      {transform:'translate3d(0,0,0) rotate(0deg) scale(1)',offset:0},
      {transform:`translate3d(${x1}px,${y1}px,0) rotate(${spin*.22}deg) scale(1.015)`,offset:.18},
      {transform:`translate3d(${x2}px,${y2}px,0) rotate(${spin*.48}deg) scale(.99)`,offset:.40},
      {transform:`translate3d(${x3}px,${y3}px,0) rotate(${spin*.72}deg) scale(1.02)`,offset:.62},
      {transform:`translate3d(${x4}px,${y4}px,0) rotate(${spin*.9}deg) scale(.995)`,offset:.80},
      {transform:`translate3d(0,0,0) rotate(${spin}deg) scale(1)`,offset:1}
    ];
  }

  function playVideoLikeRoll(){
    if(active)return;
    const snapshot=cloneChamber();
    if(!snapshot)return;
    active=snapshot;
    winnerId=null;

    
    snapshot.clones.forEach(({el,idx})=>{
      el.animate(rollKeyframes(idx),{
        duration:980+idx*24,
        easing:'cubic-bezier(.28,.02,.2,1)',
        fill:'forwards'
      });
    });

    setTimeout(()=>{
      if(!active)return;
      const chosen=active.clones.find(x=>x.id&&x.id===winnerId)||active.clones[Math.floor(Math.random()*active.clones.length)];
      if(chosen?.el){
        const er=chosen.el.getBoundingClientRect();
        const or=active.overlay.getBoundingClientRect();
        const currentX=er.left-or.left;
        const centerX=or.width/2-er.width/2;
        const dx=centerX-currentX;
        chosen.el.animate([
          {transform:'translate3d(0,0,0) rotate(0deg) scale(1)',opacity:1},
          {transform:`translate3d(${dx*.45}px,28px,0) rotate(120deg) scale(.98)`,opacity:1,offset:.35},
          {transform:`translate3d(${dx}px,${or.height*.38}px,0) rotate(280deg) scale(.86)`,opacity:1,offset:.72},
          {transform:`translate3d(${dx}px,${or.height*.70}px,0) rotate(440deg) scale(.62)`,opacity:0}
        ],{duration:520,easing:'cubic-bezier(.38,.02,.56,1)',fill:'forwards'});
      }
    },1030);

    cleanupTimer=setTimeout(()=>{
      if(!active)return;
      active.overlay.classList.add('gfc31d-fade');
      setTimeout(()=>{
        if(active?.host)active.host.style.visibility='';
        clearOverlay();
      },190);
    },1650);
  }

  window.__gfc31dPlay=playVideoLikeRoll;
  document.addEventListener('click',e=>{
    if(e.target.closest?.('.machine-knob,.knob-zone'))playVideoLikeRoll();
  },true);

  sb31d.auth.getSession().then(({data})=>{currentUserId=data?.session?.user?.id||null});
  sb31d.auth.onAuthStateChange((_event,session)=>{currentUserId=session?.user?.id||null});

  sb31d.channel('gfc31d-wins')
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'wins'},payload=>{
      if(!active)return;
      if(currentUserId&&payload?.new?.user_id!==currentUserId)return;
      const id=payload?.new?.prize_item_id;
      if(id)winnerId=id;
    })
    .subscribe();

  window.addEventListener('resize',()=>{if(active){if(active.host)active.host.style.visibility='';clearOverlay()}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&active){if(active.host)active.host.style.visibility='';clearOverlay()}});
}
