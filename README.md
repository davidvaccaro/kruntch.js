#kruntch.js

A Simple, Efficient and Non-Invasive Templating Engine for JavaScript.

#Curent Stable Version

1.1.0

#Change Log

1.1.1
- Added "empty" construct for collections which allows template authors to specify a sub-template to be applied in the event that the collection is empty.
- Fixed a minor issue in the collection accesing function that prevented [#] from working under certain circumstances.
- Fixed issue with the "to" parameter and TemplateIO.Write... must check for undefined or null before writing!

1.1.0
- Major re-write removing all DOM (document, window, etc.) constructs in an effort to make kruntch totally portable to node.js.
- Template parsing was most affected as 1.0.0 was heavily relying on DOM to parse the template text into traversable nodes.
- Token parsing (ala George Vaccaro) is now utilized to split the template text into Kruntch.js template contstrutcs and text.
- For this Kruntch.js is now totally functional in node.js!  The node.js module is: kruntch.node-1.1.0.js.   

1.0.0
- Initial version

#Browser compatibility

IE 7+, FF, Chrome, Mobile Safari, Mobile Chrome

#Contribute!

Current contributer list:

- David Vaccaro
- George Vaccaro

#Licence

See LICENSE-INFO.txt
