const FEEDBACK_URL = 'https://feedback.troynemul.org/postFeedback/'

const HEADERS = {
  'Content-Type': 'application/json',
  'x-api-key': 'marichiweuamulepetainweichan'
};
export function sendWordFeedback(word)
{
  const data = {
    name: 'Kuanita',
    land: 'Wallmapu',
    comment: 'Mari, mari',
    version: 'abc',
    grafemario: 'ra',
    word: word
  };
  const body = JSON.stringify(data);

  const options = {
    method: 'POST',
    headers: HEADERS,
    body: body
  };

  fetch(FEEDBACK_URL, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Or response.text() depending on the expected response type
    })
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

}

