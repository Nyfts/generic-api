const express = require('express');

const app = express();

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/accounting_entries', (req, res) => {
  const values = require("./dock-response.json");
  const response = JSON.parse(JSON.stringify(values));

  const page = parseInt(req?.query?.page) || 0;
  const size = parseInt(req?.query?.size) || 100;

  const offset = size * page;

  response.meta.limit = size;
  response.meta.offset = offset;
  response.objects = values.objects.slice(offset, offset + size);
  response.meta.hasNext = values.objects.slice(offset + size, offset + (size * 2)).length > 0;

  res.send(response);
});

app.listen(port, () => console.log(`Application started on port ${port}!`));
