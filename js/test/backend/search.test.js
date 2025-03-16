import {searchWord} from "../../src/backend/search.js";
import {buildAliasMap} from "../../src/backend/parser.js";
describe('searchTests', () => {
  test('wordsAreFounds', () => {
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
    expectedResults1.particleId = "mew|inst"
    expectedResults1.summary = "-mew"
    expectedResults1.variations = "(-mu, -mo)"
    expectedResults1.title = "sufijoinst"
    expectedResults1.color = "kallfü"
    expectedResults.push(expectedResults1)

    let expectedResults2 = {}
    expectedResults2.particleId = "me|conj"
    expectedResults2.summary = "me-"
    expectedResults2.variations = ""
    expectedResults2.title = "any2"
    expectedResults2.color = "karü"
    expectedResults.push(expectedResults2)

    let expectedResults3 = {}
    expectedResults3.particleId = "ma|conj"
    expectedResults3.summary = "ma"
    expectedResults3.variations = ""
    expectedResults3.title = "any3"
    expectedResults3.color = "kadü"
    expectedResults.push(expectedResults3)

    expect(actualResults[0]).toStrictEqual(expectedResults[0])
    expect(actualResults[0]).toStrictEqual(expectedResults[0])
    expect(actualResults[1]).toStrictEqual(expectedResults[1])
    expect(actualResults[2]).toStrictEqual(expectedResults[2])

    let nullResults = searchWord("zz", data, aliasMap)
    expect(nullResults.length).toBe(0)

    let actualResultsWithLi = searchWord("li", data, aliasMap)

    let expectedResultsWithLi = []
    let expectedResultsWithLi1 = {}
    expectedResultsWithLi1.particleId = "li|conj"
    expectedResultsWithLi1.summary = "-li-"
    expectedResultsWithLi1.variations = "(-ya-)"
    expectedResultsWithLi1.title = "any1"
    expectedResultsWithLi1.color = "chod"
    expectedResultsWithLi.push(expectedResultsWithLi1)

    expect(actualResultsWithLi[0]).toStrictEqual(expectedResultsWithLi[0])
  })
})
