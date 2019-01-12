import {hasNolsComment} from './util/util';

const chalk = require('chalk');

const HEIGHT_TRANSLATIONS = {
  name: 'Y',
  attributes: [
    'height:',
    'top:', 'bottom:',
    'padding-top:', 'padding-bottom:',
    'margin-top:', 'margin-bottom:',
    'transform: translateY',
  ],
};
const WIDTH_TRANSLATIONS = {
  name: 'X',
  attributes: [
    'width:',
    'left:', 'right:',
    'padding-left:', 'padding-right:',
    'margin-left:', 'margin-right:',
    'transform: translateX',
  ],
};
const COMBINED_TRANSLATIONS = {
  name: 'XY',
  attributes: [
    'margin:', 'padding:', 'translate:',
  ]
};

const CONVERSION_TYPES = [
  COMBINED_TRANSLATIONS, WIDTH_TRANSLATIONS, HEIGHT_TRANSLATIONS,
];

export function convertLine(line) {
  return new Promise(async (resolve) => {
    const conversionType = await getConversionType(line);
    if (conversionType === null || hasNolsComment(line)) {
      resolve(line);
    }
    const originalVal = line.split(':')[1]; // Grab the value.
    const parsedVal = parseFloat(originalVal); // Convert value to float (which removes the px/vh/%/em... strings).
    const calculatedVal = await calculate(parsedVal, conversionType);
    if(calculatedVal === null) { // Something went wrong with the calculation...
      resolve(line);
    }
    resolve(line.replace(`${parsedVal}px`, `${calculatedVal}${getViewportType(conversionType)}`) + global.NOLS_CMT + originalVal);
  });
}

export async function calculate(val, type) {
  return new Promise((resolve) => {
    switch (type) {
      case('Y'): {
        resolve(calculateVH(val));
        break;
      }
      case('X'): {
        resolve(calculateVW(val));
        break;
      }
      case('XY'): {
        console.log(chalk.warning(line.split(':')[0], 'attribute not currently supported', line));
        resolve(line);
        break;
      }
      default: {
        console.log(chalk.warning('Unknown type slipped through the cracks...', type));
        resolve(line);
        break;
      }
    }
  });
}

export function calculateVH(val) {
  if (!isNaN(val) && !isNaN(global.VIEWPORT.HEIGHT)) return (val * 100) / global.VIEWPORT.HEIGHT;
  return null;
}

export function calculateVW(val) {
  if (!isNaN(val) && !isNaN(global.VIEWPORT.WIDTH)) return (val * 100) / global.VIEWPORT.WIDTH;
  return null;
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
