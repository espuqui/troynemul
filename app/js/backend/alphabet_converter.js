export const MARK_LOWERCASE = 0x600;
export const MARK_UPPERCASE = 0x700;

export class GraphemeEntry {
  constructor(graphemeExpression, index) {
    this.grapheme = graphemeExpression
    this.index = index
  }
}

export class NoopAlphabetConverter {
  convertText(text) {
    return text
  }
}

export class AlphabetConverter {
  constructor(alphabetSource, alphabetTarget) {
    this.invertedAlphabetSource = AlphabetConverter.invertAlphabetSource(alphabetSource);
    this.alphabetTarget = alphabetTarget;
  }

  /**
   * Convierte un texto
   */
  convertText(text) {
    let words = text.split(' ');
    let convertedText = "";

    for (let word of words) {
      if (convertedText !== "") {
        convertedText += " ";
      }
      convertedText += this.convertWord(word);
    }
    return convertedText;
  }

  static invertAlphabetSource(alphabetSource) {
    let invertedAlphabet = new Map();

    for (let i = 0; i < alphabetSource.length; i++) {
      let graphemeEntry = new GraphemeEntry(alphabetSource[i], i)

      if (!invertedAlphabet.has(graphemeEntry.grapheme)) {
        invertedAlphabet.set(graphemeEntry.grapheme, []);
      }

      let graphemes = invertedAlphabet.get(graphemeEntry.grapheme);
      graphemes.push(graphemeEntry);
    }

    return invertedAlphabet;
  }

  /**
   * Convierte una palabra sin tomar en cuenta mayusculas / minusculas
   */
  convertWord(word) {
    // Normalizacion
    // 1. Del grafemario armamos un mapa con los candidatos y sus opciones.
    // 2. Repetimos con el siguiente graphema de 2 letras pero usando el output.
    // 3. Repetimos con los grafemas de 1 letra.
    //
    // Conversion
    // 1. Tomamos el mapa y buscamos caracteres U+0600.
    // 2. Del fonema > grafemario, reemplazamos el caracter por el del grafemario

    // Grafemas de 2 letras
    for (let i = 0; i < word.length - 1; i++) {
      let pre = word.substring(0, i);
      let g = word.substring(i, i + 2);
      let post = word.substring(i + 2, word.length);

      let r = this.convertGrapheme(pre, g, post);
      word = pre + r + post;
    }

    // Grafemas de 1 letra
    for (let i = 0; i < word.length; i++) {
      let pre = word.substring(0, i);
      let g = word.substring(i, i + 1);
      let post = word.substring(i + 1, word.length);

      let r = this.convertGrapheme(pre, g);
      word = pre + r + post;
    }

    return this.convertPhonemeMapToAlphabet(word);
  }

  convertGrapheme(pre, g_case) {

    let g = g_case.toLowerCase();

    if (!this.invertedAlphabetSource.has(g)) {
      return g_case;
    } else {
      let graphemeEntries = this.invertedAlphabetSource.get(g);

      let maxIndex = -1;
      for (let graphemeEntry of graphemeEntries) {
        if (maxIndex === -1) {
          maxIndex = graphemeEntry.index;
        }
      }
      if (maxIndex === -1) {
        return g_case;
      }

      if (g_case.length === 1) {
        if (g === this.alphabetTarget[maxIndex]) {
          return g_case;
        }
      }

      if (this.isLowerCase(g_case[0])) {
        return String.fromCharCode(MARK_LOWERCASE + maxIndex);
      } else {
        return String.fromCharCode(MARK_UPPERCASE + maxIndex);
      }
    }
  }

  convertPhonemeMapToAlphabet(word) {

    let convertedWord = ""

    for (let i in word) {
      let charCode = word.charCodeAt(i)
      if (charCode >= MARK_LOWERCASE && charCode < MARK_LOWERCASE + this.alphabetTarget.length) {
        convertedWord += this.alphabetTarget[charCode - MARK_LOWERCASE];
      } else if (charCode >= MARK_UPPERCASE && charCode < MARK_UPPERCASE + this.alphabetTarget.length) {
        let g = this.alphabetTarget[charCode - MARK_UPPERCASE];
        convertedWord += g[0].toUpperCase();
        if (g.length > 1) {
          convertedWord += g.substring(1);
        }
      } else {
        convertedWord += word.charAt(i)
      }
    }

    return convertedWord;
  }

  /**
   * Chequea si es minuscula
   */
  isLowerCase(str) {
    return str === str.toLowerCase() && str !== str.toUpperCase();
  }
}
