

export function searchWord(partialWord, data, aliasMap) {

  // Buscar en aliasMap
  // No muy eficiente, pero se optimizara si es necesario
  const MAX_RESULTS = 50
  let results = []
  let currentMatches = new Set()
  for (const [match, value] of aliasMap.entries()) {
    if (match.startsWith(partialWord)) {
      if (currentMatches.has(value)) {
        continue
      }
      if (currentMatches.size === MAX_RESULTS) {
        break
      }

      currentMatches.add(value)

      let result = {}
      result.particleId = value
      result.summary = renderWordWithFix(data, value)
      result.variations = renderWordWithFixVariations(data, value)
      result.title = data[value].title
      result.color = data[value].color
      results.push(result)
    }
  }

  results.sort(function(resultA, resultB) {
    if(resultA.particleId < resultB.particleId) { return -1; }
    if(resultA.particleId > resultB.particleId) { return 1; }
    return 0;
  });

  return results
}

export function renderWordWithFix(data, entryWord) {
  let word = entryWord.split("|")[0]
  let value = data[entryWord]
  return applyFix(word, value.fix)
}

export function renderWordWithFixVariations(data, entryWord) {
  let value = data[entryWord]
  if (value.variations.length === 0) {
    return ""
  }

  let results = "("
  let first = true
  for (let v of value.variations) {
    if (!first) {
      results += ", "
    } else {
      first = false
    }
    results += applyFix(v, value.fix)
  }
  return results + ")"
}

export function applyFix(word, fix) {
  let outputWord = word
  if (fix !== undefined) {
    if (fix === "pre") {
      outputWord = word + "-"
    } else if (fix === "in") {
      outputWord = "-" + word + "-"
    } else if (fix === "post") {
      outputWord = "-" + word
    }
  }
  return outputWord
}
