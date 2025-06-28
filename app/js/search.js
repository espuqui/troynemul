import {applyFix, searchWord} from "./backend/search.js";

/**
 * Busca particulas
 * @param partialWord
 * @returns {[]} Una lista de palabras
 */
export function search(partialWord) {
  return searchWord(partialWord, window.particleData, window.aliasMap)
}

export function loadSearchEvent() {

  let searchBox = document.getElementById("searchWordInput")
  let result = window.search(window.uistatus.convertTextReverse(searchBox.value))
  let searchForm = document.getElementById("searchForm")
  let renderedResult = ""
  searchForm.firstResult = ""

  for (let r of result) {
    if (searchForm.firstResult === "" && searchBox.value !== "") {
      searchForm.firstResult = r.particleId
    }
    let style = `text-decoration: ${r.color} underline;
  text-decoration-thickness: 3px; text-underline-offset: 5px;  text-decoration-skip-ink: none;"`

    let summary = c(r.summary)
    let variations = c(r.variations)
    let title = t(r.title)
    renderedResult += `<div class="searchResultsRow" onclick="window.renderParticleContent('${r.particleId}')">
      <div class="searchResultsCell">
      <p>
          <span style="${style}">${summary}</span>
          <span class="searchVariations">${variations}</span>
          <span class="searchTitle">${title}</span>
      </p>
      </div>
    </div>`
  }

  document.getElementById("searchResultsWidget").innerHTML = renderedResult
}

function c(text) {
  return window.uistatus.convertText(text)
}

function t(text) {
  return window.uistatus.convertPhrase(text)
}
