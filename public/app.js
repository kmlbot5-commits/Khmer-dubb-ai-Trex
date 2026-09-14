const $=id=>document.getElementById(id);
const fileInput=$("file"), drop=$("drop"), choose=$("choose"), start=$("start"), name=$("name");
let selected=null, uploaded=null;

choose.onclick=()=>fileInput.click();
fileInput.onchange=()=>setFile(fileInput.files[0]);
["dragenter","dragover"].forEach(e=>drop.addEventListener(e,x=>{x.preventDefault();drop.classList.add("drag")}));
["dragleave","drop"].forEach(e=>drop.addEventListener(e,x=>{x.preventDefault();drop.classList.remove("drag")}));
drop.addEventListener("drop",e=>setFile(e.dataTransfer.files[0]));

function setFile(f){
  if(!f || !f.type.startsWith("video/")) return alert("សូមជ្រើសរើស video file");
  selected=f; name.textContent=`🎞️ ${f.name} · ${(f.size/1024/1024).toFixed(1)} MB`; start.disabled=false;
}

start.onclick=async()=>{
  start.disabled=true; $("progress").classList.remove("hidden");
  const steps=[...document.querySelectorAll(".step")];
  const fd=new FormData(); fd.append("video",selected);
  steps.forEach((s,i)=>s.classList.toggle("active",i===0));
  try{
    const up=await fetch("/api/upload",{method:"POST",body:fd}).then(r=>r.json());
    if(!up.ok) throw new Error(up.error||"Upload failed");
    uploaded=up.filename;
    for(let i=1;i<steps.length;i++){
      steps.forEach((s,j)=>s.classList.toggle("active",j<=i));
      await new Promise(r=>setTimeout(r,550));
    }
    const out=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:uploaded,style:$("style").value})}).then(r=>r.json());
    $("script").value=out.script||"";
    $("result").classList.remove("hidden");
  }catch(e){alert(e.message)}
  start.disabled=false;
};

$("copy").onclick=async()=>{await navigator.clipboard.writeText($("script").value);$("copy").textContent="✓ Copied";setTimeout(()=>$("copy").textContent="📋 Copy Script",1200)};
$("new").onclick=()=>location.reload();
