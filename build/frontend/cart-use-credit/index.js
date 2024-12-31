/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/LoadingSpinner.js":
/*!******************************************!*\
  !*** ./src/components/LoadingSpinner.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LoadingSpinner)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

function LoadingSpinner(_ref) {
  var isLoading = _ref.isLoading,
    _ref$color = _ref.color,
    color = _ref$color === void 0 ? 'text-gray-700' : _ref$color,
    _ref$size = _ref.size,
    size = _ref$size === void 0 ? 'h-8 w-8' : _ref$size;
  if (!isLoading) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('animate-spin', _defineProperty(_defineProperty({}, color, true), size, true)),
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("circle", {
    className: "opacity-25",
    cx: "12",
    cy: "12",
    r: "10",
    stroke: "currentColor",
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("path", {
    className: "opacity-75",
    fill: "currentColor",
    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  })));
}

/***/ }),

/***/ "@woocommerce/blocks-checkout":
/*!****************************************!*\
  !*** external ["wc","blocksCheckout"] ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wc"]["blocksCheckout"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/plugins":
/*!*********************************!*\
  !*** external ["wp","plugins"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["plugins"];

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (arg) {
				classes = appendClass(classes, parseValue(arg));
			}
		}

		return classes;
	}

	function parseValue (arg) {
		if (typeof arg === 'string' || typeof arg === 'number') {
			return arg;
		}

		if (typeof arg !== 'object') {
			return '';
		}

		if (Array.isArray(arg)) {
			return classNames.apply(null, arg);
		}

		if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
			return arg.toString();
		}

		var classes = '';

		for (var key in arg) {
			if (hasOwn.call(arg, key) && arg[key]) {
				classes = appendClass(classes, key);
			}
		}

		return classes;
	}

	function appendClass (value, newClass) {
		if (!newClass) {
			return value;
		}
	
		if (value) {
			return value + ' ' + newClass;
		}
	
		return value + newClass;
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************!*\
  !*** ./resources/js/frontend/cart-use-credit.js ***!
  \**************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/plugins */ "@wordpress/plugins");
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _woocommerce_blocks_checkout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @woocommerce/blocks-checkout */ "@woocommerce/blocks-checkout");
/* harmony import */ var _woocommerce_blocks_checkout__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_woocommerce_blocks_checkout__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _src_components_LoadingSpinner__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../src/components/LoadingSpinner */ "./src/components/LoadingSpinner.js");
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }






var extensionCartUpdate = window.wc.blocksCheckout.extensionCartUpdate;
function UseCredit(_ref) {
  var _cart$cartFees, _extensions$fav, _extensions$fav$cashR, _extensions$fav2, _Math$min, _extensions$fav3, _cart$cartTotals;
  var extensions = _ref.extensions,
    cart = _ref.cart;
  var _useState = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(''),
    _useState2 = _slicedToArray(_useState, 2),
    credits = _useState2[0],
    setCredits = _useState2[1];
  var _useState3 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    error = _useState4[0],
    setError = _useState4[1];
  var _useState5 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    isLoading = _useState6[0],
    setIsLoading = _useState6[1];
  var isCreditApplied = cart === null || cart === void 0 || (_cart$cartFees = cart.cartFees) === null || _cart$cartFees === void 0 ? void 0 : _cart$cartFees.some(function (fee) {
    return fee.key === 'cash-rewards';
  });
  var _useState7 = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useState)(isCreditApplied),
    _useState8 = _slicedToArray(_useState7, 2),
    showCancel = _useState8[0],
    setShowCancel = _useState8[1];
  var isDisabled = (extensions === null || extensions === void 0 || (_extensions$fav = extensions.fav) === null || _extensions$fav === void 0 ? void 0 : _extensions$fav.isLoggedIn) !== true;
  var cardRewards = Intl.NumberFormat().format((_extensions$fav$cashR = extensions === null || extensions === void 0 || (_extensions$fav2 = extensions.fav) === null || _extensions$fav2 === void 0 ? void 0 : _extensions$fav2.cashRewards) !== null && _extensions$fav$cashR !== void 0 ? _extensions$fav$cashR : 0);
  var maxCredits = (_Math$min = Math.min(extensions === null || extensions === void 0 || (_extensions$fav3 = extensions.fav) === null || _extensions$fav3 === void 0 ? void 0 : _extensions$fav3.cashRewards, cart === null || cart === void 0 || (_cart$cartTotals = cart.cartTotals) === null || _cart$cartTotals === void 0 ? void 0 : _cart$cartTotals.total_price)) !== null && _Math$min !== void 0 ? _Math$min : 0;
  var handleCreditsChange = function handleCreditsChange(e) {
    var _extensions$fav4;
    var value = e.target.value;
    if (value > (extensions === null || extensions === void 0 || (_extensions$fav4 = extensions.fav) === null || _extensions$fav4 === void 0 ? void 0 : _extensions$fav4.cashRewards)) {
      setError('You don\'t have enough credits to redeem');
    } else {
      setError(null);
    }
    setCredits(Math.min(value, maxCredits));
  };
  var handleUseCredits = function handleUseCredits(credits) {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    extensionCartUpdate({
      namespace: 'fav-cash-rewards',
      data: {
        credits: credits
      }
    }).then(function (result) {
      var isCreditApplied = result === null || result === void 0 ? void 0 : result.fees.some(function (fee) {
        return fee.key === 'cash-rewards';
      });
      setShowCancel(isCreditApplied);
      setIsLoading(false);
    });
  };
  var handleReset = function handleReset() {
    handleUseCredits(credits * -1);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "border-t mt-[16px] wc-block-components-totals-coupon__form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-[0_16px] mb-2 w-full"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, isDisabled && /*#__PURE__*/React.createElement("div", {
    className: "border-t wc-block-components-totals-coupon__form bg-[#EEE] mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-[0_16px] w-full text-[#666] text-sm"
  }, "Please login first to use your credits")), !isDisabled && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.sprintf)((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your card reward balance is %s', 'favcrm-for-woocommerce'), cardRewards)), showCancel && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "underline underline-offset-1 text-sm cursor-pointer text-gray-700",
    onClick: handleReset
  }, /*#__PURE__*/React.createElement("span", {
    className: "wc-block-components-button__text"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reset', 'favcrm-for-woocommerce'))))), !showCancel && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-1 text-sm text-gray-700"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enter the amount you\'d like to redeem')), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wc-block-components-text-input !mt-0 flex-1 is-active"
  }, /*#__PURE__*/React.createElement("input", {
    id: "credit-input",
    className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('border rounded-md p-2', {
      '!bg-[#EEE]': isDisabled
    }),
    type: "number",
    autoCapitalize: "off",
    autoComplete: "off",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Credit input', 'favcrm-for-woocommerce'),
    "aria-invalid": "false",
    value: credits,
    onChange: handleCreditsChange,
    min: 0,
    max: maxCredits,
    disabled: isDisabled
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "credit-input"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Credit input', 'favcrm-for-woocommerce'))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: classnames__WEBPACK_IMPORTED_MODULE_4___default()('text-white px-4 py-2 rounded-md', {
      'cursor-not-allowed': isDisabled || !credits || error,
      'bg-[#32373c]': !isDisabled && credits && !error,
      '!bg-gray-400': isDisabled || !credits || error
    }),
    disabled: isDisabled || !credits || error,
    onClick: function onClick() {
      handleUseCredits(credits);
    }
  }, isLoading ? /*#__PURE__*/React.createElement(_src_components_LoadingSpinner__WEBPACK_IMPORTED_MODULE_5__["default"], {
    isLoading: true,
    size: "size-6",
    color: "text-white"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "wc-block-components-button__text"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Apply', 'favcrm-for-woocommerce')))))), error && /*#__PURE__*/React.createElement("div", {
    className: "text-red-500 text-sm mt-2"
  }, error)));
}
var render = function render() {
  return /*#__PURE__*/React.createElement(_woocommerce_blocks_checkout__WEBPACK_IMPORTED_MODULE_2__.ExperimentalDiscountsMeta, null, /*#__PURE__*/React.createElement(UseCredit, null));
};
(0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_0__.registerPlugin)('favored-use-credit', {
  render: render,
  scope: 'woocommerce-checkout'
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map