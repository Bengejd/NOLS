/*
 * This tells us if the line is convertible / revertible / cleanable
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

export function hasBorderRadius(line) {
  return (
    line.includes('border-top-right-radius') ||
    line.includes('border-top-left-radius') ||
    line.includes('border-bottom-right-radius') ||
    line.includes('border-bottom-left-radius')
  );
}

export function hasFontSize(line) {
  return line.includes('font-size');
}

export function isAMixin(line) {
  return (line.includes('@include') || line.includes('@mixin'));
}

export function isExtended(line) {
  return line.includes('@extend');
}


export function notABracket(line) {
  return (line.startsWith('{') || line.endsWith('}'));
}

export function isOnlyComment(line) { // Isn't an inline comment
  return (onlyBlockComment(line) || onlyInlineComment(line));
}

export function onlyBlockComment(line) { // Isn't a block comment line.
  return (line.startsWith('/*') && line.endsWith('*/'));
}

export function onlyInlineComment(line) {
  return line.startsWith('//');
}

/*
 * Blank (new line) strings have a length of 0.
 */
export function isNewLine(line) {
  if (isString(line)) return line.trim().length === 0;
  return false;
}

export function hasPX(line) {
  if (isString(line)) return line.includes('px');
  return false;
}

export function isString(line) {
  return typeof line === 'string';
}

export function hasNolsComment(line) {
  return line.includes('// NOLS Converted from:');
}

/*
 * When using mocha or build:test, we need to substitute values around the package, so this helps us accomplish that.
 * `npm run test` - CMD will have global.NOLS_ARGS.testing as UNDEFINED, while env.testing as TRUE.
 * `npm run build:test` - CMD will have global.NOLS_ARGS.testing as TRUE, while env.testing as UNDEFINED.
 * This will return false on production environments.
 */
export function areWeTesting() {
  console.log('Are we testing: ', global.NOLS_ARGS.testing === 'true');
  if (global.NOLS_ARGS && global.NOLS_ARGS.testing === 'true') return true;
  else if (process.env.testing) return process.env.testing;
  else return false;
}

export function hasHeightArg() {
  console.log('has height: ', (global.NOLS_ARGS && (global.NOLS_ARGS.height || global.NOLS_ARGS.h)));
  return (global.NOLS_ARGS && (global.NOLS_ARGS.height || global.NOLS_ARGS.h));
}

export function hasWidthArg() {
  return (global.NOLS_ARGS && (global.NOLS_ARGS.width || global.NOLS_ARGS.w));
}

export function hasEntryArg() {
  return (global.NOLS_ARGS && (global.NOLS_ARGS.entry || global.NOLS_ARGS.e));
}

export function getTestingSrc() {
  return './test/test-scss/read-file-tests/only-stylesheets/';
}

export function getProductionSrc() {
  if(hasEntryArg()) {
    if(global.NOLS_ARGS && global.NOLS_ARGS.entry) return global.NOLS_ARGS.entry;
    else if(global.NOLS_ARGS && global.NOLS_ARGS.e) return global.NOLS_ARGS.e;
  }
  else return './src/';
}
