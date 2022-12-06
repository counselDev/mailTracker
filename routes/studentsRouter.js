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

router.route("/").get(getAllStudents).post(createStudent);
router.route("/stats/").get(showStats);
router.route("/:id/").get(getSingleStudent).patch(updateStudent).delete(deleteStudent);
router.route("/department/:id").get(getDepartmentStudents)

export default router;
