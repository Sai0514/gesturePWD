// JavaScript class DOM对象获取
export default function(node, classname) {
    if (node.getElementsByClassName) {
        return node.getElementsByClassName(classname);
    } else {
        var elements = document.getElementsByTagName("*");
        var results = [];
        for (var i = 0; i < elements.length; i++) {
            if (elements.className.indexOf(classname) != -1) {
                results.push(elements[i]);
            }
        }
        return results;
    }
}