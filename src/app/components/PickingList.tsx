"use client";

import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { IRequestContext, RequestContext } from "./RequestContext";
import { useRouter } from "next/navigation";
import { IStoreRequest } from "../types/types";

export default function PickingList() {
  const [picking, setPicking] = useContext(RequestContext);
  const [ordersBeingPicked, setOrdersBeingPicked] = useState<IRequestContext[]>(
    [],
  );
  const [scanValue, setScanValue] = useState("");

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOrdersBeingPicked(picking);
  }, [picking]);

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

      setScanValue("");

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

  function handlePickingComplete(e: FormEvent) {
    console.log("click");
    setSubmitAttempted(true);
    e.preventDefault();

    /*   const isAllPicked = ordersBeingPicked?.every((request) =>
      request.items.every((item) => item.isPicked),
    );

    console.log("result of all picked", isAllPicked);

    if (isAllPicked) {
      setPicking(ordersBeingPicked);
      router.push("/dashboard");
    } */
  }

  function handleIncrementPress(index: number, sku: string) {
    setOrdersBeingPicked((prev) => {
      // update the items
      const updatedItems = prev[index].items.map((item) => {
        if (item.sku === sku && item.quantityPicked < item.quantity) {
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
    // Focus the scan input element when the button is clicked
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  function handleDecrementPress(index: number, sku: string) {
    setOrdersBeingPicked((prev) => {
      // update the items
      const updatedItems = prev[index].items.map((item) => {
        if (
          item.sku === sku &&
          item.quantityPicked <= item.quantity &&
          Number(item.quantityPicked) > 0
        ) {
          return {
            ...item,
            quantityPicked: (Number(item.quantityPicked) - 1).toString(),
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
    // Focus the scan input element when the button is clicked
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <div>
      <form onSubmit={(e) => handleScan(e)}>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          value={scanValue}
          onChange={(e) => setScanValue(e.target.value)}
        />
      </form>
      <form onSubmit={(e) => handlePickingComplete(e)} noValidate>
        <h2>Items to pick</h2>
        {ordersBeingPicked && ordersBeingPicked.length
          ? ordersBeingPicked.map((request, index) => (
              <div key={request._id}>
                <ul>
                  {request.items.map((item) => (
                    <li
                      key={item._id}
                      className="m-2 flex min-w-72 justify-between border-2 border-slate-400 p-4"
                    >
                      <div className="border-2 border-red-200">
                        <p>Desc: {item.description}</p>
                        <p>Qty: {item.quantity}</p>
                        <p>Sku: {item.sku}</p>
                        <p>Qty scanned: {item.quantityPicked}</p>
                      </div>
                      <div className="border-2 border-green-200">
                        <button
                          type="button"
                          onClick={() => handleIncrementPress(index, item.sku)}
                        >
                          Manually increment scan
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecrementPress(index, item.sku)}
                        >
                          Undo 1 scan
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          : "no items to pick"}

        <h2>Items already picked</h2>
        {ordersBeingPicked && ordersBeingPicked.length
          ? ordersBeingPicked
              .filter((order) => order)
              .map((request) => (
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
          : "no itesm picked"}
        <button type="submit">Apply pick list</button>
      </form>
    </div>
  );
}
