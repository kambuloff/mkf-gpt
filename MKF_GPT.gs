function MKF_GPT(prompt) {
  var scriptProperties = PropertiesService.getScriptProperties();
  var apiKey = scriptProperties.getProperty('API_KEY');
  var model = scriptProperties.getProperty('MODEL'); 
   var temperature = scriptProperties.getProperty('TEMPERATURE');
  var apiEndpoint = 'https://api.openai.com/v1/chat/completions';
  var payload = {
    "model": model,
    "temperature": parseFloat(temperature),
    "messages": [
      {
        "role": "system",
        "content": "Ты унивесальный ассистент."
      },
      {
        "role": "user",
        "content": prompt
      }
    ]
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
    'headers': {
      'Authorization': 'Bearer ' + apiKey
    }
  };

  try {
    var response = UrlFetchApp.fetch(apiEndpoint, options);
    var jsonResponse = JSON.parse(response.getContentText());
    return jsonResponse.choices[0].message.content;
  } catch (error) {
    Logger.log('Ошибка при вызове API OpenAI: ' + error);
    return "Ошибка при получении ответа";
  }
}


