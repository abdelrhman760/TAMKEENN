(() => {
const $ = (id) => document.getElementById(id);
$("year").textContent = new Date().getFullYear();
let fontSize = 16;
$("fontUp").addEventListener("click",()=>{fontSize=Math.min(30,fontSize+2);$("visualText").style.fontSize=fontSize+"px";});
$("fontDown").addEventListener("click",()=>{fontSize=Math.max(12,fontSize-2);$("visualText").style.fontSize=fontSize+"px";});
$("contrast").addEventListener("click",()=>document.body.classList.toggle("high-contrast"));
$("resetVisual").addEventListener("click",()=>{fontSize=16;$("visualText").style.fontSize="";document.body.classList.remove("high-contrast");$("visualStatus").textContent="تمت إعادة إعدادات العرض.";});
$("readText").addEventListener("click",()=>{const text=$("visualText").value.trim();if(!text){$("visualStatus").textContent="اكتب النص أولًا.";return;}if(!("speechSynthesis" in window)){$("visualStatus").textContent="ميزة القراءة الصوتية غير مدعومة في هذا المتصفح.";return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="ar-EG";u.rate=.9;u.onstart=()=> $("visualStatus").textContent="جاري قراءة النص...";u.onend=()=> $("visualStatus").textContent="انتهت القراءة.";u.onerror=()=> $("visualStatus").textContent="تعذرت القراءة الصوتية.";speechSynthesis.speak(u);});
$("stopRead").addEventListener("click",()=>{if("speechSynthesis" in window)speechSynthesis.cancel();$("visualStatus").textContent="تم إيقاف القراءة.";});
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;let recognition=null;
if(SpeechRecognition){recognition=new SpeechRecognition();recognition.continuous=true;recognition.interimResults=true;recognition.onresult=(e)=>{let finalText="";for(let i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal)finalText+=e.results[i][0].transcript+" ";}if(finalText)$("speechOutput").value+=finalText;};recognition.onerror=(e)=>$("speechStatus").textContent=e.error==="not-allowed"?"اسمح باستخدام الميكروفون من إعدادات المتصفح.":"حدث خطأ أثناء التعرّف على الكلام: "+e.error;recognition.onend=()=>{$("startSpeech").disabled=false;$("stopSpeech").disabled=true;if(!$("speechStatus").textContent.includes("خطأ")&&!$("speechStatus").textContent.includes("اسمح"))$("speechStatus").textContent="توقف الاستماع.";};}
$("startSpeech").addEventListener("click",()=>{if(!recognition){$("speechStatus").textContent="التعرّف على الكلام غير مدعوم هنا. جرّب Chrome أو Edge مع اتصال آمن (HTTPS أو localhost).";return;}recognition.lang=$("speechLang").value;try{recognition.start();$("startSpeech").disabled=true;$("stopSpeech").disabled=false;$("speechStatus").textContent="يستمع الآن...";}catch(e){$("speechStatus").textContent="التعرّف يعمل بالفعل أو تعذر تشغيله."; }});
$("stopSpeech").addEventListener("click",()=>recognition&&recognition.stop());
$("copySpeech").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("speechOutput").value);$("speechStatus").textContent="تم نسخ النص."; }catch(e){$("speechStatus").textContent="تعذر النسخ تلقائيًا؛ حدّد النص وانسخه يدويًا."; }});
$("clearSpeech").addEventListener("click",()=>{$("speechOutput").value="";$("speechStatus").textContent="تم مسح النص.";});
$("splitLearning").addEventListener("click",()=>{const raw=$("learningText").value.trim(),box=$("learningParts");box.replaceChildren();if(!raw){box.innerHTML='<p class="muted">أضف نصًا أولًا.</p>';return;}const parts=raw.split(/(?<=[.!؟?])\s+|\n+/).map(s=>s.trim()).filter(Boolean);const chunks=[];for(let i=0;i<parts.length;i+=3)chunks.push(parts.slice(i,i+3).join(" "));chunks.forEach((part,i)=>{const div=document.createElement("div");div.className="learning-part";const p=document.createElement("p");p.textContent=part;const b=document.createElement("button");b.className="btn soft";b.type="button";b.textContent="🔊 استمع لهذا الجزء";b.addEventListener("click",()=>{if(!("speechSynthesis"in window))return; speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(part);u.lang="ar-EG";speechSynthesis.speak(u);});div.append(p,b);box.append(div);});});
$("clearLearning").addEventListener("click",()=>{$("learningText").value="";$("learningParts").innerHTML='<p class="muted">الأجزاء المنظمة ستظهر هنا.</p>';});
const TASK_KEY="tamkeen_tasks_v1";let tasks=[];try{tasks=JSON.parse(localStorage.getItem(TASK_KEY)||"[]");if(!Array.isArray(tasks))tasks=[];}catch(e){tasks=[];}
function saveTasks(){try{localStorage.setItem(TASK_KEY,JSON.stringify(tasks));}catch(e){$("taskSummary").textContent="تعذر الحفظ على هذا الجهاز.";}}
function renderTasks(){const list=$("taskList");list.replaceChildren();tasks.forEach(t=>{const li=document.createElement("li");li.className="task-item"+(t.done?" done":"");const cb=document.createElement("input");cb.type="checkbox";cb.checked=t.done;cb.setAttribute("aria-label","تحديد المهمة كمكتملة");cb.addEventListener("change",()=>{t.done=cb.checked;saveTasks();renderTasks();});const span=document.createElement("span");span.textContent=t.text;const del=document.createElement("button");del.className="delete-task";del.type="button";del.textContent="حذف";del.addEventListener("click",()=>{tasks=tasks.filter(x=>x.id!==t.id);saveTasks();renderTasks();});li.append(cb,span,del);list.append(li);});const done=tasks.filter(t=>t.done).length;$("taskSummary").textContent=tasks.length?`أنجزت ${done} من ${tasks.length} مهمة.`:"لا توجد مهام بعد.";}
$("taskForm").addEventListener("submit",e=>{e.preventDefault();const v=$("taskInput").value.trim();if(!v)return;tasks.push({id:Date.now()+Math.random(),text:v,done:false});saveTasks();$("taskInput").value="";renderTasks();$("taskInput").focus();});
$("clearCompleted").addEventListener("click",()=>{tasks=tasks.filter(t=>!t.done);saveTasks();renderTasks();});renderTasks();
const WORK_KEY="tamkeen_work_v1";let work={checks:[],notes:""};try{work={...work,...JSON.parse(localStorage.getItem(WORK_KEY)||"{}")};}catch(e){}
const checks=[...document.querySelectorAll('#workChecklist input')];checks.forEach(c=>{c.checked=(work.checks||[]).includes(c.value);c.addEventListener("change",updateProgress);});$("workNotes").value=work.notes||"";
function updateProgress(){const count=checks.filter(c=>c.checked).length;const pct=Math.round(count/checks.length*100);$("workProgress").textContent=pct+"%";$("workProgressBar").style.width=pct+"%";}
$("saveWork").addEventListener("click",()=>{work={checks:checks.filter(c=>c.checked).map(c=>c.value),notes:$("workNotes").value};try{localStorage.setItem(WORK_KEY,JSON.stringify(work));$("workStatus").textContent="تم حفظ تقدمك على هذا الجهاز.";}catch(e){$("workStatus").textContent="تعذر الحفظ على هذا الجهاز.";}});
updateProgress();

// Local learning assistant: organizes the learner's own text into digestible parts.
const smartInput=document.getElementById("smartInput");
if(smartInput){
  const result=document.getElementById("smartResult");
  document.getElementById("simplifyBtn").addEventListener("click",()=>{
    const raw=smartInput.value.trim();result.replaceChildren();
    if(!raw){const p=document.createElement("p");p.className="muted";p.textContent="اكتب أو الصق المحتوى أولًا.";result.append(p);return;}
    const sentences=raw.split(/(?<=[.!؟?])\s+|\n+/).map(s=>s.trim()).filter(Boolean);
    const heading=document.createElement("h3");heading.textContent="الشرح المنظم";result.append(heading);
    const intro=document.createElement("p");intro.textContent="قسّمنا المحتوى إلى أفكار قصيرة لتسهيل قراءته. راجع النص الأصلي للتأكد من التفاصيل.";result.append(intro);
    const list=document.createElement("ol");sentences.forEach(s=>{const li=document.createElement("li");li.textContent=s;list.append(li);});result.append(list);
    const count=document.createElement("p");count.className="muted";count.textContent=`عدد الأفكار: ${sentences.length} · عدد الكلمات: ${raw.split(/\s+/).length}`;result.append(count);
    const read=document.createElement("button");read.type="button";read.className="btn soft";read.textContent="🔊 استمع للشرح";read.addEventListener("click",()=>{if(!("speechSynthesis"in window))return; speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sentences.join(". "));u.lang="ar-EG";speechSynthesis.speak(u);});result.append(read);
  });
  document.getElementById("clearSmart").addEventListener("click",()=>{smartInput.value="";result.replaceChildren();const p=document.createElement("p");p.className="muted";p.textContent="ستظهر هنا نسخة منظمة من المحتوى.";result.append(p);});
}

})();