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
      mixedWord = mapucheWord + "*" + grammarWord.replaceAll(".", " ")
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
    if (data[key].variations !== undefined) {
      for (let rawVariation of data[key].variations) {
        let variation = rawVariation.replaceAll('*', '')
        let variationKey = variation + "|" + type
        result.set(variationKey, key)
      }
    }
  }
  return result
}

export function searchAdditionalExamples(particle, data, aliasMap) {

  let results = []

  let uniqueParticle = aliasMap.get(particle)

  for (const particleInData in data) {
    if (data.hasOwnProperty(particleInData)) {
      if (particleInData === uniqueParticle) {
        continue
      }

      const contents = data[particleInData];

      for (let content of contents.content) {
        for (let example of content.examples) {
          let grammarParts = parseExample(example[0], example[1])
          for (let part of grammarParts) {
            if (aliasMap.get(part) === uniqueParticle) {
              let additionalExample = []
              additionalExample.push(grammarParts)
              additionalExample.push(example[2])
              results.push(additionalExample)
              break
            }
          }
        }
      }
    }
  }

  return results
}
