import {buildAliasMap, searchAdditionalExamples, parseExample} from "../../backend/parser.js"

describe('parserExamples', () => {
  test('ejemplosEstanAlineados', () => {

    let actual = parseExample("anel mew fach-antü",
                              "amenazar (inst) este-dia")

    let expected = ["anel*amenazar", " ", "mew|inst", " ", "fach*este", "antü*dia"]

    expect(actual).toStrictEqual(expected)
  })

  test('ejemplosEstanAlineadosConPunto', () => {
    let actual = parseExample("apon anel mew fach-antü",
                              "estar.lleno.de amenazar (inst) este-dia")
    let expected = ["apon*estar lleno de", " ", "anel*amenazar", " ", "mew|inst", " ", "fach*este", "antü*dia"]

    expect(actual).toStrictEqual(expected)
  })
})

describe('parseAll', () => {
  test('listMissingWords', () => {

    async function loadData() {
      const {default: data} = await import('../../../data/particles.json', {with: {type: 'json'}});
      return data
    }
    loadData().then(data => {

      let missing = new Set()
      let aliasMap = buildAliasMap(data)

      for (const particleInData in data) {
        const contents = data[particleInData];

        for (let content of contents.content) {
          for (let example of content.examples) {
            let exampleParts = parseExample(example[0], example[1])
            for (let examplePart of exampleParts) {
              if (examplePart.includes("|")) {
                let examplePartToLookup = examplePart.toLowerCase()
                let currentWord = aliasMap.get(examplePartToLookup)
                if (currentWord === undefined) {
                  missing.add(examplePartToLookup)
                }
              }
            }
          }
        }
      }

      let m = ""
      const missingSorted = Array.from(missing);
      missingSorted.sort()
      for (let missedWord of missingSorted) {
        m = m + missedWord + "\n"
      }
      console.log(m)
    })
  })
})
describe('aliasMap', () => {
  test('aliasMapGeneratedCorrectly', () => {
    let data = {}
    data["mew|inst"] = {}
    data["mew|inst"]["variations"] = ["mu", "mo"]
    data["le|adv"] = {}
    data["le|adv"]["variations"] = ["küle"]
    data["a|conj"] = {}
    data["a|conj"]["variations"] = ["ya"]
    data["b|conj"] = {}
    data["b|conj"]["variations"] = []
    data["e|conj"] = {}
    data["d|conj2"] = {}
    data["d|conj2"]["variations"] = ["*ya", "a"]

    let aliasMap = buildAliasMap(data)

    expect(aliasMap.get("mu|inst")).toBe("mew|inst")

    expect(aliasMap.get("mu|inst")).toBe("mew|inst")
    expect(aliasMap.get("mew|inst")).toBe("mew|inst")
    expect(aliasMap.get("mo|inst")).toBe("mew|inst")

    expect(aliasMap.get("le|adv")).toBe("le|adv")
    expect(aliasMap.get("küle|adv")).toBe("le|adv")

    expect(aliasMap.get("a|conj")).toBe("a|conj")
    expect(aliasMap.get("ya|conj")).toBe("a|conj")

    expect(aliasMap.get("b|conj")).toBe("b|conj")

    expect(aliasMap.get("e|conj")).toBe("e|conj")
    expect(aliasMap.get("d|conj2")).toBe("d|conj2")
    expect(aliasMap.get("ya|conj2")).toBe("d|conj2")
    expect(aliasMap.get("a|conj2")).toBe("d|conj2")

  })

})

describe('aliasMapWithSearch', () => {
  test('searchWorksCorrectlyWithAliasMap', () => {
    let data = {}
    data["mew|inst"] = {}
    data["mew|inst"]["variations"] = ["mu", "mo"]
    data["mew|inst"]["content"] = []

    let mewContent1 = {}
    mewContent1["examples"] = [["", "", ""], ["", "", ""]]
    data["mew|inst"]["content"].push(mewContent1)

    data["le|adv"] = {}
    data["le|adv"]["variations"] = ["küle"]

    let leContent1 = {}
    leContent1["examples"] = [["", "", ""]]

    let leContent2 = {}
    leContent2["examples"] = [["mew ko-le", "(inst) agua-(adv)", "esp1"]]

    data["le|adv"]["content"] = []
    data["le|adv"]["content"].push(leContent1)
    data["le|adv"]["content"].push(leContent2)

    data["a|conj"] = {}
    data["a|conj"]["variations"] = ["ya"]

    let aContent1 = {}
    aContent1["examples"] = [["", "", ""]]

    let aContent2 = {}
    aContent2["examples"] = [["b a piru", "(conj) (conj) gusano", "esp2"]]

    data["a|conj"]["content"] = []
    data["a|conj"]["content"].push(aContent1)
    data["a|conj"]["content"].push(aContent2)

    data["b|conj"] = {}
    data["b|conj"]["variations"] = []

    let bContent1 = {}
    bContent1["examples"] = [["", "", ""]]

    let bContent2 = {}
    bContent2["examples"] = [["fey-mu", "el-(inst)", "esp3"]]

    data["b|conj"]["content"] = []
    data["b|conj"]["content"].push(bContent1)
    data["b|conj"]["content"].push(bContent2)

    let aliasMap = buildAliasMap(data)
    let examples = searchAdditionalExamples("mu|inst", data, aliasMap)

    expect(["mew|inst", " ", "ko*agua", "le|adv"]).toStrictEqual(examples[0][0])
    expect("esp1").toStrictEqual(examples[0][1])

    expect(["fey*el", "mu|inst"]).toStrictEqual(examples[1][0])
    expect("esp3").toStrictEqual(examples[1][1])

    let examples2 = searchAdditionalExamples("b|conj", data, aliasMap)
    expect(["b|conj", " ", "a|conj", " ", "piru*gusano"]).toStrictEqual(examples2[0][0])
    expect("esp2").toStrictEqual(examples2[0][1])
  })
})
