/**************************************************SYNTAX**************************************************/
// Patterns specified by a regulard expression can allow some of their elements to match more than a single character.

/**************************************************MATCHING SETS OF CHARACTERS**************************************************/
var asteriskOrBrace = /[\{\*]/;
var story = "We notices the *giant sloth*, hanging from a giant branch.";
story.search(asteriskOrBrace); // 15

// [ and ] have a special meaning inside a regexp.  They enclose a list of chars and will match when one of these chars is found.
// most punctuation chars have special meaning in a regexp so it's best to escape them until you know otherwise
// There are a few chars that actually refer to whole sets of chars w/in a regexp
// The dot (.) can be used to mean "any char that is not a line-break character".
// An escaped d (\d) means "any digit"
// An escaped w (\w) matches any "word" characters, meaning alphabetic, digits, and the underscore.
// An escaped s (\s) matches any whitespace char (things such as tabs, newlines, and spaces).

var digitSuroundedBySpace = /\s\d\s/;
"ta 2 3d".search(digitSuroundedBySpace); // 2

// If you replace the \d, \w, \s with capital letters to negate their meanings.
// [ and ] can be inverted by starting with a ^ character:
var notABC = /[^ABC]/;
"ABCBACCBBADABC".search(notABC); // 10

// We can now match a date format XX/XX/XXXX
var datePattern = /\d\d\/\d\d\/\d\d\d\d/;
"born 15/11/2003 (mother Spot): White Fang".search(datePattern); // 5

/**************************************************MATCHING WORD AND STRING BOUNDARIES**************************************************/
// Sometimes a pattern needs to start at the start of a string and end at the end of a string.  You can use special chars ^ and $ to do this.
// ^ matches the beginning of a string and & matches the end.
/a/.test("blah"); // true
/^a&/.test("blah"); // false

// Regexps are objects and have methods.  Their test method returns a Boolean indicating matches.
// The \b escape char matches a "word boundary" which can be PUNCTUATION, WHITESPACE, or the START or END of a string
/cat/.test("concatenate"); // true
/\bcat\b/.text("concatenate"); // false

/**************************************************REPEATING PATTERNS**************************************************/
// You can express the repeating of subpatterns in a regexp
// An asterisk (*) after an element allows it to be repeated any number of times, including 0
// A plus (+) requires the pattern to occur atleast 1 time
// A question mark (?) makes an element "optional" -- occuring zero or one time
var parentheticText = /\(.*\)/;
"Its (the sloth's) claws were gigantic!".search(parentheticText); // 4

// You can use braces to specify the number of times an element may occur.  {4} give the exact number of times it must occur
// {3, 10} indicate the pattern must occur at least as often as the low and at most the high, also {2,} means two or more
// and {,4} means four or less.  These are more flexible for matching dates
var datePattern = /\d{1,2}\/\d\d?\/\d{4}/;
"born 15/11/2003 (mother Spot): White Fang".search(datePattern); // 5

/**************************************************GROUPING SUBEXPRESSIONS**************************************************/
// It's often necessary to use special chars like * or + on more than one char at a time.  You can group parts of a regexp
// together w/ parens and then do something with the whole group, ex:
var cartoonCrying = /boo(hoo+)+/i;
cartoonCrying.test("Boohooooohoohooo"); // true

// After the closing / "options" may be added to a regexp, in this case the i means the expression is case-insensitive
// g means global

/**************************************************CHOOSING BETWEEN ALTERNATIVES**************************************************/
// For more advanced "brancing" patterns, we can use a pipe char (|) to allow a pattern to make a choice between several elements.
var holyCow = /\b(sacred|holy) (cow|bovine|bull|taurus)\b/i;
holyCow.test("Sacred bovine!"); // true