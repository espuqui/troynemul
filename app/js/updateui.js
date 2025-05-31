/**
 * Carga applicacion
 */
import {Views} from "./uistatus.js";

export function updateUI() {
  let uistatus = window.uistatus

  // Hide all
  document.getElementById("searchWordInput").value = ""
  document.getElementById("searchResultsWidget").hidden = true
  document.getElementById("topWidgetSearching").hidden = true
  document.getElementById("topWidgetHelp").hidden = true
  document.getElementById("topWidgetResting").hidden = true
  document.getElementById("contentWidget").hidden = true
  document.getElementById("helpWidget").hidden = true
  document.getElementById("infoBackIconEnabled").hidden = true
  document.getElementById("searchBackIconEnabled").hidden = true
  document.getElementById("searchBackIconDisabled").hidden = true

  // Update buttons
  document.getElementById("winkaDungunOff").hidden = true
  document.getElementById("winkaDungunOn").hidden = true

  document.getElementById("threeDots").hidden = true

  // Set state
  if (uistatus.currentView === Views.HELP) {
    document.getElementById("topWidgetHelp").hidden = false
    document.getElementById("helpWidget").hidden = false
    document.getElementById("infoBackIconEnabled").hidden = window.history.state === null


  }

  if (uistatus.currentView === Views.SEARCH) {
    document.getElementById("searchWordInput").value = ""
    document.getElementById("searchResultsWidget").hidden = false
    document.getElementById("topWidgetSearching").hidden = false
    document.getElementById("searchWordInput").focus()
    document.getElementById("searchBackIconEnabled").hidden = (window.uistatus.hist.length !== 1)
    document.getElementById("searchBackIconDisabled").hidden = (window.uistatus.hist.length === 1)

    loadSearchEvent()
  }

  if (uistatus.currentView === Views.CONTENT) {
    document.getElementById("contentWidget").hidden = false
    document.getElementById("topWidgetResting").hidden = false
    document.getElementById("winkaDungunOff").hidden = uistatus.winkaDungunExamples
    document.getElementById("winkaDungunOn").hidden = !uistatus.winkaDungunExamples
    document.getElementById("navigationBackIconEnabled").hidden = (window.uistatus.hist.length === 1)
    document.getElementById("navigationBackIconDisabled").hidden = (window.uistatus.hist.length !== 1)

    window.updateExamples()
  }
}
