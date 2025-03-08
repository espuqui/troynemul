/**
 * Utilidades de testing
 *
 * @param actual Valor original
 * @param expected Valor esperado
 */

export function assertEqual(actual, expected) {
  if (expected !== actual) {
    console.error("FAIL: " + actual.toString() + " != " + expected.toString())
    try {
      throw new Error("Stacktrace:")
    } catch (e) {
      console.log(e.stack)
    }
  }
}

export function assertEqualArray(actual, expected) {
  if (actual.length !== expected .length) {
    console.error("FAIL: Size don't match " + actual.length + " != " + expected.length)
  }

  for (let i in actual) {
    assertEqual(actual[i], expected[i])
  }

}

export function assertEqualDictionary(actual, expected) {

  const keysActual = Object.keys(actual);
  const keysExpected = Object.keys(expected);

  if (keysActual.length !== keysExpected.length) {
    console.error("FAIL: Keys don't match " + keysActual.length + " != " + keysExpected.length)
  }

  for (let key of keysActual) {
    if (!expected.hasOwnProperty(key)) {
      console.error("FAIL: Expected doesn't have key: " + key)
      return false;
    }
    if (actual[key] !== expected[key]) {
      console.error("FAIL: Key " + key + "has different values " + actual[key] + " != " + expected[key])
      return false;
    }
  }

  return true;

}
