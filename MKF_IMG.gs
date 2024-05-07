function MKF_IMG(prompt) {
  var scriptProperties = PropertiesService.getScriptProperties();
  var apiKey = scriptProperties.getProperty('API_KEY');
  var apiEndpoint = 'https://api.openai.com/v1/images/generations';

  var payload = {
    "prompt": prompt,
    "size": "1024x1024",
    "model": "dall-e-3",
    "quality": "standard",
    "n": 1
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'headers': {
      'Authorization': 'Bearer ' + apiKey
    },
    'muteHttpExceptions': true // Добавлено для предотвращения выброса исключений на ошибки HTTP
  };

  try {
    var response = UrlFetchApp.fetch(apiEndpoint, options);
    var jsonResponse = JSON.parse(response.getContentText());
    if (jsonResponse.error) {
      throw new Error(jsonResponse.error.message);
    }
    var imageUrl = jsonResponse.data[0].url;
    insertImageIntoActiveCell(imageUrl);
  } catch (error) {
    Logger.log('Ошибка при вызове API OpenAI: ' + error.toString());
    SpreadsheetApp.getUi().alert('Ошибка при вызове API OpenAI: ' + error.toString());
  }
}

function insertImageIntoActiveCell(imageUrl) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getActiveCell();
  cell.setFormula('=IMAGE("' + imageUrl + '")');
}


