const log = require('clg-color');

/* istanbul ignore next */
import {areWeTesting, hasNolsComment, hasPX, hasTranslate, isString} from './util/util';

const HEIGHT_TRANSLATIONS = {
  name: 'Y',
  attributes: [
    'height:', 'max-height:', 'min-height:', 'line-height:',
    'top:', 'bottom:',
    'padding-top:', 'padding-bottom:',
    'margin-top:', 'margin-bottom:',
    'transform: translateY(',
  ],
};
const WIDTH_TRANSLATIONS = {
  name: 'X',
  attributes: [
    'width:', 'max-width:', 'min-width:', 'column-width:', 'outline-width:',
    'left:', 'right:',
    'padding-left:', 'padding-right:',
    'margin-left:', 'margin-right:',
    'transform: translateX(',
    'word-spacing:', 'letter-spacing:'
  ],
};
const COMBINED_TRANSLATIONS = {
  name: 'XY',
  attributes: [
    'margin:', 'padding:', 'transform: translate',
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
      return resolve(line);
    }
    const originalVal = line.split(':')[1]; // Grab the value.
    var parsedVal = parseFloat(originalVal); // Convert value to float (which removes the px/vh/%/em... strings).

    // TODO: Find a better way to handle this with translate attributes.
    if (isNaN(parsedVal)) { // TranslateX & translateY don't work well.
      parsedVal = line.split(':')[1];
      parsedVal = parsedVal.substring(parsedVal.search(/\d/), parsedVal.length);
      parsedVal = parseFloat(parsedVal);
    }

    const calculatedVal = await calculate(parsedVal, conversionType, line);
    if (calculatedVal === null) {
      log.error('Err converting: ', originalVal, parsedVal, conversionType, line);
      return resolve(line);
    }
    else if (conversionType === 'XY') return resolve(calculatedVal); // XY handles it's own formatting.
    else return resolve(formatNewLine(line, parsedVal, calculatedVal, conversionType, originalVal));
  }).catch(/* istanbul ignore next */ (err) => log.error('Error processing: ', line, err));
}

export function formatNewLine(line, parsedVal, calcVal, conversionType, origVal) {
  return line.replace(`${parsedVal}px`, `${calcVal}${getViewportType(conversionType)}`) + getCMT() + origVal + ' */';
}

export function getCMT() {
  if (areWeTesting()) return ' /* NOLS Converted from:';
  else return global.NOLS_CMT;
}

export async function calculate(val, type, line) {
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
        resolve(await calculateCombined(line));
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

// TODO: Decouple all of this logic. A lot of it is duplicate from calculateCombined()
export function handleTranslateAttribute(line, vals, base, origVal) {
  var calculatedString = base;
  const lineValues = vals.split(' ');

  lineValues.map((v) => parseFloat(v))
    .map((v, index) => {
      // X POS
      if (index === 0 && lineValues.length > 1) return calculateVW(v) + 'vw' + ',';
      if (index === 0 && lineValues.length === 1) return calculateVW(v) + 'vw' + ');';
      // Y POS
      if (index === 1) return calculateVH(v) + 'vh);';
    }).map((v, index) => { // Put all the calculated vals together.
    // Add a semi-colon at the end.
    if (index === vals.length - 1) calculatedString = calculatedString + v + ';';
    // Add a space between values.
    else calculatedString = calculatedString + v + ' ';
  });

  const CMT = getCMT();

  // An extra space gets added in, so we have to remove that... TODO: Fix this in the future.
  calculatedString = calculatedString.substring(0, calculatedString.length - 1);
  return new Promise((resolve) => resolve(calculatedString + CMT.substring(0, CMT.length -1) + origVal + ' */'));
}

// TODO: Find out if we can speed this process up. Could cause a bottleneck.
export async function calculateCombined(line) {
  return new Promise(async (resolve) => {
    const indexOfFirstNum = line.search(/\d/);
    const valsAfterFirstNum = line.substring(indexOfFirstNum, line.index);
    const baseString = line.substring(0, indexOfFirstNum);
    const origVal = line.substring(line.indexOf(':'), line.length);

    // Since translate doesn't adhere to our calculation. Handle it specially.
    if (hasTranslate(line)) return resolve(await handleTranslateAttribute(line, valsAfterFirstNum, baseString, origVal));

    // Now we need to create an array of the values.
    const lineValues = valsAfterFirstNum.split(' ');
    var calculatedString = baseString;

    // Get only the numbers that have px values.
    lineValues.map((v) => {
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

    const CMT = getCMT();

    // Format the string with the comment & original value.
    resolve(calculatedString + CMT.substring(0, CMT.length -1) + origVal + ' */');
  });
}
