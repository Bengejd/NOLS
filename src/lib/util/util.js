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

/* istanbul ignore next */
export function setOptions(opts) {
  global.MODE = opts.MODE;
  global.VIEWPORT = {
    HEIGHT: parseFloat(opts.HEIGHT),
    WIDTH: parseFloat(opts.WIDTH)
  };
  console.log(global.VIEWPORT);
}
