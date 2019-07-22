/**
 * Capitalize the first letter of a word
 * @param {String} str
 */
export const capitalizeFirstLetter = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Remove the extra 's' at the end of a word if it contains one.
 * @param {String} str
 */
export const makeSingular = str => {
  return str.charAt(str.length - 1).toLowerCase() === 's' ? str.slice(0, str.length - 1) : str;
};

/**
 * For Hyphenated words, convert them to a camel case style concatenation
 * @param {String} str
 */
export const convertHyphenToCamelCase = str => {
  const i = str.indexOf('-');
  return i === -1 ? str : str.slice(0, i) + capitalizeFirstLetter(str.slice(i + 1));
};
