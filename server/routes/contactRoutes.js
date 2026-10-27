import { Router } from "express";
import { protect, editorOnly } from "../middleware/authMiddleware.js";
import {
  getContacts, getContactById, createContact, updateContact, deleteContact,
} from "../controllers/contactController.js";

const router = Router();

router.get("/", protect, getContacts);
router.get("/:id", protect, getContactById);
router.post("/", protect, editorOnly, createContact);
router.put("/:id", protect, editorOnly, updateContact);
router.delete("/:id", protect, editorOnly, deleteContact);

export default router;
