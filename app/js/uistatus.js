export const Views = {
  HELP: 'help',
  SEARCH: 'search',
  CONTENT: 'content',
};

export class UIStatus {

  constructor(updateUI) {

    // Estado inicial botones
    this.winkaDungunExamples = false;
    this.currentView = Views.HELP

    // Copia de historial
    this.hist = []
    this.updateUI = updateUI
  }

  popHistory() {
    if (this.hist.length > 0) {
      this.hist.pop()
    }
  }

  pushHistory(word) {
    this.hist.push(word)
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

  checkIfUpdateUI(forceUpdate) {
    if (forceUpdate) {
      this.updateUI();
    }
  }

  backFromSearch(forceUpdate = false) {
    if (window.history.state === null) {
      this.currentView = Views.HELP
    } else {
      this.currentView = Views.CONTENT
    }
    this.checkIfUpdateUI(forceUpdate)
  }

  backFromInfo(forceUpdate = false) {
    if (window.history.state === null) {
      this.currentView = Views.HELP
    } else {
      this.currentView = Views.CONTENT
    }
    this.checkIfUpdateUI(forceUpdate)
  }

  updateUI() {
    this.updateUI()
  }
}
