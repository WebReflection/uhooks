self.uhooks=function(e){"use strict";var t=Promise;let n=null,s=new Set;const c=e=>{const{$:t,r:n,h:s}=e;i(n)&&(a.get(s).delete(e),n()),i(e.r=t())&&a.get(s).add(e)},o=()=>{const e=s;s=new Set,e.forEach((({h:e,c:t,a:n,e:s})=>{s&&e.apply(t,n)}))},a=new WeakMap,r=[],u=[];function h(e,t){return e!==this[t]}const l=()=>n,i=e=>"function"==typeof e,f=e=>{const t={h:s,c:null,a:null,e:0,i:0,s:[]};return s;function s(){const s=n;n=t,t.e=t.i=0;try{return e.apply(t.c=this,t.a=arguments)}finally{n=s,r.length&&p.then(r.forEach.bind(r.splice(0),c)),u.length&&u.splice(0).forEach(c)}}},p=new t((e=>e()));function d(e){const{_:t,value:n}=this;n!==e&&(this._=new Set,this.value=e,t.forEach((({h:e,c:t,a:n})=>{e.apply(t,n)})))}const g=(e,t)=>{const n=l(),{i:s,s:c}=n;return s!==c.length&&t&&!t.some(h,c[s]._)||(c[s]={$:e(),_:t}),c[n.i++].$},_=e=>(t,n)=>{const s=l(),{i:c,s:o,h:r}=s,u=c===o.length;s.i++,u&&(a.has(r)||a.set(r,new Set),o[c]={$:t,_:n,r:null,h:r}),(u||!n||n.some(h,o[c]._))&&e.push(o[c]),o[c].$=t,o[c]._=n},w=_(r),y=_(u),v=(e,t)=>i(t)?t(e):t,E=(e,t,n)=>{const c=l(),{i:a,s:r}=c;a===r.length&&r.push({$:i(n)?n(t):v(void 0,t),set:t=>{r[a].$=e(r[a].$,t),(e=>{s.has(e)||(e.e=1,s.add(e),p.then(o))})(c)}});const{$:u,set:h}=r[c.i++];return[u,h]},$=new WeakMap;return e.createContext=e=>({_:new Set,provide:d,value:e}),e.dropEffect=e=>(e=>{const t=a.get(e);t&&p.then((()=>{t.forEach((e=>{e.r(),e.r=null})),t.clear()}))})($.get(e)),e.hasEffect=e=>(e=>a.has(e))($.get(e)),e.hooked=e=>{const t=f(e);return $.set(n,t),n;async function n(){return await t.apply(this,arguments)}},e.useCallback=(e,t)=>g((()=>e),t),e.useContext=({_:e,value:t})=>(e.add(l()),t),e.useEffect=w,e.useLayoutEffect=y,e.useMemo=g,e.useReducer=E,e.useRef=e=>{const t=l(),{i:n,s:s}=t;return n===s.length&&s.push({current:e}),s[t.i++]},e.useState=e=>E(v,e),e.wait=p,e}({});
