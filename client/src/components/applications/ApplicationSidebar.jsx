import { formatDistance } from "date-fns";
import React, { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useAppContext } from "../../context/AppContext";

const InboxSidebar = ({ setSelected }) => {
  const {
    studentsApplication,
    handleFieldChange,
    searchApplication,
    getStats,
    user,
    selectedApplication,
  } = useAppContext();

  useEffect(() => {
    const getData = async () => {
      await getStats();
    };

    getData();
  }, [searchApplication]);

  return (
    <section className="flex flex-col pt-3 w-full md:w-4/12 bg-gray-50 h-full">
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
        {studentsApplication ? (
          <>
            {studentsApplication.length === 0 ? (
              <p className="text-lg text-gray-500 text-center p-4">
                No Application Yet
              </p>
            ) : (
              studentsApplication.map((application) => (
                <div
                  key={application._id}
                  style={
                    selectedApplication?._id === application._id
                      ? {
                          borderLeft: " 3px solid #9333ea",
                        }
                      : null
                  }
                  onClick={() =>
                    setSelected("selectedApplication", application)
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
                    {user.role !== "student" &&
                      `From: ${application.sender.name}`}
                  </div>
                  <div className="text-sm italic text-gray-400">
                    {`To: ${application.recipient.name}`}
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
