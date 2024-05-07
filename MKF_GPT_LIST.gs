function MKF_GPT_LIST(prompt) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getActiveCell();
  var row = cell.getRow();
  var column = cell.getColumn();

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
        "content": "Ты универсальный ассистент по созданию списков. Никогда не задавай лишних вопросов, просто выдавай готовый ответ, ничего не уточняй, работай с теми данными, которые тебе дали. После ответа ничего не пиши. Строго текст по запросу пользователя и все, от себя ничего не добавляй. Не отвечай пользователю сообщением, просто нужный ему текст и все, твоя задача только сделать текст! Ты возвращаешь только список. Только список и ничего больше. Разделяй списки символом двойного дветочия. Пример - элемент 1::элемент 2::элемент 3. Только в таком формате. Списки не нумеруй."
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
    // Разбиваем строку по разделителю '::'
    var list = jsonResponse.choices[0].message.content.split('::');
    var output = list.map(function(item) {
      return [item.trim()];
    });
    return output;
  } catch (error) {
    Logger.log('Ошибка при вызове API OpenAI: ' + error);
    return "Ошибка при получении ответа";
  }
}