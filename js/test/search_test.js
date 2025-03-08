import {assertEqual, assertEqualArray, assertEqualDictionary} from "../tools/test_tools.js"

import {searchWord} from "../src/search.js";
import {buildAliasMap} from "../src/parser.js";
export function runAllSearchTests() {
  searchWordTests()
}


function searchWordTests() {

  let data = {}
  data["mew|inst"] = {}
  data["mew|inst"]["variations"] = ["mu", "mo"]
  data["mew|inst"]["title"] = "sufijoinst"
  data["mew|inst"]["color"] = "kallfü"
  data["mew|inst"]["fix"] = "pre"

  data["le|adv"] = {}
  data["le|adv"]["variations"] = ["küle"]
  data["le|adv"]["title"] = "continuo"
  data["le|adv"]["color"] = "kelü"
  data["le|adv"]["fix"] = "in"
  data["li|conj"] = {}
  data["li|conj"]["variations"] = ["ya"]
  data["li|conj"]["title"] = "any1"
  data["li|conj"]["color"] = "chod"
  data["li|conj"]["fix"] = "in"
  data["me|conj"] = {}
  data["me|conj"]["variations"] = []
  data["me|conj"]["title"] = "any2"
  data["me|conj"]["color"] = "karü"
  data["me|conj"]["fix"] = "post"
  data["ma|conj"] = {}
  data["ma|conj"]["variations"] = []
  data["ma|conj"]["title"] = "any3"
  data["ma|conj"]["color"] = "kadü"
  data["ma|conj"]["fix"] = undefined

  let aliasMap = buildAliasMap(data)

  let actualResults = searchWord("m", data, aliasMap)

  let expectedResults = []
  let expectedResults1 = {}
  expectedResults1.summary = "-mew"
  expectedResults1.variations = "[-mu,-mo]"
  expectedResults1.title = "sufijoinst"
  expectedResults1.color = "kallfü"
  expectedResults.push(expectedResults1)

  let expectedResults2 = {}
  expectedResults2.summary = "me-"
  expectedResults2.variations = ""
  expectedResults2.title = "any2"
  expectedResults2.color = "karü"
  expectedResults.push(expectedResults2)

  let expectedResults3 = {}
  expectedResults3.summary = "ma"
  expectedResults3.variations = ""
  expectedResults3.title = "any3"
  expectedResults3.color = "kadü"
  expectedResults.push(expectedResults3)

  assertEqualDictionary(actualResults[0], expectedResults[0])
  assertEqualDictionary(actualResults[1], expectedResults[1])
  assertEqualDictionary(actualResults[2], expectedResults[2])

  let nullResults = searchWord("zz", data, aliasMap)
  assertEqual(nullResults.length, 0)

  let actualResultsWithLi = searchWord("li", data, aliasMap)

  let expectedResultsWithLi = []
  let expectedResultsWithLi1 = {}
  expectedResultsWithLi1.summary = "-li-"
  expectedResultsWithLi1.variations = "[-ya-]"
  expectedResultsWithLi1.title = "any1"
  expectedResultsWithLi1.color = "chod"
  expectedResultsWithLi.push(expectedResultsWithLi1)

  assertEqualDictionary(actualResultsWithLi[0], expectedResultsWithLi[0])
}
