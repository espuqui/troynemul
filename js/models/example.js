class Example {
  constructor() {
    this.mapucheLine = "";
    this.grammarLine = "";
    this.spanishLine = "";
  }

  setMapucheLine(mapucheLine) {
    this.mapucheLine = mapucheLine
  }

  setGrammarLine(grammarLine) {
    this.grammarLine = grammarLine
  }

  setSpanishLine(spanishLine) {
    this.spanishLine = spanishLine
  }

  getGrammarLine() {
    return this.grammarLine
  }

  getMapucheLine() {
    return this.mapucheLine
  }

  getMapucheWords() {
    return this.mapucheLine.split(/[\-\s]/)
  }

  getGrammarWords() {
    // ,(?![^(]*\))
    return this.grammarLine.split(/[\-\s](?![^(]*\))/)
  }
  getClearMapuche() {
    return this.mapucheLine.replaceAll("-", "")
  }
}
