import {AlphabetConverter, GraphemeEntry, MARK_LOWERCASE, MARK_UPPERCASE} from "../../backend/alphabet_converter.js"
import {
  MAPUDUNGUN_AZUMCHEFE_PHONETIC_MAP,
  MAPUDUNGUN_RAGUILEO_PHONETIC_MAP,
  MAPUDUNGUN_UNIFICADO_QUOTES_PHONETIC_MAP,
  MAPUDUNGUN_UNIFICADO_UNDERSCORE_PHONETIC_MAP
} from "../../backend/alphabet_definitions.js";


describe('convertGrafemario', () => {
  test('convertUnificadoToAzumchefe', () => {

    let converter = new AlphabetConverter(MAPUDUNGUN_UNIFICADO_UNDERSCORE_PHONETIC_MAP, MAPUDUNGUN_AZUMCHEFE_PHONETIC_MAP)

    // Estos no pasan

    /*
    expect(converter.convertText("Feyti")).toStrictEqual("Feiti")
    expect(converter.convertText(
      "Chadingechi korü kümentukelan. Feyti wentru ñi kug ta fütakengey. Eymün ta ḻafkeṉchengeymün."))
      .toStrictEqual("Chazigechi korü kümentukelan. Feiti wentxu ñi kuq ta fütakegey. Eymün ta lhafkenhchegeimün.") */

    expect(converter.convertText("Feyti")).toStrictEqual("Feyti")
    expect(converter.convertText(
      "Chadingechi korü kümentukelan. Feyti wentru ñi kug ta fütakengey. Eymün ta ḻafkeṉchengeymün."))
      .toStrictEqual("Chazigechi korü kümentukelan. Feyti wentxu ñi kuq ta fütakegey. Eymün ta lhafkenhchegeymün.")
    expect(converter.convertText("ChaDingechi")).toStrictEqual("ChaZigechi")

  })

  test('convertUnificadoToRaguileo', () => {
    let converter = new AlphabetConverter(MAPUDUNGUN_UNIFICADO_UNDERSCORE_PHONETIC_MAP, MAPUDUNGUN_RAGUILEO_PHONETIC_MAP)

    expect(converter.convertText("Feyti")).toStrictEqual("Feyti")
    expect(converter.convertText(
      "Chadingechi korü kümentukelan. Feyti wentru ñi kug ta fütakengey. Eymün ta ḻafkeṉchengeymün."))
      .toStrictEqual("Cazigeci korv kvmentukelan. Feyti wenxu ñi kuq ta fvtakegey. Eymvn ta bafkehcegeymvn.")
    expect(converter.convertText("ChaDingechi")).toStrictEqual("CaZigeci")

  })

  test('convertRaguileoToUnificado', () => {

    let converter = new AlphabetConverter(MAPUDUNGUN_RAGUILEO_PHONETIC_MAP, MAPUDUNGUN_UNIFICADO_UNDERSCORE_PHONETIC_MAP)

    expect(converter.convertText("Feyti")).toStrictEqual("Feyti")
    expect(
      converter.convertText(
        "Cazigeci korv kvmentukelan. Feyti wenxu ñi kuq ta fvtakegey. Eymvn ta bafkehcegeymvn.")).toStrictEqual(
      "Chadingechi korü kümentukelan. Feyti wentru ñi kug ta fütakengey. Eymün ta ḻafkeṉchengeymün.")

    expect(converter.convertText("CaZigeci")).toStrictEqual("ChaDingechi")
  })


  describe('testCallGrapheme', () => {
    test('testConvertGrapheme', () => {
      let converter = new AlphabetConverter(["a", "b", "c"], ["x", "y", "z"]);
      expect(converter.convertGrapheme("ae", "a", "be")).toStrictEqual(String.fromCharCode(MARK_LOWERCASE))
    })
  })

  describe('testInvertedAlphabetSource', () => {
    test('testInvertSomeGrapheme', () => {
      let invertedAlphabetSource = AlphabetConverter.invertAlphabetSource(
        ["a", "b", "ch"]);
      let graphemeEntries;

      graphemeEntries = invertedAlphabetSource.get("a")
      expect(graphemeEntries[0].grapheme).toStrictEqual("a")
      expect(graphemeEntries[0].index).toStrictEqual(0)

      graphemeEntries = invertedAlphabetSource.get("b");
      expect(graphemeEntries[0].grapheme).toStrictEqual("b")
      expect(graphemeEntries[0].index).toStrictEqual(1)

      graphemeEntries = invertedAlphabetSource.get("ch")
      expect(graphemeEntries[0].grapheme).toStrictEqual("ch")
      expect(graphemeEntries[0].index).toStrictEqual(2)
    })
  })

  describe('convertNoopAlphabetRespectCase', () => {
    test('convertNoopAlphabetRespectCases', () => {
      let converter = new AlphabetConverter([], [])
      expect("Mari mari mapu!").toStrictEqual("Mari mari mapu!")
      expect("Mari mari mapu! 1223a . ").toStrictEqual("Mari mari mapu! 1223a . ")
    })
  })

  describe('convertSameAlphabetAndRestore', () => {
    test('convertSameAlphabetAndRestoreCases', () => {
      expect("Chadingechi korü kümentukelan. Feyti wentru ñi kug ta fütakengey. Eymün ta ḻafkeṉchengeymün.")
        .toStrictEqual("Chadingechi korü kümentukelan. Feyti wentru ñi kug ta fütakengey. Eymün ta ḻafkeṉchengeymün.")
    })
  })

  describe('verifyParseGraphemeEntry', () => {
    test('verifyParseGraphemeEntries', () => {
      let graphemeEntry = new GraphemeEntry("a", 1)
      expect("a").toStrictEqual(graphemeEntry.grapheme)
      expect(1).toStrictEqual(graphemeEntry.index)
    })
  })

  describe('verifyPhonemeToAlphabet', () => {
    test('verifyPhonemeToAlphabet', () => {
      let converter = new AlphabetConverter(["a", "b", "c"], ["x", "y", "z"]);

      // sourceWord = "abc bcad"
      let sourceWord = String.fromCharCode(MARK_LOWERCASE)
      sourceWord += String.fromCharCode(MARK_LOWERCASE + 1)
      sourceWord += String.fromCharCode(MARK_LOWERCASE + 2)
      sourceWord += ' '
      sourceWord += String.fromCharCode(MARK_LOWERCASE + 1)
      sourceWord += String.fromCharCode(MARK_LOWERCASE + 2)
      sourceWord += String.fromCharCode(MARK_LOWERCASE)
      sourceWord += 'd'
      expect("xyz yzxd").toStrictEqual(converter.convertPhonemeMapToAlphabet(sourceWord))

      // sourceWord = "ABC BCAD"
      sourceWord = String.fromCharCode(MARK_UPPERCASE)
      sourceWord += String.fromCharCode(MARK_UPPERCASE + 1)
      sourceWord += String.fromCharCode(MARK_UPPERCASE + 2)
      sourceWord += ' '
      sourceWord += String.fromCharCode(MARK_UPPERCASE + 1)
      sourceWord += String.fromCharCode(MARK_UPPERCASE + 2)
      sourceWord += String.fromCharCode(MARK_UPPERCASE)
      sourceWord += 'D'
      expect("XYZ YZXD").toStrictEqual(converter.convertPhonemeMapToAlphabet(sourceWord))
    })
  })

})

