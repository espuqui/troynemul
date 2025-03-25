/* Workaround para carga en Android */

function loadJSONApk() {
  async function loadData() {
    const {default: data} = await import('../data/particles.json', {with: {type: 'json'}});
    return data
  }
  loadData().then(data => window.initView(data))
}

loadJSONApk()
