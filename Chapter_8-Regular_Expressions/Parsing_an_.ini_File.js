/**************************************************PARSING AN .INI FILE**************************************************/
// Now lets face the REAL problem that regexps solve.  Imagine we're writing a program to automatically harvest info about our enemies
// from the internet.  We're not writing a program like that here, just the part that reads the config file. ex:
searchengine=http://www.google.com/search?q=$1
spitefulness=9.7

; comments are preceded by a semicolon...
; these are sections, concerning individual enemies
[larry]
fullname=Larry Doe
type=kindergarten bully
website=http://www.geocities.com/CapeCanaveral/11451

[gargame1]
fullname=gargame1
type=evil sorcerer
outputdir=/home/marijn/enemies/gargame1

// The exact rules for this format (which is actually a widely used format, called .ini) are as follows:
// - Blank lines and lines starting w/ semicolons are ignored
// - Lines wrapped in [ and ] start a new section
// - Lines containing an alphanumeric identifier followed by an = char add a setting to the current section.
// - Anything else is invalid

// The task is to convert a streing like this into an array of objs, each w/ a name and an array of name/value pairs.
// We need one such obj for each section and one for the section-less settings.
// b/c the format has to be processed line-by-line, splitting it up into separate lines is a good start.
// So far, we have used string.split("\n") for this.  Some OS use not just a \n char to separate lines but a
// carriage return char followed by a newline ("\r\n").

// Given that split allows a regexp as it's arg, the following func splits a string into an array of lines, allowing both \n an \r\n between them
function splitLines(string) {
	return string.split(/\r?\n/);
}

// This gives us all we need to write our .ini file parsing func:
function parseINI(string) {
	var lines = splitLines(string);
	var categories = [];

	function newCategory(name) {
		var cat = {name: name, fields: []};
		categories.push(cat);
		return cat;
	}
	var currentCategory = newCategory("TOP");

	forEach(lines, function(line) {
		var match;
		if (/^\s*(;.*)?$/.test(line)) {
			return;
		} else if (match = line.match(/^\[(.*)\]$/)) {
			currentCategory = newCategory(match[1]);
		} else if (match = line.match(/^(\w+)=(.*)?/)) {
			currentCategory.fields.push({name: match[1], value: match[2]});
		} else {
			throw new Error("line '" + line + "' is invalid.");
		}
	});

	return categories;
}

// In short, the code goes over every line in t6he file.  It keeps a "current category" obj, and when it finds a normal directive, adds it to the obj.
// When is comes across a line that starts a new cat., it replaces the current cat. w/ the new one, to which subsequent directives will be added.
//  FINALLY, it returns an array containing all the categories it came across.

// ^ and $ are recurring to make sure the expreession matches the whole line, not just part of it.

// /^\s*(;.*)?$/ can be used to test for lines that can be ignored.  The part between the () will match comments, and the ? after that will
// make sure it also matches lines of whitespace.

// The pattern if (match = string.match(...)) is something you'll commonly see when using regexps. You typically aren't completely
// sure that your expression will match and you do not want your code to try to evaluate something like null[1], so you need to test
// whether match returns a non-null value.  You can assign this result to a var as the test for if and do the matching and the testing in single line.

// CONCLUSION
// Regexp's can make string-mangling code much shorter.  The syntax is called Perl Compatible Regular Expressions, and is in a lot of languages
