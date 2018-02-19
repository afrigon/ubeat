let flags = 0
function toggleFilter (event, value) { // eslint-disable-line no-unused-vars
    event && event.preventDefault()
    value || (value = flags)
    // add or remove value from flags
    if ((flags & value) !== 0) { flags &= ~value } else { flags |= value }
    return applyFilter()
}

function setFilter (value) { // eslint-disable-line no-unused-vars
    flags = value
    return applyFilter()
}

function applyFilter () {
    const filter = document.getElementById('search-filter')
    filter && (filter.value = Util.getBitwiseArray(4).map((n) => {
        const buttons = document.querySelectorAll(`.filter-button-${n}`)
        if (!buttons || buttons.length <= 0) return null
        if ((n & flags) === 0) {
            buttons.forEach((button) => {
                button.classList.remove('active')
            })
            return null
        }

        buttons.forEach((button) => {
            button.classList.add('active')
        })
        return n
    }).join(','))
    return window.sessionStorage.setItem('search-flags', flags)
}

function toggleOptionsMenu () { // eslint-disable-line no-unused-vars
    const wrapper = document.getElementById('options-wrapper')
    return wrapper && wrapper.classList.toggle('active')
}

// smooth scroll polyfill
!function(){"use strict";function o(o){var t=["MSIE ","Trident/","Edge/"];return new RegExp(t.join("|")).test(o)}function t(){function t(o,t){this.scrollLeft=o,this.scrollTop=t}function r(o){return.5*(1-Math.cos(Math.PI*o))}function i(o){if(null===o||"object"!=typeof o||void 0===o.behavior||"auto"===o.behavior||"instant"===o.behavior)return!0;if("object"==typeof o&&"smooth"===o.behavior)return!1;throw new TypeError("behavior member of ScrollOptions "+o.behavior+" is not a valid value for enumeration ScrollBehavior.")}function s(o,t){return"Y"===t?o.clientHeight+h<o.scrollHeight:"X"===t?o.clientWidth+h<o.scrollWidth:void 0}function c(o,t){var e=l.getComputedStyle(o,null)["overflow"+t];return"auto"===e||"scroll"===e}function n(o){var t=s(o,"Y")&&c(o,"Y"),l=s(o,"X")&&c(o,"X");return t||l}function f(o){var t;do{t=(o=o.parentNode)===e.body}while(!1===t&&!1===n(o));return t=null,o}function a(o){var t,e,i,s=(y()-o.startTime)/v;t=r(s=s>1?1:s),e=o.startX+(o.x-o.startX)*t,i=o.startY+(o.y-o.startY)*t,o.method.call(o.scrollable,e,i),e===o.x&&i===o.y||l.requestAnimationFrame(a.bind(l,o))}function p(o,r,i){var s,c,n,f,p=y();o===e.body?(s=l,c=l.scrollX||l.pageXOffset,n=l.scrollY||l.pageYOffset,f=u.scroll):(s=o,c=o.scrollLeft,n=o.scrollTop,f=t),a({scrollable:s,method:f,startTime:p,startX:c,startY:n,x:r,y:i})}if(!("scrollBehavior"in e.documentElement.style&&!0!==l.__forceSmoothScrollPolyfill__)){var d=l.HTMLElement||l.Element,v=468,h=o(l.navigator.userAgent)?1:0,u={scroll:l.scroll||l.scrollTo,scrollBy:l.scrollBy,elementScroll:d.prototype.scroll||t,scrollIntoView:d.prototype.scrollIntoView},y=l.performance&&l.performance.now?l.performance.now.bind(l.performance):Date.now;l.scroll=l.scrollTo=function(){void 0!==arguments[0]&&(!0!==i(arguments[0])?p.call(l,e.body,void 0!==arguments[0].left?~~arguments[0].left:l.scrollX||l.pageXOffset,void 0!==arguments[0].top?~~arguments[0].top:l.scrollY||l.pageYOffset):u.scroll.call(l,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:l.scrollX||l.pageXOffset,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:l.scrollY||l.pageYOffset))},l.scrollBy=function(){void 0!==arguments[0]&&(i(arguments[0])?u.scrollBy.call(l,void 0!==arguments[0].left?arguments[0].left:"object"!=typeof arguments[0]?arguments[0]:0,void 0!==arguments[0].top?arguments[0].top:void 0!==arguments[1]?arguments[1]:0):p.call(l,e.body,~~arguments[0].left+(l.scrollX||l.pageXOffset),~~arguments[0].top+(l.scrollY||l.pageYOffset)))},d.prototype.scroll=d.prototype.scrollTo=function(){if(void 0!==arguments[0])if(!0!==i(arguments[0])){var o=arguments[0].left,t=arguments[0].top;p.call(this,this,void 0===o?this.scrollLeft:~~o,void 0===t?this.scrollTop:~~t)}else{if("number"==typeof arguments[0]&&void 0===arguments[1])throw new SyntaxError("Value couldn't be converted");u.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left:"object"!=typeof arguments[0]?~~arguments[0]:this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top:void 0!==arguments[1]?~~arguments[1]:this.scrollTop)}},d.prototype.scrollBy=function(){void 0!==arguments[0]&&(!0!==i(arguments[0])?this.scroll({left:~~arguments[0].left+this.scrollLeft,top:~~arguments[0].top+this.scrollTop,behavior:arguments[0].behavior}):u.elementScroll.call(this,void 0!==arguments[0].left?~~arguments[0].left+this.scrollLeft:~~arguments[0]+this.scrollLeft,void 0!==arguments[0].top?~~arguments[0].top+this.scrollTop:~~arguments[1]+this.scrollTop))},d.prototype.scrollIntoView=function(){if(!0!==i(arguments[0])){var o=f(this),t=o.getBoundingClientRect(),r=this.getBoundingClientRect();o!==e.body?(p.call(this,o,o.scrollLeft+r.left-t.left,o.scrollTop+r.top-t.top),"fixed"!==l.getComputedStyle(o).position&&l.scrollBy({left:t.left,top:t.top,behavior:"smooth"})):l.scrollBy({left:r.left,top:r.top,behavior:"smooth"})}else u.scrollIntoView.call(this,void 0===arguments[0]||arguments[0])}}}var l=window,e=document;"object"==typeof exports?module.exports={polyfill:t}:t()}();
