'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNewLine = isNewLine;
exports.getTranslationType = getTranslationType;
exports.hasPX = hasPX;
exports.calculateVH = calculateVH;
exports.calculateVW = calculateVW;
exports.isComment = isComment;
// Config Utility

const fs = require('fs');
const chalk = require('chalk');

const HEIGHT_TRANSLATIONS = {
  name: 'Y',
  attributes: ['height:', 'top:', 'bottom:', 'padding-top:', 'padding-bottom:', 'margin-top:', 'margin-bottom:', 'transform: translateY']
};
const WIDTH_TRANSLATIONS = {
  name: 'X',
  attributes: ['width:', 'left:', 'right:', 'padding-left:', 'padding-right:', 'margin-left:', 'margin-right:', 'transform: translateX']
};
const COMBINED_TRANSLATIONS = {
  name: 'XY',
  attributes: ['margin:', 'padding:', 'translate:']
};
const TRANSLATION_TYPES = [COMBINED_TRANSLATIONS, WIDTH_TRANSLATIONS, HEIGHT_TRANSLATIONS];

const hasConfigFile = exports.hasConfigFile = () => {
  console.log('Checking for config.json file...');
  return fs.existsSync('./rsoconfig.json');
};

const verifyConfig = exports.verifyConfig = (height, width) => {
  return !isNaN(height) && !isNaN(width) && height > 0 && width > 0;
};

// File Utility

const isDirectory = exports.isDirectory = path => {
  fs.statSync(path).isDirectory();
};

const checkLastLine = exports.checkLastLine = line => {
  return !!(isClosingBrace(line) || isNewLine(line));
};

function isClosingBrace(line) {
  return line.indexOf('}') > -1;
}

/*
 * Blank (new line) strings have a length of 0.
 */
function isNewLine(line) {
  return line.length === 0;
}

function getTranslationType(line) {
  return new Promise(resolve => {
    for (let type = 0; type < TRANSLATION_TYPES.length; type++) {
      for (let attribute = 0; attribute < TRANSLATION_TYPES[type].attributes.length; attribute++) {
        if (line.indexOf(TRANSLATION_TYPES[type].attributes[attribute]) > -1) {
          resolve(TRANSLATION_TYPES[type].name);
          type = attribute = 1000; // Attribute was found, break out of the for loops. Could be a goto instead?
        }
      }
    }
    resolve(null); // If we get here. A type wasn't found for the conversion.
  });
}

// Calculation Utility

function hasPX(line) {
  return line.includes('px');
}

function calculateVH(val, BASE_VIEW_HEIGHT) {
  return val * 100 / BASE_VIEW_HEIGHT;
}

function calculateVW(val, BASE_VIEW_WIDTH) {
  return val * 100 / BASE_VIEW_WIDTH;
}

// Comments Utility

/**
 * Checks if a line is a comment.
 * @param {string} line - The title of the book.
 * @returns boolean;
 */
function isComment(line) {
  return !!(isInlineComment(line) || isBlockComment(line));
}

/**
 * Checks if a line contains a block comment.
 * @param {string} line - The title of the book.
 * @returns boolean;
 */
function isBlockComment(line) {
  return line.indexOf('*/') > -1;
}

/**
 * Checks if a line is a inline comment.
 * @param {string} line - The title of the book.
 * @returns boolean;
 */
function isInlineComment(line) {
  return line.indexOf('//') > -1;
}