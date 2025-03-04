import {assertEqual, assertEqualArray} from "../tools/test_tools.js"
import {buildAliasMap, searchAdditionalExamples} from "../src/parser.js";

import {parseExample} from "../src/parser.js";
export function runAllTests() {
  //checkParseExample();
  //checkParseExample2();
  //checkBuildAliasMap();

  checkSearchAdditionalExamples()
}

/*
class DictionaryEntry {
  constructor(entryType, form, mapucheWord) {
    this.examples = []
    this.entryType = entryType
    this.form = form
    this.mapucheWord = mapucheWord
  }

  getExamples() {
    return this.examples
  }
}
class Dictionary {
  constructor() {
    this.mapucheDictionary = new Map()
    this.mapucheDictionaryUnique = new Map()
  }
  getMapuche(mapucheWord) {
    return this.mapucheDictionary.get(mapucheWord)
  }

  getDict() {
    return this.mapucheDictionary
  }

  addExample(example) {
    let mapucheWords = example.getMapucheWords()
    let grammarWords = example.getGrammarWords()

    if (grammarWords.length !== mapucheWords.length) {
      console.error("Ejemplos no calzan: \n" + example.getMapucheLine() + " => " + example.getGrammarLine())
      return
    }

    for (let index in mapucheWords) {
      let mapucheWord = mapucheWords[index]
      let grammarWord = grammarWords[index]

      let uniqueKey = mapucheWord + grammarWord
      if (!this.mapucheDictionaryUnique.has(uniqueKey)) {
        let entryType
        let form

        if (grammarWord.startsWith("(")) {
          entryType = grammarWord.replace(/[()]/g, "")
          form = mapucheWord
        } else {
          entryType = "noun"
          form = grammarWord
        }

        let dictionaryEntry = new DictionaryEntry(entryType, form, mapucheWord)
        this.mapucheDictionaryUnique.set(uniqueKey, dictionaryEntry)
      }

    //  this.mapucheDictionaryUnique.get(uniqueKey).examples.push(example)

      if (!this.mapucheDictionary.has(mapucheWord)) {
        this.mapucheDictionary.set(mapucheWord, new Map())
      }

      let dictionaryEntry = this.mapucheDictionaryUnique.get(uniqueKey)
      dictionaryEntry.examples.push(example)
      this.mapucheDictionary.get(mapucheWord).set(uniqueKey, dictionaryEntry)

      //dictionaryEntry.examples.push("a")
    }
  }
}
function parseNouns() {
  // Build examples
  let lines = NOUN_EXAMPLES.split("\n")

  let newExample = null
  let lineIndex = 0
  //let examples = []
  let dictionary = new Dictionary()

  for (let line of lines) {
    if (line === "") {
      if (newExample !== null) {
        // Add to list
        //examples.push(newExample)
        dictionary.addExample(newExample)

      }
      newExample = new Example();
      lineIndex = 0
      continue
    }

    if (lineIndex === 0) {
      newExample.setMapucheLine(line)
    }
    if (lineIndex === 1) {
      newExample.setGrammarLine(line)
    }
    if (lineIndex === 2) {
      newExample.setSpanishLine(line)
    }

    lineIndex++
  }

  console.dir(dictionary.mapucheDictionary.get("enew"));
}
*/

function checkParseExample() {
  let actual = parseExample("anel mew fach-antü",
                            "amenazar (inst) este-dia")
  let expected = ["anel*amenazar", " ", "mew|inst", " ", "fach*este", "antü*dia"]

  assertEqualArray(actual, expected)
}

function checkParseExample2() {
  let actual = parseExample("apon anel mew fach-antü",
                            "estar.lleno amenazar (inst) este-dia")
  let expected = ["apon*estar lleno", " ", "anel*amenazar", " ", "mew|inst", " ", "fach*este", "antü*dia"]

  assertEqualArray(actual, expected)
}

function checkBuildAliasMap() {

  let data = {}
  data["mew|inst"] = {}
  data["mew|inst"]["variations"] = ["mu", "mo"]
  data["le|adv"] = {}
  data["le|adv"]["variations"] = ["küle"]
  data["a|conj"] = {}
  data["a|conj"]["variations"] = ["ya"]
  data["b|conj"] = {}
  data["b|conj"]["variations"] = []

  let aliasMap = buildAliasMap(data)

  assertEqual(aliasMap.get("mu|inst"), "mew|inst")
  assertEqual(aliasMap.get("mew|inst"), "mew|inst")
  assertEqual(aliasMap.get("mo|inst"), "mew|inst")

  assertEqual(aliasMap.get("le|adv"), "le|adv")
  assertEqual(aliasMap.get("küle|adv"), "le|adv")

  assertEqual(aliasMap.get("a|conj"), "a|conj")
  assertEqual(aliasMap.get("ya|conj"), "a|conj")

  assertEqual(aliasMap.get("b|conj"), "b|conj")
}

function checkSearchAdditionalExamples() {
  let data = {}
  data["mew|inst"] = {}
  data["mew|inst"]["variations"] = ["mu", "mo"]
  data["mew|inst"]["examples"] = [["", "",""],["","",""]]
  data["le|adv"] = {}
  data["le|adv"]["variations"] = ["küle"]
  data["le|adv"]["examples"] = [["mew ko-le", "(inst) agua-(adv)","esp1"]]
  data["a|conj"] = {}
  data["a|conj"]["variations"] = ["ya"]
  data["a|conj"]["examples"] = [["", "",""],["b a piru","(conj) (conj) gusano","esp2"]]
  data["b|conj"] = {}
  data["b|conj"]["examples"] = [["", "",""],["fey-mu","el-(inst)","esp3"]]
  data["b|conj"]["variations"] = []

  let aliasMap = buildAliasMap(data)
  let examples = searchAdditionalExamples("mu|inst", data, aliasMap)

  assertEqualArray(["mew|inst", " ", "ko*agua", "le|adv"], examples[0][0])
  assertEqualArray("esp1", examples[0][1])

  assertEqualArray(["fey*el", "mu|inst"], examples[1][0])
  assertEqualArray("esp3", examples[1][1])

  let examples2 = searchAdditionalExamples("b|conj", data, aliasMap)
  assertEqualArray(["b|conj", " ", "a|conj", " ", "piru*gusano"], examples2[0][0])
  assertEqualArray("esp2", examples2[0][1])
}
