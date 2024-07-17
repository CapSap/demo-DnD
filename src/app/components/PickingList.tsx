"use client";

import { FormEvent, useContext, useState } from "react";
import { RequestContext } from "./RequestContext";
import { useRouter } from "next/navigation";

export default function PickingList() {
  const [picking, setPicking] = useContext(RequestContext);
  const [ordersBeingPicked, setOrdersBeingPicked] = useState(picking);
  const [scanValue, setScanValue] = useState("");

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const router = useRouter();

  function handleScan(e) {
    e.preventDefault();
    console.log(scanValue);

    setOrdersBeingPicked((prev) => {
      // find the index of the order that has a sku that needs to be picked
      const index = prev.findIndex((order) => {
      return order.items.some(
          (item) =>
            item.sku === scanValue && item.quantityPicked < item.quantity,
      );
    });

      // handle no sku found
      if (index === -1) {
        return prev;
      }

      // update the items
      const updatedItems = prev[index].items.map((item) => {
        if (item.sku === scanValue && item.quantityPicked < item.quantity) {
          return {
            ...item,
            quantityPicked: (Number(item.quantityPicked) + 1).toString(),
          };
        } else {
          return item;
        }
      });
      // create a new order with updated scan number
      const updatedOrder = { ...prev[index], items: updatedItems };

      const updatedState = [
        ...prev.slice(0, index),
        updatedOrder,
        ...prev.slice(index + 1),
      ];
      return updatedState;
    });
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

    const isAllPicked = ordersBeingPicked?.every((request) =>
      request.items.every((item) => item.isPicked),
    );

    console.log("result of all picked", isAllPicked);

    if (isAllPicked) {
      setPicking(ordersBeingPicked);
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
        <h2>Items to pick</h2>
        {ordersBeingPicked && ordersBeingPicked.length
          ? ordersBeingPicked.map((request) => (
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
                      <p>Qty scanned: {item.quantityPicked}</p>
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
          : "no items to pick"}
        <button type="submit">Apply pick list</button>
      </form>
    </div>
  );
}
