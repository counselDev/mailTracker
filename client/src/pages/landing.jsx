import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/FUTO_logo_main.png"

const Landing = () => {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4  lg:h-screen lg:items-center">
        <nav className="font-semibold text-sm md:text-base lg:text-lg flex gap-2 md:gap-4 justify-center items-center mx-auto max-w-xl text-center py-4">
          <img src={Logo} alt="logo" className="h-8 w-8 md:h-12 md:w-12" /> Federal University of Technology, Owerri  
        </nav>
        <div className="mx-auto max-w-xl text-center py-28">
          <h1 className="text-3xl font-extrabold mb-6 leading-10 text-gray-900 sm:text-5xl">
            Make, Monitor and Manage
            <strong className="font-extrabold text-purple-700 sm:block">
              Your Applications
            </strong>
          </h1>

          <p className="mt-4 sm:text-xl text-gray-500 sm:leading-relaxed">
            Get Started Now!
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              className="block w-3/4 rounded bg-purple-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-purple-700 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              to="/register?type=student"
            >
              Students
            </Link>

            <Link
              className="block w-3/4 rounded px-12 py-3 text-sm font-medium text-purple-600 shadow hover:text-purple-700 focus:outline-none focus:ring active:text-blue-500 sm:w-auto"
              to="/register/staff?type=staff"
            >
              Staffs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
