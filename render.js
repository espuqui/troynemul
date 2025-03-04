import {parseExample} from "./js/src/parser.js";
import {buildAliasMap} from "./js/src/parser.js";

export function init() {
  handleTooltips();
}
function handleTooltips() {
  document.addEventListener('click', function(event) {
    let elements = document.getElementsByClassName("tooltip")
    for (let elem of elements) {
      if (elem === event.target) {
        elem.children[0].style.visibility = 'visible'
      } else {
        elem.children[0].style.visibility = 'hidden'
      }
    }
  });
}

export function render(particleId) {
  fetch("./js/data/nouns.json")
    .then((res) => res.json())
    .then((data) => {
      let aliasMap = buildAliasMap(data)
      let uniqueParticleId = aliasMap.get(particleId)
      renderFromParticleData(data[uniqueParticleId], uniqueParticleId)
    })
}

function renderFromParticleData(particleData, particleId) {

  const particleTitle = document.getElementById("particleTitle")
  const particleTypeTitle = document.getElementById("particleTypeTitle")
  const particleExplanation = document.getElementById("particleExplanation")
  const particleUsesBox = document.getElementById("particleUsesBox")
  const exampleList = document.getElementById("exampleList")

  particleTitle.innerText = getWordTitle(particleData, particleId)
  particleTypeTitle.innerText = particleData.title
  particleExplanation.innerText = particleData.explanation
  particleUsesBox.innerHTML = ""
  exampleList.innerHTML = ""

  for (let usage of particleData.usages) {
    particleUsesBox.innerHTML += renderUsage(usage)
  }

  for (let examples of particleData.examples) {
    exampleList.innerHTML += renderMapu(examples[0], examples[1]) + "<br/>" + renderWinka(examples[2])
      + "<br /><br />"
  }

}

function renderUsage(usage) {
  let colonIndex = usage.indexOf(":")

  if (colonIndex === -1) {
    return usage + "<br/>"
  }

  let subTitle = usage.substring(0, colonIndex + 1)
  let details = usage.substring(colonIndex + 1)

  return renderWithSpan(subTitle, "particleOneWordUse")
  + renderWithSpan(details, "particleOneWordUseExplanation") + "<br/>"
}

function getWordTitle(particleData, wordId) {
  let wordTitle = getMainWord(wordId)
  if (particleData.variations.length > 0) {
    for (let otherWord of particleData.variations) {
      wordTitle += ", "
      wordTitle += otherWord
    }
  }
  return wordTitle
}

function getMainWord(wordId) {
  return wordId.split("|")[0]
}

function renderWithSpan(text, spanClass) {
  return `<span class="${spanClass}">${text}</span>`
}

function renderWithSpanOnClick(text, spanClass, code) {
  return `<span class="${spanClass}" onclick="${code}">${text}</span>`
}

function renderWithSpanOnClickTooltip(text, tooltipText, spanClass) {
    return `<span class="tooltip spanClass">${text}<span>${tooltipText}</span></span>`
}

function renderWithSpanOnClickParticle(text, particleId, spanClass) {
  return renderWithSpanOnClick(text, spanClass, `renderEvent('${particleId}')`)
}

function renderMapu(mapuche, grammar) {
  let html = '<img src="img/mapuche_flag.svg" width="20px" height="20px" alt="">'

  let exampleParts = parseExample(mapuche, grammar)
  html += " "

  for (let examplePart of exampleParts) {
    if (examplePart.includes("*")) {
      let wordParts = examplePart.split("*")
      html += renderWithSpanOnClickTooltip(wordParts[0], wordParts[1], "normalWordExample")
    } else if (examplePart.includes("|")) {
      let wordParts = examplePart.split("|")

      html += renderWithSpanOnClickParticle(wordParts[0], examplePart, generateColorClassFromString(wordParts[1]))
    } else if (examplePart === " ") {
      html += " "
    }
  }

  return html
}

function renderWinka(word) {
  let html = '<img src="img/spain_flag.svg" width="20px" height="20px" alt="">'
  html += " "
  html += renderWithSpan(word, "winkaExample")
  return html
}

function generateColorClassFromString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i)
  }

  let colorIndex = hash % 3
  return `particleExample${colorIndex}`
}

