const e=`http://www.w3.org/1998/Math/MathML`,t={_plugins:new Map,_css:``,_createStyleSheet:e=>{if(e.length!==t.cssKey){t.cssKey=e.length;let n=document.createElement(`style`);n.textContent=e,document.head.appendChild(n),t.styleSheet=n,document.head.removeChild(n)}return t.styleSheet},getCSSStyleSheet:()=>t._createStyleSheet(t._css).cloneNode(!0),transform:e=>{for(let n of t._plugins.keys()){let r=t._plugins.get(n);Array.from(e.querySelectorAll(n)).reverse().forEach(e=>{let t=r(e);t&&t!==e&&e.parentElement.replaceChild(t,e)})}},add:(e,n,r=``)=>{t._plugins.set(e,n),t._css+=r}};function n(e,r){if(r===void 0&&(r=e.cloneNode(!0)),e.shadowRoot){let i=r.attachShadow({mode:`open`});i.appendChild(t.getCSSStyleSheet());for(let t=0;t<e.shadowRoot.childElementCount;t++)i.appendChild(n(e.shadowRoot.children[t]))}for(let t=0;t<e.childElementCount;t++)n(e.children[t],r.children[t]);return r}function r(t,n){if(/px/.test(n))return parseFloat(n);let r=document.createElement(`img`),i=document.createElementNS(e,`mtext`);i.appendChild(r),i.style.overflow=`hidden`,i.style.visibility=`hidden`,r.style.width=n,t.appendChild(i);let a=i.getBoundingClientRect().width;return i.remove(),a}t.add(`mglyph`,e=>{let t=document.createElement(`img`),n=e.attributes;for(let i=n.length-1;i>=0;i--)switch(n[i].name){case`valign`:t.setAttribute(`style`,`vertical-align: ${n[i].value}`);break;case`width`:case`height`:t.setAttribute(n[i].name,r(e.parentElement,n[i].value).toString());break;default:t.setAttribute(n[i].name,n[i].value);break}return t});const i=`http://www.w3.org/1998/Math/MathML`;function a(e){return e.replace(/^[\s]+|[\s]+$/g,``).replace(/[\s]+/g,` `)}function o(e,t){let n=document.createElementNS(i,`mo`);return n.appendChild(document.createTextNode(e)),n.setAttribute(t?`separator`:`fence`,`true`),n}function s(){return document.createElementNS(i,`mrow`)}function c(e){if(e===null)return[`,`];let t=[];for(let n=0;n<e.length;n++)if(!/\s/g.test(e.charAt(n))){let r=e.charCodeAt(n);r>=55296&&r<56320&&n+1<e.length?(t.push(e.substr(n,2)),n++):t.push(e.charAt(n))}return t}function l(e){return e.namespaceURI||![`dir`,`open`,`close`,`separators`].includes(e.localName)}t.add(`mfenced`,e=>{let t=s();if(t.appendChild(o(a(e.getAttribute(`open`)||`(`))),e.childElementCount===1)t.appendChild(n(e.firstElementChild));else if(e.childElementCount>1){let r=c(e.getAttribute(`separators`)),i=s(),a=e.firstElementChild;for(;a;)i.appendChild(n(a)),a=a.nextElementSibling,a&&r.length&&i.appendChild(o(r.length>1?r.shift():r[0]));t.appendChild(i)}t.appendChild(o(a(e.getAttribute(`close`)||`)`)));for(let n=0;n<e.attributes.length;n++){let r=e.attributes[n];l(r)&&t.setAttributeNS(r.namespaceURI,r.localName,r.value)}return t}),t.add(`mfrac[bevelled]`,t=>{let n=t.firstElementChild.getBoundingClientRect().height,i=r(t.firstElementChild,`0.5em`),a=Math.max(n,t.lastElementChild.getBoundingClientRect().height)+i,o=document.createElementNS(e,`mrow`),s=document.createElementNS(e,`mpadded`);s.setAttribute(`height`,`${n+i}px`),s.setAttribute(`voffset`,`${i}px`),s.appendChild(t.firstElementChild),o.appendChild(s);let c=document.createElementNS(e,`mo`);c.setAttribute(`stretchy`,`true`),c.setAttribute(`symmetric`,`false`),c.setAttribute(`lspace`,`0px`),c.setAttribute(`rspace`,`0px`);let l=Math.round(-.2*a);return c.setAttribute(`style`,`margin-left: ${l}px; margin-right: ${l}px`),c.appendChild(document.createTextNode(`/`)),o.appendChild(c),o.appendChild(t.lastElementChild),o});const u=[`msub`,`msup`,`msubsup`,`munder`,`mover`,`munderover`,`mmultiscripts`,`mfrac`,`semantics`],d=[`mrow`,`mstyle`,`mphantom`,`mpadded`];function f(e){if(e.tagName===`mtext`||e.tagName===`mspace`||e.tagName===`maligngroup`||e.tagName===`malignmark`)return!0;if(d.includes(e.tagName)){for(let t=0;t<e.children.length;t++)if(!f(e.children[t]))return!1;return e.tagName===`maction`&&e.hasAttribute(`selection`)&&f(e.children[e.elAttribute(`selection`)]),!0}return!1}function p(e){if(e.tagName===`mo`)return e;if(u.includes(e.tagName))return p(e.firstChild);if(d.includes(e.tagName)){for(let t=0;t<e.children.length;t++)if(!f(e.children[t]))return p(e.children[t]);return null}return null}function m(e,t){let n=p(e);if(n===null)return;let r=n.getAttribute(`accent`);r===null&&e.tagName===`mo`&&(r=`true`),r!==null&&e.parentElement.setAttribute(t,r)}const h=e=>{!e.getAttribute(`accentunder`)&&e.tagName!==`mover`&&m(e.children[1],`accentunder`),!e.getAttribute(`accent`)&&e.tagName!==`munder`&&m(e.children.length===2?e.children[1]:e.children[2],`accent`)};t.add(`munder`,h),t.add(`mover`,h),t.add(`munderover`,h);function g(e){return e.getBoundingClientRect().width}function _(t,n,r,i){if(n>=i||r===`center`)return t;if(t.tagName!==`mrow`){let n=t.nextElementSibling,r=document.createElementNS(e,`mrow`),i=t.parentElement;r.appendChild(t),i.insertBefore(r,n),t=r}let a=document.createElementNS(e,`mspace`);return a.setAttribute(`width`,`${(i-n).toPrecision(2)}px`),r===`left`?t.appendChild(a):r===`right`&&t.insertBefore(a,t.firstElementChild),t}function v(e,t,n,r){return _(e.children[t],g(e.children[t]),e.getAttribute(r),g(e.children[n])),e}const ee=e=>v(e,0,1,`numalign`),te=e=>v(e,1,0,`denomalign`),y=e=>v(e,1,0,`align`);t.add(`mfrac[numalign]`,ee),t.add(`mfrac[denomalign]`,te),t.add(`munder[align]`,y),t.add(`mover[align]`,y),t.add(`munderover[align]`,e=>{let t=e.getAttribute(`align`),n=g(e.children[0]),r=g(e.children[1]),i=g(e.children[2]),a=Math.max(n,r,i);return _(e.children[1],r,t,a),_(e.children[2],i,t,a),e}),t.add(`[mathsize="small"]`,e=>(e.setAttribute(`mathsize`,`75%`),e)),t.add(`[mathsize="normal"]`,e=>(e.setAttribute(`mathsize`,`100%`),e)),t.add(`[mathsize="big"]`,e=>(e.setAttribute(`mathsize`,`150%`),e));const b={veryverythinmathspace:`0.05555555555555555em`,verythinmathspace:`0.1111111111111111em`,thinmathspace:`0.16666666666666666em`,veryverythickmathspace:`0.3888888888888889em`,verythickmathspace:`0.3333333333333333em`,thickmathspace:`0.2777777777777778em`,mediummathspace:`0.2222222222222222em`},x=e=>{let t=e.getAttribute(`rspace`);if(t){for(let[e,n]of Object.entries(b))t=t.replaceAll(e,n);t=t.replaceAll(`negative0`,`-0`),e.setAttribute(`rspace`,t)}if(t=e.getAttribute(`lspace`),t){for(let[e,n]of Object.entries(b))t=t.replaceAll(e,n);t=t.replaceAll(`negative0`,`-0`),e.setAttribute(`lspace`,t)}return e};t.add(`math *[rspace*="mathspace"]`,x),t.add(`math *[lspace*="mathspace"]`,x);const S=[`left`,`right`,`top`,`bottom`,`actuarial`,`madruwb`],C={longdiv:`padding: 0.05em 0.2em 0.0em 0.433em; border-top: 0.067em solid;`,actuarial:`padding-top: 0.01em; padding-right: 0.1em;`,radical:`padding-top: 0.403em; padding-bottom: 0.112em; padding-left: 1.02em;`,box:`padding: 0.2em;`,roundedbox:`padding: 0.267em;`,circle:`padding: 0.267em;`,phasorangle:`border-bottom: 0.067em solid; padding: 0.2em 0.2em 0.0em 0.7em;`,phasoranglertl:`border-bottom: 0.067em solid; padding: 0.2em 0.7em 0.0em 0.2em;`,madruwb:`padding-bottom: 0.2em; padding-right: 0.2em;`},w={horizontalstrike:[0,0,!1,[``]],verticalstrike:[0,Math.PI/2,!1,[``]],updiagonalstrike:[-1,0,!1,[``]],downdiagonalstrike:[1,0,!1,[``]],uparrow:[0,-Math.PI/2,!1,[`verticalstrike`]],downarrow:[0,Math.PI/2,!1,[`verticakstrike`]],rightarrow:[0,0,!1,[`horizontalstrike`]],leftarrow:[0,Math.PI,!1,[`horizontalstrike`]],updownarrow:[0,Math.PI/2,!0,[`verticalstrike`,`uparrow`,`downarrow`]],leftrightarrow:[0,0,!0,[`horizontalstrike`,`leftarrow`,`rightarrow`]],northeastarrow:[-1,0,!1,[`updiagonalstrike`,`updiagonalarrow`]],southeastarrow:[1,0,!1,[`downdiagonalstrike`]],northwestarrow:[1,Math.PI,!1,[`downdiagonalstrike`]],southwestarrow:[-1,Math.PI,!1,[`updiagonalstrike`]],northeastsouthwestarrow:[-1,0,!0,[`updiagonalstrike`,`northeastarrow`,`updiagonalarrow`,`southwestarrow`]],northwestsoutheastarrow:[1,0,!0,[`downdiagonalstrike`,`northwestarrow`,`southeastarrow`]]},ne=Array.from(new Set(S.concat(Object.keys(C),Object.keys(w))));function T(t){let n=document.createElementNS(e,`math`);n.innerHTML=t,document.body.appendChild(n);let r=n.getBoundingClientRect().width;return document.body.lastElementChild.remove(),r}function re(e){return!!(T(`<mi>x</mi>`)===T(`<menclose notation="box"><mi>x</mi></menclose>`)||/arrow/.test(e)&&T(`<math display="block"><mi>x</mi></math>`)===T(`<math display="block"><menclose notation="rightarrow"><mi>x</mi></menclose></math>`)||/phasorangle/.test(e)&&T(`<math display="block"><mi>x</mi></math>`)===T(`<math display="block"><menclose notation="phasorangle"><mi>x</mi></menclose></math>`))}function ie(e){e=Array.from(new Set(e)),e.includes(`box`)&&(e=e.filter(e=>!S.includes(e)));for(let[t,n]of Object.entries(w)){let r=n[3];r!==[``]&&e.includes(t)&&(e=e.filter(e=>!r.includes(e)))}return e}function ae(e){let t=!0;do{if(e.hasAttribute(`dir`))return e.getAttribute(`dir`)===`ltr`;t=e.tagName!==`math`,e=e.parentElement}while(t);return!0}function oe(e,t){let n=`0.467em`;return(t.includes(`roundedbox`)||t.includes(`circle`))&&(n=`0.601em`),r(e,n)}t.add(`menclose`,t=>{let i=t.getAttribute(`notation`)||``;if(!re(i))return t;let a=i.split(` `);if(a=a.filter(e=>ne.includes(e)),a.length===0&&a.push(`longdiv`),a=ie(a),a.includes(`phasorangle`)&&!ae(t)){let e=a.indexOf(`phasorangle`);a[e]=`phasoranglertl`}let o=document.createElementNS(e,`mrow`),s=t.firstElementChild;for(;s;)o.appendChild(n(s)),s=s.nextElementSibling;let c=document.createElementNS(e,`mrow`);if(c.className=`menclose`,c.appendChild(o),a.includes(`radical`)){let t=document.createElementNS(e,`msqrt`);t.appendChild(c.firstElementChild),c.appendChild(t),a=a.filter(e=>e!==`radical`)}let l=``,u=oe(t,a),d=t.getBoundingClientRect(),f=d.width+u,p=d.height+u;return a.forEach(n=>{let i=document.createElementNS(e,`mrow`);if(w[n]!==void 0){let[t,r,a,o]=w[n],s=r===0||r===Math.PI,c=t===0?r:t*(Math.atan2(p,f)-r),l=f,u=p;/arrow/.test(n)&&(l--,u--);let d=t===0?s?l:u:Math.sqrt(l*l+u*u);i.style.width=`${d}px`,i.style.transform=(c?`rotate(${c}rad) `:``)+`translate(0.067em, 0.0em)`,i.style.left=`${(l-d)/2}px`;let m=document.createElementNS(e,`mrow`);if(m.className=`line`,i.appendChild(m),/arrow/.test(n)){let t=document.createElementNS(e,`mrow`);t.className=`rthead`,i.appendChild(t);let n=document.createElementNS(e,`mrow`);if(n.className=`rbhead`,i.appendChild(n),a){let t=document.createElementNS(e,`mrow`);t.className=`lthead`,i.appendChild(t);let n=document.createElementNS(e,`mrow`);n.className=`lbhead`,i.appendChild(n)}}}else if(n===`phasorangle`||n===`phasoranglertl`){let e=r(t,`.7em`),a=d.height;i.style.width=`${Math.sqrt(e*e+a*a)}px`,i.style.transform=`rotate(${n===`phasoranglertl`?``:`-`}${Math.atan(a/e)}rad) translateY(0.067em)`}let a=C[n]||``;a===``&&l.length===0&&(a=`padding: 0.2em;`),l.includes(a)||(l+=a),i.className=`menclose-${w[n]===void 0?n:`arrow`}`,c.appendChild(i)}),c.setAttribute(`style`,l),c},`
mrow.menclose {
    display: inline-block;
    text-align: left;
    position: relative;
}

/* the following class names should be of the form 'menclose-[notation name]' */
mrow.menclose-longdiv {
    position: absolute;
    top: 0;
    bottom: 0.1em;
    left: -0.4em;
    width: 0.7em;
    border: 0.067em solid;
    transform: translateY(-0.067em);
    border-radius: 70%;
    clip-path: inset(0 0 0 0.4em);
    box-sizing: border-box;
}

mrow.menclose-actuarial {
    position: absolute;
    display: inline-block;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border-top: 0.067em solid;
    border-right: 0.067em solid;
}

mrow.menclose-phasorangle {
    display: inline-block;
    left: 0;
    bottom: 0;
    position: absolute;
    border-top: 0.067em solid;
    transform-origin: bottom left;
}

mrow.menclose-phasoranglertl {
    display: inline-block;
    right: 0;
    bottom: 0;
    position: absolute;
    border-top: 0.067em solid;
    transform-origin: bottom right;
}

mrow.menclose-box {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border: 0.067em solid;
}

mrow.menclose-roundedbox {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border: 0.067em solid;
    border-radius: 0.267em;
}

mrow.menclose-circle {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border: 0.067em solid;
    border-radius: 50%;
}

mrow.menclose-box {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border: 0.067em solid;
}

mrow.menclose-left {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border-left: 0.067em solid;
}

mrow.menclose-right {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border-right: 0.067em solid;
}

mrow.menclose-top {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border-top: 0.067em solid;
}

mrow.menclose-bottom {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border-bottom: 0.067em solid;
}

mrow.menclose-madruwb {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    border-right: 0.067em solid;
    border-bottom: 0.067em solid;
}

/*
 * Arrows and 'strikes' are composed of an 'menclose-arrow' wrapper and one, three or five children
 * Strikes just have class 'line'
 * Single-headed arrows have the children with classes 'line', 'rthead' (right top arrow head), and 'rbhead'
 * Double-headed arrows add lthead' (left top arrow head), and 'lbhead'
 */
mrow.menclose-arrow {
    position: absolute;
    left: 0;
    bottom: 50%;
    height: 0;
    width: 0;
}

mrow.menclose > mrow.menclose-arrow > * {
    display: block;
    position: absolute;
    transform-origin: bottom;
    border-left: 0.268em solid;
    border-right: 0;
    box-sizing: border-box;
  }

mrow.menclose-arrow  > mrow.line{
    left: 0;
    top: -0.0335em;
    right: 0.201em;
    height: 0;
    border-top: 0.067em solid;
    border-left: 0;
}

mrow.menclose-arrow > mrow.rthead {
    transform: skewX(0.464rad);
    right: 1px;
    bottom: -1px;
    border-bottom: 1px solid transparent;
    border-top: 0.134em solid transparent;
}

mrow.menclose-arrow > mrow.rbhead {
    transform: skewX(-0.464rad);
    transform-origin: top;
    right: 1px;
    top: -1px;
    border-top: 1px solid transparent;
    border-bottom: 0.134em solid transparent;
}

mrow.menclose-arrow > mrow.lthead {
    transform: skewX(-0.464rad);
    left: 0;
    bottom: -1px;
    border-left: 0;
    border-right: 0.268em solid;
    border-bottom: 1px solid transparent;
    border-top: 0.134em solid transparent;
}

mrow.menclose-arrow > mrow.lbhead {
    transform: skewX(0.464rad);
    transform-origin: top;
    left: 0;
    top: -1px;
    border-left: 0;
    border-right: 0.268em solid;
    border-top: 1px solid transparent;
    border-bottom: 0.134em solid transparent;
}
`),t.add(`[linethickness="thin"]`,e=>(e.setAttribute(`linethickness`,`67%`),e)),t.add(`[linethickness="medium"]`,e=>(e.setAttribute(`linethickness`,`100%`),e)),t.add(`[linethickness="thick"]`,e=>(e.setAttribute(`linethickness`,`167%`),e));function se(e){return e.replace(/^[\s]+|[\s]+$/g,``).replace(/[\s]+/g,` `)}t.add(`ms`,e=>{let t=e.getAttribute(`lquote`)||`"`,n=e.getAttribute(`rquote`)||`"`,r=se(e.textContent);r=r.replace(t,`\\`+t),n!==t&&(r=r.replace(n,`\\`+n)),e.textContent=t+r+n});const ce={normal:`mup`,bold:`mbf`,italic:`mit`,"bold-italic":`mbfit`,"double-struck":`Bbb`,"bold-fraktur":`mbffrak`,script:`mscr`,"bold-script":`mbfscr`,fraktur:`mfrak`,"sans-serif":`msans`,"bold-sans-serif":`mbfsans`,"sans-serif-italic":`mitsans`,"sans-serif-bold-italic":`mbfitsans`,monospace:`mtt`,isolated:`misol`,initial:`minit`,tailed:`mtail`,looped:`mloop`,stretched:`mstrc`,chancery:`mchan`,roundhand:`mrhnd`},le=e=>{let t=e.getAttribute(`mathvariant`);if(!t||t==`normal`)return;let n=ce[t];if(!n)return;let r=e.textContent,i=``,a=!0;for(let e=0;e<r.length;e++){let t=be(r[e],n);t==r[e]&&(a=!1),i+=t}e.textContent=i,a&&e.removeAttribute(`mathVariant`)},ue=[0,1,-1,21,22,2,7,23,3,24,19,6,14,20,17,25,8,26,15,27,-1,-1,-1,-1,-1,-1,16,18,10,11,12,13,4,5,-1,9],de={C:`ℂ`,H:`ℍ`,N:`ℕ`,P:`ℙ`,Q:`ℚ`,R:`ℝ`,Z:`ℤ`},fe={C:`ℭ`,H:`ℌ`,I:`ℑ`,R:`ℜ`,Z:`ℨ`},pe={B:`ℬ`,E:`ℰ`,F:`ℱ`,H:`ℋ`,I:`ℐ`,L:`ℒ`,M:`ℳ`,R:`ℛ`,e:`ℯ`,g:`ℊ`,o:`ℴ`},me=[4110942569,1432950139,2701658217,4026531840,4026531840],he={"∂":51,"∇":25,ϴ:17,ϵ:52,ϑ:53,ϰ:54,ϕ:55,ϱ:56,ϖ:57},ge=[`misol`,`minit`,`mtail`,`mstrc`,`mloop`,`Bbb`],_e=[`mbf`,`Bbb`,`msans`,`mbfsans`,`mtt`],ve=[`mbf`,`mit`,`mbfit`,`mscr`,`mbfscr`,`mfrak`,`Bbb`,`mbffrak`,`msans`,`mbfsans`,`mitsans`,`mbfitsans`,`mtt`],ye=[`mbf`,`mit`,`mbfit`,`mbfsans`,`mbfitsans`];function be(e,t){if(!t||t==`mup`)return e;let n=e.charCodeAt(0),r;if(e>=`0`&&e<=`9`)return n+=120734,r=_e.indexOf(t),r==-1?e:String.fromCodePoint(n+r*10);if(/[A-Za-z]/.test(e)){let i=``;(t==`mchan`||t==`mrhnd`)&&(i=t==`mchan`?`︀`:`︁`,t=`mscr`);let a=``;switch(t){case`mit`:if(e==`h`)return`ℎ`;break;case`mfrak`:a=fe[e];break;case`mscr`:a=pe[e];break;case`Bbb`:a=de[e];break}return a?a+i:(r=ve.indexOf(t),r==-1?e:(n-=65,n>26&&(n-=6),String.fromCodePoint(n+52*r+119808)+i))}if(e>=`Α`&&e<=`ϵ`||e==`∂`||e==`∇`){if(t==`mbf`){if(e==`Ϝ`)return`𝟊`;if(e==`ϝ`)return`𝟋`}if(r=ye.indexOf(t),r==-1)return e;let i=he[e];return i?n=i:(n-=913,n>25&&(n-=6)),String.fromCodePoint(n+58*r+120488)}if(n<1575)return e==`ı`?`𝚤`:e==`ȷ`?`𝚥`:e;if(n>1722||(r=ge.indexOf(t),r==-1))return e;if(n<=1610){if(n=ue[n-1575],n==-1)return e}else{if(n=`ٮںڡٯ`.indexOf(e),n==-1)return e;n+=28}if(t==`misol`)n==4&&(r=1);else if(1<<n&me[r-1])return e;return String.fromCodePoint(32*r+n+126464)}t.add(`*[mathvariant]`,le);function xe(t){let r=document.createElementNS(e,`mrow`);r.appendChild(document.createElementNS(e,`mspace`));let i=n(t);for(let e=0;e<i.children.length;e++)r.appendChild(i.children[e]);i.appendChild(r),t.parentElement.replaceChild(i,t);let a=r.firstElementChild.getBoundingClientRect(),o=r.getBoundingClientRect();return i.parentElement.replaceChild(t,i),{width:o.width,height:a.y-o.top,depth:o.bottom-a.y}}function E(e,t,n,r){let i=e.getAttribute(t).toLowerCase();if(i.includes(n)){let a=parseFloat(i)*r[n]/(i.includes(`%`)?100:1);return e.setAttribute(t,a.toFixed(1)+`px`),!0}return!1}function D(e,t,n){return e.hasAttribute(t)?!!(E(e,t,`width`,n)||E(e,t,`height`,n)||E(e,t,`depth`,n)):!1}t.add(`mpadded`,e=>{let t=xe(e);return D(e,`width`,t),D(e,`height`,t),D(e,`depth`,t),D(e,`lspace`,t),D(e,`voffset`,t),e});const O=`http://www.w3.org/1998/Math/MathML`;function Se(e){return e}function Ce(e){if(e.getElementsByTagName(`mlabeledtr`).length===0)return e;let t=e.getAttribute(`side`)||`right`,n=document.createElementNS(O,`mtd`);n.setAttribute(`intent`,`:no-equation-label`);for(let r=0;r<e.children.length;r++){let i=e.children[r];if(i.tagName===`mlabeledtr`){let e=i.firstElementChild;we(e);let n=document.createElementNS(O,`mtr`);for(let e of i.attributes)n.setAttribute(e.name,e.value);let r=i.children[t==`left`?0:1];for(n.appendChild(r);i.children.length>0;)n.appendChild(i.firstChild);t===`right`&&n.appendChild(e),i.replaceWith(n)}else{let e=n.cloneNode();t===`right`?i.appendChild(e):i.insertBefore(e,i.firstElementChild)}}return e}function we(e){if(!e.hasAttribute(`intent`)){e.setAttribute(`intent`,`:equation-label`);return}let t=e.getAttribute(`intent`),n=t.indexOf(`(`),r=n==-1?t:t.substring(0,n);r.includes(`:equation-label`)||(t=r+`:equation-label`+t.substring(r.length),e.setAttribute(`intent`,t))}t.add(`mtable`,e=>{let t=Se(n(e));return Ce(t),t});const k=`.35ex`;var A=class{constructor(e,t){if(this.attrs={},!t){for(;e&&e.tagName.toLowerCase()!==`math`;)e.tagName.toLowerCase()===`mstyle`&&this.addAttrs(e),e=e.parentElement;e&&e.tagName.toLowerCase()===`math`&&this.addAttrs(e)}else if(this.attrs=Object.assign({},t),e.tagName.toLowerCase()===`mstyle`)for(let t of e.attributes)this.attrs[t.name]=t.value}addAttrs(e){for(let t of e.attributes)this.attrs[t.name]||(this.attrs[t.name]=t.value)}getAttr(e,t,n){return e.hasAttribute(t)?e.getAttribute(t):this.attrs[t]?this.attrs[t]:n}},Te=class{constructor(e,t,n){this.location=e,this.crossout=t,this.scriptsizemultiplier=n}},j=class{constructor(e,t,n){if(n){if(typeof e!=`object`)throw Error(`Elementary math mscarry isn't an 'object'`);this.data=document.createElement(n.location===`n`||n.location===`s`?`div`:`span`),this.data.appendChild(e),this.data.className=`carry`,this.data.style.fontSize=Math.round(n.scriptsizemultiplier).toString()+`%`}else{if(typeof e!=`string`)throw Error(`Elementary math mscarry isn't a 'string'`);this.data=document.createTextNode(e)}this.carry=n,this.style=t||``}},M=class{constructor(e,t,n){n===0?this.data=e:n>0?this.data=this.padOnRight(e,n):n<0&&(this.data=this.padOnLeft(e,-n),t-=n),this.nRight=t,this.shift=n,this.style=``,this.addSpacingAfterRow=!1,this.alignAt=0}addUnderline(e,t){this.style+=`border-bottom: ${e} solid ${t};`,this.addSpacingAfterRow=!0}addUnderlineToCells(e,t,n,r){let i=this.data.length-this.nRight,a=i-e;e+t>i&&(this.data=this.padOnLeft(this.data,e+t-i),a=t),e<-this.nRight&&(this.data=this.padOnRight(this.data,this.nRight-e),this.nRight-=e,a=this.data.length);for(let e=a-t;e<a;e++)this.data[e].style+=`border-bottom: ${n} solid ${r};`;this.addSpacingAfterRow=!0}padOnLeft(e,t){let n=Array(t);for(let e=0;e<t;e++)n[e]=new j(` `);return n.concat(e)}padOnRight(e,t){let n=Array(t);for(let e=0;e<t;e++)n[e]=new j(` `);return e.concat(n)}},N=class{constructor(e){this.stack=e,this.attrs=new A(e),this.stackAlign=this.getAttr(e,`stackalign`,`decimalpoint`),this.charAlign=this.getAttr(e,`charalign`,`right`),this.charSpacing=this.getAttr(e,`charspacing`,`medium`),this.charSpacing===`loose`?this.charSpacing=`.4em`:this.charSpacing===`medium`?this.charSpacing=`.2em`:this.charSpacing===`tight`&&(this.charSpacing=`0em`),this.longdivstyle=e.tagName===`mstack`?``:this.getAttr(e,`longdivstyle`,`lefttop`),this.align=this.getAttr(e,`algin`,`baseline`)}getAttr(e,t,n){return this.attrs.getAttr(e,t,n)}add(e,t){function n(e,t){let n=t.split(` `),r=e.data;return n.forEach(function(e){if(e===`none`||e===``)return;let n=document.createElement(`span`);switch(n.appendChild(r),e){case`updiagonalstrike`:n.className=`crossout-up`;break;case`downdiagonalstrike`:n.className=`crossout-down`;break;case`verticalstrike`:n.className=`crossout-vert`;break;case`horizontalstrike`:n.className=`crossout-horiz`;break;default:n.className=`crossout-up`,console.log(`Unknown crossout type '${t}`);break}r=n}),e.data=r,e}function r(e,t){let n=e.data;if(n.textContent===` `){let e=document.createElement(`span`);e.appendChild(n),n.textContent=`0`,e.className=`hidden-digit`,n=e}let r=document.createElement(`span`);switch(r.appendChild(n),t.carry.location){case`n`:case`w`:r.prepend(t.data);break;case`nw`:{let e=document.createElement(`sup`);e.appendChild(t.data),r.prepend(e);break}case`ne`:{let e=document.createElement(`sup`);e.appendChild(t.data),r.appendChild(e);break}case`e`:case`s`:r.appendChild(t.data);break;case`se`:{let e=document.createElement(`sub`);e.appendChild(t.data),r.appendChild(e);break}case`sw`:{let e=document.createElement(`sub`);e.appendChild(t.data),r.prepend(e);break}default:console.log(`Unknown crossout location '${t.carry.location}`);break}return e.data=r,e}let i=e[e.length-1];if(e.length===0||!i.data.find(e=>e.carry)){e.push(t);return}let a=t.data.length-t.nRight-(i.data.length-i.nRight);a!==0&&(a<0?t.data=t.padOnLeft(t.data,-a):i.data=i.padOnLeft(i.data,a));let o=t.nRight-i.nRight;o!==0&&(o<0?t.data=t.padOnRight(t.data,-o):i.data=i.padOnRight(i.data,o));for(let e=0;e<t.data.length;e++){let a=i.data[e],o=t.data[e];a.carry&&(o=n(o,a.carry.crossout),o=r(o,a),o.alignAt=a.carry.location===`s`?1:-1,t.data[e]=o)}e[e.length-1]=t}process_msrow(e){let t=!1,n=0,r=[];for(let i=0;i<e.children.length;i++){let a=e.children[i];if(a.tagName.toLowerCase()===`mn`){let e=a.textContent.trim().split(``);if(r=r.concat(e.map(e=>new j(e))),t)n+=e.length;else{let r=a.textContent.trim().indexOf(this.getAttr(a,`decimalpoint`,`.`));n=r<0?0:e.length-r,t=!0}}else{let e=a.textContent.trim();e===`-`&&(e=`−`),r.push(new j(e)),t&&(n+=1)}}return[r,this.stackAlign===`decimalpoint`?n:0]}process_mscarries(e,t,n,r){let i=[],a=e.children[0];for(;a;){let e=a.nextElementSibling,o=t,s=n;a.tagName.toLowerCase()===`mscarry`&&(o=this.getAttr(a,`location`,`n`),s=this.getAttr(a,`crossout`,`none`)),i.push(new j(a,``,new Te(o,s,r))),a=e}return i}processChildren(e,t,n,r){if(!e.children)return t;r||=0;for(let i=e.tagName.toLowerCase()===`mlongdiv`?2:0;i<e.children.length;i++)t=this.processChild(e.children[i],t,n),n+=r;return t}processChild(e,t,n){let r=n+parseInt(this.getAttr(e,`position`,`0`));switch(e.tagName.toLowerCase()){case`mn`:{let n=e.textContent.trim().split(``),i=e.textContent.trim().indexOf(this.getAttr(e,`decimalpoint`,`.`)),a=this.stackAlign!==`decimalpoint`||i<0?0:n.length-i,o=n.map(e=>new j(e));this.add(t,new M(o,a,r));break}case`msgroup`:t=this.processChildren(e,t,r,parseInt(this.getAttr(e,`shift`,`0`)));break;case`msline`:{let n=parseInt(this.getAttr(e,`length`,`0`)),i=this.getAttr(e,`mslinethickness`,`medium`);i===`medium`?i=k:i===`thin`?i=`.1ex`:i===`thick`&&(i=`.65ex`),t.length===0&&this.add(t,new M([],0,0));let a=t[t.length-1],o=this.getAttr(e,`mathcolor`,`black`);n===0?a.addUnderline(i,o):a.addUnderlineToCells(r,n,i,o);break}case`mscarries`:{let n=this.getAttr(e,`location`,`n`),i=this.getAttr(e,`crossout`,`none`),a=parseFloat(this.getAttr(e,`scriptsizemultiplier`,`0.6`));this.add(t,new M(this.process_mscarries(e,n,i,100*a),0,r));break}case`mstyle`:{let n=this.attrs;if(this.attrs=new A(e,n),e.children.length===1&&e.children[0].tagName.toLowerCase()===`msline`)this.processChild(e.children[0],t,r);else{let i,a;[i,a]=this.process_msrow(e),this.add(t,new M(i,a,r)),this.attrs=n}break}default:{let n,i=0;e.tagName.toLowerCase()==`msrow`?[n,i]=this.process_msrow(e):n=[new j(e.textContent.trim())],this.add(t,new M(n,i,r));break}}return t}processShifts(e,t){let n=0,r=0;for(let i of e)t===`decimalpoint`?(n=Math.max(n,i.data.length-i.nRight),r=Math.max(r,i.nRight)):n=Math.max(n,i.data.length);for(let i of e)switch(t){case`decimalpoint`:i.data=i.padOnLeft(i.data,n-(i.data.length-i.nRight)),i.data=i.padOnRight(i.data,r-i.nRight),i.nRight=r;break;case`left`:i.data=i.padOnRight(i.data,n-i.data.length);break;case`center`:{let e=n-i.data.length;i.data=i.padOnRight(i.data,e/2),i.data=i.padOnLeft(i.data,e-e/2);break}case`right`:i.data=i.padOnLeft(i.data,n-i.data.length);break;default:console.log(`Unknown mstack stackalign attr value: "${t}"`);break}return e}addOnLongDivParts(e,t,n){function r(e){for(let t=e.data.length-1;t>=0;t--)if(e.data[t].data.textContent!==` `)return e.data.length-1-t;return e.data.length}function i(e,t){let n=0;for(let r=e.data.length-1;r>=0&&e.data[r].data.textContent===` `;r--)t>0?t--:(e.data.pop(),n++);for(let n=0;n<t;n++)e.data.push(new j(` `));return e.nRight-=n-t,e}let a=this.getAttr(this.stack,`mathcolor`,`black`);n.length==0&&n.push(new M([new j(` `)],0,0));let o=(e?this.processChild(e,[],0):[new M([new j(` `)],0,0)])[0],s=o.data.length-1,c=t?this.processChild(t,[],0):[new M([new j(` `)],0,0)],l=c[0];switch(this.longdivstyle){case`left/\\right`:case`left)(right`:{let e=new j(this.longdivstyle===`left/\\right`?`/`:`)`),t=new j(this.longdivstyle===`left/\\right`?`\\`:`(`);n.length===0?n.push(new M(o.data.concat([e],new j(` `),[t],c[0].data))):(n[0].data=o.data.concat([e],i(n[0],0).data,[t],c[0].data),n[0].nRight+=1+c[0].data.length);break}case`:right=right`:n.length===0?n.push(new M([new j(`:`)].concat(o.data,[new j(`=`)],l.data))):(n[0].data=i(n[0],0).data.concat([new j(`:`)],o.data,[new j(`=`)],l.data),n[0].nRight+=2+o.data.length+l.data.length);break;case`stackedrightright`:case`mediumstackedrightright`:case`shortstackedrightright`:{if(n.length==1&&(n.push(new M([new j(` `)],0,0)),n=this.processShifts(n,this.stackAlign)),this.longdivstyle!==`stackedrightright`){let e=r(n[0]),t=r(n[1]),a=Math.min(e,t);n[0]=i(n[0],e-a),n[1]=i(n[1],t-a)}let e=this.longdivstyle===`shortstackedrightright`?1:this.longdivstyle===`mediumstackedrightright`?2:n.length;for(let t=0;t<e;t++){let r=new j(` `);t<e&&(r.style+=`border-right: ${k} solid ${a};`),n[t].data.push(r)}this.longdivstyle===`stackedrightright`&&(o.data[0].style+=`padding-left: 0.5em;`,l.data[0].style+=`padding-left: 0.5em;`);let t=l.data.length-o.data.length;t>0&&(o.data=o.padOnRight(o.data,t)),o.addUnderlineToCells(-o.nRight,o.data.length,k,a),o.addSpacingAfterRow=!1,n[0].data=n[0].data.concat(o.data),n[0].nRight+=o.data.length,n[1].data=n[1].data.concat(l.data),n[1].nRight+=l.data.length;break}case`stackedleftleft`:{n.length==1&&(n.push(new M([new j(` `)],0,0)),n=this.processShifts(n,this.stackAlign));for(let e=0;e<n.length;e++){let t=new j(``);t.style+=`border-left: ${k} solid ${a};`,n[e].data.unshift(t)}o.data[o.data.length-1].style+=`padding-right: 0.5em;`,l.data[l.data.length-1].style+=`padding-right: 0.5em;`;let e=l.data.length-o.data.length;e>0&&(o.data=o.padOnLeft(o.data,e)),o.addUnderlineToCells(-o.nRight,o.data.length,k,a),o.addSpacingAfterRow=!1,n[0].data=o.data.concat(n[0].data),n[1].data=l.data.concat(n[1].data);break}case`righttop`:{l.addUnderline(k,a),l.addSpacingAfterRow=!1;let e=c.concat(n);n=this.processShifts(e,this.stackAlign),o.data[0].style+=`border-left: ${k} solid ${a};`,o.addUnderlineToCells(-o.nRight,o.data.length,k,a),n[1].data=n[1].data.concat(o.data),n[1].nRight+=o.data.length;break}default:{l.addUnderlineToCells(-l.nRight,Math.max(l.data.length,n[0].data.length),k,a),l.addSpacingAfterRow=!1;let e=c.concat(n);n=this.processShifts(e,this.stackAlign),this.longdivstyle===`stackedleftlinetop`?(o.data[o.data.length-1].style+=`border-right: ${k} solid ${a};`,o.data[o.data.length-1].style+=`border-right: ${k} solid ${a};`,o.data[o.data.length-1].data.style+=`position:relative`,o.addUnderlineToCells(-o.nRight,o.data.length,k,a)):(o.data=o.padOnRight(o.data,1),s+=1,o.data[s].class=`curved-line`,o.data[s].style=``),n[1].data=o.data.concat(n[1].data);break}}let u=this.processShifts(n,this.stackAlign);return this.longdivstyle===`lefttop`&&(n[0].data[s].style+=`border-bottom: ${k} solid ${a};`),u}shrinkSeparatorColumns(e){if(e.length===0)return;let t=new Set(Array(e[0].data.length).keys()),n=new Set(Array(e[0].data.length).keys());for(let r of e){let e=r.data;for(let r=0;r<e.length;r++){let i=e[r].data.textContent;i===`.`||i===`,`?n.delete(r):i!==` `&&(t.delete(r),n.delete(r))}}n.forEach(e=>t.delete(e));for(let n of t)e.forEach(e=>{e.data[n].class=`separator`,n>0&&(e.data[n-1].class=`precedes-separator`)})}expandMStackElement(e){let t=/[-+]?\d*\.?\d*/g,n=parseFloat(t.exec(this.charSpacing)[0])/2+this.charSpacing.slice(t.lastIndex);this.charSpacing.slice(t.lastIndex);let r=`padding: .1ex ${n} 0 ${n}; text-align: ${this.charAlign};`,i=[];i=this.processChildren(e,i,0,0),i=this.processShifts(i,this.stackAlign),e.tagName.toLowerCase()===`mlongdiv`&&(i=this.addOnLongDivParts(e.children[0],e.children[1],i)),i.length>0&&(i[i.length-1].addSpacingAfterRow=!1),this.shrinkSeparatorColumns(i);let a=document.createElement(`table`);a.setAttribute(`class`,`elem-math`);for(let e of i){let t=document.createElement(`tr`);e.style&&t.setAttribute(`style`,e.style);for(let n of e.data){let e=document.createElement(`td`);if(n.alignAt){let e=document.createElement(`span`);e.style.display=n.alignAt===1?`inline-table`:`inline-block`,e.appendChild(n.data),n.data=e}n.class===`curved-line`&&(n.data.textContent=`\xA0`),e.appendChild(n.data),n.class!==`curved-line`&&e.setAttribute(`style`,r+n.style),n.class&&e.setAttribute(`class`,n.class),t.appendChild(e)}if(a.appendChild(t),e.addSpacingAfterRow){let t=document.createElement(`tr`);t.style.height=`.5ex`;for(let n of e.data){let e=document.createElement(`td`);if(/(border-left|border-right)/.test(n.style)){let t=n.style.match(/(border-left|border-right).*?;/g);e.setAttribute(`style`,t)}t.appendChild(e)}a.appendChild(t)}}return a}};let P=n=>{if(n.parentElement&&(n.parentElement.tagName===`M-ELEM-MATH`||n.parentElement.parentElement&&n.parentElement.parentElement.tagName===`M-ELEM-MATH`))return;let r=document.createElement(`span`);r.attachShadow({mode:`open`}).appendChild(t.getCSSStyleSheet());let i=n.parentElement,a=n.nextElementSibling,o=new N(n).expandMStackElement(n);r.shadowRoot.appendChild(o);let s=document.createElementNS(e,`mtext`);s.appendChild(r);let c=document.createElementNS(e,`math`);return r.appendChild(c),c.appendChild(n),i.insertBefore(s,a),null};t.add(`mstack`,P,`
table.elem-math {
    border-collapse: collapse;
    border-spacing: 0px;
}
table.elem-math tr {
    vertical-align: baseline;
}

td.curved-line {
    position: absolute;
    padding-top: 0em;
    width: 0.75em;
    border: 0.3ex solid;  /* match border bottom */
    transform: translate(0.48em, -0.15em);
    border-radius: 70%;
    clip-path: inset(0.1em 0 0 0.45em);
    box-sizing: border-box;
    margin-left: -0.85em;
    margin-right: 0.75em;
}

mtd.precedes-separator {
    padding-right: 0 !important;    /* override an inline style */
}

mtd.separator {
    padding-left: 0  !important;    /* override an inline style */
    padding-right: 0 !important;    /* override an inline style */
}

.carry {
    font-size: 60%;
    line-height: 90%;
    width: 1px;
    overflow: visible;
}

.hidden-digit {
    visibility: hidden;
}

.crossout-horiz, .crossout-vert, .crossout-up, .crossout-down{
    position: relative;
    display: inline-block;
}
.crossout-horiz:before {
    content: '';
    border-bottom: .3ex solid black;
    width: 140%;
    position: absolute;
    right: -20%;
    top: 40%;
}

.crossout-vert::before {
    content: '';
    border-left: .3ex solid black;
    height: 100%;
    position: absolute;
    right: 35%;
    top: 0%;
}

.crossout-up::before {
    content: '';
    width: 100%;
    position: absolute;
    right: 0;
    top: 40%;
}
.crossout-up::before {
    border-bottom: .2em solid black;
    transform: skewY(-60deg);
}

.crossout-down::after {
    content: '';
    width: 100%;
    position: absolute;
    right: 0;
    top: 40%;
}
.crossout-down::after {
    border-bottom: .2em solid black;
    transform: skewY(60deg);
}
`),t.add(`mlongdiv`,P),customElements.define(`m-elem-math`,class extends HTMLElement{constructor(){super();let e=new N(this.children[0]).expandMStackElement(this.children[0]),n=this.attachShadow({mode:`open`});n.appendChild(t.getCSSStyleSheet()),n.appendChild(e)}});const F=`data-has-linebreaks`,I=`data-max-linebreak-width`,L=`data-saved-indent-attrs`,R=`data-x-indent`,z=`data-nesting-depth`,B=[`msub`,`msub`,`msubsup`,`mover`,`munder`,`munderover`,`mfrac`,`mmultiscripts`];var Ee=(function(){var e=null,t=0,n=0;return{set:function(r,i,a){e=r,t=i,n=a},get:function(){return e},getEmInPixels:function(){return t},getBreakWidth:function(){return n}}})();function De(e){return Ee.get().getElementById(e)||document.getElementById(e)}function V(t){return document.createElementNS(e,t)}function Oe(e,t){let n=t.attributes;for(let t=0;t<n.length;t++)e.setAttribute(n[t].name,n[t].value);return e}function H(e,t,n){let r=!0;do{if(e.hasAttribute(t))return e.getAttribute(t);r=e.tagName!==`math`,e=e.parentElement}while(r);return n}function ke(){let e=V(`mtable`);return e.setAttribute(F,`true`),e.setAttribute(`displaystyle`,`true`),e}function Ae(e){return e.tagName===`mtd`&&e.parentElement.tagName===`mtr`&&e.parentElement.parentElement.tagName===`mtable`&&e.parentElement.parentElement.hasAttribute(F)}function je(e){let t=V(`mtr`),n=V(`mtd`);return n.appendChild(e),t.appendChild(n),t}function Me(e,t){let n={},i=H(e,`linebreakstyle`,`before`);return i===`infixLineBreakStyle`&&(i=H(e,`infixLineBreakStyle`,`before`)),n.linebreakstyle=i,n.indentAlign=H(e,`indentalign`,`auto`),n.indentShift=H(e,`indentshift`,`0px`),t==`first`?(n.indentAlign=H(e,`indentalignfirst`,n.indentAlign),n.indentShift=H(e,`indentshiftfirst`,n.indentShift)):t===`last`&&(n.indentAlign=H(e,`indentalignlast`,n.indentAlign),n.indentShift=H(e,`indentshiftlast`,n.indentShift)),n.indentShift=r(e,n.indentShift),n.target=H(e,`indenttarget`,``),n.firstMiddleOrLast=t,n}function U(e,t){let n=`middle`;e.parentElement===e.parentElement.parentElement.firstElementChild?n=`first`:e.parentElement===e.parentElement.parentElement.lastElementChild&&(n=`last`),e.setAttribute(L,JSON.stringify(Me(t,n)))}function Ne(e,t,n){let r=je(t);if(Ae(e)){for(Oe(r.firstElementChild,e);e.attributes.length>0;)e.removeAttributeNode(e.attributes[0]);return e.parentElement.parentElement.insertBefore(r,e.parentElement),e.parentElement}else{let e=ke();return e.setAttribute(`style`,`width: 100%`),e.appendChild(r),n.replaceWith(e),e.appendChild(je(n)),e.lastElementChild}}function Pe(e){let t=H(e,`linebreakstyle`,`before`);t===`infixLineBreakStyle`&&(t=H(e,`infixLineBreakStyle`,`before`));let n=null,r=e;e.previousElementSibling!==null&&e.nextElementSibling!==null&&e.setAttribute(`form`,`infix`);let i=r.parentElement;for(;i.tagName===`mrow`;i=i.parentElement){let e=V(`mrow`);for(;i.firstElementChild;){let n=i.firstElementChild;if(n===r){if(t===`after`){e.appendChild(n),t=`before`;break}else t===`duplicate`&&(t=`before`,e.appendChild(n.cloneNode(!0)));break}e.appendChild(n)}r=i,n&&e.appendChild(n),n=e.children.length===1?e.firstElementChild:e}if(r.tagName===`mrow`&&r.children.length===1){let e=r.firstElementChild;r.replaceWith(e),r=e}return Ne(i,n,r)}function Fe(e){let t=e,n=e.parentElement;for(;n.tagName===`mrow`||n.tagName===`mstyle`||n.tagName===`mpadded`;)t=n,n=n.parentElement;return t}function Ie(e,t){let n=e.querySelectorAll(`mo[linebreak="newline"]`);if(n.length===0)return;let r=null;n.forEach(e=>{r=Pe(e)});let i=r.parentElement.children;U(i[0].firstElementChild,i[0].firstElementChild);for(let e=0;e<n.length;e++)U(i[e+1].firstElementChild,n[e])}function Le(e){return e===e.parentElement.firstElementChild}function Re(e){for(;e.children.length>0;)e=e.firstElementChild;return e.tagName==`mspace`?e.nextElementSibling:e}function ze(e,t,n){return t-e<=.5*n}function Be(e,t){return t===`-`&&(t=`+`),e.filter(function(e){let n=e.textContent.trim();return n===`-`&&(n=`+`),t===n})}function Ve(e){if(Le(e.parentElement))return 0;let t=Re(e);t.hasAttribute(z)||console.log(`Linebreaking error: depth not set on ${t.tagName} with content '${t.textContent.trim()}'`);let n=t.getAttribute(z),i=t.textContent.trim(),a=1e21,o=!1,s=e.getBoundingClientRect().left,c=parseFloat(e.parentElement.parentElement.getAttribute(I)),l=e.parentElement.previousElementSibling;for(;l;){let e=Ge(l.firstElementChild).filter(e=>n===e.getAttribute(z));e.length===0||e[0].textContent.trim();let t=Be(e,i),r=t.length===0?a:t[0].getBoundingClientRect().left;ze(s,r,c)&&(r<a||!o)&&(o=!0,a=r),r=e.length===0?a:e[0].getBoundingClientRect().left,!o&&ze(s,r,c)&&(a=Math.min(r,a)),l=l.previousElementSibling}return a==1e21?r(t,`3em`):a-s}function He(e,t,n){e.setAttribute(`style`,`text-align: ${t};`);let r=V(`mspace`);if(r.setAttribute(`width`,n.toString()+`px`),e.setAttribute(R,n.toString()),e.children.length!==1||e.firstElementChild.tagName!==`mrow`){console.log(`unexpected element '${e.firstElementChild.tagName}' encountered while trying to indent line`);return}let i=e.firstElementChild;t===`right`?i.appendChild(i):i.insertBefore(r,i.firstElementChild)}function Ue(e,t,n){let r=parseFloat(n.indentShift),i=n.indentAlign;if(i===`id`){let e=De(n.target);if(e)return e.getBoundingClientRect().left-t+r;i=`auto`}if(i==`auto`&&n.firstMiddleOrLast!==`first`){for(;e.tagName!==`mtd`&&!e.parentElement.parentElement.hasAttribute(F);)e=e.parentElement;r+=Ve(e)}return r}function W(e){if(e.hasAttribute(R))return;let t=JSON.parse(e.getAttribute(L)),n=e.getBoundingClientRect().left,r=Ue(e,n,t),i=t.indentAlign;if(i===`id`){if(De(t.target)&&!e.querySelector(`#`+t.target)){He(e,`left`,r);return}i=`auto`}i==`auto`&&(i=`left`),He(e,i,r)}function We(e){let t=e,n=e.parentElement;do{if(n.firstElementChild!==e||!B.includes(n.tagName))return t!==e&&(e.hasAttribute(z)||console.log(`Linebreaking error: depth not set on ${e.tagName} with content '${e.textContent.trim()}'`),t.setAttribute(z,e.getAttribute(z))),t;t=n,n=n.parentElement}while(n);return console.log(`In linebreaking in expandToEmbellishedElement: unexpected loop termination. mo = '${e.tagName}'`),e}function Ge(e){return Array.from(e.querySelectorAll(`mo:not([linebreak="nobreak"])`)).filter(e=>{do e=e.parentElement;while(e.tagName===`mrow`||e.tagName===`mstyle`||e.tagName===`mpadded`);return e.tagName===`math`||Ae(e)}).map(e=>We(e))}const Ke={"(":0,")":0,"=":10,"+":30,"±":30,"-":30,"*":40,"×":40,InvisibleTimes:40,InvisibleFunctionApply:50},qe=[`(`,`[`,`{`],Je=[`)`,`]`,`}`];function G(e){let t=Ke[e];return t===void 0?40:t}function Ye(e){if(e.tagName===`mo`)return e;let t=e;for(;B.includes(t.tagName);)if(t=t.firstElementChild,!t)return e;return t.tagName===`mo`?t:e}function K(e){return e[e.length-1]}function Xe(e){return Array.isArray(e)}function Ze(e){return qe.includes(e)}function q(e,t,n){let r=K(e),i=r+1;for(;n<r;){let n=t.length-1;for(;Array.isArray(t[n]);)n--;for(n--,e.pop();Array.isArray(t[n]);)n--;let a=t.splice(n+1);if(r===i&&Array.isArray(K(a))){let e=a.pop();t.push(a.concat(e))}else t.push(a);i=r,r=K(e)}return[e,t]}const Qe=(function(){let t=document.createElementNS(e,`mo`);return t.textContent=`⁡`,t});function $e(e,t){let n=G(`⁡`);[e,t]=q(e,t,n),e.push(n),t.push(Qe)}function et(e,t,n){for(let r=0;r<e.children.length;r++){let i=Ye(e.children[r]);if(i.tagName===`mo`){let e=i.textContent.trim();if(Xe(K(n))&&Ze(e)&&$e(t,n),Ze(e))t.push(0),n.push(i);else if(Je.includes(e)){[t,n]=q(t,n,0),n.push(i),K(t)!==0&&console.log(`In linebreaking, parsing error with close char -- top of op stack is ${K(t)}`),t.pop();let e=n.splice(n.length-3);n.push(e)}else{let r=G(e);[t,n]=q(t,n,r),t.push(r),n.push(i)}}else i.tagName===`mrow`||i.tagName===`mpadded`||i.tagName===`mstyle`?[t,n]=et(i,t,n):(Xe(K(n))&&$e(t,n),n.push([i]))}return[t,n]}function tt(e,t){e.forEach(e=>{Array.isArray(e)?tt(e,t+1):e.tagName===`mo`&&e.setAttribute(z,t.toString())})}function J(e){if(e.childElementCount<=3)return!0;if(e.childElementCount%2==0)return!1;let t=G(e.children[1].textContent.trim());for(let n=0;n<e.childElementCount-1;n+=2)if(e.children[n].tagName===`mo`||e.children[n+1].tagName!==`mo`||G(e.children[n+1].textContent.trim())!==t)return!1;return!0}function nt(e){let t=Array.from(e.querySelectorAll(`mrow`));switch((e.tagName===`mrow`||e.tagName===`math`)&&t.push(e),t.length){case 0:return!0;case 1:return J(t[0]);case 2:return J(t[0])&&J(t[1]);default:return J(t[0])&&J(t[Math.floor(t.length/2)])&&J(t[t.length-1])}}function rt(e,t){let n=Ye(e);if(n.tagName===`mo`){n.setAttribute(z,t.toString());return}if(e.tagName===`mrow`||e.tagName===`mstyle`||e.tagName===`mpadded`||e.tagName===`math`)for(let n=0;n<e.childElementCount;n++)rt(e.children[n],t+ +(e.tagName===`mrow`))}function it(e){let t=[],n=Array.from(e.querySelectorAll(`mo[linebreak="newline"]`));n.push(e),n.forEach(e=>{let n=Fe(e);if(!t.includes(n))if(t.push(n),nt(n))rt(n,0);else{let[e,t]=et(n,[-1],[null]);t.length!=2&&([e,t]=q(e,t,-1)),tt(t[1],0)}})}function at(e,t){let n=(.9*t-e)/t;return n*n}function ot(e){let t=[.05,.090909,.173554,.248685,.316987,.379079,.435526,.486842,.533493,.575902,.614457,.649506,.681369,.710336,.736669,.760608];e.hasAttribute(z)||console.log(`Linebreaking error: depth not set on ${e.tagName} with content '${e.textContent.trim()}'`);let n=parseInt(e.getAttribute(z));return n>=t.length?1-3.482066/n:t[n]}function st(e,t,n){let r=3*ot(e)+at(t,n),i=H(e,`linebreak`,`auto`);return i===`goodbreak`?r/3:i===`badbreak`?3*r:r}function ct(e,t){let n=e[t];if(n.textContent.trim()===`⁢`){let r=H(n,`linebreakmultchar`,`⁢`);if(r!==`⁢`){let i=V(`mo`);return i.textContent=r,Oe(i,n),n.replaceWith(i),e[t]=i,i}}return n}function lt(e,t){if(parseFloat(e.getAttribute(Z))<=t)return;let n=Ge(e),r,i=e.tagName===`mtd`?e.parentElement:e.parentNode,a=0,o=1;for(;o<n.length;){let s=o,c=e.tagName===`mtd`?i.firstElementChild:i.lastElementChild,l=JSON.parse(c.getAttribute(L)),u=l.linebreakstyle===`before`?n[o-1].getBoundingClientRect().left:c.firstElementChild.getBoundingClientRect().left,d=t-Ue(n[o-1],c.getBoundingClientRect().left,l),f=1e5,p=-1;for(;s<n.length;){let e=n[s].getBoundingClientRect().right-u;if(e>d)break;let t=st(n[s],e,d);t<=f&&(f=t,p=s),s++}if(p===-1&&(console.log(`Linebreaking error: no breakpoint found on line ${a+1}`),p=o),a++,o=p+1,o<n.length){r=ct(n,p),i=Pe(n[p]),i.parentElement.setAttribute(I,t.toString()),U(i.firstElementChild,r);let a=i.previousElementSibling;a.firstElementChild.hasAttribute(L)||a.firstElementChild.setAttribute(L,e.getAttribute(L)),W(a.firstElementChild)}else if(a===1)return}a>0&&W(i.firstElementChild)}const Y=`math-with-linebreaks`;function X(e,t){t=Math.min(t,parseFloat(e.getAttribute(Z)));let n=e.shadowRoot.lastElementChild;if(n.childElementCount>1){let e=V(`mrow`);for(;n.firstElementChild;)e.appendChild(n.firstElementChild);n.appendChild(e)}Ee.set(e.shadowRoot),Ie(n,t);let r=Array.from(n.querySelectorAll(`mtable[${F}]`));r.length>0?r.forEach(e=>{e.setAttribute(I,t.toString()),Array.from(e.children).forEach(e=>{let n=e.firstElementChild;W(n),n.firstElementChild.getBoundingClientRect().right-n.getBoundingClientRect().left>t&&lt(n,t)})}):parseInt(e.getAttribute(Z))>=t&&(n.setAttribute(L,JSON.stringify(Me(n,`first`))),lt(n,t))}const Z=`data-full-width`,Q=`data-linebreak-width`;function $(e,t){let i=n(t);e.shadowRoot.appendChild(i);let a=i.lastElementChild.getBoundingClientRect().right-i.firstElementChild.getBoundingClientRect().left;i.hasAttribute(`maxwidth`)&&(a=Math.min(a,r(i,i.getAttribute(`maxwidth`)))),e.setAttribute(Z,a.toString()),X(e,a),e.setAttribute(Q,(2*a).toString())}function ut(e){let t=getComputedStyle(e).getPropertyValue(`display`),n=e.hasAttribute(`display`)?e.getAttribute(`display`):`inline`;if(t===`inline`||n===`inline`)return null;if(e.tagName.toLowerCase()===Y||e.parentElement.tagName.toLowerCase()===Y)return e;{let t=e.parentElement,n=e.nextElementSibling,r=document.createElement(Y);return r.appendChild(e),t.insertBefore(r,n),it(e),$(r,e),null}}t.add(`math`,ut);const dt=new ResizeObserver(e=>{for(let t of e)if(t.target.tagName.toLowerCase()===Y){let e=t.target;if(t.contentRect.width<parseInt(e.getAttribute(Z))){let r=n(e.firstElementChild);e.shadowRoot.lastElementChild.replaceWith(r),e.setAttribute(Q,t.contentRect.width.toString()),X(e,t.contentRect.width.toString())}else if(!e.hasAttribute(Q)||parseInt(e.getAttribute(Q))<=parseInt(e.getAttribute(Z))){let r=n(e.firstElementChild);e.shadowRoot.lastElementChild.replaceWith(r),e.setAttribute(Q,(2*t.contentRect.width).toString()),X(e,2*t.contentRect.width.toString())}}});customElements.define(Y,class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`}).appendChild(t.getCSSStyleSheet());let e=this.firstElementChild;e&&(it(e),$(this,e)),dt.observe(this)}});{let e=document.createElement(`style`);e.innerHTML=`
           math-with-linebreaks {
                display: block;
            }
    `,document.head.insertBefore(e,document.head.firstElementChild)}t.add(`math *[href]`,e=>(e.namespaceURI==`http://www.w3.org/1998/Math/MathML`&&(e.style.cursor=`pointer`,e.tabIndex=0,e.setAttribute(`role`,`link`),e.addEventListener(`click`,e=>{document.location=e.currentTarget.getAttribute(`href`)}),e.addEventListener(`keydown`,e=>{e.key==`Enter`&&(document.location=e.currentTarget.getAttribute(`href`))}),e.addEventListener(`mouseover`,e=>{e.currentTarget.style.textDecoration=`solid underline`}),e.addEventListener(`mouseout`,e=>{e.currentTarget.style.textDecoration=``})),e));export{t as _MathTransforms};