(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))d(l);new MutationObserver(l=>{for(const p of l)if(p.type==="childList")for(const m of p.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&d(m)}).observe(document,{childList:!0,subtree:!0});function o(l){const p={};return l.integrity&&(p.integrity=l.integrity),l.referrerPolicy&&(p.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?p.credentials="include":l.crossOrigin==="anonymous"?p.credentials="omit":p.credentials="same-origin",p}function d(l){if(l.ep)return;l.ep=!0;const p=o(l);fetch(l.href,p)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ue=globalThis,tt=Ue.ShadowRoot&&(Ue.ShadyCSS===void 0||Ue.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,rt=Symbol(),At=new WeakMap;let Ut=class{constructor(r,o,d){if(this._$cssResult$=!0,d!==rt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=r,this.t=o}get styleSheet(){let r=this.o;const o=this.t;if(tt&&r===void 0){const d=o!==void 0&&o.length===1;d&&(r=At.get(o)),r===void 0&&((this.o=r=new CSSStyleSheet).replaceSync(this.cssText),d&&At.set(o,r))}return r}toString(){return this.cssText}};const Gr=c=>new Ut(typeof c=="string"?c:c+"",void 0,rt),Pe=(c,...r)=>{const o=c.length===1?c[0]:r.reduce((d,l,p)=>d+(m=>{if(m._$cssResult$===!0)return m.cssText;if(typeof m=="number")return m;throw Error("Value passed to 'css' function must be a 'css' function result: "+m+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(l)+c[p+1],c[0]);return new Ut(o,c,rt)},Xr=(c,r)=>{if(tt)c.adoptedStyleSheets=r.map(o=>o instanceof CSSStyleSheet?o:o.styleSheet);else for(const o of r){const d=document.createElement("style"),l=Ue.litNonce;l!==void 0&&d.setAttribute("nonce",l),d.textContent=o.cssText,c.appendChild(d)}},Mt=tt?c=>c:c=>c instanceof CSSStyleSheet?(r=>{let o="";for(const d of r.cssRules)o+=d.cssText;return Gr(o)})(c):c;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Kr,defineProperty:Jr,getOwnPropertyDescriptor:Yr,getOwnPropertyNames:Zr,getOwnPropertySymbols:Qr,getPrototypeOf:ei}=Object,Be=globalThis,St=Be.trustedTypes,ti=St?St.emptyScript:"",ri=Be.reactiveElementPolyfillSupport,Me=(c,r)=>c,ze={toAttribute(c,r){switch(r){case Boolean:c=c?ti:null;break;case Object:case Array:c=c==null?c:JSON.stringify(c)}return c},fromAttribute(c,r){let o=c;switch(r){case Boolean:o=c!==null;break;case Number:o=c===null?null:Number(c);break;case Object:case Array:try{o=JSON.parse(c)}catch{o=null}}return o}},it=(c,r)=>!Kr(c,r),Dt={attribute:!0,type:String,converter:ze,reflect:!1,useDefault:!1,hasChanged:it};Symbol.metadata??=Symbol("metadata"),Be.litPropertyMetadata??=new WeakMap;let fe=class extends HTMLElement{static addInitializer(r){this._$Ei(),(this.l??=[]).push(r)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(r,o=Dt){if(o.state&&(o.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(r)&&((o=Object.create(o)).wrapped=!0),this.elementProperties.set(r,o),!o.noAccessor){const d=Symbol(),l=this.getPropertyDescriptor(r,d,o);l!==void 0&&Jr(this.prototype,r,l)}}static getPropertyDescriptor(r,o,d){const{get:l,set:p}=Yr(this.prototype,r)??{get(){return this[o]},set(m){this[o]=m}};return{get:l,set(m){const w=l?.call(this);p?.call(this,m),this.requestUpdate(r,w,d)},configurable:!0,enumerable:!0}}static getPropertyOptions(r){return this.elementProperties.get(r)??Dt}static _$Ei(){if(this.hasOwnProperty(Me("elementProperties")))return;const r=ei(this);r.finalize(),r.l!==void 0&&(this.l=[...r.l]),this.elementProperties=new Map(r.elementProperties)}static finalize(){if(this.hasOwnProperty(Me("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Me("properties"))){const o=this.properties,d=[...Zr(o),...Qr(o)];for(const l of d)this.createProperty(l,o[l])}const r=this[Symbol.metadata];if(r!==null){const o=litPropertyMetadata.get(r);if(o!==void 0)for(const[d,l]of o)this.elementProperties.set(d,l)}this._$Eh=new Map;for(const[o,d]of this.elementProperties){const l=this._$Eu(o,d);l!==void 0&&this._$Eh.set(l,o)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(r){const o=[];if(Array.isArray(r)){const d=new Set(r.flat(1/0).reverse());for(const l of d)o.unshift(Mt(l))}else r!==void 0&&o.push(Mt(r));return o}static _$Eu(r,o){const d=o.attribute;return d===!1?void 0:typeof d=="string"?d:typeof r=="string"?r.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(r=>r(this))}addController(r){(this._$EO??=new Set).add(r),this.renderRoot!==void 0&&this.isConnected&&r.hostConnected?.()}removeController(r){this._$EO?.delete(r)}_$E_(){const r=new Map,o=this.constructor.elementProperties;for(const d of o.keys())this.hasOwnProperty(d)&&(r.set(d,this[d]),delete this[d]);r.size>0&&(this._$Ep=r)}createRenderRoot(){const r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Xr(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(r=>r.hostConnected?.())}enableUpdating(r){}disconnectedCallback(){this._$EO?.forEach(r=>r.hostDisconnected?.())}attributeChangedCallback(r,o,d){this._$AK(r,d)}_$ET(r,o){const d=this.constructor.elementProperties.get(r),l=this.constructor._$Eu(r,d);if(l!==void 0&&d.reflect===!0){const p=(d.converter?.toAttribute!==void 0?d.converter:ze).toAttribute(o,d.type);this._$Em=r,p==null?this.removeAttribute(l):this.setAttribute(l,p),this._$Em=null}}_$AK(r,o){const d=this.constructor,l=d._$Eh.get(r);if(l!==void 0&&this._$Em!==l){const p=d.getPropertyOptions(l),m=typeof p.converter=="function"?{fromAttribute:p.converter}:p.converter?.fromAttribute!==void 0?p.converter:ze;this._$Em=l;const w=m.fromAttribute(o,p.type);this[l]=w??this._$Ej?.get(l)??w,this._$Em=null}}requestUpdate(r,o,d){if(r!==void 0){const l=this.constructor,p=this[r];if(d??=l.getPropertyOptions(r),!((d.hasChanged??it)(p,o)||d.useDefault&&d.reflect&&p===this._$Ej?.get(r)&&!this.hasAttribute(l._$Eu(r,d))))return;this.C(r,o,d)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(r,o,{useDefault:d,reflect:l,wrapped:p},m){d&&!(this._$Ej??=new Map).has(r)&&(this._$Ej.set(r,m??o??this[r]),p!==!0||m!==void 0)||(this._$AL.has(r)||(this.hasUpdated||d||(o=void 0),this._$AL.set(r,o)),l===!0&&this._$Em!==r&&(this._$Eq??=new Set).add(r))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(o){Promise.reject(o)}const r=this.scheduleUpdate();return r!=null&&await r,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[l,p]of this._$Ep)this[l]=p;this._$Ep=void 0}const d=this.constructor.elementProperties;if(d.size>0)for(const[l,p]of d){const{wrapped:m}=p,w=this[l];m!==!0||this._$AL.has(l)||w===void 0||this.C(l,void 0,p,w)}}let r=!1;const o=this._$AL;try{r=this.shouldUpdate(o),r?(this.willUpdate(o),this._$EO?.forEach(d=>d.hostUpdate?.()),this.update(o)):this._$EM()}catch(d){throw r=!1,this._$EM(),d}r&&this._$AE(o)}willUpdate(r){}_$AE(r){this._$EO?.forEach(o=>o.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(r)),this.updated(r)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(r){return!0}update(r){this._$Eq&&=this._$Eq.forEach(o=>this._$ET(o,this[o])),this._$EM()}updated(r){}firstUpdated(r){}};fe.elementStyles=[],fe.shadowRootOptions={mode:"open"},fe[Me("elementProperties")]=new Map,fe[Me("finalized")]=new Map,ri?.({ReactiveElement:fe}),(Be.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const st=globalThis,Le=st.trustedTypes,It=Le?Le.createPolicy("lit-html",{createHTML:c=>c}):void 0,zt="$lit$",ee=`lit$${Math.random().toFixed(9).slice(2)}$`,Lt="?"+ee,ii=`<${Lt}>`,oe=document,Se=()=>oe.createComment(""),De=c=>c===null||typeof c!="object"&&typeof c!="function",ot=Array.isArray,si=c=>ot(c)||typeof c?.[Symbol.iterator]=="function",et=`[ 	
\f\r]`,$e=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pt=/-->/g,Rt=/>/g,ie=RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ft=/'/g,Tt=/"/g,jt=/^(?:script|style|textarea|title)$/i,oi=c=>(r,...o)=>({_$litType$:c,strings:r,values:o}),T=oi(1),me=Symbol.for("lit-noChange"),O=Symbol.for("lit-nothing"),Ot=new WeakMap,se=oe.createTreeWalker(oe,129);function Bt(c,r){if(!ot(c)||!c.hasOwnProperty("raw"))throw Error("invalid template strings array");return It!==void 0?It.createHTML(r):r}const ni=(c,r)=>{const o=c.length-1,d=[];let l,p=r===2?"<svg>":r===3?"<math>":"",m=$e;for(let w=0;w<o;w++){const g=c[w];let $,I,x=-1,P=0;for(;P<g.length&&(m.lastIndex=P,I=m.exec(g),I!==null);)P=m.lastIndex,m===$e?I[1]==="!--"?m=Pt:I[1]!==void 0?m=Rt:I[2]!==void 0?(jt.test(I[2])&&(l=RegExp("</"+I[2],"g")),m=ie):I[3]!==void 0&&(m=ie):m===ie?I[0]===">"?(m=l??$e,x=-1):I[1]===void 0?x=-2:(x=m.lastIndex-I[2].length,$=I[1],m=I[3]===void 0?ie:I[3]==='"'?Tt:Ft):m===Tt||m===Ft?m=ie:m===Pt||m===Rt?m=$e:(m=ie,l=void 0);const R=m===ie&&c[w+1].startsWith("/>")?" ":"";p+=m===$e?g+ii:x>=0?(d.push($),g.slice(0,x)+zt+g.slice(x)+ee+R):g+ee+(x===-2?w:R)}return[Bt(c,p+(c[o]||"<?>")+(r===2?"</svg>":r===3?"</math>":"")),d]};class Ie{constructor({strings:r,_$litType$:o},d){let l;this.parts=[];let p=0,m=0;const w=r.length-1,g=this.parts,[$,I]=ni(r,o);if(this.el=Ie.createElement($,d),se.currentNode=this.el.content,o===2||o===3){const x=this.el.content.firstChild;x.replaceWith(...x.childNodes)}for(;(l=se.nextNode())!==null&&g.length<w;){if(l.nodeType===1){if(l.hasAttributes())for(const x of l.getAttributeNames())if(x.endsWith(zt)){const P=I[m++],R=l.getAttribute(x).split(ee),j=/([.?@])?(.*)/.exec(P);g.push({type:1,index:p,name:j[2],strings:R,ctor:j[1]==="."?di:j[1]==="?"?li:j[1]==="@"?ci:Ve}),l.removeAttribute(x)}else x.startsWith(ee)&&(g.push({type:6,index:p}),l.removeAttribute(x));if(jt.test(l.tagName)){const x=l.textContent.split(ee),P=x.length-1;if(P>0){l.textContent=Le?Le.emptyScript:"";for(let R=0;R<P;R++)l.append(x[R],Se()),se.nextNode(),g.push({type:2,index:++p});l.append(x[P],Se())}}}else if(l.nodeType===8)if(l.data===Lt)g.push({type:2,index:p});else{let x=-1;for(;(x=l.data.indexOf(ee,x+1))!==-1;)g.push({type:7,index:p}),x+=ee.length-1}p++}}static createElement(r,o){const d=oe.createElement("template");return d.innerHTML=r,d}}function ve(c,r,o=c,d){if(r===me)return r;let l=d!==void 0?o._$Co?.[d]:o._$Cl;const p=De(r)?void 0:r._$litDirective$;return l?.constructor!==p&&(l?._$AO?.(!1),p===void 0?l=void 0:(l=new p(c),l._$AT(c,o,d)),d!==void 0?(o._$Co??=[])[d]=l:o._$Cl=l),l!==void 0&&(r=ve(c,l._$AS(c,r.values),l,d)),r}class ai{constructor(r,o){this._$AV=[],this._$AN=void 0,this._$AD=r,this._$AM=o}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(r){const{el:{content:o},parts:d}=this._$AD,l=(r?.creationScope??oe).importNode(o,!0);se.currentNode=l;let p=se.nextNode(),m=0,w=0,g=d[0];for(;g!==void 0;){if(m===g.index){let $;g.type===2?$=new Re(p,p.nextSibling,this,r):g.type===1?$=new g.ctor(p,g.name,g.strings,this,r):g.type===6&&($=new hi(p,this,r)),this._$AV.push($),g=d[++w]}m!==g?.index&&(p=se.nextNode(),m++)}return se.currentNode=oe,l}p(r){let o=0;for(const d of this._$AV)d!==void 0&&(d.strings!==void 0?(d._$AI(r,d,o),o+=d.strings.length-2):d._$AI(r[o])),o++}}class Re{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(r,o,d,l){this.type=2,this._$AH=O,this._$AN=void 0,this._$AA=r,this._$AB=o,this._$AM=d,this.options=l,this._$Cv=l?.isConnected??!0}get parentNode(){let r=this._$AA.parentNode;const o=this._$AM;return o!==void 0&&r?.nodeType===11&&(r=o.parentNode),r}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(r,o=this){r=ve(this,r,o),De(r)?r===O||r==null||r===""?(this._$AH!==O&&this._$AR(),this._$AH=O):r!==this._$AH&&r!==me&&this._(r):r._$litType$!==void 0?this.$(r):r.nodeType!==void 0?this.T(r):si(r)?this.k(r):this._(r)}O(r){return this._$AA.parentNode.insertBefore(r,this._$AB)}T(r){this._$AH!==r&&(this._$AR(),this._$AH=this.O(r))}_(r){this._$AH!==O&&De(this._$AH)?this._$AA.nextSibling.data=r:this.T(oe.createTextNode(r)),this._$AH=r}$(r){const{values:o,_$litType$:d}=r,l=typeof d=="number"?this._$AC(r):(d.el===void 0&&(d.el=Ie.createElement(Bt(d.h,d.h[0]),this.options)),d);if(this._$AH?._$AD===l)this._$AH.p(o);else{const p=new ai(l,this),m=p.u(this.options);p.p(o),this.T(m),this._$AH=p}}_$AC(r){let o=Ot.get(r.strings);return o===void 0&&Ot.set(r.strings,o=new Ie(r)),o}k(r){ot(this._$AH)||(this._$AH=[],this._$AR());const o=this._$AH;let d,l=0;for(const p of r)l===o.length?o.push(d=new Re(this.O(Se()),this.O(Se()),this,this.options)):d=o[l],d._$AI(p),l++;l<o.length&&(this._$AR(d&&d._$AB.nextSibling,l),o.length=l)}_$AR(r=this._$AA.nextSibling,o){for(this._$AP?.(!1,!0,o);r!==this._$AB;){const d=r.nextSibling;r.remove(),r=d}}setConnected(r){this._$AM===void 0&&(this._$Cv=r,this._$AP?.(r))}}class Ve{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(r,o,d,l,p){this.type=1,this._$AH=O,this._$AN=void 0,this.element=r,this.name=o,this._$AM=l,this.options=p,d.length>2||d[0]!==""||d[1]!==""?(this._$AH=Array(d.length-1).fill(new String),this.strings=d):this._$AH=O}_$AI(r,o=this,d,l){const p=this.strings;let m=!1;if(p===void 0)r=ve(this,r,o,0),m=!De(r)||r!==this._$AH&&r!==me,m&&(this._$AH=r);else{const w=r;let g,$;for(r=p[0],g=0;g<p.length-1;g++)$=ve(this,w[d+g],o,g),$===me&&($=this._$AH[g]),m||=!De($)||$!==this._$AH[g],$===O?r=O:r!==O&&(r+=($??"")+p[g+1]),this._$AH[g]=$}m&&!l&&this.j(r)}j(r){r===O?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,r??"")}}class di extends Ve{constructor(){super(...arguments),this.type=3}j(r){this.element[this.name]=r===O?void 0:r}}class li extends Ve{constructor(){super(...arguments),this.type=4}j(r){this.element.toggleAttribute(this.name,!!r&&r!==O)}}class ci extends Ve{constructor(r,o,d,l,p){super(r,o,d,l,p),this.type=5}_$AI(r,o=this){if((r=ve(this,r,o,0)??O)===me)return;const d=this._$AH,l=r===O&&d!==O||r.capture!==d.capture||r.once!==d.once||r.passive!==d.passive,p=r!==O&&(d===O||l);l&&this.element.removeEventListener(this.name,this,d),p&&this.element.addEventListener(this.name,this,r),this._$AH=r}handleEvent(r){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,r):this._$AH.handleEvent(r)}}class hi{constructor(r,o,d){this.element=r,this.type=6,this._$AN=void 0,this._$AM=o,this.options=d}get _$AU(){return this._$AM._$AU}_$AI(r){ve(this,r)}}const ui=st.litHtmlPolyfillSupport;ui?.(Ie,Re),(st.litHtmlVersions??=[]).push("3.3.1");const pi=(c,r,o)=>{const d=o?.renderBefore??r;let l=d._$litPart$;if(l===void 0){const p=o?.renderBefore??null;d._$litPart$=l=new Re(r.insertBefore(Se(),p),p,void 0,o??{})}return l._$AI(c),l};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nt=globalThis;class J extends fe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const r=super.createRenderRoot();return this.renderOptions.renderBefore??=r.firstChild,r}update(r){const o=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(r),this._$Do=pi(o,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return me}}J._$litElement$=!0,J.finalized=!0,nt.litElementHydrateSupport?.({LitElement:J});const fi=nt.litElementPolyfillSupport;fi?.({LitElement:J});(nt.litElementVersions??=[]).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fe=c=>(r,o)=>{o!==void 0?o.addInitializer(()=>{customElements.define(c,r)}):customElements.define(c,r)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mi={attribute:!0,type:String,converter:ze,reflect:!1,hasChanged:it},vi=(c=mi,r,o)=>{const{kind:d,metadata:l}=o;let p=globalThis.litPropertyMetadata.get(l);if(p===void 0&&globalThis.litPropertyMetadata.set(l,p=new Map),d==="setter"&&((c=Object.create(c)).wrapped=!0),p.set(o.name,c),d==="accessor"){const{name:m}=o;return{set(w){const g=r.get.call(this);r.set.call(this,w),this.requestUpdate(m,g,c)},init(w){return w!==void 0&&this.C(m,void 0,c,w),w}}}if(d==="setter"){const{name:m}=o;return function(w){const g=this[m];r.call(this,w),this.requestUpdate(m,g,c)}}throw Error("Unsupported decorator location: "+d)};function U(c){return(r,o)=>typeof o=="object"?vi(c,r,o):((d,l,p)=>{const m=l.hasOwnProperty(p);return l.constructor.createProperty(p,d),m?Object.getOwnPropertyDescriptor(l,p):void 0})(c,r,o)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function we(c){return U({...c,state:!0,attribute:!1})}var y=(c=>(c.LIVE="live",c.PAUSED="paused",c.RECORDING="recording",c.VIEWING_RECORDED="viewing_recorded",c.IMAGE_MODE="image_mode",c))(y||{});const gi=(c,r)=>{switch(c){case"live":return["paused","recording","image_mode"].includes(r);case"paused":return["live","image_mode"].includes(r);case"recording":return["viewing_recorded","live"].includes(r);case"viewing_recorded":return["live","recording"].includes(r);case"image_mode":return["live"].includes(r);default:return!1}};class wi{constructor(r){this._state={isReady:!1,stream:null,dimensions:{width:0,height:0}},this.availableDevices=[],this.currentDeviceId=null,this.host=r,this.host.addController(this)}hostConnected(){}hostDisconnected(){this.cleanup()}get state(){return this._state}get isReady(){return this._state.isReady}get stream(){return this._state.stream}get dimensions(){return this._state.dimensions}get availableCameras(){return this.availableDevices}get currentCameraId(){return this.currentDeviceId}get hasMultipleCameras(){return this.availableDevices.length>1}async initialize(){try{this.updateStatus("Requesting camera permission..."),await this.enumerateDevices();const r={video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}}},o=await navigator.mediaDevices.getUserMedia(r),d=o.getVideoTracks()[0];d&&(this.currentDeviceId=d.getSettings().deviceId||null),await this.enumerateDevices(),this._state={...this._state,stream:o,isReady:!0},this.host.requestUpdate(),console.log("Camera ready, dispatching event with stream:",o),this.dispatchEvent("camera-ready",{stream:o})}catch(r){console.error("Error accessing camera:",r),this.dispatchEvent("camera-error",{error:r,message:"Camera access denied. Please allow camera permissions and refresh."})}}updateDimensions(r,o){(this._state.dimensions.width!==r||this._state.dimensions.height!==o)&&(this._state={...this._state,dimensions:{width:r,height:o}},this.host.requestUpdate(),this.dispatchEvent("dimensions-changed",{width:r,height:o}))}async enumerateDevices(){try{const r=await navigator.mediaDevices.enumerateDevices();this.availableDevices=r.filter(o=>o.kind==="videoinput"),console.log("Available video devices:",this.availableDevices)}catch(r){console.error("Error enumerating devices:",r),this.availableDevices=[]}}async switchCamera(r){if(!this.availableDevices.find(o=>o.deviceId===r))throw new Error("Invalid device ID");try{this.updateStatus("Switching camera..."),this._state.stream&&this._state.stream.getTracks().forEach(l=>l.stop());const o={video:{deviceId:{exact:r},width:{ideal:1280},height:{ideal:720}}},d=await navigator.mediaDevices.getUserMedia(o);this.currentDeviceId=r,this._state={...this._state,stream:d,isReady:!0},this.host.requestUpdate(),this.dispatchEvent("camera-ready",{stream:d}),this.dispatchEvent("status-clear",{})}catch(o){console.error("Error switching camera:",o),this.dispatchEvent("camera-error",{error:o,message:"Failed to switch camera. Please try again."})}}cleanup(){this._state.stream&&(this._state.stream.getTracks().forEach(r=>r.stop()),this._state={...this._state,stream:null,isReady:!1},this.host.requestUpdate())}updateStatus(r){this.dispatchEvent("status-update",{message:r})}dispatchEvent(r,o){this.host instanceof EventTarget&&this.host.dispatchEvent(new CustomEvent(r,{detail:o,bubbles:!0,composed:!0}))}}function Ae(c){const r=new Map;for(const d of c)r.set(d.id,(r.get(d.id)??0)+1);const o=[];for(const[d,l]of r)l>1&&o.push(d);return o.sort((d,l)=>d-l)}class yi{constructor(r){this.initialized=!1,this.currentFamily="tag36h11",this.detector=r}init(){this.initialized||(this.detector._atagjs_init(),this.initialized=!0)}setFamily(r){return this.ensureInitialized(),this.detector.cwrap("atagjs_set_family","number",["string"])(r)===0?(this.currentFamily=r,!0):!1}getFamily(){return this.currentFamily}detect(r,o){this.ensureInitialized();const{width:d,height:l}=o,p=this.detector._atagjs_set_img_buffer(d,l,d);if(d*l!==r.length)throw new Error(`Image data size mismatch. Expected ${d*l} bytes, got ${r.length}`);this.detector.HEAPU8.set(r,p);const m=this.detector._atagjs_detect(),w=this.detector.getValue(m,"i32");if(w===0)return[];const g=this.detector.getValue(m+4,"i32"),$=new Uint8Array(this.detector.HEAPU8.buffer,g,w);let I="";for(let P=0;P<w;P++)I+=String.fromCharCode($[P]);const x=JSON.parse(I);if(!Array.isArray(x))throw new Error("Invalid detections format");return x}detectFromImageData(r){const o=this.convertToGrayscale(r);return this.detect(o,{width:r.width,height:r.height})}convertToGrayscale(r){const o=r.data,d=new Uint8Array(r.width*r.height);for(let l=0;l<o.length;l+=4){const p=Math.round((o[l]+o[l+1]+o[l+2])/3);d[l/4]=p}return d}isReady(){return this.initialized}ensureInitialized(){if(!this.initialized)throw new Error("Detector not initialized. Call init() first.")}static getAvailableFamilies(){return[{id:"tag36h11",name:"36h11",tagCount:587},{id:"tag25h9",name:"25h9",tagCount:35},{id:"tag16h5",name:"16h5",tagCount:30},{id:"tagStandard41h12",name:"Standard 41h12",tagCount:2115},{id:"tagStandard52h13",name:"Standard 52h13",tagCount:48714},{id:"tagCircle21h7",name:"Circle 21h7",tagCount:38},{id:"tagCircle49h12",name:"Circle 49h12",tagCount:65535},{id:"tagCustom48h12",name:"Custom 48h12",tagCount:42211}]}}class bi{constructor(r,o,d="tag36h11"){this._state={detections:[],duplicateIds:[],frozenFrame:null,selectedImage:null,isProcessing:!1},this.animationFrameId=null,this.video=null,this.currentMode=y.LIVE,this.host=r,this.detector=o,this._currentFamily=d,this.host.addController(this),this.detector.setFamily(d),this.hiddenCanvas=document.createElement("canvas"),this.hiddenCtx=this.hiddenCanvas.getContext("2d")}hostConnected(){}hostDisconnected(){this.stopContinuousDetection()}hostUpdate(){this._previousFamily!==void 0&&this._previousFamily!==this._currentFamily&&this.handleFamilyChange(),this._previousFamily=this._currentFamily}get state(){return this._state}get family(){return this._currentFamily}set family(r){this._currentFamily!==r&&(this._currentFamily=r,this.host.requestUpdate())}get detections(){return this._state.detections}get duplicateIds(){return this._state.duplicateIds}get frozenFrame(){return this._state.frozenFrame}get selectedImage(){return this._state.selectedImage}get isProcessing(){return this._state.isProcessing}setVideo(r){this.video=r}setMode(r){const o=this.currentMode;this.currentMode=r,r===y.LIVE&&o!==y.LIVE?this.resumeLiveDetection():r!==y.LIVE&&o===y.LIVE&&this.stopContinuousDetection()}startContinuousDetection(){this.animationFrameId&&cancelAnimationFrame(this.animationFrameId),this.runDetectionLoop()}stopContinuousDetection(){this.animationFrameId&&(cancelAnimationFrame(this.animationFrameId),this.animationFrameId=null)}async freezeCurrentFrame(){if(!this.video?.videoWidth)return;const r=this.captureCurrentFrame();if(r){const o=await this.detectInFrame(r);this._state={...this._state,frozenFrame:r,detections:o,duplicateIds:Ae(o)},this.host.requestUpdate(),this.stopContinuousDetection()}}async loadImageFile(r){try{this.dispatchEvent("status-update",{message:"Loading image..."});const o=await this.loadImageAsImageData(r),d=await this.detectInFrame(o);this._state={...this._state,selectedImage:o,detections:d,duplicateIds:Ae(d),frozenFrame:null},this.host.requestUpdate(),this.stopContinuousDetection(),this.dispatchEvent("status-clear")}catch(o){console.error("Error loading image:",o),this.dispatchEvent("status-update",{message:"Failed to load image"})}}resumeLiveDetection(){this._state={...this._state,frozenFrame:null,selectedImage:null,detections:[],duplicateIds:[]},this.host.requestUpdate(),this.startContinuousDetection()}async redetectInFrozenFrame(){const r=this._state.frozenFrame;if(r)try{this._state={...this._state,isProcessing:!0},this.host.requestUpdate();const o=await this.detectInFrame(r);this._state={...this._state,detections:o,duplicateIds:Ae(o),isProcessing:!1},this.host.requestUpdate()}catch(o){console.error("Error re-detecting in frozen frame:",o),this._state={...this._state,isProcessing:!1},this.host.requestUpdate()}}async redetectInSelectedImage(){const r=this._state.selectedImage;if(r)try{this._state={...this._state,isProcessing:!0},this.host.requestUpdate();const o=await this.detectInFrame(r);this._state={...this._state,detections:o,duplicateIds:Ae(o),isProcessing:!1},this.host.requestUpdate()}catch(o){console.error("Error re-detecting in selected image:",o),this._state={...this._state,isProcessing:!1},this.host.requestUpdate()}}async handleFamilyChange(){if(!this.detector.setFamily(this._currentFamily)){console.error(`Failed to switch to family: ${this._currentFamily}`),this._currentFamily=this._previousFamily;return}this.currentMode===y.PAUSED&&this._state.frozenFrame?await this.redetectInFrozenFrame():this.currentMode===y.IMAGE_MODE&&this._state.selectedImage&&await this.redetectInSelectedImage()}runDetectionLoop(){this.currentMode!==y.LIVE&&this.currentMode!==y.RECORDING||(this.animationFrameId=requestAnimationFrame(()=>{this.processCurrentFrame(),this.runDetectionLoop()}))}async processCurrentFrame(){if(!(this._state.isProcessing||!this.detector?.isReady()||!this.video?.videoWidth))try{this._state={...this._state,isProcessing:!0},this.host.requestUpdate();const r=this.captureCurrentFrame();if(r){const o=await this.detectInFrame(r),d=Ae(o);this._state={...this._state,detections:o,duplicateIds:d,isProcessing:!1},this.host.requestUpdate(),this.dispatchEvent("detections-updated",{detections:o,duplicateIds:d})}}catch(r){console.error("Error processing frame:",r),this._state={...this._state,isProcessing:!1},this.host.requestUpdate()}}captureCurrentFrame(){return this.video?.videoWidth?(this.hiddenCanvas.width=this.video.videoWidth,this.hiddenCanvas.height=this.video.videoHeight,this.hiddenCtx.drawImage(this.video,0,0),this.hiddenCtx.getImageData(0,0,this.hiddenCanvas.width,this.hiddenCanvas.height)):null}async detectInFrame(r){return this.detector?.isReady()?this.detector.detectFromImageData(r):[]}loadImageAsImageData(r){return new Promise((o,d)=>{const l=new Image;l.onload=()=>{const p=document.createElement("canvas"),m=p.getContext("2d");p.width=l.width,p.height=l.height,m.drawImage(l,0,0);const w=m.getImageData(0,0,p.width,p.height);URL.revokeObjectURL(l.src),o(w)},l.onerror=()=>{URL.revokeObjectURL(l.src),d(new Error("Failed to load image"))},l.src=URL.createObjectURL(r)})}dispatchEvent(r,o){this.host instanceof EventTarget&&this.host.dispatchEvent(new CustomEvent(r,{detail:o,bubbles:!0,composed:!0}))}}class _i{constructor(r){this._state={isActive:!1,tagIds:[],isViewing:!1},this.recordedTagIdsSet=new Set,this.host=r,this.host.addController(this)}hostConnected(){}hostDisconnected(){this.stopRecording()}get state(){return this._state}get isActive(){return this._state.isActive}get isViewing(){return this._state.isViewing}get tagIds(){return this._state.tagIds}startRecording(){this._state={isActive:!0,tagIds:[],isViewing:!1},this.recordedTagIdsSet.clear(),this.host.requestUpdate(),this.dispatchEvent("recording-started")}stopRecording(){this._state.isActive&&(this._state={...this._state,isActive:!1,isViewing:!0},this.host.requestUpdate(),this.dispatchEvent("recording-stopped",{tagIds:this._state.tagIds}))}hideRecorded(){this._state={...this._state,isViewing:!1},this.host.requestUpdate(),this.dispatchEvent("recording-hidden")}clearRecorded(){this._state={isActive:!1,tagIds:[],isViewing:!1},this.recordedTagIdsSet.clear(),this.host.requestUpdate()}recordDetections(r){if(!this._state.isActive||r.length===0)return;let o=!1;r.forEach(d=>{this.recordedTagIdsSet.has(d.id)||(this.recordedTagIdsSet.add(d.id),o=!0)}),o&&(this._state={...this._state,tagIds:Array.from(this.recordedTagIdsSet).sort((d,l)=>d-l)},this.host.requestUpdate(),this.dispatchEvent("tags-updated",{tagIds:this._state.tagIds}))}dispatchEvent(r,o){this.host instanceof EventTarget&&this.host.dispatchEvent(new CustomEvent(r,{detail:o,bubbles:!0,composed:!0}))}}class Ei{constructor(r){this._state={message:null},this.fadeOutTimer=null,this.host=r,this.host.addController(this)}hostConnected(){}hostDisconnected(){this.clearMessage()}get state(){return this._state}get message(){return this._state.message}get hasMessage(){return this._state.message!==null}setMessage(r,o){this.fadeOutTimer!==null&&(clearTimeout(this.fadeOutTimer),this.fadeOutTimer=null);const d=o?Date.now()+o:void 0;this._state={message:r,fadeOutTime:d},this.host.requestUpdate(),o&&(this.fadeOutTimer=window.setTimeout(()=>{this._state.fadeOutTime===d&&this.clearMessage()},o))}clearMessage(){this.fadeOutTimer!==null&&(clearTimeout(this.fadeOutTimer),this.fadeOutTimer=null),this._state={message:null},this.host.requestUpdate()}setTemporaryMessage(r,o=3e3){this.setMessage(r,o)}setPersistentMessage(r){this.setMessage(r)}}var xi=Object.defineProperty,Ci=Object.getOwnPropertyDescriptor,He=(c,r,o,d)=>{for(var l=d>1?void 0:d?Ci(r,o):r,p=c.length-1,m;p>=0;p--)(m=c[p])&&(l=(d?m(r,o,l):m(l))||l);return d&&l&&xi(r,o,l),l};let ge=class extends J{constructor(){super(...arguments),this.currentFamily="tag36h11",this.showMenu=!1,this.disabled=!1,this.families=[{id:"tag36h11",label:"tag36h11 (587 tags)"},{id:"tag25h9",label:"tag25h9 (35 tags)"},{id:"tag16h5",label:"tag16h5 (30 tags)"},{id:"tagStandard41h12",label:"tagStandard41h12 (2115 tags)"},{id:"tagStandard52h13",label:"tagStandard52h13 (48714 tags)"},{id:"tagCircle21h7",label:"tagCircle21h7 (38 tags)"},{id:"tagCircle49h12",label:"tagCircle49h12 (65535 tags)"},{id:"tagCustom48h12",label:"tagCustom48h12 (42211 tags)"}],this.handleClick=c=>{c.stopPropagation()},this.handleDocumentClick=c=>{c.composedPath().includes(this)||(this.showMenu=!1)}}render(){const c=this.families.find(o=>o.id===this.currentFamily),r=c?.id||this.currentFamily;return T`
      <div
        class="dropdown ${this.showMenu?"active":""} ${this.disabled?"disabled":""}"
        @click=${this.disabled?void 0:this.toggleMenu}
        title="${this.disabled?"Family selection disabled during recording/playback":c?.label||r}"
      >
        <span class="dropdown-label">${r}</span>
        <span class="dropdown-arrow">▼</span>
      </div>
      <div class="dropdown-menu ${this.showMenu?"active":""}">
        ${this.families.map(o=>T`
            <div
              class="menu-item ${this.currentFamily===o.id?"selected":""}"
              @click=${d=>{d.stopPropagation(),this.selectFamily(o.id)}}
            >
              ${o.label}
            </div>
          `)}
      </div>
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClick),document.addEventListener("click",this.handleDocumentClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this.handleDocumentClick)}toggleMenu(){this.disabled||(this.showMenu=!this.showMenu)}selectFamily(c){c!==this.currentFamily&&this.dispatchEvent(new CustomEvent("family-selected",{detail:{familyId:c},bubbles:!0,composed:!0})),this.showMenu=!1}};ge.styles=Pe`
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
  `;He([U({type:String})],ge.prototype,"currentFamily",2);He([U({type:Boolean})],ge.prototype,"showMenu",2);He([U({type:Boolean})],ge.prototype,"disabled",2);ge=He([Fe("family-selector")],ge);var ki=Object.defineProperty,$i=Object.getOwnPropertyDescriptor,ne=(c,r,o,d)=>{for(var l=d>1?void 0:d?$i(r,o):r,p=c.length-1,m;p>=0;p--)(m=c[p])&&(l=(d?m(r,o,l):m(l))||l);return d&&l&&ki(r,o,l),l};let Y=class extends J{constructor(){super(...arguments),this.detections=[],this.duplicateIds=[],this.showImage=!1,this.coverMode=!0}render(){return T`
      <canvas class="${this.coverMode?"cover-mode":"fill-mode"}"></canvas>
    `}firstUpdated(){this.canvas=this.shadowRoot.querySelector("canvas"),this.ctx=this.canvas.getContext("2d")}updated(c){(c.has("detections")||c.has("duplicateIds")||c.has("imageData")||c.has("showImage")||c.has("videoDimensions")||c.has("coverMode"))&&this.drawCanvas()}drawCanvas(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.showImage&&this.imageData?(this.canvas.width=this.imageData.width,this.canvas.height=this.imageData.height,this.ctx.putImageData(this.imageData,0,0)):this.videoDimensions&&(this.canvas.width=this.videoDimensions.width,this.canvas.height=this.videoDimensions.height),this.drawDetections()}setCanvasDimensions(c,r){this.canvas.width=c,this.canvas.height=r}drawDetections(){if(!this.detections||this.detections.length===0)return;const c=new Set(this.duplicateIds),r=this.calculateViewportRelativeFontSize();this.ctx.font=`bold ${r}px Arial`,this.ctx.textAlign="center";const o=Math.max(1,Math.round(r*.07)),d=Math.max(1.5,Math.round(r*.15)),l=Math.max(1,Math.round(r*.14)),p=Math.max(1,Math.round(r*.07));this.detections.forEach(m=>{const w=m.corners,g=c.has(m.id),$=g?"#ff4444":"#00ffff",I=g?"#ff8800":"#ff00ff",x=g?"#ff4444":"#00ff80",P=g?"#ff4444":"#00ff80";this.ctx.shadowColor=$,this.ctx.shadowBlur=10,this.ctx.strokeStyle=$,this.ctx.lineWidth=o,this.ctx.beginPath(),this.ctx.moveTo(w[0].x,w[0].y);for(let B=1;B<w.length;B++)this.ctx.lineTo(w[B].x,w[B].y);this.ctx.closePath(),this.ctx.stroke(),this.ctx.shadowBlur=0,this.ctx.fillStyle=I,this.ctx.beginPath(),this.ctx.arc(w[0].x,w[0].y,d,0,2*Math.PI),this.ctx.fill();const R=m.center,j=m.id.toString();this.ctx.shadowBlur=0,this.ctx.strokeStyle="#000000",this.ctx.lineWidth=l,this.ctx.strokeText(j,R.x,R.y+10),this.ctx.strokeStyle=$,this.ctx.lineWidth=p,this.ctx.strokeText(j,R.x,R.y+10),this.ctx.shadowColor=P,this.ctx.shadowBlur=5,this.ctx.fillStyle=x,this.ctx.fillText(j,R.x,R.y+10),this.ctx.shadowBlur=0})}calculateViewportRelativeFontSize(){const c=this.canvas.getBoundingClientRect(),r=c.width,o=c.height,d=Math.min(r,o),l=Math.max(12,Math.round(d*.03)),p=this.canvas.width/r,m=this.canvas.height/o,w=(p+m)/2;return Math.round(l*w)}clear(){this.detections=[],this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}};Y.styles=Pe`
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
  `;ne([U({type:Array})],Y.prototype,"detections",2);ne([U({type:Array})],Y.prototype,"duplicateIds",2);ne([U({type:Object})],Y.prototype,"imageData",2);ne([U({type:Boolean})],Y.prototype,"showImage",2);ne([U({type:Object})],Y.prototype,"videoDimensions",2);ne([U({type:Boolean})],Y.prototype,"coverMode",2);Y=ne([Fe("apriltag-detections")],Y);var Ai=Object.defineProperty,Mi=Object.getOwnPropertyDescriptor,ae=(c,r,o,d)=>{for(var l=d>1?void 0:d?Mi(r,o):r,p=c.length-1,m;p>=0;p--)(m=c[p])&&(l=(d?m(r,o,l):m(l))||l);return d&&l&&Ai(r,o,l),l};let Z=class extends J{constructor(){super(...arguments),this.recordMode=!1,this.appMode=y.LIVE,this.availableCameras=[],this.currentCameraId=null,this.coverMode=!0,this.showMenu=!1,this.handleDocumentClick=c=>{c.composedPath().includes(this)||(this.showMenu=!1)}}render(){const c=this.isRecordModeDisabled(),r=this.isCameraSwitchEnabled(),o=this.appMode===y.RECORDING||this.appMode===y.VIEWING_RECORDED,d=this.isCoverModeDisabled();return T`
      <button
        class="menu-button ${this.showMenu?"active":""}"
        @click=${this.toggleMenu}
      >
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>
      <div class="dropdown-menu ${this.showMenu?"active":""}">
        <div
          class="menu-item ${c?"disabled":""}"
          @click=${this.handleMenuItemClick}
        >
          <span>Record Mode</span>
          <div
            class="toggle-switch ${this.recordMode?"active":""} ${c?"disabled":""}"
            @click=${this.handleToggleClick}
            title="${c?"Record mode is disabled while viewing frozen video or images":""}"
          ></div>
        </div>
        <div
          class="menu-item ${d?"disabled":""}"
          @click=${this.handleMenuItemClick}
        >
          <span>${this.coverMode?"Cover":"Contain"} Mode</span>
          <div
            class="toggle-switch ${this.coverMode?"active":""} ${d?"disabled":""}"
            @click=${this.handleCoverModeToggleClick}
            title="${d?"Cover/Contain mode is disabled for recorded tags and uploaded images":this.coverMode?"Switch to contain mode (show full image)":"Switch to cover mode (fill viewport)"}"
          ></div>
        </div>
        ${this.availableCameras.length>1?T`
              <div 
                class="menu-item ${r?"":"disabled"}" 
                @click=${this.handleSwitchCamera}
                title="${r?"Switch camera":"Camera switching is only available in live mode"}"
              >
                <span>Switch Camera</span>
                <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: currentColor;">
                  <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm3-4.5h-2v2l-3-3 3-3v2h2v2z"/>
                </svg>
              </div>
            `:""}
        <div 
          class="menu-item ${o?"disabled":""}" 
          @click=${o?void 0:this.handleSelectImage}
          title="${o?"Image selection disabled during recording/playback":"Select an image file"}"
        >
          <span>Select Image</span>
        </div>
        <div 
          class="menu-item ${o?"disabled":""}" 
          @click=${o?void 0:this.handleViewExample}
          title="${o?"View example disabled during recording/playback":"View example AprilTag image"}"
        >
          <span>View Example</span>
        </div>
        <div 
          class="menu-item" 
          @click=${this.handleWhatAreAprilTags}
          title="Learn about AprilTags"
        >
          <span>What are AprilTags?</span>
        </div>
      </div>
    `}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this.handleDocumentClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this.handleDocumentClick)}toggleMenu(){this.showMenu=!this.showMenu}handleMenuItemClick(c){c.stopPropagation()}isRecordModeDisabled(){return this.appMode===y.PAUSED||this.appMode===y.IMAGE_MODE}isCameraSwitchEnabled(){return this.appMode===y.LIVE||this.appMode===y.RECORDING}isCoverModeDisabled(){return this.appMode===y.VIEWING_RECORDED||this.appMode===y.IMAGE_MODE}handleToggleClick(c){c.stopPropagation(),!this.isRecordModeDisabled()&&(this.recordMode=!this.recordMode,this.dispatchEvent(new CustomEvent("record-mode-changed",{detail:{recordMode:this.recordMode},bubbles:!0,composed:!0})))}handleCoverModeToggleClick(c){c.stopPropagation(),!this.isCoverModeDisabled()&&(this.coverMode=!this.coverMode,this.dispatchEvent(new CustomEvent("cover-mode-changed",{detail:{coverMode:this.coverMode},bubbles:!0,composed:!0})))}handleSwitchCamera(c){if(c.stopPropagation(),!this.isCameraSwitchEnabled())return;this.showMenu=!1;const o=(this.availableCameras.findIndex(l=>l.deviceId===this.currentCameraId)+1)%this.availableCameras.length,d=this.availableCameras[o];this.dispatchEvent(new CustomEvent("camera-switch-requested",{detail:{deviceId:d.deviceId},bubbles:!0,composed:!0}))}handleSelectImage(c){if(c.stopPropagation(),this.appMode===y.RECORDING||this.appMode===y.VIEWING_RECORDED)return;this.showMenu=!1;const r=document.createElement("input");r.type="file",r.accept="image/*",r.style.display="none",r.addEventListener("change",o=>{const d=o.target.files?.[0];d&&this.dispatchEvent(new CustomEvent("image-selected",{detail:{file:d},bubbles:!0,composed:!0})),r.remove()}),document.body.appendChild(r),r.click()}async handleViewExample(c){if(c.stopPropagation(),!(this.appMode===y.RECORDING||this.appMode===y.VIEWING_RECORDED)){this.showMenu=!1;try{const r=await fetch("/sample.jpg");if(!r.ok)throw new Error("Failed to load sample image");const o=await r.blob(),d=new File([o],"sample.jpg",{type:"image/jpeg"});this.dispatchEvent(new CustomEvent("image-selected",{detail:{file:d,familyId:"tagStandard52h13"},bubbles:!0,composed:!0}))}catch(r){console.error("Error loading sample image:",r)}}}handleWhatAreAprilTags(c){c.stopPropagation(),this.showMenu=!1,window.open("https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html","_blank")}};Z.styles=Pe`
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
  `;ae([U({type:Boolean})],Z.prototype,"recordMode",2);ae([U({type:String})],Z.prototype,"appMode",2);ae([U({type:Array})],Z.prototype,"availableCameras",2);ae([U({type:String})],Z.prototype,"currentCameraId",2);ae([U({type:Boolean})],Z.prototype,"coverMode",2);ae([we()],Z.prototype,"showMenu",2);Z=ae([Fe("overflow-menu")],Z);var Si=Object.defineProperty,Di=Object.getOwnPropertyDescriptor,Vt=(c,r,o,d)=>{for(var l=d>1?void 0:d?Di(r,o):r,p=c.length-1,m;p>=0;p--)(m=c[p])&&(l=(d?m(r,o,l):m(l))||l);return d&&l&&Si(r,o,l),l};let je=class extends J{constructor(){super(...arguments),this.tagIds=[]}render(){const c=this.compressTagIds(this.tagIds);return T`
      <div class="header">
        <h2>Recorded Tags</h2>
        ${this.tagIds.length>0?T`<div class="count">
              ${this.tagIds.length} unique
              tag${this.tagIds.length===1?"":"s"} detected
            </div>`:""}
      </div>

      ${this.tagIds.length===0?T`<div class="empty-state">No tags detected during recording</div>`:T`
            <div class="tags-container">
              ${c.map(r=>T`
                  <div class="tag-item ${r.isRange?"range":""}">
                    ${r.display}
                  </div>
                `)}
            </div>
          `}

      <div class="spacer"></div>
      
      <button class="close-button" @click=${this.close}>×</button>
    `}compressTagIds(c){if(c.length===0)return[];const r=[...new Set(c)].sort((p,m)=>p-m),o=[];let d=r[0],l=r[0];for(let p=1;p<r.length;p++)r[p]===l+1||(d===l?o.push({display:d.toString(),isRange:!1}):l===d+1?(o.push({display:d.toString(),isRange:!1}),o.push({display:l.toString(),isRange:!1})):o.push({display:`${d}-${l}`,isRange:!0}),d=r[p]),l=r[p];return d===l?o.push({display:d.toString(),isRange:!1}):l===d+1?(o.push({display:d.toString(),isRange:!1}),o.push({display:l.toString(),isRange:!1})):o.push({display:`${d}-${l}`,isRange:!0}),o}close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}};je.styles=Pe`
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
  `;Vt([U({type:Array})],je.prototype,"tagIds",2);je=Vt([Fe("recorded-tags")],je);var Ii=Object.defineProperty,Pi=Object.getOwnPropertyDescriptor,de=(c,r,o,d)=>{for(var l=d>1?void 0:d?Pi(r,o):r,p=c.length-1,m;p>=0;p--)(m=c[p])&&(l=(d?m(r,o,l):m(l))||l);return d&&l&&Ii(r,o,l),l};let Q=class extends J{constructor(){super(...arguments),this.appMode=y.LIVE,this.currentFamily=localStorage.getItem("selectedFamily")||"tag36h11",this.recordMode=!1,this.captureEnabled=!1,this.coverMode=!0}render(){return T`
      <div class="header">
        <h1>AprilTag Detector</h1>
        <div class="header-controls">
          <family-selector
            .currentFamily=${this.currentFamily}
            .disabled=${this.appMode===y.RECORDING||this.appMode===y.VIEWING_RECORDED}
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

      <div class="status ${this.statusController?.hasMessage?"visible":""}">
        ${this.statusController?.message}
      </div>

      ${(this.detectionController?.duplicateIds?.length??0)>0?T`<div class="duplicate-warning">
            Duplicate marker${this.detectionController.duplicateIds.length>1?"s":""}: ${this.detectionController.duplicateIds.join(", ")}
          </div>`:""}

      <div class="camera-container">
        <div class="video-overlay">
          <video
            class="${this.appMode!==y.LIVE&&this.appMode!==y.RECORDING?"hidden":""} ${this.coverMode?"":"contain-mode"}"
            autoplay
            muted
            playsinline
          ></video>
          <apriltag-detections
            .detections=${this.detectionController?.detections||[]}
            .duplicateIds=${this.detectionController?.duplicateIds||[]}
            .imageData=${this.appMode===y.IMAGE_MODE?this.detectionController?.selectedImage:this.detectionController?.frozenFrame}
            .showImage=${this.appMode===y.PAUSED||this.appMode===y.IMAGE_MODE}
            .videoDimensions=${this.cameraController?.dimensions}
            .coverMode=${this.coverMode}
            style="display: ${this.appMode===y.VIEWING_RECORDED?"none":"block"}"
          ></apriltag-detections>
          ${this.appMode===y.VIEWING_RECORDED?T`
                <recorded-tags
                  .tagIds=${this.recordingController?.tagIds||[]}
                  @close=${this.handleHideRecorded}
                ></recorded-tags>
              `:""}
        </div>
      </div>

      <div class="controls">
        <button
          class="capture-button ${this.captureEnabled&&this.appMode!==y.VIEWING_RECORDED?"enabled":""}"
          @click=${this.handleToggleDetection}
        >
          ${this.getButtonIcon()}
        </button>
      </div>

      <button class="about-button" @click=${this.handleAboutClick}>
        <svg viewBox="0 0 24 24">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
          />
        </svg>
      </button>
    `}async firstUpdated(){this.video=this.shadowRoot.querySelector("video"),await this.updateComplete,await this.init()}async init(){this.detector.init(),this.cameraController=new wi(this),this.detectionController=new bi(this,this.detector,this.currentFamily),this.recordingController=new _i(this),this.statusController=new Ei(this),this.detectionController.setVideo(this.video),this.setupControllerListeners(),this.setupGlobalListeners(),await this.cameraController.initialize(),this.captureEnabled=!0,this.detectionController.setMode(y.LIVE),this.detectionController.startContinuousDetection()}setupControllerListeners(){this.addEventListener("camera-ready",c=>{console.log("Camera ready event received:",c.detail),this.video.srcObject=c.detail.stream,this.video.addEventListener("loadedmetadata",()=>{console.log("Video metadata loaded:",this.video.videoWidth,this.video.videoHeight),this.statusController?.clearMessage(),this.cameraController?.updateDimensions(this.video.videoWidth,this.video.videoHeight),this.requestUpdate()})}),this.addEventListener("camera-error",c=>{this.statusController?.setPersistentMessage(c.detail.message)}),this.addEventListener("status-update",c=>{this.statusController?.setMessage(c.detail.message)}),this.addEventListener("status-clear",()=>{this.statusController?.clearMessage()}),this.addEventListener("detections-updated",c=>{this.recordingController?.isActive&&this.recordingController?.recordDetections(c.detail.detections)}),this.addEventListener("recording-stopped",()=>{this.setAppMode(y.VIEWING_RECORDED)}),this.addEventListener("recording-hidden",()=>{this.setAppMode(y.LIVE)})}setupGlobalListeners(){document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&this.cameraController.stream&&(this.video.srcObject=this.cameraController.stream)})}handleFamilySelected(c){const{familyId:r}=c.detail;this.detectionController&&(this.detectionController.family=r,this.currentFamily=r,localStorage.setItem("selectedFamily",r),this.statusController?.setTemporaryMessage(`Switched to ${r}`,3e3))}handleRecordModeChanged(c){const{recordMode:r}=c.detail;this.recordMode=r,!r&&this.recordingController?.isActive&&this.recordingController.stopRecording()}handleCoverModeChanged(c){const{coverMode:r}=c.detail;this.coverMode=r}handleImageSelected(c){const{file:r,familyId:o}=c.detail;o&&this.detectionController&&(this.detectionController.family=o,this.currentFamily=o,localStorage.setItem("selectedFamily",o),this.statusController?.setTemporaryMessage(`Switched to ${o}`,3e3)),this.detectionController?.loadImageFile(r),this.setAppMode(y.IMAGE_MODE)}handleHideRecorded(){this.recordingController?.hideRecorded()}handleAboutClick(){window.open("https://github.com/rossng/apriltag-mobile","_blank")}handleCameraSwitchRequested(c){const{deviceId:r}=c.detail;this.cameraController&&this.cameraController.switchCamera(r)}handleToggleDetection(){this.appMode===y.IMAGE_MODE?this.setAppMode(y.LIVE):this.recordMode?this.recordingController?.isActive?this.recordingController.stopRecording():(this.recordingController?.startRecording(),this.setAppMode(y.RECORDING)):this.appMode===y.PAUSED?this.setAppMode(y.LIVE):this.setAppMode(y.PAUSED)}setAppMode(c){if(this.appMode!==c){if(!gi(this.appMode,c)){console.warn(`Invalid mode transition from ${this.appMode} to ${c}`);return}if((c===y.PAUSED||c===y.IMAGE_MODE)&&this.recordMode&&(this.recordMode=!1,this.recordingController?.isActive&&this.recordingController.stopRecording()),this.appMode=c,this.detectionController)switch(this.detectionController.setMode(c),c){case y.LIVE:this.detectionController.resumeLiveDetection();break;case y.PAUSED:this.detectionController.freezeCurrentFrame();break;case y.IMAGE_MODE:break;case y.RECORDING:this.detectionController.startContinuousDetection();break;case y.VIEWING_RECORDED:this.detectionController.stopContinuousDetection();break}}}getButtonIcon(){return this.appMode===y.IMAGE_MODE?T`<svg viewBox="0 0 24 24">
        <path
          d="M18 6L6 18M6 6l12 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>`:this.recordMode?this.recordingController?.isActive?T`<svg viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>`:T`<svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="red" />
        </svg>`:this.appMode===y.PAUSED?T`<svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>`:T`<svg viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>`}disconnectedCallback(){super.disconnectedCallback(),this.cameraController?.cleanup()}};Q.styles=Pe`
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
  `;de([U({type:Object})],Q.prototype,"detector",2);de([we()],Q.prototype,"appMode",2);de([we()],Q.prototype,"currentFamily",2);de([we()],Q.prototype,"recordMode",2);de([we()],Q.prototype,"captureEnabled",2);de([we()],Q.prototype,"coverMode",2);Q=de([Fe("apriltag-app")],Q);const Ri="modulepreload",Fi=function(c){return"/apriltag-mobile/pr-preview/pr-2/"+c},Nt={},Ti=function(r,o,d){let l=Promise.resolve();if(o&&o.length>0){document.getElementsByTagName("link");const m=document.querySelector("meta[property=csp-nonce]"),w=m?.nonce||m?.getAttribute("nonce");l=Promise.allSettled(o.map(g=>{if(g=Fi(g),g in Nt)return;Nt[g]=!0;const $=g.endsWith(".css"),I=$?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${I}`))return;const x=document.createElement("link");if(x.rel=$?"stylesheet":Ri,$||(x.as="script"),x.crossOrigin="",x.href=g,w&&x.setAttribute("nonce",w),document.head.appendChild(x),$)return new Promise((P,R)=>{x.addEventListener("load",P),x.addEventListener("error",()=>R(new Error(`Unable to preload CSS for ${g}`)))})}))}function p(m){const w=new Event("vite:preloadError",{cancelable:!0});if(w.payload=m,window.dispatchEvent(w),!w.defaultPrevented)throw m}return l.then(m=>{for(const w of m||[])w.status==="rejected"&&p(w.reason);return r().catch(p)})};async function Oi(c={}){var r,o=c,d=typeof window=="object",l=typeof WorkerGlobalScope<"u",p=typeof process=="object"&&process.versions?.node&&process.type!="renderer";if(p){const{createRequire:e}=await Ti(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]);var m=e(import.meta.url)}var w=(e,t)=>{throw t},g=import.meta.url,$="";function I(e){return o.locateFile?o.locateFile(e,$):$+e}var x,P;if(p){var R=m("fs");g.startsWith("file:")&&($=m("path").dirname(m("url").fileURLToPath(g))+"/"),P=e=>{e=Te(e)?new URL(e):e;var t=R.readFileSync(e);return t},x=async(e,t=!0)=>{e=Te(e)?new URL(e):e;var i=R.readFileSync(e,t?void 0:"utf8");return i},process.argv.length>1&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),w=(e,t)=>{throw process.exitCode=e,t}}else if(d||l){try{$=new URL(".",g).href}catch{}l&&(P=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),x=async e=>{if(Te(e))return new Promise((i,n)=>{var a=new XMLHttpRequest;a.open("GET",e,!0),a.responseType="arraybuffer",a.onload=()=>{if(a.status==200||a.status==0&&a.response){i(a.response);return}n(a.status)},a.onerror=n,a.send(null)});var t=await fetch(e,{credentials:"same-origin"});if(t.ok)return t.arrayBuffer();throw new Error(t.status+" : "+t.url)}}var j=console.log.bind(console),B=console.error.bind(console),ye,We=!1,Te=e=>e.startsWith("file://"),at,dt,Oe,z,be,le,M,V,qe,Ge,X,lt=!1;function ct(){var e=Oe.buffer;z=new Int8Array(e),le=new Int16Array(e),o.HEAPU8=be=new Uint8Array(e),M=new Int32Array(e),V=new Uint32Array(e),qe=new Float32Array(e),Ge=new Float64Array(e),X=new BigInt64Array(e),new BigUint64Array(e)}function Ht(){if(o.preRun)for(typeof o.preRun=="function"&&(o.preRun=[o.preRun]);o.preRun.length;)rr(o.preRun.shift());ut(ft)}function Wt(){lt=!0,!o.noFSInit&&!s.initialized&&s.init(),Ce.n(),s.ignorePermissions=!1}function qt(){if(o.postRun)for(typeof o.postRun=="function"&&(o.postRun=[o.postRun]);o.postRun.length;)tr(o.postRun.shift());ut(pt)}var te=0,_e=null;function ht(e){te++,o.monitorRunDependencies?.(te)}function Xe(e){if(te--,o.monitorRunDependencies?.(te),te==0&&_e){var t=_e;_e=null,t()}}function Ee(e){o.onAbort?.(e),e="Aborted("+e+")",B(e),We=!0,e+=". Build with -sASSERTIONS for more info.";var t=new WebAssembly.RuntimeError(e);throw dt?.(t),t}var Ke;function Gt(){return o.locateFile?I("apriltag_wasm.wasm"):new URL("/apriltag-mobile/pr-preview/pr-2/assets/apriltag_wasm-DZg5XyX8.wasm",import.meta.url).href}function Xt(e){if(e==Ke&&ye)return new Uint8Array(ye);if(P)return P(e);throw"both async and sync fetching of the wasm failed"}async function Kt(e){if(!ye)try{var t=await x(e);return new Uint8Array(t)}catch{}return Xt(e)}async function Jt(e,t){try{var i=await Kt(e),n=await WebAssembly.instantiate(i,t);return n}catch(a){B(`failed to asynchronously prepare wasm: ${a}`),Ee(a)}}async function Yt(e,t,i){if(!e&&typeof WebAssembly.instantiateStreaming=="function"&&!Te(t)&&!p)try{var n=fetch(t,{credentials:"same-origin"}),a=await WebAssembly.instantiateStreaming(n,i);return a}catch(h){B(`wasm streaming compile failed: ${h}`),B("falling back to ArrayBuffer instantiation")}return Jt(t,i)}function Zt(){return{a:Wr}}async function Qt(){function e(h,u){return Ce=h.exports,Oe=Ce.m,ct(),Hr(Ce),Xe(),Ce}ht();function t(h){return e(h.instance)}var i=Zt();if(o.instantiateWasm)return new Promise((h,u)=>{o.instantiateWasm(i,(f,v)=>{h(e(f))})});Ke??=Gt();var n=await Yt(ye,Ke,i),a=t(n);return a}class er{name="ExitStatus";constructor(t){this.message=`Program terminated with exit(${t})`,this.status=t}}var ut=e=>{for(;e.length>0;)e.shift()(o)},pt=[],tr=e=>pt.push(e),ft=[],rr=e=>ft.push(e);function ir(e,t="i8"){switch(t.endsWith("*")&&(t="*"),t){case"i1":return z[e];case"i8":return z[e];case"i16":return le[e>>1];case"i32":return M[e>>2];case"i64":return X[e>>3];case"float":return qe[e>>2];case"double":return Ge[e>>3];case"*":return V[e>>2];default:Ee(`invalid type for getValue: ${t}`)}}var mt=!0;function sr(e,t,i="i8"){switch(i.endsWith("*")&&(i="*"),i){case"i1":z[e]=t;break;case"i8":z[e]=t;break;case"i16":le[e>>1]=t;break;case"i32":M[e>>2]=t;break;case"i64":X[e>>3]=BigInt(t);break;case"float":qe[e>>2]=t;break;case"double":Ge[e>>3]=t;break;case"*":V[e>>2]=t;break;default:Ee(`invalid type for setValue: ${i}`)}}var or=e=>Ct(e),nr=()=>$t(),vt=typeof TextDecoder<"u"?new TextDecoder:void 0,ar=(e,t,i,n)=>{for(var a=t+i;e[t]&&!(t>=a);)++t;return t},ce=(e,t=0,i,n)=>{var a=ar(e,t,i);if(a-t>16&&e.buffer&&vt)return vt.decode(e.subarray(t,a));for(var h="";t<a;){var u=e[t++];if(!(u&128)){h+=String.fromCharCode(u);continue}var f=e[t++]&63;if((u&224)==192){h+=String.fromCharCode((u&31)<<6|f);continue}var v=e[t++]&63;if((u&240)==224?u=(u&15)<<12|f<<6|v:u=(u&7)<<18|f<<12|v<<6|e[t++]&63,u<65536)h+=String.fromCharCode(u);else{var C=u-65536;h+=String.fromCharCode(55296|C>>10,56320|C&1023)}}return h},xe=(e,t,i)=>e?ce(be,e,t):"",dr=(e,t,i,n)=>Ee(`Assertion failed: ${xe(e)}, at: `+[t?xe(t):"unknown filename",i,n?xe(n):"unknown function"]),Ne=()=>{var e=M[+L.varargs>>2];return L.varargs+=4,e},he=Ne,S={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var t=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return t.exec(e).slice(1)},normalizeArray:(e,t)=>{for(var i=0,n=e.length-1;n>=0;n--){var a=e[n];a==="."?e.splice(n,1):a===".."?(e.splice(n,1),i++):i&&(e.splice(n,1),i--)}if(t)for(;i;i--)e.unshift("..");return e},normalize:e=>{var t=S.isAbs(e),i=e.slice(-1)==="/";return e=S.normalizeArray(e.split("/").filter(n=>!!n),!t).join("/"),!e&&!t&&(e="."),e&&i&&(e+="/"),(t?"/":"")+e},dirname:e=>{var t=S.splitPath(e),i=t[0],n=t[1];return!i&&!n?".":(n&&(n=n.slice(0,-1)),i+n)},basename:e=>e&&e.match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>S.normalize(e.join("/")),join2:(e,t)=>S.normalize(e+"/"+t)},lr=()=>{if(p){var e=m("crypto");return t=>e.randomFillSync(t)}return t=>crypto.getRandomValues(t)},gt=e=>{(gt=lr())(e)},ue={resolve:(...e)=>{for(var t="",i=!1,n=e.length-1;n>=-1&&!i;n--){var a=n>=0?e[n]:s.cwd();if(typeof a!="string")throw new TypeError("Arguments to path.resolve must be strings");if(!a)return"";t=a+"/"+t,i=S.isAbs(a)}return t=S.normalizeArray(t.split("/").filter(h=>!!h),!i).join("/"),(i?"/":"")+t||"."},relative:(e,t)=>{e=ue.resolve(e).slice(1),t=ue.resolve(t).slice(1);function i(C){for(var A=0;A<C.length&&C[A]==="";A++);for(var D=C.length-1;D>=0&&C[D]==="";D--);return A>D?[]:C.slice(A,D-A+1)}for(var n=i(e.split("/")),a=i(t.split("/")),h=Math.min(n.length,a.length),u=h,f=0;f<h;f++)if(n[f]!==a[f]){u=f;break}for(var v=[],f=u;f<n.length;f++)v.push("..");return v=v.concat(a.slice(u)),v.join("/")}},Je=[],wt=e=>{for(var t=0,i=0;i<e.length;++i){var n=e.charCodeAt(i);n<=127?t++:n<=2047?t+=2:n>=55296&&n<=57343?(t+=4,++i):t+=3}return t},yt=(e,t,i,n)=>{if(!(n>0))return 0;for(var a=i,h=i+n-1,u=0;u<e.length;++u){var f=e.codePointAt(u);if(f<=127){if(i>=h)break;t[i++]=f}else if(f<=2047){if(i+1>=h)break;t[i++]=192|f>>6,t[i++]=128|f&63}else if(f<=65535){if(i+2>=h)break;t[i++]=224|f>>12,t[i++]=128|f>>6&63,t[i++]=128|f&63}else{if(i+3>=h)break;t[i++]=240|f>>18,t[i++]=128|f>>12&63,t[i++]=128|f>>6&63,t[i++]=128|f&63,u++}}return t[i]=0,i-a},Ye=(e,t,i)=>{var n=wt(e)+1,a=new Array(n),h=yt(e,a,0,a.length);return a.length=h,a},cr=()=>{if(!Je.length){var e=null;if(p){var t=256,i=Buffer.alloc(t),n=0,a=process.stdin.fd;try{n=R.readSync(a,i,0,t)}catch(h){if(h.toString().includes("EOF"))n=0;else throw h}n>0&&(e=i.slice(0,n).toString("utf-8"))}else typeof window<"u"&&typeof window.prompt=="function"&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;Je=Ye(e)}return Je.shift()},re={ttys:[],init(){},shutdown(){},register(e,t){re.ttys[e]={input:[],output:[],ops:t},s.registerDevice(e,re.stream_ops)},stream_ops:{open(e){var t=re.ttys[e.node.rdev];if(!t)throw new s.ErrnoError(43);e.tty=t,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,t,i,n,a){if(!e.tty||!e.tty.ops.get_char)throw new s.ErrnoError(60);for(var h=0,u=0;u<n;u++){var f;try{f=e.tty.ops.get_char(e.tty)}catch{throw new s.ErrnoError(29)}if(f===void 0&&h===0)throw new s.ErrnoError(6);if(f==null)break;h++,t[i+u]=f}return h&&(e.node.atime=Date.now()),h},write(e,t,i,n,a){if(!e.tty||!e.tty.ops.put_char)throw new s.ErrnoError(60);try{for(var h=0;h<n;h++)e.tty.ops.put_char(e.tty,t[i+h])}catch{throw new s.ErrnoError(29)}return n&&(e.node.mtime=e.node.ctime=Date.now()),h}},default_tty_ops:{get_char(e){return cr()},put_char(e,t){t===null||t===10?(j(ce(e.output)),e.output=[]):t!=0&&e.output.push(t)},fsync(e){e.output?.length>0&&(j(ce(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,t,i){return 0},ioctl_tiocgwinsz(e){return[24,80]}},default_tty1_ops:{put_char(e,t){t===null||t===10?(B(ce(e.output)),e.output=[]):t!=0&&e.output.push(t)},fsync(e){e.output?.length>0&&(B(ce(e.output)),e.output=[])}}},bt=e=>{Ee()},E={ops_table:null,mount(e){return E.createNode(null,"/",16895,0)},createNode(e,t,i,n){if(s.isBlkdev(i)||s.isFIFO(i))throw new s.ErrnoError(63);E.ops_table||={dir:{node:{getattr:E.node_ops.getattr,setattr:E.node_ops.setattr,lookup:E.node_ops.lookup,mknod:E.node_ops.mknod,rename:E.node_ops.rename,unlink:E.node_ops.unlink,rmdir:E.node_ops.rmdir,readdir:E.node_ops.readdir,symlink:E.node_ops.symlink},stream:{llseek:E.stream_ops.llseek}},file:{node:{getattr:E.node_ops.getattr,setattr:E.node_ops.setattr},stream:{llseek:E.stream_ops.llseek,read:E.stream_ops.read,write:E.stream_ops.write,mmap:E.stream_ops.mmap,msync:E.stream_ops.msync}},link:{node:{getattr:E.node_ops.getattr,setattr:E.node_ops.setattr,readlink:E.node_ops.readlink},stream:{}},chrdev:{node:{getattr:E.node_ops.getattr,setattr:E.node_ops.setattr},stream:s.chrdev_stream_ops}};var a=s.createNode(e,t,i,n);return s.isDir(a.mode)?(a.node_ops=E.ops_table.dir.node,a.stream_ops=E.ops_table.dir.stream,a.contents={}):s.isFile(a.mode)?(a.node_ops=E.ops_table.file.node,a.stream_ops=E.ops_table.file.stream,a.usedBytes=0,a.contents=null):s.isLink(a.mode)?(a.node_ops=E.ops_table.link.node,a.stream_ops=E.ops_table.link.stream):s.isChrdev(a.mode)&&(a.node_ops=E.ops_table.chrdev.node,a.stream_ops=E.ops_table.chrdev.stream),a.atime=a.mtime=a.ctime=Date.now(),e&&(e.contents[t]=a,e.atime=e.mtime=e.ctime=a.atime),a},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,e.usedBytes):new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,t){var i=e.contents?e.contents.length:0;if(!(i>=t)){var n=1024*1024;t=Math.max(t,i*(i<n?2:1.125)>>>0),i!=0&&(t=Math.max(t,256));var a=e.contents;e.contents=new Uint8Array(t),e.usedBytes>0&&e.contents.set(a.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,t){if(e.usedBytes!=t)if(t==0)e.contents=null,e.usedBytes=0;else{var i=e.contents;e.contents=new Uint8Array(t),i&&e.contents.set(i.subarray(0,Math.min(t,e.usedBytes))),e.usedBytes=t}},node_ops:{getattr(e){var t={};return t.dev=s.isChrdev(e.mode)?e.id:1,t.ino=e.id,t.mode=e.mode,t.nlink=1,t.uid=0,t.gid=0,t.rdev=e.rdev,s.isDir(e.mode)?t.size=4096:s.isFile(e.mode)?t.size=e.usedBytes:s.isLink(e.mode)?t.size=e.link.length:t.size=0,t.atime=new Date(e.atime),t.mtime=new Date(e.mtime),t.ctime=new Date(e.ctime),t.blksize=4096,t.blocks=Math.ceil(t.size/t.blksize),t},setattr(e,t){for(const i of["mode","atime","mtime","ctime"])t[i]!=null&&(e[i]=t[i]);t.size!==void 0&&E.resizeFileStorage(e,t.size)},lookup(e,t){throw E.doesNotExistError||(E.doesNotExistError=new s.ErrnoError(44),E.doesNotExistError.stack="<generic error, no stack>"),E.doesNotExistError},mknod(e,t,i,n){return E.createNode(e,t,i,n)},rename(e,t,i){var n;try{n=s.lookupNode(t,i)}catch{}if(n){if(s.isDir(e.mode))for(var a in n.contents)throw new s.ErrnoError(55);s.hashRemoveNode(n)}delete e.parent.contents[e.name],t.contents[i]=e,e.name=i,t.ctime=t.mtime=e.parent.ctime=e.parent.mtime=Date.now()},unlink(e,t){delete e.contents[t],e.ctime=e.mtime=Date.now()},rmdir(e,t){var i=s.lookupNode(e,t);for(var n in i.contents)throw new s.ErrnoError(55);delete e.contents[t],e.ctime=e.mtime=Date.now()},readdir(e){return[".","..",...Object.keys(e.contents)]},symlink(e,t,i){var n=E.createNode(e,t,41471,0);return n.link=i,n},readlink(e){if(!s.isLink(e.mode))throw new s.ErrnoError(28);return e.link}},stream_ops:{read(e,t,i,n,a){var h=e.node.contents;if(a>=e.node.usedBytes)return 0;var u=Math.min(e.node.usedBytes-a,n);if(u>8&&h.subarray)t.set(h.subarray(a,a+u),i);else for(var f=0;f<u;f++)t[i+f]=h[a+f];return u},write(e,t,i,n,a,h){if(t.buffer===z.buffer&&(h=!1),!n)return 0;var u=e.node;if(u.mtime=u.ctime=Date.now(),t.subarray&&(!u.contents||u.contents.subarray)){if(h)return u.contents=t.subarray(i,i+n),u.usedBytes=n,n;if(u.usedBytes===0&&a===0)return u.contents=t.slice(i,i+n),u.usedBytes=n,n;if(a+n<=u.usedBytes)return u.contents.set(t.subarray(i,i+n),a),n}if(E.expandFileStorage(u,a+n),u.contents.subarray&&t.subarray)u.contents.set(t.subarray(i,i+n),a);else for(var f=0;f<n;f++)u.contents[a+f]=t[i+f];return u.usedBytes=Math.max(u.usedBytes,a+n),n},llseek(e,t,i){var n=t;if(i===1?n+=e.position:i===2&&s.isFile(e.node.mode)&&(n+=e.node.usedBytes),n<0)throw new s.ErrnoError(28);return n},mmap(e,t,i,n,a){if(!s.isFile(e.node.mode))throw new s.ErrnoError(43);var h,u,f=e.node.contents;if(!(a&2)&&f&&f.buffer===z.buffer)u=!1,h=f.byteOffset;else{if(u=!0,h=bt(),!h)throw new s.ErrnoError(48);f&&((i>0||i+t<f.length)&&(f.subarray?f=f.subarray(i,i+t):f=Array.prototype.slice.call(f,i,i+t)),z.set(f,h))}return{ptr:h,allocated:u}},msync(e,t,i,n,a){return E.stream_ops.write(e,t,0,n,i,!1),0}}},hr=async e=>{var t=await x(e);return new Uint8Array(t)},ur=(...e)=>s.createDataFile(...e),_t=[],pr=(e,t,i,n)=>{typeof Browser<"u"&&Browser.init();var a=!1;return _t.forEach(h=>{a||h.canHandle(t)&&(h.handle(e,t,i,n),a=!0)}),a},fr=(e,t,i,n,a,h,u,f,v,C)=>{var A=t?ue.resolve(S.join2(e,t)):e;function D(k){function b(_){C?.(),f||ur(e,t,_,n,a,v),h?.(),Xe()}pr(k,A,b,()=>{u?.(),Xe()})||b(k)}ht(),typeof i=="string"?hr(i).then(D,u):D(i)},mr=e=>{var t={r:0,"r+":2,w:577,"w+":578,a:1089,"a+":1090},i=t[e];if(typeof i>"u")throw new Error(`Unknown file open mode: ${e}`);return i},Ze=(e,t)=>{var i=0;return e&&(i|=365),t&&(i|=146),i},s={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,filesystems:null,syncFSRequests:0,readFiles:{},ErrnoError:class{name="ErrnoError";constructor(e){this.errno=e}},FSStream:class{shared={};get object(){return this.node}set object(e){this.node=e}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(e){this.shared.flags=e}get position(){return this.shared.position}set position(e){this.shared.position=e}},FSNode:class{node_ops={};stream_ops={};readMode=365;writeMode=146;mounted=null;constructor(e,t,i,n){e||(e=this),this.parent=e,this.mount=e.mount,this.id=s.nextInode++,this.name=t,this.mode=i,this.rdev=n,this.atime=this.mtime=this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){e?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){e?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return s.isDir(this.mode)}get isDevice(){return s.isChrdev(this.mode)}},lookupPath(e,t={}){if(!e)throw new s.ErrnoError(44);t.follow_mount??=!0,S.isAbs(e)||(e=s.cwd()+"/"+e);e:for(var i=0;i<40;i++){for(var n=e.split("/").filter(C=>!!C),a=s.root,h="/",u=0;u<n.length;u++){var f=u===n.length-1;if(f&&t.parent)break;if(n[u]!=="."){if(n[u]===".."){if(h=S.dirname(h),s.isRoot(a)){e=h+"/"+n.slice(u+1).join("/"),i--;continue e}else a=a.parent;continue}h=S.join2(h,n[u]);try{a=s.lookupNode(a,n[u])}catch(C){if(C?.errno===44&&f&&t.noent_okay)return{path:h};throw C}if(s.isMountpoint(a)&&(!f||t.follow_mount)&&(a=a.mounted.root),s.isLink(a.mode)&&(!f||t.follow)){if(!a.node_ops.readlink)throw new s.ErrnoError(52);var v=a.node_ops.readlink(a);S.isAbs(v)||(v=S.dirname(h)+"/"+v),e=v+"/"+n.slice(u+1).join("/");continue e}}}return{path:h,node:a}}throw new s.ErrnoError(32)},getPath(e){for(var t;;){if(s.isRoot(e)){var i=e.mount.mountpoint;return t?i[i.length-1]!=="/"?`${i}/${t}`:i+t:i}t=t?`${e.name}/${t}`:e.name,e=e.parent}},hashName(e,t){for(var i=0,n=0;n<t.length;n++)i=(i<<5)-i+t.charCodeAt(n)|0;return(e+i>>>0)%s.nameTable.length},hashAddNode(e){var t=s.hashName(e.parent.id,e.name);e.name_next=s.nameTable[t],s.nameTable[t]=e},hashRemoveNode(e){var t=s.hashName(e.parent.id,e.name);if(s.nameTable[t]===e)s.nameTable[t]=e.name_next;else for(var i=s.nameTable[t];i;){if(i.name_next===e){i.name_next=e.name_next;break}i=i.name_next}},lookupNode(e,t){var i=s.mayLookup(e);if(i)throw new s.ErrnoError(i);for(var n=s.hashName(e.id,t),a=s.nameTable[n];a;a=a.name_next){var h=a.name;if(a.parent.id===e.id&&h===t)return a}return s.lookup(e,t)},createNode(e,t,i,n){var a=new s.FSNode(e,t,i,n);return s.hashAddNode(a),a},destroyNode(e){s.hashRemoveNode(e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},isFile(e){return(e&61440)===32768},isDir(e){return(e&61440)===16384},isLink(e){return(e&61440)===40960},isChrdev(e){return(e&61440)===8192},isBlkdev(e){return(e&61440)===24576},isFIFO(e){return(e&61440)===4096},isSocket(e){return(e&49152)===49152},flagsToPermissionString(e){var t=["r","w","rw"][e&3];return e&512&&(t+="w"),t},nodePermissions(e,t){return s.ignorePermissions?0:t.includes("r")&&!(e.mode&292)||t.includes("w")&&!(e.mode&146)||t.includes("x")&&!(e.mode&73)?2:0},mayLookup(e){if(!s.isDir(e.mode))return 54;var t=s.nodePermissions(e,"x");return t||(e.node_ops.lookup?0:2)},mayCreate(e,t){if(!s.isDir(e.mode))return 54;try{var i=s.lookupNode(e,t);return 20}catch{}return s.nodePermissions(e,"wx")},mayDelete(e,t,i){var n;try{n=s.lookupNode(e,t)}catch(h){return h.errno}var a=s.nodePermissions(e,"wx");if(a)return a;if(i){if(!s.isDir(n.mode))return 54;if(s.isRoot(n)||s.getPath(n)===s.cwd())return 10}else if(s.isDir(n.mode))return 31;return 0},mayOpen(e,t){return e?s.isLink(e.mode)?32:s.isDir(e.mode)&&(s.flagsToPermissionString(t)!=="r"||t&576)?31:s.nodePermissions(e,s.flagsToPermissionString(t)):44},checkOpExists(e,t){if(!e)throw new s.ErrnoError(t);return e},MAX_OPEN_FDS:4096,nextfd(){for(var e=0;e<=s.MAX_OPEN_FDS;e++)if(!s.streams[e])return e;throw new s.ErrnoError(33)},getStreamChecked(e){var t=s.getStream(e);if(!t)throw new s.ErrnoError(8);return t},getStream:e=>s.streams[e],createStream(e,t=-1){return e=Object.assign(new s.FSStream,e),t==-1&&(t=s.nextfd()),e.fd=t,s.streams[t]=e,e},closeStream(e){s.streams[e]=null},dupStream(e,t=-1){var i=s.createStream(e,t);return i.stream_ops?.dup?.(i),i},doSetAttr(e,t,i){var n=e?.stream_ops.setattr,a=n?e:t;n??=t.node_ops.setattr,s.checkOpExists(n,63),n(a,i)},chrdev_stream_ops:{open(e){var t=s.getDevice(e.node.rdev);e.stream_ops=t.stream_ops,e.stream_ops.open?.(e)},llseek(){throw new s.ErrnoError(70)}},major:e=>e>>8,minor:e=>e&255,makedev:(e,t)=>e<<8|t,registerDevice(e,t){s.devices[e]={stream_ops:t}},getDevice:e=>s.devices[e],getMounts(e){for(var t=[],i=[e];i.length;){var n=i.pop();t.push(n),i.push(...n.mounts)}return t},syncfs(e,t){typeof e=="function"&&(t=e,e=!1),s.syncFSRequests++,s.syncFSRequests>1&&B(`warning: ${s.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);var i=s.getMounts(s.root.mount),n=0;function a(u){return s.syncFSRequests--,t(u)}function h(u){if(u)return h.errored?void 0:(h.errored=!0,a(u));++n>=i.length&&a(null)}i.forEach(u=>{if(!u.type.syncfs)return h(null);u.type.syncfs(u,e,h)})},mount(e,t,i){var n=i==="/",a=!i,h;if(n&&s.root)throw new s.ErrnoError(10);if(!n&&!a){var u=s.lookupPath(i,{follow_mount:!1});if(i=u.path,h=u.node,s.isMountpoint(h))throw new s.ErrnoError(10);if(!s.isDir(h.mode))throw new s.ErrnoError(54)}var f={type:e,opts:t,mountpoint:i,mounts:[]},v=e.mount(f);return v.mount=f,f.root=v,n?s.root=v:h&&(h.mounted=f,h.mount&&h.mount.mounts.push(f)),v},unmount(e){var t=s.lookupPath(e,{follow_mount:!1});if(!s.isMountpoint(t.node))throw new s.ErrnoError(28);var i=t.node,n=i.mounted,a=s.getMounts(n);Object.keys(s.nameTable).forEach(u=>{for(var f=s.nameTable[u];f;){var v=f.name_next;a.includes(f.mount)&&s.destroyNode(f),f=v}}),i.mounted=null;var h=i.mount.mounts.indexOf(n);i.mount.mounts.splice(h,1)},lookup(e,t){return e.node_ops.lookup(e,t)},mknod(e,t,i){var n=s.lookupPath(e,{parent:!0}),a=n.node,h=S.basename(e);if(!h)throw new s.ErrnoError(28);if(h==="."||h==="..")throw new s.ErrnoError(20);var u=s.mayCreate(a,h);if(u)throw new s.ErrnoError(u);if(!a.node_ops.mknod)throw new s.ErrnoError(63);return a.node_ops.mknod(a,h,t,i)},statfs(e){return s.statfsNode(s.lookupPath(e,{follow:!0}).node)},statfsStream(e){return s.statfsNode(e.node)},statfsNode(e){var t={bsize:4096,frsize:4096,blocks:1e6,bfree:5e5,bavail:5e5,files:s.nextInode,ffree:s.nextInode-1,fsid:42,flags:2,namelen:255};return e.node_ops.statfs&&Object.assign(t,e.node_ops.statfs(e.mount.opts.root)),t},create(e,t=438){return t&=4095,t|=32768,s.mknod(e,t,0)},mkdir(e,t=511){return t&=1023,t|=16384,s.mknod(e,t,0)},mkdirTree(e,t){var i=e.split("/"),n="";for(var a of i)if(a){(n||S.isAbs(e))&&(n+="/"),n+=a;try{s.mkdir(n,t)}catch(h){if(h.errno!=20)throw h}}},mkdev(e,t,i){return typeof i>"u"&&(i=t,t=438),t|=8192,s.mknod(e,t,i)},symlink(e,t){if(!ue.resolve(e))throw new s.ErrnoError(44);var i=s.lookupPath(t,{parent:!0}),n=i.node;if(!n)throw new s.ErrnoError(44);var a=S.basename(t),h=s.mayCreate(n,a);if(h)throw new s.ErrnoError(h);if(!n.node_ops.symlink)throw new s.ErrnoError(63);return n.node_ops.symlink(n,a,e)},rename(e,t){var i=S.dirname(e),n=S.dirname(t),a=S.basename(e),h=S.basename(t),u,f,v;if(u=s.lookupPath(e,{parent:!0}),f=u.node,u=s.lookupPath(t,{parent:!0}),v=u.node,!f||!v)throw new s.ErrnoError(44);if(f.mount!==v.mount)throw new s.ErrnoError(75);var C=s.lookupNode(f,a),A=ue.relative(e,n);if(A.charAt(0)!==".")throw new s.ErrnoError(28);if(A=ue.relative(t,i),A.charAt(0)!==".")throw new s.ErrnoError(55);var D;try{D=s.lookupNode(v,h)}catch{}if(C!==D){var k=s.isDir(C.mode),b=s.mayDelete(f,a,k);if(b)throw new s.ErrnoError(b);if(b=D?s.mayDelete(v,h,k):s.mayCreate(v,h),b)throw new s.ErrnoError(b);if(!f.node_ops.rename)throw new s.ErrnoError(63);if(s.isMountpoint(C)||D&&s.isMountpoint(D))throw new s.ErrnoError(10);if(v!==f&&(b=s.nodePermissions(f,"w"),b))throw new s.ErrnoError(b);s.hashRemoveNode(C);try{f.node_ops.rename(C,v,h),C.parent=v}catch(_){throw _}finally{s.hashAddNode(C)}}},rmdir(e){var t=s.lookupPath(e,{parent:!0}),i=t.node,n=S.basename(e),a=s.lookupNode(i,n),h=s.mayDelete(i,n,!0);if(h)throw new s.ErrnoError(h);if(!i.node_ops.rmdir)throw new s.ErrnoError(63);if(s.isMountpoint(a))throw new s.ErrnoError(10);i.node_ops.rmdir(i,n),s.destroyNode(a)},readdir(e){var t=s.lookupPath(e,{follow:!0}),i=t.node,n=s.checkOpExists(i.node_ops.readdir,54);return n(i)},unlink(e){var t=s.lookupPath(e,{parent:!0}),i=t.node;if(!i)throw new s.ErrnoError(44);var n=S.basename(e),a=s.lookupNode(i,n),h=s.mayDelete(i,n,!1);if(h)throw new s.ErrnoError(h);if(!i.node_ops.unlink)throw new s.ErrnoError(63);if(s.isMountpoint(a))throw new s.ErrnoError(10);i.node_ops.unlink(i,n),s.destroyNode(a)},readlink(e){var t=s.lookupPath(e),i=t.node;if(!i)throw new s.ErrnoError(44);if(!i.node_ops.readlink)throw new s.ErrnoError(28);return i.node_ops.readlink(i)},stat(e,t){var i=s.lookupPath(e,{follow:!t}),n=i.node,a=s.checkOpExists(n.node_ops.getattr,63);return a(n)},fstat(e){var t=s.getStreamChecked(e),i=t.node,n=t.stream_ops.getattr,a=n?t:i;return n??=i.node_ops.getattr,s.checkOpExists(n,63),n(a)},lstat(e){return s.stat(e,!0)},doChmod(e,t,i,n){s.doSetAttr(e,t,{mode:i&4095|t.mode&-4096,ctime:Date.now(),dontFollow:n})},chmod(e,t,i){var n;if(typeof e=="string"){var a=s.lookupPath(e,{follow:!i});n=a.node}else n=e;s.doChmod(null,n,t,i)},lchmod(e,t){s.chmod(e,t,!0)},fchmod(e,t){var i=s.getStreamChecked(e);s.doChmod(i,i.node,t,!1)},doChown(e,t,i){s.doSetAttr(e,t,{timestamp:Date.now(),dontFollow:i})},chown(e,t,i,n){var a;if(typeof e=="string"){var h=s.lookupPath(e,{follow:!n});a=h.node}else a=e;s.doChown(null,a,n)},lchown(e,t,i){s.chown(e,t,i,!0)},fchown(e,t,i){var n=s.getStreamChecked(e);s.doChown(n,n.node,!1)},doTruncate(e,t,i){if(s.isDir(t.mode))throw new s.ErrnoError(31);if(!s.isFile(t.mode))throw new s.ErrnoError(28);var n=s.nodePermissions(t,"w");if(n)throw new s.ErrnoError(n);s.doSetAttr(e,t,{size:i,timestamp:Date.now()})},truncate(e,t){if(t<0)throw new s.ErrnoError(28);var i;if(typeof e=="string"){var n=s.lookupPath(e,{follow:!0});i=n.node}else i=e;s.doTruncate(null,i,t)},ftruncate(e,t){var i=s.getStreamChecked(e);if(t<0||!(i.flags&2097155))throw new s.ErrnoError(28);s.doTruncate(i,i.node,t)},utime(e,t,i){var n=s.lookupPath(e,{follow:!0}),a=n.node,h=s.checkOpExists(a.node_ops.setattr,63);h(a,{atime:t,mtime:i})},open(e,t,i=438){if(e==="")throw new s.ErrnoError(44);t=typeof t=="string"?mr(t):t,t&64?i=i&4095|32768:i=0;var n,a;if(typeof e=="object")n=e;else{a=e.endsWith("/");var h=s.lookupPath(e,{follow:!(t&131072),noent_okay:!0});n=h.node,e=h.path}var u=!1;if(t&64)if(n){if(t&128)throw new s.ErrnoError(20)}else{if(a)throw new s.ErrnoError(31);n=s.mknod(e,i|511,0),u=!0}if(!n)throw new s.ErrnoError(44);if(s.isChrdev(n.mode)&&(t&=-513),t&65536&&!s.isDir(n.mode))throw new s.ErrnoError(54);if(!u){var f=s.mayOpen(n,t);if(f)throw new s.ErrnoError(f)}t&512&&!u&&s.truncate(n,0),t&=-131713;var v=s.createStream({node:n,path:s.getPath(n),flags:t,seekable:!0,position:0,stream_ops:n.stream_ops,ungotten:[],error:!1});return v.stream_ops.open&&v.stream_ops.open(v),u&&s.chmod(n,i&511),o.logReadFiles&&!(t&1)&&(e in s.readFiles||(s.readFiles[e]=1)),v},close(e){if(s.isClosed(e))throw new s.ErrnoError(8);e.getdents&&(e.getdents=null);try{e.stream_ops.close&&e.stream_ops.close(e)}catch(t){throw t}finally{s.closeStream(e.fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,t,i){if(s.isClosed(e))throw new s.ErrnoError(8);if(!e.seekable||!e.stream_ops.llseek)throw new s.ErrnoError(70);if(i!=0&&i!=1&&i!=2)throw new s.ErrnoError(28);return e.position=e.stream_ops.llseek(e,t,i),e.ungotten=[],e.position},read(e,t,i,n,a){if(n<0||a<0)throw new s.ErrnoError(28);if(s.isClosed(e))throw new s.ErrnoError(8);if((e.flags&2097155)===1)throw new s.ErrnoError(8);if(s.isDir(e.node.mode))throw new s.ErrnoError(31);if(!e.stream_ops.read)throw new s.ErrnoError(28);var h=typeof a<"u";if(!h)a=e.position;else if(!e.seekable)throw new s.ErrnoError(70);var u=e.stream_ops.read(e,t,i,n,a);return h||(e.position+=u),u},write(e,t,i,n,a,h){if(n<0||a<0)throw new s.ErrnoError(28);if(s.isClosed(e))throw new s.ErrnoError(8);if(!(e.flags&2097155))throw new s.ErrnoError(8);if(s.isDir(e.node.mode))throw new s.ErrnoError(31);if(!e.stream_ops.write)throw new s.ErrnoError(28);e.seekable&&e.flags&1024&&s.llseek(e,0,2);var u=typeof a<"u";if(!u)a=e.position;else if(!e.seekable)throw new s.ErrnoError(70);var f=e.stream_ops.write(e,t,i,n,a,h);return u||(e.position+=f),f},mmap(e,t,i,n,a){if(n&2&&!(a&2)&&(e.flags&2097155)!==2)throw new s.ErrnoError(2);if((e.flags&2097155)===1)throw new s.ErrnoError(2);if(!e.stream_ops.mmap)throw new s.ErrnoError(43);if(!t)throw new s.ErrnoError(28);return e.stream_ops.mmap(e,t,i,n,a)},msync(e,t,i,n,a){return e.stream_ops.msync?e.stream_ops.msync(e,t,i,n,a):0},ioctl(e,t,i){if(!e.stream_ops.ioctl)throw new s.ErrnoError(59);return e.stream_ops.ioctl(e,t,i)},readFile(e,t={}){if(t.flags=t.flags||0,t.encoding=t.encoding||"binary",t.encoding!=="utf8"&&t.encoding!=="binary")throw new Error(`Invalid encoding type "${t.encoding}"`);var i=s.open(e,t.flags),n=s.stat(e),a=n.size,h=new Uint8Array(a);return s.read(i,h,0,a,0),t.encoding==="utf8"&&(h=ce(h)),s.close(i),h},writeFile(e,t,i={}){i.flags=i.flags||577;var n=s.open(e,i.flags,i.mode);if(typeof t=="string"&&(t=new Uint8Array(Ye(t))),ArrayBuffer.isView(t))s.write(n,t,0,t.byteLength,void 0,i.canOwn);else throw new Error("Unsupported data type");s.close(n)},cwd:()=>s.currentPath,chdir(e){var t=s.lookupPath(e,{follow:!0});if(t.node===null)throw new s.ErrnoError(44);if(!s.isDir(t.node.mode))throw new s.ErrnoError(54);var i=s.nodePermissions(t.node,"x");if(i)throw new s.ErrnoError(i);s.currentPath=t.path},createDefaultDirectories(){s.mkdir("/tmp"),s.mkdir("/home"),s.mkdir("/home/web_user")},createDefaultDevices(){s.mkdir("/dev"),s.registerDevice(s.makedev(1,3),{read:()=>0,write:(n,a,h,u,f)=>u,llseek:()=>0}),s.mkdev("/dev/null",s.makedev(1,3)),re.register(s.makedev(5,0),re.default_tty_ops),re.register(s.makedev(6,0),re.default_tty1_ops),s.mkdev("/dev/tty",s.makedev(5,0)),s.mkdev("/dev/tty1",s.makedev(6,0));var e=new Uint8Array(1024),t=0,i=()=>(t===0&&(gt(e),t=e.byteLength),e[--t]);s.createDevice("/dev","random",i),s.createDevice("/dev","urandom",i),s.mkdir("/dev/shm"),s.mkdir("/dev/shm/tmp")},createSpecialDirectories(){s.mkdir("/proc");var e=s.mkdir("/proc/self");s.mkdir("/proc/self/fd"),s.mount({mount(){var t=s.createNode(e,"fd",16895,73);return t.stream_ops={llseek:E.stream_ops.llseek},t.node_ops={lookup(i,n){var a=+n,h=s.getStreamChecked(a),u={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>h.path},id:a+1};return u.parent=u,u},readdir(){return Array.from(s.streams.entries()).filter(([i,n])=>n).map(([i,n])=>i.toString())}},t}},{},"/proc/self/fd")},createStandardStreams(e,t,i){e?s.createDevice("/dev","stdin",e):s.symlink("/dev/tty","/dev/stdin"),t?s.createDevice("/dev","stdout",null,t):s.symlink("/dev/tty","/dev/stdout"),i?s.createDevice("/dev","stderr",null,i):s.symlink("/dev/tty1","/dev/stderr"),s.open("/dev/stdin",0),s.open("/dev/stdout",1),s.open("/dev/stderr",1)},staticInit(){s.nameTable=new Array(4096),s.mount(E,{},"/"),s.createDefaultDirectories(),s.createDefaultDevices(),s.createSpecialDirectories(),s.filesystems={MEMFS:E}},init(e,t,i){s.initialized=!0,e??=o.stdin,t??=o.stdout,i??=o.stderr,s.createStandardStreams(e,t,i)},quit(){s.initialized=!1;for(var e of s.streams)e&&s.close(e)},findObject(e,t){var i=s.analyzePath(e,t);return i.exists?i.object:null},analyzePath(e,t){try{var i=s.lookupPath(e,{follow:!t});e=i.path}catch{}var n={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,parentExists:!1,parentPath:null,parentObject:null};try{var i=s.lookupPath(e,{parent:!0});n.parentExists=!0,n.parentPath=i.path,n.parentObject=i.node,n.name=S.basename(e),i=s.lookupPath(e,{follow:!t}),n.exists=!0,n.path=i.path,n.object=i.node,n.name=i.node.name,n.isRoot=i.path==="/"}catch(a){n.error=a.errno}return n},createPath(e,t,i,n){e=typeof e=="string"?e:s.getPath(e);for(var a=t.split("/").reverse();a.length;){var h=a.pop();if(h){var u=S.join2(e,h);try{s.mkdir(u)}catch(f){if(f.errno!=20)throw f}e=u}}return u},createFile(e,t,i,n,a){var h=S.join2(typeof e=="string"?e:s.getPath(e),t),u=Ze(n,a);return s.create(h,u)},createDataFile(e,t,i,n,a,h){var u=t;e&&(e=typeof e=="string"?e:s.getPath(e),u=t?S.join2(e,t):e);var f=Ze(n,a),v=s.create(u,f);if(i){if(typeof i=="string"){for(var C=new Array(i.length),A=0,D=i.length;A<D;++A)C[A]=i.charCodeAt(A);i=C}s.chmod(v,f|146);var k=s.open(v,577);s.write(k,i,0,i.length,0,h),s.close(k),s.chmod(v,f)}},createDevice(e,t,i,n){var a=S.join2(typeof e=="string"?e:s.getPath(e),t),h=Ze(!!i,!!n);s.createDevice.major??=64;var u=s.makedev(s.createDevice.major++,0);return s.registerDevice(u,{open(f){f.seekable=!1},close(f){n?.buffer?.length&&n(10)},read(f,v,C,A,D){for(var k=0,b=0;b<A;b++){var _;try{_=i()}catch{throw new s.ErrnoError(29)}if(_===void 0&&k===0)throw new s.ErrnoError(6);if(_==null)break;k++,v[C+b]=_}return k&&(f.node.atime=Date.now()),k},write(f,v,C,A,D){for(var k=0;k<A;k++)try{n(v[C+k])}catch{throw new s.ErrnoError(29)}return A&&(f.node.mtime=f.node.ctime=Date.now()),k}}),s.mkdev(a,h,u)},forceLoadFile(e){if(e.isDevice||e.isFolder||e.link||e.contents)return!0;if(typeof XMLHttpRequest<"u")throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");try{e.contents=P(e.url),e.usedBytes=e.contents.length}catch{throw new s.ErrnoError(29)}},createLazyFile(e,t,i,n,a){class h{lengthKnown=!1;chunks=[];get(b){if(!(b>this.length-1||b<0)){var _=b%this.chunkSize,F=b/this.chunkSize|0;return this.getter(F)[_]}}setDataGetter(b){this.getter=b}cacheLength(){var b=new XMLHttpRequest;if(b.open("HEAD",i,!1),b.send(null),!(b.status>=200&&b.status<300||b.status===304))throw new Error("Couldn't load "+i+". Status: "+b.status);var _=Number(b.getResponseHeader("Content-length")),F,K=(F=b.getResponseHeader("Accept-Ranges"))&&F==="bytes",H=(F=b.getResponseHeader("Content-Encoding"))&&F==="gzip",W=1024*1024;K||(W=_);var q=(G,pe)=>{if(G>pe)throw new Error("invalid range ("+G+", "+pe+") or no bytes requested!");if(pe>_-1)throw new Error("only "+_+" bytes available! programmer error!");var N=new XMLHttpRequest;if(N.open("GET",i,!1),_!==W&&N.setRequestHeader("Range","bytes="+G+"-"+pe),N.responseType="arraybuffer",N.overrideMimeType&&N.overrideMimeType("text/plain; charset=x-user-defined"),N.send(null),!(N.status>=200&&N.status<300||N.status===304))throw new Error("Couldn't load "+i+". Status: "+N.status);return N.response!==void 0?new Uint8Array(N.response||[]):Ye(N.responseText||"")},ke=this;ke.setDataGetter(G=>{var pe=G*W,N=(G+1)*W-1;if(N=Math.min(N,_-1),typeof ke.chunks[G]>"u"&&(ke.chunks[G]=q(pe,N)),typeof ke.chunks[G]>"u")throw new Error("doXHR failed!");return ke.chunks[G]}),(H||!_)&&(W=_=1,_=this.getter(0).length,W=_,j("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=_,this._chunkSize=W,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){return this.lengthKnown||this.cacheLength(),this._chunkSize}}if(typeof XMLHttpRequest<"u"){if(!l)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var u=new h,f={isDevice:!1,contents:u}}else var f={isDevice:!1,url:i};var v=s.createFile(e,t,f,n,a);f.contents?v.contents=f.contents:f.url&&(v.contents=null,v.url=f.url),Object.defineProperties(v,{usedBytes:{get:function(){return this.contents.length}}});var C={},A=Object.keys(v.stream_ops);A.forEach(k=>{var b=v.stream_ops[k];C[k]=(..._)=>(s.forceLoadFile(v),b(..._))});function D(k,b,_,F,K){var H=k.node.contents;if(K>=H.length)return 0;var W=Math.min(H.length-K,F);if(H.slice)for(var q=0;q<W;q++)b[_+q]=H[K+q];else for(var q=0;q<W;q++)b[_+q]=H.get(K+q);return W}return C.read=(k,b,_,F,K)=>(s.forceLoadFile(v),D(k,b,_,F,K)),C.mmap=(k,b,_,F,K)=>{s.forceLoadFile(v);var H=bt();if(!H)throw new s.ErrnoError(48);return D(k,z,H,b,_),{ptr:H,allocated:!0}},v.stream_ops=C,v}},L={DEFAULT_POLLMASK:5,calculateAt(e,t,i){if(S.isAbs(t))return t;var n;if(e===-100)n=s.cwd();else{var a=L.getStreamFromFD(e);n=a.path}if(t.length==0){if(!i)throw new s.ErrnoError(44);return n}return n+"/"+t},writeStat(e,t){M[e>>2]=t.dev,M[e+4>>2]=t.mode,V[e+8>>2]=t.nlink,M[e+12>>2]=t.uid,M[e+16>>2]=t.gid,M[e+20>>2]=t.rdev,X[e+24>>3]=BigInt(t.size),M[e+32>>2]=4096,M[e+36>>2]=t.blocks;var i=t.atime.getTime(),n=t.mtime.getTime(),a=t.ctime.getTime();return X[e+40>>3]=BigInt(Math.floor(i/1e3)),V[e+48>>2]=i%1e3*1e3*1e3,X[e+56>>3]=BigInt(Math.floor(n/1e3)),V[e+64>>2]=n%1e3*1e3*1e3,X[e+72>>3]=BigInt(Math.floor(a/1e3)),V[e+80>>2]=a%1e3*1e3*1e3,X[e+88>>3]=BigInt(t.ino),0},writeStatFs(e,t){M[e+4>>2]=t.bsize,M[e+40>>2]=t.bsize,M[e+8>>2]=t.blocks,M[e+12>>2]=t.bfree,M[e+16>>2]=t.bavail,M[e+20>>2]=t.files,M[e+24>>2]=t.ffree,M[e+28>>2]=t.fsid,M[e+44>>2]=t.flags,M[e+36>>2]=t.namelen},doMsync(e,t,i,n,a){if(!s.isFile(t.node.mode))throw new s.ErrnoError(43);if(n&2)return 0;var h=be.slice(e,e+i);s.msync(t,h,a,i,n)},getStreamFromFD(e){var t=s.getStreamChecked(e);return t},varargs:void 0,getStr(e){var t=xe(e);return t}};function vr(e,t,i){L.varargs=i;try{var n=L.getStreamFromFD(e);switch(t){case 0:{var a=Ne();if(a<0)return-28;for(;s.streams[a];)a++;var h;return h=s.dupStream(n,a),h.fd}case 1:case 2:return 0;case 3:return n.flags;case 4:{var a=Ne();return n.flags|=a,0}case 12:{var a=he(),u=0;return le[a+u>>1]=2,0}case 13:case 14:return 0}return-28}catch(f){if(typeof s>"u"||f.name!=="ErrnoError")throw f;return-f.errno}}function gr(e,t,i){L.varargs=i;try{var n=L.getStreamFromFD(e);switch(t){case 21509:return n.tty?0:-59;case 21505:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcgets){var a=n.tty.ops.ioctl_tcgets(n),h=he();M[h>>2]=a.c_iflag||0,M[h+4>>2]=a.c_oflag||0,M[h+8>>2]=a.c_cflag||0,M[h+12>>2]=a.c_lflag||0;for(var u=0;u<32;u++)z[h+u+17]=a.c_cc[u]||0;return 0}return 0}case 21510:case 21511:case 21512:return n.tty?0:-59;case 21506:case 21507:case 21508:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcsets){for(var h=he(),f=M[h>>2],v=M[h+4>>2],C=M[h+8>>2],A=M[h+12>>2],D=[],u=0;u<32;u++)D.push(z[h+u+17]);return n.tty.ops.ioctl_tcsets(n.tty,t,{c_iflag:f,c_oflag:v,c_cflag:C,c_lflag:A,c_cc:D})}return 0}case 21519:{if(!n.tty)return-59;var h=he();return M[h>>2]=0,0}case 21520:return n.tty?-28:-59;case 21537:case 21531:{var h=he();return s.ioctl(n,t,h)}case 21523:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tiocgwinsz){var k=n.tty.ops.ioctl_tiocgwinsz(n.tty),h=he();le[h>>1]=k[0],le[h+2>>1]=k[1]}return 0}case 21524:return n.tty?0:-59;case 21515:return n.tty?0:-59;default:return-28}}catch(b){if(typeof s>"u"||b.name!=="ErrnoError")throw b;return-b.errno}}function wr(e,t,i,n){L.varargs=n;try{t=L.getStr(t),t=L.calculateAt(e,t);var a=n?Ne():0;return s.open(t,i,a).fd}catch(h){if(typeof s>"u"||h.name!=="ErrnoError")throw h;return-h.errno}}var yr=()=>Date.now(),br=()=>performance.now(),_r=()=>2147483648,Er=(e,t)=>Math.ceil(e/t)*t,xr=e=>{var t=Oe.buffer.byteLength,i=(e-t+65535)/65536|0;try{return Oe.grow(i),ct(),1}catch{}},Cr=e=>{var t=be.length;e>>>=0;var i=_r();if(e>i)return!1;for(var n=1;n<=4;n*=2){var a=t*(1+.2/n);a=Math.min(a,e+100663296);var h=Math.min(i,Er(Math.max(e,a),65536)),u=xr(h);if(u)return!0}return!1},kr=0,$r=()=>mt||kr>0,Ar=e=>{$r()||(o.onExit?.(e),We=!0),w(e,new er(e))},Mr=(e,t)=>{Ar(e)},Sr=Mr;function Dr(e){try{var t=L.getStreamFromFD(e);return s.close(t),0}catch(i){if(typeof s>"u"||i.name!=="ErrnoError")throw i;return i.errno}}var Ir=(e,t,i,n)=>{for(var a=0,h=0;h<i;h++){var u=V[t>>2],f=V[t+4>>2];t+=8;var v=s.read(e,z,u,f,n);if(v<0)return-1;if(a+=v,v<f)break}return a};function Pr(e,t,i,n){try{var a=L.getStreamFromFD(e),h=Ir(a,t,i);return V[n>>2]=h,0}catch(u){if(typeof s>"u"||u.name!=="ErrnoError")throw u;return u.errno}}var Rr=9007199254740992,Fr=-9007199254740992,Tr=e=>e<Fr||e>Rr?NaN:Number(e);function Or(e,t,i,n){t=Tr(t);try{if(isNaN(t))return 61;var a=L.getStreamFromFD(e);return s.llseek(a,t,i),X[n>>3]=BigInt(a.position),a.getdents&&t===0&&i===0&&(a.getdents=null),0}catch(h){if(typeof s>"u"||h.name!=="ErrnoError")throw h;return h.errno}}var Nr=(e,t,i,n)=>{for(var a=0,h=0;h<i;h++){var u=V[t>>2],f=V[t+4>>2];t+=8;var v=s.write(e,z,u,f,n);if(v<0)return-1;if(a+=v,v<f)break}return a};function Ur(e,t,i,n){try{var a=L.getStreamFromFD(e),h=Nr(a,t,i);return V[n>>2]=h,0}catch(u){if(typeof s>"u"||u.name!=="ErrnoError")throw u;return u.errno}}var Et=e=>{var t=o["_"+e];return t},zr=(e,t)=>{z.set(e,t)},Lr=(e,t,i)=>yt(e,be,t,i),xt=e=>kt(e),jr=e=>{var t=wt(e)+1,i=xt(t);return Lr(e,i,t),i},Br=(e,t,i,n,a)=>{var h={string:_=>{var F=0;return _!=null&&_!==0&&(F=jr(_)),F},array:_=>{var F=xt(_.length);return zr(_,F),F}};function u(_){return t==="string"?xe(_):t==="boolean"?!!_:_}var f=Et(e),v=[],C=0;if(n)for(var A=0;A<n.length;A++){var D=h[i[A]];D?(C===0&&(C=nr()),v[A]=D(n[A])):v[A]=n[A]}var k=f(...v);function b(_){return C!==0&&or(C),u(_)}return k=b(k),k},Vr=(e,t,i,n)=>{var a=!i||i.every(u=>u==="number"||u==="boolean"),h=t!=="string";return h&&a&&!n?Et(e):(...u)=>Br(e,t,i,u)};s.createPreloadedFile=fr,s.staticInit(),o.noExitRuntime&&(mt=o.noExitRuntime),o.preloadPlugins&&(_t=o.preloadPlugins),o.print&&(j=o.print),o.printErr&&(B=o.printErr),o.wasmBinary&&(ye=o.wasmBinary),o.arguments&&o.arguments,o.thisProgram&&o.thisProgram,o.cwrap=Vr,o.setValue=sr,o.getValue=ir;var Ct,kt,$t;function Hr(e){o._free=e.o,o._atagjs_init=e.p,o._atagjs_destroy=e.q,o._atagjs_set_family=e.r,o._atagjs_set_detector_options=e.s,o._atagjs_set_pose_info=e.t,o._atagjs_set_img_buffer=e.u,o._atagjs_set_tag_size=e.v,o._atagjs_detect=e.w,Ct=e.x,kt=e.y,$t=e.z}var Wr={a:dr,d:vr,h:gr,i:wr,j:yr,f:br,k:Cr,e:Sr,b:Dr,g:Pr,l:Or,c:Ur},Ce=await Qt();function Qe(){if(te>0){_e=Qe;return}if(Ht(),te>0){_e=Qe;return}function e(){o.calledRun=!0,!We&&(Wt(),at?.(o),o.onRuntimeInitialized?.(),qt())}o.setStatus?(o.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>o.setStatus(""),1),e()},1)):e()}function qr(){if(o.preInit)for(typeof o.preInit=="function"&&(o.preInit=[o.preInit]);o.preInit.length>0;)o.preInit.shift()()}return qr(),Qe(),lt?r=o:r=new Promise((e,t)=>{at=e,dt=t}),r}async function Ni(){try{const c=await Oi(),r=new yi(c),o=document.createElement("apriltag-app");o.detector=r,document.body.appendChild(o)}catch(c){console.error("Error initializing app:",c)}}Ni();
