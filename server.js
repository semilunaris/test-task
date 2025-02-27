import jsonServer from 'json-server';
import path from 'path';

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();


server.use((req, res, next) => {
  if (req.params.id) {
    req.params.id = parseInt(req.params.id, 10); 
  }
  next();
});

server.use(middlewares);
server.use(router);

server.listen(5000, () => {
  console.log('JSON Server is running on http://localhost:5000');
});
