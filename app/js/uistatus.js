import {AlphabetConverter, NoopAlphabetConverter} from "./backend/alphabet_converter.js";
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
    this.fontsizesmall = false;

    this.loadStatusFromSession()

    // Copia de historial
    this.hist = []
    this.updateUI = updateUI
  }

  loadStatusFromSession() {
    // Default value
    this.underscoreEnabled = this.loadBooleanOrDefault("underscoreEnabled", true);
    this.currentGrafemario = this.loadStringOrDefault("grafemario", Grafemarios.UNIFICADO_QUOTES);
    this.fontsizesmall = this.loadBooleanOrDefault("fontsizesmall", false);
    this.refreshGrafemario()
  }

  saveStatusToSession() {
    this.saveBoolean("underscoreEnabled", this.underscoreEnabled)
    this.saveString("grafemario", this.currentGrafemario)
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
    this.checkIfUpdateUI(forceUpdate)
  }

  toggleContent(value, forceUpdate = false) {
    this.currentView = Views.CONTENT
    this.checkIfUpdateUI(forceUpdate)
  }

  toggleFeedback(value, forceUpdate = false) {
    this.currentView = Views.FEEDBACK
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
    this.checkIfUpdateUI(forceUpdate)
  }

  reloadContent() {
    window.renderParticleContent(this.currentWord)
  }

  refreshGrafemario() {
    if (this.currentGrafemario === Grafemarios.UNIFICADO_QUOTES) {
      this.alphabetConverter = new NoopAlphabetConverter()
    }
    if (this.currentGrafemario === Grafemarios.UNIFICADO_UNDERSCORE) {
      this.alphabetConverter = new AlphabetConverter(MAPUDUNGUN_UNIFICADO_QUOTES_PHONETIC_MAP,
                                                     MAPUDUNGUN_UNIFICADO_UNDERSCORE_PHONETIC_MAP)
    }

    if (this.currentGrafemario === Grafemarios.AZUMCHEFE) {
      this.alphabetConverter = new AlphabetConverter(MAPUDUNGUN_UNIFICADO_QUOTES_PHONETIC_MAP,
                                                     MAPUDUNGUN_AZUMCHEFE_PHONETIC_MAP)
    }

    if (this.currentGrafemario === Grafemarios.RAGUILEO) {
      this.alphabetConverter = new AlphabetConverter(MAPUDUNGUN_UNIFICADO_QUOTES_PHONETIC_MAP,
                                                     MAPUDUNGUN_RAGUILEO_PHONETIC_MAP)
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
}
