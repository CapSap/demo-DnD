"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IPartialStoreRequest, PartialItem, ProntoCSV } from "../types/types";
import StockChecker from "./StockChecker";

import { debounce } from "lodash";

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
  const [items, setItems] = useState<PartialItem[]>([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState("");

  type SearchResults = {
    likeResults: ProntoCSV[];
    exactResults: ProntoCSV[];
  };

  const [productSearch, setProductSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults>({
    likeResults: [],
    exactResults: [],
  });

  const [selectedProductID, setSelectedProductID] = useState<string>();
  const abortControllerRef = useRef<AbortController | null>(null);

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
      destination: destination,
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

  useEffect(() => {
    const debouncedSearch = debounce((searchString) => {
      handleSearch(searchString);
    }, 500);
    if (productSearch) {
      debouncedSearch(productSearch);
    }

    return () => {
      debouncedSearch.cancel(); // Cleanup on unmount or when productSearch changes
    };
  }, [productSearch]);

  async function handleSearch(searchString: string) {
    if (!productSearch) {
      return;
    }

    // Cancel the previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for the current request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    console.log("handle search searching..");

    // take in user input
    // hit api
    try {
      const response = await fetch(`/api/prontoBlob?search=${searchString}`, {
        signal: controller.signal,
      });

      const results = await response.json();

      setSearchResults(results);

      const firstResult =
        (results.exactResults &&
          results.exactResults.length > 0 &&
          results.exactResults[0].ItemCode) ||
        (results.likeResults &&
          results.likeResults.length > 0 &&
          results.likeResults[0].ItemCode);

      // set the value to first results from search
      setSelectedProductID(firstResult);
    } catch (err) {
      const error = err as Error; // Assert that err is of type Error
      if (error.name === "AbortError") {
        console.log("Search request aborted.");
      } else {
        console.error("Failed to fetch search results:", err);
      }
    }
  }

  function handleAddProduct(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log("button clicked", selectedProductID);

    const seletecedExact = searchResults.exactResults.find(
      (product) => product.ItemCode === selectedProductID,
    );

    const selectedLike = searchResults.likeResults.find(
      (product) => product.ItemCode === selectedProductID,
    );

    const final = seletecedExact || selectedLike;

    if (!final) {
      return;
    }

    console.log("final", final);
    // find the object via ID, and then add it to state.

    setItems((prevState) => {
      return [
        ...prevState,
        {
          tempID: Date.now(),
          sku: final.ItemCode,
          quantity: "1",
          description: `${final.Style} ${final.Colour} ${final.Size}`,
        },
      ];
    });
  }

  function handleDestinationChange(location: string) {
    setDestination(location);
  }

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
          <fieldset className="mt-4">
            <legend className="leading-6 text-gray-900">
              {"Deliver to customer's home or your store?"}
            </legend>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Select an option and choose where item(s) should be delivered to
            </p>
            <div className="flex justify-around">
              <div className="flex items-center gap-x-3">
                <input
                  id="destination-store"
                  name="destination"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  onChange={() => handleDestinationChange("store")}
                  checked={destination === "store"}
                />
                <label
                  htmlFor="destination-store"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Deliver to your store
                </label>
              </div>
              <div className="flex items-center gap-x-3">
                <input
                  id="destination-home"
                  name="destination"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  onChange={() => handleDestinationChange("home")}
                  checked={destination === "home"}
                />
                <label
                  htmlFor="destination-home"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  {"Customer's Home"}
                </label>
              </div>
            </div>
          </fieldset>
          {destination === "home" ? (
            <>
              <label htmlFor="address">Customer Address</label>
              <textarea
                required={true}
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="resize rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </>
          ) : null}
        </div>
        <h2 className="font-bold">Item info</h2>

        <div className="flex flex-col border-2 border-green-300 p-4">
          <label htmlFor="scanBox">Scan or search for skus below</label>
          <div className="my-1 flex content-around">
            <input
              className="mr-4 flex-grow rounded-md border-0 p-2.5 py-1.5 pl-2 text-xl text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
              type="text"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>

          <div className="my-1 flex content-around">
            <select
              className="mr-4 flex-grow rounded border bg-gray-50 px-3 py-2 text-gray-800 outline-none ring-indigo-300 transition duration-100 focus:ring"
              name="products"
              onChange={(e) => {
                setSelectedProductID(e.target.selectedOptions[0].id);
              }}
              value={selectedProductID}
              defaultValue={"Search for some skus"}
            >
              <option disabled className="p-10">
                Search for some skus
              </option>
              {searchResults.likeResults &&
                searchResults.likeResults.map(
                  (item) =>
                    item && (
                      <option
                        key={item.ItemCode}
                        id={item.ItemCode}
                        value={item.ItemCode}
                      >
                        {item.Style} {item.Colour} {item.Size} - {item.ItemCode}
                      </option>
                    ),
                )}
            </select>
            <button
              onClick={(e) => handleAddProduct(e)}
              className="rounded-lg bg-indigo-400 px-6 py-2 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-500 focus-visible:ring active:bg-indigo-700 md:text-base"
            >
              Add selected item
            </button>
          </div>

          <div className="m-4 flex items-center justify-center md:col-span-2">
            <p className="pr-2">Fill in an item request manually: </p>
            <button
              type="button"
              onClick={() => handleGetMoreItems()}
              className="rounded-lg bg-indigo-200 px-4 py-1 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-300 focus-visible:ring active:bg-indigo-500"
            >
              Add a blank request below
            </button>
          </div>
        </div>

        {items.length > 0
          ? items.map((item, i) => (
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
            ))
          : 'Search for some skus to add items, or add them manually via the "Add a request below" button'}
        <div>{loading ? "Sending Request..." : message}</div>
        <div className="flex flex-col items-center justify-center md:col-span-2">
          <button
            type="submit"
            className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-lg font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700"
          >
            Submit request to store
          </button>
        </div>
      </form>
    </div>
  );
}
