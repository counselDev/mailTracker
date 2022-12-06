import { BadRequestError } from "../errors/index.js";
import Staff from "../models/Staff.js";
import { StatusCodes } from "http-status-codes";

const updateStaff = async (req, res) => {
  const { fullname, staffname, email, password, department } = req.body;

  if (!fullname || !staffname || !password || !email || !department) {
    throw new BadRequestError("Please provide all fields");
  }

  const staff = await Staff.findOne({ _id: req.staff.advisorId });

  staff.email = email;
  staff.fullname = fullname;
  staff.staffname = staffname;
  staff.department = department;

  await staff.save();

  const token = staff.createJWT();

  res.status(StatusCodes.OK).json({ staff, token });
};

const getAllStaffs = async (req, res) => {
  const { department, sort, search } = req.query;
  let queryObject = {};

  // ADD BASED ON CONDITIONS

  if (department && department !== "all") {
    queryObject.department = department;
  }

  if (search) {
    const stringSearchFields = ["fullname", "course", "email", "department"];

    const query = {
      $or: [
        ...stringSearchFields.map((field) => ({
          [field]: new RegExp("^" + search, "i"),
        })),
      ],
    };
    queryObject = { ...queryObject, ...query };
  }

  // No AWAIT
  let result = Staff.find(queryObject);

  // CHAIN CONNDITIONS
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  let staffs = await result;

  const totalStaffs = await Staff.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalStaffs / limit);

  res.status(StatusCodes.OK).json({
    staffs,
    totalStaffs,
    numOfPages,
  });
};

const deleteStaff = async (req, res) => {
  const { id: advisorId } = req.params;

  const staff = await Staff.findOne({ _id: advisorId });

  if (!staff) {
    throw new NotFoundError(`No staff with Id: ${advisorId}`);
  }

  await staff.remove();
  res.status(StatusCodes.OK).json({ msg: "Success: Staff Deleted" });
};

export { updateStaff, getAllStaffs, deleteStaff };
