import Student from "../models/Student.js";
import Department from "../models/Application.js";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/index.js";

import moment from "moment";

const createStudent = async (req, res) => {
  let student = await Student.create(req.body);

  res.status(StatusCodes.CREATED).json(student);
};

const getAllStudents = async (req, res) => {
  const { regNum, department, entryYear, sort, search } = req.query;
  let queryObject = {};

  // ADD BASED ON CONDITIONS
  if (department && department !== "all") {
    queryObject.department = department;
  }

  if (search) {
    const stringSearchFields = ["firstname", "lastname", "email", "regNum"];

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
  let result = Student.find(queryObject);

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

  let students = await result;

  const totalStudents = await Student.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalStudents / limit);

  res.status(StatusCodes.OK).json({
    students,
    totalStudents,
    numOfPages,
  });
};

const getSingleStudent = async (req, res) => {
  const { id: studentId } = req.params;
  const student = await Student.findById(studentId);
  const departmentId = JSON.stringify(student.department);
  const departmentDoc = await Department.findById(departmentId.slice(1, -1));

  if (!student) {
    throw new NotFoundError(`No student with Id: ${studentId}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ ...student._doc, department: departmentDoc.abbrevation });
};

const updateStudent = async (req, res) => {
  const { id: studentId } = req.params;

  const student = await Student.findOne({ _id: studentId });

  if (!student) {
    throw new NotFoundError(`No student with Id: ${studentId}`);
  }

  await Student.findOneAndUpdate({ _id: studentId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ msg: "Success: Student Updated!" });
};

const deleteStudent = async (req, res) => {
  const { id: studentId } = req.params;

  const student = await Student.findOne({ _id: studentId });

  if (!student) {
    throw new NotFoundError(`No student with Id: ${studentId}`);
  }

  await student.remove();
  res.status(StatusCodes.OK).json({ msg: "Success: Student Deleted" });
};

const showStats = async (req, res) => {
  let stats = [];

  if (req.user.isAdmin) {
    stats = await Student.aggregate([
      { $group: { _id: "$entryYear", count: { $sum: 1 } } },
    ]);
  } else {
    stats = await Student.aggregate([
      { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
      { $group: { _id: "$entryYear", count: { $sum: 1 } } },
    ]);
  }

  const defaultStats = stats.map((item) => (!item ? (item = 0) : item));

  let monthlyApplications = await Student.aggregate([
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");

      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

const getDepartmentStudents = async (req, res) => {
  const { id: departmentId } = req.params;
  let students = await Student.find({ department: departmentId });

  if (!students) {
    throw new NotFoundError(`No student with Id: ${studentId}`);
  }

  students = await Promise.all(
    students.map(async (student) => {
      const singleDeptID = JSON.stringify(student.department);
      const departmentDoc = await Department.findById(
        singleDeptID.slice(1, -1)
      );

      return {
        ...student._doc,
        department: departmentDoc.abbrevation,
      };
    })
  );

  res.status(StatusCodes.OK).json({ students });
};

export {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
  showStats,
  getSingleStudent,
  getDepartmentStudents,
};
