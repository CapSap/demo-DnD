"use client";

import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { RequestContext } from "./RequestContext";
import { useRouter } from "next/navigation";
import { IStoreRequest, Item } from "../types/types";
import { data as barcodeData } from "../utils/data";

export default function PickingList({
  updateManyStoreRequests,
}: {
  updateManyStoreRequests: (request: string) => Promise<string>;
}) {
  const [picking, setPicking] = useContext(RequestContext);
  const [ordersBeingPicked, setOrdersBeingPicked] = useState<IStoreRequest[]>(
    [],
  );
  const [scanValue, setScanValue] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [wrong, setWrong] = useState(false);

  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOrdersBeingPicked(picking);
  }, [picking]);

  const router = useRouter();

  function findProntoSku(barcode: string): string {
    console.time("find pronto sku");

    const index = barcodeData.findIndex((item) => item.code === scanValue);

    if (index !== -1) {
      console.timeEnd("find pronto sku");

      return barcodeData[index].sku;
    } else {
      console.timeEnd("find pronto sku");

      return barcode;
    }
  }

  function handleScan(e: FormEvent) {
    e.preventDefault();
    const prontoSku = findProntoSku(scanValue);

    setOrdersBeingPicked((prev) => {
      // find the index of the order that has a sku that needs to be picked
      const index = prev.findIndex((order) => {
        return order.items.some(
          (item) =>
            item.sku === prontoSku && item.quantityPicked < item.quantity,
        );
      });

      // handle no sku found
      if (index === -1) {
        setWrong(true);
        return prev;
      }

      setWrong(false);
      setScanValue("");
      setSubmitAttempted(false);

      // update the items
      const updatedItems = prev[index].items.map((item) => {
        if (item.sku === prontoSku && item.quantityPicked < item.quantity) {
          return {
            ...item,
            quantityPicked: (Number(item.quantityPicked) + 1).toString(),
            itemStatus:
              item.quantityPicked === item.quantity
                ? "fully picked"
                : item.itemStatus,
          };
        } else {
          return item;
        }
      });
      // create a new order with updated scan count
      const updatedOrder = {
        ...prev[index],
        items: updatedItems,
      };

      const updatedState = [
        ...prev.slice(0, index),
        updatedOrder,
        ...prev.slice(index + 1),
      ];
      return updatedState;
    });
  }

  async function handlePickingComplete(e: FormEvent) {
    console.log("apply pick list clicked");
    setSubmitAttempted(true);
    e.preventDefault();

    const isALlPickingDone = ordersBeingPicked.every((order) => {
      return (
        order.status === "issue picking" ||
        order.items.every((item) => item.quantity === item.quantityPicked)
      );
    });

    // logic here to handle not ready
    console.log(isALlPickingDone);

    if (isALlPickingDone) {
      // update fully fufilled requests
      const ordersWithFinalStatusUpdate = ordersBeingPicked.map((order) => {
        if (order.status === "issue picking") {
          return order;
        } else {
          return { ...order, status: "ready to post" };
        }
      });

      const payload = JSON.stringify(ordersWithFinalStatusUpdate);
      const result = await updateManyStoreRequests(payload);
      const resultObject = JSON.parse(result);

      if ("error" in resultObject) {
        setMessage(resultObject.error.message);
        setSubmitAttempted(false);
      }
      // if no error set message, pause and then navigate to dashboard
      setMessage(
        `${resultObject.modifiedCount} of ${ordersBeingPicked.length} orders updated successfully. Navigating to dashboard...`,
      );
      setSubmitAttempted(false);
      setTimeout(() => router.push("/dashboard"), 4000);
    }
  }

  function handleIncrementPress(index: number, sku: string) {
    setOrdersBeingPicked((prev) => {
      // update the items
      const updatedItems = prev[index].items.map((item) => {
        if (item.sku === sku && item.quantityPicked < item.quantity) {
          return {
            ...item,
            quantityPicked: (Number(item.quantityPicked) + 1).toString(),
            itemStatus:
              item.quantityPicked === item.quantity
                ? "fully picked"
                : item.itemStatus,
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
    setSubmitAttempted(false);
  }

  function handleDecrementPress(index: number, sku: string) {
    setOrdersBeingPicked((prev) => {
      // update the items
      const updatedItems: Item[] = prev[index].items.map((item) => {
        if (
          item.sku === sku &&
          item.quantityPicked <= item.quantity &&
          Number(item.quantityPicked) > 0
        ) {
          console.log(item.itemStatus);
          return {
            ...item,
            quantityPicked: (Number(item.quantityPicked) - 1).toString(),
            itemStatus: "new",
          };
        } else {
          return item;
        }
      });
      // create a new order with updated scan number
      const updatedOrder = {
        ...prev[index],
        items: updatedItems,
      };

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
    setSubmitAttempted(false);
  }

  function handleItemUnavaliablePress(index: number, sku: string) {
    // mark the item requested as unavaliable so that the?
    setOrdersBeingPicked((prev) => {
      // update the items
      const updatedItems: Item[] = prev[index].items.map((item) => {
        if (item.sku === sku) {
          console.log(item.itemStatus);
          return {
            ...item,
            itemStatus: "short picked",
          };
        } else {
          return item;
        }
      });
      // create a new order with updated scan number
      const updatedOrder: IStoreRequest = {
        ...prev[index],
        items: updatedItems,
        status: "issue picking",
      };

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
    setSubmitAttempted(false);
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
        {wrong ? <p className="bg-red-400">wrong item scanned</p> : null}
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
                      className={`m-2 flex min-w-72 justify-between border-2 border-slate-400 p-4 ${
                        submitAttempted &&
                        item.itemStatus !== "short picked" &&
                        item.quantityPicked !== item.quantity
                          ? "border-2 border-red-400 font-bold"
                          : ""
                      }`}
                    >
                      <div className="border-2">
                        <p>Desc: {item.description}</p>
                        <p>Qty: {item.quantity}</p>
                        <p>Sku: {item.sku}</p>
                        <p>Qty scanned: {item.quantityPicked}</p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <button
                          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                          type="button"
                          onClick={() => handleIncrementPress(index, item.sku)}
                        >
                          Manually increment scan
                        </button>
                        <button
                          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                          type="button"
                          onClick={() => handleDecrementPress(index, item.sku)}
                        >
                          Undo scan
                        </button>
                        {item.quantity !== item.quantityPicked &&
                        item.itemStatus !== "short picked" ? (
                          <button
                            className="rounded bg-orange-300 px-4 py-2 hover:bg-orange-700"
                            type="button"
                            onClick={() =>
                              handleItemUnavaliablePress(index, item.sku)
                            }
                          >
                            Mark{" "}
                            {Number(item.quantity) -
                              Number(item.quantityPicked)}{" "}
                            items as not avaliable
                          </button>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          : "no items to pick"}

        <button type="submit">Apply pick list</button>
      </form>

      <div>{submitAttempted ? "Sending Request..." : message}</div>
    </div>
  );
}
