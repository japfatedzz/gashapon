
if(!window.__gfcCapsuleMotionV31B){
  window.__gfcCapsuleMotionV31B=true;

  const style=document.createElement('style');
  style.textContent=`
    .anime-machine .capsule-display.gfc31-display .gfc31-ball{width:clamp(74px,20%,102px)!important;filter:drop-shadow(0 11px 9px #02061c88)!important}
    .anime-machine .capsule-display.gfc31-display .gfc31-ball:not(.gfc31-new):not(.gfc31-dispensing){animation:none!important}\n    .anime-machine .capsule-display.gfc31-display .gfc31-ball.gfc31-new:not(.gfc31-dispensing){animation:gfc31-enter .52s cubic-bezier(.2,.9,.25,1.18)!important}
    .anime-machine .capsule-display.gfc31-display.gfc31-shaking .gfc31-ball:not(.gfc31-dispensing){animation:none!important}
    .anime-machine .capsule-display.gfc31-display.gfc31b-rolling{animation:gfc31b-machine-shake 1.18s ease-in-out both}
    @keyframes gfc31b-machine-shake{0%,100%{transform:translate(0,0)}12%{transform:translate(-4px,1px)}25%{transform:translate(5px,-2px)}40%{transform:translate(-5px,2px)}56%{transform:translate(4px,-1px)}72%{transform:translate(-3px,1px)}86%{transform:translate(2px,0)}}
    @media(max-width:430px){.anime-machine .capsule-display.gfc31-display .gfc31-ball{width:clamp(68px,21%,86px)!important}}
  `;
  document.head.append(style);

  const layouts={
    1:[['50','2','-3']],
    2:[['40','2','-10'],['61','3','9']],
    3:[['29','2','-13'],['51','1','8'],['71','3','-7']],
    4:[['24','2','-13'],['46','1','8'],['68','3','-8'],['50','24','-4']],
    5:[['22','2','-14'],['44','1','8'],['66','3','-8'],['34','23','8'],['58','24','-10']],
    6:[['18','2','-14'],['39','1','9'],['61','2','-8'],['79','4','11'],['31','23','8'],['55','24','-10']],
    7:[['16','2','-14'],['36','1','9'],['57','2','-8'],['77','4','11'],['27','23','8'],['49','24','-10'],['69','25','12']]
  };

  const host=()=>document.querySelector('.capsule-display.gfc31-display')||document.querySelector('.capsule-display');

  function settle(randomize=false){
    const h=host();if(!h)return;
    const balls=[...h.querySelectorAll('.gfc31-ball:not(.gfc31-dispensing)')].slice(0,7);
    const base=(layouts[balls.length]||layouts[7]).map(x=>[...x]);
    if(randomize&&base.length>2){
      const first=base.shift();
      base.sort(()=>Math.random()-.5);
      base.unshift(first);
    }
    balls.forEach((b,i)=>{
      const p=base[i]||['50','2','0'];
      const jitterX=randomize?(Math.random()*4-2):0;
      const jitterY=randomize?(Math.random()*2):0;
      const jitterR=randomize?(Math.random()*8-4):0;
      b.style.setProperty('--x',`${Number(p[0])+jitterX}%`);
      b.style.setProperty('--y',`${Number(p[1])+jitterY}%`);
      b.style.setProperty('--rot',`${Number(p[2])+jitterR}deg`);
    });
  }

  function rollBalls(){
    const h=host();if(!h||h.dataset.gfc31bRolling==='1')return;
    const balls=[...h.querySelectorAll('.gfc31-ball:not(.gfc31-dispensing)')];
    if(!balls.length)return;
    h.dataset.gfc31bRolling='1';
    h.classList.remove('gfc31b-rolling');void h.offsetWidth;h.classList.add('gfc31b-rolling');

    balls.forEach((ball,idx)=>{
      ball.getAnimations().forEach(a=>{if(a.effect?.target===ball)a.cancel()});
      const rot=parseFloat(getComputedStyle(ball).getPropertyValue('--rot'))||0;
      const dir=idx%2===0?1:-1;
      const x1=dir*(16+(idx%3)*8);
      const x2=-dir*(24+((idx+1)%3)*8);
      const x3=dir*(10+(idx%2)*12);
      const y1=-(10+(idx%3)*8);
      const y2=-(28+((idx+2)%3)*10);
      const y3=-(7+(idx%2)*7);
      const spin=dir*(190+idx*42);
      ball.animate([
        {transform:`translateX(-50%) translate(0px,0px) rotate(${rot}deg)`,offset:0},
        {transform:`translateX(-50%) translate(${x1}px,${y1}px) rotate(${rot+spin*.30}deg)`,offset:.20},
        {transform:`translateX(-50%) translate(${x2}px,${y2}px) rotate(${rot+spin*.62}deg)`,offset:.47},
        {transform:`translateX(-50%) translate(${x3}px,${y3}px) rotate(${rot+spin*.86}deg)`,offset:.72},
        {transform:`translateX(-50%) translate(0px,0px) rotate(${rot+spin}deg)`,offset:1}
      ],{duration:1120+idx*38,easing:'cubic-bezier(.34,.03,.22,1)'});
    });

    setTimeout(()=>{
      settle(true);
      h.classList.remove('gfc31b-rolling');
      delete h.dataset.gfc31bRolling;
    },1450);
  }

  document.addEventListener('click',e=>{
    if(e.target.closest?.('.machine-knob,.knob-zone'))rollBalls();
  },true);

  let timer=null;
  new MutationObserver(()=>{
    clearTimeout(timer);timer=setTimeout(()=>settle(false),100);
  }).observe(document.body,{childList:true,subtree:true});

  setTimeout(()=>settle(false),450);
}
