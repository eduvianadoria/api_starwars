import * as express from 'express';
import { Application } from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
const helmet = require('helmet');
import Routes from './routes/Routes';

class Api {
    
    public express: Application;
    
    constructor() {
        this.express = express();
        //middleware
        this.express.use(helmet());
        this.express.use(morgan('dev'));
        this.express.use(bodyParser.urlencoded({extended: true}));
        this.express.use(bodyParser.json());
        //router
        this.router(this.express);
    }

    private router(app: Application): void {
        Routes.defineRoutes(app);
    }
}

export default new Api().express;