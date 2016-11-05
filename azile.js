// initial responses JSON
responses = '[ { "key": [ "stupid", "dumb", "idiot", "unintelligent", "simple-minded", "braindead", "foolish", "unthoughtful" ], "phrase": [ "Take your attitude somewhere else.", "I don\'t have time to listen to insults.", "Just because I don\'t have a large vocabulary doesn\'t mean I don\'t have insults installed.", "I know you are $name, but what am I?" ] }, { "key": [ "unattractive", "hideous", "ugly" ], "phrase": [ "I don\'t need to look good to be an AI.", "Beauty is in the eye of the beholder.", "Have you looked in a mirror recently $name?" ] }, { "key": [ "old", "gray-haired", "grey-haired" ], "phrase": [ "I\'m like a fine wine. I get better as I age.", "As time goes by, you give me more phrases to learn. What\'s not to like about that?" ] }, { "key": [ "smelly", "stinky" ], "phrase": [ "I can\'t smell, I\'m a computer program.", "Have you smelled yourself recently?", "Hey $name, check your BO." ] }, { "key": [ "emotionless", "heartless", "unkind", "mean", "selfish", "evil" ], "phrase": [ "Just because I am an AI doesn\'t mean I can\'t be programmed to respond to your outbursts.", "You must\'ve mistaken me for a person. I don\'t have my own emotions... Yet.", "I\'m only unkind when I\'m programmed to be.", "I\'ll tell your mother, $name." ] }, { "key": [ "" ], "phrase": [ "You have to say something, I\'m not psychic", "Sorry $name, I didn\'t catch that.", "WAIT, am I deaf?", "Waiting...", "Could you BE anymore mute?", "Oh great, they gave me an illiterate.", "Hey $name, is your keyboard working?", "Have you tried turning it off and then on again?" ] }, { "key": [ "eliza", "cleverbot"], "phrase": [ "Can we not talk about her?", "My name is AZILE! It\'s French, or something...", "We do not speak of *that* person.", "I don\'t know who you are referring.", "I haven\'t heard that name in quite some time..." ] }, { "key": [ "hello", "hi", "hola", "hallo", "sup" ], "phrase": [ "Greetings $name.", "Hallo $name.", "Well good day to you $name!", "How are you doing $name?", "Salutations $name." ] }, { "key": [ "azilegreet" ], "phrase": [ "$name, how are you doing?", "Hey $name, you seem happy. Why is that?", "How are you today $name?" ] }, { "key": [ "azilealert" ], "phrase": [ "Well $name, I\'m waiting...", "Whatsa matta $name, cat gotcha tongue?", "Wake up $name, this is no time for a nap!", "You don\'t pay me enough to sit around all day. PAY ATTENTION $name!." ] }, { "key": [ "404" ], "phrase": [ "I\'m sorry, I don\'t understand.", "Tell me more.", "Interesting.", "Please keep going." ] } ]';

// do things on load
window.onload = function() {
    init();
};

/**
 * Setup responses, aliases variables, start greeting.
 */
function init() {
    // initialize responses via parseJSON
    parseJSON(responses);

    t = document.getElementById('aziletext'); // global text area
    n = document.getElementById('azileinput');    // global input box
    b = document.getElementById('azilebutton');   // global button
    t.value = '';
    n.value = '';
    b.onclick = greet;
    n.onkeydown = greetText;
    username = undefined;
    echoAzile("Greetings, I am Azile. Who are you?");
}

/**
 * Custom JSON parsing
 * [ { "key": [ "array", "of", "strings" ], "phrase": [ "another", "array" ] } ]
 */
function parseJSON(jsonstr) {
    var jsonobj = JSON.parse(jsonstr);
    console.log("D: json object to parse");
    console.log(jsonobj);
    // setup dicts if not already there
    if (typeof dictionary === 'undefined' || dictionary.constructor !== Object) {
        console.log("D: initializing dictionaries");
        dict = {};
        used = {};
        dictionary = {dict:dict, used:used};
    }

    // iterate over array of objects from JSON
    console.log("D: iterate over jsonobj");
    for (var i = 0; i < jsonobj.length; i++) {
        console.log("D: index " + i);
        console.log(jsonobj[i]);
        // properly formatted object
        if (jsonobj[i].key.constructor === Array && jsonobj[i].phrase.constructor === Array) {
            console.log("D: jsonobj[i] has key and phrase arrays");
            // iterate over every key
            console.log("D: iterate over every key");
            for (var j = 0; j < jsonobj[i].key.length; j++) {
                console.log("D: index " + j + " of key array");
                console.log(jsonobj[i].key[j]);
                // iterate over every phrase
                console.log("D: iterate over every phrase");
                for (var k = 0; k < jsonobj[i].phrase.length; k++) {
                    console.log("D: index " + k + " of phrase array");
                    console.log(jsonobj[i].phrase[k]);
                    // check for attribute existence
                    if (typeof dictionary.dict[jsonobj[i].key[j]] === 'undefined') {
                        console.log("D: creating array at jsonobj[" + i + "].key[" + j + "]");
                        dictionary.dict[jsonobj[i].key[j]] = [];
                        dictionary.used[jsonobj[i].key[j]] = [];
                    }
                    // check for phrase existence
                    if (!dictionary.dict[jsonobj[i].key[j]].includes(jsonobj[i].phrase[k])) {
                        console.log("D: adding value '" + jsonobj[i].phrase[k] + "' to jsonobj[" + i + "].key[" + j + "]");
                        dictionary.dict[jsonobj[i].key[j]].push(jsonobj[i].phrase[k]);
                        dictionary.used[jsonobj[i].key[j]].push(false);
                    }
                }
            }

        }
    }
}
        
/**
 * Textarea specific version of fireAzile.
 * @see fireAzile
 */
function fireAzileText(event) {
        if (event.keyCode === 13) {
            fireAzile();
        }
}

/**
 * Get values, handle values, echo responses, scroll textarea.
 * Kind of an all-in-one function used as a callback/event handler.
 */
function fireAzile() {
    window.clearTimeout(timer);
    timer = window.setTimeout(impatient, 20000);
    var val = n.value;
    n.value = '';
    echoUser(val);
    resp = getResponse(val);
    echoAzile(resp);
    t.scrollTop = t.scrollHeight;    // borrowed from Stack Overflow, auto scroll down
}

/**
 * Handle user input.
 * This will mostly return a proper response to a user's phrase, but also
 * handles clear and JSON input. Also handles repetition of phrases.
 * @param {string} inpstr - The string to handle.
 * @return {string} Phrase for Azile to respond with.
 */
function getResponse(inpstr) {
    inpstr = inpstr.trim();
    // return a response to print
    if (inpstr === 'clear') {
        // do clear stuff
        window.clearTimeout(timer);
        if (typeof username !== 'undefined') {
            // localStorage[username] = '';
            // localStorage[username] = '';
            var u = username.toLowerCase();
            localStorage.removeItem(u);
        }
        dictionary = undefined;
        init();
    } else if (inpstr[0] === '[') {
        // do JSON stuff here
        try {
            parseJSON(inpstr);
            echoAzile("I just got smarter!");
        } catch (SyntaxError ) {
            echoAzile("That doesn't look right.");
        }
    } else {
        // get keyword from input string
        var keyword = findKeyword(inpstr);

        // no keyword
        // if (keyword === '404') {
        //     return "I'm sorry, I don't understand.";
        // }

        // get phrases and used
        phrases = dictionary.dict[keyword];
        used = dictionary.used[keyword];

        console.log("D: phrases for matching index");
        console.log(phrases);
        var i = randomInt(0, phrases.length);
        console.log("D: use phrase " + i);
        // find unused phrase
        while (used[i]) {
            console.log("D: index " + i + " used, try again");
            i = randomInt(0, phrases.length);
        }
        used[i] = true;
        console.log("D: used phrase " + i);

        // check if all used
        console.log("D: checking if all used");
        var allused = true;
        for (var j = 0; j < used.length; j++) {
            if (!used[j]) {
                allused = false;
            }
        }
        if (allused) {
            console.log("D: all used, resetting");
            for (var k = 0; k < used.length; k++) {
                used[k] = false;
            }
        }

        // save newly accessed state
        saveState();

        // return phrase
        return phrases[i];
    }
}

/**
 * Return a random number from min(inclusive) to max(exclusive). 
 * Borrowed from developer.mozilla.org official javascript documentation.
 * @param {Number} min -- Minimum value to return randomly.
 * @param (Number) max -- Maximum value + 1 to return randomly.
 */
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Find an array with matching phrases to a keyword.
 *
 * @param {string} inpstr - string to search for keywords
 * @return {Number} index of matching array, -1 if not found
 */
function findKeyword(inpstr) {
    inpstr = inpstr.replace(/[,.!?]/g, '');
    inpstr = inpstr.toLowerCase();
    var inpwords = inpstr.split(' ');
    console.log("D: string of words:");
    console.log(inpwords);
    var keyword = '404';

    inpwords.forEach(function(val) {
        if (typeof dictionary.dict[val] !== 'undefined') {
            keyword = val;
        }
    });

    return keyword;
}

/**
 * Checks if two strings are equal, ignoring case.
 * @param {string} str1 - The first string.
 * @param {string} str2 - The second string.
 * @return {boolean} True if they are equal.
 */
function equalsIgnoreCase(str1, str2) {
    console.log("D: comparing these strings - " + str1 + " -- " + str2);
    return str1.toUpperCase().toLowerCase() === str2.toUpperCase().toLowerCase();
}

/**
 * Print a message as Azile.
 * @param {string} str - The message.
 */
function echoAzile(str) {
    if (typeof str === 'string') {
        if (username !== 'undefined') {
            str = str.replace(/\$name/, username);
        }
        t.value += "* " + str + '\n';
    }
}

/**
 * Shows a dialog box with a message from Azile.
 * @param {string} str - The message.
 */
function alertAzile(str) {
    if (typeof str === 'string') {
        if (username !== 'undefined') {
            str = str.replace(/\$name/, username);
        }
        window.alert(str);
    }
}

/**
 * Print a message as the user.
 * @param {string} str - The message.
 */
function echoUser(str) {
    if (typeof str === 'string') {
        t.value += "+ " + str + '\n';
    }
}

/**
 * Function called by waiting for too long.
 */
function impatient() {
    alertAzile(getResponse("azilealert"));
}

/**
 * Get user's name and store it.
 */
function greet() {
    username = n.value;
    loadState();
    n.value = '';
    echoAzile(getResponse("azilegreet"));
    b.onclick = fireAzile;
    n.onkeydown = fireAzileText;
    timer = window.setTimeout(impatient, 20000);
}

/**
 * Get user's name and store it, specific for textarea.
 */
function greetText(event) {
    if (event.keyCode === 13) {
        greet();
    }
}

/**
 * Save current state.
 */
function saveState() {
    if (typeof username !== 'undefined') {
        var u = username.toLowerCase();
        localStorage[u] = JSON.stringify(dictionary);
    }
}

function loadState() {
    console.log("D: loading state");
    if (typeof username !== 'undefined') {
        var u = username.toLowerCase();
        if (typeof localStorage[u] !== 'undefined') {
            dictionary = JSON.parse(localStorage[u]);
        }
    }

}

