import fs from 'fs'

processInputFile()


function processInputFile() {

  fs.readFile('../../input.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    let output = fixChars(data)
    let json = alignExamples(output)
    printPrompt(json)
  });

}

function printPrompt(json) {

  let prompt = "Translate to spanish only what it is in the \"explanation\" keys" +
    " of the following JSON file, and keep the rest of the JSON text." +
    "Also translate to spanish the 3rd element of each array with key \"examples\":\n"

  console.log(prompt + " " + json)
}
function fixChars(data) {
  let output = ""

  output = data.replaceAll("¨u", "ü")
  output = output.replaceAll("˜n", "ñ")
  output = output.replaceAll("´", "")

 // console.log(output)
  return output
}

function alignExamples(data) {
  let output = ""
  let lines = data.split("\n")
  let inExample = false
  let mapuWordTurn = false
  let lastLine = ""
  let mapuWord = ""
  let winkaWord = ""

  let jsonObject = []

  let currentContent = {}
  currentContent["explanation"] = ""
  currentContent["examples"] = []
  jsonObject.push(currentContent)

  for (let line of lines) {
    let lineNoRef = line.replaceAll(/\((.*?)\)\s/g, "")

    // Begin example
    if (line.length > 0 && line[0] === '(') {
      // End explanation
      // Begin examples
      inExample = true
      mapuWordTurn = true

      mapuWord = ""
      winkaWord = ""
    } else if (line.length > 0 && line[0] === '‘') {
      // End example
      inExample = false
      output += mapuWord + "\n"
      output += winkaWord + "\n"

      let example = []
      example.push(mapuWord.replaceAll(/\s*$/g, ""))
      example.push(winkaWord.replaceAll(/\s*$/g, ""))

      let fullTranslation = lineNoRef
      fullTranslation = fullTranslation.replaceAll("’","")
      fullTranslation = fullTranslation.replaceAll("‘","")

      example.push(fullTranslation)

      currentContent["examples"].push(example)
    } else {
      if (!inExample && lastLine.length > 0 && lastLine[0] === '‘') {
        // New explanation
        currentContent = {}
        currentContent["explanation"] = ""
        currentContent["examples"] = []
        jsonObject.push(currentContent)
      }
    }

    if (inExample) {
      if (mapuWordTurn) {
        mapuWord += lineNoRef + " "
      } else {
        winkaWord += lineNoRef + " "
      }
      mapuWordTurn = !mapuWordTurn
    } else {
      output += lineNoRef + "\n"
      currentContent["explanation"] += lineNoRef + " "
      lastLine = line
    }
  }

  if (currentContent["explanation"] !== undefined && currentContent["explanation"].trim() === "") {
    jsonObject.pop()
  }

  return JSON.stringify(jsonObject, null, 2);
}
