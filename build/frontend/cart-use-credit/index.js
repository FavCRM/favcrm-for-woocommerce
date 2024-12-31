(()=>{var e={6942:(e,t)=>{var r;!function(){"use strict";var n={}.hasOwnProperty;function o(){for(var e="",t=0;t<arguments.length;t++){var r=arguments[t];r&&(e=c(e,a(r)))}return e}function a(e){if("string"==typeof e||"number"==typeof e)return e;if("object"!=typeof e)return"";if(Array.isArray(e))return o.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var t="";for(var r in e)n.call(e,r)&&e[r]&&(t=c(t,r));return t}function c(e,t){return t?e?e+" "+t:e+t:e}e.exports?(o.default=o,e.exports=o):void 0===(r=function(){return o}.apply(t,[]))||(e.exports=r)}()}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={exports:{}};return e[n](a,a.exports,r),a.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";const e=window.wp.plugins,t=window.wp.i18n,n=window.wc.blocksCheckout,o=window.wp.element;var a=r(6942),c=r.n(a);function l(e){return l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l(e)}function i(e,t,r){return(t=function(e){var t=function(e,t){if("object"!=l(e)||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,"string");if("object"!=l(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==l(t)?t:t+""}(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function u(e){var t=e.isLoading,r=e.color,n=void 0===r?"text-gray-700":r,o=e.size,a=void 0===o?"h-8 w-8":o;return t?React.createElement("div",{className:"flex items-center justify-center"},React.createElement("svg",{className:c()("animate-spin",i(i({},n,!0),a,!0)),xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24"},React.createElement("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),React.createElement("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"}))):null}function s(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,a,c,l=[],i=!0,u=!1;try{if(a=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;i=!1}else for(;!(i=(n=a.call(r)).done)&&(l.push(n.value),l.length!==t);i=!0);}catch(e){u=!0,o=e}finally{try{if(!i&&null!=r.return&&(c=r.return(),Object(c)!==c))return}finally{if(u)throw o}}return l}}(e,t)||function(e,t){if(e){if("string"==typeof e)return m(e,t);var r={}.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?m(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=Array(t);r<t;r++)n[r]=e[r];return n}var f=window.wc.blocksCheckout.extensionCartUpdate;function d(e){var r,n,a,l,i,m,d,v=e.extensions,p=e.cart,y=s((0,o.useState)(""),2),b=y[0],w=y[1],g=s((0,o.useState)(null),2),h=g[0],x=g[1],E=s((0,o.useState)(!1),2),R=E[0],_=E[1],S=null==p||null===(r=p.cartFees)||void 0===r?void 0:r.some((function(e){return"cash-rewards"===e.key})),N=s((0,o.useState)(S),2),k=N[0],C=N[1],j=!0!==(null==v||null===(n=v.fav)||void 0===n?void 0:n.isLoggedIn),A=Intl.NumberFormat().format(null!==(a=null==v||null===(l=v.fav)||void 0===l?void 0:l.cashRewards)&&void 0!==a?a:0),O=null!==(i=Math.min(null==v||null===(m=v.fav)||void 0===m?void 0:m.cashRewards,null==p||null===(d=p.cartTotals)||void 0===d?void 0:d.total_price))&&void 0!==i?i:0,P=function(e){R||(_(!0),f({namespace:"fav-cash-rewards",data:{credits:e}}).then((function(e){var t=null==e?void 0:e.fees.some((function(e){return"cash-rewards"===e.key}));C(t),_(!1)})))};return React.createElement("div",{className:"border-t mt-[16px] wc-block-components-totals-coupon__form"},React.createElement("div",{className:"p-[0_16px] mb-2 w-full"},React.createElement("div",null,React.createElement("div",null,j&&React.createElement("div",{className:"border-t wc-block-components-totals-coupon__form bg-[#EEE] mb-3"},React.createElement("div",{className:"p-[0_16px] w-full text-[#666] text-sm"},"Please login first to use your credits")),!j&&React.createElement("div",{className:"mb-3"},(0,t.sprintf)((0,t.__)("Your card reward balance is %s","favcrm-for-woocommerce"),A)),k&&React.createElement("div",null,React.createElement("div",{className:"underline underline-offset-1 text-sm cursor-pointer text-gray-700",onClick:function(){P(-1*b)}},React.createElement("span",{className:"wc-block-components-button__text"},(0,t.__)("Reset","favcrm-for-woocommerce"))))),!k&&React.createElement("div",null,React.createElement("div",{className:"mb-1 text-sm text-gray-700"},(0,t.__)("Enter the amount you'd like to redeem")),React.createElement("div",{className:"flex flex-wrap gap-2 w-full"},React.createElement("div",{className:"wc-block-components-text-input !mt-0 flex-1 is-active"},React.createElement("input",{id:"credit-input",className:c()("border rounded-md p-2",{"!bg-[#EEE]":j}),type:"number",autoCapitalize:"off",autoComplete:"off","aria-label":(0,t.__)("Credit input","favcrm-for-woocommerce"),"aria-invalid":"false",value:b,onChange:function(e){var t,r=e.target.value;r>(null==v||null===(t=v.fav)||void 0===t?void 0:t.cashRewards)?x("You don't have enough credits to redeem"):x(null),w(Math.min(r,O))},min:0,max:O,disabled:j}),React.createElement("label",{htmlFor:"credit-input"},(0,t.__)("Credit input","favcrm-for-woocommerce"))),React.createElement("button",{type:"button",className:c()("text-white px-4 py-2 rounded-md",{"cursor-not-allowed":j||!b||h,"bg-[#32373c]":!j&&b&&!h,"!bg-gray-400":j||!b||h}),disabled:j||!b||h,onClick:function(){P(b)}},R?React.createElement(u,{isLoading:!0,size:"size-6",color:"text-white"}):React.createElement("span",{className:"wc-block-components-button__text"},(0,t.__)("Apply","favcrm-for-woocommerce")))))),h&&React.createElement("div",{className:"text-red-500 text-sm mt-2"},h)))}(0,e.registerPlugin)("favored-use-credit",{render:function(){return React.createElement(n.ExperimentalDiscountsMeta,null,React.createElement(d,null))},scope:"woocommerce-checkout"})})()})();