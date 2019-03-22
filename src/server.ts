import * as http from 'http';
import Api from './Api'
import db from './Db';
const config = require('./config/env/config')();
const server = http.createServer(Api);

db.connect()
.then(() => {
    server.listen(config.server.port);
    server.on('listening', () => console.log(`API Rodando na Porta: ${config.server.port}`))
    server.on('error', (error: NodeJS.ErrnoException) => console.log(`Ocorreu um erro: ${error}`))
})
.catch(error=> {
    console.log(error);
})


  