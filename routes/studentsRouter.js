import express from "express";
const router = express.Router();
import {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
  showStats,
  getSingleStudent,
  getDepartmentStudents
} from "../controllers/studentsController.js";
import authMiddleWare from "../middlewares/auth.js"

router.route("/").get(authMiddleWare, getAllStudents).post(createStudent);
router.route("/stats/").get(authMiddleWare, showStats);
router.route("/:id/").get(authMiddleWare, getSingleStudent).patch(authMiddleWare, updateStudent).delete(authMiddleWare, deleteStudent);
router.route("/department/:id").get(authMiddleWare, getDepartmentStudents)

export default router;
