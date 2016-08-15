// To make interdependence of code easier to keep track of, it is usually better to use MODULES, each with its own task,
// and to minimize the amount of "coupling" between the modules--meaning the amount of detail they have to "know" about each other

// A MODULE can be defined as any collection of functions and values that, together, fulfill some specialized role.
// Unlike many languages, JS doesn't have any built-in ways to define modules.

// A module can concsist of just a single object (and its interface).
// A module DOES NOT have to stand on it's own, normally it will use functionality from other modules
// Ex. the Dictionary object uses the forEachIn function, which should probably be part of some utitily module,
// and these dependencies should be noted, so when you change a module, you know which modules depend on that and need to be updated

/**************************************************THE SHAPE OF A MODULE**************************************************/
// Since JS does not prescibe a way to write modules, we have to come up w/ our own techniques.
// For small modules(only a few functions/objects), just write those funcs/objs as usual and call it a module.
// for bigger modules, which contain "interal" elements, we need to do things differently
// for example, using as few top-level-variable names as possible and don't put their internal variables in the top-level environment

/**************************************************FUNCTIONS AS LOCAL NAMESPACES**************************************************/
// A simple module for translating between month names and their numbers (as used by Date, where Jan is 0), using the intermal var names
var names = ["Jan", "Feb", "March", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
function getMonthName(number) {return names[number]};
function getMonthNumber(name) {
	for (var number = 0; number < names.length; number++) {
		if (names[number] == name)
			return number;
	}
}

// The standard trick for hiding names from the world is to use a function as a local module namespace.  The whole module is written
// inside a function, and the interface of the module is explicity put into the top-level environment by setting properties in the window object
function buildMonthNameModule() {
	var names = ["Jan", "Feb", "March", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
	function getMonthName(number) {return names[number];}
	function getMonthNumber(name) {
		for (var number = 0; number < names.length; number++) {
			if (names[number] == name)
				return number;
		}
	}

	window.getMonthName = getMonthName;
	window.getMonthNumber = getMonthNumber;
}
buildMonthNameModule();

// The module's functions and variables can all see each other, but "outsiders" can only see the interface
// BUT, this can be made more elegant with a helper function, PROVIDE, which can be given an object containing an object
// that describes the interface
function provide(values) {
	forEachIn(values, function(name, value) {
		window[name] = value;
	});
}

// TO shorten the code, we can write it as an anonymous function and call it directly:
(function() {
	var names = ["Jan", "Feb", "March", "Apr", "May", "June", "July",
				 "Aug", "Sept", "Oct", "Nov", "Dec"];
	provide({
		getMonthName: function(number) {return names[number];}
		getMonthNumber: function(name) {
			for (var number = 0; number < names.length; number++) {
				if (names[number] == name)
					return number;
			}
		}
	});
})();

// It's a lot easier to start by putting everything in the top-level environment, and once everything is tested just wrap it in a function

/**************************************************MODULE OBJECTS**************************************************/
// Some modules export so many variables that it is a bad idea to put them all in the top-level environment, these must be handled differently
// You can do what the Math object does and represent the module as a single object whose properties are the functions and values it exports
var HTML = {
	tag: function(name, content, properties) {
		return {name: name, properties: properties, content: content};
	},
	link: function(target, text) {
		return HTML.tag("a", [text], {href: target});
	},
	// A bunch more functions
};

// You can also have the scope function return the module object instead of setting global variables, ex:
var days = (function() {
	var names = ["Jan", "Feb", "March", "Apr", "May", "June", "July",
				 "Aug", "Sept", "Oct", "Nov", "Dec"];
	return {
		getMonthName: function(number) {return names[number];}
		getMonthNumber: function(name) {
			for (var number = 0; number < names.length; number++) {
				if (names[number] == name)
					return number;
			}
		}
	};
})();

