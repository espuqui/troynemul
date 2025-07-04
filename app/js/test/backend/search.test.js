import {searchWord} from "../../backend/search.js";
import {buildAliasMap} from "../../backend/parser.js";
describe('searchTests', () => {
  test('wordsAreFound', () => {
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
    data["li|conj"]["variations"] = ["ya", "*ye"]
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
    data["mo|conj"] = {}
    data["mo|conj"]["variations"] = undefined
    data["mo|conj"]["title"] = "any4"
    data["mo|conj"]["color"] = "katü"
    data["mo|conj"]["fix"] = "post"

    let aliasMap = buildAliasMap(data)

    let actualResults = searchWord("m", data, aliasMap)

    let expectedResults = []

    let expectedResults1 = {}
    expectedResults1.particleId = "ma|conj"
    expectedResults1.summary = "ma"
    expectedResults1.variations = ""
    expectedResults1.title = "any3"
    expectedResults1.color = "kadü"
    expectedResults.push(expectedResults1)

    let expectedResults2 = {}
    expectedResults2.particleId = "mew|inst"
    expectedResults2.summary = "mew-"
    expectedResults2.variations = "(mu-, mo-)"
    expectedResults2.title = "sufijoinst"
    expectedResults2.color = "kallfü"
    expectedResults.push(expectedResults2)

    let expectedResults3 = {}
    expectedResults3.particleId = "me|conj"
    expectedResults3.summary = "-me"
    expectedResults3.variations = ""
    expectedResults3.title = "any2"
    expectedResults3.color = "karü"
    expectedResults.push(expectedResults3)

    let expectedResults4 = {}
    expectedResults4.particleId = "mo|conj"
    expectedResults4.summary = "-mo"
    expectedResults4.variations = ""
    expectedResults4.title = "any4"
    expectedResults4.color = "katü"
    expectedResults.push(expectedResults4)

    expect(actualResults[0]).toStrictEqual(expectedResults[0])
    expect(actualResults[1]).toStrictEqual(expectedResults[1])
    expect(actualResults[2]).toStrictEqual(expectedResults[2])
    expect(actualResults[3]).toStrictEqual(expectedResults[3])
    expect(actualResults[4]).toStrictEqual(expectedResults[4])

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
