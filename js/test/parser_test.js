import {assertEqual} from "../tools/test_tools.js"
import {NOUN_EXAMPLES} from "../data/nouns.js"

export function runAllTests() {
  parseNouns();
}


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
