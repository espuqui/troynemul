

export function parseExample(mapuche, grammar) {
  let mapucheParts = mapuche.split(/[\-\s]/)
  let grammarParts = grammar.split(/[\-\s](?![^(]*\))/)

  if (mapucheParts.length !== grammarParts.length) {
    return ["error*error"]
  }

  let output = []
  let mapucheWordIndex = 0

  for (let i in mapucheParts) {
    let mapucheWord = mapucheParts[i]
    let grammarWord = grammarParts[i]

    let mixedWord

    if (grammarWord.startsWith("(")) {
      mixedWord = mapucheWord + "|" + grammarWord.replace(/[()]/g, "")
    } else {
      mixedWord = mapucheWord + "*" + grammarWord.replace(".", " ")
    }

    output.push(mixedWord)

    let separatorIndex = mapucheWordIndex + mapucheWord.length
    mapucheWordIndex += mapucheWord.length + 1

    if (separatorIndex < mapuche.length && mapuche[separatorIndex] === " ") {
      output.push(" ")
    }
  }

  return output
}

export function buildAliasMap(data) {

  let result = new Map()

  for (let key in data) {
    result.set(key, key)
    let type = key.split("|")[1]
    for (let variation of data[key].variations) {
      let variationKey = variation + "|" + type
      result.set(variationKey, key)
    }
  }
  return result
}
