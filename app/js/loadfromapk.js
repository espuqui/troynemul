/* Workaround para carga en Android */

function loadFromApk() {
  async function loadData() {
    const {default: data} = await import('../data/particles.json', {with: {type: 'json'}});
    return data
  }
  loadData().then(data => window.afterParseData(data))
}

loadFromApk()
