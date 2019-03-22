import { Application } from 'express';
import { PlanetController } from '../controllers/PlanetController';

class Routes {

    private planetController: PlanetController;
    
    constructor() {        
        this.planetController = new PlanetController();
    }
    
    public defineRoutes(app: Application): void {
        app.route('/planeta').post(this.planetController.add);
        app.route('/planetas').get(this.planetController.list)
        app.route('/planeta/:id').delete(this.planetController.remove)
    }
}

export default new Routes();