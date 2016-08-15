// NAIVE VERSION
function printArray(array) {
	for (var i = 0; i < array.length; i++) {
		print(array[i]);
	}
}

// LESS NAIVE VERSION
function forEach(array, action) {
	for (var i = 0; i < array.length; i++) {
		action(array[i]);
	}
}

funciton sum(numbers) {
	var total = 0;
	forEach(numbers, function(number) {
		total += number;
	});
	return total;  // due to lexical scoping, total is reachable inside the anon func
}

/***********************************Modyfying Functions***********************************/
//  This takes only one argument
function negateWithOneArg(func) {
	return function(x) {
		return !func(x);
	};
}
var isNotNaN = negate(isNaN);
isNotNaN(NaN); //  False

// TO gain access to any arguments passed to a function, use the arguments psuedo-array
// Functions have a method called apply, which takes 2 arguments the first will be null
// and the second is an array containing arguments to which a function must be applied
function negateWithMultipleArgs(func) {
	return function() {
		return !func.apply(null, arguments);
	};
}

/***********************************The reduce (or fold) Function***********************************/
// reduce combines an array into a SINGLE value by repeatedly useing a func that combines
// an element of an array with a base value
function reduce(combine, base, array) { // uses 3 arguments
	foreach(array, function(element) {
		base = combine(base, element);
	});
	return base;
}

function add(a, b) {
	return a + b;
}

function sum(numbers) { // this is just a variant of the reduce function
	return reduce(add, 0, numbers);
}

// Another example of reduce-like functionality
function countZeroes1(array) {
	function counter(total, element) {
		return total + (element === 0 ? 1 : 0);
	}
	return reduce(counter, 0, array);
}

function count(text, array) {
	var counted = 0;
	forEach(array, function(element) {
		if (test(element)) counted++;
	});
	return counted;
}

function countZeros2(array) {
	function isZero(x) {
		return x === 0;
	}
	return count(isZero, array);
}

/***********************************Mapping Arrays***********************************/
// Another generally useful "fundamental algorithm" related to arrays is called MAP
// It acts like forEach EXCEPT it builds a NEW ARRAY from the values it iterates instead
// of discarding them
function map(func, array) { // func === function, but function is a reserved keyword
	var result = [];
	forEach(array, function(element) {
		result.push(func(element));
	});
	return result;
}

map(Math.round, [0.01, 2, 9.89, Math.PI]); // [0, 2, 10, 3]

/***********************************The Recluses' Story***********************************/
// Finding Paragraphs
var paragraphs = RECLUSEFILE.split("\n\n");
paragraphs.length; // 22

// To separate heading paragraphs from normal ones, use this function:
function processParagraph1(paragraph) {
	var heading = 0;
	while (paragraph.charAt(heading) == "%")
		heading++;
	if (heading > 0)
		return { type: "h" + heading, content: paragraph.slice(heading + 1) };
	else
		return { type: "p", content: paragraph };
}

function processParagraph2(paragraph) {
	var heading = 0;
	while (paragrph.charAt(heading) == "%")
		heading++;
	if (heading > 0)
		return { type: "h" + heading, content: splitParagraph(paragraph.slice(heading + 1))};
	else
		return { type: "p", content: splitParagraph(paragraph)};
}

processParagraph(paragraphs[0]); // { type: "h1", content: "The Book of Programming"}
// Then use the map function to convert all paragraphs grabbed earlier
map(processParagraph, RECLUSEFILE.split("\n\n"));
// [{ type: "h1", content: "The Book of Programming"}, etc...]

//EMPHASIS AND FOOTNOTES
function splitParagraph(text) {
	// The split1 function is an example of FUNCTIONAL PROGRAMMING, unfortunately it doesn't work
	// well with javascript so it will be rewritten below
	function split1(pos) {
		if (pos == text.length) {
			return [];
		}
		else if (text.charAt(pos) == "*") {
			var end = findClosing("*", pos + 1),
				frag = { type: "emphasized", content: text.slice(pos + 1, end)};
			return [frag].concat(split(end + 1));
		}
		else if (text.charAt(pos) == "{") {
			var end = findClosing("}", pos + 1),
				frag = { type: "footnote", content: text.slice(pos + 1, end)};
			return [frag].concat(split(end + 1));
		}
		else {
			var end = findOpeningOrEnd(pos),
				frag = { type: "normal", content: text.slice(pos, end)};
			return [frag].concet(split(end));
		}
	}
	// In this function, the recursive cals have been replaced with a while loop, and the
	// fragment array is no longer built by concatenating subparts, but explicitly modified
	// by pushing in new elements.  fragments and pos are now being modified
	function split2() {
		var pos = 0, fragments = [];
		while (pos < text.length) {
			if (text.charAt(pos) == "*") {
				var end = findClosing("*", pos + 1);
				fragments.push({ type: "emphasized", content: text.slice(pos + 1, end)});
				pos = end + 1;
			}
			else if (text.charAt(pos) == "{") {
				var end = findClosing("}", pos + 1);
				fragments.push({ type: "footnote", content: text.slice(pos + 1, end)});
				pos = end + 1;
			}
			else {
				var end = findOpeningOrEnd(pos);
				fragments.push({ type: "normal", content: text.slice(pos, end)});
				pos = end;
			}
		}
		return fragments;
	}

	function findClosing(characeter, from) {
		var end = text.indexOf(character, from);
		if (end == -1) throw new Error("missing closing '" + character + "'");
		else return end;
	}

	function findOpeningOrEnd(from) {
		function indexOrEnd(character) {
			var index = text.indexOf(character, from);
			return index == -1 ? text.length : index;
		}
		return Math.min(indexOrEnd("*"), indexOrEnd("{"));
	}

	return split(0);
}

/***********************************Moving the Footnotes***********************************/
function extractFootnotes(paragraphs) {
	var footnotes = [];
	var currentNote = 0;

	function replaceFootnote(fragment) {
		if (fragment.type == "footnote") {
			currentNote++;
			footnotes.push(fragment);
			fragment.number = currentNote;
			return {type: "reference", number: currentNote};
		}
		else {
			return fragement;
		}
	}

	forEach(paragraphs, function(paragraph) {
		paragraph.content = map(replaceFootnote, paragraph.content);
	});

	return footnotes;
}

/***********************************Generating HTML***********************************/
var linkObject = {
	name: "a",
	attributes: {href: "http://www.gokgs.com/"},
	content: ["Play Go!"]
};

// Every HTML element contains a NAME property, denoting the tag it represents
// When it has attributes, it also contains an attribute property (an object in where the attrs are stored)
// When it has content, there is a content property (an array of other elements contained in this element)
// Happily there is a shortcut function to type in these objects
function tag(name, content, attributes) {
	return {name: name, attributes: attributes, content: content};
}
// since the attributes and content of an element can be undefined if not applicable, the 2nd and 3rd args can be left off
// tag is still primitive, so shortcuts for common types of elements, like links, or the outer structure of a simple document, can be written
function link(target, text) {
	return tag("a", [text], {href: target});
}

function htmlDoc(title, bodyContent) {
	return tag("html", [tag("head", [tag("title", [title])])
						tag("body", bodyContent)]);
}

// This function uses the replace function to identify escape characters in the HTML
function escapeHTML(text) {
	var replacements = [[/&/g, "&amp;"], [/"/g, "&quot;"],
						[/</g, "&lt;"], [/>/g, "&gt;"]];
	forEach(replacements, function(replace) {
		text = text.replace(replace[0], replace[1]);
	});
	return text;
} // There is a much better way to do this in Chapter 8

function renderAttributes(attributes) {
	if (attributes == null) return "";

	var result = [];
	for (var name in attributes)
		result.push(" " + name + "=\"" + escapeHTML(attributes[name]) + "\"");
	return result.join("");
}

function renderHTML(element) {
	var pieces = [];

	function render(element) {
		// Text node
		if (typeof element == "string") {
			pieces.push(escapeHTML(element));
		}
		// Empty tag
		else if (!element.content || element.content.length == 0) {
			pieces.push("<" + element.name +
						renderAttributes(element.attributes) + ">");
		}
		// Tag with content
		else {
			pieces.push("<" + content.name +
						renderAttributes(element.attributes) + ">");
			forEach(element.content, render);
			pieces.push("</" + element.name + ">");
		}
	}

	render(element);
	return pieces.join("");
}
// Creating new strings is actually quite a bit of work for the computer, so
// using arrays to accumulate strings and then joining them is far less intensive because
// In JS, strings are immutable, so if we concatenate something to them, a new string is created on every step
// while the old are still intact.  So each little string is just thrown away when the next piece is concatenated to them.
// but if the little strings are stored in an array and then joined, only 1 big string is made.

/***********************************Converting the Recluses' Book***********************************/
function renderFragment(fragment) {
	if (fragment.type == "reference")
		return tag("sup", [link("#footnote" + fragment.number,
								String(fragment.number))]);
	else if (fragment.type == "emphasized")
		return tag("em", [fragment.content]);
	else if (fragment.type == "normal")
		return fragment.content;
} // a sup tag will show its content as "superscript"

function renderParagraph(paragraph) {
	return tag(paragraph.type, map(renderFragment, paragraph.content))
}

function renderFootnote(footnote) {
	var anchor = tag("a", [], {name: "footnote" + footnote.number});
	var number = "[" + footnote.number + "] ";
	return tag("p", [tag("small", [anchor, number, footnote.content])]);
}

// This is the function that when given a file in the correct format and a document title will return an HTML doc
function renderFile(file, title) {
	var paragraphs = map(processParagraph2, file.split("\n\n"));
	var footnotes = map(renderFootnote, extractFootnotes(paragraphs));
	var body = map(renderParagraph, paragraphs).concat(footnotes);
	return renderHTML(htmlDoc(title, body));
}

/***********************************Other Functional Tricks***********************************/
// Operator Functions
// Why aren't there operator functions in JS?
// a way around this problem is to create an object like this:
var op = {
	"+": function(a, b) {return a + b;},
	"==": function(a, b) {return a == b;},
	"===": function(a, b) {return a === b;},
	"!": function(a) {return !a;},
	//etc.....
}

reduce(op["+"], 0, [1,2,3,4,5]); // will sum this array

// Partial Application
function partial(func) {
	var knownArgs = arguments; // inside the inner function, arguments refers to THAT functions arguments, not partials'
	return function() {
		var realArgs = [];
		for (var i = 1; i < knownArgs.length; i++)
			realArgs.push(knownArgs[i]);
		for (var i = 0; i < arguments.length; i++)
			realArgs.push(arguments[i]);
		return func.apply(null, realArgs);
	};
}

map(partial(op["+"], 1) [0, 2, 4, 6, 8, 10]);
// [1, 3, 5, 7, 9, 11]
// map takes its argument function before its array argument because its often useful to partially apply map by
// giving it a function.  This "lifts" the func from operating on a single value to operating on an array of values.
// ex:
function square(x) {return x * x;}

map(partial(map, square), [[10], [0, 1], [3]]);
// [[100], [0, 1], [9]]

// and the sum function can now be written like this
var sum = partial(reduce, op["+"], 0);

// FUnction Composition
// calling function A and then applying function B to the result
function compose(f1, f2) {
	return function() {
		return f1(f2.apply(null, arguments));
	};
}

// EXample
var isNotNaN = compose(op["!"], isNaN);
isNotNan(5);
// true
// This just composed a function without ever using the function keyword, which is very useful if you want to
// create a simple function to give to, for example map or reduce
// HOWEVER, functions defined like this will be a bit slower b/c they add more indirect function calls