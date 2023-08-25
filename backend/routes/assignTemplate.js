import express from "express";
import {
    AssignTemplate,
    GetAssignedTemplates
 
} from "../controllers/assignTemplate.js";

const router = express.Router();


router.post("/", AssignTemplate);
router.get("/", GetAssignedTemplates);


export default router;
