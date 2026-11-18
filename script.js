const $=id=>document.getElementById(id), exprEl=$('expr'), answerEl=$('answer');
let expr='',lastAnswer=0,memory=0,deg=true,history=[];
function display(){exprEl.textContent=expr;let v=calc(false);if(expr==='')answerEl.textContent='0';else if(v!==null)answerEl.textContent=fmt(v)}
function fmt(v){return Number(v.toPrecision(11)).toString()}
function factorial(n){if(n<0||n>170||!Number.isInteger(n))throw Error();let r=1;for(let i=2;i<=n;i++)r*=i;return r}
function calc(showError=true){
 if(!expr.trim())return 0;
 try{
  let s=expr.replace(/π/g,'Math.PI').replace(/\bpi\b/g,'Math.PI').replace(/\be\b/g,'Math.E')
   .replace(/sqrt\(/g,'Math.sqrt(').replace(/sin\(/g,'Math.sin(').replace(/cos\(/g,'Math.cos(').replace(/tan\(/g,'Math.tan(').replace(/log\(/g,'Math.log10(').replace(/ln\(/g,'Math.log(')
   .replace(/\^2/g,'**2').replace(/\^/g,'**').replace(/(\d+(?:\.\d+)?)%/g,'($1/100)');
  if(deg)s=s.replace(/Math\.(sin|cos|tan)\(([^()]*)\)/g,(m,f,a)=>`Math.${f}((${a})*Math.PI/180)`);
  s=s.replace(/(\d+(?:\.\d+)?)!/g,(m,n)=>factorial(Number(n)));
  if(!/^[0-9+\-*/().,\sA-Za-z]*$/.test(s))throw Error();
  const v=Function('"use strict";return ('+s+')')();
  if(typeof v!=='number'||!Number.isFinite(v))throw Error();
  return v;
 }catch(e){if(showError)answerEl.textContent='Error';return null}
}
function add(v){
 if(v==='AC'){expr='';display();return}
 if(v==='DEL'){expr=expr.slice(0,-1);display();return}
 if(v==='ANGLE'){deg=!deg;$('angleMode').textContent=deg?'DEG':'RAD';display();return}
 if(v==='HIST'){openHistory();return}
 if(v==='M+'){let n=calc();if(n!==null)memory+=n;return}
 if(v==='M-'){let n=calc();if(n!==null)memory-=n;return}
 if(v==='MR'){expr+=fmt(memory);display();return}
 if(v==='MC'){memory=0;return}
 if(v==='ANS'){expr+=fmt(lastAnswer);display();return}
 if(v==='='){let n=calc();if(n===null){answerEl.textContent='Error';return}lastAnswer=n;history.unshift({e:expr,r:fmt(n)});history=history.slice(0,60);exprEl.textContent=expr+' =';expr=fmt(n);answerEl.textContent=fmt(n);return}
 if(v==='pi')v='π'; if(v==='^2')v='^2';
 expr+=v;display();
}
$('keys').addEventListener('click',e=>{let b=e.target.closest('button');if(b)add(b.dataset.v)});
function openHistory(){$('overlay').classList.add('open');renderHistory()}
function renderHistory(){$('historyList').innerHTML=history.length?history.map(h=>`<div class="item">${h.e}<b>${h.r}</b></div>`).join(''):'<div class="item">No calculations yet</div>'}
$('historyBtn').onclick=openHistory;$('closeHistory').onclick=()=>$('overlay').classList.remove('open');$('clearHistory').onclick=()=>{history=[];renderHistory()};
document.addEventListener('keydown',e=>{if(/^[0-9.+\-*/()%()]$/.test(e.key))add(e.key);else if(e.key==='Enter')add('=');else if(e.key==='Backspace')add('DEL');else if(e.key==='Escape')add('AC')});
