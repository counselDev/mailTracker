import React from "react";
import { TailSpin } from "react-loader-spinner";
import { useAppContext } from "../context/AppContext";
import { FiMail } from "react-icons/fi";
import { formatDistance } from "date-fns";
import { useNavigate } from "react-router-dom";

const Summary = () => {
  const { studentsApplication, handleFieldChange, path } = useAppContext();

  const navigate = useNavigate();

  const handleSelect = (application) => {
    handleFieldChange("selectedApplication", application);
    navigate(`/${path}/applications`);
  };

  return (
    <div className="col-span-1 bg-white shadow h-fit rounded-lg">
      <div className="flex items-center justify-between px-6 py-5 font-semibold border-b border-gray-100">
        <span>Top Latest Applications</span>
      </div>
      {studentsApplication ? (
        studentsApplication.length > 0 ? (
          <div className="overflow-y-auto h-fit w-full">
            <ul className="py-4 px-2 space-y-3">
              {studentsApplication.slice(0, 3).map((application) => (
                <li
                  key={application._id}
                  onClick={() => handleSelect(application)}
                  className="hover:bg-gray-50 p-2 cursor-pointer flex gap-3 items-center"
                >
                  <div className="h-10 w-10 mr-2 flex items-center justify-center text-purple-500 bg-gray-100 rounded-full overflow-hidden">
                    <FiMail size={23} />
                  </div>
                  <div>
                    <span className="inline-block text-gray-600  text-sm">
                      {application.title}
                    </span>
                    <span className="inline-block capitalize text-xs text-rose-300 ">
                      {application.status}
                    </span>
                  </div>
                  <span className="ml-auto text-xs">
                    {formatDistance(
                      new Date(application.createdAt),
                      new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
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

export default Summary;
