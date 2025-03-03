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
