"use client";

import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { RequestContext } from "./RequestContext";
import { useRouter } from "next/navigation";
import { IStoreRequest, Item, ItemStatus, RequestStatus } from "../types/types";
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
  const [wrongItemScanned, setWrongItemScanned] = useState(false);

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

    setOrdersBeingPicked((prev: IStoreRequest[]) => {
      // find the index of the order that has a sku that needs to be picked
      const index = prev.findIndex((order) => {
        return order.items.some(
          (item) =>
            item.sku === prontoSku && item.quantityPicked < item.quantity,
        );
      });

      // handle no sku found
      if (index === -1) {
        setWrongItemScanned(true);
        return prev;
      }

      setWrongItemScanned(false);
      setScanValue("");
      setSubmitAttempted(false);

      // find the index of the item to update
      const itemIndex = prev[index].items.findIndex(
        (item) => item.sku === prontoSku && item.quantityPicked < item.quantity,
      );
      // update the items
      const updatedItems = prev[index].items.map((item, index) => {
        if (index === itemIndex) {
          return {
            ...item,
            quantityPicked: (Number(item.quantityPicked) + 1).toString(),
            itemStatus: (item.quantityPicked === item.quantity
              ? "fully picked"
              : "new") as ItemStatus,
          };
        } else {
          return item;
        }
      });

      // create a new order with updated scan count
      const updatedOrder = {
        ...prev[index],
        items: updatedItems,
        status: "new" as RequestStatus,
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
    setSubmitAttempted(true);
    e.preventDefault();

    const isALlPickingDone = ordersBeingPicked.every((order) => {
      return (
        order.status === "issue picking" ||
        order.items.every((item) => item.quantity === item.quantityPicked)
      );
    });

    // logic here to handle not ready

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
        `${resultObject.modifiedCount} of ${ordersBeingPicked.length} orders updated successfully. Navigating to pick and dispatch page...`,
      );
      setSubmitAttempted(false);
      setTimeout(() => router.push("/pick-and-dispatch"), 4000);
    }
  }

  function handleIncrementPress(
    orderIndex: number,
    sku: string,
    itemIndex: number,
  ) {
    setOrdersBeingPicked((prev) => {
      // update the items
      const updatedItems = prev[orderIndex].items.map((item, index) => {
        if (
          index === itemIndex &&
          item.sku === sku &&
          item.quantityPicked < item.quantity
        ) {
          return {
            ...item,
            quantityPicked: (Number(item.quantityPicked) + 1).toString(),
            itemStatus: (Number(item.quantityPicked + 1).toString() ===
            item.quantity
              ? "fully picked"
              : item.itemStatus) as ItemStatus,
          };
        } else {
          return item;
        }
      });

      const orderStatus = updatedItems.every(
        (item) => item.itemStatus === "fully picked",
      )
        ? "ready to post"
        : "issue picking";

      // create a new order with updated scan number
      const updatedOrder = {
        ...prev[orderIndex],
        items: updatedItems,
        status: orderStatus as RequestStatus,
      };

      const updatedState = [
        ...prev.slice(0, orderIndex),
        updatedOrder,
        ...prev.slice(orderIndex + 1),
      ];

      return updatedState;
    });
    // Focus the scan input element when the button is clicked
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setSubmitAttempted(false);
  }

  function handleDecrementPress(
    orderIndex: number,
    sku: string,
    itemIndex: number,
  ) {
    setOrdersBeingPicked((prev) => {
      // update the items
      const updatedItems: Item[] = prev[orderIndex].items.map((item, index) => {
        if (
          index === itemIndex &&
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
        ...prev[orderIndex],
        items: updatedItems,
      };

      const updatedState = [
        ...prev.slice(0, orderIndex),
        updatedOrder,
        ...prev.slice(orderIndex + 1),
      ];

      return updatedState;
    });
    // Focus the scan input element when the button is clicked
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setSubmitAttempted(false);
  }

  function handleItemUnavaliablePress(
    orderIndex: number,
    sku: string,
    itemIndex: number,
  ) {
    setOrdersBeingPicked((prev) => {
      // update the items
      const updatedItems: Item[] = prev[orderIndex].items.map((item) => {
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
        ...prev[orderIndex],
        items: updatedItems,
        status: "issue picking",
      };

      const updatedState = [
        ...prev.slice(0, orderIndex),
        updatedOrder,
        ...prev.slice(orderIndex + 1),
      ];
      return updatedState;
    });
    // Focus the scan input element when the button is clicked
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setSubmitAttempted(false);
  }

  function handleClearPress() {
    setScanValue("");
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
        <button type="button" onClick={handleClearPress}>
          Clear
        </button>
        {wrongItemScanned ? (
          <p className="bg-red-400">wrong item scanned</p>
        ) : null}
      </form>
      <form onSubmit={(e) => handlePickingComplete(e)} noValidate>
        <h2>Items to pick</h2>
        {ordersBeingPicked && ordersBeingPicked.length
          ? ordersBeingPicked.map((request, orderIndex) => (
              <div key={request._id}>
                <ul>
                  {request.items.map((item, itemIndex) => (
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
                          onClick={() =>
                            handleIncrementPress(
                              orderIndex,
                              item.sku,
                              itemIndex,
                            )
                          }
                        >
                          Manually increment scan
                        </button>
                        <button
                          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                          type="button"
                          onClick={() =>
                            handleDecrementPress(
                              orderIndex,
                              item.sku,
                              itemIndex,
                            )
                          }
                        >
                          Undo scan
                        </button>
                        {item.quantity !== item.quantityPicked &&
                        item.itemStatus !== "short picked" ? (
                          <button
                            className="rounded bg-orange-300 px-4 py-2 hover:bg-orange-700"
                            type="button"
                            onClick={() =>
                              handleItemUnavaliablePress(
                                orderIndex,
                                item.sku,
                                itemIndex,
                              )
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
