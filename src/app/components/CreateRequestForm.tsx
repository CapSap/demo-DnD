"use client";

import { useEffect, useRef, useState } from "react";
import { Item, IPartialStoreRequest, PartialItem } from "../types/types";
import StockChecker from "./StockChecker";

export default function CreateRequestForm({
  createStoreRequest,
}: {
  createStoreRequest: (request: IPartialStoreRequest) => Promise<string>;
}) {
  const selectInput = useRef<HTMLSelectElement>(null);

  const [requestingStore, setRequestingStore] = useState("default");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState<PartialItem[]>([
    { tempID: Date.now(), quantity: "1", sku: "", description: "" },
  ]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [producSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState({});

  function handleGetMoreItems() {
    setItems((prevState) => {
      return [
        ...prevState,
        {
          tempID: Date.now(),
          sku: "",
          quantity: "1",
          description: "",
        },
      ];
    });
  }

  async function handleFormSubmit() {
    console.log("form submit running");
    if (requestingStore === "default") {
      handleSubmitWithDefaultLocation();
      return;
    }

    setLoading(true);
    const payload = {
      name: name,
      phone: phone,
      requestingStore: requestingStore,
      email: email,
      address: address,
      items: items,
    };

    const message = await createStoreRequest(payload);
    setMessage(message);
    setLoading(false);
  }

  function handleItemChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
    index: number,
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

  function removeSingleItem(
    e: React.MouseEvent<HTMLButtonElement>,
    item: PartialItem,
  ) {
    e.preventDefault();
    const newState = items.filter((el, index) => {
      return item.tempID !== el.tempID;
    });
    setItems(newState);
  }

  function handleSubmitWithDefaultLocation() {
    if (selectInput.current) {
      selectInput.current.focus();
    }
  }

  async function handleSearch() {
    if (!producSearch) {
      return;
    }
    console.log("handle search running");
    // take in user input
    // hit api
    const response = await fetch(`/api/prontoDatabase?search=${producSearch}`);
    const results = await response.json();

    console.log("results", results);

    return results;
  }

  useEffect(() => {
    if (producSearch.length > 4) {
      const searchResults = handleSearch();
      setProducts(searchResults);
    }
  }, [producSearch]);

  return (
    <div className="flex flex-col items-center">
      <form
        className="w-2/3"
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
      >
        <div className="mb-7 flex flex-col">
          <h2 className="font-bold">Request info</h2>

          <label
            className="flex flex-col text-sm text-gray-800 sm:text-base"
            htmlFor="requestingStore"
          >
            Requesting store:
          </label>
          <select
            ref={selectInput}
            required={true}
            className="rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
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
          <label htmlFor="customerName">Customer Name</label>
          <input
            required={true}
            type="text"
            name="customerName"
            id="customerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <label htmlFor="phone">Customer Phone</label>
          <input
            required={true}
            type="text"
            name="customerPhone"
            id="customerPhone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <label htmlFor="email">Customer Email</label>
          <input
            type="text"
            name="customerEmail"
            id="customerEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <label htmlFor="address">Customer Address</label>
          <textarea
            name="address"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="resize rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <h2 className="font-bold">Item info</h2>
        <div className="flex flex-col items-center justify-center md:col-span-2">
          <p>Request more items: </p>
          <button
            type="button"
            onClick={() => handleGetMoreItems()}
            className="rounded-lg bg-indigo-400 px-6 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-500 focus-visible:ring active:bg-indigo-700 md:text-base"
          >
            Get more requests
          </button>
        </div>

        <div className="border-2 border-green-300">
          <label htmlFor="scanBox">Scan or search for skus here</label>
          <input
            type="text"
            value={producSearch}
            onChange={(e) => setProductSearch(e.target.value)}
          />
          <select name="products">
            <option>Test option</option>
            <option>Test option2</option>
            {products.likeResults &&
              products.likeResults.map((item) => (
                <option key={item.ItemCode}>{item.Style}</option>
              ))}
          </select>

          {/* i shbould spend more time thinking about what exact behaviour do i want?
          user can search for skus via text or barcode.

          user can type or scan a barcode

          press an enter button

          (then what should happen)
          
          */}
        </div>

        {items.map((item, i) => (
          <div key={"item" + i} className="mb-10 grid grid-cols-2">
            <div key={"item" + i} className="flex flex-col">
              <p>Item #{i + 1}</p>
              <label htmlFor="quantity">Quantity </label>
              <input
                type="number"
                min={1}
                name="quantity"
                id="quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(e, i)}
                className="rounded-md border-0 p-2.5 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <label htmlFor="sku">SKU </label>
              <input
                required={true}
                type="text"
                name="sku"
                id="sku"
                value={item.sku}
                onChange={(e) => handleItemChange(e, i)}
                className="rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <label htmlFor="decription">Description</label>
              <textarea
                required={true}
                name="description"
                id="description"
                value={item.description}
                onChange={(e) => handleItemChange(e, i)}
                className="rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              <button
                className="m-2 w-1/2 rounded-md bg-yellow-200 px-3 py-1"
                onClick={(e) => removeSingleItem(e, item)}
              >
                Remove item
              </button>
            </div>
            <StockChecker sku={item.sku} />
          </div>
        ))}
        <div className="flex flex-col items-center justify-center md:col-span-2">
          <button
            type="submit"
            className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-lg font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700"
          >
            Submit order/request to store
          </button>
        </div>
        <div>{loading ? "Sending Request..." : message}</div>
      </form>
    </div>
  );
}
