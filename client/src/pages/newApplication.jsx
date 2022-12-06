import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { TailSpin } from "react-loader-spinner";
import FileInput from "../components/applications/FileInput";
import MessageInput from "../components/applications/MessageInput";
import { useAppContext } from "../context/AppContext";
import * as ACTIONS from "../context/actions"

const SearchDropdown = ({
  staffs,
  setNewApplication,
  newApplication,
  handleFieldChange,
}) => {
  const handleSelect = (staff) => {
    setNewApplication({
      ...newApplication,
      recipient: {
        name: staff.fullname,
        email: staff.email,
        staffId: staff._id,
        role: staff.role,
      },
    });
    handleFieldChange("search", "");
  };
  return (
    <div className="bg-white z-50 mt-1 cursor-pointer h-fit w-1/2 px-6 py-4 shadow-md rounded absolute top-full right-1/2 ">
      {staffs.map((staff) => (
        <div
          key={staff._id}
          className="hover:bg-gray-50 py-2 px-3"
          onClick={() => handleSelect(staff)}
        >
          <div className="flex justify-between">
            <span className="font-semibold">{staff.fullname}</span>
            <span>{staff.course}</span>
          </div>
          <span>{staff.department}</span>
        </div>
      ))}
    </div>
  );
};

const init = {
  recipient: null,
  title: "",
  message: "",
  attachments: [],
};

const NewApplication = () => {
  const {
    search,
    staffs,
    getStaffs,
    isLoading,
    sendNewApplication,
    handleFieldChange,
    dispatch
  } = useAppContext();
  const [newApplication, setNewApplication] = useState(init);
  const [docFiles, setDocFiles] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await getStaffs();
    };

    if (!isLoading) {
      getData();
    }
  }, [search]);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewApplication({ ...newApplication, [name]: value });
  };

  const handleFileChange = (e) => {
    setDocFiles([...docFiles, e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.FETCH_START });

    const { recipient, title, message } = newApplication;

    if (!recipient || !title || !message || docFiles.length === 0) {
      dispatch({ type: ACTIONS.FETCH_STOP });
      return alert("Please Enter all Fields!");
    }

    try {
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
      await sendNewApplication({
        ...newApplication,
        attachments: JSON.stringify(docUrls),
      });

      alert("Application Sent");

      setNewApplication(init);
      setDocFiles([]);
    } catch (error) {
      console.error(error);
    }
  };

  const clearRecipient = () => {
    setNewApplication({ ...newApplication, recipient: null });
  };

  return (
    <div className="px-2 md:px-16 lg:px-52">
      <h2 className="text-xl font-semibold text-gray-600 mb-4">New Message</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex mb-4 relative gap-4 items-center py-2 px-3 rounded bg-white">
          <label className="font-semibold text-gray-500">To:</label>
          <div className="flex items-center gap-4 w-full">
            <input
              type="text"
              name="recipient"
              value={newApplication.recipient?.name || search}
              onChange={(e) => handleFieldChange("search", e.target.value)}
              placeholder="Application Recepient"
              className="py-2 px-4 w-full border-4 border-transparent placeholder-gray-400 focus:outline-transparent ring-0 rounded-lg focus:border-transparent focus:ring-transparent"
            />
            {newApplication.recipient && (
              <button
                onClick={clearRecipient}
                className="cursor-pointer text-rose-700 hover:bg-gray-100 rounded-full p-2"
              >
                <IoMdClose size={24} />
              </button>
            )}
          </div>

          {search && staffs && (
            <SearchDropdown
              handleFieldChange={handleFieldChange}
              newApplication={newApplication}
              staffs={staffs}
              setNewApplication={setNewApplication}
            />
          )}
        </div>
        <div className="flex gap-4 items-center py-2 px-3 rounded bg-white">
          <label className="font-semibold text-gray-500">Title:</label>
          <input
            name="title"
            value={newApplication.title}
            onChange={handleInputChange}
            type="text"
            placeholder="Application Title"
            className="py-2 px-4 w-full border-4 border-transparent placeholder-gray-400 focus:bg-gray-50 rounded-lg"
          />
        </div>
        <MessageInput
          handleInputChange={handleInputChange}
          newApplication={newApplication}
        />
        <div className="flex bg-white rounded flex-col gap-4 p-2">
          <FileInput docFiles={docFiles} handleFileChange={handleFileChange} />

          <button
            onClick={() => handleApproval(selected._id)}
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl flex items-center gap-3 self-end w-fit disabled:bg-purple-200"
          >
            Send
            {isLoading && <TailSpin height="20" width="20" />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewApplication;
