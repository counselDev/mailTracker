import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { AiOutlineSend } from "react-icons/ai";

const Sidebar = () => {
  const [active, setActive] = useState(0);

  const { path, user, logout } = useAppContext();

  return (
    <aside className="hidden h-full sm:flex sm:flex-col">
      <Link
        to="#"
        className="inline-flex items-center font-semibold text-lg text-white justify-center h-20 bg-purple-600 hover:bg-purple-500 focus:bg-purple-500"
      >
        Application Tracker
      </Link>
      <div className="flex-grow flex flex-col justify-between text-gray-500 bg-gray-800">
        <nav className="flex flex-col mx-3 my-6 space-y-4">
          <Link
            to={`/${path}`}
            onClick={() => setActive(0)}
            style={
              active === 0
                ? { color: "#9333ea", backgroundColor: "white" }
                : null
            }
            className="inline-flex items-center gap-4 px-4 py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
          >
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="">Dashboard</span>
          </Link>
          <Link
            to={`/${path}/applications`}
            onClick={() => setActive(1)}
            style={
              active === 1
                ? { color: "#9333ea", backgroundColor: "white" }
                : null
            }
            className="inline-flex items-center gap-4 px-4 py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
          >
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="">Applications</span>
          </Link>

          {user?.role === "student" && (
            <Link
              to={`/${path}/new`}
              onClick={() => setActive(2)}
              style={
                active === 2
                  ? { color: "#9333ea", backgroundColor: "white" }
                  : null
              }
              className="inline-flex items-center gap-4 px-4 py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
            >
              <svg
                aria-hidden="true"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="">New Application</span>
            </Link>
          )}

          {(user.role === "lecturer" || user.role === "HOD"  )&& (
            <Link
              to={`/${path}/inbox`}
              onClick={() => setActive(4)}
              style={
                active === 4
                  ? { color: "#9333ea", backgroundColor: "white" }
                  : null
              }
              className="inline-flex items-center gap-4 px-4 py-3 hover:text-gray-400 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg"
            >
              <AiOutlineSend size={24} />
              <span className="">Inbox</span>
            </Link>
          )}
        </nav>

        <div
          onClick={logout}
          className="inline-flex items-center px-4 h-20 border-t border-gray-700"
        >
          <button className="p-3  hover:text-gray-400 flex gap-4 hover:bg-gray-700 focus:text-gray-400 focus:bg-gray-700 rounded-lg">
            <svg
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
