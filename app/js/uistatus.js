import {AlphabetConverter, NoopAlphabetConverter} from "./backend/alphabet_converter.js";
import {sendWordFeedback} from "./backend/send_feedback.js";

const VERSION = '06/22/2025_TEST'
const feedbackMap = new Map();

import {
  MAPUDUNGUN_AZUMCHEFE_PHONETIC_MAP, MAPUDUNGUN_RAGUILEO_PHONETIC_MAP,
  MAPUDUNGUN_UNIFICADO_QUOTES_PHONETIC_MAP,
  MAPUDUNGUN_UNIFICADO_UNDERSCORE_PHONETIC_MAP
} from "./backend/alphabet_definitions.js";

export const Views = {
  HELP: 'help',
  SEARCH: 'search',
  CONTENT: 'content',
  FEEDBACK: 'feedback',
};

export const Grafemarios = {
  AZUMCHEFE: 'az',
  RAGUILEO: 'ra',
  UNIFICADO_QUOTES: 'unq',
  UNIFICADO_UNDERSCORE: 'un_',
};

export class UIStatus {

  constructor(updateUI) {

    // Estado inicial botones
    this.winkaDungunExamples = false;
    this.underscoreEnabled = true;
    this.currentView = Views.FEEDBACK
    this.currentWord = null
    this.currentGrafemario = Grafemarios.UNIFICADO_QUOTES
    this.alphabetConverter = new NoopAlphabetConverter()
    this.alphabetConverterReverse = new NoopAlphabetConverter()
    this.fontsizesmall = true;
    this.userName = ""
    this.userLocation = ""
    this.particlesTotal = 0
    this.examplesTotal = 0

    this.loadStatusFromSession()

    // Copia de historial
    this.hist = []
    this.updateUI = updateUI
  }

  loadStatusFromSession() {
    // Default value
    this.underscoreEnabled = this.loadBooleanOrDefault("underscoreEnabled", true);
    this.currentGrafemario = this.loadStringOrDefault("grafemario", Grafemarios.UNIFICADO_QUOTES);
    this.fontsizesmall = this.loadBooleanOrDefault("fontsizesmall", true);
    this.userName = this.loadStringOrDefault("userName", "");
    this.userLocation = this.loadStringOrDefault("userLocation", "");

    this.refreshGrafemario()
  }

  saveStatusToSession() {
    this.saveBoolean("underscoreEnabled", this.underscoreEnabled)
    this.saveString("grafemario", this.currentGrafemario)
    this.saveString("userName", this.userName)
    this.saveString("userLocation", this.userLocation)
    this.saveBoolean("fontsizesmall", this.fontsizesmall)
  }

  loadBooleanOrDefault(key, defaultValue) {
    let valueString = localStorage.getItem(key)
    if (valueString !== null) {
      return valueString === "true"
    }
    return defaultValue
  }

  loadStringOrDefault(key, defaultValue) {
    let valueString = localStorage.getItem(key)
    if (valueString !== null) {
      return valueString
    }
    return defaultValue
  }

  convertText(text) {
    return this.alphabetConverter.convertText(text)
  }

  convertTextReverse(text) {
    return this.alphabetConverterReverse.convertText(text)
  }

  convertPhrase(text) {
    return text.replace(/\{([^}]+)\}/g, (match, content) => {
      return this.convertText(content);
    });
  }

  saveBoolean(key, value) {
    localStorage.setItem(key, value ? "true" : "false")
  }

  saveString(key, value) {
    localStorage.setItem(key, value)
  }

  popHistory() {
    this.hist.pop()
    if (this.hist.length > 0) {
      this.currentWord = this.hist.at(this.hist.length - 1)
    } else {
      this.currentWord = null
    }
  }

  pushHistory(word) {
    window.history.pushState(word, "")
    this.currentWord = word
    this.hist.push(word)
  }

  hasHistory() {
    return this.hist.length > 1
  }

  hasHistoryForBackInHelpOrSearch() {
    return this.hist.length > 0
  }

  searchEvent(forceUpdate = false) {
    this.currentView = Views.SEARCH
    this.checkIfUpdateUI(forceUpdate)
  }

  toggleWinkaExamplesEvent(value, forceUpdate = false) {
    this.winkaDungunExamples = value
    this.checkIfUpdateUI(forceUpdate)
  }

  toggleRenderHelp(value, forceUpdate = false) {
    this.currentView = Views.HELP
    this.pushHistory(this.currentWord)
    this.checkIfUpdateUI(forceUpdate)
  }

  toggleContent(value, forceUpdate = false) {
    this.currentView = Views.CONTENT
    this.checkIfUpdateUI(forceUpdate)
  }

  toggleFeedback(value, forceUpdate = false) {
    this.currentView = Views.FEEDBACK
    this.pushHistory(this.currentWord)
    this.checkIfUpdateUI(forceUpdate)
  }

  toggleUnderscore(forceUpdate = false) {
    this.underscoreEnabled = !this.underscoreEnabled;
    this.saveStatusToSession()
    this.checkIfUpdateUI(forceUpdate)
  }

  checkIfUpdateUI(forceUpdate) {
    if (forceUpdate) {
      this.updateUI();
    }
  }

  backFromSearch(forceUpdate = false) {
    this.currentView = Views.CONTENT
    this.checkIfUpdateUI(forceUpdate)
  }

  backFromInfo(forceUpdate = false) {
    this.currentView = Views.CONTENT
    this.popHistory()
    this.checkIfUpdateUI(forceUpdate)
  }

  reloadContent() {
    window.renderParticleContent(this.currentWord)
  }

  refreshGrafemario() {
    if (this.currentGrafemario === Grafemarios.UNIFICADO_QUOTES) {
      this.alphabetConverter = new NoopAlphabetConverter()
      this.alphabetConverterReverse = new NoopAlphabetConverter()
    }
    if (this.currentGrafemario === Grafemarios.UNIFICADO_UNDERSCORE) {
      this.alphabetConverter = new AlphabetConverter(MAPUDUNGUN_UNIFICADO_QUOTES_PHONETIC_MAP,
                                                     MAPUDUNGUN_UNIFICADO_UNDERSCORE_PHONETIC_MAP)

      this.alphabetConverterReverse = new AlphabetConverter(MAPUDUNGUN_UNIFICADO_UNDERSCORE_PHONETIC_MAP,
                                                           MAPUDUNGUN_UNIFICADO_QUOTES_PHONETIC_MAP)
    }

    if (this.currentGrafemario === Grafemarios.AZUMCHEFE) {
      this.alphabetConverter = new AlphabetConverter(MAPUDUNGUN_UNIFICADO_QUOTES_PHONETIC_MAP,
                                                     MAPUDUNGUN_AZUMCHEFE_PHONETIC_MAP)

      this.alphabetConverterReverse = new AlphabetConverter(MAPUDUNGUN_AZUMCHEFE_PHONETIC_MAP,
                                                            MAPUDUNGUN_UNIFICADO_QUOTES_PHONETIC_MAP)
    }

    if (this.currentGrafemario === Grafemarios.RAGUILEO) {
      this.alphabetConverter = new AlphabetConverter(MAPUDUNGUN_UNIFICADO_QUOTES_PHONETIC_MAP,
                                                     MAPUDUNGUN_RAGUILEO_PHONETIC_MAP)

      this.alphabetConverterReverse = new AlphabetConverter(MAPUDUNGUN_RAGUILEO_PHONETIC_MAP,
                                                            MAPUDUNGUN_UNIFICADO_QUOTES_PHONETIC_MAP)
    }
  }

  updateGrafemarioEvent(grafemario) {
    this.currentGrafemario = grafemario
    this.refreshGrafemario()
    this.saveStatusToSession()
    this.updateUI()
    this.reloadContent()
  }

  toggleUnq() {
    this.updateGrafemarioEvent(Grafemarios.UNIFICADO_QUOTES)
  }

  toggleUn_() {
    this.updateGrafemarioEvent(Grafemarios.UNIFICADO_UNDERSCORE)
  }

  toggleAz() {
    this.updateGrafemarioEvent(Grafemarios.AZUMCHEFE)
  }

  toggleRa() {
    this.updateGrafemarioEvent(Grafemarios.RAGUILEO)
  }

  updateUI() {
    this.updateUI()
  }

  toggleSmallFont(value) {
    this.fontsizesmall = value
    this.saveStatusToSession()
    this.updateUI()
  }

  sendFeedback() {
    document.getElementById("errorSendingFeedbackMessage").hidden = true
    let word = document.getElementById("feedbackWord").value
    let comment = document.getElementById("feedbackComment").value
    let name = document.getElementById("feedbackName").value
    let land = document.getElementById("feedbackLand").value

    if (this.validateForm(word, comment, name, land)) {
      this.userName = name
      this.userLocation = land


      this.saveStatusToSession()

      sendWordFeedback(word, comment, name, land, this.currentGrafemario, VERSION, callbackSendFeedback)
    }
  }

  validateForm(word, comment, name, land) {
    if (!feedbackMap.has(word)) {
      feedbackMap.set(word, 0)
    }

    let wordCount = feedbackMap.get(word)
    wordCount++
    feedbackMap.set(word, wordCount)

    if (wordCount > 10) {
      showError("Ya enviaste muchos comentarios para esta palabra. " +
                  "Abre y cierra la app e intenta de nuevo")
      return false
    }

    if (word.length === 0) {
      showError("Palabra/Partícula no puede estar vacía")
      return false
    }
    if (comment.length <= 10) {
      showError("Comentario muy corto, debe tener al menos 10 letras")
      return false
    }

    if (name.length === 0) {
      showError("Nombre no puede estar vacío")
      return false
    }

    if (land.length === 0) {
      showError("Procedencia no puede estar vacía")
      return false
    }

    return true

  }

  setDataStats(data) {
    this.particlesTotal = 0
    this.examplesTotal = 0

    for (let key in data) {
      this.particlesTotal++
      for (let content of data[key].content) {
        this.examplesTotal += content.examples.length
      }
    }
  }

  getVersion() {
    return VERSION
  }

  getParticlesTotal() {
    return this.particlesTotal
  }

  getExamplesTotal() {
    return this.examplesTotal
  }
}


function callbackSendFeedback(responseCode) {
  if (responseCode === 200) {
    document.getElementById("feedbackSuccessWidget").hidden = false
    document.getElementById("feedbackFormWidget").hidden = true
  } else {
    showError("Error enviando feedback, inténtalo mas tarde")
  }
}

function showError(errorMessage) {
  document.getElementById("errorSendingFeedbackMessage").hidden = false
  document.getElementById("errorSendingFeedbackMessageText").innerText = errorMessage
}
