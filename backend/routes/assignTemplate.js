import express from "express";
import {
    AssignTemplate,
 
} from "../controllers/assignTemplate.js";

const router = express.Router();


// router.get("/:id", getFunctionDetail);

// router.get("/recycle", getRecycleFunctions);
router.post("/", AssignTemplate);
// router.post("/sub_functions/", createSubFunction);

// router.patch("/:id", updateFunction);
// router.delete("/:id", permanentDeleteFunction);
// router.delete("/delete/:id", deleteFunction);
// router.get("/deleteAll", deleteFunctions);
// router.delete("/restore/:id", restoreFunction);
// router.get("/restoreAll", restoreFunctions);

export default router;
