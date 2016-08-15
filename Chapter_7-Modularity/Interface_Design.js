/**************************************************INTERFACE DESIGN**************************************************/
// Designing an interface for a module or an obj type is on the the subtler aspects of programming, any non-trivial
// functionality can be exposed in differen ways, finding that way is something of an artform  But you generally have to
// use some bad interface designs before you can learn the value of a good one

/**************************************************PREDICTABILITY**************************************************/
// Make sure to stick to conventions and resemble existing work in the code to make it more intuitive.

/**************************************************COMPOSABILITY**************************************************/
// In the interfaces, try to us the simplest data structures, like pure functions
// It's common for modules to provide their own array-like collection objs, w/ their own interface for extarcting elements
// from such an obj, and RETURN those from functions that return collections of things. Some objs, can't be passed to map or foreach,
// which is an ex. of bad COMPOSABILITY, since the module can't be easily composed w/ algorithms operating on arrays.

/**************************************************LAYERED INTERFACES**************************************************/
// When designing an interface for a complex piece of functionality (say, sending email), there is normally a dilemna.  You don't want
// to overload the user of your interface with details, but you don't want to hide all the details either, so when people need to do
// complicated things, that should also be possible.
// THE SOLUTION: Is often to create 2 interfaces
// 1. A detailed "low-level" one for advanced use and
// 2. a simple "high-level" one for straightforward situations.
// #2 can be built easily using tools provided by #1

/**************************************************ARUGMENT OBJECTS**************************************************/
// Some funcs require a lot of args.  Sometimes, it's bad design and they just need to be split into more focused functions
// Other times the funcs really need those args.  And typically, some of the args have a sensible default value.
// This func finds the position of a value in an array, w/ extra args that allow you to serach just part of the array (start and end)
// and to use a custom func as a replacement for == when comparing elements
function positionOf(element, array, compare, start, end) {
	if (start == null)
		start = 0;
	if (end == null)
		end = array.length;
	for (; start < end; start++) {
		var current = array[start];
		if (compare ? compare(element, current) : element == current)
			return start;
	}
}

// == returns true bot if the value is NULL and if it is UNDEFINED
// This is used to check whether start and end were passed and to give them a useful default value if they weren't
// The above can be improved by wrapping the optional args in an obj:
// optional arguments in args: {compare, start, end}
function positionOf(element, array, arg) {
	args = args || {};
	var start = (args.start == null ? 0 : args.start),
	end = (args.end == null ? array.length : args.end),
	compare = args.compare;

	for (; start < end; start++) {
		var current = array[start];
		if (compare ? compare(element, current) : element == current)
			return start;
	}
}

/**************************************************LIBRARIES**************************************************/
// A module or group of modules intended to be used in more than one program is called a LIBRARY.
//