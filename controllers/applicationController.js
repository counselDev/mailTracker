import Application from "../models/Application.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";
import Staff from "../models/Staff.js";

const createApplication = async (req, res) => {
  const { userId } = req.user;
  const student = await Student.findById(userId);
  const sender = {
    name: `${student.firstname} ${student.lastname}`,
    studentId: student._id,
    regNum: student.regNum,
    email: student.email,
    department: student.department,
    entryYear: student.entryYear,
  };
  const application = await Application.create({
    ...req.body,
    attachments: JSON.parse(req.body.attachments),
    sender,
  });

  res.status(StatusCodes.CREATED).json({ application });
};

const getAllApplication = async (req, res) => {
  const { faculty, application, sort, search } = req.query;
  let queryObject = {};

  // ADD BASED ON CONDITIONS
  if (faculty && faculty !== "all") {
    queryObject.faculty = faculty;
  }
  if (application && application !== "all") {
    queryObject.application = application;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  // No AWAIT
  let result = Application.find(queryObject);

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

  const departments = await result;

  const totalApplications = await Application.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalApplications / limit);

  res.status(StatusCodes.OK).json({
    departments,
    totalApplications,
    numOfPages,
  });
};

const getStudentsApplication = async (req, res) => {
  const { search } = req.query;

  let queryObject = {
    "sender.studentId": mongoose.Types.ObjectId(req.user.userId),
  };

  if (search) {
    const stringSearchFields = ["title", "recipient.name"];

    const query = {
      $or: [
        ...stringSearchFields.map((field) => ({
          [field]: new RegExp("^" + search, "i"),
        })),
      ],
    };
    queryObject = { ...queryObject, ...query };
  }

  const studentsApplication = await Application.find(queryObject).sort(
    "-createdAt"
  );

  let stats = await Application.aggregate([
    {
      $match: { "sender.studentId": mongoose.Types.ObjectId(req.user.userId) },
    },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const currentStats = {
    message_sent: stats.message_sent || 0,
    CA_approval: stats.CA_approval || 0,
    HOD_approval: stats.HOD_approval || 0,
    processing: stats.processing || 0,
    completed: stats.completed || 0,
  };

  res.status(StatusCodes.OK).json({ currentStats, studentsApplication });
};

const getApplicationThroghCA = async (req, res) => {
  const { search } = req.query;

  const staff = await Staff.findById(req.user.userId);

  if (!staff) {
    throw new BadRequestError("No Staff with supplied ID");
  }

  let queryObject = {
    "sender.entryYear": staff.courseAdvisorFor,
  };

  if (search) {
    const stringSearchFields = [
      "title",
      "recipient.name",
      "sender.name",
      "sender.regNum",
    ];

    const query = {
      $or: [
        ...stringSearchFields.map((field) => ({
          [field]: new RegExp("^" + search, "i"),
        })),
      ],
    };
    queryObject = { ...queryObject, ...query };
  }

  const studentsApplication = await Application.find(queryObject).sort(
    "-createdAt"
  );

  let stats = await Application.aggregate([
    {
      $match: { "sender.entryYear": staff.courseAdvisorFor },
    },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const currentStats = {
    message_sent: stats.message_sent || 0,
    CA_approval: stats.CA_approval || 0,
    HOD_approval: stats.HOD_approval || 0,
    processing: stats.processing || 0,
    completed: stats.completed || 0,
  };

  res.status(StatusCodes.OK).json({ currentStats, studentsApplication });
};

const getApplicationThroghHOD = async (req, res) => {
  const { search } = req.query;

  const staff = await Staff.findById(req.user.userId);

  if (!staff) {
    throw new BadRequestError("No Staff with supplied ID");
  }

  let queryObject = {
    "sender.department": staff.department,
    $or: [
      { status: "CA_approval" },
      { status: "HOD_approval" },
      { status: "processing" },
      { status: "completed" },
    ]
  };

  if (search) {
    const stringSearchFields = [
      "title",
      "recipient.name",
      "sender.name",
      "sender.regNum",
    ];

    const query = {
      $or: [
        ...stringSearchFields.map((field) => ({
          [field]: new RegExp("^" + search, "i"),
        })),
      ],
    };
    queryObject = { ...queryObject, ...query };
  }

  const studentsApplication = await Application.find(queryObject).sort(
    "-createdAt"
  );

  let stats = await Application.aggregate([
    {
      $match: { "sender.department": staff.department },
    },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const currentStats = {
    CA_approval: stats.CA_approval || 0,
    HOD_approval: stats.HOD_approval || 0,
    processing: stats.processing || 0,
    completed: stats.completed || 0,
  };

  res.status(StatusCodes.OK).json({ currentStats, studentsApplication });
};

const getApplicationToLecturer = async (req, res) => {
  const { search } = req.query;

  const staff = await Staff.findById(req.user.userId);

  if (!staff) {
    throw new BadRequestError("No Staff with supplied ID");
  }

  let queryObject = {
    "recipient.staffId": mongoose.Types.ObjectId(req.user.userId),
    $or: [
      { status: "HOD_approval" },
      { status: "processing" },
      { status: "completed" },
    ],
  };

  if (search) {
    const stringSearchFields = [
      "title",
      "recipient.name",
      "sender.name",
      "sender.regNum",
    ];

    const query = {
      $or: [
        ...stringSearchFields.map((field) => ({
          [field]: new RegExp("^" + search, "i"),
        })),
      ],
    };
    queryObject = { ...queryObject, ...query };
  }

  const applicationsToUser = await Application.find(queryObject).sort(
    "-createdAt"
  );

  res.status(StatusCodes.OK).json(applicationsToUser);
};

const updateApplication = async (req, res) => {
  const { id: applicationId } = req.params;
  const { attachment } = req.body;
  let parsedAttachment = null;

  const application = await Application.findOne({ _id: applicationId });

  if (!application) {
    throw new BadRequestError(`No application with Id: ${applicationId}`);
  }

  if (!attachment && application.status !== "HOD_approval") {
    throw new BadRequestError(`Please provide an attachment`);
  }

  if (attachment) {
    parsedAttachment = JSON.parse(attachment);
    console.log(parsedAttachment, "parsedAttachment")
  }

  let payload = {};
  if (req.user.role === "lecturer" && application.status === "message_sent") {
    payload = { status: "CA_approval", attachments: parsedAttachment };
  }

  if (req.user.role === "HOD" && application.status === "CA_approval") {
    payload = { status: "HOD_approval", attachments: parsedAttachment };
  }

  if (req.user.role === "lecturer" && application.status === "HOD_approval") {
    payload = { status: "processing" };
  }
  if (req.user.role === "lecturer" && application.status === "processing") {
    console.log(parsedAttachment);
    payload = { status: "completed", attachments: parsedAttachment };
  }

  await Application.findOneAndUpdate({ _id: applicationId }, payload, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ msg: "Success: Application Updated!" });
};

export {
  createApplication,
  getAllApplication,
  updateApplication,
  getStudentsApplication,
  getApplicationThroghCA,
  getApplicationThroghHOD,
  getApplicationToLecturer,
};
