import {parseExample} from "./js/src/parser.js";
import {buildAliasMap} from "./js/src/parser.js";
import {searchAdditionalExamples} from "./js/src/parser.js";
import {applyFix, renderWordWithFixVariations, searchWord} from "./js/src/search.js";

export function init(data) {
  handleTooltips();
  window.myvar = "AA"
  window.particleData = data
  window.aliasMap = buildAliasMap(data)
  render("mew|inst")
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
  let uniqueParticleId = window.aliasMap.get(particleId)
  renderFromParticleData(window.particleData[uniqueParticleId], uniqueParticleId)
}

export function search(partialWord) {
  console.log(partialWord)
  return searchWord(partialWord, window.particleData, window.aliasMap)
}

function renderFromParticleData(particleData, particleId) {

  const particleTitle = document.getElementById("particleTitle")
  const particleTypeTitle = document.getElementById("particleTypeTitle")
  const particleContent = document.getElementById("particleContent")
  const relativeExampleList = document.getElementById("relativeExampleList")

  renderParticleTitle(particleTitle, particleData, particleId)

  particleTypeTitle.innerText = particleData.title
  particleContent.innerText = ""
  relativeExampleList.innerHTML = ""

  for (let content of particleData.content) {
    particleContent.innerHTML += "<p class='particleContent'>" + content.explanation + "</p>"

    for (let examples of content.examples) {
      let exampleParts = parseExample(examples[0], examples[1])
      particleContent.innerHTML += renderMapu(exampleParts, particleId) + "<br/>" + renderWinka(examples[2])
        + "<br /><br />"
    }
  }

  let relativeExamples = searchAdditionalExamples(particleId, window.particleData, window.aliasMap)

  for (let examples of relativeExamples) {
    relativeExampleList.innerHTML += renderMapu(examples[0], particleId) + "<br/>" + renderWinka(examples[1])
      + "<br /><br />"
  }
}

function renderParticleTitle(particleTitle, particleData, particleId) {
  particleTitle.innerText = getWordTitle(particleData, particleId)
  particleTitle.style = `text-decoration: ${particleData.color} underline;
  text-decoration-thickness: 3px; text-underline-offset: 5px;  text-decoration-skip-ink: none;"`
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
      wordTitle += applyFix(otherWord, particleData.fix)
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

function renderWithSpanOnClick(text, spanClass, code, styleDef) {
  return `<span class="${spanClass}" style="${styleDef}" onclick="${code}">${text}</span>`
}

function renderWithSpanOnClickTooltip(text, tooltipText, spanClass) {
    return `<span class="tooltip ${spanClass}">${text}<span>${tooltipText}</span></span>`
}

function renderWithSpanOnClickParticle(text, particleId, spanClass, color) {
  return renderWithSpanOnClick(text, spanClass, `renderEvent('${particleId}')`,
                               `text-decoration: ${color} underline;
                               text-decoration-thickness: 3px;
                               text-underline-offset: 4px;
                               text-decoration-skip-ink: none;`)
}

function renderMapu(exampleParts, particleId) {
  let html = '<img src="img/mapuche_flag.svg" width="10px" height="10px" alt="">'

  html += " "

  for (let examplePart of exampleParts) {
    if (examplePart.includes("*")) {
      let wordParts = examplePart.split("*")
      html += renderWithSpanOnClickTooltip(wordParts[0], wordParts[1], "normalWordExample")
    } else if (examplePart.includes("|")) {
      let wordParts = examplePart.split("|")
      let currentWord = window.aliasMap.get(examplePart)
      if (currentWord === undefined) {
        html += renderWithSpanOnClickParticle(wordParts[0], examplePart, "particleExample", "gray")
      } else {
        let color = window.particleData[currentWord].color
        if (window.aliasMap.get(examplePart) === particleId) {
          html += renderWithSpanOnClickParticle(wordParts[0], examplePart, "particleExample particleCurrent", color)
        } else {
          html += renderWithSpanOnClickParticle(wordParts[0], examplePart, "particleExample", color)
        }
      }
    } else if (examplePart === " ") {
      html += " "
    }
  }

  return html
}

function renderWinka(word) {
  let html = '<img src="img/spain_flag.svg" width="10px" height="10px" alt="">'
  html += " "
  html += renderWithSpan(word, "winkaExample")
  return html
}

