
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.105.0/+esm';
const sb21=createClient('https://tpckinppyknqbssiesej.supabase.co','sb_publishable_ik22BBTe5L9A8VyBpJbrrQ_9rsMwY05',{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});

if(!window.__gfcSingleInventoryButtonV21){
  window.__gfcSingleInventoryButtonV21=true;
  let role21=null;
  let renderTimer=null;

  const style=document.createElement('style');
  style.textContent=`
    #gfc21InventoryBar{display:none;margin:14px auto 18px;width:min(980px,calc(100% - 24px));padding:0 2px;box-sizing:border-box}
    #gfc21InventoryBar.show{display:block}
    #gfc21InventoryBtn{width:100%;border:1px solid #63eaff66;border-radius:14px;background:linear-gradient(135deg,#4f67ff,#c148dc);color:#fff;padding:13px 16px;font:900 11px/1 ui-monospace,monospace;letter-spacing:.08em;box-shadow:0 10px 28px #0006,0 0 18px #765cff35;cursor:pointer}
    #gfc21InventoryBtn:active{transform:scale(.99)}
    [data-gfc21-staff-only="1"]{display:none!important}
    body.gfc21-staff [data-gfc21-staff-only="1"]{display:inline-flex!important}
  `;
  document.head.append(style);

  const isStaff=()=>role21==='admin'||role21==='master';
  const normalize=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();

  function ensureInventoryButton(){
    let bar=document.getElementById('gfc21InventoryBar');
    if(!bar){
      bar=document.createElement('div');
      bar.id='gfc21InventoryBar';
      bar.innerHTML='<button id="gfc21InventoryBtn" type="button">EDIT INVENTORY</button>';
      bar.querySelector('button').addEventListener('click',()=>{
        if(typeof window.__gfcOpenInventoryManager==='function'){
          window.__gfcOpenInventoryManager();
        }
      });
    }
    const main=document.querySelector('main')||document.body;
    if(bar.parentElement!==main)main.insertBefore(bar,main.firstChild);
    return bar;
  }

  function markStaffOnlyButtons(){
    for(const el of document.querySelectorAll('button,a,[role="button"]')){
      if(el.closest('#playerAccountV14,#gfc18Modal,#gfc19Modal'))continue;
      const text=normalize(el.textContent);
      if(text==='admin'||text==='player account'||text.includes('player account')){
        el.dataset.gfc21StaffOnly='1';
      }
    }
  }

  function render(){
    const staff=isStaff();
    ensureInventoryButton().classList.toggle('show',staff);
    document.body.classList.toggle('gfc21-staff',staff);
    markStaffOnlyButtons();
  }

  async function refreshRole(){
    const {data:session}=await sb21.auth.getSession();
    if(!session?.session){role21=null;render();return}
    const {data,error}=await sb21.rpc('current_app_role');
    role21=error?null:data;
    render();
  }

  new MutationObserver(()=>{
    clearTimeout(renderTimer);
    renderTimer=setTimeout(render,100);
  }).observe(document.body,{childList:true,subtree:true});

  sb21.auth.onAuthStateChange(()=>setTimeout(refreshRole,120));
  refreshRole();
}
