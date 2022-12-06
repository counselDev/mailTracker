import React from "react";
import Cards from "../components/Cards";
import AdminTop from "../components/AdminTop";
import ReportChart from "../components/ReportChart";
import Summary from "../components/Summary";

const StaffDashboard = () => {
  return (
    <div className="flex-grow text-gray-800">
      <main className="p-6 sm:p-10 space-y-6">
        <AdminTop />
        <Cards  />

        <section className="grid md:grid-cols-3 gap-6">
          <ReportChart />
          <Summary />
        </section>
      </main>
    </div>
  );
};

export default StaffDashboard;
