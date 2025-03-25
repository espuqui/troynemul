// UI Events

function searchEvent(visible) {
  document.getElementById("searchWordInput").value = ""
  document.getElementById("searchResultsWidget").hidden = !visible
  document.getElementById("topWidgetSearching").hidden = !visible
  document.getElementById("contentWidget").hidden = visible
  document.getElementById("topWidgetResting").hidden = visible

  document.getElementById("topWidgetHelp").hidden = true
  document.getElementById("helpWidget").hidden = true

  if (visible) {
    document.getElementById("searchWordInput").focus()
    loadSearchEvent()
  } else {
    window.renderHelp(window.history.state === null)
  }
}

function loadSearchEvent() {

  let searchBox = document.getElementById("searchWordInput")
  let result = window.search(searchBox.value)
  let searchForm = document.getElementById("searchForm")
  let renderedResult = ""
  searchForm.firstResult = ""

  for (let r of result) {
    if (searchForm.firstResult === "" && searchBox.value !== "") {
      searchForm.firstResult = r.particleId
    }
    let style = `text-decoration: ${r.color} underline;
  text-decoration-thickness: 3px; text-underline-offset: 5px;  text-decoration-skip-ink: none;"`

    renderedResult += `<div class="searchResultsRow" onclick="loadViewEvent('${r.particleId}')">
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

function loadViewEvent(particleId) {
  searchEvent(false)
  window.render(particleId)
}

function toggleWinkaExamplesEvent(value) {
  window.winkaDungunExamples = value
  document.getElementById("winkaDungunOff").hidden = value
  document.getElementById("winkaDungunOn").hidden = !value
  window.updateExamples()
}

function toggleInfoEvent() {
  window.renderHelp(true)
}

function backInfoEvent() {
  window.renderHelp(false)
}
