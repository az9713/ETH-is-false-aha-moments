/* Exact finite teaching constructions. SVG geometry uses the vendored D3 bundle. */
(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const palette={ink:'#e4ecef',muted:'#acbcc4',line:'#52636c',panel:'#18242b',
    yes:'#84d2cd',no:'#f2a6a6',gold:'#e6bd78',blue:'#a7bfff',purple:'#d4b2ef'};
  const data=window.ETH_VISUAL_DATA;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const make=(tag,attrs={},text)=>{
    const e=document.createElementNS(NS,tag);
    Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));
    if(text!==undefined)e.textContent=text;
    return e;
  };
  function add(svg,tag,attrs,text){const e=make(tag,attrs,text);svg.append(e);return e;}
  function label(svg,x,y,text,opts={}){
    return add(svg,'text',{x,y,fill:palette.ink,'font-size':17,...opts},text);
  }
  function line(svg,x1,y1,x2,y2,color=palette.line,width=2,opts={}){
    return add(svg,'line',{x1,y1,x2,y2,stroke:color,'stroke-width':width,...opts});
  }
  function box(svg,x,y,w,h,text,color=palette.ink){
    add(svg,'rect',{x,y,width:w,height:h,rx:9,fill:palette.panel,stroke:color,'stroke-width':2});
    if(text)label(svg,x+w/2,y+h/2+6,text,{'text-anchor':'middle',fill:color});
  }
  function wire(svg,points,value=undefined){
    return add(svg,'path',{d:d3.line()(points),fill:'none',stroke:value===undefined?palette.line:(value?palette.yes:palette.no),
      'stroke-width':value===undefined?2:3,'stroke-linejoin':'round','data-value':value??''});
  }
  function begin(id,w=800,h=380){
    const svg=document.querySelector(`#${id} svg`);svg.replaceChildren();
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    add(svg,'title',{},svg.dataset.title||'Mathematical explanation');
    return svg;
  }
  function pulse(svg){
    if(reduced.matches||!svg.animate)return;
    svg.querySelectorAll('[data-value]').forEach(e=>e.animate([{opacity:.35},{opacity:1}],{duration:420,fill:'none'}));
  }
  function readout(id,text){document.querySelector(`#${id} .visual-status`).textContent=text;}
  function controls(id,max,initial,render){
    const figure=document.getElementById(id);let step=initial,timer=null;
    const play=figure.querySelector('[data-action="play"]');
    function stop(){if(timer)clearInterval(timer);timer=null;if(play)play.textContent='Play';}
    function show(s){step=((s%(max+1))+(max+1))%(max+1);figure.dataset.step=step;render(step);}
    figure.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
      const action=button.dataset.action;
      if(action==='play'){
        if(timer){stop();return;}
        play.textContent='Pause';timer=setInterval(()=>{
          if(step===max){stop();return;}show(step+1);
        },1500);
      }else{stop();show(action==='reset'?initial:step+(action==='prev'?-1:1));}
    }));
    figure.addEventListener('focusout',()=>{});
    figure.querySelectorAll('[data-pick]').forEach(b=>b.addEventListener('click',()=>{stop();show(+b.dataset.pick);}));
    window.addEventListener('beforeprint',()=>{stop();render(['visual-hermite','visual-parity','visual-refutation'].includes(id)?max:initial,true);});
    window.addEventListener('afterprint',()=>render(step));
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
    show(initial);return {show};
  }
  function circuit(step){
    const svg=begin('visual-circuit',800,430),row=data.circuit[step],b=row.bits;
    label(svg,24,30,'ONE ASSIGNMENT → LITERALS → OR CLAUSES → AND',{'font-size':15,fill:palette.muted});
    const ys=[90,210,330];
    ['x','y','z'].forEach((name,i)=>box(svg,25,ys[i]-24,65,48,`${name}=${b[i]}`,b[i]?palette.yes:palette.no));
    const lit=[b[0],b[1],1-b[0],b[2],1-b[1],1-b[2]];
    const names=['x','y','¬x','z','¬y','¬z'];
    const ypos=[65,110,175,220,285,330],src=[0,1,0,2,1,2];
    ypos.forEach((y,i)=>{
      wire(svg,[[90,ys[src[i]]],[120+i*8,ys[src[i]]],[120+i*8,y],[210,y]],b[src[i]]);
      box(svg,210,y-16,75,32,`${names[i]}=${lit[i]}`,lit[i]?palette.yes:palette.no);
      const portY=90+Math.floor(i/2)*110+(i%2?11:-11);
      wire(svg,[[285,y],[335,y],[335,portY],[380,portY]],lit[i]);
    });
    ['x ∨ y','¬x ∨ z','¬y ∨ ¬z'].forEach((name,i)=>{
      const y=90+110*i,v=row.clauses[i];
      box(svg,380,y-29,145,58,`OR → ${v}`,v?palette.yes:palette.no);
      label(svg,452,y+53,name,{'text-anchor':'middle','font-size':15,fill:palette.muted});
      wire(svg,[[525,y],[575+i*12,y],[575+i*12,190+i*16],[630,190+i*16]],v);
    });
    box(svg,630,168,140,90,`AND → ${row.output}`,row.output?palette.yes:palette.no);
    label(svg,700,291,row.output?'SATISFIES F':'FAILS F',{'text-anchor':'middle','font-size':16,fill:row.output?palette.yes:palette.no});
    data.circuit.forEach((r,i)=>{
      const x=68+i*89;
      box(svg,x-32,376,68,36,r.bits.join(''),i===step?palette.gold:(r.output?palette.yes:palette.line));
      if(r.output)label(svg,x+2,366,'valid',{'font-size':12,'text-anchor':'middle',fill:palette.yes});
    });
    readout('visual-circuit',`Assignment ${b.join('')}: clause values ${row.clauses.join(', ')}; F=${row.output}. Only 010 and 101 satisfy the formula. One circuit evaluation checks one assignment; it is not the subexponential solver.`);
    pulse(svg);
  }
  function axes(svg,{x,y,w,h,xTicks,yTicks,xLabel,yLabel}){
    line(svg,x,y+h,x+w,y+h);line(svg,x,y,x,y+h);
    xTicks.forEach(([pos,t])=>{line(svg,pos,y+h,pos,y+h+6);label(svg,pos,y+h+25,t,{'font-size':13,'text-anchor':'middle',fill:palette.muted});});
    yTicks.forEach(([pos,t])=>{line(svg,x-5,pos,x+w,pos,palette.line,1,{'stroke-dasharray':'3 5',opacity:.5});label(svg,x-12,pos+5,t,{'font-size':13,'text-anchor':'end',fill:palette.muted});});
    label(svg,x+w/2,y+h+53,xLabel,{'font-size':15,'text-anchor':'middle',fill:palette.muted});
    label(svg,x,y-17,yLabel,{'font-size':15,fill:palette.muted});
  }
  function growth(step){
    const svg=begin('visual-growth',800,430),sx=d3.scaleLinear().domain([4,40]).range([78,760]),sy=d3.scaleLinear().domain([0,1.05]).range([310,55]);
    axes(svg,{x:78,y:55,w:682,h:255,xTicks:[4,10,20,30,40].map(v=>[sx(v),String(v)]),yTicks:[0,.25,.5,.75,1].map(v=>[sy(v),String(v)]),xLabel:'log₂ n  (n doubles for each +1)',yLabel:'effective exponent = log₂(time) / n'});
    const curves=[{name:'2ⁿ',c:palette.no,f:()=>1},{name:'1.3ⁿ',c:palette.gold,f:()=>Math.log2(1.3)},
      {name:'2^√n',c:palette.yes,f:t=>2**(-t/2)},{name:'n³',c:palette.blue,f:t=>3*t/2**t}];
    curves.forEach((c,i)=>{
      const pts=Array.from({length:145},(_,j)=>{const t=4+j/4;return [sx(t),sy(c.f(t))];});
      add(svg,'path',{d:d3.line()(pts),fill:'none',stroke:c.c,'stroke-width':3,'stroke-dasharray':i===3?'7 4':'none'});
      const legend=label(svg,90+i*172,405,i===2?'':c.name,{fill:c.c,'font-size':17});
      if(i===2){legend.append(make('tspan',{},'2'));legend.append(make('tspan',{'baseline-shift':'super','font-size':12},'√n'));}
    });
    const t=[4,10,20,40][step];line(svg,sx(t),55,sx(t),310,palette.ink,1,{'stroke-dasharray':'4 4'});
    curves.forEach(c=>add(svg,'circle',{cx:sx(t),cy:sy(c.f(t)),r:4,fill:c.c}));
    readout('visual-growth',`n=2^${t}: exponent ratios are 1 for 2ⁿ, ${Math.log2(1.3).toFixed(4)} for 1.3ⁿ, ${(2**(-t/2)).toPrecision(3)} for 2^(√n), and ${(3*t/2**t).toPrecision(3)} for n³. The last two tend to zero; a smaller fixed positive rate is still exponential.`);
  }
  function summaries(step){
    const svg=begin('visual-summaries',800,360),s=step,items=data.fibers[String(s)];
    label(svg,400,30,'TOY CROSS-GROUP RULE: sum(A) = sum(B)',{'text-anchor':'middle','font-size':17,fill:palette.gold});
    ['A: two bits','B: two bits'].forEach((name,i)=>{
      const x=i?500:25;box(svg,x,65,275,190,'');label(svg,x+137,95,name,{'text-anchor':'middle',fill:palette.blue});
      ['00','01','10','11'].forEach((b,j)=>{
        const good=items.includes(b),xx=x+31+(j%2)*125,yy=122+Math.floor(j/2)*67;
        box(svg,xx,yy,90,40,b,good?palette.yes:palette.line);
        if(good)label(svg,xx+45,yy+57,'retained',{'font-size':12,'text-anchor':'middle',fill:palette.yes});
      });
    });
    box(svg,335,125,130,64,`summary ${s}`,palette.gold);
    wire(svg,[[300,155],[335,155]]);wire(svg,[[465,155],[500,155]]);
    label(svg,400,282,`${items.length} local choices × ${items.length} local choices = ${items.length**2} global choices`,{'text-anchor':'middle',fill:palette.yes,'font-size':21});
    label(svg,400,322,'All summary values: 1 × 1  +  2 × 2  +  1 × 1  =  6',{'text-anchor':'middle','font-size':19});
    readout('visual-summaries',`Fix both group sums to ${s}. Each group permits {${items.join(', ')}}. Any retained A assignment combines with any retained B assignment. Summaries forget identities, but the local sums retain multiplicity.`);
    pulse(svg);
  }
  function hermite(step){
    const svg=begin('visual-hermite',800,425),sx=d3.scaleLinear().domain([0,1.8]).range([80,750]),sy=d3.scaleLinear().domain([-5,25]).range([320,50]);
    axes(svg,{x:80,y:50,w:670,h:270,xTicks:[0,.5,1,1.5].map(v=>[sx(v),String(v)]),yTicks:[0,8,16,24].map(v=>[sy(v),String(v)]),xLabel:'T — interpolation parameter',yLabel:'Polynomial value'});
    label(svg,sx(0)+14,step===3?sy(2)-20:sy(20),step===3?'H(0) = 2':'H(0) = ?',{'font-size':17,fill:palette.gold});
    if(step>=1){
      [1,3,5,7].forEach(a=>{
        if(step>=2&&a!==5)return;
        const pts=Array.from({length:91},(_,j)=>{const t=j*.02;return [sx(t),sy(8+11*(t-1)+a*(t-1)**2)];});
        add(svg,'path',{d:d3.line()(pts),fill:'none',stroke:a===5&&step>=2?palette.yes:palette.line,
          'stroke-width':a===5&&step>=2?3:1.5,opacity:step>=2&&a!==5?.3:1});
      });
      wire(svg,[[sx(.35),sy(8+11*(.35-1))],[sx(1.65),sy(8+11*(1.65-1))]]);
      label(svg,sx(1.2),sy(8)+12,'common slope 11',{'font-size':14,fill:palette.muted});
    }
    add(svg,'circle',{cx:sx(1),cy:sy(8),r:6,fill:palette.gold});label(svg,sx(1)+14,sy(8)-15,'H(1) = 8',{'font-size':17,fill:palette.gold});
    if(step===3)add(svg,'circle',{cx:sx(0),cy:sy(2),r:6,fill:palette.yes});
    const text=[
      'Knowing H(1)=8 alone leaves H(0) undetermined. No curve has been recovered yet.',
      'All four candidate quadratics have H(1)=8 and slope H′(1)=11, but different values at zero. Value and slope are still insufficient.',
      'The z² coefficient of H(1+z) is 5. This selects H(1+z)=8+11z+5z² from the candidate family.',
      'Now set z=−1, corresponding to T=0. Exact recovery gives H(0)=8−11+5=2. The visual shows recovery, not how the research solver obtains its data.'
    ];label(svg,400,402,`Information stage ${step+1} of 4`,{'text-anchor':'middle','font-size':16,fill:palette.yes});
    readout('visual-hermite',text[step]);
  }
  function spectral(step){
    const svg=begin('visual-spectral',800,410),spec=data.spectral,win=spec.windows[step],sx=d3.scaleLinear().domain([15,75]).range([78,760]),sy=d3.scaleLinear().domain([0,.08]).range([285,65]);
    axes(svg,{x:78,y:65,w:682,h:220,xTicks:[15,30,45,60,75].map(v=>[sx(v),String(v)]),yTicks:[0,.04,.08].map(v=>[sy(v),String(v)]),xLabel:'j — number of negative swap eigenvalues',yLabel:'Fraction of product-basis directions'});
    for(let j=15;j<=75;j++){
      const p=spec.probabilities[j],inside=j>=win.lo&&j<=win.hi;
      add(svg,'rect',{x:sx(j)-4.5,y:sy(p),width:9,height:285-sy(p),fill:inside?palette.yes:palette.gold});
    }
    label(svg,400,30,`Q=120, r=4, negative-eigenvalue fraction = 3/8`,{'text-anchor':'middle','font-size':16,fill:palette.muted});
    line(svg,sx(win.lo)-5,58,sx(win.hi)+5,58,palette.yes,3);
    label(svg,400,370,`R=${win.width}; degree ≤ ${win.degree}; exceptional fraction ${(100*win.exceptional).toPrecision(4)}%`,{'text-anchor':'middle',fill:palette.yes,'font-size':20});
    readout('visual-spectral',`Retain j=${win.lo} through ${win.hi} using a degree-at-most-${win.degree} interpolation polynomial. Teal directions are fixed; gold directions require measurements. Increasing R reduces exceptions but increases interpolation degree. Tails outside the displayed range are included in the exact fraction.`);
  }
  function maskName(mask){return [1,2,3].filter((_,j)=>(mask>>j)&1).map(i=>`v${i}`).join(' ⊕ ');}
  function parity(step){
    const svg=begin('visual-parity',800,470),row=data.parity[step],alive=new Set(row.survivors);
    label(svg,25,30,'TOY FORMULA: x ∧ y ∧ z.  Violation bits: (1−x, 1−y, 1−z)',{'font-size':16,fill:palette.muted});
    for(let a=0;a<8;a++){
      const b=data.circuit[a].bits,x=30+(a%4)*112,y=80+Math.floor(a/4)*115;
      box(svg,x,y,92,60,b.join(''),alive.has(a)?palette.yes:palette.line);
      label(svg,x+46,y+83,`v=${b.map(v=>1-v).join('')}`,{'text-anchor':'middle','font-size':13,fill:alive.has(a)?palette.muted:palette.line});
      if(a===7)label(svg,x+46,y-10,'genuine',{'text-anchor':'middle','font-size':13,fill:palette.gold});
    }
    label(svg,530,65,step===3?'All tests preserve 111':'Candidate next equation',{'font-size':15});
    row.candidates.forEach((c,i)=>{
      const y=100+i*38,color=step<3&&c.mask===row.next?palette.gold:palette.muted;
      label(svg,530,y,`${maskName(c.mask)} = 0`,{'font-size':16,fill:color});
      label(svg,762,y,String(c.count),{'text-anchor':'end','font-size':17,fill:color});
    });
    label(svg,25,374,`Selected: ${row.filters.length?row.filters.map(m=>maskName(m)+'=0').join('; '):'none'}`,{'font-size':16,fill:palette.gold});
    label(svg,400,425,`Total survivors: ${row.survivors.length}  |  8 → 4 → 2 → 1`,{'text-anchor':'middle',fill:palette.yes,'font-size':22});
    readout('visual-parity',step===3?'Three greedy choices leave only 111, the genuine solution. Candidate ranking used only total surviving counts. This finite example enumerates every test; the paper needs its separate sparse-test construction and cost bounds.':`Round ${step}: count survivors for all seven nonempty parity tests. The highlighted candidate minimizes the total; ties use numeric mask order. Genuine solutions pass every candidate, so the unknown genuine count is the same offset in every comparison.`);
    pulse(svg);
  }
  function tensor(step){
    const svg=begin('visual-tensor',800,475),row=data.circuit[[2,5,0][step]],b=row.bits;
    label(svg,25,30,'FACTOR GRAPH: equality tables share variables; clause tables check constraints',{'font-size':15,fill:palette.muted});
    const gy=[95,190,285],clauses=['x ∨ y','¬x ∨ z','¬y ∨ ¬z'],pairs=[[0,1],[0,2],[1,2]];
    ['x','y','z'].forEach((n,i)=>box(svg,35,gy[i]-25,110,50,`= ${n}: ${b[i]}`,b[i]?palette.yes:palette.no));
    pairs.forEach((vars,c)=>vars.forEach((v,j)=>{const channel=205+(2*c+j)*22;wire(svg,[[145,gy[v]],[channel,gy[v]],[channel,gy[c]+(j?10:-10)],[390,gy[c]+(j?10:-10)]],b[v]);}));
    clauses.forEach((n,i)=>box(svg,390,gy[i]-29,205,58,`${n} → ${row.clauses[i]}`,row.clauses[i]?palette.yes:palette.no));
    box(svg,640,145,125,90,`product ${row.output}`,row.output?palette.yes:palette.no);
    label(svg,702,130,'readout',{'text-anchor':'middle','font-size':13,fill:palette.muted});
    label(svg,400,336,'Contraction sums the products over consistent bit assignments: total 2',{'text-anchor':'middle','font-size':16,fill:palette.gold});
    label(svg,25,381,'Separate research recursion: exponent budget by depth',{'font-size':15,fill:palette.muted});
    data.recursion.slice(0,5).forEach((v,d)=>{
      const x=30+d*148;
      add(svg,'rect',{x,y:405,width:125*v,height:16,rx:3,fill:palette.yes});
      label(svg,x,447,`d=${d}: ${v.toFixed(4)}`,{'font-size':14,fill:palette.muted});
    });
    readout('visual-tensor',`Assignment ${b.join('')} contributes ${row.output}. Equality tables require all ports of a variable to carry the same bit. The research proof contracts much larger networks recursively: each depth's exponent is multiplied by √2/8 ≈ 0.1768. The bars illustrate that bound, not a run of the research algorithm.`);
    pulse(svg);
  }
  function refutation(step){
    const svg=begin('visual-refutation',800,460);
    label(svg,400,30,'WHY THE CLAIMED GENERAL ALGORITHM WOULD REFUTE ETH',{'text-anchor':'middle','font-size':16,fill:palette.gold});
    const names=[['Any 3-CNF','all input formulas'],['Disjoint leaves','no double counting'],['Structured sums','exact recovery'],['Exact count','N = #F'],['Decide SAT','test N > 0']];
    names.forEach((rows,i)=>{
      const x=20+156*i,color=(step===0&&i===0)||(step===1&&i===1)||(step===2&&i===2)||(step===3&&i>=3)?palette.yes:palette.line;
      box(svg,x,77,135,90,'',color);
      label(svg,x+67,110,rows[0],{'text-anchor':'middle','font-size':16,fill:color===palette.line?palette.ink:color});
      label(svg,x+67,143,rows[1],{'text-anchor':'middle','font-size':12,fill:palette.muted});
      if(i<4){line(svg,x+135,122,x+155,122);label(svg,x+145,117,'›',{'text-anchor':'middle','font-size':21,fill:palette.muted});}
    });
    box(svg,25,215,750,90,'',step===4?palette.gold:palette.line);
    label(svg,400,245,'EVERY COST MUST BE INCLUDED',{'text-anchor':'middle','font-size':16,fill:palette.gold});
    label(svg,400,276,'leaves + Taylor corrections + summaries + group scans + bit arithmetic',{'text-anchor':'middle','font-size':16});
    label(svg,400,351,'The paper claims a polynomial input factor × 2 to the exponent g(n)',{'text-anchor':'middle','font-size':17,fill:step===4?palette.yes:palette.muted});
    label(svg,400,389,'g(n) / n = O((log log n)² / √log n) → 0',{'text-anchor':'middle','font-size':20,fill:step===4?palette.yes:palette.muted});
    label(svg,400,435,step===4?'If that guarantee holds, it contradicts ETH.':'Construction and resource bounds are research proof obligations.',{'text-anchor':'middle','font-size':18,fill:step===4?palette.gold:palette.muted});
    const statements=[
      'ETH is a worst-case claim about arbitrary 3-CNF formulas. An easy circuit example, a sparse subclass, or a finite truth table cannot refute it.',
      'The reduction must preserve every genuine solution and remove false positives, with disjoint leaves so counts add exactly. This generality is a cited part of the paper, not established by the toy diagrams.',
      'Shared summaries and Hermite recovery claim to aggregate assignments without scanning every global assignment. The paper must construct the required low-degree replacements and prove exact recovery.',
      'Given an exact general count N, deciding SAT needs only the test N>0. That elementary implication is proved in this tutorial. Counting does not require listing the solutions.',
      'The decisive point is total cost: g(n)/n tends to zero. For every fixed positive exponential rate δ, the normalized exponent is eventually smaller. A deterministic general 3-SAT algorithm with this bound is what ETH forbids. The research guarantee remains attributed, not independently certified here.'
    ];readout('visual-refutation',statements[step]);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    if(!data||!window.d3)return;
    controls('visual-circuit',7,2,circuit);
    controls('visual-growth',3,0,growth);
    controls('visual-summaries',2,1,summaries);
    controls('visual-hermite',3,0,hermite);
    controls('visual-spectral',2,1,spectral);
    controls('visual-parity',3,0,parity);
    controls('visual-tensor',2,0,tensor);
    controls('visual-refutation',4,0,refutation);
    window.ETH_VISUALS={circuit,growth,summaries,hermite,spectral,parity,tensor,refutation,ready:true};
  });
})();
