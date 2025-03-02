window.addEventListener('load', function () {
  render("mew")
});


function render() {
  const particleTypeTitle = document.getElementById("particleTypeTitle")
  const particleExplanation = document.getElementById("particleExplanation")
  const particleUsesBox = document.getElementById("particleUsesBox")
  const exampleList = document.getElementById("exampleList")


  particleTypeTitle.innerText = "sufijo instrumental"
  particleExplanation.innerText = "El sufijo instrumental -mew ∼ -mu se adjunta solo a sustantivos.."
  particleUsesBox.innerHTML = renderWithSpan("posicion: ", "particleOneWordUse")
    + renderWithSpan("blabla", "particleOneWordUseExplanation") + "<br/>"
    + renderWithSpan("tiempo: ", "particleOneWordUse")
    + renderWithSpan("blabla", "particleOneWordUseExplanation") + "<br/>"

  exampleList.innerHTML = renderMapu() + "<br/>" + renderWinka("lo amenacé con un cuchillo") + "<br /><br />"
  exampleList.innerHTML += renderMapu() + "<br/>" + renderWinka("lo amenacé con un cuchillo")

}

function renderWithSpan(text, spanClass) {
  return '<span class="' + spanClass + '">' + text + '</span>'
}

function renderWithSpanOnClickAlert(text, spanClass) {
  return renderWithSpanOnClick(text, spanClass, "alert('" + text + "')")
}

function renderWithSpanOnClick(text, spanClass, code) {
  return '<span class="' + spanClass + '" onclick="' + code + '">' + text + '</span>'
}

function renderMapu() {
  let html = '<img src="img/mapuche_flag.svg" width="20px" height="20px" alt="">'
  html += " "
  html += renderWithSpanOnClickAlert("anel", "normalWordExample")
  html += renderWithSpan("tu", "particleExample1")
  html += renderWithSpan("fiñ", "particleExample2")
  html += " "
  html += renderWithSpan("kiñe", "normalWordExample")
  html += " "
  html += renderWithSpan("kuchillo", "normalWordExample")
  html += " "
  html += renderWithSpan("mew", "particleExample3 mainParticle")

  return html
}

function renderWinka(word) {
  let html = '<img src="img/spain_flag.svg" width="20px" height="20px" alt="">'
  html += " "
  html += renderWithSpan(word, "winkaExample")
  return html
}

