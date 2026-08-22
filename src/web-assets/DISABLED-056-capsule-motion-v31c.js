
if(!window.__gfcCapsuleMotionV31C){
  window.__gfcCapsuleMotionV31C=true;
  let replaying=false;
  let settling=false;
  let settleTimer=null;

  const style=document.createElement('style');
  style.textContent=`
    .anime-machine .capsule-display.gfc31-display .gfc31-ball{
      width:clamp(78px,21%,106px)!important;
      filter:drop-shadow(0 12px 10px #02061c91)!important;
      animation:none!important;
      transform-origin:50% 50%!important;
    }
    .anime-machine .capsule-display.gfc31-display .gfc31-ball.gfc31-new:not(.gfc31-dispensing){
      animation:gfc31-enter .46s cubic-bezier(.2,.9,.25,1.18)!important;
    }
    .anime-machine .capsule-display.gfc31-display .gfc31-ball.gfc31-dispensing{
      animation:gfc31-dispense .72s cubic-bezier(.42,0,.65,1) forwards!important;
    }
    @media(max-width:430px){
      .anime-machine .capsule-display.gfc31-display .gfc31-ball{width:clamp(72px,22%,90px)!important}
    }
  `;
  document.head.append(style);

  const layouts={
    1:[['50','2','-4']],
    2:[['39','2','-11'],['62','3','10']],
    3:[['29','2','-14'],['51','1','9'],['71','3','-8']],
    4:[['24','2','-14'],['46','1','9'],['69','3','-9'],['51','23','-5']],
    5:[['22','2','-15'],['44','1','9'],['67','3','-9'],['34','22','9'],['59','24','-11']],
    6:[['18','2','-15'],['39','1','10'],['61','2','-9'],['79','4','12'],['31','22','9'],['56','24','-11']],
    7:[['16','2','-15'],['36','1','10'],['57','2','-9'],['78','4','12'],['27','22','9'],['49','24','-11'],['70','25','13']]
  };

  const host=()=>document.querySelector('.capsule-display.gfc31-display')||document.querySelector('.capsule-display');

  function settle(randomize=false){
    if(settling)return;
    const h=host();
    if(!h)return;
    const balls=[...h.querySelectorAll('.gfc31-ball:not(.gfc31-dispensing)')].slice(0,7);
    const base=(layouts[balls.length]||layouts[7]).map(p=>[...p]);
    if(randomize&&base.length>2){
      const lower=base.slice(0,Math.ceil(base.length/2));
      const upper=base.slice(Math.ceil(base.length/2));
      lower.sort(()=>Math.random()-.5);
      upper.sort(()=>Math.random()-.5);
      base.splice(0,base.length,...lower,...upper);
    }
    settling=true;
    balls.forEach((b,i)=>{
      const p=base[i]||['50','2','0'];
      const jx=randomize?(Math.random()*3-1.5):0;
      const jy=randomize?(Math.random()*1.5):0;
      const jr=randomize?(Math.random()*8-4):0;
      b.style.setProperty('--x',`${Number(p[0])+jx}%`);
      b.style.setProperty('--y',`${Number(p[1])+jy}%`);
      b.style.setProperty('--rot',`${Number(p[2])+jr}deg`);
    });
    requestAnimationFrame(()=>{settling=false});
  }

  function animateKnob(trigger){
    const knob=trigger?.closest?.('.machine-knob')||trigger?.querySelector?.('.machine-knob')||document.querySelector('.machine-knob');
    if(!knob)return;
    try{
      knob.animate([
        {rotate:'0deg'},
        {rotate:'55deg',offset:.28},
        {rotate:'125deg',offset:.62},
        {rotate:'175deg',offset:1}
      ],{duration:1050,easing:'cubic-bezier(.24,.72,.22,1)',fill:'none'});
    }catch{}
  }

  function rollBalls(trigger){
    const h=host();
    if(!h)return Promise.resolve(false);
    const balls=[...h.querySelectorAll('.gfc31-ball:not(.gfc31-dispensing)')];
    if(!balls.length)return Promise.resolve(false);
    if(h.dataset.gfc31cRolling==='1')return window.__gfc31MotionPromise||Promise.resolve(false);

    h.dataset.gfc31cRolling='1';
    animateKnob(trigger);

    try{
      h.animate([
        {transform:'translate(0,0)'},
        {transform:'translate(-5px,2px)',offset:.14},
        {transform:'translate(6px,-2px)',offset:.29},
        {transform:'translate(-6px,2px)',offset:.46},
        {transform:'translate(5px,-1px)',offset:.64},
        {transform:'translate(-3px,1px)',offset:.82},
        {transform:'translate(0,0)',offset:1}
      ],{duration:1120,easing:'ease-in-out'});
    }catch{}

    const animations=[];
    balls.forEach((ball,idx)=>{
      try{ball.getAnimations().forEach(a=>a.cancel())}catch{}
      const rot=parseFloat(getComputedStyle(ball).getPropertyValue('--rot'))||0;
      const dir=idx%2===0?1:-1;
      const side1=dir*(20+(idx%3)*9);
      const side2=-dir*(29+((idx+1)%3)*8);
      const side3=dir*(15+(idx%2)*10);
      const up1=-(12+(idx%3)*7);
      const up2=-(34+((idx+2)%3)*9);
      const up3=-(10+(idx%2)*8);
      const spin=dir*(230+idx*48);
      try{
        const a=ball.animate([
          {transform:`translateX(-50%) translate(0px,0px) rotate(${rot}deg)`,offset:0},
          {transform:`translateX(-50%) translate(${side1}px,${up1}px) rotate(${rot+spin*.28}deg)`,offset:.20},
          {transform:`translateX(-50%) translate(${side2}px,${up2}px) rotate(${rot+spin*.60}deg)`,offset:.48},
          {transform:`translateX(-50%) translate(${side3}px,${up3}px) rotate(${rot+spin*.84}deg)`,offset:.73},
          {transform:`translateX(-50%) translate(0px,0px) rotate(${rot+spin}deg)`,offset:1}
        ],{duration:1080+idx*30,easing:'cubic-bezier(.32,.02,.2,1)'});
        animations.push(a.finished.catch(()=>{}));
      }catch{}
    });

    const promise=Promise.all(animations).then(()=>new Promise(r=>setTimeout(r,80))).then(()=>{
      settle(true);
      delete h.dataset.gfc31cRolling;
      return true;
    }).finally(()=>{
      if(window.__gfc31MotionPromise===promise)window.__gfc31MotionPromise=null;
    });
    window.__gfc31MotionPromise=promise;
    return promise;
  }

  document.addEventListener('click',e=>{
    const trigger=e.target.closest?.('.machine-knob,.knob-zone');
    if(!trigger)return;
    if(replaying){replaying=false;return}
    const h=host();
    if(!h||!h.querySelector('.gfc31-ball'))return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const replayTarget=trigger.matches?.('.machine-knob')?trigger:(trigger.querySelector?.('.machine-knob')||trigger);
    rollBalls(trigger).then(()=>{
      replaying=true;
      setTimeout(()=>{
        try{replayTarget.click()}catch{replaying=false}
      },40);
    });
  },true);

  new MutationObserver(muts=>{
    if(muts.some(m=>m.target?.closest?.('.capsule-display.gfc31-display')?.dataset?.gfc31cRolling==='1'))return;
    clearTimeout(settleTimer);
    settleTimer=setTimeout(()=>settle(false),120);
  }).observe(document.body,{childList:true,subtree:true});

  setTimeout(()=>settle(false),420);
}
