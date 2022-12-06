import React from "react";
import { TailSpin } from "react-loader-spinner";
import { useAppContext } from "../context/AppContext";
import InboxDetails from "./applications/ApplicationDetails";
import TrackApplication from "./trackApplication/TrackApplication";

const ReportChart = () => {
  const { studentsApplication, user } = useAppContext();
  return (
    <div className="flex flex-col md:col-span-2 bg-white shadow rounded-lg">
      <div className="px-6 py-5 font-semibold border-b border-gray-100">
        {user.role === "student"
          ? "Status For the last Application Sent"
          : "You Students Latest Application"}
      </div>

      {studentsApplication ? (
        studentsApplication.length > 0 ? (
          user.role === "student" ? (
            <TrackApplication status={studentsApplication[0].status} />
          ) : (
            <InboxDetails selected={studentsApplication[0]} />
          )
        ) : (
          <p className="text-lg text-gray-500 text-center p-4">
            No Application Yet
          </p>
        )
      ) : (
        <TailSpin />
      )}
    </div>
  );
};

export default ReportChart;
