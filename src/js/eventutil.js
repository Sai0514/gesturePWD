//事件封装

export function addHandler(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
    } else {
        element["on" + type] = handler;
    }
};

export function removeHandler(element, type, handler) {
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
        element.detachEvent("on" + type, handler);
    } else {
        element["on" + type] = null;
    }
};

export function getEvent(event) {
    return event ? event : window.event;
};

export function getType(event) {
    return event.type;
};

export function getTarget(event) {
    return event.target || event.srcElement;
};

export function preventDefault(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
};

export function stopPropagation(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancalBubble = true;
    }
}