(() => {
if(document.getElementById("tamkeenA11y"))return;
const style=document.createElement("style");style.textContent=`
#tamkeenA11y{position:fixed;z-index:9999;bottom:18px;left:18px;font-family:Arial,sans-serif;color:#21183d;direction:rtl}
#tamkeenA11y .a11y-toggle{border:0;border-radius:50%;width:58px;height:58px;background:#5d45b7;color:white;font-size:25px;box-shadow:0 8px 24px #24134c44;cursor:pointer}
#tamkeenA11y .a11y-panel{display:none;width:min(300px,calc(100vw - 36px));margin-bottom:10px;padding:14px;background:#fff;border:1px solid #ddd5f0;border-radius:17px;box-shadow:0 12px 40px #24134c25}
#tamkeenA11y.open .a11y-panel{display:block}
#tamkeenA11y h2{font-size:16px;margin:0 0 10px}
#tamkeenA11y .a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#tamkeenA11y button.action{border:1px solid #e4def0;background:#f7f5fc;border-radius:10px;padding:10px 7px;font-size:12px;font-weight:700;cursor:pointer;color:#30205b}
#tamkeenA11y button.action:focus-visible,#tamkeenA11y button:focus-visible{outline:3px solid #9274e2;outline-offset:2px}
body.tamkeen-contrast{filter:grayscale(1) contrast(1.45)}
body.tamkeen-contrast a,body.tamkeen-contrast button{outline-color:#ff0}
body.tamkeen-readable{letter-spacing:.035em;line-height:2!important}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
`;document.head.append(style);
const root=document.createElement("div");root.id="tamkeenA11y";root.innerHTML=`<div class="a11y-panel" role="region" aria-label="أدوات تسهيل الاستخدام"><h2>أدوات تسهيل الاستخدام</h2><div class="a11y-grid"><button class="action" data-act="increase">تكبير الخط A+</button><button class="action" data-act="decrease">تصغير الخط A−</button><button class="action" data-act="contrast">تباين مرتفع</button><button class="action" data-act="spacing">وضوح القراءة</button><button class="action" data-act="read">اقرأ الصفحة 🔊</button><button class="action" data-act="stop">إيقاف الصوت ■</button><button class="action" data-act="clickread">النطق عند الضغط</button><button class="action" data-act="motion">تقليل الحركة</button></div><p id="a11yStatus" aria-live="polite" style="font-size:11px;margin:9px 0 0;color:#6d6383"></p></div><button class="a11y-toggle" type="button" aria-label="فتح أدوات تسهيل الاستخدام" aria-expanded="false">♿</button>`;
document.body.append(root);const toggle=root.querySelector(".a11y-toggle"),status=root.querySelector("#a11yStatus");let size=Number(localStorage.getItem("tamkeen_font_size")||100),clickRead=false;
function applySize(){
  const selectors="h1,h2,h3,h4,p,a,button,label,li,span,strong,small,input,textarea,select,summary";
  document.querySelectorAll(selectors).forEach(el=>{
    if(!el.dataset.tamkeenBaseFont){const base=parseFloat(getComputedStyle(el).fontSize);if(Number.isFinite(base))el.dataset.tamkeenBaseFont=String(base);}
    const base=Number(el.dataset.tamkeenBaseFont);if(base>0)el.style.fontSize=(base*size/100)+"px";
  });
  localStorage.setItem("tamkeen_font_size",size);
}
applySize();toggle.addEventListener("click",()=>{const open=root.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
function speak(text){if(!("speechSynthesis"in window)){status.textContent="المتصفح لا يدعم القراءة الصوتية.";return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=document.documentElement.lang==="en"?"en-US":"ar-EG";u.rate=.92;u.onerror=()=>status.textContent="تعذر تشغيل الصوت.";speechSynthesis.speak(u);status.textContent="جاري تشغيل القراءة...";}
root.querySelectorAll("[data-act]").forEach(btn=>btn.addEventListener("click",()=>{switch(btn.dataset.act){case"increase":size=Math.min(160,size+10);applySize();status.textContent="تم تكبير الخط.";break;case"decrease":size=Math.max(80,size-10);applySize();status.textContent="تم تصغير الخط.";break;case"contrast":document.body.classList.toggle("tamkeen-contrast");status.textContent="تم تبديل التباين.";break;case"spacing":document.body.classList.toggle("tamkeen-readable");status.textContent="تم تبديل وضع القراءة الواضحة.";break;case"read":{const main=document.querySelector("main")||document.body;const text=[...main.querySelectorAll("h1,h2,h3,p,li,label,button,a")].filter(el=>el.offsetParent!==null).map(el=>el.innerText.trim()).filter(Boolean).join(". ");speak(text.slice(0,12000));break;}case"stop":speechSynthesis?.cancel();status.textContent="تم إيقاف الصوت.";break;case"clickread":clickRead=!clickRead;btn.textContent=clickRead?"إيقاف النطق عند الضغط":"النطق عند الضغط";status.textContent=clickRead?"اضغط على فقرة أو عنوان لسماعها.":"تم إيقاف النطق عند الضغط.";break;case"motion":document.documentElement.classList.toggle("tamkeen-reduced-motion");status.textContent="تم تفعيل تفضيل تقليل الحركة لهذه الجلسة.";break;}}));
new MutationObserver(()=>applySize()).observe(document.body,{childList:true,subtree:true});
document.addEventListener("click",e=>{if(!clickRead||root.contains(e.target))return;const el=e.target.closest("p,h1,h2,h3,li,label");if(el&&el.innerText.trim())speak(el.innerText.trim());});
})();