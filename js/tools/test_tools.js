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
