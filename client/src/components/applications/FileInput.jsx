import React from "react";
import { IoMdAttach } from "react-icons/io";

const FileInput = ({ docFiles, handleFileChange }) => {
  return (
    <div>
      {docFiles?.length > 0 && (
        <div className="my-4 w-full flex flex-col">
          {docFiles?.map((file, index) => (
            <span
              className="w-full bg-gray-50 px-3 py-2 text-sm text-blue-700 mb-2"
              key={index}
            >
              {file[0].name}
            </span>
          ))}
        </div>
      )}

      <div className="flex text-sm text-gray-600 px-2">
        <label
          htmlFor="document"
          className=" flex gap-2 items-center relative cursor-pointer text-sm rounded-md bg-white font-medium text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 hover:text-indigo-500"
        >
          <IoMdAttach size={25} />
          <span>Attach PDF files</span>
          <input
            id="document"
            name="document"
            type="file"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
};

export default FileInput;
