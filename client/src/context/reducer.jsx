import * as ACTIONS from "./actions";
import { initialState } from "./AppContext";

export default function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOGIN:
      return {
        ...state,
        ...action.payload,
      };
    case ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        errorMessage: action.payload.msg,
      };
    case ACTIONS.SET_SUCCESS:
      return {
        ...state,
        successMessage: action.payload.msg,
      };
    case ACTIONS.FETCH_START:
      return {
        ...state,
        isLoading: true,
      };
    case ACTIONS.FETCH_STOP:
      return {
        ...state,
        isLoading: false,
      };
    case ACTIONS.INIT_STATE:
      return {
        ...initialState,
      };

    case ACTIONS.CLEAR_MESSAGE:
      return {
        ...state,
        errorMessage: null,
        successMessage: null,
      };

    case ACTIONS.SET_STATS:
      return {
        ...state,
        currentStats: action.payload.currentStats,
        studentsApplication: action.payload.studentsApplication,
      };
    case ACTIONS.SET_RECIPIENT_MSG:
      return {
        ...state,
        applicationsToUser: action.payload.applicationsToUser,
      };
    case ACTIONS.SET_STAFFS:
      return {
        ...state,
        ...action.payload,
      };
    case ACTIONS.HANDLE_CHANGE:
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };

    default:
      return state;
  }
}
