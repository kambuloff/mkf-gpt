function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('MKF GPT')
    .addItem('Значения в текст', 'replaceFormulasWithValues')
    .addItem('Заполнить таблицу', 'promptForMKF_GPT_TABLE')
    .addItem('Перезапустить функцию', 'restartFunctionInCell')
    .addItem('Вставить изображение', 'promptForImageInsertion')
    .addItem('Настройки API', 'showSettingsDialog')
    .addToUi();
}

function replaceFormulasWithValues() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getDataRange(); // Получаем диапазон данных листа
  var values = range.getValues(); // Получаем значения ячеек
  
  // Заменяем все формулы их текущими значениями
  range.setValues(values);
}

// Функция для отображения диалогового окна запроса
function promptForMKF_GPT_TABLE() {
  var html = HtmlService.createHtmlOutputFromFile('Prompt')
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, 'Введите запрос для API');
}

function restartFunctionInCell() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getActiveCell();
  var formula = cell.getFormula();
  
  if (formula) {
    try {
      // Определяем, заканчивается ли формула на пробел внутри кавычек и корректируем
      if (/ "\)$/.test(formula)) {
        // Если формула заканчивается на пробел перед закрывающей скобкой, убираем пробел
        formula = formula.replace(/ "\)$/, '")');
      } else {
        // Если формула не заканчивается на пробел, добавляем его
        formula = formula.replace(/"\)$/, ' ")');
      }
      
      // Очищаем ячейку и восстанавливаем формулу с изменённым аргументом
      cell.setFormula(''); // Очищаем ячейку
      SpreadsheetApp.flush(); // Применяем изменения
      cell.setFormula(formula); // Восстанавливаем модифицированную формулу
      SpreadsheetApp.getUi().alert('Формула в ячейке была перезапущена.');
    } catch (error) {
      SpreadsheetApp.getUi().alert('Ошибка при перезапуске функции: ' + error.toString());
    }
  } else {
    SpreadsheetApp.getUi().alert('В выбранной ячейке нет формулы.');
  }
}

function fetchModelList() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
  var response = UrlFetchApp.fetch('https://api.openai.com/v1/models', {
    'method': 'get',
    'headers': {
      'Authorization': 'Bearer ' + apiKey
    }
  });
  var models = JSON.parse(response.getContentText());
  return models.data.map(function(model) {
    return model.id;
  });
}

function saveSettings(apiKey, temperature, model) {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('API_KEY', apiKey);
  scriptProperties.setProperty('TEMPERATURE', temperature);
  scriptProperties.setProperty('MODEL', model);
}

function showSettingsDialog() {
  var html = HtmlService.createHtmlOutputFromFile('Settings')
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, 'Настройки API');
}

function getSettings() {
  var scriptProperties = PropertiesService.getScriptProperties();
  var apiKey = scriptProperties.getProperty('API_KEY');
  var temperature = scriptProperties.getProperty('TEMPERATURE');
  var currentModel = scriptProperties.getProperty('MODEL');
  var models = fetchModelList();

  return {
    apiKey: apiKey,
    temperature: temperature,
    currentModel: currentModel,
    models: models
  };
}


function promptForImageInsertion() {
  var html = HtmlService.createHtmlOutputFromFile('ImagePrompt')
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, 'Введите запрос для изображения');
}



