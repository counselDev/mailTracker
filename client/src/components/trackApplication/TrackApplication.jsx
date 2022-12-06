import React from "react";
import { TiTick } from "react-icons/ti";
import "./trackApplication.css";

const TrackApplication = ({ status }) => {
  const statusClass = (index) => {
    if (status === "message_sent") {
      return index === 0 ? "completed" : null;
    }
    if (status === "CA_approval") {
      return index <= 1 ? "completed" : null;
    }
    if (status === "HOD_approval") {
      return index <= 2 ? "completed" : null;
    }
    if (status === "processing") {
      return index <= 3 ? "completed" : null;
    }
    if (status === "completed") {
      return index <= 4 ? "completed" : null;
    }
  };

  const setOrder = async (statusValue) => {
    if (isAdmin) {
      await updatestatus(id, statusValue);
      setCurrentStatus(statusValue);
    }
  };

  return (
    <div className="container w-full bg-white p-2 md:p-4 mb-4 rounded-md">
      <h2 className="text-gray-900 text-xl mx-6">Track Application</h2>
      <div className={`steps flex justify-between pt-2 pb-1`}>
        <div className={`step ${statusClass(0)}`}>
          <div className="stepIconWrap">
            <div className="stepIcon">
              <TiTick />
            </div>
          </div>
          <h4 className="stepTitle">Message Sent</h4>
        </div>

        <div className={`step ${statusClass(1)}`}>
          <div className="stepIconWrap">
            <div className="stepIcon">
              <TiTick />
            </div>
          </div>
          <h4 className="stepTitle">Course Advisor Approval</h4>
        </div>
        <div className={`step ${statusClass(2)}`}>
          <div className="stepIconWrap">
            <div className="stepIcon">
              <TiTick />
            </div>
          </div>
          <h4 className="stepTitle">HOD Approval </h4>
        </div>
        <div className={`step ${statusClass(3)}`}>
          <div className="stepIconWrap">
            <div className="stepIcon">
              <TiTick />
            </div>
          </div>
          <h4 className="stepTitle">Processing By Recipient</h4>
        </div>
        <div className={`step ${statusClass(4)}`}>
          <div className="stepIconWrap">
            <div className="stepIcon">
              <TiTick />
            </div>
          </div>
          <h4 className="stepTitle">Sent to Department</h4>
        </div>
      </div>
    </div>
  );
};

export default TrackApplication;
