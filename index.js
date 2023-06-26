require('dotenv').config();
const Server = require('./models/server');

//* instancia del servidor
const server = new Server();

//* ejecutamos el servidor
server.execute();
