// This file is going to consist of a virtual terrarium, a tank with insects moving around inside it.
/**************************************************DEFINING THE TERRARIUM**************************************************/
var thePlan = ["##############################",
			   "#       #    #     o        ##",
			   "#                            #",
			   "#           ####             #",
			   "##         #    #    #       #",
			   "###            ##    #       #",
			   "#            ###             #",
			   "#   #####                    #",
			   "#   ##             o         #",
			   "#  O  #          O        ####",
			   "#     #                      #",
			   "##############################"];

/**************************************************POINTS IN SPACE**************************************************/
function Point(x, y) {
	this.x = x;
	this.y = y;
}
Point.prototype.add = function(other) {
	return new Point(this.x + other.x, this.y + other.y);
};

/**************************************************REPRESENTING THE GRID**************************************************/
// Whenever you find yourself about to mix data representation and problem-specific code in one data type, don't.
function Grid(width, height) {
	this.width = width;
	this.height = height;
	this.cells = new Array(width * height);
}
Grid.prototype.valueAt = function(point) {
	return this.cells[point.y * this.width + point.x];
};
Grid.prototype.setValueAt = function(point, value) {
	this.cells[point.y * this.width + point.x] = value;
};
Grid.prototype.isInside = function(point) {
	return point.x >= 0 && point.y >= 0 &&
		   point.x < this.width && point.y < this.height;
};
Grid.prototype.moveValue = function(from, to) {
	this.setValueAt(to, this.valueAt(from));
	this.setValueAt(from, undefined);
};
Grid.prototype.each = function(action) {
	for (var y = 0; y < this.height; y++) {
		for (var x = 0; x < this.width; x++) {
			var point = new Point(x, y);
			action(point, this.valueAt(point));
		}
	}
};

/**************************************************A BUG'S PROGRAMMING INTERFACE**************************************************/
var directions = new Dictionary({
	"n": new Point(0, 1),
	"ne": new Point(1, -1),
	"e": new Point(1, 0),
	"se": new Point(1, 1),
	"s": new Point(0, 1),
	"sw": new Point(-1, 0),
	"w": new Point(-1, 0),
	"nw": new Point(-1, 1)
});

/**************************************************THE TERRARIUM OBJECT**************************************************/
var wall = {};

var creatureTypes = new Dictionary();

creatureTypes.register = function(constructor, character) {
	constructor.prototype.character = character;
	this.store(character, constructor);
}

function elementFromCharacter(character) {
	if (character == " ") {
		return undefined;
	} else if (character == "#") {
		return wall;
	} else if (creatureTypes.contains(character)) {
		return new (creatureTypes.lookup(character))();
	} else {
		throw new Error("Unkown character: " + character);
	}
}

function Terrarium(plan) {
	var grid = new Grid(plan[0].length, plan.length);
	for (var y = 0; y < plan.length; y++) {
		var line = plan[y];
		for (var x - 0; x < line.length; x++) {
			grid.setValueAt(new Point(x, y), elementFromCharacter(line.charAt(x)));
		}
	}
	this.grid = grid;
}

wall.character = "#";
StupidBug.prototype.character = "o";

function characterFromElement(element) {
	if (element == undefined)
		return " ";
	else
		return element.character;
}

Terrarium.prototype.toString = function() {
	var characters = [];
	var endOfLine = this.grid.width - 1;

	this.grid.each(function(point, value) {
		characters.push(characterFromElement(value));
		if (point.x == endOfLine)
			characters.push("\n");
	});
	return characters.join("");
}

// METHOD BINDING/CLOSURE PRACTICE: 2 OPTIONS
// OPTION 1
function bind(func, object) {
	return function() {
		return func.apply(object, arguments);
	};
}

var x = [];
var pushX = bind(x.push, x);
pushX("A");
pushX("B");
x; // ["A", "B"]

// OPTION 2
function method(object, name) {
	return function() {
		return object[name].apply(object, arguments);
	};
}
var pushX = method(x, "push");

/**************************************************ANIMATING LIFE**************************************************/
Terrarium.prototype.listActingCreatures = function() {
	var found = [];
	this.grid.each(function(point, value) {
		if (value != undefined && value.act)
			found.push({object: value, point: point});
	});
	return found;
};

Terrarium.prototype.listSurroundings = function(center) {
	var result = {};
	var grid = this.grid;
	directions.each(function(name, direction) {
		var place = center.add(direction);
		if(grid.isInside(place))
			result[name] = characterFromElement(grid.valueAt(place));
		else
			result[name] = "#";
	});
	return result;
};

Terrarium.prototype.processCreature = function(creature) {
	var action = creature.object.act(this.listSurroundings(creature.point));
	if (action.type == "move" && directions.contains(action.direction)) {
		var to = point.add(directions.lookup(action.direction));
		if (this.grid.isInside(to) && this.grid.valueAt(to) == undefined)
			this.grid.moveValue(creature.point, to);
	}
	else {
		throw new Error("Unsupported action: " + action.type);
	}
};

Terrarium.prototype.step = function() {
	forEach(this.listActingCreatures(), bind(this.processCreature, this));
};

/**************************************************IT MOVES**************************************************/
var terrarium = new Terrarium(thePlan);
terrarium.step();
print(terrarium);

Point.ptorotype.toString = function() {
	return "(" + this.x + "," + this.y + ")";
};

/**************************************************MORE LIFE FORMS**************************************************/
function BouncingBug() { // this bug goes until it hits an obstacle and then heads diagonally in the opposite direction
	this.direction = "ne";
}

BouncingBug.prototype.act = function(surroundings) {
	if (surroundings[this.direction] != " ") {
		this.direction = (this.direction == "ne" ? "sw" : "ne");
	}
	return {type: "move", direction: this.direction};
}

creatureTypes.register(BouncingBug, "%");

function randomInteger(below) {
	return Math.floor(Math.random() * below);
}
// the * "scales" up the range of the random number and Math.floor makes sure it becaomse a whole number

Dictionary.prototype.names = function() {
	var names = [];
	this.each(function(name, value) {names.push(name);});
	return names;
};

function randomElement(array) {
	if (array.length == 0) {
		throw new Error("The array is empty.");
	}
	return array[Math.floor(Math.random() * array.length)];
}

function DrunkBug() {}; // Just moves randomly

DrunkBug.prototype.act = function(surroundings) {
	return {type: "move", direction: randomElement(directions.names())};
};
creatureType.register(DrunkBug, "~");