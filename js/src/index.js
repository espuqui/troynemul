

function back() {
  window.backHist()
}

function switchSearch(visible) {
  document.getElementById("searchWordInput").value = ""
  document.getElementById("searchResultsWidget").hidden = !visible
  document.getElementById("topWidgetSearching").hidden = !visible
  document.getElementById("contentWidget").hidden = visible
  document.getElementById("topWidgetResting").hidden = visible

  if (visible) {
    document.getElementById("searchWordInput").focus()
    updateSearchList()
  }
}

function updateSearchList() {

  let searchBox = document.getElementById("searchWordInput")
  let result = window.search(searchBox.value)
  let renderedResult = ""

  for (let r of result) {
    let style = `text-decoration: ${r.color} underline;
  text-decoration-thickness: 3px; text-underline-offset: 5px;  text-decoration-skip-ink: none;"`

    renderedResult += `<div class="searchResultsRow" onclick="renderEvent('${r.particleId}')">
      <div class="searchResultsCell">
      <p>
          <span style="${style}">${r.summary}</span>
          <span class="searchVariations">${r.variations}</span>
          <span class="searchTitle">${r.title}</span>
      </p>
      </div>
    </div>`
  }

  document.getElementById("searchResultsWidget").innerHTML = renderedResult
}

function renderEvent(particleId) {
  switchSearch(false)
  window.render(particleId)
}

function setWinkaDungunExamples(value) {
  window.winkaDungunExamples = value
  document.getElementById("winkaDungunOff").hidden = value
  document.getElementById("winkaDungunOn").hidden = !value
  window.updateExamples()
}
