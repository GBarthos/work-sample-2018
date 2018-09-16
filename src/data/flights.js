const readXmlFile = require('../tools/xml-reader.js');
const path = require('path');

function formatTimeString(str) {
    if (!str || typeof str !== "string") {
        return '';
    }

    const value = str.trim().toLocaleLowerCase();
    return value.endsWith('z') ? value.substring(0, value.length -1) : value;
}

const xmlDataPath = path.resolve(__dirname, '..', '..', 'data', 'Flights.xml');
const jsData = readXmlFile(xmlDataPath, 'Flights', 'Flight');

/**
 * Read the Flights.xml file and parse it.
 * Format the output to a more readable js object.
 */
const result = jsData
    .map((item) => (
        Object.keys(item)
            .reduce((accumulator, value) => (
                accumulator[String(value).toLowerCase()] = item[value], accumulator
            ), {})
    ))
    .map((item) => {
        item.departure = formatTimeString(item.departure);
        item.arrival = formatTimeString(item.arrival);
        return item;
    });

module.exports = result;
