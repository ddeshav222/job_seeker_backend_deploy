import  express  from "express";
import { getUSer, register } from "../controllers/userController.js";
import { login } from "../controllers/userController.js";
import { logout } from "../controllers/userController.js";
import { isAuthorized} from "../middlewares/auth.js"

const router= express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthorized, logout);
router.get("/getuser", isAuthorized, getUSer);


export default router;
    