import React from "react";

const NoteFooter = ({ note, updateError, updateSuccess }) => (
  <>
    <div className="mt-10 text-center">
      <p className="text-gray-500 text-sm italic">
        Viewing note <span className="font-bold">{note.title}</span>.
      </p>
    </div>
    {updateError && <div className="mt-2 text-red-500 text-center">{updateError}</div>}
    {updateSuccess && <div className="mt-2 text-green-600 text-center">{updateSuccess}</div>}
  </>
);

export default NoteFooter;