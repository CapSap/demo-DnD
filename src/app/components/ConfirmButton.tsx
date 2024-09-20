import { useState } from "react";

const ConfirmButton = ({ onConfirm }: { onConfirm: () => {} }) => {
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
        className="rounded bg-orange-500 px-2 py-1 text-sm text-white hover:bg-yellow-700"
      >
        {confirming ? "Are you sure?" : "Redo tracking or ibt"}
      </button>
      {confirming && (
        <button
          onClick={handleCancel}
          className="ml-2 rounded bg-gray-500 px-2 py-1 text-sm text-white hover:bg-gray-700"
        >
          Cancel
        </button>
      )}
    </div>
  );
};

export default ConfirmButton;
