import React from "react";
import { IoMdAttach } from "react-icons/io";
import FileInput from "./FileInput";

const MessageInput = ({ handleInputChange, newApplication }) => {
  return (
    <section className="mt-6 border mb-3 p-4 flex flex-col bg-white rounded-lg">
      <textarea
        className="w-full bg-gray-50 p-2 rounded-xl"
        placeholder="Type your reply here..."
        rows="3"
        value={newApplication?.message}
        name="message"
        onChange={handleInputChange}
      ></textarea>
    </section>
  );
};

export default MessageInput;
