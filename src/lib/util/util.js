/*
 * This tells us if the line is convertible / revertible / cleanable
 */
export function isConvertible(line) {
  const trimmed = line.trim();
  return (
    !isNewLine(trimmed) // Isn't a new line.
    && !isOnlyComment(trimmed) // Isn't only a block or inline comment.
    && !notABracket(trimmed) // Isn't a bracket.
    && hasPX(trimmed) // Line has a Pixel value.
  );
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
