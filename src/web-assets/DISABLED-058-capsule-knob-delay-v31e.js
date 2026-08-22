
if(!window.__gfcKnobDelayV31E){
window.__gfcKnobDelayV31E=true;
let active=false,replay=false,knob=null,resolveMotion=null;
const findKnob=t=>t?.closest?.('.machine-knob')||t?.closest?.('.knob-zone')?.querySelector?.('.machine-knob')||t?.closest?.('.knob-zone')||null;
function finishMotion(){if(resolveMotion){resolveMotion();resolveMotion=null}window.__gfc31MotionPromise=null;window.__gfc31SkipLiveDispense=false;active=false;knob=null}
function start(k){if(active)return;active=true;knob=k;window.__gfc31SkipLiveDispense=true;window.__gfc31MotionPromise=new Promise(r=>{resolveMotion=r});window.__gfc31dPlay?.();setTimeout(()=>{if(!knob)return;replay=true;try{knob.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}))}finally{replay=false}},700);setTimeout(finishMotion,1600)}
function guard(e){const k=findKnob(e.target);if(!k)return;if(replay)return;e.preventDefault?.();e.stopImmediatePropagation?.();e.stopPropagation?.();if(!active)start(k)}
['pointerdown','pointerup','mousedown','mouseup','touchstart','touchend','click'].forEach(type=>window.addEventListener(type,guard,{capture:true,passive:false}));
}
