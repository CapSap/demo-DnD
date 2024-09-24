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
    <div>
      <div>
        <button
          onClick={handleClick}
          className="rounded bg-orange-500 px-2 py-1 text-sm text-white hover:bg-yellow-700"
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
          <p>The store needs to be aware that we don&apos;t have everything</p>
        </div>
      ) : null}
    </div>
  );
};

export default ConfirmButton;
