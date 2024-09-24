import { useState } from "react";

const ConfirmButton = ({
  buttonText,
  onConfirm,
}: {
  buttonText: string;
  onConfirm: () => {};
}) => {
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
    <div className="mt-2">
      <div className="">
        <button
          onClick={handleClick}
          className="rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-800 active:bg-red-950"
        >
          {confirming ? "Are you sure?" : buttonText}
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
      {confirming ? (
        <div
          className="mt-1 max-w-sm border-l-4 border-orange-500 bg-orange-100 px-2 py-1 text-orange-700"
          role="alert"
        >
          <p className="font-bold">Have you called the store?</p>
          <p>The store needs to be aware that the request is being cancelled</p>
        </div>
      ) : null}
    </div>
  );
};

export default ConfirmButton;
