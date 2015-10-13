import express from 'express';
import { 
  renderHomePage
} from './controllers/homeController';

const router = express.Router();

router.get("/", renderHomePage);

export default router;
