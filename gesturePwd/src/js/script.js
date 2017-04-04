	

// JavaScript class DOM对象获取
var getClass = function(node,classname){
	if(node.getElementsByClassName){
		return node.getElementsByClassName(classname);
	}else{
		var elements = document.getElementsByTagName("*");
		var results = [];
		for(var i=0;i<elements.length;i++){
			if(elements.className.indexOf(classname) != -1){
				results.push(elements[i]);
			}
		}
		return results;
	}
}
//事件封装
var EventUtil = {
	addHandler: function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type] = handler;
		}
	},
	removeHandler: function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{ 
			element["on"+type] = null;
		}
	},
	getEvent: function(event){
		return event ? event:window.event;
	},
	getType: function(event){
		return event.type;
	},
	getTarget: function(event){
		return event.target || event.srcElement;
	},
	preventDefault: function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	},
	stopPropagation: function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancalBubble = true;
		}
	}
}
