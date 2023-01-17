import axios from "axios";
import { useContext, createContext, useReducer } from "react";
import reducer from "./reducer";
import * as ACTIONS from "./actions";

const AppContext = createContext();

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

export const useAppContext = () => {
  return useContext(AppContext);
};

export const initialState = {
  user: user || null,
  token: token || null,
  currentStats: null,
  studentsApplication: null,
  applicationsToUser: null,
  staffs: null,
  totalStaffs: null,
  numOfPages: 1,
  search: "",
  searchApplication: "",
  isLoading: false,
  successMessage: "",
  errorMessage: "",
  selectedApplication: null,
  selectedPendingApplication: null,
  path: "",
  whoIsLogging: "student",
  showMobileNav: false,
};

const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //Instance Setup
  const authFetch = axios.create({
    baseURL: "/api",
  });

  //request Interceptor
  authFetch.interceptors.request.use(
    (config) => {
      dispatch({ type: ACTIONS.FETCH_START });
      config.headers.Authorization = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      dispatch({ type: ACTIONS.FETCH_STOP });
      return Promise.reject(error);
    }
  );

  authFetch.interceptors.response.use(
    (response) => {
      dispatch({ type: ACTIONS.FETCH_STOP });
      return response;
    },
    (error) => {
      dispatch({ type: ACTIONS.FETCH_STOP });
      const err = error.response;
      // console.log(err);

      if (err.status === 401 || err.status === 500) {
        // logout();
        dispatch({ type: ACTIONS.INIT_STATE });
      }
      return Promise.reject(error);
    }
  );

  const addUserToLocalStorage = ({ user, token }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  const login = async (payload) => {
    try {
      dispatch({ type: ACTIONS.FETCH_START });
      const res = await axios.post(
        `/api/auth/login?${state.whoIsLogging}=1`,
        payload
      );
      const { student, token, staff } = res.data;

      dispatch({
        type: ACTIONS.LOGIN,
        payload: {
          user: student || staff,
          token,
        },
      });

      addUserToLocalStorage({ user: student || staff, token });
      dispatch({ type: ACTIONS.FETCH_STOP });
      return student;
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_STOP });
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const register = async (payload) => {
    try {
      dispatch({ type: ACTIONS.FETCH_START });
      const res = await axios.post(
        `/api/auth/register?${state.whoIsLogging}=1`,
        payload
      );
      const { staff } = res.data;

      dispatch({ type: ACTIONS.FETCH_STOP });
      return staff;
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_STOP });
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const registerStudent = async (payload) => {
    try {
      dispatch({ type: ACTIONS.FETCH_START });
      const res = await axios.post(`/api/students/`, payload);
      const { student } = res.data;

      dispatch({ type: ACTIONS.FETCH_STOP });
      return student;
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_STOP });
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const fetchStats = async (url) => {
    const { searchApplication } = state;

    if (searchApplication) {
      url += `?search=${searchApplication}`;
    }
    const res = await authFetch.get(url);
    const { currentStats, studentsApplication } = res.data;
    dispatch({
      type: ACTIONS.SET_STATS,
      payload: {
        currentStats,
        studentsApplication,
      },
    });
  };

  const getStats = async () => {
    try {
      dispatch({ type: ACTIONS.FETCH_START });
      const { user } = state;
      if (user.role === "student") {
        let url = "/applications/student/";
        await fetchStats(url);
      } else if (user.role === "lecturer") {
        let url = "/applications/lecturer/";
        await fetchStats(url);
      } else if (user.role === "HOD") {
        let url = "/applications/hod/";
        await fetchStats(url);
      }

      dispatch({ type: ACTIONS.FETCH_STOP });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_STOP });

      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const getStaffs = async () => {
    try {
      dispatch({ type: ACTIONS.FETCH_START });
      const { search } = state;
      let url = `/staffs`;
      if (search) {
        url += `?search=${search}`;
      }

      const res = await authFetch.get(url);

      dispatch({
        type: ACTIONS.SET_STAFFS,
        payload: {
          ...res.data,
        },
      });

      dispatch({ type: ACTIONS.FETCH_STOP });
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_STOP });

      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const getApplicationToUser = async () => {
    try {
      dispatch({ type: ACTIONS.FETCH_START });

      const res = await authFetch.get("/applications/recipient");
      dispatch({
        type: ACTIONS.SET_RECIPIENT_MSG,
        payload: { applicationsToUser: res.data },
      });

      dispatch({ type: ACTIONS.FETCH_STOP });
      setMessage("Application sent succesfully");
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_STOP });

      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const sendNewApplication = async (payload) => {
    try {
      dispatch({ type: ACTIONS.FETCH_START });

      const res = await authFetch.post("/applications", payload);
      await getStats();

      dispatch({ type: ACTIONS.FETCH_STOP });
      setMessage("Application sent succesfully");
      return res.data;
    } catch (error) {
      dispatch({ type: ACTIONS.FETCH_STOP });

      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const handleFieldChange = (field, value) => {
    dispatch({ type: ACTIONS.HANDLE_CHANGE, payload: { field, value } });
  };

  const updateApplicationState = async (id, attachment) => {
    try {
      dispatch({ type: ACTIONS.FETCH_START });

      const res = await authFetch.patch(`/applications/${id}`, {
        attachment: JSON.stringify(attachment),
      });
      await getStats();
      await getApplicationToUser();

      dispatch({ type: ACTIONS.FETCH_STOP });
      return res.data;
    } catch (error) {
      dispatch({
        type: ACTIONS.SET_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
  };

  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
    removeUserFromLocalStorage();
  };
  const clearMessage = () => {
    dispatch({ type: ACTIONS.CLEAR_MESSAGE });
  };

  const setMessage = (msg) => {
    console.log(msg, "msg");

    dispatch({
      type: ACTIONS.SET_SUCCESS,
      payload: { successMessage: msg },
    });

    setTimeout(() => {
      clearMessage();
    }, 5000);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        dispatch,
        login,
        register,
        registerStudent,
        getStats,
        logout,
        getStaffs,
        handleFieldChange,
        sendNewApplication,
        clearMessage,
        getApplicationToUser,
        updateApplicationState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
