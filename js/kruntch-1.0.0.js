//
// Kruntch.js
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

    // Determine of the specified charachter is "whitespace"
    function isWhitespace(c) {
        if ((c == ' ') || (c == '\r') || (c == '\n'))
            return true;
        return false;
    };

    // Determine of the passed in object is an HTML element
    // This function was taken "as-is" from a forum with un-attributed license
    function isElement(obj) {
        try {
            //Using W3 DOM2 (works for FF, Opera and Chrom)
            return obj instanceof HTMLElement;
        }
        catch (e) {
            //Browsers not supporting W3 DOM2 don't have HTMLElement and
            //an exception is thrown and we end up here. Testing some
            //properties that all elements have. (works on IE7)
            return (typeof obj === "object") && (obj.nodeType === 1) && (typeof obj.style === "object") && (typeof obj.ownerDocument === "object");
        }
    };

    // Extract the "Outer" HTML of the specified node
    function outerHTML(node) {
        var el = document.createElement("div");
        el.appendChild(node.cloneNode(true));
        return el.innerHTML;
    };

    // Extract the text from the specified node EXCLUDING the inner-node text
    function atText(node) {
        var elem = node.cloneNode(true);
        for (var i = elem.childNodes.length - 1; i >= 0; i--) {
            if (elem.childNodes[i].tagName) elem.removeChild(elem.childNodes[i]);
        }
        return elem['innerText' in elem ? 'innerText' : 'textContent'];
    };

    // Replace all references to the specified "key" with the specified "replacement" text
    // If the "html" is an HTML element object, set its innerHTML value
    function replaceKey(html, key, rep) {
        var node = null;
        if (isElement(html) == true) {
            node = html;
            html = node.innerHTML;
        }
        html = replaceAll(html, key, rep, true);
        html = replaceAll(html, key + '=""', rep, true);
        if (node != null)
            node.innerHTML = html;
        return html;
    };

    // Replace the specified "node" with the "replacement"
    // If the replacement is an HTML element object, replace direclty, otherwise, parse 
    // and replace with all nodes contained in the replacement
    function replaceNode(parent, node, replacement) {

        // Handle the replacement based on the type
        if (isElement(replacement) == true)
            parent.replaceChild(replacement, node);
        else {
            var el = document.createElement("div");
            el.innerHTML = replacement;

            var nodes = [];

            // Populate the nodes
            for (var i = 0; i < el.childNodes.length; i++)
                nodes.push(el.childNodes[i]);

            // Insert all the nodes
            for (i = 0; i < nodes.length; i++)
                parent.insertBefore(nodes[i], node);

            // Remove the "node"
            parent.removeChild(node);

        }

        // Return
        return;

    };

    // Replace the specified "node" with the "replacement"
    // If the replacement is an HTML element object, replace direclty, otherwise, parse 
    // and replace with all nodes contained in the replacement
    function appendNode(parent, node) {

        // Handle the replacement based on the type
        if (isElement(node) == true)
            parent.appendChild(node);
        else {
            var el = document.createElement("div");
            el.innerHTML = node;

            var nodes = [];

            // Populate the nodes
            for (var i = 0; i < el.childNodes.length; i++)
                nodes.push(el.childNodes[i]);

            // Insert all the nodes
            for (i = 0; i < nodes.length; i++)
                parent.appendChild(nodes[i]);

        }

        // Return
        return;

    };

    // Load a specified template from the specified template id
    function loadTemplate(templateID) {
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
        return '';
    }

    // Parse the specified HTML (string) into a DOM hierarchy
    function parseTemplateHTML(html) {
        var el = document.createElement("div");
        el.innerHTML = html;
        return el.children[0];
    };

    // Access a nodes "special" value
    function getNodeName(node) {
        var attr = node.attributes['_ktype'];
        if (attr != undefined)
            return attr.nodeValue;
        return '';
    };

    // Determine if the specified DOM node containes any "template" content that would require a recurse
    function hasTemplateContent(node) {

        // Check the param state
        if ((node == undefined) || (node == null) || (node == '') || (node.children == undefined) || (node.children.length == 0))
            return false;

        // Loop over the children
        for (var i = 0; i < node.children.length; i++) {

            // Establish the name
            var name = getNodeName(node.children[i]);

            // Check the node name
            if ((name == "IF") ||
                (name == "ELSEIF") ||
                (name == "ELSE") ||
                (name == "FOR") ||
                (name == "WITH"))
                return true;

            if (hasTemplateContent(node.children[i]) == true)
                return true;

        }

        // Return
        return false;

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
                    filtered.push(cobj);
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
    function makeForTemplateDetails(forTemplate) {

        // Parse the root template
        var rem = [];

        // Create the details object
        var details = { any: undefined, first: undefined, last: undefined, nth: [] };

        // Loop over the child nodes
        for (var i = 0; i < forTemplate.dom.children.length; i++) {

            // Access the child
            var child = forTemplate.dom.children[i];

            // Access the node name
            var name = getNodeName(child);

            // Detarmine if the element is a collection item target
            if (name == "FIRST") {

                // Set the "first"
                details.first = child;

                // Mark the item to be removed
                rem.push(child);

            }
            else if (name == "LAST") {

                // Set the "last"
                details.last = child;

                // Mark the item to be removed
                rem.push(child);

            }
            else if (name == "NTH") {

                // Add the "nth"
                details.nth.push({ template: child, every: undefined, at: undefined, where: undefined });

                // Access the root NTH
                var rootNTH = details.nth[details.nth.length - 1];

                // Set the NTH properties
                rootNTH.every = child.getAttribute('every');
                rootNTH.at = child.getAttribute('at');
                rootNTH.where = child.getAttribute('where');

                // Process the "at" attrbiute further if its 0,1,2
                if ((rootNTH.at != undefined) && (rootNTH.at.indexOf(',') > -1)) {

                    // Split the indicies
                    var indicies = rootNTH.at.split(',');

                    // Set the first nth item
                    rootNTH.at = indicies[0];

                    // Loop over the other indicies pushing more NTH items
                    for (var iidx = 1; iidx < indicies.length; iidx++)
                        details.nth.push({ template: child, every: rootNTH.every, at: indicies[iidx], where: rootNTH.where });

                }

                // Mark the item to be removed
                rem.push(child);

            }

        }

        // Remove the item targets
        for (i = 0; i < rem.length; i++)
            forTemplate.dom.removeChild(rem[i]);

        // Set the "any" template
        details.any = forTemplate.dom;

        // Determine the template status
        if ((details.first != undefined) || (details.last != undefined) || (details.nth.length > 0))
            details.hasTargets = true;
        else
            details.hasTargets = false;

        // Return
        return details;

    };

    // Select the template to use given the specified "for" loop details
    function selectForListTemplate(template, forTemplate, index, total, item) {

        // Generate the template details (if needed)
        if (forTemplate.details == undefined)
            forTemplate.details = makeForTemplateDetails(forTemplate);

        var res = undefined;

        // Check to see if there is any item targets
        if (forTemplate.details.hasTargets == true) {

            // Determine which item to use
            if ((forTemplate.details.first != undefined) && (index == 0))
                res = forTemplate.details.first;
            else if ((forTemplate.details.last != undefined) && (index == (total - 1)))
                res = forTemplate.details.last;
            else {

                // Loop over the NTH items
                for (var n = 0; n < forTemplate.details.nth.length; n++) {

                    // Handle the NTH "EVERY"
                    if ((forTemplate.details.nth[n].every != undefined) && ((index % forTemplate.details.nth[n].every) == 0)) {

                        // Handle "WHERE" filtering
                        if ((forTemplate.details.nth[n].where != undefined) && (testWhere(forTemplate, item, forTemplate.details.nth[n].where) == false))
                            continue;

                        // Assign the template
                        res = forTemplate.details.nth[n].template;

                        // Break
                        break;

                    }

                    // Handle NTH "AT"
                    if ((forTemplate.details.nth[n].at != undefined) && (index == forTemplate.details.nth[n].at)) {

                        // Handle "WHERE" filtering
                        if ((forTemplate.details.nth[n].where != undefined) && (testWhere(forTemplate, item, forTemplate.details.nth[n].where) == false))
                            continue;

                        // Assign the template
                        res = forTemplate.details.nth[n].template;

                        // Break
                        break;

                    }

                    // Handle NTH "WHERE"
                    if ((forTemplate.details.nth[n].where != undefined) && (testWhere(forTemplate, item, forTemplate.details.nth[n].where) == true)) {

                        // Assign the template
                        res = forTemplate.details.nth[n].template;

                        // Break
                        break;

                    }

                }

                // If the template was not found, use the "ANY" template
                if (res == undefined)
                    res = forTemplate.details.any;

            }

        }
        else
            res = forTemplate.dom;

        // Return
        return res;

    };

    // Parse the specified "WITH" template into a processable template
    function makeWithTemplateDetails(withTemplate) {

        // Create the details object
        var details = { first: undefined, last: undefined, nth: [] };

        // Loop over the elements
        for (var i = 0; i < withTemplate.dom.children.length; i++) {

            // Access the child
            var child = withTemplate.dom.children[i];

            // Access the child node name
            var name = getNodeName(child);

            // Detarmine if the element is a collection item target
            if (name == "FIRST") {

                // Set the "first"
                details.first = child;

            }
            else if (name == "LAST") {

                // Set the "last"
                details.last = child;

            }
            else if (name == "NTH") {

                // Add the "nth"
                details.nth.push({ template: child, at: undefined });

                // Access the root NTH
                var rootNTH = details.nth[details.nth.length - 1];

                // Set the NTH properties
                rootNTH.at = child.getAttribute('at');

                // Process the "at" attrbiute further if its 0,1,2
                if ((rootNTH.at != undefined) && (rootNTH.at.indexOf(',') > -1)) {

                    // Split the indicies
                    var indicies = rootNTH.at.split(',');

                    // Set the first nth item
                    rootNTH.at = indicies[0];

                    // Loop over the other indicies pushing more NTH items
                    for (var iidx = 1; iidx < indicies.length; iidx++)
                        details.nth.push({ template: child, at: indicies[iidx] });

                }

            }

        }

        // Return
        return details;

    };

    // Process the specified "IF" template 
    function processIF(template, node) {

        // Access the "elseif" and "else" constructs
        var nodes = [];

        // Collect all the "elseif" items
        for (var i = 0; i < node.children.length; i++) {
            if (getNodeName(node.children[i]) == "ELSEIF")
                nodes.push(node.children[i]);
        }

        // Collect all the "else" items
        for (i = 0; i < node.children.length; i++) {
            if (getNodeName(node.children[i]) == "ELSE")
                nodes.push(node.children[i]);
        }

        // Remove the "elseif" and "else" nodes from the "if" template
        for (i = 0; i < nodes.length; i++)
            node.removeChild(nodes[i]);

        var innerTemplate = null;

        // Test the "if" "condition"
        if (testCondition(template, template.view, node.getAttribute('condition')) == true)
            innerTemplate = node;
        else {

            // Loop over the elseif(s) and else
            for (i = 0; i < nodes.length; i++) {

                // If the "ELSE" has been reached, exit
                if (getNodeName(nodes[i]) == "ELSE") {

                    // Set the template
                    innerTemplate = nodes[i];

                    // Break
                    break;

                }

                // Test the "ELSEIF" condition(s)
                if (testCondition(template, template.view, nodes[i].attr('condition')) == true) {

                    // Set the template
                    innerTemplate = nodes[i];

                    // Break
                    break;

                }

            }

        }

        // Return
        return ((innerTemplate != null) ? processTemplate(openSubTemplate(innerTemplate, template), template.view) : '');

    };

    // Process the specified "FOR" template
    function processFOR(template, node) {

        var res = '';

        // Select the collection
        var collection = selectCollection(template, template.view, node.getAttribute('each'), node.getAttribute('where'));

        // Parse the template
        var forTemplate = { dom: node };

        // Loop over the objects
        for (var oidx = 0; oidx < collection.items.length; oidx++) {

            // Access the item
            var oitem = collection.items[oidx];

            // Access the item (as a string)
            var oitemStr = oitem.toString();

            // Determine the current "index"
            var idx = (((collection.names != undefined) && (collection.names.length > 0)) ? collection.names[oidx] : (oidx + 1).toString());

            // Determine the current "str"
            var str = (((oitemStr != undefined) && (oitemStr != ({}).toString())) ? oitemStr : '');

            // Determine the template to use for the item
            var otmpl = selectForListTemplate(template, forTemplate, oidx, collection.items.length, oitem);

            // Set the "special" view properties
            oitem.Parent = template.view;

            // Evaluate the template with the array object instance and add the result to the "add" collection
            res += processTemplate(openSubItemTemplate(otmpl, template, idx, collection.items.length, str), oitem);

        }

        // Return
        return res;

    };

    // Process the specified "WITH" template
    function processWITH(template, node) {

        var res = '';

        // Select the collection
        var collection = selectCollection(template, template.view, node.getAttribute('in'), node.getAttribute('where'));

        // Parse the template
        var withTemplate = { dom: node, details: undefined };

        // Generate the template details (if needed)
        withTemplate.details = makeWithTemplateDetails(withTemplate);

        // Loop over the NTH items
        for (var nidx = 0; nidx < withTemplate.details.nth.length; nidx++) {

            // Access the NTH item
            var oitem = collection.at(withTemplate.details.nth[nidx].at);

            if (oitem == undefined)
                continue;

            // Access the item (as a string)
            var oitemStr = oitem.toString();

            // Determine the current "index"
            var idx = withTemplate.details.nth[nidx].at;

            // Determine the current "str"
            var str = (((oitemStr != undefined) && (oitemStr != ({}).toString())) ? oitemStr : '');

            // Determine the template to use for the item
            var otmpl = withTemplate.details.nth[nidx].template;

            // Set the "special" view properties
            oitem.Parent = template.view;

            // Evaluate the template with the array object instance and add the result to the "add" collection
            res += processTemplate(openSubItemTemplate(otmpl, template, idx, collection.items.length, str), oitem);

        }

        // Return
        return res;

    };

    // Pre-process the specified template, parsing embedded "properties", "scripts", "code" as well as 
    // "conditions" and "where" elements.  Return a "root" template that is ready to process.
    function preProcessTemplate(template) {

        // Generate the ID base
        var baseid = (new Date()).getTime();

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
            var key = '_k1_' + (baseid++).toString();

            // Determine the end
            end = template.pre.indexOf('}}', begin);

            // Extract the script
            var script = template.pre.slice(begin, end + 1);

            // Return the string with the item replaced
            template.pre = [template.pre.slice(0, begin), key, template.pre.slice(end + 2)].join('');

            // Add the property into the lookup
            template.scripts[key] = script.trim();

        }

        // Loop over all the property segments
        while ((begin = template.pre.indexOf('[')) >= 0) {

            // Generate a new key
            var key = '_k1_' + (baseid++).toString();

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
            var key = '_k1_' + (baseid++).toString();

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
                        var key = '_k1_' + (baseid++).toString();

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

        // Define parse "special" function
        this.parseSpecialElements = function (name) {

            begin = 0;

            // Loop over all the condition=
            while ((begin = template.pre.indexOf('<', begin)) >= 0) {

                var start = begin;
                var tag = '';
                var isclose = false;

                // Increment
                begin++;

                // Move past the whitespace
                while (isWhitespace(template.pre.charAt(begin)) == true)
                    begin++;

                // Determine if this is a close tag
                if (template.pre.charAt(begin) == '/') {
                    begin++;
                    isclose = true;
                }

                // Move past the whitespace
                while (isWhitespace(template.pre.charAt(begin)) == true)
                    begin++;

                // Parse the tag
                while ((isWhitespace(template.pre.charAt(begin)) == false) && (template.pre.charAt(begin) != '>')) {
                    tag += template.pre.charAt(begin);
                    begin++;
                }

                // If the tag matches the name
                if (tag.toLowerCase() == name.toLowerCase()) {

                    // Replace the tag
                    template.pre = [template.pre.slice(0, start), '<' + ((isclose == true) ? '/' : '') + 'div _ktype="' + name.toUpperCase() + '"', template.pre.slice(begin)].join('');

                }

            }

            // Return
            return;

        }

        // Replace "condition" and "where"
        template.conditions = this.parsePropCodes("condition");
        template.wheres = this.parsePropCodes("where");

        // Replace the "special" elements
        this.parseSpecialElements('if');
        this.parseSpecialElements('elseif');
        this.parseSpecialElements('else');
        this.parseSpecialElements('for');
        this.parseSpecialElements('with');
        this.parseSpecialElements('nth');
        this.parseSpecialElements('first');
        this.parseSpecialElements('last');

        // Replace all "src" and "href" references
        template.pre = replaceAll(template.pre, "src", "_src", true);
        template.pre = replaceAll(template.pre, "href", "_href", true);

        // Wrap the pre-processed template
        template.pre = '<div>' + template.pre + '</div>';

        // Return
        return template;

    };

    // Open a "root" template, transforming the top level template text into a processable template object.
    function openRootTemplate(tmp) {

        // Create an "empty" template
        var template = {
            raw: undefined,
            pre: undefined,
            dom: undefined,
            root: undefined,
            parent: undefined,
            view: undefined
        }

        // Set the root "root"
        template.root = template;

        // Establish the pattern thhat identifies "id" from "raw" temlate
        var pattern = /^[a-z0-9]+$/i;

        // Establish the "raw" template - "id" may be a reference to a "template" located in the DOM or raw HTML template text  
        if (pattern.test(tmp) == true)
            template.raw = loadTemplate(tmp);
        else
            template.raw = tmp;

        // Pre-Proccess the template
        template = preProcessTemplate(template);

        // Set the "dom"
        template.dom = parseTemplateHTML(template.pre);

        // Return 
        return template;

    };

    // Open a "sub" template found within the body of a template (IF, FOR, WITH content as well as any element containing template constructs)
    function openSubTemplate(tmp, parentTemplate) {

        // Create an "empty" template
        var template = {
            raw: undefined,
            pre: undefined,
            dom: undefined,
            root: parentTemplate.root,
            parent: parentTemplate,
            view: undefined
        }

        // Establish the pattern thhat identifies "id" from "raw" temlate
        var pattern = /^[a-z0-9]+$/i;

        // Establish the "raw" template - "id" may be a reference to a "template" located in the DOM or raw HTML template text  
        if (pattern.test(tmp) == true)
            template.dom = parseTemplateHTML(template.pre);
        else if (tmp == 'string')
            template.dom = parseTemplateHTML(tmp);
        else
            template.dom = tmp.cloneNode(true);

        // Pre-Processed is the same as raw for sub-level templates
        template.pre = template.raw;

        // Return
        return template;

    };

    // Open an "item" template which is a "sub" template used to expand on a collection item
    function openSubItemTemplate(tmp, parentTemplate, index, count, str) {

        // Open the sub-template
        var subTemplate = openSubTemplate(tmp, parentTemplate);

        // Set the "index" and "str" values
        subTemplate.index = index;
        subTemplate.count = count;
        subTemplate.str = str;

        // Return
        return subTemplate;

    };

    // Bind the specified "model" object together with the embedded "script" code to generate the "view" object 
    function bindView(scripts, model, node) {

        // The result view
        var view = {};

        // Extract the text from the node (excluding all child text)
        var text = atText(node);

        // Merge the "model" into the "view"
        view = mergeObjects(view, model);

        // Clear any prior "ready" function
        view.Ready = undefined;

        // Loop over the scripts
        for (var scriptID in scripts) {

            // If the text contains the script,
            if (text.indexOf(scriptID) >= 0) {

                // Replace the script references with ''
                replaceKey(node, scriptID, '');

                // Establish the extension
                var extension = scripts[scriptID];

                // Trim the outer { and } and whitespace
                extension = extension.substring(2, extension.length - 2).trim();

                // Wrap the extension into a function return value 
                extension = 'return {' + extension + '}';

                // Parse the extension into an object
                view = mergeObjects(view, (new Function(extension)).call(view));

            }

        }

        // Return
        return view;

    };

    // Process the specified "template" against the specified "model"
    function processTemplate(template, model) {

        // Establish the current "view" model
        template.view = bindView(template.root.scripts, model, template.dom);

        var replace = [];

        // Loop over the template constructs
        for (var i = 0; i < template.dom.children.length; i++) {

            // Acces the child
            var child = template.dom.children[i];

            // Access the node name
            var name = getNodeName(child);

            // Process the construct node types
            if (name == "IF")
                replace.push({ p: child.parentNode, r: child, w: processIF(template, child) });
            else if (name == "FOR")
                replace.push({ p: child.parentNode, r: child, w: processFOR(template, child) });
            else if (name == "WITH")
                replace.push({ p: child.parentNode, r: child, w: processWITH(template, child) });
            else if (hasTemplateContent(child) == true) {

                // Evaluate the template with the array object instance and add the result to the "add" collection
                child.innerHTML = processTemplate(openSubTemplate(child, template), template.view);

            }

        }

        // Replace the nodes
        for (var ri = 0; ri < replace.length; ri++)
            replaceNode(replace[ri].p, replace[ri].r, replace[ri].w);

        // Access the "raw" html template
        var html = template.dom.innerHTML;

        // Loop over the "code" snipptes processing
        for (var codeID in template.root.code) {

            // If the text contains the code,
            if (html.indexOf(codeID) >= 0) {

                // Access the "code"
                var code = template.root.code[codeID];

                // Trim the { and }
                code = code.substring(1, code.length - 1);

                // Replace with the value
                html = replaceKey(html, codeID, (new Function(code)).call(template.view));

            }

        }

        // Loop over the "property" processing
        for (var propertyID in template.root.properties) {

            // If the text contains the property,
            if (html.indexOf(propertyID) >= 0) {

                // Access the "property"
                var property = template.root.properties[propertyID];

                // Trim the [ and ] and whitespace
                property = property.substring(1, property.length - 1).trim();

                // Replace with the value
                if (property == "#")
                    html = replaceKey(html, propertyID, template.index);
                else if (property == "##")
                    html = replaceKey(html, propertyID, template.count);
                else if (property == "$")
                    html = replaceKey(html, propertyID, template.str);
                else
                    html = replaceKey(html, propertyID, parseValue(template.view, property));

            }

        }

        // Replace all "src" and "href" references
        html = replaceAll(html, "_src", "src", true);
        html = replaceAll(html, "_href", "href", true);

        // Return
        return html;

    };

    // Process the specified "root" template against the specified "model" and optionally send the 
    // HTML output to the innerHTML member of the specified "to" node
    function processRoot(id, model, to) {

        // Open the template
        var template = openRootTemplate(id);

        // Process the template
        var html = processTemplate(template, model);

        // If the "to" instance was specified, "append"
        if ((to != undefined) && (to != null))
            appendNode(to, html);

        // Run any specified "Ready" function
        if (template.view.Ready != undefined)
            template.view.Ready.call(template.view);

        // Return
        return html;

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
        var res = processRoot(id, model, to);

        // Call any specified "done" handler
        if (done != undefined)
            done(res);

        // Return
        return res;

    };

    // Bind the specified "template" to the specified "model" and return the resultant "view" object
    Kruntch.Bind = function (id, model) {
        var template = openRootTemplate(id);
        return bindView(template.root.scripts, model, template.dom);
    };

} (window.Kruntch = window.Kruntch || {}));

