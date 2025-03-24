import  express  from "express";
import {deleteJobs, getAllJobs, getSingleJob, getmyJobs, postJob, updateJobs} from "../controllers/jobController.js";
import { isAuthorized} from "../middlewares/auth.js"
const router= express.Router();

router.get("/getall", getAllJobs);
router.post("/post", isAuthorized, postJob);
router.get("/getmyjobs", isAuthorized, getmyJobs);
router.put("/update/:id", isAuthorized, updateJobs);
router.delete("/delete/:id", isAuthorized, deleteJobs);
router.get("/:id", isAuthorized, getSingleJob);



export default router;
    