import particles from "./js/data/nouns.json" assert { type: "json" };
window.addEventListener('load', function () {
  render("inst|mew")
  handleTooltips()
});

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


function render(wordId) {

  const particleTitle = document.getElementById("particleTitle")
  const particleTypeTitle = document.getElementById("particleTypeTitle")
  const particleExplanation = document.getElementById("particleExplanation")
  const particleUsesBox = document.getElementById("particleUsesBox")
  const exampleList = document.getElementById("exampleList")

  particleTitle.innerText = getWordTitle(wordId)
  particleTypeTitle.innerText = particles[wordId].title
  particleExplanation.innerText = particles[wordId].explanation
  particleUsesBox.innerHTML = ""

  for (let usage of particles[wordId].usages) {
    particleUsesBox.innerHTML += renderUsage(usage)
  }

  exampleList.innerHTML = renderMapu() + "<br/>" + renderWinka("lo amenacé con un cuchillo") + "<br /><br />"
  exampleList.innerHTML += renderMapu() + "<br/>" + renderWinka("lo amenacé con un cuchillo")
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

function getWordTitle(wordId) {
  let wordTitle = getMainWord(wordId)
  if (particles[wordId].variations.length > 0) {
    for (let otherWord of particles[wordId].variations) {
      wordTitle += ", "
      wordTitle += otherWord
    }
  }
  return wordTitle
}

function getMainWord(wordId) {
  return wordId.split("|")[1]
}

function renderWithSpan(text, spanClass) {
  return `<span class="${spanClass}">${text}</span>`
}

function renderWithSpanOnClickAlert(text, spanClass) {
  return renderWithSpanOnClick(text, spanClass, "alert('" + text + "')")
}

function renderWithSpanOnClick(text, spanClass, code) {
  return `<span class="${spanClass}" onclick="${code}">${text}</span>`
}

function renderWithSpanOnClickTooltip(text, tooltipText, spanClass) {
    return `<span class="tooltip spanClass">${text}<span>${tooltipText}</span></span>`
}

function renderMapu() {
  let html = '<img src="img/mapuche_flag.svg" width="20px" height="20px" alt="">'
  html += " "
  html += renderWithSpanOnClickTooltip("anel", "amenazar", "normalWordExample")
  html += renderWithSpan("tu", "particleExample1")
  html += renderWithSpan("fiñ", "particleExample2")
  html += " "
  html += renderWithSpanOnClickTooltip("kiñe", "amenazar", "normalWordExample")
  html += " "
  html += renderWithSpanOnClickTooltip("kuchillo", "amenazar", "normalWordExample")
  html += " "
  html += renderWithSpan("mew", "particleExample3 mainParticle")

  return html
}

function renderWinka(word) {
  let html = '<img src="img/spain_flag.svg" width="20px" height="20px" alt="">'
  html += " "
  html += renderWithSpan(word, "winkaExample")
  return html
}

