/*
 * Tells us if a line is convertible || revertible || cleanable.
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function isConvertible(line) {
  const trimmed = line.trim();
  return (
    !isNewLine(trimmed) // Isn't a new line.
    && !isOnlyComment(trimmed) // Isn't only a block or inline comment.
    && !notABracket(trimmed) // Isn't a bracket.
    && !isAMixin(trimmed) // Isn't a mixin
    && !isExtended(trimmed) // Isn't a extend
    && !hasFontSize(trimmed) // Isn't a font-size attribute
    && !hasBorderRadius(trimmed) // Isn't a border-radius value.
    && hasPX(trimmed) // Line has a Pixel value.
  );
}

/*
 * Tells us if a line has the border-radius attribute.
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function hasBorderRadius(line) {
  return (
    line.includes('border-top-right-radius') ||
    line.includes('border-top-left-radius') ||
    line.includes('border-bottom-right-radius') ||
    line.includes('border-bottom-left-radius')
  );
}

/*
 * Tells us if a line includes the font-size attribute
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function hasFontSize(line) {
  return line.includes('font-size');
}

/*
 * Tells us if a line is a mixin.
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function isAMixin(line) {
  return (line.includes('@include') || line.includes('@mixin'));
}

/*
 * Tells us if a line is an extend.
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function isExtended(line) {
  return line.includes('@extend');
}

/*
 * Tells us if a line is just an opening / closing bracket.
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function notABracket(line) {
  return (line.startsWith('{') || line.endsWith('}'));
}

/*
 * Tells us if a line is just an inline / block comment.
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function isOnlyComment(line) { // Isn't an inline comment
  return (onlyBlockComment(line) || onlyInlineComment(line));
}

/*
 * Tells us if a line is just a block comment.
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function onlyBlockComment(line) { // Isn't a block comment line.
  return (line.startsWith('/*') && line.endsWith('*/'));
}

/*
 * Tells us if a line is just an inline comment.
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function onlyInlineComment(line) {
  return line.startsWith('//');
}

/*
 * Tells us if a line is just a  \n - new line.
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function isNewLine(line) {
  if (isString(line)) return line.trim().length === 0;
  return false;
}

/*
 * Tells us if a line has a px value.
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function hasPX(line) {
  if (isString(line)) return line.includes('px');
  return false;
}

/*
 * Tells us if a line is a string.
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function isString(line) {
  return typeof line === 'string';
}

/*
 * Tells us if a line has a NOLS_CMT.
 * @param {string} line - The line in question.
 * @returns boolean;
 */
export function hasNolsComment(line) {
  return (line.includes('/* NOLS Converted from:') && line.endsWith('*/'));
}

/*
 * When using mocha or build:test, we need to substitute values around the package, so this helps us accomplish that.
 * `npm run test` - CMD will have global.NOLS_ARGS.testing as UNDEFINED, while env.testing as TRUE.
 * `npm run build:test` - CMD will have global.NOLS_ARGS.testing as TRUE, while env.testing as UNDEFINED.
 * This will return false on production environments.
 */
export function areWeTesting() {
  if (global.NOLS_ARGS && global.NOLS_ARGS.testing === 'true') return true;
  else if (process.env.testing) return process.env.testing;
  else return false;
}

/*
 * Tells us if there was a height passed to NOLS via the command line.
 * @returns boolean;
 */
export function hasHeightArg() {
  return (global.NOLS_ARGS && (global.NOLS_ARGS.height || global.NOLS_ARGS.h));
}

/*
 * Tells us if there was a width passed to NOLS via the command line.
 * @returns boolean;
 */
export function hasWidthArg() {
  return (global.NOLS_ARGS && (global.NOLS_ARGS.width || global.NOLS_ARGS.w));
}

/*
 * Tells us if there was an entry directory passed to NOLS via the command line.
 * @returns boolean;
 */
export function hasEntryArg() {
  return (global.NOLS_ARGS && (global.NOLS_ARGS.entry || global.NOLS_ARGS.e));
}

/*
 * Gives us the entry directory if we're in testing mode.
 * @returns string;
 */
export function getTestingSrc() {
  return './test/test-scss/read-file-tests/only-stylesheets/';
}

/*
 * Gives us the entry directory if we're in production mode.
 * @returns string;
 */
export function getProductionSrc() {
  if(hasEntryArg()) {
    if(global.NOLS_ARGS && global.NOLS_ARGS.entry) return global.NOLS_ARGS.entry;
    else if(global.NOLS_ARGS && global.NOLS_ARGS.e) return global.NOLS_ARGS.e;
  }
  else return './src/';
}
