import React, { useState } from "react";
import { HiPaperClip } from "react-icons/hi";
import { useAppContext } from "../../context/AppContext";
import TrackApplication from "../trackApplication/TrackApplication";
import FileInput from "../applications/FileInput";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import * as ACTIONS from "../../context/actions"

const InboxDetails = ({ selected }) => {
  const { user, isLoading, updateApplicationState, dispatch } = useAppContext();

  const [docFiles, setDocFiles] = useState([]);

  const handleFileChange = (e) => {
    setDocFiles([...docFiles, e.target.files]);
  };

  const handleDone = async (id) => {
    try {
      dispatch({ type: ACTIONS.FETCH_START });
      if (docFiles.length === 0) {
        dispatch({ type: ACTIONS.FETCH_STOP });
        return alert("Please sign and attach file(s)");
      }
      const docData = new FormData();
      const docUrls = await Promise.all(
        docFiles.map(async (file) => {
          docData.append("upload_preset", "upload");
          docData.append("tags", " mobile_upload Docx");
          docData.append("resource_type", "raw");
          docData.append("file", file[0]);

          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/counselokpabi/raw/upload/",
            docData
          );
          const { url } = uploadRes.data;
          return url;
        })
      );

      const res = await updateApplicationState(id, docUrls);
      alert(res.msg);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAcknoledge = async (id) => {
    try {
      const res = await updateApplicationState(id);
      alert(res.msg);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      {selected ? (
        <>
          {user?.role === "student" && (
            <TrackApplication status={selected.status} />
          )}
          <section className=" px-4 flex flex-col bg-white rounded-lg">
            <div className="flex justify-between items-center h-fit p-8 border-b-2 mb-8">
              <div className="flex space-x-4 items-center">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <img
                    src="https://bit.ly/2KfKgdy"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-lg">
                    {user.role === "student"
                      ? selected.recipient.name
                      : selected.sender.name}
                  </h3>
                  <p className="text-light text-gray-400">
                    {user.role === "student"
                      ? selected.recipient.email
                      : selected.sender.email}
                  </p>
                  {user.role !== "student" && (
                    <p className="text-light text-gray-400">
                      {selected.sender.regNum}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <section>
              <h1 className="font-bold text-2xl">{selected.title}</h1>
              <article className="mt-8 text-gray-500 leading-7 tracking-wider">
                <p>{selected.message}</p>

                <div className="bg-white px-4 py-5 items-center sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-gray-500 leading-7 tracking-wider">
                    Attachments
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <ul
                      role="list"
                      className="divide-y divide-gray-200 rounded-md border border-gray-200"
                    >
                      {selected.attachments.map((item, index) => (
                        <li
                          key={item}
                          className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                        >
                          <div className="flex w-0 flex-1 items-center">
                            <HiPaperClip
                              className="h-5 w-5 flex-shrink-0 text-gray-400"
                              aria-hidden="true"
                            />
                            <span className="ml-2 w-0 flex-1 truncate">
                              {` document${index}.pdf`}
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <a
                              href={item}
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                              Download
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </article>
            </section>
          </section>
        </>
      ) : (
        <p className="text-lg h-full flex items-center justify-center text-gray-500 text-center p-4">
          No Application Selected
        </p>
      )}
      {selected &&
        user.role !== "student" &&
        (selected.status === "HOD_approval" ? (
          <div className="flex bg-white rounded flex-col gap-4 py-2 px-4">
            <button
              onClick={() => handleAcknoledge(selected._id)}
              type="button"
              disabled={isLoading}
              className="bg-purple-600 text-white px-6 py-2 rounded-xl flex items-center gap-3self-end w-fit disabled:bg-purple-200"
            >
              Acknoledge
              {isLoading && <TailSpin height="20" width="20" />}
            </button>
          </div>
        ) : selected.status === "processing" ? (
          <div className="flex bg-white rounded flex-col gap-4 py-2 px-4">
            <FileInput
              docFiles={docFiles}
              handleFileChange={handleFileChange}
            />

            <button
              onClick={() => handleDone(selected._id)}
              type="button"
              disabled={isLoading}
              className="bg-purple-600 gap-3 text-white px-6 py-2 rounded-xl flex items-center self-end w-fit disabled:bg-purple-200"
            >
              Complete and Send
              {isLoading && <TailSpin height="20" width="20" />}
            </button>
          </div>
        ) : (
          <span className="text-purple-600 mt-8 border border-purple-600 bg-white px-6 py-2 rounded-xl flex self-end w-fit">
            Request Completed
          </span>
        ))}
    </div>
  );
};

export default InboxDetails;
