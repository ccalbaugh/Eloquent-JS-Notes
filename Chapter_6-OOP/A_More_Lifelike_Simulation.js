// all living things in the Terrarium will now get an energy property
/**************************************************INHERITANCE**************************************************/
// We need to create a new processCreature method for the Terrarium, and the cleanest solution in this case is to
// make the old prototype object the prototype of the new prototype object, so it will automatically have all its properties
function clone(object) {
	function OneShotConstructor(){}
	OneShotConstructor.prototype = object;
	return new OneShotConstructor();
}

function LifeLikeTerrarium(plan) {
	Terrarium.call(this, plan);
}

LifeLikeTerrarium.prototype = clone(Terrarium.prototype); // This is inheritance
LifeLikeTerrarium.prototype.constructor = LifeLikeTerrarium;

// Inheritance in most languages with explicit support for OOP is straightforward, not so in JS.  But, there are many different
// approaches to this in JS, which programmers get to pick and choose based on their situation, which afford certain tricks
// that would be impossible in other languages

/**************************************************KEEPING TRACK OF ENERGY**************************************************/
LifeLikeTerrarium.prototype.processCreature = function(creature) {
	var energy, action, self = this;
	function dir() {
		if (!directions.contains(action.direction)) return null;
		var target = point.add(directions.lookup(action.direction));
		if (!self.grid.isInside(target)) return null;
		return target;
	}

	action = creature.object.act(this.listSurroundings(creature.point));

	if (action.type == "move") {
		energy = this.creatureMove(creature.object, creature.point, dir());
	} else if (action.type == "eat") {
		energy = this.creatureEat(creature.object, dir());
	} else if (action.type == "photosynthesize") {
		energy = -1;
	} else if (action.type == "reproduce") {
		energy = this.creatureReproduce(creature.object, dir());
	} else if (action.type == "wait") {
		energy = 0.2;
	} else {
		throw new Error("Unsupported action: " + action.type);
	}

	creature.object.energy -= energy;
	if (creature.object.energy <= 0) { // removes dead bugs
		this.grid.setValueAt(creature.point, undefined);
	}
};

LifeLikeTerrarium.prototype.creatureMove = function(creature, from, to) {
	if (to != null && this.grid.valueAt(to) == undefined) {
		this.grid.moveValue(from, to);
		from.x = to.x; from.y = to.y; // this line is because the code in processCreatures that removes dead creates wont be able to find it otherwise
	}
	return 1;
};

LifeLikeTerrarium.prototype.creatureEat = function(creature, source) {
	var energy = 1;
	if (source != null) {
		var meal = this.grid.valueAt(source);
		if (meal != undefined && meal.energy) {
			this.grid.serValueAt(source, undefined);
			energy -= meal.energy;
		}
	}
	return energy;
};

LifeLikeTerrarium.prototype.creatureReproduce = function(crature, target) {
	var energy = 1;
	if (target != null && this.grid.valueAt(target) == undefined) {
		var species = characterFromElement(creature);
		var baby = elementFromCharacter(species);
		energy = baby.energy * 2;
		if (craeture.energy >= energy) {
			this.grid.setValueAt(target, baby);
		}
	}
	return energy;
};

/**************************************************ADDING PLANT LIFE**************************************************/
function findDirections(surroundings, wanted) {
	var found = [];
	directions.each(function(name) {
		if (surroundings[name] == wanted) {
			found.push(name);
		}
	});
	return found;
}

function Lichen() {
	this.energy = 5;
}

Lichen.prototype.act = function(surroundings) {
	var emptySpace = findDirections(surroundings, " ");
	if (this.energy >= 13 && emptySpace.length > 0) {
		return {type: "reproduce", direction: randomElement(emptySpace)};
	} else if (this.energy < 20) {
		return {type: "photosynthesize"};
	} else {
		return {type: "wait"};
	}
};

creatureTypes.register(Lichen, "*");

/**************************************************THE HERBIVORE**************************************************/
// The LichenEater
function LichenEater() {
	this.energy = 10;
}

LichenEater.prototype.act = function(surroundings) {
	var emptySpace = findDirections(surroundings, " ");
	var lichen = findDirections(surroundings, "*");

	if (this.energy >= 30 && emptySpace.length > 0) {
		return {type: "reproduce", direction: randomElement(emptySpace)};
	} else if (lichen.length > 0) {
		return {type: "eat", direction: randomElement(lichen)};
	} else if (emptySpace.length > 0) {
		return {type: "move", direction: randomElement(emptySpace)};
	} else {
		return {type: "wait"};
	}
	creatureTypes.register(LichenEater, "c");
};

/**************************************************ARTIFICIAL STUPIDIDITY**************************************************/
function CleverLichenEater() {
	this.energy = 10;
	this.direction = "ne";
}

CleverLichenEater.prototype.act = function(surroundings) {
	var emptySpace = findDirections(surroundings, " ");
	var lichen = findDirections(surroundings, "*");

	if (surroundings[this.direction] != " " && emptySpace.length > 0) {
		this.direction = randomElement(emptySpace);
	}

	if (this.energy >= 30 && emptySpace.length > 0) {
		return {type: "reproduce", direction: randomElement(emptySpace)};
	} else if (lichen.length > 0) {
		return {type: "eat", direction: randomElement(lichen)};
	} else if (emptySpace.length > 0) {
		return {type: "move", direction: randomElement(emptySpace)};
	} else {
		return {type: "wait"};
	}
};
creatureTypes.register(LichenEater, "c");