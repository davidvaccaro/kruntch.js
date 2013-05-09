//
// Kruntch.js - 1.1.0
//
// The MIT License (MIT)
//
// Copyright (c) 2013 David Vaccaro
//
// http://www.kruntch.com
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

(function (Kruntch, undefined) {

    // Private Member Functions
	var keywords = {
		'if': true,
		'for': true,
		'with': true,
		'elseif': true,
		'else': true,
		'first': true,
		'last': true,
		'nth': true,
		'empty': true
	};

    // Determine of the specified charachter is "whitespace"
    function isWhitespace(c) {
        if ((c == ' ') || (c == '\r') || (c == '\n'))
            return true;
        return false;
    };

    // Determine of the specified charachter is "alpha"
    function isAlpha(c) {
        if (((c >= 'a') && (c <= 'z')) ||
        	((c >= 'A') && (c <= 'Z')))
            return true;
        return false;
    };

    // Determine of the specified charachter is "digit"
    function isDigit(c) {
        if ((c >= '0') && (c <= '9'))
            return true;
        return false;
    };

    // Determine of the specified charachter is "alpha-digit"
    function isAlphaDigit(c) {
        if ((isAlpha(c) == true) || (isDigit(c) == true))
            return true;
        return false;
    };

	// Determine if the specified character is a valid "tag" char
    function isID(c) {
        if ((c == ':') || (c == '_') || (c == '-') || (c == '!') || (isAlphaDigit(c) == true))
            return true;
        return false;
    };

	// TemplateTokenizer Priavte Class Definition
	var TemplateTokenizer = function(txt) {

		// Private Data Members
		var index = 0;
		var text = txt;

		// Determine if there are more token data to read
		function hasMoreTokens() {
			if (index >= text.length)
				return false;
			return true;
		};

		// Parse the next token in the stream
		function nextToken() {

			// First, Check the state
			if (this.HasMoreTokens() == false)
				return { text: '', iskeyelement: false };

			// Init the token
			var token = '';

			// Loop until a valid token has been parsed
			while (index < text.length) {

				var isend = false;
				var lhindex = 0;

				// Parse until a < is reached
				while ((index < text.length) && (text.charAt(index) != "<"))
					token += text.charAt(index++);

				// Look ahead at the element
				lhindex = index;

				// Parse the <KruntchToken>

				// Increment past the <
				lhindex++;

				// Move past any whitespace
				while ((lhindex < text.length) && (isWhitespace(text.charAt(lhindex)) == true))
					lhindex++;

				// If the first non-whitespace char is /, this is an ending tag
				if (text.charAt(lhindex) == "/") {

					// Set the flag
					isend = true;

					// Move past the /
					lhindex++;

					// Move past any additional whitespace
					while ((lhindex < text.length) && (isWhitespace(text.charAt(lhindex)) == true))
						lhindex++;

				}

				var tag = '';

				// Accumulate the tag
				while ((lhindex < text.length) && (isID(text.charAt(lhindex)) == true) && (text.charAt(lhindex) != ">"))
					tag += text.charAt(lhindex++);

				// Format the tag
				tag = tag.trim();

				// If this is a key element, return the prior token
				if (keywords[tag] == true) {

					if (token != '')
						return { text: token, iskeyelement: false };
					else {

						// Set the index to the look ahead
						index = lhindex;

						// Build the token
						token = "<" + ((isend == true) ? "/" : "") + tag;

						// Accululate the token to the next >
						while ((index < text.length) && (text.charAt(index) != ">"))
							token += text.charAt(index++);

						// Add the >
						token += ">";

						// Increment
						index++;

						// If this is a Kruntch element, return
						return { text: token, iskeyelement: true, isend: isend };

					}

				}
				else {

					// Set the index to the look ahead
					index = lhindex;

					// Cat on the token
					if ((tag != '') && (tag != undefined) && (tag != null))
						token += "<" + ((isend == true) ? "/" : "") + tag;

				}

			}

			// Return any remaining token
			return { text: token, iskeyelement: false };

		};

		// Public interface
		return {
			HasMoreTokens: hasMoreTokens,
			NextToken: nextToken
		};

	};

	// TemplateIO Default Class Definition
	var TemplateIO = function(node) {

		// Private Member Functions

		// Replace the specified "node" with the "replacement"
		// If the replacement is an HTML element object, replace direclty, otherwise, parse
		// and replace with all nodes contained in the replacement
		function appendNode(parent, text) {

			// Create a new "DIV"
			var el = document.createElement("div");

			// Set the innerHTML
			el.innerHTML = text;

			var nodes = [];

			// Populate the nodes
			for (var i = 0; i < el.childNodes.length; i++)
				nodes.push(el.childNodes[i]);

			// Insert all the nodes
			for (i = 0; i < nodes.length; i++)
				parent.appendChild(nodes[i]);

			// Return
			return;

		};

		// Write out the text
		function writeTemplateText(templateID, text) {

			// If the output "node" supports "Write", pass the call
			if ((node != undefined) && (node.Write != undefined)) {
				node.Write(text);
				return;
			}

			// Append
			appendNode(node, text);

			// Return
			return;

		}

		// Load a specified template from the specified template id
		function readTemplateMarkup(templateID) {

			// If the output "node" supports "Read", pass the call
			if ((node != undefined) && (node.Read != undefined)) {
				return node.Read(templateID);
			}

			var allElements = document.getElementsByTagName('*');
			for (var i = 0; i < allElements.length; i++) {
				var id = allElements[i].getAttribute("data-templateid");
				if ((id != undefined) && (id != null) && (id == templateID)) {
					if (allElements[i].nodeName.toUpperCase() == "TEXTAREA")
						return allElements[i].value;
					else
						return allElements[i].innerHTML;
				}
			}

			// Return
			return '';

		}

		// Public interface
		return {

			Read: readTemplateMarkup,
			Write: writeTemplateText

		};

	};

    // Determine if a value is a number
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    // Merge the members of BOTH the "to" and "from" objects to a third "result" object
    function mergeObjects(toOBJ, fromOBJ) {

        var res = {};

        // Merge the "TO" into the result
        for (m in toOBJ)
            res[m] = toOBJ[m];

        // Merge the "TO" into the result
        for (m in fromOBJ)
            res[m] = fromOBJ[m];

        // Return
        return res;

    };

    // Clone the specified object
    function cloneObject(obj) {
		return mergeObjects({}, obj);
	};

	// Clona the specified template
	function cloneTemplate(tmp) {

		// Clone the template object
		var ctmp = cloneObject(tmp);

		// Create a clean sub-template collection
		ctmp.sub = {};

		// Clone all the sub-templates
		for (var tid in tmp.sub)
			ctmp.sub[tid] = cloneTemplate(tmp.sub[tid]);

		// Return
		return ctmp;

	};

    /**
    * ReplaceAll by Fagner Brack (MIT Licensed)
    * Replaces all occurrences of a substring in a string
    */
    function replaceAll(orig, token, newToken, ignoreCase) {
        var _token;
        var str = orig + "";
        var i = -1;

        if (typeof token === "string") {

            if (ignoreCase) {

                _token = token.toLowerCase();

                while ((
                i = str.toLowerCase().indexOf(
                    token, i >= 0 ? i + newToken.length : 0
                )) !== -1
            ) {
                    str = str.substring(0, i) +
                    newToken +
                    str.substring(i + token.length);
                }

            } else {
                return orig.split(token).join(newToken);
            }

        }
        return str;
    };

    // Parse the Name.Name.Name... property string
    // Examples:
    //  1. Name                      = Value
    //  2. Type.Name.toUpperCase     = Object.Value.Function
    //  3. PrimaryVisit.Cost         = Function.Value
    function parseValue(value, propertyString) {

        var last = value;

        // Split the string
        var parts = propertyString.split('.');

        // Loop over the parts
        for (var pi = 0; pi < parts.length; pi++) {

            // Save the last object
            last = value;

            // Walk the value
            value = value[parts[pi]];

            // Call the function (if the value is a function)
            if ((typeof value) == "function")
                value = value.call(last);

        }

        // Replace undefined and null with empty string
        if ((value == undefined) || (value == null))
            value = '';

        // Return
        return value;

    };

    // Test the specified condition against the specified "view" object
    function testCondition(template, view, condition) {
        return (new Function('return (' + template.root.conditions[condition] + ')')).call(view);
    };

    // Test the specified where criteria against the specified "view" object
    function testWhere(template, view, where) {
        return (new Function('return (' + template.root.wheres[where] + ')')).call(view);
    };

    // Select the collection given the collection value, where criteria and sort
    function selectCollection(template, view, value, where) {

        // Declare the result
        var res = {
            items: [],
            names: [],
            lookup: {},
            at: function (i) {

                // If the index is a literal number, index
                if (isNumber(i) == true)
                    return this.items[i];

                // Lookup the value
                return this.lookup[i];

            }
        };

        // Bind to the "each" collection
        var coll = parseValue(view, value);

        // If the collection was NOT found, return the default
        if (coll == undefined)
            return res;

        var collNames = [];

        // If the collection is NOT an array (an object with properties), convert to array
        if (!(coll instanceof Array)) {

            var oitems = [];

            // Create the names array
            collNames = [];

            // Loop over the objects properties
            for (var prop in coll) {

                // Collect the name
                collNames.push(prop);

                // Collect the values
                oitems.push(coll[prop]);

            }

            // Set the collection
            coll = oitems;

        }

        // Filter the collection
        if (where != undefined) {

            // Create the instance of the "filter" function
            var filter = new Function('return (' + template.root.wheres[where] + ')');
            var filtered = [];
            var filteredNames = [];

            // Loop over the collection items
            for (var fi = 0; fi < coll.length; fi++) {

                // Access the object
                var cobj = coll[fi];
                var cname = collNames[fi];

                // Set the "special" properties
                cobj.Parent = view;

                // Apply the filter
                if (filter.call(cobj) == true) {

                    // Select the object that passed the filter
                    filtered.push(cobj);

                    // Select the name that passed the filter (if the name is valid)
                    if ((cname != null) && (cname != null))
                    	filteredNames.push(cname);

                }

            }

            // Set the collection
            coll = filtered;
            collNames = filteredNames;

        }

        // Set the result
        res.items = coll;
        res.names = collNames;

        // Build the lookup
        for (var i = 0; i < res.names.length; i++)
            res.lookup[res.names[i]] = res.items[i];

        // Return
        return res;

    };

    // Parse the specified "FOR" template into a processable template
    function makeForTemplateDetails(template) {

        // Create the details object
        var details = { any: undefined, first: undefined, last: undefined, empty: undefined, nth: [] };

        // Loop over the sub-templates
        for (var tid in template.sub) {

        	// Access the sub-template
        	var subtemplate = template.sub[tid];

            // Detarmine if the element is a collection item target
            if (subtemplate.name == "first")
                details.first = subtemplate;
            else if (subtemplate.name == "last")
                details.last = subtemplate;
            else if (subtemplate.name == "empty")
            	details.empty = subtemplate;
            else if (subtemplate.name == "nth") {

                // Add the "nth" sub-template
                details.nth.push({ template: subtemplate, every: undefined, at: undefined, where: undefined });

                // Access the root NTH
                var rootNTH = details.nth[details.nth.length - 1];

                // Set the NTH properties
                rootNTH.every = subtemplate.attrs['every'];
                rootNTH.at = subtemplate.attrs['at'];
                rootNTH.where = subtemplate.attrs['where'];

                // Process the "at" attrbiute further if its 0,1,2
                if ((rootNTH.at != undefined) && (rootNTH.at.indexOf(',') > -1)) {

                    // Split the indicies
                    var indicies = rootNTH.at.split(',');

                    // Set the first nth item
                    rootNTH.at = indicies[0];

                    // Loop over the other indicies pushing more NTH items
                    for (var iidx = 1; iidx < indicies.length; iidx++)
                        details.nth.push({ template: cloneTemplate(subtemplate), every: rootNTH.every, at: indicies[iidx], where: rootNTH.where });

                }

            }

        }

		// Create the "any" template
        details.any = cloneObject(template);

		// Clear the sub-templates collection
		details.any.sub = {};

		// Remove ALL the "first", "last", "empty" and "nth" sub-templates
		for (var tid in template.sub) {

			// Access the sub-template
			var subtemplate = template.sub[tid];

			// Remove the "first", "last", "empty" and "nth" sub-template references
			if ((subtemplate.name == "first") || (subtemplate.name == "last") || (subtemplate.name == "empty") || (subtemplate.name == "nth")) {

                // Remove the sub-template key from the template text
                details.any.text = replaceAll(details.any.text, tid, '', true);

			}
			else {

				// Add the unrelated (not "first", "last", "empty" or "nth") sub-template
				details.any.sub[tid] = subtemplate;

			}

		}

        // Determine the template status
        if ((details.first != undefined) || (details.last != undefined) || (details.empty != undefined) || (details.nth.length > 0))
            details.hasTargets = true;
        else
            details.hasTargets = false;

        // Return
        return details;

    };

    // Select the template to use given the specified "for" loop details
    function selectForListTemplate(template, index, total, item) {

        // Generate the template details (if needed)
        if (template.details == undefined)
            template.details = makeForTemplateDetails(template);

        var res = undefined;

        // Check to see if there is any item targets
        if (template.details.hasTargets == true) {

            // Determine which item to use
            if ((template.details.first != undefined) && (index == 0))
                res = template.details.first;
            else if ((template.details.last != undefined) && (index == (total - 1)))
                res = template.details.last;
            else if ((template.details.empty != undefined) && (index == -1) && (total == 0))
                res = template.details.empty;
            else {

                // Loop over the NTH items
                for (var n = 0; n < template.details.nth.length; n++) {

                    // Handle the NTH "EVERY"
                    if ((template.details.nth[n].every != undefined) && ((index % template.details.nth[n].every) == 0)) {

                        // Handle "WHERE" filtering
                        if ((template.details.nth[n].where != undefined) && (testWhere(template, item, template.details.nth[n].where) == false))
                            continue;

                        // Assign the template
                        res = template.details.nth[n].template;

                        // Break
                        break;

                    }

                    // Handle NTH "AT"
                    if ((template.details.nth[n].at != undefined) && (index == template.details.nth[n].at)) {

                        // Handle "WHERE" filtering
                        if ((template.details.nth[n].where != undefined) && (testWhere(template, item, template.details.nth[n].where) == false))
                            continue;

                        // Assign the template
                        res = template.details.nth[n].template;

                        // Break
                        break;

                    }

                    // Handle NTH "WHERE"
                    if ((template.details.nth[n].where != undefined) && (testWhere(template, item, template.details.nth[n].where) == true)) {

                        // Assign the template
                        res = template.details.nth[n].template;

                        // Break
                        break;

                    }

                }

                // If the template was not found, use the "ANY" template
                if (res == undefined)
                    res = template.details.any;

            }

        }
        else
            res = template.details.any;

        // Return
        return res;

    };

    // Parse the specified "WITH" template into a processable template
    function makeWithTemplateDetails(template) {

        // Create the details object
        var details = { first: undefined, last: undefined, empty: undefined, nth: [] };

        // Loop over the sub-templates
        for (var tid in template.sub) {

        	// Access the sub-template
        	var subtemplate = template.sub[tid];

            // Detarmine if the template is an item target
            if (subtemplate.name == "first")
                details.first = subtemplate;
            else if (subtemplate.name == "last")
                details.last = subtemplate;
            else if (subtemplate.name == "empty")
            	details.empty = subtemplate;
            else if (subtemplate.name == "nth") {

                // Add the "nth" sub-template
                details.nth.push({ template: subtemplate, at: undefined });

                // Access the root NTH
                var rootNTH = details.nth[details.nth.length - 1];

                // Set the NTH properties
                rootNTH.at = subtemplate.attrs['at'];

                // Process the "at" attrbiute further if its 0,1,2
                if ((rootNTH.at != undefined) && (rootNTH.at.indexOf(',') > -1)) {

                    // Split the indicies
                    var indicies = rootNTH.at.split(',');

                    // Set the first nth item
                    rootNTH.at = indicies[0];

                    // Loop over the other indicies pushing more NTH items
                    for (var iidx = 1; iidx < indicies.length; iidx++)
                        details.nth.push({ template: cloneTemplate(subtemplate), at: indicies[iidx] });

                }

            }

        }

        // Return
        return details;

    };

    // Process the specified "IF" template
    function processIF(template) {

        var innerTemplate = null;

        // Test the "if" "condition"
        if (testCondition(template, template.view, template.attrs['condition']) == true) {

            // Clone the current template
            innerTemplate = cloneObject(template);

			// Create a clean sub-template collection
			innerTemplate.sub = {};

            // Remove ALL the "elseif" and "else" sub-templates
			for (var tid in template.sub) {

				// Access the sub-template
				var subtemplate = template.sub[tid];

				// Remove "elseif" and "else"
				if ((subtemplate.name == "elseif") || (subtemplate.name == "else")) {

					// Clear the sub-template key
					innerTemplate.text = replaceAll(innerTemplate.text, tid, '', true);

				}
				else {

					// Add the unrelateed (not "elseif" or "else") sub-template
					innerTemplate.sub[tid] = subtemplate;

				}

			}

		}
        else {

			var tests = [];

			// Collect all the "elseif"  and final "else" sub-templates
			for (var tid in template.sub) {

				// Access the sub-template
				var subtemplate = template.sub[tid];

				// Push in the proper order, "elseif" then final "else"
				if (subtemplate.name == "elseif")
					tests.push(subtemplate);
				else if (subtemplate.name == "else") {

					// Push
					tests.push(subtemplate);

					// Break
					break;

				}

			}

            // Loop over the elseif(s) and else sub-templates
            for (i = 0; i < tests.length; i++) {

                // If the "ELSE" has been reached, exit
                if (tests[i].name == "else") {

                    // Set the template
                    innerTemplate = tests[i];

                    // Break
                    break;

                }

                // Test the "ELSEIF" condition(s)
                if (testCondition(template, template.view, tests[i].attrs['condition']) == true) {

                    // Set the template
                    innerTemplate = tests[i];

                    // Break
                    break;

                }

            }

        }

        // Return
        return ((innerTemplate != null) ? processTemplate(innerTemplate, template.view) : '');

    };

    // Process the specified "FOR" template
    function processFOR(template) {

        var res = '';

        // Select the collection
        var collection = selectCollection(template, template.view, template.attrs['each'], template.attrs['where']);

		// If there are items in the collection process, otherwise, process the "empty" sub-template
		if (collection.items.length > 0) {

			// Loop over the objects
			for (var oidx = 0; oidx < collection.items.length; oidx++) {

				// Access the item
				var oitem = collection.items[oidx];

				// Check the item state
				if ((oitem == null) || (oitem == undefined))
					continue;

				// Access the item (as a string)
				var oitemStr = oitem.toString();

				// Determine the current "index"
				var idx = (((collection.names != undefined) && (collection.names.length > 0)) ? collection.names[oidx] : (oidx + 1).toString());

				// Determine the current value as a string
				var str = (((oitemStr != undefined) && (oitemStr != ({}).toString())) ? oitemStr : '');

				// Determine the template to use for the item
				var otmpl = selectForListTemplate(template, oidx, collection.items.length, oitem);

				// Set the "special" view properties
				oitem.Parent = template.view;

				// Set the "index", "count" and "str" values
				otmpl.index = idx;
				otmpl.count = collection.items.length;
				otmpl.str = str;

				// Process the sub-template
				res += processTemplate(otmpl, oitem);

			}

		}
		else {

			// Determine the template to use for the item
			var otmpl = selectForListTemplate(template, -1, 0, null);

			// If there is a template
			if (otmpl != undefined) {

				// Set the "index", "count" and "str" values
				otmpl.index = -1;
				otmpl.count = 0;
				otmpl.str = '';

				// Process the sub-template
				res += processTemplate(otmpl, template.view);

			}

		}

        // Return
        return res;

    };

    // Process the specified "WITH" template
    function processWITH(template) {

        var res = '';

        // Select the collection
        var collection = selectCollection(template, template.view, template.attrs['in'], template.attrs['where']);

        // Generate the template details (if needed)
        if (template.details == undefined)
        	template.details = makeWithTemplateDetails(template);

		// If there are items in the collection process, otherwise, process the "empty" sub-template
		if (collection.items.length > 0) {

			// Loop over the NTH items
			for (var nidx = 0; nidx < template.details.nth.length; nidx++) {

				// Access the NTH item
				var oitem = collection.at(template.details.nth[nidx].at);

				// Check the item state
				if ((oitem == null) || (oitem == undefined))
					continue;

				// Access the item (as a string)
				var oitemStr = oitem.toString();

				// Determine the current "index"
				var idx = template.details.nth[nidx].at;

				// Determine the current value as a string
				var str = (((oitemStr != undefined) && (oitemStr != ({}).toString())) ? oitemStr : '');

				// Determine the template to use for the item
				var otmpl = template.details.nth[nidx].template;

				// Set the "special" view properties
				oitem.Parent = template.view;

				// Set the "index", "count" and "str" values
				otmpl.index = idx;
				otmpl.count = collection.items.length;
				otmpl.str = str;

				// Process the sub-template
				res += processTemplate(otmpl, oitem);

			}
		}
		else {

			// Access the "empty" template
			var otmpl = template.details.empty;

			// If there is a template
			if (otmpl != undefined) {

				// Set the "special" view properties
				oitem.Parent = template.view;

				// Set the "index", "count" and "str" values
				otmpl.index = -1;
				otmpl.count = 0;
				otmpl.str = '';

				// Process the sub-template
				res += processTemplate(otmpl, template.view);

			}

		}

        // Return
        return res;

    };

	// Parse a "sub-template" into a sub-template hierarchy
	function parseSubTemplate(parent, tzr, t) {

		var begin = 0;
		var end = 0;
		var token = t.text;

        // Create an "empty" template
        var template = {
			name: '',
            root: parent.root,
            parent: parent,
            view: undefined,
            text: '',
            attrs: {},
            sub: {}
        }

		// Parse the sub-template name

		// Move past the <
		if (token.charAt(begin) == "<")
			begin++;

		// Move past any whitespace
		while ((begin < token.length) && (isWhitespace(token.charAt(begin)) == true))
			begin++;

		// Collect the element name
		while ((begin < token.length) && (isID(token.charAt(begin)) == true))
			template.name += token.charAt(begin++);

		// Format the template name
		template.name = template.name.toLowerCase();

		// Parse the attributes
		while (begin < token.length) {

			var attr = '';

			// Move past any whitespace
			while ((begin < token.length) && (isWhitespace(token.charAt(begin)) == true))
				begin++;

			// If the end of the template was found, exit
			if ((token.charAt(begin) == "/") || (token.charAt(begin) == ">"))
				break;

			// Collect the attr name
			while ((begin < token.length) && (isID(token.charAt(begin)) == true))
				attr += token.charAt(begin++);

			// Format the attribute name
			attr = attr.toLowerCase();

			// Move past the whitespace
			while ((begin < token.length) && (isWhitespace(token.charAt(begin)) == true))
				begin++;

			// If we hit an =
			if (token.charAt(begin) == "=") {

				// Increment
				begin++;

				// Move past the whitespace
				while ((begin < token.length) && (isWhitespace(token.charAt(begin)) == true))
					begin++;

				// If we hit a ' or "
				if ((token.charAt(begin) == "\"") || (token.charAt(begin) == "\'")) {

					// Get the break
					var brk = token.charAt(begin);

					// Increment
					begin++;

					// Determine the end
					end = token.indexOf(brk, begin);

					// Add the attribute
					template.attrs[attr] = (token.slice(begin, end)).trim();

					// Increment past the end
					begin = end + 1;

				}

			}

		}

		// If there is more template tokens to process
		if ((begin == token.length) || (token.charAt(begin) == ">")) {

			// Parse tokens until a closing element is found
			while (tzr.HasMoreTokens() == true) {

				// Get a token
				t = tzr.NextToken();

				// Determine if the token is the start of a new sub-template
				if (t.iskeyelement == true) {

					// If this is the start of a new sub-template
					if (t.isend == false) {

						// Generate a new key
						var key = '_k1_st_' + (template.root.baseid++).toString();

						// Parse the sub-template
						template.sub[key] = parseSubTemplate(template, tzr, t);

						// Set the key as the token
						t = { text: key, iskeyelement: false };

					}
					else
						break;

				}

				// Concat the token
				template.text += t.text;

			}

		}

		// Return
		return template;

	};

	// Parse the "root-template" into the root template hierarchy
	function parseRootTemplate(template) {

		// Create the tokenizer
		var tzr = new TemplateTokenizer(template.pre);

		// Init the text member
		template.text = '';

		// Init the collection of sub-templates
		template.sub = {};

		// Parse the "raw" template into its component text and sub-templates
		while (tzr.HasMoreTokens() == true) {

			// Get a token
			var token = tzr.NextToken();

			// Determine if the token is the start of a new sub-template
			if (token.iskeyelement == true) {

				// Generate a new key
				var key = '_k1_st_' + (template.baseid++).toString();

				// Parse the sub-template
				template.sub[key] = parseSubTemplate(template, tzr, token);

				// Set the key as the token
				token = { text: key, iskeyelement: false };

			}

			// Concat the token
			template.text += token.text;

		}

		// Return
		return template;

	};

    // Pre-process the specified template, parsing embedded "properties", "scripts", "code" as well as
    // "conditions" and "where" elements.  Return a "root" template that is ready to process.
    function preProcessTemplate(template) {

        // Establish the template "lookup"
        template.properties = new Object();
        template.scripts = new Object();
        template.code = new Object();
        template.conditions = new Object();
        template.wheres = new Object();

        // Establish the pre-processed
        template.pre = template.raw;

        // Indexes used for parsing
        var begin, end;

        // Loop over all the script segements
        while ((begin = template.pre.indexOf('{{')) >= 0) {

            // Generate a new key
            var key = '_k1_' + (template.baseid++).toString();

            // Determine the end
            end = template.pre.indexOf('}}', begin);

            // Extract the script
            var script = template.pre.slice(begin, end + 2);

            // Return the string with the item replaced
            template.pre = [template.pre.slice(0, begin), key, template.pre.slice(end + 2)].join('');

            // Add the property into the lookup
            template.scripts[key] = script.trim();

        }

        // Loop over all the property segments
        while ((begin = template.pre.indexOf('[')) >= 0) {

            // Generate a new key
            var key = '_k1_' + (template.baseid++).toString();

            // Determine the end
            end = template.pre.indexOf(']', begin);

            // Extract the property
            var property = template.pre.slice(begin, end + 1);

            // Return the string with the item replaced
            template.pre = [template.pre.slice(0, begin), key, template.pre.slice(end + 1)].join('');

            // Add the property into the lookup
            template.properties[key] = property.trim();

        }

        // Loop over all the free-code segments
        while ((begin = template.pre.indexOf('{')) >= 0) {

            // Generate a new key
            var key = '_k1_' + (template.baseid++).toString();

            // Determine the end
            end = template.pre.indexOf('}', begin);

            // Extract the property
            var code = template.pre.slice(begin, end + 1);

            // Return the string with the item replaced
            template.pre = [template.pre.slice(0, begin), key, template.pre.slice(end + 1)].join('');

            // Add the property into the lookup
            template.code[key] = code.trim();

        }

        // Define parse function
        this.parsePropCodes = function (name) {

            var codes = new Object();

            begin = 0;

            // Loop over all the condition=
            while ((begin = template.pre.indexOf(name, begin)) >= 0) {

                // Move past the whitespace
                while ((isWhitespace(template.pre.charAt(begin)) == false) && (template.pre.charAt(begin) != "="))
                    begin++;

                // Move past the whitespace
                while (isWhitespace(template.pre.charAt(begin)) == true)
                    begin++;

                // If we hit an =
                if (template.pre.charAt(begin) == "=") {

                    // Increment
                    begin++;

                    // Move past the whitespace
                    while (isWhitespace(template.pre.charAt(begin)) == true)
                        begin++;

                    // If we hit a ' or "
                    if ((template.pre.charAt(begin) == "\"") || (template.pre.charAt(begin) == "\'")) {

                        // Get the break
                        var brk = template.pre.charAt(begin);

                        // Increment
                        begin++;

                        // Determine the end
                        end = template.pre.indexOf(brk, begin);

                        // Generate a new key
                        var key = '_k1_' + (template.baseid++).toString();

                        // Extract the snippet
                        var code = template.pre.slice(begin, end);

                        // Return the string with the item replaced
                        template.pre = [template.pre.slice(0, begin), key, template.pre.slice(end)].join('');

                        // Add the property into the lookup
                        codes[key] = code.trim();

                    }

                }

            }

            // Return
            return codes;

        }

        // Replace "condition" and "where"
        template.conditions = this.parsePropCodes("condition");
        template.wheres = this.parsePropCodes("where");

        // Return
        return template;

    };

    // Open a "root" template, transforming the top level template text into a processable template object.
    function openRootTemplate(tmp, tio) {

        // Create an "empty" template
        var template = {
			tio: tio,
			baseid: (new Date()).getTime(),
			name: 'root',
            raw: undefined,
            pre: undefined,
            root: undefined,
            parent: undefined,
            view: undefined,
            text: '',
            sub: {}
        }

        // Set the root "root"
        template.root = template;

        // Establish the pattern thhat identifies "id" from "raw" temlate
        var pattern = /^[a-z0-9]+$/i;

        // Establish the "raw" template - "id" may be a reference to a "template" located in the DOM or raw HTML template text
        if (pattern.test(tmp) == true)
            template.raw = tio.Read(tmp);
        else
            template.raw = tmp;

        // Pre-Proccess the template
        template = preProcessTemplate(template);

		// Parse the template
		template = parseRootTemplate(template);

        // Return
        return template;

    };

    // Bind the specified "model" object together with the embedded "script" code to generate the "view" object
    function bindView(scripts, model, template) {

        // The result view
        var view = {};

		// If the template has yet to parse the binding info, do it!
		if (template.bindings == undefined) {

			// Create the "bindings" collection
			template.bindings = [];

			// Loop over the scripts
			for (var scriptID in scripts) {

				// If the text contains the script,
				if (template.text.indexOf(scriptID) >= 0) {

					// Add to the bindings
					template.bindings.push(scriptID);

					// Replace the script references with ''
					template.text = replaceAll(template.text, scriptID, '', true);

				}

			}

		}

		// Merge the "model" into the "view"
		view = mergeObjects(view, model);

		// Clear any prior "ready" function
		view.Ready = undefined;

		// Loop over the bindings
		for (var bi = 0; bi < template.bindings.length; bi++) {

			// Get the binnding
			var scriptID = template.bindings[bi];

			// Establish the extension
			var extension = scripts[scriptID];

			// Trim the outer { and } and whitespace
			extension = extension.substring(2, extension.length - 2).trim();

			// Wrap the extension into a function return value
			extension = 'return {' + extension + '}';

			// Parse the extension into an object
			view = mergeObjects(view, (new Function(extension)).call(view));

		}

        // Return
        return view;

    };

    // Process the specified "template" against the specified "model"
    function processTemplate(template, model) {

        // Establish the current "view" model
        template.view = bindView(template.root.scripts, model, template);

		// Copy the template text
		var text = template.text.toString();

        // Loop over the sub-templates of this template
		for (var tid in template.sub) {

			// The result text
			var result = '';

			// Acces the sub-template
			var subtemplate = template.sub[tid];

			// Set the view object
			subtemplate.view = 	template.view;

            // Process the construct node types
            if (subtemplate.name == "if")
                result = processIF(subtemplate);
            else if (subtemplate.name == "for")
                result = processFOR(subtemplate);
            else if (subtemplate.name == "with")
                result = processWITH(subtemplate);

            // Replace the generated text
            text = replaceAll(text, tid, result, true);

        }

        // Loop over the "code" snipptes processing
        for (var codeID in template.root.code) {

            // If the text contains the code,
            if (text.indexOf(codeID) >= 0) {

                // Access the "code"
                var code = template.root.code[codeID];

                // Trim the { and }
                code = code.substring(1, code.length - 1);

                // Replace with the value
                text = replaceAll(text, codeID, (new Function(code)).call(template.view), true);

            }

        }

        // Loop over the "property" processing
        for (var propertyID in template.root.properties) {

            // If the text contains the property,
            if (text.indexOf(propertyID) >= 0) {

                // Access the "property"
                var property = template.root.properties[propertyID];

                // Trim the [ and ] and whitespace
                property = property.substring(1, property.length - 1).trim();

                // Replace with the value
                if (property == "#")
	                text = replaceAll(text, propertyID, template.index, true);
                else if (property == "##")
	                text = replaceAll(text, propertyID, template.count, true);
                else if (property == "$")
	                text = replaceAll(text, propertyID, template.str, true);
                else
	                text = replaceAll(text, propertyID, parseValue(template.view, property), true);

            }

        }

        // Return
        return text;

    };

    // Process the specified "root" template against the specified "model" and optionally send the
    // HTML output to the innerHTML member of the specified "to" node
    function processRoot(id, model, tio) {

        // Open the template
        var template = openRootTemplate(id, tio);

        // Process the template
        var text = processTemplate(template, model);

        // If the "to" instance was specified, "append"
        if ((tio != undefined) && (tio != null))
        	tio.Write(id, text);

        // Run any specified "Ready" function
        if (template.view.Ready != undefined)
            template.view.Ready.call(template.view);

        // Return
        return text;

    };

    // Public Member Functions

    // Apply the specified "template" to the specified "model" and return the resultant HTML (or also set the HTML to the innerHTML of the specified "to" HTML node)
    Kruntch.Apply = function (id, model, to, asynch, done) {

        // Establish the optional params
        if (asynch == undefined)
            asynch = false;

        // Process "asynch"
        if (asynch == true) {
            window.setTimeout(function () { Kruntch.Apply(id, model, to, false, done); }, 1);
            return '';
        }

        // Process "synch"
        var res = processRoot(id, model, new TemplateIO(to));

        // Call any specified "done" handler
        if (done != undefined)
            done(res);

        // Return
        return res;

    };

    // Bind the specified "template" to the specified "model" and return the resultant "view" object
    Kruntch.Bind = function (id, model) {
        var template = openRootTemplate(id, new TemplateIO(document, {}));
        return bindView(template.root.scripts, model, template);
    };

} (window.Kruntch = window.Kruntch || {}));

