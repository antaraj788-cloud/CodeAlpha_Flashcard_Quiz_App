
const starter=[
 {q:"What does HTML stand for?",a:"HyperText Markup Language"},
 {q:"Which language styles a web page?",a:"CSS"},
 {q:"What does CPU stand for?",a:"Central Processing Unit"}
];
let cards=JSON.parse(localStorage.getItem("studycards_v1")||"null")||starter;
let index=0, revealed=false, editing=-1;
const $=id=>document.getElementById(id);
function save(){localStorage.setItem("studycards_v1",JSON.stringify(cards));}
function render(){
 if(cards.length===0){index=0;$("question").textContent="No flashcards yet";$("answer").hidden=true;$("hint").textContent="Add a card using the form."; $("counter").textContent="0 / 0";}
 else{index=Math.max(0,Math.min(index,cards.length-1));$("question").textContent=cards[index].q;$("answer").textContent=cards[index].a;$("answer").hidden=!revealed;$("sideLabel").textContent=revealed?"ANSWER":"QUESTION";$("hint").textContent=revealed?"Great! Use Next to continue.":"Think of the answer, then reveal it.";$("counter").textContent=`${index+1} / ${cards.length}`;}
 $("totalLabel").textContent=`${cards.length} card${cards.length===1?"":"s"}`;
 $("prevBtn").disabled=cards.length<2;$("nextBtn").disabled=cards.length<2;$("showBtn").disabled=!cards.length;$("showBtn").textContent=revealed?"Hide answer":"Show answer";
 $("cardList").innerHTML=cards.length?cards.map((c,i)=>`<div class="item"><div><strong>${escapeHtml(c.q)}</strong><div class="small muted">${escapeHtml(c.a)}</div></div><div class="row"><button class="secondary" data-edit="${i}">Edit</button><button class="danger" data-delete="${i}">Delete</button></div></div>`).join(""):'<div class="empty">No cards yet. Create your first one above.</div>';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("cardForm").addEventListener("submit",e=>{e.preventDefault();const q=$("qInput").value.trim(),a=$("aInput").value.trim();if(!q||!a)return;if(editing>=0){cards[editing]={q,a};index=editing;}else{cards.push({q,a});index=cards.length-1;}save();$("cardForm").reset();editing=-1;$("formTitle").textContent="Create a flashcard";$("saveBtn").textContent="＋ Add card";$("cancelBtn").hidden=true;revealed=false;render();});
$("cancelBtn").onclick=()=>{editing=-1;$("cardForm").reset();$("formTitle").textContent="Create a flashcard";$("saveBtn").textContent="＋ Add card";$("cancelBtn").hidden=true;};
$("showBtn").onclick=()=>{revealed=!revealed;render();};
$("nextBtn").onclick=()=>{if(cards.length){index=(index+1)%cards.length;revealed=false;render();}};
$("prevBtn").onclick=()=>{if(cards.length){index=(index-1+cards.length)%cards.length;revealed=false;render();}};
$("cardList").addEventListener("click",e=>{const ed=e.target.dataset.edit,del=e.target.dataset.delete;if(ed!==undefined){editing=+ed;$("qInput").value=cards[editing].q;$("aInput").value=cards[editing].a;$("formTitle").textContent="Edit flashcard";$("saveBtn").textContent="Save changes";$("cancelBtn").hidden=false;window.scrollTo({top:0,behavior:"smooth"});}if(del!==undefined){const n=+del;if(confirm("Delete this flashcard?")){cards.splice(n,1);if(index>=cards.length)index=Math.max(0,cards.length-1);if(editing===n)editing=-1;save();revealed=false;render();}}});
render();
