import {parseExample} from "./backend/parser.js";
import {buildAliasMap} from "./backend/parser.js";
import {searchAdditionalExamples} from "./backend/parser.js";
import {applyFix, searchWord} from "./backend/search.js";

init()

/**
 * Carga applicacion
 */
function init() {
  uiFunctionMappings()

  // Ejemplos en winkaDungun desactivados
  window.winkaDungunExamples = false
  // Mantiene una copia de historial
  window.hist = []

  // Apagar botones de busqueda y ejemplos en winkaDungun
  toggleWinkaExamplesEvent(false)
  searchEvent(false)
  handleTooltips();

  // Configurar busqueda
  let searchForm = document.getElementById("searchForm")
  searchForm.addEventListener("submit", function(evt) {
    // Ocultar teclado al enviar
    evt.preventDefault();
    document.activeElement.blur()

    // Si se apreta el boton de enviar busqueda, elegir el primer resultado
    if (searchForm.firstResult !== "") {
      loadViewEvent(searchForm.firstResult)
    }
  }, true);

  // Configurar Web vs Mobile Android APK
  window.addEventListener('load', function () {

    // Si el navegador es WebView, entonces estamos en la app mobile
    const isWebView = navigator.userAgent.includes('wv')

    if (isWebView) {
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
  window.addEventListener('popstate', function(event) {

    if (window.hist.length > 0) {
      window.hist.pop()
    }

    // State contiene la particula en el top del stack
    if (event.state) {
      // Cargar particula antrior
      renderFromParticleData(window.particleData[event.state], event.state)
    } else {
      // Si volvemos al principio y no hay palabra inicial, mostrar ayuda
      renderHelp(true)
    }
    // Recargar botones de estado
    refreshBackButtonState()
  });
}

/**
 * Funciones de UI
 */
function uiFunctionMappings() {
  window.renderParticleContent = renderParticleContent
  window.search = search
  window.renderHelp = renderHelp
  window.updateExamples = updateExamples
}

/**
 * Muestra ayuda
 *
 * @param visible Si es que hay que mostrar ayuda
 */
function renderHelp(visible)
{
  document.getElementById("topWidgetHelp").hidden = !visible
  document.getElementById("topWidgetResting").hidden = visible
  document.getElementById("contentWidget").hidden = visible
  document.getElementById("helpWidget").hidden = !visible

  document.getElementById("infoBackIconEnabled").hidden = window.history.state === null
}

/**
 * Inicializa vista con datos
 * @param data
 */
export function initView(data) {
  window.particleData = data
  window.aliasMap = buildAliasMap(data)
  document.getElementById("mainDiv").hidden = false

  // Carga contenido
  renderParticleContent(null)
  //renderParticleContent("la|neg10")
}

/**
 * Activa tooltips para mostrar palabras en wingkadungun
 */
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

/**
 * Funcion principal para mostrar contenido
 * @param particleId
 */
export function renderParticleContent(particleId) {
  let uniqueParticleId = window.aliasMap.get(particleId)

  // Si particula es null mostrar ayuda
  if (particleId == null) {
    renderHelp(true)
    return
  }
  // Primera vez
  if (window.history.state == null) {
    window.history.pushState(uniqueParticleId, "")
    window.hist.push(uniqueParticleId)
  }

  if (window.history.state != null) {
    let lastPart = window.history.state
    let lastPartUniqueId = window.aliasMap.get(lastPart)

    // Misma palabra, solo agregarla al historial si diferente
    if (lastPartUniqueId !== uniqueParticleId) {
      window.history.pushState(uniqueParticleId, "")
      window.hist.push(uniqueParticleId)
    }
  }
  refreshBackButtonState()
  renderFromParticleData(window.particleData[uniqueParticleId], uniqueParticleId)
}

export function refreshBackButtonState() {
  document.getElementById("navigationBackIconEnabled").hidden = (window.hist.length === 1)
  document.getElementById("navigationBackIconDisabled").hidden = (window.hist.length !== 1)
}

/**
 * Busca particulas
 * @param partialWord
 * @returns {[]} Una lista de palabras
 */
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
  particleContent.innerHTML = ""
  if (particleData.explanation !== undefined) {
    particleContent.innerHTML = "<p class='particleContent'>" + particleData.explanation + "</p>"
  }
  relativeExampleList.innerHTML = ""

  for (let content of particleData.content) {
    if (content.subtitle !== undefined) {
      particleContent.innerHTML += "<p class='particleSubTitle'>" + content.subtitle + "</p>"
    }
    if (content.explanation !== undefined) {
      particleContent.innerHTML += "<p class='particleContent'>" + content.explanation + "</p>"
    }

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
  html += "<div class='sep'/>"
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
