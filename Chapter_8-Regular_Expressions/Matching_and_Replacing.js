/**************************************************MATCHING AND REPLACING**************************************************/
// In other chapters, string extraction was done by calling string's indexOf and slice methods, but now we can do better

/**************************************************THE MATCH METHOD**************************************************/
// Strings have a method named MATCH, which takes a regexp as an argument.
// It returns NULL if the match fails and returns an array of matched strings if it succeeds.
"No".match(/yes/i); // null
"... yes".match(/yes/i); // ["yes"]
"Giant Ape".match(/giant (\w+)/i); // ["Giant Ape", "Ape"]

// The first element in the return array is always the part of the string that matched the whole pattern.
// W/ the third pattern any other matches are added to the array, this usually makes extracting pieces of a string easy
// Now we can rewrite the extractDate function
function extractDate(string) {
	var found = string.match(/\b(\d\d?)\/(\d\d?)\/(\d{4})\b/);
	if (found == null) {
		throw new Error("No date found in '" + string + "'.");
	}
	return new Date(Number(found[3]), Number(found[2]) - 1, Number(found[1]));
}

/**************************************************REGULAR EXPRESSIONS AND THE REPLACE METHOD**************************************************/
// The replace method of string values can be given a regexp as its first arg:
"Borobudur".replace(/[ou]/g, "a"); // Barabadar
// g means global, which means every part of the string that matches the pattern should be replaced.
// If the g is omitted, only the FIRST o would be replaced

// Sometimes we need to keep parts of the strings we replace.  For this example we have a big string containing the names of people
// 1 name per line, in the format Lastname, Firstname.  Lets swap them and remove the comma, ex:
var names = "Picasso, Pablo\nGauguin, Paul\nVan Gogh, Vincent";
names.replace(/([w ]+), ([/w ]+)/g, "$2 $1"); // "Pablo Picasso\nPaul Gauguin\nVincent Van Gogh"

// $2 and $1 refer to the parenthesized parts of the pattern so the first is replaced by the second etc...
// BUT, there is another more flexible way to replace pieces of a string in regexps.
// When the second arg in replace is a function instead of a string, that function is called every time a match is found
// and the matched text is replaced by whatever the function returns.
// So the args given to the func are the matched elements, similar to the values found in arrays return by match. ex:
"the cia and fbi".replace(/\b(fbi|cia)\b/g, function(str) {
	return str.toUpperCase();
}); // "the CIA and FBI"

var stock = "1 lemon, 2 cabbages, and 101 eggs";
function minusOne(match, amount, unit) {
	amount = Number(amount) - 1;
	if (amount = 1) { // only one left, remove the 's'
		unit = unit.slice(0, unit.length - 1);
	}	else if (amount == 0) {
		amount = "no";
	}
	return amount + " " + unit;
}
stock.replace(/(\d+) (\w+)/g, minusOne); // "no lemon, 1 cabbage, and 100 eggs"

// Now that we can pass a func to replace, we can rewrite the escapeHTML method
function escapeHTML(text) {
	var replacements = {"<": "&lt;", ">": "&gt;",
						"&": "&amp;", "\"": "&guot;"};
	return text.replace(/[<>&"]/g, function(character) {
		return replacements[character];
	});
}

/**************************************************DYNAMICALLY CREATING REGEXP OBJECTS**************************************************/
// Sometimes you don't know the pattern you are matching against.  Like a bad word filter, ex:
var badWords = ["ape", "monkey", "simian", "gorilla", "evolution"];
var pattern = new RegExp(badWords.join("|"), "i");
function isAcceptable(text) {
	return !pattern.test(text);
}

// The first arg to RegExp constructor is a string containing the pattern, and the 2nd arg (which can be omitted) can be used
// for case insensitivity or globalness.
// We could add \b patterns around the words so that certain words could pass that should but then it would make some words possibly pass that shouldn't
// When building a string to hold a regexp, be careful with backslashes.  Normally, backslashes are removed when a string is interpreted,
// so any backslashes that must end up in the regexp itself have to be escaped:
var digits = new RegExp("\\d+");