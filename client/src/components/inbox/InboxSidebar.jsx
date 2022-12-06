import { formatDistance } from "date-fns";
import React, { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useAppContext } from "../../context/AppContext";

const InboxSidebar = ({ setSelected }) => {
  const {
    applicationsToUser,
    handleFieldChange,
    searchApplication,
    user,
  } = useAppContext();
  

  return (
    <section className="flex flex-col pt-3 w-4/12 bg-gray-50 h-full">
      <div>
        <label className="px-3 mb-4 flex">
          <input
            value={searchApplication}
            onChange={(e) =>
              handleFieldChange("searchApplication", e.target.value)
            }
            className="rounded-lg p-2  bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 w-full "
            placeholder="Search Applications..."
          />
        </label>
        {applicationsToUser ? (
          <>
            {applicationsToUser.length === 0 ? (
              <p className="text-lg text-gray-500 text-center p-4">
                No Application Yet
              </p>
            ) : (
              applicationsToUser.map((application) => (
                <div
                  key={application._id}
                  onClick={() =>
                    setSelected("selectedPendingApplication", application)
                  }
                  className="cursor-pointer py-3 border-b px-2 transition hover:bg-indigo-100"
                >
                  <div className="flex justify-between gap-2 items-center mb-1">
                    <h3 className="text-sm font-semibold">
                      {application.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {formatDistance(
                        new Date(application.createdAt),
                        new Date(),
                        {
                          addSuffix: true,
                        }
                      )}
                    </p>
                  </div>
                  <div className="text-sm italic text-gray-400">
                    {user.role === "student"
                      ? `Sent to: ${application.recipient.name}`
                      : `Sent by: ${application.sender.name}`}
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          <TailSpin />
        )}
      </div>
    </section>
  );
};

export default InboxSidebar;
