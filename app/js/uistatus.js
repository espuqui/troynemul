export const Views = {
  HELP: 'help',
  SEARCH: 'search',
  CONTENT: 'content',
};

export class UIStatus {

  constructor(updateUI) {

    // Estado inicial botones
    this.winkaDungunExamples = false;
    this.underscore = true;
    this.currentView = Views.SEARCH
    this.currentWord = null

    // Copia de historial
    this.hist = []
    this.updateUI = updateUI
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

  toggleUnderscore(forceUpdate = false) {
    this.underscore = !this.underscore;
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

  updateUI() {
    this.updateUI()
  }
}
