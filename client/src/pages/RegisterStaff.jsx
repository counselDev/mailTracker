import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import * as ACTIONS from "../context/actions";

const initState = {
  fullname: "",
  course: "",
  password: "",
  department: "",
  email: "",
  role: "",
  courseAdvisorFor: "",
};

const RegisterStaff = () => {
  const {
    dispatch,
    register,
    clearMessage,
    whoIsLogging,
    errorMessage,
  } = useAppContext();
  const [input, setInput] = useState(initState);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setInput({ ...input, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { fullname, course, password, department, email, role } = input;

      if (!fullname || !course || !department || !password || !email || !role) {
        dispatch({
          type: ACTIONS.SET_ERROR,
          payload: { msg: "Please input all Fields" },
        });
        return;
      }

      await register(input);
      setInput(initState);

      navigate("/login?type=staff");
    } catch (error) {
      console.log(error);
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: { msg: error.message },
      });
    }
  };

  return (
    <div className="w-full py-16 flex items-center justify-center bg-gray-100">
      <div className="w-2/5">
        <h3 className="mb-5 text-2xl font-semibold  text-gray-500 text-center">
          Register Here!
        </h3>
        {errorMessage ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded flex items-center justify-between gap-4"
            role="alert"
          >
            <strong className="font-bold">{errorMessage}!</strong>

            <span className="px-4 py-2" onClick={clearMessage}>
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        ) : null}

        <form
          className="bg-white  shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-4 items-center justify-center">
            <div className="mb-4 w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="fullname"
              >
                Full Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="fullname"
                type="text"
                name="fullname"
                placeholder="fullname"
                value={input.fullname}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4 w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="course"
              >
                Course
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="course"
                type="text"
                name="course"
                value={input.course}
                onChange={handleInputChange}
                placeholder="Course"
              />
            </div>
          </div>

          <div className="flex gap-4 items-center justify-center">
            <div className="mb-4 w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="department"
              >
                Department
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="department"
                type="text"
                name="department"
                value={input.department}
                onChange={handleInputChange}
                placeholder="Department"
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                value={input.email}
                onChange={handleInputChange}
                autoComplete="email"
                placeholder="your email"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4 items-center justify-center">
            <div className="mb-6 w-full">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                name="password"
                value={input.password}
                onChange={handleInputChange}
                placeholder="**********"
              />
              <p className="text-red-500 text-xs italic">
                Please choose Link password above 6 charaters.
              </p>
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="role"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                autoComplete="role"
                value={input.role}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select Role</option>
                <option value="hod">HOD</option>
                <option value="lecturer">Lecturer</option>
              </select>
            </div>
          </div>

          <div className="mb-4 w-full">
            <label
              htmlFor="courseAdvisorFor"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Course Advisor For
            </label>
            <input
              id="courseAdvisorFor"
              type="text"
              name="courseAdvisorFor"
              value={input.courseAdvisorFor}
              onChange={handleInputChange}
              autoComplete="courseAdvisorFor"
              placeholder="your courseAdvisorFor"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Register
            </button>

            <Link
              className="block w-full rounded px-12 py-3 text-sm font-medium text-purple-600  hover:text-purple-700 focus:outline-none focus:ring sm:w-auto"
              to="/register/"
            >
              Student
            </Link>
          </div>
          <div className="text-sm text-gray-500 text-center mt-8">
            Already have an account?{" "}
            <Link className="text-violet-500" to={`/login?type=staff`}>
              Login
            </Link>
          </div>
        </form>

        <p className="text-center text-gray-500 text-xs">
          &copy;FUTO. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RegisterStaff;
