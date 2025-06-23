const FEEDBACK_URL = 'https://feedback.troynemul.org/postFeedback/'

const HEADERS = {
  'Content-Type': 'application/json',
  'X-Api-Key': 'marichiweuamulepetainweichan'
};

function callbackPostRequest(responseCode) {
  alert(responseCode)
}

export function sendWordFeedback(word, comment, name, land, grafemario, version) {
  const data = {
    name: name,
    land: land,
    comment: comment,
    version: version,
    grafemario: grafemario,
    platform: isAndroid() ? "android" : "web",
    word: word == null ? "" : word
  };
  const body = JSON.stringify(data);

  sendPostRequest(FEEDBACK_URL, body, callbackPostRequest)
}

function sendPostRequest(url, body, callbackPostRequest) {

  const options = {
    method: 'POST',
    headers: HEADERS,
    body: body
  };

  fetch(url, options)
    .then(response => {
      if (!response.ok) {
        callbackPostRequest(response.status)
      }
      callbackPostRequest(response.status)
    });
}


function isAndroid() {
  return navigator.userAgent.includes('wv')
}

