import React, { useEffect, useState } from "react";
import InboxDetails from "../components/inbox/InboxDetails";
import InboxSidebar from "../components/inbox/InboxSidebar";
import { useAppContext } from "../context/AppContext";

const Pending = () => {
  const {
    applicationsToUser,
    handleFieldChange,
    selectedPendingApplication,
  } = useAppContext();

  useEffect(() => {
    if (applicationsToUser) {
      handleFieldChange("selectedPendingApplication", applicationsToUser[0]);
    }
  }, [applicationsToUser]);

  return (
    <main className="flex  w-full h-full gap-4 p-6 rounded-xl">
      <InboxSidebar setSelected={handleFieldChange} />
      <div className="w-9/12">
        <InboxDetails selected={selectedPendingApplication} />
      </div>
    </main>
  );
};

export default Pending;
