import {buildAliasMap, parseExample, searchAdditionalExamples} from "./backend/parser.js";
import {applyFix} from "./backend/search.js";
import {search, loadSearchEvent} from "./search.js";
import {UIStatus, Views} from "./uistatus.js";
import {updateUI} from "./updateui.js";

const startWord = null


/**
 * Funciones de UI
 */
function uiFunctionMappings() {
  window.renderParticleContent = renderParticleContent
  window.search = search
  window.updateExamples = updateExamples
  window.loadSearchEvent = loadSearchEvent
  window.openURL = openURL;
}

init()

function isAndroid() {
  return navigator.userAgent.includes('wv')
}

function openURL(url) {
  if (isAndroid()) {
    Android.openURL(url)
  } else {
    window.open(url)
  }
}

function init() {
  uiFunctionMappings()
  window.uistatus = new UIStatus(updateUI)
  handleTooltips();

  // Configurar busqueda
  let searchForm = document.getElementById("searchForm")
  searchForm.addEventListener("submit", function (evt) {
    // Ocultar teclado al enviar
    evt.preventDefault();
    document.activeElement.blur()

    // Si se apreta el boton de enviar busqueda, elegir el primer resultado
    if (searchForm.firstResult !== "") {
      renderParticleContent(searchForm.firstResult)
    }
  }, true);

  // Configurar Web vs Mobile Android APK
  window.addEventListener('load', function () {

    // Si el navegador es WebView, entonces estamos en la app mobile

    if (isAndroid()) {
      // Mobile app: Hay que cargar el JSON con import, sino no funciona
      let head = document.getElementsByTagName('head')[0];
      let js = document.createElement("script");

      // Cargamos el JSON dinamicamente
      js.type = "text/javascript";
      js.src = "js/loadfromapk.js";
      head.appendChild(js);
      window.initView = initView
    } else {
      // Web Mobile: Cargar JSON con Fetch
      fetch("./data/particles.json")
        .then((res) => res.json())
        .then((data) => {
          initView(data)
        }).catch((error) => {
        alert(error)
      });
    }
  })

  // Configurar ir atras en el historial
  window.addEventListener('popstate', function (event) {


    if (window.uistatus.currentView !== Views.SEARCH) {
      // State contiene la particula en el top del stack
      window.uistatus.popHistory()
    }

    if (window.uistatus.currentView === Views.SEARCH ||
      window.uistatus.currentView === Views.HELP ||
      window.uistatus.currentView === Views.FEEDBACK) {
      window.uistatus.toggleContent(true, true)
      return
    }

    if (window.uistatus.currentWord === null) {
      window.uistatus.searchEvent()
    } else {
      renderFromParticleData(window.particleData[window.uistatus.currentWord], window.uistatus.currentWord)
    }

    updateUI()
  });
}

/**
 * Inicializa vista con datos
 * @param data
 */
export function initView(data) {
  window.particleData = data
  window.aliasMap = buildAliasMap(data)
  window.uistatus.setDataStats(data)
  document.getElementById("mainDiv").hidden = false

  // Carga contenido
  renderParticleContent(startWord)
}

/**
 * Activa tooltips para mostrar palabras en wingkadungun
 */
function handleTooltips() {
  document.addEventListener('click', function (event) {
    let elements = document.getElementsByClassName("tooltip")
    for (let elem of elements) {
      if (elem === event.target) {
        let tooltipDiv = elem.children[0]
        tooltipDiv.style.visibility = 'visible'
        tooltipDiv.style.left = "-10px"

        let wordHalfWidth = Math.round(tooltipDiv.parentNode.getBoundingClientRect().width / 2)
        let toolTipHalfWidth = Math.round(tooltipDiv.getBoundingClientRect().width / 2)

        let centerWidth = -toolTipHalfWidth + wordHalfWidth
        tooltipDiv.style.left = centerWidth + "px"

      } else {
        elem.children[0].style.visibility = 'hidden'
      }
    }

    if (event.target.className === "threeDotIcon" ||
      (event.target.parentNode !== null && event.target.parentNode.className === "threeDotIcon")) {
      document.getElementById("threeDots").hidden = document.getElementById("threeDots").hidden === false;
    } else {
      document.getElementById("threeDots").hidden = true
    }
  });
}

/**
 * Funcion principal para mostrar contenido
 * @param particleId
 */
export function renderParticleContent(particleId) {
  let uniqueParticleId = window.aliasMap.get(particleId)

  // Si particula es null mostrar busqueda
  if (particleId == null) {
    window.uistatus.searchEvent()
    window.uistatus.updateUI()
    return
  }

  window.uistatus.toggleContent(true)

  // Misma palabra, solo agregarla al historial si diferente
  if (window.uistatus.currentWord !== uniqueParticleId) {
    window.uistatus.pushHistory(uniqueParticleId)
  }

  renderFromParticleData(window.particleData[uniqueParticleId], uniqueParticleId)
  window.uistatus.updateUI()
}

function c(text) {
  return window.uistatus.convertText(text)
}

function h(text) {
  return text.replace(/\[([^\]]+)\]/g, (match, content) => {
    let parts = match.slice(1, -1).split("|")
    if (parts.length === 0) {
      return ""
    }

    if (parts.length === 1) {
      return "<i>" + c(parts[0]) + "</i>"
    }


    let output = parseExample(parts[0], parts[1])
    let wingkadungun = ""

    if (parts.length > 2) {
      wingkadungun += " <span class='winkaExample'>(" + parts[2] + ")</span>"
    }

    return renderMapuInline(output, window.uistatus.currentWord) + wingkadungun
  });
}


function t(text) {
  return window.uistatus.convertPhrase(text)
}

function renderFromParticleData(particleData, particleId) {

  const particleTitle = document.getElementById("particleTitle")
  const particleTypeTitle = document.getElementById("particleTypeTitle")
  const particleContent = document.getElementById("particleContent")
  const relativeExampleList = document.getElementById("relativeExampleList")

  renderParticleTitle(particleTitle, particleData, particleId)

  particleTypeTitle.innerText = t(particleData.title)
  particleContent.innerHTML = ""
  if (particleData.explanation !== undefined) {
    particleContent.innerHTML = "<p class='particleContent'>" + t(h(particleData.explanation)) + "</p>"
  }
  relativeExampleList.innerHTML = ""

  for (let content of particleData.content) {
    if (content.subtitle !== undefined) {
      particleContent.innerHTML += "<p class='particleSubTitle'>" + t(content.subtitle) + "</p>"
    }
    if (content.explanation !== undefined) {
      particleContent.innerHTML += "<p class='particleContent'>" + t(h(content.explanation)) + "</p>"
    }

    for (let examples of content.examples) {
      let exampleParts = parseExample(examples[0], examples[1])
      particleContent.innerHTML += renderMapuWithFlag(exampleParts, particleId) + "<br/>" + renderWinka(examples[2])
    }
  }

  if (particleData.related !== undefined) {
    particleContent.innerHTML += "<p class='particleRelatedTitle'>Partículas similares </p>"
    for (let i in particleData.related) {
      if (i !== "0") {
        particleContent.innerHTML += ", "
      }
      particleContent.innerHTML += renderParticle(particleData.related[i], "")
    }
    particleContent.innerHTML += "<br /><br />"

  }

  let relativeExamples = searchAdditionalExamples(particleId, window.particleData, window.aliasMap)

  const relatedExamplesTitle = document.getElementById("relatedExamplesTitle")
  if (relativeExamples.length === 0) {
    relatedExamplesTitle.hidden = true
  } else {
    relatedExamplesTitle.hidden = false
    for (let examples of relativeExamples) {
      relativeExampleList.innerHTML += renderMapuWithFlag(examples[0], particleId) + "<br/>" + renderWinka(examples[1])
    }
  }
  updateExamples()
}

function renderParticleTitle(particleTitle, particleData, particleId) {
  particleTitle.innerText = c(getWordTitle(particleData, particleId))
  particleTitle.style = `text-decoration: ${particleData.color} underline;
  text-decoration-thickness: 3px; text-underline-offset: 5px;  text-decoration-skip-ink: none;"`
}

function getWordTitle(particleData, wordId) {
  let wordTitle = applyFix(getMainWord(wordId), particleData.fix)
  if (particleData.variations !== undefined && particleData.variations.length > 0) {
    for (let otherWord of particleData.variations) {
      if (otherWord.startsWith('*')) {
        continue
      }
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
  return renderWithSpanOnClick(text, spanClass, `  window.renderParticleContent('${particleId}')`,
                               `text-decoration: ${color} underline;
                               text-decoration-thickness: 3px;
                               text-underline-offset: 4px;
                               text-decoration-skip-ink: none;`)
}


function renderMapuWithFlag(exampleParts, particleId) {
  let html = '<img src="img/mapuche_flag.svg" width="10px" height="10px" alt=""> '
  return html + renderMapu(exampleParts, particleId)
}

function renderMapuInline(exampleParts, particleId) {
  return "<i style='color: #FFFFFF'>" + renderMapuWithStyle(exampleParts, particleId, "normalWordInline") + "</i>"
}

function renderMapu(exampleParts, particleId) {
  return renderMapuWithStyle(exampleParts, particleId, "normalWordExample")
}
function renderMapuWithStyle(exampleParts, particleId, style) {

  let html = ""

  for (let examplePart of exampleParts) {
    if (examplePart.includes("*")) {
      let wordParts = examplePart.split("*")
      html += renderWithSpanOnClickTooltip(c(wordParts[0]), wordParts[1], style)
    } else if (examplePart.includes("|")) {
      html += renderParticle(examplePart, particleId)
    } else if (examplePart === " ") {
      html += " "
    }
  }

  return html
}

function renderParticle(examplePart, particleId) {
  let html = ""
  let wordParts = examplePart.split("|")
  let examplePartToLookup = examplePart.toLowerCase()
  let currentWord = window.aliasMap.get(examplePartToLookup)
  if (currentWord === undefined) {
    html += renderWithSpanOnClickTooltip(c(wordParts[0]), "Falta: <br/> (" + examplePartToLookup + ")",
                                         "particleMissing particleExample")
  } else {
    let color = window.particleData[currentWord].color
    if (window.aliasMap.get(examplePart) === particleId) {
      html += renderWithSpanOnClickParticle(c(wordParts[0]), examplePartToLookup, "particleExample particleCurrent",
                                            color)
    } else {
      html += renderWithSpanOnClickParticle(c(wordParts[0]), examplePartToLookup, "particleExample", color)
    }
  }
  return html
}

function renderWinka(word) {
  let html = '<span class="winkaExampleSpan"><img src="img/spain_flag.svg" width="10px" height="10px" alt="">'
  html += " "
  html += renderWithSpan(word, "winkaExample")
  html += "<div class='sep'/>"
  html += "</span>"
  return html
}

export function updateExamples() {
  let enabled = window.uistatus.winkaDungunExamples

  const elements = document.querySelectorAll(`.winkaExampleSpan`);
  elements.forEach(element => {
    element.hidden = !enabled
  });
}
