/**
 * Carga applicacion
 */
import {Grafemarios, Views} from "./uistatus.js";

let originalHelpText = null

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
  document.getElementById("feedbackWidget").hidden = true
  document.getElementById("infoBackIconEnabled").hidden = true
  document.getElementById("searchBackIconEnabled").hidden = true

  document.getElementById("iconInfoBar").hidden = true
  document.getElementById("textInfoBar").hidden = true
  document.getElementById("iconFeedbackBar").hidden = true
  document.getElementById("textFeedbackBar").hidden = true
  document.getElementById("feedbackSuccessWidget").hidden = true
  document.getElementById("feedbackFormWidget").hidden = true

  document.getElementById("errorSendingFeedbackMessage").hidden = true

  document.getElementById("underscoreOn").hidden = !uistatus.underscoreEnabled
  document.getElementById("underscoreOff").hidden = uistatus.underscoreEnabled

  if (!uistatus.underscoreEnabled) {
    const elements = document.getElementsByClassName("particleExample");

    for (let elem of elements) {
      elem.style.textDecorationLine = "none"
    }
  } else {
    const elements = document.getElementsByClassName("particleExample");

    for (let elem of elements) {
      elem.style.textDecorationLine = "underline"
    }
  }

  // Update buttons
  document.getElementById("winkaDungunOff").hidden = true
  document.getElementById("winkaDungunOn").hidden = true

  document.getElementById("threeDots").hidden = true

  // Set state
  if (uistatus.currentView === Views.HELP) {
    document.getElementById("topWidgetHelp").hidden = false
    document.getElementById("helpWidget").hidden = false
    document.getElementById("infoBackIconEnabled").hidden = !uistatus.hasHistoryForBackInHelpOrSearch()

    document.getElementById("iconInfoBar").hidden = false
    document.getElementById("textInfoBar").hidden = false

    let helpWidgetElement = document.getElementById("helpWidget")
    if (originalHelpText === null) {
      originalHelpText = helpWidgetElement.innerHTML
    }

    helpWidgetElement.innerHTML = uistatus.convertPhrase(originalHelpText)
  }

  if (uistatus.currentView === Views.SEARCH) {
    document.getElementById("searchWordInput").value = ""
    document.getElementById("searchResultsWidget").hidden = false
    document.getElementById("topWidgetSearching").hidden = false
    document.getElementById("searchWordInput").focus()
    document.getElementById("searchBackIconEnabled").hidden = !uistatus.hasHistoryForBackInHelpOrSearch()

    loadSearchEvent()
  }

  if (uistatus.currentView === Views.CONTENT) {
    document.getElementById("contentWidget").hidden = false
    document.getElementById("topWidgetResting").hidden = false
    document.getElementById("winkaDungunOff").hidden = uistatus.winkaDungunExamples
    document.getElementById("winkaDungunOn").hidden = !uistatus.winkaDungunExamples
    document.getElementById("navigationBackIconEnabled").hidden =  !uistatus.hasHistory()
    document.getElementById("navigationBackIconDisabled").hidden =  uistatus.hasHistory()

    window.updateExamples()
    document.getElementById("mainDiv").scrollTop = 0
  }

  if (uistatus.currentView === Views.FEEDBACK) {
    document.getElementById("iconFeedbackBar").hidden = false
    document.getElementById("textFeedbackBar").hidden = false
    document.getElementById("feedbackFormWidget").hidden = false
    document.getElementById("feedbackWidget").hidden = false
    document.getElementById("topWidgetHelp").hidden = false
    document.getElementById("infoBackIconEnabled").hidden = !uistatus.hasHistoryForBackInHelpOrSearch()

    document.getElementById("feedbackComment").value = ""
    document.getElementById("feedbackName").defaultValue = uistatus.userName
    document.getElementById("feedbackLand").defaultValue = uistatus.userLocation

    let feedbackWord = document.getElementById("feedbackWord")
    feedbackWord.defaultValue = uistatus.currentWord == null ? "" : uistatus.convertText(
      uistatus.currentWord.split("|")[0])
  }

  document.getElementById("pichi_fontsize_on").hidden = !uistatus.fontsizesmall
  document.getElementById("pichi_fontsize_off").hidden =  uistatus.fontsizesmall
  document.getElementById("futra_fontsize_on").hidden =  uistatus.fontsizesmall
  document.getElementById("futra_fontsize_off").hidden =  !uistatus.fontsizesmall

  let mainbody = document.getElementById("mainDiv")
  if (uistatus.fontsizesmall) {
    mainbody.style.fontSize = "100%"
  } else {
    mainbody.style.fontSize = "120%"
  }

  document.getElementById("grafemario_unq").hidden = uistatus.currentGrafemario !== Grafemarios.UNIFICADO_QUOTES
  document.getElementById("grafemario_unq_off").hidden = uistatus.currentGrafemario === Grafemarios.UNIFICADO_QUOTES
  document.getElementById("grafemario_un_").hidden = uistatus.currentGrafemario !== Grafemarios.UNIFICADO_UNDERSCORE
  document.getElementById("grafemario_un__off").hidden = uistatus.currentGrafemario === Grafemarios.UNIFICADO_UNDERSCORE
  document.getElementById("grafemario_az").hidden = uistatus.currentGrafemario !== Grafemarios.AZUMCHEFE
  document.getElementById("grafemario_az_off").hidden = uistatus.currentGrafemario === Grafemarios.AZUMCHEFE
  document.getElementById("grafemario_ra").hidden = uistatus.currentGrafemario !== Grafemarios.RAGUILEO
  document.getElementById("grafemario_ra_off").hidden = uistatus.currentGrafemario === Grafemarios.RAGUILEO


}
