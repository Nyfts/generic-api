const express = require('express');

const app = express();

const dockResponse = require("./dock-response.json");
const adquirenciaResponse = require("./adquirencia-response.json");

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/muxipay/accounting_entries', (req, res) => {
  const values = dockResponse;
  const response = JSON.parse(JSON.stringify(values));

  const page = parseInt(req?.query?.page) || 0;
  const size = parseInt(req?.query?.size) || 100;

  const offset = size * page;

  response.meta.limit = size;
  response.meta.offset = offset;
  response.objects = values.objects.slice(offset, offset + size);
  response.meta.hasNext = values.objects.slice(offset + size, offset + (size * 2)).length > 0;

  return res.send(response);
});

app.get('/adquirencia/api/transacoes', (req, res) => {
  const response = JSON.parse(JSON.stringify(adquirenciaResponse));

  const page = parseInt(req?.query?.page) || 0;
  const size = parseInt(req?.query?.size) || 20;
  const offset = size * page;
  const totalElements = response?.content?.length || 0;
  const totalPages = Math.ceil(totalElements / size);
  const last = page === (totalPages - 1);
  const first = page == 0;

  response.totalElements = totalElements;
  response.first = first;
  response.last = last;
  response.numberOfElements = totalElements;
  response.size = size;
  response.number = page;
  response.empty = response?.content?.length > 0;
  response.totalPages = totalPages;
  response.pageable.offset = offset;
  
  response.content = response?.content?.slice(offset, offset + size);

  return res.send(response);
});

app.listen(port, () => console.log(`Application started on port ${port}!`));
