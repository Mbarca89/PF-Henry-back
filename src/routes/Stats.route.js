import Router from 'express';
import {getStats, getUserStats} from '../controllers/Stats.controller.js';



const statsRoutes = Router();

statsRoutes.get('/', getStats)
statsRoutes.get('/:userId', getUserStats)


export default statsRoutes;