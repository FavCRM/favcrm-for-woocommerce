(()=>{"use strict";const e=window.wp.element,t=window.wp.blockEditor,i=window.wp.blocks,n=window.wp.i18n,l=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"fav/floating-icon","version":"0.1.0","title":"Fav Floating Icon","description":"","category":"widgets","icon":"cart","textdomain":"favored","editorScript":"file:./index.js","render":"file:./render.php","viewScript":"file:./view.js","viewStyle":"file:./view.css","styles":[],"attributes":{"logo_id":{"type":"integer"},"logo_url":{"type":"string"}},"supports":{"align":false,"anchor":false,"alignContent":false,"color":{"text":false,"background":true,"link":false},"alignText":false,"fullHeight":false}}');(0,i.registerBlockType)(l,{edit:function(i){var l=(0,t.useBlockProps)();return React.createElement(e.Fragment,null,React.createElement("div",l,React.createElement("div",null,(0,n.__)("Member Zone","favored"))))}})})();