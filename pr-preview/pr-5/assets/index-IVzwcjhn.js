(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=globalThis,t=e.ShadowRoot&&(e.ShadyCSS===void 0||e.ShadyCSS.nativeShadow)&&`adoptedStyleSheets`in Document.prototype&&`replace`in CSSStyleSheet.prototype,n=Symbol(),r=new WeakMap,i=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,n=this.t;if(t&&e===void 0){let t=n!==void 0&&n.length===1;t&&(e=r.get(n)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&r.set(n,e))}return e}toString(){return this.cssText}},a=e=>new i(typeof e==`string`?e:e+``,void 0,n),o=(e,...t)=>new i(e.length===1?e[0]:t.reduce(((t,n,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if(typeof e==`number`)return e;throw Error(`Value passed to 'css' function must be a 'css' function result: `+e+`. Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.`)})(n)+e[r+1]),e[0]),e,n),s=(n,r)=>{if(t)n.adoptedStyleSheets=r.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(let t of r){let r=document.createElement(`style`),i=e.litNonce;i!==void 0&&r.setAttribute(`nonce`,i),r.textContent=t.cssText,n.appendChild(r)}},c=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t=``;for(let n of e.cssRules)t+=n.cssText;return a(t)})(e):e,{is:l,defineProperty:u,getOwnPropertyDescriptor:d,getOwnPropertyNames:f,getOwnPropertySymbols:p,getPrototypeOf:ee}=Object,te=globalThis,ne=te.trustedTypes,m=ne?ne.emptyScript:``,re=te.reactiveElementPolyfillSupport,h=(e,t)=>e,ie={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=e!==null;break;case Number:n=e===null?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch{n=null}}return n}},ae=(e,t)=>!l(e,t),oe={attribute:!0,type:String,converter:ie,reflect:!1,useDefault:!1,hasChanged:ae};Symbol.metadata??=Symbol(`metadata`),te.litPropertyMetadata??=new WeakMap;var g=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=oe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),r=this.getPropertyDescriptor(e,n,t);r!==void 0&&u(this.prototype,e,r)}}static getPropertyDescriptor(e,t,n){let{get:r,set:i}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){let a=r?.call(this);i?.call(this,t),this.requestUpdate(e,a,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??oe}static _$Ei(){if(this.hasOwnProperty(h(`elementProperties`)))return;let e=ee(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(h(`finalized`)))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(h(`properties`))){let e=this.properties,t=[...f(e),...p(e)];for(let n of t)this.createProperty(n,e[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let n=this._$Eu(e,t);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let e of n)t.unshift(c(e))}else e!==void 0&&t.push(c(e));return t}static _$Eu(e,t){let n=t.attribute;return!1===n?void 0:typeof n==`string`?n:typeof e==`string`?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((e=>e(this)))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return s(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((e=>e.hostConnected?.()))}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach((e=>e.hostDisconnected?.()))}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,n);if(r!==void 0&&!0===n.reflect){let i=(n.converter?.toAttribute===void 0?ie:n.converter).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,r=n._$Eh.get(e);if(r!==void 0&&this._$Em!==r){let e=n.getPropertyOptions(r),i=typeof e.converter==`function`?{fromAttribute:e.converter}:e.converter?.fromAttribute===void 0?ie:e.converter;this._$Em=r;let a=i.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,n){if(e!==void 0){let r=this.constructor,i=this[e];if(n??=r.getPropertyOptions(e),!((n.hasChanged??ae)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:r,wrapped:i},a){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==i||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,n]of e){let{wrapped:e}=n,r=this[t];!0!==e||this._$AL.has(t)||r===void 0||this.C(t,void 0,n,r)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach((e=>e.hostUpdate?.())),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};g.elementStyles=[],g.shadowRootOptions={mode:`open`},g[h(`elementProperties`)]=new Map,g[h(`finalized`)]=new Map,re?.({ReactiveElement:g}),(te.reactiveElementVersions??=[]).push(`2.1.1`);var se=globalThis,_=se.trustedTypes,v=_?_.createPolicy(`lit-html`,{createHTML:e=>e}):void 0,ce=`$lit$`,y=`lit$${Math.random().toFixed(9).slice(2)}$`,le=`?`+y,ue=`<${le}>`,b=document,x=()=>b.createComment(``),S=e=>e===null||typeof e!=`object`&&typeof e!=`function`,C=Array.isArray,w=e=>C(e)||typeof e?.[Symbol.iterator]==`function`,T=`[ 	
\f\r]`,E=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,O=/>/g,k=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,`g`),A=/'/g,de=/"/g,fe=/^(?:script|style|textarea|title)$/i,j=(e=>(t,...n)=>({_$litType$:e,strings:t,values:n}))(1),M=Symbol.for(`lit-noChange`),N=Symbol.for(`lit-nothing`),pe=new WeakMap,P=b.createTreeWalker(b,129);function me(e,t){if(!C(e)||!e.hasOwnProperty(`raw`))throw Error(`invalid template strings array`);return v===void 0?t:v.createHTML(t)}var F=(e,t)=>{let n=e.length-1,r=[],i,a=t===2?`<svg>`:t===3?`<math>`:``,o=E;for(let t=0;t<n;t++){let n=e[t],s,c,l=-1,u=0;for(;u<n.length&&(o.lastIndex=u,c=o.exec(n),c!==null);)u=o.lastIndex,o===E?c[1]===`!--`?o=D:c[1]===void 0?c[2]===void 0?c[3]!==void 0&&(o=k):(fe.test(c[2])&&(i=RegExp(`</`+c[2],`g`)),o=k):o=O:o===k?c[0]===`>`?(o=i??E,l=-1):c[1]===void 0?l=-2:(l=o.lastIndex-c[2].length,s=c[1],o=c[3]===void 0?k:c[3]===`"`?de:A):o===de||o===A?o=k:o===D||o===O?o=E:(o=k,i=void 0);let d=o===k&&e[t+1].startsWith(`/>`)?` `:``;a+=o===E?n+ue:l>=0?(r.push(s),n.slice(0,l)+ce+n.slice(l)+y+d):n+y+(l===-2?t:d)}return[me(e,a+(e[n]||`<?>`)+(t===2?`</svg>`:t===3?`</math>`:``)),r]},he=class e{constructor({strings:t,_$litType$:n},r){let i;this.parts=[];let a=0,o=0,s=t.length-1,c=this.parts,[l,u]=F(t,n);if(this.el=e.createElement(l,r),P.currentNode=this.el.content,n===2||n===3){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;(i=P.nextNode())!==null&&c.length<s;){if(i.nodeType===1){if(i.hasAttributes())for(let e of i.getAttributeNames())if(e.endsWith(ce)){let t=u[o++],n=i.getAttribute(e).split(y),r=/([.?@])?(.*)/.exec(t);c.push({type:1,index:a,name:r[2],strings:n,ctor:r[1]===`.`?_e:r[1]===`?`?ve:r[1]===`@`?ye:R}),i.removeAttribute(e)}else e.startsWith(y)&&(c.push({type:6,index:a}),i.removeAttribute(e));if(fe.test(i.tagName)){let e=i.textContent.split(y),t=e.length-1;if(t>0){i.textContent=_?_.emptyScript:``;for(let n=0;n<t;n++)i.append(e[n],x()),P.nextNode(),c.push({type:2,index:++a});i.append(e[t],x())}}}else if(i.nodeType===8){if(i.data===le)c.push({type:2,index:a});else{let e=-1;for(;(e=i.data.indexOf(y,e+1))!==-1;)c.push({type:7,index:a}),e+=y.length-1}}a++}}static createElement(e,t){let n=b.createElement(`template`);return n.innerHTML=e,n}};function I(e,t,n=e,r){if(t===M)return t;let i=r===void 0?n._$Cl:n._$Co?.[r],a=S(t)?void 0:t._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(e),i._$AT(e,n,r)),r===void 0?n._$Cl=i:(n._$Co??=[])[r]=i),i!==void 0&&(t=I(e,i._$AS(e,t.values),i,r)),t}var ge=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??b).importNode(t,!0);P.currentNode=r;let i=P.nextNode(),a=0,o=0,s=n[0];for(;s!==void 0;){if(a===s.index){let t;s.type===2?t=new L(i,i.nextSibling,this,e):s.type===1?t=new s.ctor(i,s.name,s.strings,this,e):s.type===6&&(t=new be(i,this,e)),this._$AV.push(t),s=n[++o]}a!==s?.index&&(i=P.nextNode(),a++)}return P.currentNode=b,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings===void 0?n._$AI(e[t]):(n._$AI(e,n,t),t+=n.strings.length-2)),t++}},L=class e{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=N,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=I(this,e,t),S(e)?e===N||e==null||e===``?(this._$AH!==N&&this._$AR(),this._$AH=N):e!==this._$AH&&e!==M&&this._(e):e._$litType$===void 0?e.nodeType===void 0?w(e)?this.k(e):this._(e):this.T(e):this.$(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==N&&S(this._$AH)?this._$AA.nextSibling.data=e:this.T(b.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n==`number`?this._$AC(e):(n.el===void 0&&(n.el=he.createElement(me(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let e=new ge(r,this),n=e.u(this.options);e.p(t),this.T(n),this._$AH=e}}_$AC(e){let t=pe.get(e.strings);return t===void 0&&pe.set(e.strings,t=new he(e)),t}k(t){C(this._$AH)||(this._$AH=[],this._$AR());let n=this._$AH,r,i=0;for(let a of t)i===n.length?n.push(r=new e(this.O(x()),this.O(x()),this,this.options)):r=n[i],r._$AI(a),i++;i<n.length&&(this._$AR(r&&r._$AB.nextSibling,i),n.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let t=e.nextSibling;e.remove(),e=t}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},R=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=N,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==``||n[1]!==``?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=N}_$AI(e,t=this,n,r){let i=this.strings,a=!1;if(i===void 0)e=I(this,e,t,0),a=!S(e)||e!==this._$AH&&e!==M,a&&(this._$AH=e);else{let r=e,o,s;for(e=i[0],o=0;o<i.length-1;o++)s=I(this,r[n+o],t,o),s===M&&(s=this._$AH[o]),a||=!S(s)||s!==this._$AH[o],s===N?e=N:e!==N&&(e+=(s??``)+i[o+1]),this._$AH[o]=s}a&&!r&&this.j(e)}j(e){e===N?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??``)}},_e=class extends R{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===N?void 0:e}},ve=class extends R{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==N)}},ye=class extends R{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=I(this,e,t,0)??N)===M)return;let n=this._$AH,r=e===N&&n!==N||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==N&&(n===N||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH==`function`?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},be=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){I(this,e)}},xe=se.litHtmlPolyfillSupport;xe?.(he,L),(se.litHtmlVersions??=[]).push(`3.3.1`);var z=(e,t,n)=>{let r=n?.renderBefore??t,i=r._$litPart$;if(i===void 0){let e=n?.renderBefore??null;r._$litPart$=i=new L(t.insertBefore(x(),e),e,void 0,n??{})}return i._$AI(e),i},Se=globalThis,B=class extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=z(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M}};B._$litElement$=!0,B.finalized=!0,Se.litElementHydrateSupport?.({LitElement:B});var Ce=Se.litElementPolyfillSupport;Ce?.({LitElement:B}),(Se.litElementVersions??=[]).push(`4.2.1`);var V=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer((()=>{customElements.define(e,t)}))},we={attribute:!0,type:String,converter:ie,reflect:!1,hasChanged:ae},Te=(e=we,t,n)=>{let{kind:r,metadata:i}=n,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),r===`setter`&&((e=Object.create(e)).wrapped=!0),a.set(n.name,e),r===`accessor`){let{name:r}=n;return{set(n){let i=t.get.call(this);t.set.call(this,n),this.requestUpdate(r,i,e)},init(t){return t!==void 0&&this.C(r,void 0,e,t),t}}}if(r===`setter`){let{name:r}=n;return function(n){let i=this[r];t.call(this,n),this.requestUpdate(r,i,e)}}throw Error(`Unsupported decorator location: `+r)};function H(e){return(t,n)=>typeof n==`object`?Te(e,t,n):((e,t,n)=>{let r=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),r?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function U(e){return H({...e,state:!0,attribute:!1})}var W=function(e){return e.LIVE=`live`,e.PAUSED=`paused`,e.RECORDING=`recording`,e.VIEWING_RECORDED=`viewing_recorded`,e.IMAGE_MODE=`image_mode`,e}({}),G=(e,t)=>{switch(e){case`live`:return[`paused`,`recording`,`image_mode`].includes(t);case`paused`:return[`live`,`image_mode`].includes(t);case`recording`:return[`viewing_recorded`,`live`].includes(t);case`viewing_recorded`:return[`live`,`recording`].includes(t);case`image_mode`:return[`live`].includes(t);default:return!1}},K=class{constructor(e){this._state={isReady:!1,stream:null,dimensions:{width:0,height:0}},this.availableDevices=[],this.currentDeviceId=null,this.host=e,this.host.addController(this)}hostConnected(){}hostDisconnected(){this.cleanup()}get state(){return this._state}get isReady(){return this._state.isReady}get stream(){return this._state.stream}get dimensions(){return this._state.dimensions}get availableCameras(){return this.availableDevices}get currentCameraId(){return this.currentDeviceId}get hasMultipleCameras(){return this.availableDevices.length>1}async initialize(){try{this.updateStatus(`Requesting camera permission...`),await this.enumerateDevices();let e=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:`environment`},width:{ideal:1280},height:{ideal:720}}}),t=e.getVideoTracks()[0];t&&(this.currentDeviceId=t.getSettings().deviceId||null),await this.enumerateDevices(),this._state={...this._state,stream:e,isReady:!0},this.host.requestUpdate(),console.log(`Camera ready, dispatching event with stream:`,e),this.dispatchEvent(`camera-ready`,{stream:e})}catch(e){console.error(`Error accessing camera:`,e),this.dispatchEvent(`camera-error`,{error:e,message:`Camera access denied. Please allow camera permissions and refresh.`})}}updateDimensions(e,t){(this._state.dimensions.width!==e||this._state.dimensions.height!==t)&&(this._state={...this._state,dimensions:{width:e,height:t}},this.host.requestUpdate(),this.dispatchEvent(`dimensions-changed`,{width:e,height:t}))}async enumerateDevices(){try{let e=await navigator.mediaDevices.enumerateDevices();this.availableDevices=e.filter(e=>e.kind===`videoinput`),console.log(`Available video devices:`,this.availableDevices)}catch(e){console.error(`Error enumerating devices:`,e),this.availableDevices=[]}}async switchCamera(e){if(!this.availableDevices.find(t=>t.deviceId===e))throw Error(`Invalid device ID`);try{this.updateStatus(`Switching camera...`),this._state.stream&&this._state.stream.getTracks().forEach(e=>e.stop());let t={video:{deviceId:{exact:e},width:{ideal:1280},height:{ideal:720}}},n=await navigator.mediaDevices.getUserMedia(t);this.currentDeviceId=e,this._state={...this._state,stream:n,isReady:!0},this.host.requestUpdate(),this.dispatchEvent(`camera-ready`,{stream:n}),this.dispatchEvent(`status-clear`,{})}catch(e){console.error(`Error switching camera:`,e),this.dispatchEvent(`camera-error`,{error:e,message:`Failed to switch camera. Please try again.`})}}cleanup(){this._state.stream&&(this._state.stream.getTracks().forEach(e=>e.stop()),this._state={...this._state,stream:null,isReady:!1},this.host.requestUpdate())}updateStatus(e){this.dispatchEvent(`status-update`,{message:e})}dispatchEvent(e,t){this.host instanceof EventTarget&&this.host.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}};function q(e){let t=new Map;for(let n of e)t.set(n.id,(t.get(n.id)??0)+1);let n=[];for(let[e,r]of t)r>1&&n.push(e);return n.sort((e,t)=>e-t)}var Ee=class{constructor(e){this.initialized=!1,this.currentFamily=`tag36h11`,this.detector=e}init(){this.initialized||=(this.detector._atagjs_init(),!0)}setFamily(e){return this.ensureInitialized(),this.detector.cwrap(`atagjs_set_family`,`number`,[`string`])(e)===0&&(this.currentFamily=e,!0)}getFamily(){return this.currentFamily}detect(e,t){this.ensureInitialized();let{width:n,height:r}=t,i=this.detector._atagjs_set_img_buffer(n,r,n);if(n*r!==e.length)throw Error(`Image data size mismatch. Expected ${n*r} bytes, got ${e.length}`);this.detector.HEAPU8.set(e,i);let a=this.detector._atagjs_detect(),o=this.detector.getValue(a,`i32`);if(o===0)return[];let s=this.detector.getValue(a+4,`i32`),c=new Uint8Array(this.detector.HEAPU8.buffer,s,o),l=``;for(let e=0;e<o;e++)l+=String.fromCharCode(c[e]);let u=JSON.parse(l);if(!Array.isArray(u))throw Error(`Invalid detections format`);return u}detectFromImageData(e){let t=this.convertToGrayscale(e);return this.detect(t,{width:e.width,height:e.height})}convertToGrayscale(e){let t=e.data,n=new Uint8Array(e.width*e.height);for(let e=0;e<t.length;e+=4){let r=Math.round((t[e]+t[e+1]+t[e+2])/3);n[e/4]=r}return n}isReady(){return this.initialized}ensureInitialized(){if(!this.initialized)throw Error(`Detector not initialized. Call init() first.`)}static getAvailableFamilies(){return[{id:`tag36h11`,name:`36h11`,tagCount:587},{id:`tag25h9`,name:`25h9`,tagCount:35},{id:`tag16h5`,name:`16h5`,tagCount:30},{id:`tagStandard41h12`,name:`Standard 41h12`,tagCount:2115},{id:`tagStandard52h13`,name:`Standard 52h13`,tagCount:48714},{id:`tagCircle21h7`,name:`Circle 21h7`,tagCount:38},{id:`tagCircle49h12`,name:`Circle 49h12`,tagCount:65535},{id:`tagCustom48h12`,name:`Custom 48h12`,tagCount:42211}]}},De=class{constructor(e,t,n=`tag36h11`){this._state={detections:[],duplicateIds:[],frozenFrame:null,selectedImage:null,isProcessing:!1},this.animationFrameId=null,this.video=null,this.currentMode=W.LIVE,this.host=e,this.detector=t,this._currentFamily=n,this.host.addController(this),this.detector.setFamily(n),this.hiddenCanvas=document.createElement(`canvas`),this.hiddenCtx=this.hiddenCanvas.getContext(`2d`)}hostConnected(){}hostDisconnected(){this.stopContinuousDetection()}hostUpdate(){this._previousFamily!==void 0&&this._previousFamily!==this._currentFamily&&this.handleFamilyChange(),this._previousFamily=this._currentFamily}get state(){return this._state}get family(){return this._currentFamily}set family(e){this._currentFamily!==e&&(this._currentFamily=e,this.host.requestUpdate())}get detections(){return this._state.detections}get duplicateIds(){return this._state.duplicateIds}get frozenFrame(){return this._state.frozenFrame}get selectedImage(){return this._state.selectedImage}get isProcessing(){return this._state.isProcessing}setVideo(e){this.video=e}setMode(e){let t=this.currentMode;this.currentMode=e,e===W.LIVE&&t!==W.LIVE?this.resumeLiveDetection():e!==W.LIVE&&t===W.LIVE&&this.stopContinuousDetection()}startContinuousDetection(){this.animationFrameId&&cancelAnimationFrame(this.animationFrameId),this.runDetectionLoop()}stopContinuousDetection(){this.animationFrameId&&=(cancelAnimationFrame(this.animationFrameId),null)}async freezeCurrentFrame(){if(!this.video?.videoWidth)return;let e=this.captureCurrentFrame();if(e){let t=await this.detectInFrame(e);this._state={...this._state,frozenFrame:e,detections:t,duplicateIds:q(t)},this.host.requestUpdate(),this.stopContinuousDetection()}}async loadImageFile(e){try{this.dispatchEvent(`status-update`,{message:`Loading image...`});let t=await this.loadImageAsImageData(e),n=await this.detectInFrame(t);this._state={...this._state,selectedImage:t,detections:n,duplicateIds:q(n),frozenFrame:null},this.host.requestUpdate(),this.stopContinuousDetection(),this.dispatchEvent(`status-clear`)}catch(e){console.error(`Error loading image:`,e),this.dispatchEvent(`status-update`,{message:`Failed to load image`})}}resumeLiveDetection(){this._state={...this._state,frozenFrame:null,selectedImage:null,detections:[],duplicateIds:[]},this.host.requestUpdate(),this.startContinuousDetection()}async redetectInFrozenFrame(){let e=this._state.frozenFrame;if(e)try{this._state={...this._state,isProcessing:!0},this.host.requestUpdate();let t=await this.detectInFrame(e);this._state={...this._state,detections:t,duplicateIds:q(t),isProcessing:!1},this.host.requestUpdate()}catch(e){console.error(`Error re-detecting in frozen frame:`,e),this._state={...this._state,isProcessing:!1},this.host.requestUpdate()}}async redetectInSelectedImage(){let e=this._state.selectedImage;if(e)try{this._state={...this._state,isProcessing:!0},this.host.requestUpdate();let t=await this.detectInFrame(e);this._state={...this._state,detections:t,duplicateIds:q(t),isProcessing:!1},this.host.requestUpdate()}catch(e){console.error(`Error re-detecting in selected image:`,e),this._state={...this._state,isProcessing:!1},this.host.requestUpdate()}}async handleFamilyChange(){this.detector.setFamily(this._currentFamily)?this.currentMode===W.PAUSED&&this._state.frozenFrame?await this.redetectInFrozenFrame():this.currentMode===W.IMAGE_MODE&&this._state.selectedImage&&await this.redetectInSelectedImage():(console.error(`Failed to switch to family: ${this._currentFamily}`),this._currentFamily=this._previousFamily)}runDetectionLoop(){(this.currentMode===W.LIVE||this.currentMode===W.RECORDING)&&(this.animationFrameId=requestAnimationFrame(()=>{this.processCurrentFrame(),this.runDetectionLoop()}))}async processCurrentFrame(){if(!this._state.isProcessing&&this.detector?.isReady()&&this.video?.videoWidth)try{this._state={...this._state,isProcessing:!0},this.host.requestUpdate();let e=this.captureCurrentFrame();if(e){let t=await this.detectInFrame(e),n=q(t);this._state={...this._state,detections:t,duplicateIds:n,isProcessing:!1},this.host.requestUpdate(),this.dispatchEvent(`detections-updated`,{detections:t,duplicateIds:n})}}catch(e){console.error(`Error processing frame:`,e),this._state={...this._state,isProcessing:!1},this.host.requestUpdate()}}captureCurrentFrame(){return this.video?.videoWidth?(this.hiddenCanvas.width=this.video.videoWidth,this.hiddenCanvas.height=this.video.videoHeight,this.hiddenCtx.drawImage(this.video,0,0),this.hiddenCtx.getImageData(0,0,this.hiddenCanvas.width,this.hiddenCanvas.height)):null}async detectInFrame(e){return this.detector?.isReady()?this.detector.detectFromImageData(e):[]}loadImageAsImageData(e){return new Promise((t,n)=>{let r=new Image;r.onload=()=>{let e=document.createElement(`canvas`),n=e.getContext(`2d`);e.width=r.width,e.height=r.height,n.drawImage(r,0,0);let i=n.getImageData(0,0,e.width,e.height);URL.revokeObjectURL(r.src),t(i)},r.onerror=()=>{URL.revokeObjectURL(r.src),n(Error(`Failed to load image`))},r.src=URL.createObjectURL(e)})}dispatchEvent(e,t){this.host instanceof EventTarget&&this.host.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}},Oe=class{constructor(e){this._state={isActive:!1,tagIds:[],isViewing:!1},this.recordedTagIdsSet=new Set,this.host=e,this.host.addController(this)}hostConnected(){}hostDisconnected(){this.stopRecording()}get state(){return this._state}get isActive(){return this._state.isActive}get isViewing(){return this._state.isViewing}get tagIds(){return this._state.tagIds}startRecording(){this._state={isActive:!0,tagIds:[],isViewing:!1},this.recordedTagIdsSet.clear(),this.host.requestUpdate(),this.dispatchEvent(`recording-started`)}stopRecording(){this._state.isActive&&(this._state={...this._state,isActive:!1,isViewing:!0},this.host.requestUpdate(),this.dispatchEvent(`recording-stopped`,{tagIds:this._state.tagIds}))}hideRecorded(){this._state={...this._state,isViewing:!1},this.host.requestUpdate(),this.dispatchEvent(`recording-hidden`)}clearRecorded(){this._state={isActive:!1,tagIds:[],isViewing:!1},this.recordedTagIdsSet.clear(),this.host.requestUpdate()}recordDetections(e){if(!this._state.isActive||e.length===0)return;let t=!1;e.forEach(e=>{this.recordedTagIdsSet.has(e.id)||(this.recordedTagIdsSet.add(e.id),t=!0)}),t&&(this._state={...this._state,tagIds:Array.from(this.recordedTagIdsSet).sort((e,t)=>e-t)},this.host.requestUpdate(),this.dispatchEvent(`tags-updated`,{tagIds:this._state.tagIds}))}dispatchEvent(e,t){this.host instanceof EventTarget&&this.host.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}},ke=class{constructor(e){this._state={message:null},this.fadeOutTimer=null,this.host=e,this.host.addController(this)}hostConnected(){}hostDisconnected(){this.clearMessage()}get state(){return this._state}get message(){return this._state.message}get hasMessage(){return this._state.message!==null}setMessage(e,t){this.fadeOutTimer!==null&&(clearTimeout(this.fadeOutTimer),this.fadeOutTimer=null);let n=t?Date.now()+t:void 0;this._state={message:e,fadeOutTime:n},this.host.requestUpdate(),t&&(this.fadeOutTimer=window.setTimeout(()=>{this._state.fadeOutTime===n&&this.clearMessage()},t))}clearMessage(){this.fadeOutTimer!==null&&(clearTimeout(this.fadeOutTimer),this.fadeOutTimer=null),this._state={message:null},this.host.requestUpdate()}setTemporaryMessage(e,t=3e3){this.setMessage(e,t)}setPersistentMessage(e){this.setMessage(e)}};function J(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var Y=class extends B{constructor(...e){super(...e),this.currentFamily=`tag36h11`,this.showMenu=!1,this.disabled=!1,this.families=[{id:`tag36h11`,label:`tag36h11 (587 tags)`},{id:`tag25h9`,label:`tag25h9 (35 tags)`},{id:`tag16h5`,label:`tag16h5 (30 tags)`},{id:`tagStandard41h12`,label:`tagStandard41h12 (2115 tags)`},{id:`tagStandard52h13`,label:`tagStandard52h13 (48714 tags)`},{id:`tagCircle21h7`,label:`tagCircle21h7 (38 tags)`},{id:`tagCircle49h12`,label:`tagCircle49h12 (65535 tags)`},{id:`tagCustom48h12`,label:`tagCustom48h12 (42211 tags)`}],this.handleClick=e=>{e.stopPropagation()},this.handleDocumentClick=e=>{e.composedPath().includes(this)||(this.showMenu=!1)}}static{this.styles=o`
    :host {
      display: block;
      position: relative;
    }

    .dropdown {
      background: var(--card-bg);
      border: 1px solid var(--neon-purple);
      border-radius: 8px;
      color: var(--text-primary);
      font-size: 14px;
      font-family: 'Courier New', monospace;
      padding: 8px 16px;
      cursor: pointer;
      min-width: 120px;
      max-width: 240px;
      width: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.3s ease;
      box-shadow: 0 0 15px rgba(128, 0, 255, 0.3);
    }

    .dropdown:hover {
      background: var(--card-bg);
      border-color: var(--neon-purple);
      box-shadow: 0 0 25px rgba(128, 0, 255, 0.5);
      text-shadow: 0 0 10px var(--neon-purple);
    }

    .dropdown.active {
      background: var(--card-bg);
      border-color: var(--neon-purple);
      box-shadow: 0 0 30px rgba(128, 0, 255, 0.6);
      text-shadow: 0 0 15px var(--neon-purple);
    }

    .dropdown-label {
      flex: 1;
      text-align: left;
      font-weight: 500;
    }

    .dropdown-arrow {
      margin-left: 8px;
      transition: transform 0.2s;
    }

    .dropdown.active .dropdown-arrow {
      transform: rotate(180deg);
    }

    .dropdown.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      border-color: var(--text-secondary);
      box-shadow: 0 0 10px rgba(128, 128, 128, 0.2);
    }

    .dropdown.disabled:hover {
      background: var(--card-bg);
      border-color: var(--text-secondary);
      box-shadow: 0 0 10px rgba(128, 128, 128, 0.2);
      text-shadow: none;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      background: var(--card-bg);
      backdrop-filter: blur(10px);
      border: 1px solid var(--neon-purple);
      border-radius: 8px;
      padding: 4px;
      z-index: 1001;
      display: none;
      box-shadow:
        0 4px 20px rgba(128, 0, 255, 0.4),
        inset 0 0 20px rgba(128, 0, 255, 0.1);
      min-width: max-content;
      width: auto;
    }

    .dropdown-menu.active {
      display: block;
    }

    .menu-item {
      padding: 10px 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 4px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      color: var(--text-secondary);
    }

    .menu-item:hover {
      background: rgba(128, 0, 255, 0.2);
      color: var(--text-primary);
      text-shadow: 0 0 10px var(--neon-purple);
      box-shadow: inset 0 0 10px rgba(128, 0, 255, 0.3);
    }

    .menu-item.selected {
      background: rgba(128, 0, 255, 0.3);
      color: var(--text-primary);
      font-weight: 500;
      text-shadow: 0 0 5px var(--neon-purple);
      box-shadow: inset 0 0 15px rgba(128, 0, 255, 0.4);
    }

    @media (max-width: 480px) {
      .dropdown {
        min-width: 100px;
        max-width: 150px;
        padding: 6px 12px;
        font-size: 12px;
      }
      
      .dropdown-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .dropdown-arrow {
        margin-left: 4px;
      }
      
      .dropdown-menu {
        right: 0;
        left: auto;
        min-width: 180px;
      }
      
      .menu-item {
        padding: 8px 12px;
        font-size: 12px;
      }
    }
  `}render(){let e=this.families.find(e=>e.id===this.currentFamily),t=e?.id||this.currentFamily;return j`
      <div
        class="dropdown ${this.showMenu?`active`:``} ${this.disabled?`disabled`:``}"
        @click=${this.disabled?void 0:this.toggleMenu}
        title="${this.disabled?`Family selection disabled during recording/playback`:e?.label||t}"
      >
        <span class="dropdown-label">${t}</span>
        <span class="dropdown-arrow">▼</span>
      </div>
      <div class="dropdown-menu ${this.showMenu?`active`:``}">
        ${this.families.map(e=>j`
            <div
              class="menu-item ${this.currentFamily===e.id?`selected`:``}"
              @click=${t=>{t.stopPropagation(),this.selectFamily(e.id)}}
            >
              ${e.label}
            </div>
          `)}
      </div>
    `}connectedCallback(){super.connectedCallback(),this.addEventListener(`click`,this.handleClick),document.addEventListener(`click`,this.handleDocumentClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(`click`,this.handleDocumentClick)}toggleMenu(){this.disabled||(this.showMenu=!this.showMenu)}selectFamily(e){e!==this.currentFamily&&this.dispatchEvent(new CustomEvent(`family-selected`,{detail:{familyId:e},bubbles:!0,composed:!0})),this.showMenu=!1}};J([H({type:String})],Y.prototype,`currentFamily`,void 0),J([H({type:Boolean})],Y.prototype,`showMenu`,void 0),J([H({type:Boolean})],Y.prototype,`disabled`,void 0),Y=J([V(`family-selector`)],Y);var X=class extends B{constructor(...e){super(...e),this.detections=[],this.duplicateIds=[],this.showImage=!1,this.coverMode=!0}static{this.styles=o`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    canvas {
      width: 100%;
      height: 100%;
      background: transparent;
    }

    canvas.cover-mode {
      object-fit: cover;
    }

    canvas.fill-mode {
      object-fit: contain;
    }
  `}render(){return j`
      <canvas class="${this.coverMode?`cover-mode`:`fill-mode`}"></canvas>
    `}firstUpdated(){this.canvas=this.shadowRoot.querySelector(`canvas`),this.ctx=this.canvas.getContext(`2d`)}updated(e){(e.has(`detections`)||e.has(`duplicateIds`)||e.has(`imageData`)||e.has(`showImage`)||e.has(`videoDimensions`)||e.has(`coverMode`))&&this.drawCanvas()}drawCanvas(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.showImage&&this.imageData?(this.canvas.width=this.imageData.width,this.canvas.height=this.imageData.height,this.ctx.putImageData(this.imageData,0,0)):this.videoDimensions&&(this.canvas.width=this.videoDimensions.width,this.canvas.height=this.videoDimensions.height),this.drawDetections()}setCanvasDimensions(e,t){this.canvas.width=e,this.canvas.height=t}drawDetections(){if(!this.detections||this.detections.length===0)return;let e=new Set(this.duplicateIds),t=this.calculateViewportRelativeFontSize();this.ctx.font=`bold ${t}px Arial`,this.ctx.textAlign=`center`;let n=Math.max(1,Math.round(t*.07)),r=Math.max(1.5,Math.round(t*.15)),i=Math.max(1,Math.round(t*.14)),a=Math.max(1,Math.round(t*.07));this.detections.forEach(t=>{let o=t.corners,s=e.has(t.id),c=s?`#ff4444`:`#00ffff`,l=s?`#ff8800`:`#ff00ff`,u=s?`#ff4444`:`#00ff80`,d=s?`#ff4444`:`#00ff80`;this.ctx.shadowColor=c,this.ctx.shadowBlur=10,this.ctx.strokeStyle=c,this.ctx.lineWidth=n,this.ctx.beginPath(),this.ctx.moveTo(o[0].x,o[0].y);for(let e=1;e<o.length;e++)this.ctx.lineTo(o[e].x,o[e].y);this.ctx.closePath(),this.ctx.stroke(),this.ctx.shadowBlur=0,this.ctx.fillStyle=l,this.ctx.beginPath(),this.ctx.arc(o[0].x,o[0].y,r,0,2*Math.PI),this.ctx.fill();let f=t.center,p=t.id.toString();this.ctx.shadowBlur=0,this.ctx.strokeStyle=`#000000`,this.ctx.lineWidth=i,this.ctx.strokeText(p,f.x,f.y+10),this.ctx.strokeStyle=c,this.ctx.lineWidth=a,this.ctx.strokeText(p,f.x,f.y+10),this.ctx.shadowColor=d,this.ctx.shadowBlur=5,this.ctx.fillStyle=u,this.ctx.fillText(p,f.x,f.y+10),this.ctx.shadowBlur=0})}calculateViewportRelativeFontSize(){let e=this.canvas.getBoundingClientRect(),t=e.width,n=e.height,r=Math.max(12,Math.round(Math.min(t,n)*.03)),i=(this.canvas.width/t+this.canvas.height/n)/2;return Math.round(r*i)}clear(){this.detections=[],this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}};J([H({type:Array})],X.prototype,`detections`,void 0),J([H({type:Array})],X.prototype,`duplicateIds`,void 0),J([H({type:Object})],X.prototype,`imageData`,void 0),J([H({type:Boolean})],X.prototype,`showImage`,void 0),J([H({type:Object})],X.prototype,`videoDimensions`,void 0),J([H({type:Boolean})],X.prototype,`coverMode`,void 0),X=J([V(`apriltag-detections`)],X);var Z=class extends B{constructor(...e){super(...e),this.recordMode=!1,this.appMode=W.LIVE,this.availableCameras=[],this.currentCameraId=null,this.coverMode=!0,this.showMenu=!1,this.handleDocumentClick=e=>{e.composedPath().includes(this)||(this.showMenu=!1)}}static{this.styles=o`
    :host {
      display: block;
      position: relative;
    }

    .menu-button {
      background: transparent;
      border: 1px solid var(--neon-blue);
      color: var(--neon-blue);
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px rgba(0, 128, 255, 0.3);
    }

    .menu-button:hover {
      background: rgba(0, 128, 255, 0.1);
      box-shadow: 0 0 20px rgba(0, 128, 255, 0.5);
      text-shadow: 0 0 10px var(--neon-blue);
    }

    .menu-button.active {
      background: rgba(0, 128, 255, 0.2);
      box-shadow: 0 0 25px rgba(0, 128, 255, 0.6);
      text-shadow: 0 0 15px var(--neon-blue);
    }

    .menu-button svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
      filter: drop-shadow(0 0 5px var(--neon-blue));
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      background: var(--card-bg);
      backdrop-filter: blur(10px);
      border: 1px solid var(--neon-blue);
      border-radius: 8px;
      padding: 4px;
      z-index: 1001;
      display: none;
      box-shadow:
        0 4px 20px rgba(0, 128, 255, 0.4),
        inset 0 0 20px rgba(0, 128, 255, 0.1);
      min-width: 160px;
      width: max-content;
    }

    .dropdown-menu.active {
      display: block;
    }

    .menu-item {
      width: 100%;
      background: none;
      border: none;
      text-align: left;
      padding: 10px 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 4px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--text-primary);
      gap: 10px;
    }

    .menu-item:hover {
      background: rgba(0, 128, 255, 0.2);
      color: var(--neon-blue);
      text-shadow: 0 0 10px var(--neon-blue);
      box-shadow: inset 0 0 10px rgba(0, 128, 255, 0.3);
    }

    .toggle-switch {
      width: 32px;
      height: 18px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid var(--neon-magenta);
      border-radius: 9px;
      position: relative;
      transition: all 0.3s ease;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
    }

    .toggle-switch.active {
      background: rgba(255, 0, 255, 0.3);
      box-shadow: 0 0 20px rgba(255, 0, 255, 0.6);
    }

    .toggle-switch::after {
      content: '';
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--text-primary);
      border: 1px solid var(--neon-magenta);
      top: 1px;
      left: 1px;
      transition: transform 0.3s ease;
      box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
    }

    .toggle-switch.active::after {
      transform: translateX(14px);
      background: var(--neon-magenta);
      box-shadow: 0 0 15px var(--neon-magenta);
    }

    .menu-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .menu-item.disabled:hover {
      background: transparent;
      color: var(--text-primary);
      text-shadow: none;
      box-shadow: none;
    }

    .toggle-switch.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    @media (max-width: 480px) {
      .menu-button {
        padding: 6px;
      }
      
      .menu-button svg {
        width: 18px;
        height: 18px;
      }
      
      .dropdown-menu {
        min-width: 140px;
      }
      
      .menu-item {
        padding: 8px 12px;
        font-size: 12px;
      }
      
      .toggle-switch {
        width: 28px;
        height: 16px;
      }
      
      .toggle-switch::after {
        width: 12px;
        height: 12px;
      }
      
      .toggle-switch.active::after {
        transform: translateX(12px);
      }
    }
  `}render(){let e=this.isRecordModeDisabled(),t=this.isCameraSwitchEnabled(),n=this.appMode===W.RECORDING||this.appMode===W.VIEWING_RECORDED,r=this.isCoverModeDisabled();return j`
      <button
        class="menu-button ${this.showMenu?`active`:``}"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded=${this.showMenu?`true`:`false`}
        @click=${this.toggleMenu}
      >
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      <div
        class="dropdown-menu ${this.showMenu?`active`:``}"
        role="menu"
        aria-label="More options"
      >
        <button
          class="menu-item ${e?`disabled`:``}"
          role="menuitemcheckbox"
          aria-checked=${this.recordMode?`true`:`false`}
          aria-disabled=${e?`true`:`false`}
          @click=${this.handleToggleClick}
          title="${e?`Record mode is disabled while viewing frozen video or images`:``}"
        >
          <span>Record Mode</span>
          <span
            class="toggle-switch ${this.recordMode?`active`:``} ${e?`disabled`:``}"
          ></span>
        </button>
        <button
          class="menu-item ${r?`disabled`:``}"
          role="menuitemcheckbox"
          aria-checked=${this.coverMode?`true`:`false`}
          aria-disabled=${r?`true`:`false`}
          @click=${this.handleCoverModeToggleClick}
          title="${r?`Cover/Contain mode is disabled for recorded tags and uploaded images`:this.coverMode?`Switch to contain mode (show full image)`:`Switch to cover mode (fill viewport)`}"
        >
          <span>${this.coverMode?`Cover`:`Contain`} Mode</span>
          <span
            class="toggle-switch ${this.coverMode?`active`:``} ${r?`disabled`:``}"
          ></span>
        </button>
        ${this.availableCameras.length>1?j`
              <button
                class="menu-item ${t?``:`disabled`}"
                role="menuitem"
                aria-disabled=${t?`false`:`true`}
                @click=${this.handleSwitchCamera}
                title="${t?`Switch camera`:`Camera switching is only available in live mode`}"
              >
                <span>Switch Camera</span>
                <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor;">
                  <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm3-4.5h-2v2l-3-3 3-3v2h2v2z"/>
                </svg>
              </button>
            `:``}
        <button
          class="menu-item ${n?`disabled`:``}"
          role="menuitem"
          aria-disabled=${n?`true`:`false`}
          @click=${n?this.handleMenuItemClick:this.handleSelectImage}
          title="${n?`Image selection disabled during recording/playback`:`Select an image file`}"
        >
          <span>Select Image</span>
        </button>
        <button
          class="menu-item ${n?`disabled`:``}"
          role="menuitem"
          aria-disabled=${n?`true`:`false`}
          @click=${n?this.handleMenuItemClick:this.handleViewExample}
          title="${n?`View example disabled during recording/playback`:`View example AprilTag image`}"
        >
          <span>View Example</span>
        </button>
        <button
          class="menu-item"
          role="menuitem"
          @click=${this.handleWhatAreAprilTags}
          title="Learn about AprilTags"
        >
          <span>What are AprilTags?</span>
        </button>
      </div>
    `}connectedCallback(){super.connectedCallback(),document.addEventListener(`click`,this.handleDocumentClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener(`click`,this.handleDocumentClick)}toggleMenu(){this.showMenu=!this.showMenu}handleMenuItemClick(e){e.stopPropagation()}isRecordModeDisabled(){return this.appMode===W.PAUSED||this.appMode===W.IMAGE_MODE}isCameraSwitchEnabled(){return this.appMode===W.LIVE||this.appMode===W.RECORDING}isCoverModeDisabled(){return this.appMode===W.VIEWING_RECORDED||this.appMode===W.IMAGE_MODE}handleToggleClick(e){e.stopPropagation(),!this.isRecordModeDisabled()&&(this.recordMode=!this.recordMode,this.dispatchEvent(new CustomEvent(`record-mode-changed`,{detail:{recordMode:this.recordMode},bubbles:!0,composed:!0})))}handleCoverModeToggleClick(e){e.stopPropagation(),!this.isCoverModeDisabled()&&(this.coverMode=!this.coverMode,this.dispatchEvent(new CustomEvent(`cover-mode-changed`,{detail:{coverMode:this.coverMode},bubbles:!0,composed:!0})))}handleSwitchCamera(e){if(e.stopPropagation(),!this.isCameraSwitchEnabled())return;this.showMenu=!1;let t=(this.availableCameras.findIndex(e=>e.deviceId===this.currentCameraId)+1)%this.availableCameras.length,n=this.availableCameras[t];this.dispatchEvent(new CustomEvent(`camera-switch-requested`,{detail:{deviceId:n.deviceId},bubbles:!0,composed:!0}))}handleSelectImage(e){if(e.stopPropagation(),this.appMode===W.RECORDING||this.appMode===W.VIEWING_RECORDED)return;this.showMenu=!1;let t=document.createElement(`input`);t.type=`file`,t.accept=`image/*`,t.style.display=`none`,t.addEventListener(`change`,e=>{let n=e.target.files?.[0];n&&this.dispatchEvent(new CustomEvent(`image-selected`,{detail:{file:n},bubbles:!0,composed:!0})),t.remove()}),document.body.appendChild(t),t.click()}async handleViewExample(e){if(e.stopPropagation(),this.appMode!==W.RECORDING&&this.appMode!==W.VIEWING_RECORDED){this.showMenu=!1;try{let e=await fetch(`/sample.jpg`);if(!e.ok)throw Error(`Failed to load sample image`);let t=await e.blob(),n=new File([t],`sample.jpg`,{type:`image/jpeg`});this.dispatchEvent(new CustomEvent(`image-selected`,{detail:{file:n,familyId:`tagStandard52h13`},bubbles:!0,composed:!0}))}catch(e){console.error(`Error loading sample image:`,e)}}}handleWhatAreAprilTags(e){e.stopPropagation(),this.showMenu=!1,window.open(`https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html`,`_blank`)}};J([H({type:Boolean})],Z.prototype,`recordMode`,void 0),J([H({type:String})],Z.prototype,`appMode`,void 0),J([H({type:Array})],Z.prototype,`availableCameras`,void 0),J([H({type:String})],Z.prototype,`currentCameraId`,void 0),J([H({type:Boolean})],Z.prototype,`coverMode`,void 0),J([U()],Z.prototype,`showMenu`,void 0),Z=J([V(`overflow-menu`)],Z);var Ae=class extends B{constructor(...e){super(...e),this.tagIds=[]}static{this.styles=o`
    :host {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--dark-bg);
      color: var(--text-primary);
      padding: 20px;
      overflow-y: auto;
      font-family: 'Courier New', monospace;
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .header h2 {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 10px 0;
      color: var(--neon-cyan);
      text-shadow: 0 0 15px var(--neon-cyan);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .count {
      font-size: 16px;
      color: var(--text-secondary);
      text-shadow: 0 0 10px var(--neon-green);
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .tag-item {
      background: var(--card-bg);
      border: 1px solid var(--neon-green);
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 14px;
      font-family: 'Courier New', monospace;
      white-space: nowrap;
      color: var(--neon-green);
      text-shadow: 0 0 8px var(--neon-green);
      box-shadow:
        0 0 15px rgba(0, 255, 128, 0.3),
        inset 0 0 10px rgba(0, 255, 128, 0.1);
      transition: all 0.3s ease;
    }

    .tag-item:hover {
      box-shadow:
        0 0 25px rgba(0, 255, 128, 0.5),
        inset 0 0 15px rgba(0, 255, 128, 0.2);
    }

    .tag-item.range {
      background: var(--card-bg);
      border-color: var(--neon-blue);
      color: var(--neon-blue);
      text-shadow: 0 0 8px var(--neon-blue);
      box-shadow:
        0 0 15px rgba(0, 128, 255, 0.3),
        inset 0 0 10px rgba(0, 128, 255, 0.1);
    }

    .tag-item.range:hover {
      box-shadow:
        0 0 25px rgba(0, 128, 255, 0.5),
        inset 0 0 15px rgba(0, 128, 255, 0.2);
    }

    .spacer {
      flex-grow: 1;
    }

    .close-button {
      background: var(--card-bg);
      border: 1px solid var(--text-secondary);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-family: 'Courier New', monospace;
      transition: all 0.3s ease;
      box-shadow: 0 0 10px rgba(176, 176, 208, 0.2);
      align-self: center;
      margin-top: 20px;
    }

    .close-button:hover {
      background: var(--card-bg);
      border-color: var(--text-primary);
      color: var(--neon-pink);
      box-shadow: 0 0 15px rgba(255, 0, 128, 0.3);
      text-shadow: 0 0 8px var(--neon-pink);
    }

    .empty-state {
      text-align: center;
      color: var(--text-secondary);
      font-size: 16px;
      margin-top: 40px;
      text-shadow: 0 0 10px var(--neon-purple);
    }
  `}render(){let e=this.compressTagIds(this.tagIds);return j`
      <div class="header">
        <h2>Recorded Tags</h2>
        ${this.tagIds.length>0?j`<div class="count">
              ${this.tagIds.length} unique
              tag${this.tagIds.length===1?``:`s`} detected
            </div>`:``}
      </div>

      ${this.tagIds.length===0?j`<div class="empty-state">No tags detected during recording</div>`:j`
            <div class="tags-container" role="list" aria-label="Recorded tags">
              ${e.map(e=>j`
                  <div
                    class="tag-item ${e.isRange?`range`:``}"
                    role="listitem"
                  >
                    ${e.display}
                  </div>
                `)}
            </div>
          `}

      <div class="spacer"></div>
      
      <button
        class="close-button"
        aria-label="Close recorded tags"
        @click=${this.close}
      >
        ×
      </button>
    `}compressTagIds(e){if(e.length===0)return[];let t=[...new Set(e)].sort((e,t)=>e-t),n=[],r=t[0],i=t[0];for(let e=1;e<t.length;e++)t[e]===i+1||(r===i?n.push({display:r.toString(),isRange:!1}):i===r+1?(n.push({display:r.toString(),isRange:!1}),n.push({display:i.toString(),isRange:!1})):n.push({display:`${r}-${i}`,isRange:!0}),r=t[e]),i=t[e];return r===i?n.push({display:r.toString(),isRange:!1}):i===r+1?(n.push({display:r.toString(),isRange:!1}),n.push({display:i.toString(),isRange:!1})):n.push({display:`${r}-${i}`,isRange:!0}),n}close(){this.dispatchEvent(new CustomEvent(`close`,{bubbles:!0,composed:!0}))}};J([H({type:Array})],Ae.prototype,`tagIds`,void 0),Ae=J([V(`recorded-tags`)],Ae);var Q=class extends B{constructor(...e){super(...e),this.appMode=W.LIVE,this.currentFamily=localStorage.getItem(`selectedFamily`)||`tag36h11`,this.recordMode=!1,this.captureEnabled=!1,this.coverMode=!0}static{this.styles=o`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      font-family: 'Courier New', monospace;
      background: var(--dark-bg);
      color: var(--text-primary);
    }

    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--glass-bg);
      backdrop-filter: blur(10px);
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--neon-cyan);
      min-height: 60px;
    }

    .header h1 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: var(--neon-cyan);
      text-shadow: 0 0 10px var(--neon-cyan);
      text-transform: uppercase;
      letter-spacing: 2px;
      flex-shrink: 1;
      min-width: 0;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    @media (max-width: 480px) {
      .header {
        padding: 8px 12px;
        gap: 8px;
      }

      .header h1 {
        font-size: 14px;
        letter-spacing: 1px;
      }

      .header-controls {
        gap: 8px;
      }
    }

    family-selector {
      position: relative;
    }

    .camera-container {
      position: fixed;
      top: 80px;
      left: 0;
      right: 0;
      bottom: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--darker-bg);
      border: 1px solid rgba(0, 255, 255, 0.3);
      border-radius: 8px;
      margin: 8px;
      box-shadow:
        inset 0 0 20px rgba(0, 255, 255, 0.1),
        0 0 30px rgba(0, 255, 255, 0.2);
    }

    .video-overlay {
      position: relative;
      width: 100%;
      height: 100%;
    }

    video,
    canvas {
      width: 100%;
      height: 100%;
    }

    video {
      object-fit: cover;
    }

    video.contain-mode {
      object-fit: contain;
    }

    apriltag-detections {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 2;
    }

    video.hidden {
      display: none;
    }

    .controls {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--glass-bg);
      backdrop-filter: blur(10px);
      padding: 20px;
      display: flex;
      justify-content: center;
      gap: 20px;
      border-top: 1px solid var(--neon-magenta);
      box-shadow: 0 -2px 20px rgba(255, 0, 255, 0.2);
    }

    .capture-button {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: var(--card-bg);
      border: 3px solid var(--neon-pink);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.5;
      pointer-events: none;
      position: relative;
      box-shadow:
        0 0 20px rgba(255, 0, 128, 0.4),
        inset 0 0 20px rgba(255, 0, 128, 0.1);
    }

    .capture-button.enabled {
      opacity: 1;
      pointer-events: auto;
      box-shadow:
        0 0 30px rgba(255, 0, 128, 0.6),
        inset 0 0 20px rgba(255, 0, 128, 0.2);
    }

    .capture-button:active {
      transform: scale(0.95);
      box-shadow:
        0 0 40px rgba(255, 0, 128, 0.8),
        inset 0 0 30px rgba(255, 0, 128, 0.3);
    }

    .capture-button svg {
      width: 28px;
      height: 28px;
      fill: var(--neon-pink);
      color: #ffffff;
      filter: drop-shadow(0 0 8px var(--neon-pink));
    }

    .capture-button svg path {
      stroke: var(--neon-pink);
      fill: var(--neon-pink);
    }

    .capture-button svg rect {
      fill: var(--neon-pink);
      stroke: none;
    }

    .capture-button svg circle {
      fill: var(--neon-pink);
      stroke: none;
    }

    .status {
      position: fixed;
      top: 100px;
      left: 20px;
      right: 20px;
      background: var(--card-bg);
      color: var(--text-accent);
      padding: 10px 20px;
      border-radius: 8px;
      border: 1px solid var(--neon-green);
      text-align: center;
      display: none;
      z-index: 999;
      box-shadow:
        0 0 20px rgba(0, 255, 128, 0.4),
        inset 0 0 10px rgba(0, 255, 128, 0.1);
      text-shadow: 0 0 10px var(--neon-green);
    }

    .status.visible {
      display: block;
      animation: neonPulse 2s ease-in-out infinite;
    }

    .duplicate-warning {
      position: fixed;
      top: 100px;
      left: 20px;
      right: 20px;
      background: rgba(40, 0, 0, 0.9);
      color: #ff4444;
      padding: 10px 20px;
      border-radius: 8px;
      border: 1px solid #ff4444;
      text-align: center;
      z-index: 999;
      font-size: 14px;
      box-shadow:
        0 0 20px rgba(255, 68, 68, 0.4),
        inset 0 0 10px rgba(255, 68, 68, 0.1);
      text-shadow: 0 0 10px #ff4444;
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }

    @keyframes neonPulse {
      0%,
      100% {
        box-shadow:
          0 0 20px rgba(0, 255, 128, 0.4),
          inset 0 0 10px rgba(0, 255, 128, 0.1);
      }
      50% {
        box-shadow:
          0 0 30px rgba(0, 255, 128, 0.6),
          inset 0 0 15px rgba(0, 255, 128, 0.2);
      }
    }

    .about-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--card-bg);
      border: 1px solid var(--neon-cyan);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;
      opacity: 0.6;
      box-shadow:
        0 0 10px rgba(6, 9, 9, 0.3),
        inset 0 0 10px rgba(0, 255, 255, 0.1);
    }

    .about-button:hover {
      opacity: 1;
      transform: scale(1.05);
      box-shadow:
        0 0 20px rgba(0, 255, 255, 0.5),
        inset 0 0 15px rgba(0, 255, 255, 0.2);
    }

    .about-button svg {
      width: 20px;
      height: 20px;
      fill: var(--neon-cyan);
      filter: drop-shadow(0 0 5px var(--neon-cyan));
    }
  `}render(){let e=this.captureEnabled&&this.appMode!==W.VIEWING_RECORDED;return j`
      <div class="header">
        <h1>AprilTag Detector</h1>
        <div class="header-controls">
          <family-selector
            .currentFamily=${this.currentFamily}
            .disabled=${this.appMode===W.RECORDING||this.appMode===W.VIEWING_RECORDED}
            @family-selected=${this.handleFamilySelected}
          ></family-selector>
          <overflow-menu
            .recordMode=${this.recordMode}
            .appMode=${this.appMode}
            .availableCameras=${this.cameraController?.availableCameras||[]}
            .currentCameraId=${this.cameraController?.currentCameraId}
            .coverMode=${this.coverMode}
            @record-mode-changed=${this.handleRecordModeChanged}
            @cover-mode-changed=${this.handleCoverModeChanged}
            @image-selected=${this.handleImageSelected}
            @camera-switch-requested=${this.handleCameraSwitchRequested}
          ></overflow-menu>
        </div>
      </div>

      <div
        class="status ${this.statusController?.hasMessage?`visible`:``}"
        role="status"
      >
        ${this.statusController?.message}
      </div>

      ${(this.detectionController?.duplicateIds?.length??0)>0?j`<div class="duplicate-warning" role="alert">
            Duplicate marker${this.detectionController.duplicateIds.length>1?`s`:``}: ${this.detectionController.duplicateIds.join(`, `)}
          </div>`:``}

      <div class="camera-container">
        <div class="video-overlay">
          <video
            class="${this.appMode!==W.LIVE&&this.appMode!==W.RECORDING?`hidden`:``} ${this.coverMode?``:`contain-mode`}"
            autoplay
            muted
            playsinline
          ></video>
          <apriltag-detections
            .detections=${this.detectionController?.detections||[]}
            .duplicateIds=${this.detectionController?.duplicateIds||[]}
            .imageData=${this.appMode===W.IMAGE_MODE?this.detectionController?.selectedImage:this.detectionController?.frozenFrame}
            .showImage=${this.appMode===W.PAUSED||this.appMode===W.IMAGE_MODE}
            .videoDimensions=${this.cameraController?.dimensions}
            .coverMode=${this.coverMode}
            style="display: ${this.appMode===W.VIEWING_RECORDED?`none`:`block`}"
          ></apriltag-detections>
          ${this.renderDetectedTagsSummary()}
          ${this.appMode===W.VIEWING_RECORDED?j`
                <recorded-tags
                  .tagIds=${this.recordingController?.tagIds||[]}
                  @close=${this.handleHideRecorded}
                ></recorded-tags>
              `:``}
        </div>
      </div>

      <div class="controls">
        <button
          class="capture-button ${e?`enabled`:``}"
          ?disabled=${!e}
          aria-label=${this.getButtonLabel()}
          @click=${this.handleToggleDetection}
        >
          ${this.getButtonIcon()}
        </button>
      </div>

      <button
        class="about-button"
        aria-label="About"
        @click=${this.handleAboutClick}
      >
        <svg viewBox="0 0 24 24">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
          />
        </svg>
      </button>
    `}async firstUpdated(){this.video=this.shadowRoot.querySelector(`video`),await this.updateComplete,await this.init()}async init(){this.detector.init(),this.cameraController=new K(this),this.detectionController=new De(this,this.detector,this.currentFamily),this.recordingController=new Oe(this),this.statusController=new ke(this),this.detectionController.setVideo(this.video),this.setupControllerListeners(),this.setupGlobalListeners(),await this.cameraController.initialize(),this.captureEnabled=!0,this.detectionController.setMode(W.LIVE),this.detectionController.startContinuousDetection()}setupControllerListeners(){this.addEventListener(`camera-ready`,e=>{console.log(`Camera ready event received:`,e.detail),this.video.srcObject=e.detail.stream,this.video.addEventListener(`loadedmetadata`,()=>{console.log(`Video metadata loaded:`,this.video.videoWidth,this.video.videoHeight),this.statusController?.clearMessage(),this.cameraController?.updateDimensions(this.video.videoWidth,this.video.videoHeight),this.requestUpdate()})}),this.addEventListener(`camera-error`,e=>{this.statusController?.setPersistentMessage(e.detail.message)}),this.addEventListener(`status-update`,e=>{this.statusController?.setMessage(e.detail.message)}),this.addEventListener(`status-clear`,()=>{this.statusController?.clearMessage()}),this.addEventListener(`detections-updated`,e=>{this.recordingController?.isActive&&this.recordingController?.recordDetections(e.detail.detections)}),this.addEventListener(`recording-stopped`,()=>{this.setAppMode(W.VIEWING_RECORDED)}),this.addEventListener(`recording-hidden`,()=>{this.setAppMode(W.LIVE)})}setupGlobalListeners(){document.addEventListener(`visibilitychange`,()=>{document.visibilityState===`visible`&&this.cameraController.stream&&(this.video.srcObject=this.cameraController.stream)})}handleFamilySelected(e){let{familyId:t}=e.detail;this.detectionController&&(this.detectionController.family=t,this.currentFamily=t,localStorage.setItem(`selectedFamily`,t),this.statusController?.setTemporaryMessage(`Switched to ${t}`,3e3))}handleRecordModeChanged(e){let{recordMode:t}=e.detail;this.recordMode=t,!t&&this.recordingController?.isActive&&this.recordingController.stopRecording()}handleCoverModeChanged(e){let{coverMode:t}=e.detail;this.coverMode=t}handleImageSelected(e){let{file:t,familyId:n}=e.detail;n&&this.detectionController&&(this.detectionController.family=n,this.currentFamily=n,localStorage.setItem(`selectedFamily`,n),this.statusController?.setTemporaryMessage(`Switched to ${n}`,3e3)),this.detectionController?.loadImageFile(t),this.setAppMode(W.IMAGE_MODE)}handleHideRecorded(){this.recordingController?.hideRecorded()}handleAboutClick(){window.open(`https://github.com/rossng/apriltag-mobile`,`_blank`)}handleCameraSwitchRequested(e){let{deviceId:t}=e.detail;this.cameraController&&this.cameraController.switchCamera(t)}handleToggleDetection(){this.appMode===W.IMAGE_MODE?this.setAppMode(W.LIVE):this.recordMode?this.recordingController?.isActive?this.recordingController.stopRecording():(this.recordingController?.startRecording(),this.setAppMode(W.RECORDING)):this.appMode===W.PAUSED?this.setAppMode(W.LIVE):this.setAppMode(W.PAUSED)}setAppMode(e){if(this.appMode!==e){if(!G(this.appMode,e))console.warn(`Invalid mode transition from ${this.appMode} to ${e}`);else if((e===W.PAUSED||e===W.IMAGE_MODE)&&this.recordMode&&(this.recordMode=!1,this.recordingController?.isActive&&this.recordingController.stopRecording()),this.appMode=e,this.detectionController)switch(this.detectionController.setMode(e),e){case W.LIVE:this.detectionController.resumeLiveDetection();break;case W.PAUSED:this.detectionController.freezeCurrentFrame();break;case W.IMAGE_MODE:break;case W.RECORDING:this.detectionController.startContinuousDetection();break;case W.VIEWING_RECORDED:this.detectionController.stopContinuousDetection()}}}renderDetectedTagsSummary(){if(this.appMode===W.VIEWING_RECORDED)return``;let e=(this.detectionController?.detections??[]).map(e=>e.id).sort((e,t)=>e-t);return j`
      <div
        class="visually-hidden"
        data-testid="detected-tags"
        data-tag-ids=${e.join(`,`)}
      >
        ${e.length>0?`Detected tags: ${e.join(`, `)}`:`No tags detected`}
      </div>
    `}getButtonLabel(){return this.appMode===W.IMAGE_MODE?`Close image`:this.recordMode?this.recordingController?.isActive?`Stop recording`:`Start recording`:this.appMode===W.PAUSED?`Resume`:`Pause`}getButtonIcon(){return this.appMode===W.IMAGE_MODE?j`<svg viewBox="0 0 24 24">
        <path
          d="M18 6L6 18M6 6l12 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>`:this.recordMode?this.recordingController?.isActive?j`<svg viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>`:j`<svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="red" />
        </svg>`:this.appMode===W.PAUSED?j`<svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>`:j`<svg viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>`}disconnectedCallback(){super.disconnectedCallback(),this.cameraController?.cleanup()}};J([H({type:Object})],Q.prototype,`detector`,void 0),J([U()],Q.prototype,`appMode`,void 0),J([U()],Q.prototype,`currentFamily`,void 0),J([U()],Q.prototype,`recordMode`,void 0),J([U()],Q.prototype,`captureEnabled`,void 0),J([U()],Q.prototype,`coverMode`,void 0),Q=J([V(`apriltag-app`)],Q);async function je(e={}){var t=e,n=!0,r=import.meta.url,i=``;function a(e){return t.locateFile?t.locateFile(e,i):i+e}var o,s;if(n){try{i=new URL(`.`,r).href}catch{}o=async e=>{var t=await fetch(e,{credentials:`same-origin`});if(t.ok)return t.arrayBuffer();throw Error(t.status+` : `+t.url)}}var c=console.log.bind(console),l=console.error.bind(console),u,d=!1;function f(){return Qe.buffer}function p(){if(!v?.buffer?.resizable){var e=f();v=new Int8Array(e),q=new Int16Array(e),t.HEAPU8=w=new Uint8Array(e),D=new Int32Array(e),W=new Uint32Array(e),Ge=new Float32Array(e),Ke=new Float64Array(e),G=new BigInt64Array(e)}}function ee(){var e=t.preRun;e&&(typeof e==`function`&&(e=[e]),le.push(...e)),ce(le)}function te(){!t.noFSInit&&!U.initialized&&U.init(),F.init(),nt.l(),U.ignorePermissions=!1}function ne(){var e=t.postRun;e&&(typeof e==`function`&&(e=[e]),y.push(...e)),ce(y)}function m(e){throw t.onAbort?.(e),e=`Aborted(${e})`,l(e),d=!0,e+=`. Build with -sASSERTIONS for more info.`,new WebAssembly.RuntimeError(e)}var re;function h(){return t.locateFile?a(`apriltag_wasm.wasm`):new URL(`/apriltag-mobile/pr-preview/pr-5/assets/apriltag_wasm-DPDVO1I6.wasm`,``+import.meta.url).href}function ie(e){if(s)return s(e);throw`both async and sync fetching of the wasm failed`}async function ae(e){if(!u)try{var t=await o(e);return new Uint8Array(t)}catch{}return ie(e)}async function oe(e,t){try{var n=await ae(e);return await WebAssembly.instantiate(n,t)}catch(e){l(`failed to asynchronously prepare wasm: ${e}`),m(e)}}async function g(e,t,n){if(!e)try{var r=fetch(t,{credentials:`same-origin`});return await WebAssembly.instantiateStreaming(r,n)}catch(e){l(`wasm streaming compile failed: ${e}`),l(`falling back to ArrayBuffer instantiation`)}return oe(t,n)}function se(){return{a:et}}async function _(){function e(e){return nt=e.exports,$e(nt),p(),nt}function n(t){return e(t.instance)}var r=se(),i=t.instantiateWasm;return i?new Promise(t=>{i(r,n=>t(e(n)))}):(re??=h(),n(await g(u,re,r)))}var v,ce=e=>{for(;e.length>0;)e.shift()(t)},y=[],le=[],ue=e=>Ye(e),b=()=>Ze(),x=globalThis.TextDecoder&&new TextDecoder,S=(e,t,n,r)=>{var i=t+n;if(r)return i;for(;e[t]&&!(t>=i);)++t;return t},C=(e,t=0,n,r)=>{var i=S(e,t,n,r);if(i-t>16&&e.buffer&&x)return x.decode(e.subarray(t,i));for(var a=``;t<i;){var o=e[t++];if(!(o&128))a+=String.fromCharCode(o);else{var s=e[t++]&63;if((o&224)==192)a+=String.fromCharCode((o&31)<<6|s);else{var c=e[t++]&63;if(o=(o&240)==224?(o&15)<<12|s<<6|c:(o&7)<<18|s<<12|c<<6|e[t++]&63,o<65536)a+=String.fromCharCode(o);else{var l=o-65536;a+=String.fromCharCode(55296|l>>10,56320|l&1023)}}}}return a},w,T=(e,t,n)=>e?C(w,e,t,n):``,E=(e,t,n,r)=>m(`Assertion failed: ${T(e)}, at: `+[t?T(t):`unknown filename`,n,r?T(r):`unknown function`]),D,O=()=>{var e=D[K.varargs>>2];return K.varargs+=4,e},k=O,A={isAbs:e=>e.charAt(0)===`/`,splitPath:e=>/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(e).slice(1),normalizeArray:(e,t)=>{for(var n=0,r=e.length-1;r>=0;r--){var i=e[r];i===`.`?e.splice(r,1):i===`..`?(e.splice(r,1),n++):n&&(e.splice(r,1),n--)}if(t)for(;n;n--)e.unshift(`..`);return e},normalize:e=>{var t=A.isAbs(e),n=e.slice(-1)===`/`;return e=A.normalizeArray(e.split(`/`).filter(e=>!!e),!t).join(`/`),!e&&!t&&(e=`.`),e&&n&&(e+=`/`),(t?`/`:``)+e},dirname:e=>{var t=A.splitPath(e),n=t[0],r=t[1];return!n&&!r?`.`:(r&&=r.slice(0,-1),n+r)},basename:e=>e&&e.match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>A.normalize(e.join(`/`)),join2:(e,t)=>A.normalize(e+`/`+t)},de=()=>e=>(crypto.getRandomValues(e),0),fe=e=>(fe=de())(e),j={resolve:(...e)=>{for(var t=``,n=!1,r=e.length-1;r>=-1&&!n;r--){var i=r>=0?e[r]:U.cwd();if(typeof i!=`string`)throw TypeError(`Arguments to path.resolve must be strings`);if(!i)return``;t=i+`/`+t,n=A.isAbs(i)}return t=A.normalizeArray(t.split(`/`).filter(e=>!!e),!n).join(`/`),(n?`/`:``)+t||`.`},relative:(e,t)=>{e=j.resolve(e).slice(1),t=j.resolve(t).slice(1);function n(e){for(var t=0;t<e.length&&e[t]===``;t++);for(var n=e.length-1;n>=0&&e[n]===``;n--);return t>n?[]:e.slice(t,n-t+1)}for(var r=n(e.split(`/`)),i=n(t.split(`/`)),a=Math.min(r.length,i.length),o=a,s=0;s<a;s++)if(r[s]!==i[s]){o=s;break}for(var c=[],s=o;s<r.length;s++)c.push(`..`);return c=c.concat(i.slice(o)),c.join(`/`)}},M=[],N=e=>{for(var t=0,n=0;n<e.length;++n){var r=e.charCodeAt(n);r<=127?t++:r<=2047?t+=2:r>=55296&&r<=57343?(t+=4,++n):t+=3}return t},pe=(e,t,n,r)=>{if(!(r>0))return 0;for(var i=n,a=n+r-1,o=0;o<e.length;++o){var s=e.codePointAt(o);if(s<=127){if(n>=a)break;t[n++]=s}else if(s<=2047){if(n+1>=a)break;t[n++]=192|s>>6,t[n++]=128|s&63}else if(s<=65535){if(n+2>=a)break;t[n++]=224|s>>12,t[n++]=128|s>>6&63,t[n++]=128|s&63}else{if(n+3>=a)break;t[n++]=240|s>>18,t[n++]=128|s>>12&63,t[n++]=128|s>>6&63,t[n++]=128|s&63,o++}}return t[n]=0,n-i},P=(e,t,n)=>{var r=n>0?n:N(e)+1,i=Array(r),a=pe(e,i,0,i.length);return t&&(i.length=a),i},me=()=>{if(!M.length){var e=null;if(globalThis.window?.prompt&&(e=window.prompt(`Input: `),e!==null&&(e+=`
`)),!e)return null;M=P(e,!0)}return M.shift()},F={ttys:[],init(){},shutdown(){},register(e,t){F.ttys[e]={input:[],output:[],ops:t},U.registerDevice(e,F.stream_ops)},stream_ops:{open(e){var t=F.ttys[e.node.rdev];if(!t)throw new U.ErrnoError(43);e.tty=t,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,t,n,r,i){if(!e.tty||!e.tty.ops.get_char)throw new U.ErrnoError(60);for(var a=0,o=0;o<r;o++){var s;try{s=e.tty.ops.get_char(e.tty)}catch{throw new U.ErrnoError(29)}if(s===void 0&&!a)throw new U.ErrnoError(6);if(s==null||(a++,t[n+o]=s,s===10))break}return a&&(e.node.atime=Date.now()),a},write(e,t,n,r,i){if(!e.tty||!e.tty.ops.put_char)throw new U.ErrnoError(60);try{for(var a=0;a<r;a++)e.tty.ops.put_char(e.tty,t[n+a])}catch{throw new U.ErrnoError(29)}return r&&(e.node.mtime=e.node.ctime=Date.now()),a}},default_tty_ops:{get_char(e){return me()},put_char(e,t){t===null||t===10?(c(C(e.output)),e.output=[]):t!=0&&e.output.push(t)},fsync(e){e.output?.length>0&&(c(C(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,t,n){return 0},ioctl_tiocgwinsz(e){return[24,80]}},default_tty1_ops:{put_char(e,t){t===null||t===10?(l(C(e.output)),e.output=[]):t!=0&&e.output.push(t)},fsync(e){e.output?.length>0&&(l(C(e.output)),e.output=[])}}},he=e=>{m()},I={ops_table:null,mount(e){return I.createNode(null,`/`,16895,0)},createNode(e,t,n,r){if(U.isBlkdev(n)||U.isFIFO(n))throw new U.ErrnoError(63);I.ops_table||={dir:{node:{getattr:I.node_ops.getattr,setattr:I.node_ops.setattr,lookup:I.node_ops.lookup,mknod:I.node_ops.mknod,rename:I.node_ops.rename,unlink:I.node_ops.unlink,rmdir:I.node_ops.rmdir,readdir:I.node_ops.readdir,symlink:I.node_ops.symlink},stream:{llseek:I.stream_ops.llseek}},file:{node:{getattr:I.node_ops.getattr,setattr:I.node_ops.setattr},stream:{llseek:I.stream_ops.llseek,read:I.stream_ops.read,write:I.stream_ops.write,mmap:I.stream_ops.mmap,msync:I.stream_ops.msync}},link:{node:{getattr:I.node_ops.getattr,setattr:I.node_ops.setattr,readlink:I.node_ops.readlink},stream:{}},chrdev:{node:{getattr:I.node_ops.getattr,setattr:I.node_ops.setattr},stream:U.chrdev_stream_ops}};var i=U.createNode(e,t,n,r);return U.isDir(i.mode)?(i.node_ops=I.ops_table.dir.node,i.stream_ops=I.ops_table.dir.stream,i.contents={}):U.isFile(i.mode)?(i.node_ops=I.ops_table.file.node,i.stream_ops=I.ops_table.file.stream,i.usedBytes=0,i.contents=I.emptyFileContents??=new Uint8Array):U.isLink(i.mode)?(i.node_ops=I.ops_table.link.node,i.stream_ops=I.ops_table.link.stream):U.isChrdev(i.mode)&&(i.node_ops=I.ops_table.chrdev.node,i.stream_ops=I.ops_table.chrdev.stream),i.atime=i.mtime=i.ctime=Date.now(),e&&(e.contents[t]=i,e.atime=e.mtime=e.ctime=i.atime),i},getFileDataAsTypedArray(e){return e.contents.subarray(0,e.usedBytes)},expandFileStorage(e,t){var n=e.contents.length;if(!(n>=t)){t=Math.max(t,n*(n<1048576?2:1.125)>>>0),n&&(t=Math.max(t,256));var r=I.getFileDataAsTypedArray(e);e.contents=new Uint8Array(t),e.contents.set(r)}},resizeFileStorage(e,t){if(e.usedBytes!=t){var n=e.contents;e.contents=new Uint8Array(t),e.contents.set(n.subarray(0,Math.min(t,e.usedBytes))),e.usedBytes=t}},node_ops:{getattr(e){var t={};return t.dev=U.isChrdev(e.mode)?e.id:1,t.ino=e.id,t.mode=e.mode,t.nlink=1,t.uid=0,t.gid=0,t.rdev=e.rdev,t.size=U.isDir(e.mode)?4096:U.isFile(e.mode)?e.usedBytes:U.isLink(e.mode)?e.link.length:0,t.atime=new Date(e.atime),t.mtime=new Date(e.mtime),t.ctime=new Date(e.ctime),t.blksize=4096,t.blocks=Math.ceil(t.size/t.blksize),t},setattr(e,t){for(let n of[`mode`,`atime`,`mtime`,`ctime`])t[n]!=null&&(e[n]=t[n]);t.size!==void 0&&I.resizeFileStorage(e,t.size)},lookup(e,t){throw I.doesNotExistError||(I.doesNotExistError=new U.ErrnoError(44),I.doesNotExistError.stack=`<generic error, no stack>`),I.doesNotExistError},mknod(e,t,n,r){return I.createNode(e,t,n,r)},rename(e,t,n){var r;try{r=U.lookupNode(t,n)}catch{}if(r){if(U.isDir(e.mode))for(var i in r.contents)throw new U.ErrnoError(55);U.hashRemoveNode(r)}delete e.parent.contents[e.name],t.contents[n]=e,e.name=n,t.ctime=t.mtime=e.parent.ctime=e.parent.mtime=Date.now()},unlink(e,t){delete e.contents[t],e.ctime=e.mtime=Date.now()},rmdir(e,t){for(var n in U.lookupNode(e,t).contents)throw new U.ErrnoError(55);delete e.contents[t],e.ctime=e.mtime=Date.now()},readdir(e){return[`.`,`..`,...Object.keys(e.contents)]},symlink(e,t,n){var r=I.createNode(e,t,41471,0);return r.link=n,r},readlink(e){if(!U.isLink(e.mode))throw new U.ErrnoError(28);return e.link}},stream_ops:{read(e,t,n,r,i){var a=e.node.contents;if(i>=e.node.usedBytes)return 0;var o=Math.min(e.node.usedBytes-i,r);return t.set(a.subarray(i,i+o),n),o},write(e,t,n,r,i,a){if(t.buffer===v.buffer&&(a=!1),!r)return 0;var o=e.node;return o.mtime=o.ctime=Date.now(),a?(o.contents=t.subarray(n,n+r),o.usedBytes=r):!o.usedBytes&&!i?(o.contents=t.slice(n,n+r),o.usedBytes=r):(I.expandFileStorage(o,i+r),o.contents.set(t.subarray(n,n+r),i),o.usedBytes=Math.max(o.usedBytes,i+r)),r},llseek(e,t,n){var r=t;if(n===1?r+=e.position:n===2&&U.isFile(e.node.mode)&&(r+=e.node.usedBytes),r<0)throw new U.ErrnoError(28);return r},mmap(e,t,n,r,i){if(!U.isFile(e.node.mode))throw new U.ErrnoError(43);var a,o,s=e.node.contents;if(!(i&2)&&s.buffer===v.buffer)o=!1,a=s.byteOffset;else{if(o=!0,a=he(t),!a)throw new U.ErrnoError(48);s&&((n>0||n+t<s.length)&&(s=s.subarray?s.subarray(n,n+t):Array.prototype.slice.call(s,n,n+t)),v.set(s,a))}return{ptr:a,allocated:o}},msync(e,t,n,r,i){return I.stream_ops.write(e,t,0,r,n,!1),0}}},ge=e=>{if(typeof e!=`string`)return e;var t={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090}[e];if(t===void 0)throw Error(`Unknown file open mode: ${e}`);return t},L=e=>(typeof e==`string`&&(e=P(e,!0)),e.subarray||(e=new Uint8Array(e)),e),R=(e,t)=>{var n=0;return e&&(n|=365),t&&(n|=146),n},_e=async e=>{var t=await o(e);return new Uint8Array(t)},ve=(...e)=>U.createDataFile(...e),ye=e=>e,be=null,xe=async()=>be,z=0,Se=null,B=e=>{z--,t.monitorRunDependencies?.(z),z||Se()},Ce=e=>{z||(be=new Promise(e=>Se=e)),z++,t.monitorRunDependencies?.(z)},V=[],we=async(e,t)=>{typeof Browser<`u`&&Browser.init();for(var n of V)if(n.canHandle(t))return n.handle(e,t);return e},Te=async(e,t,n,r,i,a,o,s)=>{var c=t?j.resolve(A.join2(e,t)):e,l=ye(`cp ${c}`);Ce(l);try{var u=n;typeof n==`string`&&(u=await _e(n)),u=await we(u,c),s?.(),a||ve(e,t,u,r,i,o)}finally{B(l)}},H=(e,t,n,r,i,a,o,s,c,l)=>{Te(e,t,n,r,i,s,c,l).then(a).catch(o)},U={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:`/`,initialized:!1,ignorePermissions:!0,filesystems:null,syncFSRequests:0,ErrnoError:class{name=`ErrnoError`;constructor(e){this.errno=e}},FSStream:class{shared={};get object(){return this.node}set object(e){this.node=e}get isRead(){return(this.flags&2097155)!=1}get isWrite(){return!!(this.flags&2097155)}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(e){this.shared.flags=e}get position(){return this.shared.position}set position(e){this.shared.position=e}},FSNode:class{node_ops={};stream_ops={};readMode=365;writeMode=146;mounted=null;constructor(e,t,n,r){e||=this,this.parent=e,this.mount=e.mount,this.id=U.nextInode++,this.name=t,this.mode=n,this.rdev=r,this.atime=this.mtime=this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){e?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){e?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return U.isDir(this.mode)}get isDevice(){return U.isChrdev(this.mode)}addListener(e,t=!1){var n={cb:e,exclusive:t},r=this.listeners??=new Set;return r.add(n),{listeners:r,entry:n}}notifyListeners(e){if(this.listeners){var t;for(var n of this.listeners)n.exclusive?(t||=[]).push(n):n.cb(e);if(t){var r=(this.exclTurn||0)%t.length;this.exclTurn=r+1,t[r].cb(e)}}}},lookupPath(e,t={}){if(!e)throw new U.ErrnoError(44);t.follow_mount??=!0,A.isAbs(e)||(e=U.cwd()+`/`+e);linkloop:for(var n=0;n<40;n++){for(var r=e.split(`/`).filter(e=>!!e),i=U.root,a=`/`,o=0;o<r.length;o++){var s=o===r.length-1;if(s&&t.parent)break;if(r[o]!==`.`){if(r[o]===`..`){if(a=A.dirname(a),U.isRoot(i)){e=a+`/`+r.slice(o+1).join(`/`),n--;continue linkloop}i=i.parent}else{a=A.join2(a,r[o]);try{i=U.lookupNode(i,r[o])}catch(e){if(e?.errno===44&&s&&t.noent_okay)return{path:a};throw e}if(U.isMountpoint(i)&&(!s||t.follow_mount)&&(i=i.mounted.root),U.isLink(i.mode)&&(!s||t.follow)){if(!i.node_ops.readlink)throw new U.ErrnoError(52);var c=i.node_ops.readlink(i);A.isAbs(c)||(c=A.dirname(a)+`/`+c),e=c+`/`+r.slice(o+1).join(`/`);continue linkloop}}}}return{path:a,node:i}}throw new U.ErrnoError(32)},getPath(e){for(var t;;){if(U.isRoot(e)){var n=e.mount.mountpoint;return t?n[n.length-1]===`/`?n+t:`${n}/${t}`:n}t=t?`${e.name}/${t}`:e.name,e=e.parent}},hashName(e,t){for(var n=0,r=0;r<t.length;r++)n=(n<<5)-n+t.charCodeAt(r)|0;return(e+n>>>0)%U.nameTable.length},hashAddNode(e){var t=U.hashName(e.parent.id,e.name);e.name_next=U.nameTable[t],U.nameTable[t]=e},hashRemoveNode(e){var t=U.hashName(e.parent.id,e.name);if(U.nameTable[t]===e)U.nameTable[t]=e.name_next;else for(var n=U.nameTable[t];n;){if(n.name_next===e){n.name_next=e.name_next;break}n=n.name_next}},lookupNode(e,t){var n=U.mayLookup(e);if(n)throw new U.ErrnoError(n);for(var r=U.hashName(e.id,t),i=U.nameTable[r];i;i=i.name_next){var a=i.name;if(i.parent.id===e.id&&a===t)return i}return U.lookup(e,t)},createNode(e,t,n,r){var i=new U.FSNode(e,t,n,r);return U.hashAddNode(i),i},destroyNode(e){U.hashRemoveNode(e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},isFile(e){return(e&61440)==32768},isDir(e){return(e&61440)==16384},isLink(e){return(e&61440)==40960},isChrdev(e){return(e&61440)==8192},isBlkdev(e){return(e&61440)==24576},isFIFO(e){return(e&61440)==4096},isSocket(e){return(e&49152)==49152},flagsToPermissionString(e){var t=[`r`,`w`,`rw`][e&3];return e&512&&(t+=`w`),t},nodePermissions(e,t){return U.ignorePermissions?0:t.includes(`r`)&&!(e.mode&292)||t.includes(`w`)&&!(e.mode&146)||t.includes(`x`)&&!(e.mode&73)?2:0},mayLookup(e){return U.isDir(e.mode)?U.nodePermissions(e,`x`)||(e.node_ops.lookup?0:2):54},mayCreate(e,t){if(!U.isDir(e.mode))return 54;try{return U.lookupNode(e,t),20}catch{}return U.nodePermissions(e,`wx`)},mayDelete(e,t,n){var r;try{r=U.lookupNode(e,t)}catch(e){return e.errno}var i=U.nodePermissions(e,`wx`);if(i)return i;if(n){if(!U.isDir(r.mode))return 54;if(U.isRoot(r)||U.getPath(r)===U.cwd())return 10}else if(U.isDir(r.mode))return 31;return 0},mayOpen(e,t){if(!e)return 44;if(U.isLink(e.mode))return 32;var n=U.flagsToPermissionString(t);return U.isDir(e.mode)&&(n!==`r`||t&576)?31:U.nodePermissions(e,n)},checkOpExists(e,t){if(!e)throw new U.ErrnoError(t);return e},MAX_OPEN_FDS:4096,nextfd(){for(var e=0;e<=U.MAX_OPEN_FDS;e++)if(!U.streams[e])return e;throw new U.ErrnoError(33)},getStreamChecked(e){var t=U.getStream(e);if(!t)throw new U.ErrnoError(8);return t},getStream:e=>U.streams[e],createStream(e,t=-1){return e=Object.assign(new U.FSStream,e),t==-1&&(t=U.nextfd()),e.fd=t,U.streams[t]=e,e},closeStream(e){U.streams[e]=null},dupStream(e,t=-1){var n=U.createStream(e,t);return n.stream_ops?.dup?.(n),n},doSetAttr(e,t,n){var r=e?.stream_ops.setattr,i=r?e:t;r??=t.node_ops.setattr,U.checkOpExists(r,63);try{r(i,n)}catch(e){throw e instanceof RangeError?new U.ErrnoError(22):e}},chrdev_stream_ops:{open(e){e.stream_ops=U.getDevice(e.node.rdev).stream_ops,e.stream_ops.open?.(e)},llseek(){throw new U.ErrnoError(70)}},major:e=>e>>8,minor:e=>e&255,makedev:(e,t)=>e<<8|t,registerDevice(e,t){U.devices[e]={stream_ops:t}},getDevice:e=>U.devices[e],getMounts(e){for(var t=[],n=[e];n.length;){var r=n.pop();t.push(r),n.push(...r.mounts)}return t},syncfs(e,t){typeof e==`function`&&(t=e,e=!1),U.syncFSRequests++,U.syncFSRequests>1&&l(`warning: ${U.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);var n=U.getMounts(U.root.mount),r=0;function i(e){return U.syncFSRequests--,t(e)}function a(e){if(e)return a.errored?void 0:(a.errored=!0,i(e));++r>=n.length&&i(null)}for(var o of n)o.type.syncfs?o.type.syncfs(o,e,a):a(null)},mount(e,t,n){var r=n===`/`,i=!n,a;if(r&&U.root)throw new U.ErrnoError(10);if(!r&&!i){var o=U.lookupPath(n,{follow_mount:!1});if(n=o.path,a=o.node,U.isMountpoint(a))throw new U.ErrnoError(10);if(!U.isDir(a.mode))throw new U.ErrnoError(54)}var s={type:e,opts:t,mountpoint:n,mounts:[]},c=e.mount(s);return c.mount=s,s.root=c,r?U.root=c:a&&(a.mounted=s,a.mount&&a.mount.mounts.push(s)),c},unmount(e){var t=U.lookupPath(e,{follow_mount:!1});if(!U.isMountpoint(t.node))throw new U.ErrnoError(28);var n=t.node,r=n.mounted,i=U.getMounts(r);for(var[a,o]of Object.entries(U.nameTable))for(;o;){var s=o.name_next;i.includes(o.mount)&&U.destroyNode(o),o=s}n.mounted=null;var c=n.mount.mounts.indexOf(r);n.mount.mounts.splice(c,1)},lookup(e,t){return e.node_ops.lookup(e,t)},mknod(e,t,n){var r=U.lookupPath(e,{parent:!0}).node,i=A.basename(e);if(!i)throw new U.ErrnoError(28);if(i===`.`||i===`..`)throw new U.ErrnoError(20);var a=U.mayCreate(r,i);if(a)throw new U.ErrnoError(a);if(!r.node_ops.mknod)throw new U.ErrnoError(63);return r.node_ops.mknod(r,i,t,n)},statfs(e){return U.statfsNode(U.lookupPath(e,{follow:!0}).node)},statfsStream(e){return U.statfsNode(e.node)},statfsNode(e){var t={bsize:4096,frsize:4096,blocks:1e6,bfree:5e5,bavail:5e5,files:U.nextInode,ffree:U.nextInode-1,fsid:42,flags:2,namelen:255};return e.node_ops.statfs&&Object.assign(t,e.node_ops.statfs(e.mount.opts.root)),t},create(e,t=438){return t&=4095,t|=32768,U.mknod(e,t,0)},mkdir(e,t=511){return t&=1023,t|=16384,U.mknod(e,t,0)},mkdirTree(e,t){var n=e.split(`/`),r=``;for(var i of n)if(i){(r||A.isAbs(e))&&(r+=`/`),r+=i;try{U.mkdir(r,t)}catch(e){if(e.errno!=20)throw e}}},mkdev(e,t,n){return n===void 0&&(n=t,t=438),t|=8192,U.mknod(e,t,n)},symlink(e,t){if(!j.resolve(e))throw new U.ErrnoError(44);var n=U.lookupPath(t,{parent:!0}).node;if(!n)throw new U.ErrnoError(44);var r=A.basename(t),i=U.mayCreate(n,r);if(i)throw new U.ErrnoError(i);if(!n.node_ops.symlink)throw new U.ErrnoError(63);return n.node_ops.symlink(n,r,e)},link(e,t,n){var r=U.lookupPath(t,{parent:!0}).node;if(!r)throw new U.ErrnoError(44);var i=A.basename(t),a=U.mayCreate(r,i);if(a)throw new U.ErrnoError(a);if(!r.node_ops.link)throw new U.ErrnoError(34);return r.node_ops.link(r,i,e,n)},rename(e,t){var n=A.dirname(e),r=A.dirname(t),i=A.basename(e),a=A.basename(t),o=U.lookupPath(e,{parent:!0}),s=o.node,c;if(o=U.lookupPath(t,{parent:!0}),c=o.node,!s||!c)throw new U.ErrnoError(44);if(s.mount!==c.mount)throw new U.ErrnoError(75);var l=U.lookupNode(s,i),u=j.relative(e,r);if(u.charAt(0)!==`.`)throw new U.ErrnoError(28);if(u=j.relative(t,n),u.charAt(0)!==`.`)throw new U.ErrnoError(55);var d;try{d=U.lookupNode(c,a)}catch{}if(l!==d){var f=U.isDir(l.mode),p=U.mayDelete(s,i,f);if(p||(p=d?U.mayDelete(c,a,f):U.mayCreate(c,a),p))throw new U.ErrnoError(p);if(!s.node_ops.rename)throw new U.ErrnoError(63);if(U.isMountpoint(l)||d&&U.isMountpoint(d))throw new U.ErrnoError(10);if(c!==s&&(p=U.nodePermissions(s,`w`),p))throw new U.ErrnoError(p);U.hashRemoveNode(l);try{s.node_ops.rename(l,c,a),l.parent=c}catch(e){throw e}finally{U.hashAddNode(l)}}},rmdir(e){var t=U.lookupPath(e,{parent:!0}).node,n=A.basename(e),r=U.lookupNode(t,n),i=U.mayDelete(t,n,!0);if(i)throw new U.ErrnoError(i);if(!t.node_ops.rmdir)throw new U.ErrnoError(63);if(U.isMountpoint(r))throw new U.ErrnoError(10);t.node_ops.rmdir(t,n),U.destroyNode(r)},readdir(e){var t=U.lookupPath(e,{follow:!0}).node;return U.checkOpExists(t.node_ops.readdir,54)(t)},unlink(e){var t=U.lookupPath(e,{parent:!0}).node;if(!t)throw new U.ErrnoError(44);var n=A.basename(e),r=U.lookupNode(t,n),i=U.mayDelete(t,n,!1);if(i)throw new U.ErrnoError(i);if(!t.node_ops.unlink)throw new U.ErrnoError(63);if(U.isMountpoint(r))throw new U.ErrnoError(10);t.node_ops.unlink(t,n),U.destroyNode(r)},readlink(e){var t=U.lookupPath(e).node;if(!t)throw new U.ErrnoError(44);if(!t.node_ops.readlink)throw new U.ErrnoError(28);return t.node_ops.readlink(t)},stat(e,t){var n=U.lookupPath(e,{follow:!t}).node;return U.checkOpExists(n.node_ops.getattr,63)(n)},fstat(e){var t=U.getStreamChecked(e),n=t.node,r=t.stream_ops.getattr,i=r?t:n;return r??=n.node_ops.getattr,U.checkOpExists(r,63),r(i)},lstat(e){return U.stat(e,!0)},doChmod(e,t,n,r){U.doSetAttr(e,t,{mode:n&4095|t.mode&-4096,ctime:Date.now(),dontFollow:r})},chmod(e,t,n){var r=typeof e==`string`?U.lookupPath(e,{follow:!n}).node:e;U.doChmod(null,r,t,n)},lchmod(e,t){U.chmod(e,t,!0)},fchmod(e,t){var n=U.getStreamChecked(e);U.doChmod(n,n.node,t,!1)},doChown(e,t,n){U.doSetAttr(e,t,{timestamp:Date.now(),dontFollow:n})},chown(e,t,n,r){var i=typeof e==`string`?U.lookupPath(e,{follow:!r}).node:e;U.doChown(null,i,r)},lchown(e,t,n){U.chown(e,t,n,!0)},fchown(e,t,n){var r=U.getStreamChecked(e);U.doChown(r,r.node,!1)},doTruncate(e,t,n){if(U.isDir(t.mode))throw new U.ErrnoError(31);if(!U.isFile(t.mode))throw new U.ErrnoError(28);var r=U.nodePermissions(t,`w`);if(r)throw new U.ErrnoError(r);U.doSetAttr(e,t,{size:n,timestamp:Date.now()})},truncate(e,t){if(t<0)throw new U.ErrnoError(28);var n=typeof e==`string`?U.lookupPath(e,{follow:!0}).node:e;U.doTruncate(null,n,t)},ftruncate(e,t){var n=U.getStreamChecked(e);if(t<0||!(n.flags&2097155))throw new U.ErrnoError(28);U.doTruncate(n,n.node,t)},utime(e,t,n,r){var i=U.lookupPath(e,{follow:!r});U.doSetAttr(null,i.node,{atime:t,mtime:n,dontFollow:r})},open(e,t,n=438){if(e===``)throw new U.ErrnoError(44);t=ge(t),n=t&64?n&4095|32768:0;var r,i;if(typeof e==`object`)r=e;else{i=e.endsWith(`/`);var a=U.lookupPath(e,{follow:!(t&131072),noent_okay:!0});r=a.node,e=a.path}var o=!1;if(t&64){if(r){if(t&128)throw new U.ErrnoError(20)}else if(i)throw new U.ErrnoError(31);else r=U.mknod(e,n|511,0),o=!0}if(!r)throw new U.ErrnoError(44);if(U.isChrdev(r.mode)&&(t&=-513),t&65536&&!U.isDir(r.mode))throw new U.ErrnoError(54);if(!o){var s=U.mayOpen(r,t);if(s)throw new U.ErrnoError(s)}t&512&&!o&&U.truncate(r,0),t&=-131713;var c=U.createStream({node:r,path:U.getPath(r),flags:t,seekable:!0,position:0,stream_ops:r.stream_ops,ungotten:[],error:!1});return c.stream_ops.open&&c.stream_ops.open(c),o&&U.chmod(r,n&511),c},close(e){if(U.isClosed(e))throw new U.ErrnoError(8);e.getdents&&=null,e.node?.notifyListeners(32);try{e.stream_ops.close&&e.stream_ops.close(e)}catch(e){throw e}finally{U.closeStream(e.fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,t,n){if(U.isClosed(e))throw new U.ErrnoError(8);if(!e.seekable||!e.stream_ops.llseek)throw new U.ErrnoError(70);if(n!=0&&n!=1&&n!=2)throw new U.ErrnoError(28);return e.position=e.stream_ops.llseek(e,t,n),e.ungotten=[],e.position},read(e,t,n,r,i){if(r<0||i<0)throw new U.ErrnoError(28);if(U.isClosed(e)||(e.flags&2097155)==1)throw new U.ErrnoError(8);if(U.isDir(e.node.mode))throw new U.ErrnoError(31);if(!e.stream_ops.read)throw new U.ErrnoError(28);var a=i!==void 0;if(!a)i=e.position;else if(!e.seekable)throw new U.ErrnoError(70);var o=e.stream_ops.read(e,t,n,r,i);return a||(e.position+=o),o},write(e,t,n,r,i,a){if(r<0||i<0)throw new U.ErrnoError(28);if(U.isClosed(e)||!(e.flags&2097155))throw new U.ErrnoError(8);if(U.isDir(e.node.mode))throw new U.ErrnoError(31);if(!e.stream_ops.write)throw new U.ErrnoError(28);e.seekable&&e.flags&1024&&U.llseek(e,0,2);var o=i!==void 0;if(!o)i=e.position;else if(!e.seekable)throw new U.ErrnoError(70);var s=e.stream_ops.write(e,t,n,r,i,a);return o||(e.position+=s),s},mmap(e,t,n,r,i){if(r&2&&!(i&2)&&(e.flags&2097155)!=2||(e.flags&2097155)==1)throw new U.ErrnoError(2);if(!e.stream_ops.mmap)throw new U.ErrnoError(43);if(!t)throw new U.ErrnoError(28);return e.stream_ops.mmap(e,t,n,r,i)},msync(e,t,n,r,i){return e.stream_ops.msync?e.stream_ops.msync(e,t,n,r,i):0},ioctl(e,t,n){if(!e.stream_ops.ioctl)throw new U.ErrnoError(59);return e.stream_ops.ioctl(e,t,n)},readFile(e,t={}){t.flags=t.flags??0,t.encoding=t.encoding??`binary`,t.encoding!==`utf8`&&t.encoding!==`binary`&&m(`Invalid encoding type "${t.encoding}"`);var n=U.open(e,t.flags),r=U.stat(e).size,i=new Uint8Array(r);return U.read(n,i,0,r,0),t.encoding===`utf8`&&(i=C(i)),U.close(n),i},writeFile(e,t,n={}){n.flags=n.flags??577;var r=U.open(e,n.flags,n.mode);t=L(t),U.write(r,t,0,t.byteLength,void 0,n.canOwn),U.close(r)},cwd:()=>U.currentPath,chdir(e){var t=U.lookupPath(e,{follow:!0});if(t.node===null)throw new U.ErrnoError(44);if(!U.isDir(t.node.mode))throw new U.ErrnoError(54);var n=U.nodePermissions(t.node,`x`);if(n)throw new U.ErrnoError(n);U.currentPath=t.path},createDefaultDirectories(){U.mkdir(`/tmp`),U.mkdir(`/home`),U.mkdir(`/home/web_user`)},createDefaultDevices(){U.mkdir(`/dev`),U.registerDevice(U.makedev(1,3),{read:()=>0,write:(e,t,n,r,i)=>r,llseek:()=>0}),U.mkdev(`/dev/null`,U.makedev(1,3)),F.register(U.makedev(5,0),F.default_tty_ops),F.register(U.makedev(6,0),F.default_tty1_ops),U.mkdev(`/dev/tty`,U.makedev(5,0)),U.mkdev(`/dev/tty1`,U.makedev(6,0));var e=new Uint8Array(1024),t=0,n=()=>(t||=(fe(e),e.byteLength),e[--t]);U.createDevice(`/dev`,`random`,n),U.createDevice(`/dev`,`urandom`,n),U.mkdir(`/dev/shm`),U.mkdir(`/dev/shm/tmp`)},createSpecialDirectories(){U.mkdir(`/proc`);var e=U.mkdir(`/proc/self`);U.mkdir(`/proc/self/fd`),U.mount({mount(){var t=U.createNode(e,`fd`,16895,73);return t.stream_ops={llseek:I.stream_ops.llseek},t.node_ops={lookup(e,t){var n=+t,r=U.getStreamChecked(n),i={parent:null,mount:{mountpoint:`fake`},node_ops:{readlink:()=>r.path},id:n+1};return i.parent=i,i},readdir(){return Array.from(U.streams.entries()).filter(([e,t])=>t).map(([e,t])=>e.toString())}},t}},{},`/proc/self/fd`)},createStandardStreams(e,t,n){e?U.createDevice(`/dev`,`stdin`,e):U.symlink(`/dev/tty`,`/dev/stdin`),t?U.createDevice(`/dev`,`stdout`,null,t):U.symlink(`/dev/tty`,`/dev/stdout`),n?U.createDevice(`/dev`,`stderr`,null,n):U.symlink(`/dev/tty1`,`/dev/stderr`),U.open(`/dev/stdin`,0),U.open(`/dev/stdout`,1),U.open(`/dev/stderr`,1)},staticInit(){U.nameTable=Array(4096),U.mount(I,{},`/`),U.createDefaultDirectories(),U.createDefaultDevices(),U.createSpecialDirectories(),U.filesystems={MEMFS:I}},init(e,n,r){U.initialized=!0,e??=t.stdin,n??=t.stdout,r??=t.stderr,U.createStandardStreams(e,n,r)},quit(){U.initialized=!1;for(var e of U.streams)e&&U.close(e)},findObject(e,t){var n=U.analyzePath(e,t);return n.exists?n.object:null},analyzePath(e,t){try{var n=U.lookupPath(e,{follow:!t});e=n.path}catch{}var r={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,parentExists:!1,parentPath:null,parentObject:null};try{var n=U.lookupPath(e,{parent:!0});r.parentExists=!0,r.parentPath=n.path,r.parentObject=n.node,r.name=A.basename(e),n=U.lookupPath(e,{follow:!t}),r.exists=!0,r.path=n.path,r.object=n.node,r.name=n.node.name,r.isRoot=n.path===`/`}catch(e){r.error=e.errno}return r},createPath(e,t,n,r){e=typeof e==`string`?e:U.getPath(e);for(var i=t.split(`/`).reverse();i.length;){var a=i.pop();if(a){var o=A.join2(e,a);try{U.mkdir(o)}catch(e){if(e.errno!=20)throw e}e=o}}return o},createFile(e,t,n,r,i){var a=A.join2(typeof e==`string`?e:U.getPath(e),t),o=R(r,i);return U.create(a,o)},createDataFile(e,t,n,r,i,a){var o=t;e&&(e=typeof e==`string`?e:U.getPath(e),o=t?A.join2(e,t):e);var s=R(r,i),c=U.create(o,s);if(n){n=L(n),U.chmod(c,s|146);var l=U.open(c,577);U.write(l,n,0,n.length,0,a),U.close(l),U.chmod(c,s)}},createDevice(e,t,n,r){var i=A.join2(typeof e==`string`?e:U.getPath(e),t),a=R(!!n,!!r);U.createDevice.major??=64;var o=U.makedev(U.createDevice.major++,0);return U.registerDevice(o,{open(e){e.seekable=!1},close(e){r?.buffer?.length&&r(10)},read(e,t,r,i,a){for(var o=0,s=0;s<i;s++){var c;try{c=n()}catch{throw new U.ErrnoError(29)}if(c===void 0&&!o)throw new U.ErrnoError(6);if(c==null)break;o++,t[r+s]=c}return o&&(e.node.atime=Date.now()),o},write(e,t,n,i,a){for(var o=0;o<i;o++)try{r(t[n+o])}catch{throw new U.ErrnoError(29)}return i&&(e.node.mtime=e.node.ctime=Date.now()),o}}),U.mkdev(i,a,o)},forceLoadFile(e){if(e.isDevice||e.isFolder||e.link||e.contents)return!0;if(globalThis.XMLHttpRequest)m(`Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.`);else try{e.contents=s(e.url)}catch{throw new U.ErrnoError(29)}},createLazyFile(e,t,n,r,i){class a{lengthKnown=!1;chunks=[];get(e){if(!(e>this.length-1||e<0)){var t=e%this.chunkSize,n=e/this.chunkSize|0;return this.getter(n)[t]}}setDataGetter(e){this.getter=e}cacheLength(){var e=new XMLHttpRequest;e.open(`HEAD`,n,!1),e.send(null),e.status>=200&&e.status<300||e.status===304||m(`Couldn't load ${n}. Status: ${e.status}`);var t=Number(e.getResponseHeader(`Content-length`)),r,i=(r=e.getResponseHeader(`Accept-Ranges`))&&r===`bytes`,a=(r=e.getResponseHeader(`Content-Encoding`))&&r===`gzip`,o=1048576;i||(o=t);var s=(e,r)=>{e>r&&m(`invalid range (${e}, ${r}) or no bytes requested!`),r>t-1&&m(`only ${t} bytes available! programmer error!`);var i=new XMLHttpRequest;return i.open(`GET`,n,!1),t!==o&&i.setRequestHeader(`Range`,`bytes=${e}-${r}`),i.responseType=`arraybuffer`,i.overrideMimeType&&i.overrideMimeType(`text/plain; charset=x-user-defined`),i.send(null),i.status>=200&&i.status<300||i.status===304||m(`Couldn't load ${n}. Status: ${i.status}`),i.response===void 0?P(i.responseText??``,!0):new Uint8Array(i.response||[])},l=this;l.setDataGetter(e=>{var n=e*o,r=(e+1)*o-1;return r=Math.min(r,t-1),l.chunks[e]===void 0&&(l.chunks[e]=s(n,r)),l.chunks[e]===void 0&&m(`doXHR failed!`),l.chunks[e]}),(a||!t)&&(o=t=1,t=this.getter(0).length,o=t,c(`LazyFiles on gzip forces download of the whole file when length is accessed`)),this._length=t,this._chunkSize=o,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){return this.lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){m(`Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc`);var o={isDevice:!1,contents:new a}}else var o={isDevice:!1,url:n};var s=U.createFile(e,t,o,r,i);o.contents?s.contents=o.contents:o.url&&(s.contents=null,s.url=o.url),Object.defineProperties(s,{usedBytes:{get:function(){return this.contents.length}}});var l={};for(let[e,t]of Object.entries(s.stream_ops))l[e]=(...e)=>(U.forceLoadFile(s),t(...e));function u(e,t,n,r,i){var a=e.node.contents;if(i>=a.length)return 0;var o=Math.min(a.length-i,r);if(a.slice)for(var s=0;s<o;s++)t[n+s]=a[i+s];else for(var s=0;s<o;s++)t[n+s]=a.get(i+s);return o}return l.read=(e,t,n,r,i)=>(U.forceLoadFile(s),u(e,t,n,r,i)),l.mmap=(e,t,n,r,i)=>{U.forceLoadFile(s);var a=he(t);if(!a)throw new U.ErrnoError(48);return u(e,v,a,t,n),{ptr:a,allocated:!0}},s.stream_ops=l,s}},W,G,K={currentUmask:18,calculateAt(e,t,n){if(A.isAbs(t))return t;var r=e===-100?U.cwd():K.getStreamFromFD(e).path;if(t.length==0){if(!n)throw new U.ErrnoError(44);return r}return r+`/`+t},writeStat(e,t){W[e>>2]=t.dev,W[e+4>>2]=t.mode,W[e+8>>2]=t.nlink,W[e+12>>2]=t.uid,W[e+16>>2]=t.gid,W[e+20>>2]=t.rdev,G[e+24>>3]=BigInt(t.size),D[e+32>>2]=4096,D[e+36>>2]=t.blocks;var n=t.atime.getTime(),r=t.mtime.getTime(),i=t.ctime.getTime();return G[e+40>>3]=BigInt(Math.floor(n/1e3)),W[e+48>>2]=n%1e3*1e3*1e3,G[e+56>>3]=BigInt(Math.floor(r/1e3)),W[e+64>>2]=r%1e3*1e3*1e3,G[e+72>>3]=BigInt(Math.floor(i/1e3)),W[e+80>>2]=i%1e3*1e3*1e3,G[e+88>>3]=BigInt(t.ino),0},writeStatFs(e,t){W[e+4>>2]=t.bsize,W[e+60>>2]=t.bsize,G[e+8>>3]=BigInt(t.blocks),G[e+16>>3]=BigInt(t.bfree),G[e+24>>3]=BigInt(t.bavail),G[e+32>>3]=BigInt(t.files),G[e+40>>3]=BigInt(t.ffree),W[e+48>>2]=t.fsid,W[e+64>>2]=t.flags,W[e+56>>2]=t.namelen},doMsync(e,t,n,r,i){if(!U.isFile(t.node.mode))throw new U.ErrnoError(43);if(r&2)return 0;var a=w.subarray(e,e+n);U.msync(t,a,i,n,r)},getStreamFromFD(e){return U.getStreamChecked(e)},varargs:void 0,getStr(e){return T(e)}},q;function Ee(e,t,n){K.varargs=n;try{var r=K.getStreamFromFD(e);switch(t){case 0:var i=O();if(i<0)return-28;for(;U.streams[i];)i++;return U.dupStream(r,i).fd;case 1:case 2:return 0;case 3:return r.flags;case 4:var i=O(),a=289792;return r.flags=r.flags&~a|i&a,0;case 12:var i=k(),o=0;return q[i+o>>1]=2,0;case 13:case 14:return 0}return-28}catch(e){if(U===void 0||e.name!==`ErrnoError`)throw e;return-e.errno}}function De(e,t,n){K.varargs=n;try{var r=K.getStreamFromFD(e);switch(t){case 21509:return r.tty?0:-59;case 21505:if(!r.tty)return-59;if(r.tty.ops.ioctl_tcgets){var i=r.tty.ops.ioctl_tcgets(r),a=k();D[a>>2]=i.c_iflag||0,D[a+4>>2]=i.c_oflag||0,D[a+8>>2]=i.c_cflag||0,D[a+12>>2]=i.c_lflag||0;for(var o=0;o<32;o++)v[a+o+17]=i.c_cc[o]||0;return 0}return 0;case 21510:case 21511:case 21512:return r.tty?0:-59;case 21506:case 21507:case 21508:if(!r.tty)return-59;if(r.tty.ops.ioctl_tcsets){for(var a=k(),s=D[a>>2],c=D[a+4>>2],l=D[a+8>>2],u=D[a+12>>2],d=[],o=0;o<32;o++)d.push(v[a+o+17]);return r.tty.ops.ioctl_tcsets(r.tty,t,{c_iflag:s,c_oflag:c,c_cflag:l,c_lflag:u,c_cc:d})}return 0;case 21519:if(!r.tty)return-59;var a=k();return D[a>>2]=0,0;case 21520:return r.tty?-28:-59;case 21537:case 21531:var a=k();return U.ioctl(r,t,a);case 21523:if(!r.tty)return-59;if(r.tty.ops.ioctl_tiocgwinsz){var f=r.tty.ops.ioctl_tiocgwinsz(r.tty),a=k();q[a>>1]=f[0],q[a+2>>1]=f[1]}return 0;case 21524:return r.tty?0:-59;case 21515:return r.tty?0:-59;default:return-28}}catch(e){if(U===void 0||e.name!==`ErrnoError`)throw e;return-e.errno}}function Oe(e,t,n,r){K.varargs=r;try{t=K.getStr(t),t=K.calculateAt(e,t);var i=r?O():0;return n&64&&(i&=~K.currentUmask),U.open(t,n,i).fd}catch(e){if(U===void 0||e.name!==`ErrnoError`)throw e;return-e.errno}}var ke=()=>Date.now(),J=()=>2147483648,Y=(e,t)=>Math.ceil(e/t)*t,X=e=>{var t=(e-Qe.buffer.byteLength+65535)/65536|0;try{return Qe.grow(t),p(),1}catch{}},Z=e=>{var t=w.length;e>>>=0;var n=J();if(e>n)return!1;for(var r=1;r<=4;r*=2){var i=t*(1+.2/r);if(i=Math.min(i,e+100663296),X(Math.min(n,Y(Math.max(e,i),65536))))return!0}return!1};function Ae(e){try{var t=K.getStreamFromFD(e);return U.close(t),0}catch(e){if(U===void 0||e.name!==`ErrnoError`)throw e;return e.errno}}var Q=(e,t,n,r)=>{for(var i=0,a=0;a<n;a++){var o=W[t>>2],s=W[t+4>>2];t+=8;try{var c=U.read(e,v,o,s,r)}catch(e){if(i>0&&e instanceof U.ErrnoError&&(e.errno==6||e.errno==6))break;throw e}if(c<0)return-1;if(i+=c,c<s)break;r!==void 0&&(r+=c)}return i};function je(e,t,n,r){try{var i=Q(K.getStreamFromFD(e),t,n);return W[r>>2]=i,0}catch(e){if(U===void 0||e.name!==`ErrnoError`)throw e;return e.errno}}var Me=9007199254740992,Ne=-9007199254740992,Pe=e=>e<Ne||e>Me?NaN:Number(e);function Fe(e,t,n,r){t=Pe(t);try{if(isNaN(t))return 22;var i=K.getStreamFromFD(e);return U.llseek(i,t,n),G[r>>3]=BigInt(i.position),i.getdents&&!t&&n===0&&(i.getdents=null),0}catch(e){if(U===void 0||e.name!==`ErrnoError`)throw e;return e.errno}}var Ie=(e,t,n,r)=>{if(n==1)return U.write(e,v,W[t>>2],W[t+4>>2],r);for(var i=0,a=0,o=t;a<n;a++,o+=8)i+=W[o+4>>2];for(var s=new Uint8Array(i),c=0,a=0;a<n;a++,t+=8){var l=W[t>>2],u=W[t+4>>2];s.set(w.subarray(l,l+u),c),c+=u}return U.write(e,s,0,i,r)};function Le(e,t,n,r){try{var i=Ie(K.getStreamFromFD(e),t,n);return W[r>>2]=i,0}catch(e){if(U===void 0||e.name!==`ErrnoError`)throw e;return e.errno}}var Re=e=>t[`_`+e],ze=(e,t)=>{v.set(e,t)},Be=(e,t,n)=>pe(e,w,t,n),Ve=e=>Xe(e),He=e=>{var t=N(e)+1,n=Ve(t);return Be(e,n,t),n},Ue=(e,t,n,r,i)=>{var a={string:e=>{var t=0;return e!=null&&e!==0&&(t=He(e)),t},array:e=>{var t=Ve(e.length);return ze(e,t),t}};function o(e){return t===`string`?T(e):t===`boolean`?!!e:e}var s=Re(e),c=[],l=0;if(r)for(var u=0;u<r.length;u++){var d=a[n[u]];d?(l||=b(),c[u]=d(r[u])):c[u]=r[u]}var f=s(...c);function p(e){return l&&ue(l),o(e)}return f=p(f),f},We=(e,t,n,r)=>{var i=!n||n.every(e=>e===`number`||e===`boolean`);return t!==`string`&&i&&!r?Re(e):(...i)=>Ue(e,t,n,i,r)},Ge,Ke;function qe(e,t=`i8`){switch(t.endsWith(`*`)&&(t=`*`),t){case`i1`:return v[e];case`i8`:return v[e];case`i16`:return q[e>>1];case`i32`:return D[e>>2];case`i64`:return G[e>>3];case`float`:return Ge[e>>2];case`double`:return Ke[e>>3];case`*`:return W[e>>2];default:m(`invalid type for getValue: ${t}`)}}function Je(e,t,n=`i8`){switch(n.endsWith(`*`)&&(n=`*`),n){case`i1`:v[e]=t;break;case`i8`:v[e]=t;break;case`i16`:q[e>>1]=t;break;case`i32`:D[e>>2]=t;break;case`i64`:G[e>>3]=BigInt(t);break;case`float`:Ge[e>>2]=t;break;case`double`:Ke[e>>3]=t;break;case`*`:W[e>>2]=t;break;default:m(`invalid type for setValue: ${n}`)}}U.createPreloadedFile=H,U.preloadFile=Te,U.staticInit(),t.noExitRuntime&&t.noExitRuntime,t.print&&(c=t.print),t.printErr&&(l=t.printErr),t.arguments&&t.arguments,t.thisProgram&&t.thisProgram;var $=t.preInit;if($)for(typeof $==`function`&&(t.preInit=$=[$]);$.length>0;)$.shift()();t.cwrap=We,t.setValue=Je,t.getValue=qe;var Ye,Xe,Ze,Qe;function $e(e){t._free=e.m,t._atagjs_init=e.n,t._atagjs_destroy=e.o,t._atagjs_set_family=e.p,t._atagjs_set_detector_options=e.q,t._atagjs_set_pose_info=e.r,t._atagjs_set_img_buffer=e.s,t._atagjs_set_tag_size=e.t,t._atagjs_detect=e.u,Ye=e.v,Xe=e.w,Ze=e.x,Qe=e.k,e.__indirect_function_table}var et={a:E,d:Ee,h:De,i:Oe,j:ke,e:Z,b:Ae,g:je,f:Fe,c:Le};async function tt(){ee(),z&&await xe();var e=t.setStatus;e&&(e(`Running...`),await new Promise(e=>setTimeout(e,1)),setTimeout(e,1,``)),!d&&(te(),t.onRuntimeInitialized?.(),ne())}var nt=await _();return await tt(),t}async function Me(){try{let e=new Ee(await je()),t=document.createElement(`apriltag-app`);t.detector=e,document.body.appendChild(t)}catch(e){console.error(`Error initializing app:`,e)}}Me();