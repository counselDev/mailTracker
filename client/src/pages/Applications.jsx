import React, { useEffect } from "react";
import ApplicationDetails from "../components/applications/ApplicationDetails";
import ApplicationSidebar from "../components/applications/ApplicationSidebar";
import { useAppContext } from "../context/AppContext";

const Applications = () => {
  const {
    getStats,
    studentsApplication,
    handleFieldChange,
    selectedApplication,
  } = useAppContext();

  useEffect(() => {
    if (studentsApplication && !selectedApplication) {
      handleFieldChange("selectedApplication", studentsApplication[0]);
    }
  }, [studentsApplication]);
  useEffect(() => {
    const getData = async () => {
      await getStats();
    };

    getData();
  }, []);

  return (
    <main className="flex flex-col sm:flex-row  w-full h-full gap-4 p-2  md:p-6 rounded-xl">
      <ApplicationSidebar setSelected={handleFieldChange} />
      <div className="w-full md:w-9/12">
        <ApplicationDetails selected={selectedApplication} />
      </div>
    </main>
  );
};

export default Applications;
