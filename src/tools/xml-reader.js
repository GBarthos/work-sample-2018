const fs = require('fs');
const path = require('path');
const parser = require('xml-js');
const { handleError } = require('../tools/utils.js');

const options = {
    compact: true,
    trim: true,
    ignoreComment: true,
    alwaysChildren: true,
    ignoreInstruction: true,
    ignoreComment: true,
    ignoreDoctype: true,
    nativeType: true,
    nativeTypeAttributes: true
};

/**
 * Read an XML file and convert it to a js-object.
 *
 * @param {String} filePath a path to an XML file
 * @param {*} rootElementName name of the root element of the XML
 * @param {*} itemListName name of the element in the list
 * @throws
 * @returns a js-object parsed from the given XML file
 */
function readXmlFile(filePath, rootElementName, itemListName) {
    // arguments validation ///
    if (!rootElementName || typeof rootElementName !== 'string') {
        handleError(`argument [rootElementName] should be a non empty string !`);
    }
    if (!itemListName || typeof itemListName !== 'string') {
        handleError(`argument [itemListName] should be a non empty string !`);
    }
    if (!fs.existsSync(filePath)) {
        handleError(`path "${filePath}" does not exists !`);
    }
    if (!fs.statSync(filePath).isFile()) {
        handleError(`path "${filePath}" is not a file !`);
    }

    try {
        // read xml file
        const xmlString = fs.readFileSync(filePath, 'utf8');

        // parse xml string to js object
        const jsObject = parser.xml2js(xmlString, options);
        const itemList = jsObject[rootElementName][itemListName];

        // map the result to a more readable format
        const itemArray = itemList.map((item) => (
            Object.keys(item._attributes)
                .reduce((accumulator, value) => (
                    accumulator[value] = item._attributes[value], accumulator
                ), {})
        ));

        return itemArray;
    } catch (e) {
        const err = e && e.message ? e.message : e;
        handleError(String(err));
    }
}

module.exports = readXmlFile;
