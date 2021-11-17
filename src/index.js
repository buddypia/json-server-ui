const express = require('express')
const jsonServer = require('json-server')
const cors = require('cors')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
require('dotenv').config()


const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

server.use(cors())
server.use(express.static('public'));

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)

server.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
}); 

server.get('/urls', (req, res) => {
  const root = `http://${host}:${port}`
  console.log(router.db.getState());
  const urls = [];
  for (const prop in router.db.getState()) {
    const url = `${root}/${prop}`;
    console.log(`url: ${url}`);
    urls.push(`${root}/${prop}`);
  }

  res.json(urls);
});

server.get('/bulk-urls', (req, res) => {
  const root = `http://${host}:${port}`
  const urls = [];
  for (const prop in router.db.getState()) {
    const url = `${root}/${prop}`;
    console.log(`url: ${url}`);
    urls.push(`${root}/${prop}?bulk`);
  }

  res.json(urls);
});

server.use((req, res, next) => {
  if (req.method === 'POST') {
    const splitPath = req.originalUrl.split('?')
    console.log(`splitPath: ${splitPath.toString()}`);

    if (splitPath.length == 2) {
      const regexp = /^\/(.*)/;
      const resource = splitPath[0].replace(regexp, '$1');
      console.log(`resource: ${resource}`);

      // router.db.get('discoveries').remove().write();
      
      // router.db.unset('discoveries').write();
      router.db.get(resource).remove().write();
      router.db.set(resource, req.body).write();
      // router.db.get['discoveries'].write();
      // router.db.write();
      // console.log(router.db.get('discoveries'));
      res.sendStatus(200);
      return;
    }

    // console.log(splitPath[1]); 
  }
  next()
})

// Use default router
server.use(router);

// server.routes.all().forEach(function(route){
//   console.log(`route method: ${route.method.toUpperCase()}, path: ${route.path}`);
// });

console.log(`API Root http://${host}:${port}`);
server.listen(port);