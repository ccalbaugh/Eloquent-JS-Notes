/**************************************************Objects**************************************************/
// In OOP, objects are viewed as little worlds of their own, and the outside world may touch them only through a limited
// and well defined interface, which consists of a number of specific methods and properties.
// Ex. the Date or Error objects (constructors)
/**************************************************DEFINING METHODS**************************************************/
var rabbit = {};

function speak(line) {
	print("The ", this.adjective, " rabbit says '", line, "'");
}
var whiteRabbit = {adjective: "white", speak: speak};
var fatRabbit = {adjective: "fat", speak: speak};

whiteRabbit.speak{"Oh my ears and whiskers, how late it's getting!"};
fatRabbit.speak{"I could sure use a carrot right now."};

function run(from, to) {
	print("The ", this.adjective, " rabbit runs from ", from, " to ", to, ".");
}

run.apply(whiteRabbit, ["A", "B"]); // the 1st arg of apply is specifies the object the func is applied to

run.call(fatRabbit, "The cupboard", "the fridge"); // call can be handed the func args separately instead of as an array

/**************************************************CONSTRUCTORS**************************************************/
// When a constructor is called with the NEW operator, its THIS var will point at a NEW object, which it will automatically return
function Rabbit(adjective) {
	this.adjective = adjective;
	this.speak = function(line) {
		print("The ", this.adjective, " rabbit says '", line, "'");
	};
}

var killerRabbit = new Rabbit("killer");
killerRabbit.speak("GRAAAAAAA!");

/**************************************************BUILDING FROM A PROTOTYPE**************************************************/
function makeRabbit(adjective) {
	return {
		adjective: adjective,
		speak: function(line) {
			print("The ", this.adjective, " rabbit says '", line, "'");
		}
	};
}
var blackRabbit = makeRabbit("black");

// THere are a couple of differences between the constructor and Prototype builds
// 1a. killerRabbit has a property called constructor, which points at the Rabbit function that created it.
// 1b. blackRabbit also has this propterty, but it points at the Object function.

// Every Object is based on a prototype, which gives it a set of inherent properties, the objects so far have been
// based on the most basic prototype, which is associated with the Object constructor, and thus shared by all objects
// Ex. toString is a method that is part of the Object prototype, therefore all simple objects have that method.
// Also, even if an object has another prototype, that prototype is itself an obj
// which is (directly or indirectly) based on the Object prototype

/**************************************************CONSTRUCTORS AND PROTOTYPES**************************************************/
// Even though objects seem to share the properties of their prototype, this is one-way sharing.  The properties
// of the Prototype influence the object based on it, and changes to these objects never affect the prototype.

function BetterRabbit(adjective) {
	this.adjective = adjective;
}
BetterRabbit.prototype.speak = function(line) {
	print("The ", this.adjective, " rabbit says '", line, "'");
};

/**************************************************PROTOTYPE POLLUTION**************************************************/
// The fact that all objects have a prototype and receive some properties from this prototype can be tricky.
// It can often be useful to extend the properties of standard constructors like Object or Array with new funcs.
// Ex. A func method that returns an array of all the (nonhidden) properties that an object contains
Object.prototype.properties = function() {
	var result = [];
	for (var property in this)
		result.push(property);
	return result;
};

var test = {x: 10, y: 3};
test.properties();
// ["x", "y", "properties"]
// 					^ Here is the problem
// b/c the Object protoype has a prop called properties, it is now a SHARED PROPERTY, which is not what we want to show

// INSTEAD DO THIS, though it is a bit clumbsier
Object.prototype.properties = function() {
	var result = [];
	for (var property in this) {
		if (this.hasOwnProperty(property))
			result.push(property);
	}
	return result;
};
var test = {"Fat Igor": true, "Fireball": true};
test.properties();
// ["Fat Igor", "Fireball"]

// can also do it a bit more high-level
function forEachIn(object, action) {
	for (var property in object) {
		if (object.hasOwnProperty(property))
			action(property, object[property]);
	}
}

// Though here more sophisticated//safe way to do this
function forEachIn(object, action) {
	for (var property in object) {
		if (Object.prototype.hasOwnProperty.call(object, property))
			action(property, object[property]);
	}
}

/**************************************************OBJECTS AS DICTIONARIES**************************************************/
// Some properties are HIDDEN and will not show up when going over props in for/in loops.
// Browsers in the Gecko family (FIREFOX) gives an object a hidden _proto_ property, which points to the prototype of that obj
// hasOwnProperty will return true for _proto_ eventhough the program did not specifically add it, but
// there is a method call propertyIsEnumerable which does mostly the same thing as hasOwnProperty but returns false for hidden ones
var object = {foo: "bar"};
Object.prototype.propertyIsEnumerable.call(object, "foo"); // true
// This is one of the not so great JS design aspects

// Objects play both the role of "values with methods" for which prototypes are great, and "sets of props", which prototypes just get in the way of.
// Writing ^ that expression every time you need to check for a property is awkward, its better to write a constructor and
// a prototype for this situation, where an object is viewed as a set of properties
// b/c use can use it to look things up by name, it is called a DICTIONARY
// it can be called with NO args, in which case it will create an empty dictionary
// it exposes 4 methods:
// 1. store, adds a value under a given key
// 2. lookup, to retrieve a value
// 3. contains, to test whether a key is present
// 4. each, iterates over the dictionaires contents
function Dictionary(startValues) {
	this.values = startValues || {};
}
Dictionary.prototype.store = function(name, value) {
	this.values[name] = value;
};
Dictionary.prototype.lookup = function(name) {
	return this.values[name];
};
Dictionary.prototype.contains = function(name) {
	return Object.prototype.propertyIsEnumerable.call(this.values, name);
};
Dictionary.prototype.each = function(action) {
	forEach(this.values, action);
};
// now approaching objs as sets of properties has been "encapsulated" in a convenient interface: 1 constructor and 4 methods

/**************************************************SPECIFYING AN INTERFACE**************************************************/
// when writing an interface, it's good practice to add a comment of what it does and how it works
// the DISTINCTION between the EXTERNAL INTERFACE of an obj and ints INTERNAL DETAILS is important for 2 reasons
// 1. Having a small, clearely described interface makes an obj easier to use.
// 2. it's often necessary or practical to change something about the internal implementation of an object type (a Class)
// to make it more efficient, or to fix a mistake.  SO, when outside code is accessing every single prop and detail in the obj,
// you can't change any of them w/out also updating a lot of other code, keeping the interface small helps with that.
// SOME PEOPLE never include props in the interface of an obj, only the METHODS EX: obj.getLength isntead of obj.length
// MOSTLY THIS IS NOT WORTH IT AND JUST ADDS MEANINGLESS CODE

