/**
 * Checks if an object is empty or not.
 *
 * @param {any} obj - The object to check.
 * @returns {boolean} True if the object is empty, false otherwise.
 *
 * An object is considered empty if it is null, undefined, an empty array, an
 * empty string, or an object with no own enumerable properties.
 */
export function isEmpty(obj) {
  // Check if the object is null or undefined
  if (obj === null || obj === undefined) {
    return true;
  }

  // Check if the object is an empty array or string
  if (Array.isArray(obj) && obj.length === 0) {
    return true;
  }
  if (typeof obj === 'string' && obj.length === 0) {
    return true;
  }

  // Check if the object has own enumerable properties
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}
