import Staff from "../models/Staff.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import Student from "../models/Student.js";

const register = async (req, res, isStudent) => {
  let student = null;
  let staff = null;
  let token = null;

  const {
    fullname,
    firstname,
    lastname,
    gender,
    phone,
    regNum,
    course,
    email,
    password,
    department,
  } = req.body;

  if (req.query.student) {
    if (
      !firstname ||
      !lastname ||
      !gender ||
      !phone ||
      !department ||
      !regNum ||
      !email ||
      !password
    ) {
      throw new BadRequestError("Please provide all fields");
    }

    const staffAlreadyExist = await Staff.findOne({ email });

    if (staffAlreadyExist) {
      throw new BadRequestError("Email Already in use");
    }

    student = await Student.create(req.body);
    token = student.createJWT();
    student.password = undefined;
    res.status(StatusCodes.CREATED).json({ student, token });
  } else {
    if (!fullname || !course || !password || !email || !department) {
      throw new BadRequestError("Please provide all fields");
    }

    const staffAlreadyExist = await Staff.findOne({ email });

    if (staffAlreadyExist) {
      throw new BadRequestError("Email Already in use");
    }

    staff = await Staff.create(req.body);
    token = staff.createJWT();
    staff.password = undefined;
    res.status(StatusCodes.CREATED).json({ staff, token });
  }
};

const login = async (req, res) => {
  let student = null;
  let staff = null;
  let token = null;

  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please Provide all Values");
  }

  if (req.query.student) {
    student = await Student.findOne({ email }).select("+password");
    if (!student) {
      throw new UnAuthenticatedError("Invalid Credentials");
    }
    const isPasswordCorrect = await student.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new UnAuthenticatedError("Invalid Credentials");
    }
    token = student.createJWT();
    student.password = undefined;

    res.status(StatusCodes.OK).json({ student, token });
  } else {
   
    staff = await Staff.findOne({ email }).select("+password");
    if (!staff) {
      throw new UnAuthenticatedError("Invalid Credentials");
    }

    const isPasswordCorrect = await staff.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new UnAuthenticatedError("Invalid Credentials");
    }
    token = staff.createJWT();

    res.status(StatusCodes.OK).json({ staff, token });
  }
};

const studentLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please Provide all Values");
  }

  const student = await Student.findOne({ email }).select("+password");

  if (!student) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await student.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = student.createJWT();
  student.password = undefined;
  res.status(StatusCodes.OK).json({ student, token });
};

export { register, login, studentLogin };
