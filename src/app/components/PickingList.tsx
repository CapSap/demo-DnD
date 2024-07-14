"use client";

import { FormEvent, useContext, useState } from "react";
import { RequestContext } from "./RequestContext";
import { useRouter } from "next/navigation";

export default function PickingList() {
  const [picking, setPicking] = useContext(RequestContext);
  const [orderBeingPicked, setOrdersBeingPicked] = useState(picking);
  const [scanValue, setScanValue] = useState("");

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const router = useRouter();

  function handleScan(e) {
    e.preventDefault();
    console.log(scanValue);
    // this func will accept a scan from user,
    // then check the sku against all not picked orders.
    // so i need to be aware of which skus i need to pick.
    // and when the list has been updated
  }

  function handleChange(e, itemID, pickedOrder) {
    const newContext = picking.map((pickedOrder) => {
      if (pickedOrder._id === pickedOrder._id) {
        const newItems = pickedOrder.items.map((item) => {
          if (item._id === itemID) {
            return { ...item, isPicked: e.target.value };
          } else {
            return item;
          }
        });

        return { ...pickedOrder, items: newItems };
      } else return pickedOrder;
    });
    console.log(e.target.value, itemID, pickedOrder);
    setOrdersBeingPicked(newContext);
  }

  function handlePickingComplete(e: FormEvent<HTMLFormElement>) {
    console.log("click");
    setSubmitAttempted(true);
    // e.preventDefault();

    const isAllPicked = orderBeingPicked?.every((request) =>
      request.items.every((item) => item.isPicked),
    );

    console.log("result of all picked", isAllPicked);

    if (isAllPicked) {
      setPicking(orderBeingPicked);
      router.push("/dashboard");
    }
  }

  return (
    <div>
      <form onSubmit={(e) => handleScan(e)}>
        <input
          type="text"
          autoFocus
          value={scanValue}
          onChange={(e) => setScanValue(e.target.value)}
        />
      </form>
      <form action={handlePickingComplete} noValidate>
        {picking && picking.length
          ? picking.map((request) => (
              <div key={request._id}>
                <ul>
                  {request.items.map((item) => (
                    <li
                      key={item._id}
                      className="m-2 min-w-72 border-2 border-slate-400 p-4"
                    >
                      <p>Desc: {item.description}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Sku: {item.sku}</p>
                      <p>Qty scanned: 0</p>
                      <div>
                        <select
                          name="isPicked"
                          id="isPicked"
                          required={true}
                          defaultValue={""}
                          onChange={(e) => handleChange(e, item._id, request)}
                          className={
                            submitAttempted
                              ? "invalid:border-2 invalid:border-red-400 invalid:font-bold"
                              : ""
                          }
                        >
                          <option value="" disabled={true}>
                            Please choose an option
                          </option>
                          <option value="true">Picked</option>
                          <option value="false">Not picked</option>
                        </select>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          : "no picking found"}

        <button type="submit">Apply pick list</button>
      </form>
    </div>
  );
}
