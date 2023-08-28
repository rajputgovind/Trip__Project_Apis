import express from "express";
import auth from "../middleware/auth.js";
import checkOrganizer from "../middleware/checkOrganizer.js";
import {
  createDocument,
  updateDocument,
} from "../controllers/documentController.js";
import { validateDocument, validateUpdateDocument } from "../middleware/validate.js";


const DocumentRouter = express.Router();

DocumentRouter.post("/create-document", auth, checkOrganizer,validateDocument, createDocument);

DocumentRouter.put("/update-document/:id",auth,checkOrganizer,validateUpdateDocument,updateDocument);

export default DocumentRouter;
