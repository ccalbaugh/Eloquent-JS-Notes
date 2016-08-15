// Inheritance is used to make programmers write less code

// Inheriance is the creation of a new type of objects, (THE SUBTYPE)
// which is based on an existing type, (THE SUPERTYPE)
// THE SUBTYPE inherits all the properties and methods of the supertype and then
// modifies a few of these or add mew ones.
/**************************************************TYPE-DEFINITION UTILITIES**************************************************/
// adding some function to take care of common operations can smooth out the clumsiness of using the new keywords and prototype property
Object.prototype.inherit = function(baseConstructor) {
	this.prototype = clone(baseConstructor.prototype);
	this.prototype.constructor = this;
};
Object.prototype.method = function(name, func) {
	this.prototype[name] = func;
};

function StrangeArray(){}
StrangeArray.inherit(Array);
StrangeArray.method("push", function(value) {
	Array.prototype.push.call(this, value);
	Array.prototype.push.call(this, value);
});

var strange = new StrangeArray();
strange.push(4); // [4, 4]

/**************************************************PROTOTYPES AS TYPES**************************************************/
// with a few simple helper methods added to Object.prototype, it is possible to create an alternative approach to objects and inheritance. (i.e. constructors and prototypes)
// In this approach, a type is separated by its prototype
Object.prototype.create = function() {
	var object = clone(this);
	if (object.construct != undefined) {
		object.construct.apply(object, arguments);
	}
	return object;
};

Object.prototype.extend = function(properties) {
	var result = clone(this);

	forEachIn(properties, function(name, value) {
		result[name] = value;
	});
	return result;
};

/**************************************************A WORLD OF OBJECTS**************************************************/
var Item = {
	construct: function(name) {
		this.name = name;
	},
	inspect: function() {
		print("it is ", this.name, ".");
	},
	kick: function() {
		print("Pow");
	},
	take: function() {
		print("you cannot lift ", this.name, ".");
	}
};

var lantern = Item.create("the brass lantern");
lanter.kick();

// and now for some more inheritance
var DetailedItem = Item.extend({
	construct: function(name, details) {
		Item.construct.call(this, name);
		this.details = details;
	},
	inspect: function() {
		print("you see ", this.name, ". ",this.details,".");
	}
});

var giantSloth =
	DetailedItem.create("the giant sloth",
						"it is quietly hanging from a tree, munching leaves");
giantSloth.inspect();

// most of the time, a subtype's constructor should start by calling the constructor of the supertype, so it starts with
// a valid object of the supertype, which it can then extend.
// With this new approach to prototypes, types that need no constructor can leave it out, b/c they automatically
// inherit the constructor of the SUPERTYPE.  Shown below:
var SmallItem = Item.extend({
	kick: function() {
		print(this.name, " flies across the room");
	},
	take: function() {
		// the code that takes stuff
		print("you take ", this.name, ".");
	}
});

var pencil = SmallItem.create("the red pencil");
pencil.take();
// So eventhough SmallItem does not DEFINE it own constructor, creating it with a name arg works, b/c it inherited the constructor from Item prototype

/**************************************************THE INSTANCEOF OPERATOR**************************************************/
// when not using regular constructors, instanceof can get clumsy b/c it expects a constructor in it's 2nd arg but we only have prototypes, so we have a way around that
Object.prototype.isA = function(prototype) {
	function DummyConstructor() {}
	DummyConstructor.prototype = prototype;
	return this instanceof DummyConstructor;
};

pencil.isA(Item); // true
pencil.isA(DetailedItem) // false

/**************************************************MIXING TYPES**************************************************/
// now we want to make a small item that has a detailed description.  Unfortunately, JS does not allow an obj to have multiple prototypes
// MULTIPLE INHERITANCE - derives an obj type from more than one parent type
// a MIX-IN is a specific kind of prototype type that can be "mixed into" other prototypes.  Which will suffice for MI most of the time
// So with SmallItem, we need to copy its kick and take methods into another prototype, which will mix smallness into this prototype
function mixInto(object, mixIn) {
	forEachIn(mixIn, function(name, value) {
		object[name] = value;
	});
};

var SmallDetailedItem = clone(DetailedItem);
mixInto(SmallDetailedItem, SmallItem);

var deadMouse = SmallDetailedItem.create("Fred the mouse", "he is dead");
deadMouse.inspect();
deadMouse.kick();

// So what if the MIX-IN has a constructor?
var Monster = Item.extend({
	construct: function(name, dangerous) {
		Item.construct.call(this, name);
		this.dangerous = dangerous;
	},
	kick: function() {
		if (this.dangerous) {
			print(this.name, " bites your head off");
		} else {
			print(this.name, " squeaks and runs away.");
		}
	}
});

var DetailedMonster = DetailedItem.extend({
	construct: function(name, description, dangerous) {
		DetailedItem.construct.call(this, name, description);
		Monster.construct.call(this, name, dangerous);
	},
	kick: Monster.kick
});

var giantSloth = DetailedMonster.create(
	"the giant sloth",
	"it is quietly hanging from a tree, muhcing leavers",
	true);
giantSloth.kick();