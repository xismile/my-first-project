function treeHTMLForRecord(action, element, object, currentWindow) {
    if (!element) {
        return;
    }
    treeHTML(element, object, currentWindow);
    object["action"] = action;
    
    var nodeList = element.childNodes;
    if (nodeList != null && nodeList.length) {
        object["content"] = [];
        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].nodeType == 3) {
                object["content"].push(nodeList[i].value);
            }
        }
    }
}

function getShadowRootElementForRecord(action, element, currentWindow) {
    var object = {}
    treeHTMLForRecord(action, element, object, currentWindow);
    if (element.getRootNode() instanceof ShadowRoot) {
        object['shadow_root'] = getShadowRootElementForRecord(action, element.getRootNode().host, currentWindow);
    }
    return object;
}

function mapDOMForRecord(action, element, currentWindow) {
    var treeObject = {};

    // If string convert to document Node
    if (typeof element === "string") {
        if (window.DOMParser) {
              parser = new DOMParser();
              docNode = parser.parseFromString(element,"text/xml");
        } else { // Microsoft strikes again
              docNode = new ActiveXObject("Microsoft.XMLDOM");
              docNode.async = false;
              docNode.loadXML(element); 
        } 
        element = docNode.firstChild;
    }

    treeObject = getShadowRootElementForRecord(action, element, currentWindow);
    return treeObject;
}