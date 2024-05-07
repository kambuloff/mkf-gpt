function MKF_GPT_TABLE(prompt) {
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
        "content": "Ты универсальный ассистент по созданию таблиц. Всегда возвращай данные точно в формате, где каждая строка информации отделена символом ';', а данные внутри строки разделены символом '::'. Первая строка обязательно должна содержать только заголовки столбцов, следующие строки - данные согласно этим заголовкам. Убедись, что в ответах нет лишних строк или символов до и после списка данных. Точно соблюдай этот формат без добавления каких-либо дополнительных уточнений или описаний. Пример данных которые ты должен возвращать - День::Завтрак::Обед::Ужин;Первый::Омлет с овощами::Гречка с курицей::Рыба с овощами;Второй::Творожная запеканка::Паста с соусом::Курица с овощами;Третий::Оладьи с медом::Рис с овощами::Стейк с салатом;. Строго следуй такому формату!! Строго! Пример что бы ты понял структуру из него ничего не пиши!"
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
    var data = jsonResponse.choices[0].message.content;
    var rows = data.split(';').map(function(row) {
      return row.split('::').map(function(item) {
        return item.trim();
      });
    });

    var sheet = SpreadsheetApp.getActiveSheet();
    sheet.clear(); // Очистка листа перед заполнением
    rows.forEach(function(row) {
      sheet.appendRow(row); // Добавление каждой строки
    });
     // Заливка первой строки серым цветом
    var headerRange = sheet.getRange(1, 1, 1, rows[0].length);
    headerRange.setBackground('#cccccc'); // Установка серого цвета для заголовков
    
    return "Таблица успешно создана";
  } catch (error) {
    Logger.log('Ошибка при вызове API OpenAI: ' + error.toString());
    return "Ошибка при получении ответа";
  }
}
