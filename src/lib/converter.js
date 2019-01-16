const log = require('clg-color');

/* istanbul ignore next */
import {areWeTesting, hasNolsComment, hasPX, hasComma, isString} from './util/util';

const HEIGHT_TRANSLATIONS = {
  name: 'Y',
  attributes: [
    'height:', 'max-height:', 'min-height:', 'line-height:',
    'top:', 'bottom:',
    'padding-top:', 'padding-bottom:',
    'margin-top:', 'margin-bottom:',
    'transform: translateY',
  ],
};
const WIDTH_TRANSLATIONS = {
  name: 'X',
  attributes: [
    'width:', 'max-width:', 'min-width:', 'column-width:', 'outline-width:',
    'left:', 'right:',
    'padding-left:', 'padding-right:',
    'margin-left:', 'margin-right:',
    'transform: translateX',
    'word-spacing:', 'letter-spacing:'
  ],
};
const COMBINED_TRANSLATIONS = {
  name: 'XY',
  attributes: [
    'margin:', 'padding:', 'translate:',
    // 'border:', 'border-radius:', 'outline:',
  ]
};

const CONVERSION_TYPES = [
  WIDTH_TRANSLATIONS, HEIGHT_TRANSLATIONS, COMBINED_TRANSLATIONS,
];

export function convertLine(line) {
  return new Promise(async (resolve) => {
    const conversionType = await getConversionType(line);
    if (conversionType === null || hasNolsComment(line)) {
      resolve(line);
    }
    const originalVal = line.split(':')[1]; // Grab the value.
    const parsedVal = parseFloat(originalVal); // Convert value to float (which removes the px/vh/%/em... strings).
    const calculatedVal = await calculate(parsedVal, conversionType, line);
    if (calculatedVal === null) resolve(line);
    else if(conversionType === 'XY') resolve(calculatedVal); // XY handles it's own formatting.
    else resolve(formatNewLine(line, parsedVal, calculatedVal, conversionType, originalVal));
  }).catch(/* istanbul ignore next */ (err) => log.error('Error processing: ', line, err));
}

export function formatNewLine(line, parsedVal, calcVal, conversionType, origVal) {
  const CMT = areWeTesting() ? ' /* NOLS Converted from:' : /* istanbul ignore next */ global.NOLS_CMT;
  return line.replace(`${parsedVal}px`, `${calcVal}${getViewportType(conversionType)}`) + CMT + origVal + ' */';
}

export async function calculate(val, type, attribute) {
  return new Promise(async (resolve) => {
    switch (type) {
      case('Y'): {
        resolve(await calculateVH(val));
        break;
      }
      case('X'): {
        resolve(await calculateVW(val));
        break;
      }
      case('XY'): {
        // log.warning(attribute.trim(), 'attribute not currently supported');
        resolve(null);
        break;
      }
      default: {
        // log.warning('Unknown type slipped through the cracks...', attribute, val);
        resolve(null);
        break;
      }
    }
  });
}

export function calculateVH(val) {
  const HEIGHT = areWeTesting() ? 812 : /* istanbul ignore next */ global.VIEWPORT.HEIGHT;
  if (!isNaN(val) && !isNaN(HEIGHT)) return (val * 100) / HEIGHT;
  else return null;
}

export function calculateVW(val) {
  const WIDTH = areWeTesting() ? 375 : /* istanbul ignore next */ global.VIEWPORT.WIDTH;
  if (!isNaN(val) && !isNaN(WIDTH)) return (val * 100) / WIDTH;
  else return null;
}

export function getConversionType(line) {
  return new Promise((resolve) => {
    for (let type = 0; type < CONVERSION_TYPES.length; type++) {
      for (let attribute = 0; attribute < CONVERSION_TYPES[type].attributes.length; attribute++) {
        if (line.indexOf(CONVERSION_TYPES[type].attributes[attribute]) > -1) {
          resolve(CONVERSION_TYPES[type].name);
          type = attribute = 1000; // Attribute was found, break out of the for loops. Could be a goto instead?
        }
      }
    }
    resolve(null); // If we get here. A type wasn't found for the conversion.
  });
}

export function getViewportType(type) {
  if (type === 'X') return 'vw';
  if (type === 'Y') return 'vh';
  if (type === 'XY') {
    return null;
  } else {
    return null;
  }
}

export function handleTranslateAttribute(line, vals) {
  return line; // This isn't handled yet.
}

// TODO: Find out if we can speed this process up. Could cause a bottleneck.
export async function calculateCombined(line) {
  return new Promise(async (resolve) => {
    const indexOfFirstNum = line.search(/\d/);
    const valsAfterFirstNum = line.substring(indexOfFirstNum, line.index);
    const baseString = line.substring(0, indexOfFirstNum);
    const origVal = line.substring(line.indexOf(':'), line.length);
    console.log('valsAfterFirstNum: ', valsAfterFirstNum);
    console.log('baseString: ', baseString);
    // Since translate doesn't adhere to our calculation. Handle it specially.
    if (hasComma(line)) return resolve(await handleTranslateAttribute(line, valsAfterFirstNum));

    // Now we need to create an array of the values.
    const lineValues = valsAfterFirstNum.split(' ');
    console.log('lineValues: ', lineValues);

    var calculatedString = baseString;

    // Get only the numbers that have px values.
    var onlyPxValues = lineValues.map((v) => {
      if (parseFloat(v) === null || !hasPX(v.trim())) return v;
      else return parseFloat(v);
    }).map((v, index) => {
      if (isString(v)) return v;
      else { // Calculate them individually.
        // top || bottom
        if (index === 0 || index === 2) return calculateVH(v) + 'vh';
        // right || left
        if (index === 1 || index === 3) return calculateVW(v) + 'vw';
      }
    }).map((v, index) => { // Put all the calculated vals together.
      // Add a semi-colon at the end.
      if (index === lineValues.length - 1) calculatedString = calculatedString + v + ';';
      // Add a space between values.
      else calculatedString = calculatedString + v + ' ';
    });
    console.log('CalculatedString: ', calculatedString);

    console.log('onlyPxValues Calculated : ', onlyPxValues);

    // Format the string with the comment & original value.

    const CMT = areWeTesting() ? ' /* NOLS Converted from' : /* istanbul ignore next */ global.NOLS_CMT;
    resolve(calculatedString + CMT + origVal + ' */');
  });
}
