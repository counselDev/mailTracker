import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRedirect from "./routes/UserRedirect";
import SharedLayout from "./components/SharedLayout";
import Applications from "./pages/Applications";
import Landing from "./pages/landing";
import Login from "./pages/Login";
import NewApplication from "./pages/newApplication";
import Register from "./pages/Register";
import StudentsProtectedRoute from "./routes/StudentProtectedRoute";
import StudentDashboard from "./pages/StudentDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import StaffsProtectedRoute from "./routes/StaffProtectedRoute";
import { useAppContext } from "./context/AppContext";
import { useEffect } from "react";
import Inbox from "./pages/Inbox";
import MobileNav from "./components/sidebar/MobileNav";
import RegisterStaff from "./pages/RegisterStaff";

function App() {
  const { user, handleFieldChange, getApplicationToUser } = useAppContext();

  useEffect(() => {
    if (user && user.role !=="HOD") {
      handleFieldChange("path", user.role + "s");
    }else if (user && user.role ==="HOD"){
      handleFieldChange("path", "lecturers");
    }
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      await getApplicationToUser();
    };

    if (user && user.role !== "student") {
      getData();
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/students"
          element={
            <StudentsProtectedRoute>
              <SharedLayout />
            </StudentsProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="mobile-nav" element={<MobileNav />} />
          <Route path="new" element={<NewApplication />} />
        </Route>
        <Route
          path="/lecturers"
          element={
            <StaffsProtectedRoute>
              <SharedLayout />
            </StaffsProtectedRoute>
          }
        >
          <Route index element={<StaffDashboard />} />
          <Route path="applications" element={<Applications />} />
          <Route path="mobile-nav" element={<MobileNav />} />
          <Route path="inbox" element={<Inbox />} />
        </Route>

        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <UserRedirect>
              <Login />
            </UserRedirect>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/register/staff" element={<RegisterStaff />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
