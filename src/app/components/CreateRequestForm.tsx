"use client";

import { useState } from "react";
import { Item } from "../types/types";

export default function CreateRequestForm({
  createStoreRequest,
}: {
  createStoreRequest: (payload: {}) => {};
}) {
  const [requestingStore, setRequestingStore] = useState("default");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  const [message, setMessage] = useState();

  const [loading, setLoading] = useState(false);

  function handleGetMoreItems() {
    setItems((prevState) => {
      return [
        ...prevState,
        {
          sku: "",
          quantity: "",
          description: "",
        },
      ];
    });
  }

  async function handleFormSubmit() {
    setLoading(true);
    const payload = {
      name: name,
      phone: phone,
      requestingStore: requestingStore,
      email: email,
      address: address,
      items: items,
    };

    // console.log(payload);
    const message = await createStoreRequest(payload);

    setMessage(message);

    console.log(message);
    setLoading(false);
  }

  function handleItemChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) {
    setItems((prevState) => {
      const updatedRequest = {
        ...prevState[index],
        [e.target.name]: e.target.value,
      };

      return [
        ...prevState.slice(0, index),
        updatedRequest,
        ...prevState.slice(index + 1),
      ];
    });
  }

  return (
    <div>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
      >
        <div>
          <div>
            <label
              className="inline-block text-gray-800 text-sm sm:text-base mb-2"
              htmlFor="requestingStore"
            >
              Requesting store:
            </label>
            <select
              className=" bg-gray-50 text-gray-800 border focus:ring ring-indigo-300 rounded outline-none transition duration-100 px-3 py-2"
              id={"requestingStore"}
              name="requestingStore"
              key={"requestingStore"}
              value={requestingStore}
              onChange={(e) => {
                setRequestingStore(e.target.value);
              }}
            >
              <option value={"default"} disabled={true}>
                Please choose an option
              </option>

              <option value="213">Canberra - 213</option>
              <option value="416">Fortitude Valley - 416</option>
              <option value="710">Hobart - 710</option>
              <option value="314">Melbourne - 314</option>
              <option value="208">Seven Hills - 208</option>
              <option value="615">Perth - 615</option>
              <option value="319">Ringwood - 319</option>
              <option value="210">Sydney - 210</option>
            </select>
          </div>
          <label htmlFor="customerName">Customer Name</label>
          <input
            type="text"
            name="customerName"
            id="customerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div>
          <label htmlFor="phone">Customer Phone</label>
          <input
            type="text"
            name="customerPhone"
            id="customerPhone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div>
          <label htmlFor="email">Customer Email</label>
          <input
            type="text"
            name="customerEmail"
            id="customerEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div>
          <label htmlFor="address">Customer Address</label>
          <textarea
            name="address"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="resize rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        Item info
        <div className="md:col-span-2 bg-slate-300 flex flex-col justify-center items-center">
          <p>Request more items: </p>
          <button
            type="button"
            onClick={() => handleGetMoreItems()}
            className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3"
          >
            Get more requests
          </button>
        </div>
        {items.map((item, i) => (
          <div key={"item" + i}>
            <div>
              <label htmlFor="quantity">Quantity</label>
              <input
                type="text"
                name="quantity"
                id="quantity"
                value={items[i].quantity}
                onChange={(e) => handleItemChange(e, i)}
                className="rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="sku">SKU</label>
              <input
                type="text"
                name="sku"
                id="sku"
                value={items[i].sku}
                onChange={(e) => handleItemChange(e, i)}
                className="rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label htmlFor="decription">Description</label>
              <input
                type="text"
                name="description"
                id="description"
                value={items[i].description}
                onChange={(e) => handleItemChange(e, i)}
                className="rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        ))}
        <div className="md:col-span-2 flex flex-col justify-center items-center">
          <button
            type="submit"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus-visible:ring ring-indigo-300 text-white text-sm md:text-base font-semibold text-center rounded-lg outline-none transition duration-100 px-8 py-3"
          >
            Submit order/request to store
          </button>
        </div>
        <div>{loading ? "Trying Request..." : message}</div>
      </form>
    </div>
  );
}
