const readXmlFile = require('../tools/xml-reader.js');
const path = require('path');

const xmlDataPath = path.resolve(__dirname, '..', '..', 'data', 'Clients.xml');
const jsData = readXmlFile(xmlDataPath, 'Clients', 'Client');

/**
 * Read the Clients.xml file and parse it.
 * Format the output to a more readable js object.
 */
const result = jsData
    .map((item) => (
        Object.keys(item)
            .reduce((accumulator, value) => (
                accumulator[String(value).toLowerCase()] = item[value], accumulator
            ), {})
    ));

module.exports = result;
