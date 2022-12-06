
import express from "express"
const router = express.Router()
import { updateStaff, getAllStaffs} from "../controllers/staffController.js"

router.route("/").get(getAllStaffs)
router.route("/update").post(updateStaff)


export default router