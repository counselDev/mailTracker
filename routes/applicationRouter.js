import express from "express";
const router = express.Router();

import {
  createApplication,
  getAllApplication,
  updateApplication,
  getStudentsApplication,
  getApplicationThroghCA,
  getApplicationThroghHOD,
  getApplicationToLecturer,
} from "../controllers/applicationController.js";

router.route("/").post(createApplication).get(getAllApplication);
router.route("/:id").patch(updateApplication);
router.route("/student/").get(getStudentsApplication);
router.route("/lecturer/").get(getApplicationThroghCA);
router.route("/hod/").get(getApplicationThroghHOD);
router.route("/recipient/").get(getApplicationToLecturer);
export default router;
