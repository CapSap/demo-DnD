import { useState } from "react";

const ConfirmButton = ({ onConfirm }) => {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (confirming) {
      onConfirm();
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  const handleCancel = () => {
    setConfirming(false);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="rounded bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
      >
        {confirming ? "Are you sure?" : "Click Me"}
      </button>
      {confirming && (
        <button
          onClick={handleCancel}
          className="ml-2 rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default ConfirmButton;
