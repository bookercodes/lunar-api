import express from 'express';
import { 
  renderHomePage
} from './controllers/homeController';
import { 
  renderJoin
} from './controllers/usersController';

const router = express.Router();

router.get("/", renderHomePage);
router.get("/join", renderJoin);

export default router;
