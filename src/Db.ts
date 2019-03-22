import * as mongoose from 'mongoose';
const config = require('./config/env/config')();

/**
 * Classe que define as configuraçções e conexão com MongoDB
 */
class Db {
   
    /**
     * Método que realiza configuração e conexão com MongoDb 
     */
   public connect(): mongoose.MongooseThenable {
       (<any>mongoose).Promise = global.Promise
        return mongoose.connect(config.db.url, {
            useMongoClient: true
        })
   }
 
}

export default new Db();

