// This chap contains a quick intro to the various elements that make the Web work and the way they relate to JS.

/**************************************************A CREATION HELPER FUNCTION**************************************************/
funtion dom(name, attributes /*, children...*/) {
	var node = document.createElement(name);
	if (attributes) {
		forEachIn(attributes, function(name, value) {
			node.setAttribute(name, value);
		});
	}
	for (var i = 2; i < arguments.length; i++) {
		var child = arguments[i];
		if (typeof child === "string") {
			child = document.createTextNode(child);
		}
		node.appendChild(child);
	}
	return node;
}

