export default class DomService {
  static siblings(el) {
    return [].filter.call(el.parentNode.children, function(child) {
      return child !== el;
    });
  }

  static closest(el, selector) {
    var matchesSelector;
    matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
      if (matchesSelector.call(el, selector)) {
        return el;
      } else {
        el = el.parentElement;
      }
    }
    return null;
  }

  static parentsUntil(el, selector, filter) {
    var matchesSelector, result;
    result = [];
    matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    el = el.parentElement;
    while (el && !matchesSelector.call(el, selector)) {
      if (!filter) {
        result.push(el);
      } else {
        if (matchesSelector.call(el, filter)) {
          result.push(el);
        }
      }
      el = el.parentElement;
    }
    return result;
  }

  static findChild(el, func){
    if (!el) {
      return null;
    }

    let children = el.children;
    let e;
    [].forEach.call(children, (d) => {
      if(func(d)) {
        e = d;
      }
    });
    if (e){
      return e;
    } else {
      for (let child of children){
        let find = DomService.findChild(child, func);
        if (find) {
          return find;
        }
      }
    }
  }

  static getWidth(el) {
    return Math.max(el.clientWidth, el.offsetWidth, el.scrollWidth);
  }

  static getHeight(el) {
    var borderBottomWidth, borderTopWidth, height, paddingBottom, paddingTop, styles;
    styles = window.getComputedStyle(el);
    height = el.offsetHeight;
    borderTopWidth = parseFloat(styles.borderTopWidth);
    borderBottomWidth = parseFloat(styles.borderBottomWidth);
    paddingTop = parseFloat(styles.paddingTop);
    paddingBottom = parseFloat(styles.paddingBottom);
    return height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom;
  }

  static scrollTop(val) {
    var container;
    if (document.documentElement && document.documentElement.scrollTop) {
      container = document.documentElement;
    } else {
      container = document.body;
    }
    if (val) {
      container.scrollTop = val;
    } else {
      return container.scrollTop;
    }
  }

  static trigger(el, eventName, data) {
    var event;
    if ("CustomEvent" in window) {
      event = new CustomEvent(eventName, {
        detail: data
      });
    } else {
      event = document.createEvent('CustomEvent');
      event.initCustomEvent(eventName, true, true, data);
    }
    return el.dispatchEvent(event);
  }

  static createElement(html) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstElementChild;
  }

  static hasClass(el, name) {
    return new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)").test(el.className);
  }

  static addClass(el, name) {
    if (!DomService.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  static removeClass(el, name) {
    if (DomService.hasClass(el, name)) {
      let c = el.className;
      el.className = c.replace(new RegExp("(?:^|\\s+)" + name + "(?:\\s+|$)", "g"), " ");
    }
  }

  static toggleClass(el, name) {
    if (DomService.hasClass(el, name)) {
      DomService.removeClass(el, name);
    } else {
      DomService.addClass(el, name);
    }
  }

  static getPosition(element) {
    let xPosition = 0;
    let yPosition = 0;

    while(element) {
      xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
      yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
      element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
  }

  static insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }


  /*
    process exclusive click event and dblclick event
  */
  static clicker(clickFunc, dblclickFunc, delay = 500) {
    let clicks = 0;
    let timer = null;
    let isFunction = (f) => {
      let n = Object.prototype.toString.call(f);
      return "[object Function]"==n||"[object GeneratorFunction]"==n||"[object AsyncFunction]"==n||"[object Proxy]"==n;
    }
    return function() {
      let args = arguments;
      clicks += 1;
      if (clicks === 1) {
        return timer = setTimeout(() => {
          clicks = 0;
          if (isFunction(clickFunc)) {
            return clickFunc.apply(this, args);
          }
        }, delay);
      } else {
        clicks = 0;
        clearTimeout(timer);
        if (isFunction(dblclickFunc)) {
          return dblclickFunc.apply(this, args);
        }
      }
    };
  }
}
