window.MathJax={loader:{load:[]},tex:{inlineMath:[['$','$'],['\\(','\\)']],displayMath:[['$$','$$'],['\\[','\\]']]},svg:{fontCache:'local'},options:{enableMenu:false}};
document.addEventListener('DOMContentLoaded',()=>{
  const open=document.getElementById('show-solutions');
  const close=document.getElementById('hide-solutions');
  if(open)open.addEventListener('click',()=>document.querySelectorAll('details').forEach(d=>d.open=true));
  if(close)close.addEventListener('click',()=>document.querySelectorAll('details').forEach(d=>d.open=false));
});
window.addEventListener('beforeprint',()=>{document.querySelectorAll('details').forEach(d=>{d.dataset.printOpen=String(d.open);d.open=true})});
window.addEventListener('afterprint',()=>{document.querySelectorAll('details').forEach(d=>{d.open=d.dataset.printOpen==='true'})});
