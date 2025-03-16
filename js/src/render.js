import {parseExample} from "./backend/parser.js";
import {buildAliasMap} from "./backend/parser.js";
import {searchAdditionalExamples} from "./backend/parser.js";
import {applyFix, searchWord} from "./backend/search.js";

preLoad()
function preLoad() {

  window.render = render
  window.search = search
  window.back = backHist
  window.winkaDungunExamples = false
  window.updateExamples = updateWinkaDungunExamples
  window.hist = []

  setWinkaDungunExamples(false)
  switchSearch(false)

  window.addEventListener('load', function () {
    fetch("./data/particles.json")
      .then((res) => res.json())
      .then((data) => {
        init(data)
      })
  })
}

export function init(data) {
  handleTooltips();
  window.particleData = data
  window.aliasMap = buildAliasMap(data)

  document.getElementById("mainDiv").hidden = false
  render("le|st28")
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

  // Prevenir recargar la misma palabra
  if (window.hist.length !== 0) {
    let lastPart = window.hist.at(window.hist.length-1)
    let lastPartUniqueId = window.aliasMap.get(lastPart)

    if (lastPartUniqueId === uniqueParticleId) {
      return
    }
  }

  forwardHist(uniqueParticleId)
  renderFromParticleData(window.particleData[uniqueParticleId], uniqueParticleId)
}

function forwardHist(uniqueParticleId) {
  updateForwardHist()
  window.hist.push(uniqueParticleId)
}

export function backHist() {
  if (window.hist.length !== 0) {
    window.hist.pop()
  }

  if (window.hist.length !== 0) {
    render(window.hist.pop())
  }
}
export function updateForwardHist() {
  document.getElementById("navigationBackIconEnabled").hidden = (window.hist.length === 0)
  document.getElementById("navigationBackIconDisabled").hidden = (window.hist.length !== 0)
}

export function search(partialWord) {
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
    }
  }

  let relativeExamples = searchAdditionalExamples(particleId, window.particleData, window.aliasMap)

  for (let examples of relativeExamples) {
    relativeExampleList.innerHTML += renderMapu(examples[0], particleId) + "<br/>" + renderWinka(examples[1])
  }
  updateWinkaDungunExamples()
}

function renderParticleTitle(particleTitle, particleData, particleId) {
  particleTitle.innerText = getWordTitle(particleData, particleId)
  particleTitle.style = `text-decoration: ${particleData.color} underline;
  text-decoration-thickness: 3px; text-underline-offset: 5px;  text-decoration-skip-ink: none;"`
}
function getWordTitle(particleData, wordId) {
  let wordTitle = applyFix(getMainWord(wordId), particleData.fix)
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
  let html = '<img src="../../img/mapuche_flag.svg" width="10px" height="10px" alt="">'

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
  let html = '<span class="winkaExampleSpan"><img src="../../img/spain_flag.svg" width="10px" height="10px" alt="">'
  html += " "
  html += renderWithSpan(word, "winkaExample")
  html += "<br /><br />"
  html += "</span>"
  return html
}

export function updateWinkaDungunExamples() {
  let enabled = window.winkaDungunExamples

  const elements = document.querySelectorAll(`.winkaExampleSpan`);
  elements.forEach(element => {
    element.hidden = !enabled
  });
}
