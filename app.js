const express = require('express');
const fs = require('fs').promises;
const xml = require('fast-xml-parser');
const app = express();
const port = 8000;

function processXML(xmlString) {
  try {
    const xmlData = xmlString;
    const parser = new xml.XMLParser();
    const newXml = parser.parse(xmlData);
    return newXml;
  } catch (error) {
    console.error('Помилка обробки XML:', error);
    return null;
  }
}

app.get('/', async (req, res) => {
  try {
    const htmlString = await fs.readFile('index.html', 'utf8');
    const xmlString = await fs.readFile('data.xml', 'utf8');
    const rootData = processXML(xmlString);
    
    if (rootData) {
      const htmlContent = htmlString.replace('<pre id="xmlData"></pre>', `<pre>${JSON.stringify(rootData, null, 2)}</pre>`);
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } else {
      res.status(500).send('Помилка обробки XML');
    }
  } catch (error) {
    console.error('Помилка читання файлу:', error);
    res.status(500).send('Помилка читання файлу. Деталі помилки: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Сервер запущено на порті ${port}`);
});
