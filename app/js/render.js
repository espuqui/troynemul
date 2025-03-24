import {parseExample} from "./backend/parser.js";
import {buildAliasMap} from "./backend/parser.js";
import {searchAdditionalExamples} from "./backend/parser.js";
import {applyFix, searchWord} from "./backend/search.js";

loadView()

function functionMappings() {
  window.render = render
  window.search = search
  window.renderHelp = renderHelp
  window.updateExamples = updateExamples
}
function loadView() {
  functionMappings()

  window.winkaDungunExamples = false

  toggleWinkaExamplesEvent(false)
  searchEvent(false)

  let dummySearch = document.getElementById("dummySearchForm")
  dummySearch.addEventListener("submit", function(evt) {
    evt.preventDefault();
    document.activeElement.blur()
    if (dummySearch.firstResult !== "") {
      loadViewEvent(dummySearch.firstResult)
    }
  }, true);

  window.addEventListener('load', function () {
    // Mobile app
    const isWebView = navigator.userAgent.includes('wv')
    if (isWebView) {
      let head = document.getElementsByTagName('head')[0];
      let js = document.createElement("script");

      js.type = "text/javascript";
      js.src = "js/loadfromapk.js";
      head.appendChild(js);
      window.afterParseData = afterParseData
    } else {
      // For web
      fetch("./data/particles.json")
        .then((res) => res.json())
        .then((data) => {
          afterParseData(data)
        }).catch((error) => {
        alert(error)
      });
    }
  })

  window.addEventListener('popstate', function(event) {
    updateForwardHistButtons()
    console.log(event.state)
    // Handle the state change
    if (event.state) {
      // Access the state object using event.state
      // Update the UI based on the new state
      renderFromParticleData(window.particleData[event.state], event.state)
    } else {
      // Handle the case where there is no state (e.g., initial page load)
      renderHelp(true)
    }
  });
}

function renderHelp(visible)
{
  document.getElementById("topWidgetHelp").hidden = !visible
  document.getElementById("topWidgetResting").hidden = visible
  document.getElementById("contentWidget").hidden = visible
  document.getElementById("helpWidget").hidden = !visible
}

export function afterParseData(data) {
  handleTooltips();
  window.particleData = data
  window.aliasMap = buildAliasMap(data)

  document.getElementById("mainDiv").hidden = false
  render(null)
}

function handleTooltips() {
  document.addEventListener('click', function (event) {
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
  updateForwardHistButtons()

  if (particleId == null) {
    renderHelp(true)
    return
  }
  // Primera vez
  if (window.history.state == null) {
    window.history.pushState(uniqueParticleId, "")
  }

  if (window.history.state != null) {
    let lastPart = window.history.state
    let lastPartUniqueId = window.aliasMap.get(lastPart)

    // Misma palabra, solo agregarla al historial si diferente
    if (lastPartUniqueId !== uniqueParticleId) {
      window.history.pushState(uniqueParticleId, "")
    }
  }
  updateForwardHistButtons()
  renderFromParticleData(window.particleData[uniqueParticleId], uniqueParticleId)
}

export function updateForwardHistButtons() {
  document.getElementById("navigationBackIconEnabled").hidden = (window.history.state === null)
  document.getElementById("navigationBackIconDisabled").hidden = (window.history.state !== null)
}

export function search(partialWord) {
  return searchWord(partialWord, window.particleData, window.aliasMap)
}

function renderFromParticleData(particleData, particleId) {
  renderHelp(false)
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
  updateExamples()
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
  return renderWithSpanOnClick(text, spanClass, `loadViewEvent('${particleId}')`,
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
        html += renderWithSpanOnClickTooltip(wordParts[0], "Falta: <br/> (" + examplePart + ")",
                                             "particleMissing particleExample")
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
  let html = '<span class="winkaExampleSpan"><img src="img/spain_flag.svg" width="10px" height="10px" alt="">'
  html += " "
  html += renderWithSpan(word, "winkaExample")
  html += "<br /><br />"
  html += "</span>"
  return html
}

export function updateExamples() {
  let enabled = window.winkaDungunExamples

  const elements = document.querySelectorAll(`.winkaExampleSpan`);
  elements.forEach(element => {
    element.hidden = !enabled
  });
}
