import React, { useEffect } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { FiMail } from "react-icons/fi";
import { FiSettings } from "react-icons/fi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { useAppContext } from "../context/AppContext";
import { TailSpin } from "react-loader-spinner";

const Cards = () => {
  const {
    currentStats,
    getStats,
    studentsApplication,
    applicationsToUser,
    user,
  } = useAppContext();

  useEffect(() => {
    const getData = async () => {
      await getStats();
    };
    getData();
  }, []);

  const getPending = () => {};

  return (
    <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
      {currentStats ? (
        <>
          <div className="flex flex-col justify-center p-8 bg-white shadow rounded-lg">
            <div className="flex items-center  gap-6 mb-2">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full">
                <FiMail size={24} />
              </div>
              <span className="block text-2xl font-bold">
                {studentsApplication.length}
              </span>
            </div>

            <span className="flex text-gray-500">
              {user?.role === "student"
                ? "Applications"
                : "Your Students Request"}
            </span>
          </div>

          <div className="flex flex-col justify-center p-8 bg-white shadow rounded-lg">
            <div className="flex items-center  gap-6 mb-2">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full">
                <AiOutlineClockCircle size={24} />
              </div>
              <span className="inline-block text-2xl font-bold">
                {user?.role === "student"
                  ? currentStats.message_sent + currentStats.CA_approval
                  : user?.role === "lecturer"
                  ? currentStats.message_sent
                  : currentStats.CA_approval}
              </span>
            </div>

            <span className="block text-gray-500">
              {user?.role === "student" ? "Pending" : "Pending your approval"}
            </span>
          </div>

          <div className="flex flex-col justify-center p-8 bg-white shadow rounded-lg">
            <div className="flex items-center  gap-6 mb-2">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full">
                <FiSettings size={24} />
              </div>
              <span className="block text-2xl font-bold">
                {user.role === "student"
                  ? currentStats.processing
                  : applicationsToUser?.length || 0}
              </span>
            </div>

            <span className="block text-gray-500">
              {user?.role === "student" ? "Processing" : "Sent to you"}
            </span>
          </div>

          <div className="flex flex-col justify-center p-8 bg-white shadow rounded-lg">
            <div className="flex items-center  gap-6 mb-2">
              <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full">
                <AiOutlineSend size={24} />
              </div>
              <span className="block text-2xl font-bold">
                {currentStats.completed}
              </span>
            </div>

            <span className="block text-gray-500">Successful</span>
          </div>
        </>
      ) : (
        <TailSpin />
      )}
    </section>
  );
};

export default Cards;
