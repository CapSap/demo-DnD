"use client";

import { useEffect, useState } from "react";

type store = {
  name: string;
  instore: number;
  pickup: {};
  quantity: number;
  source_code: string;
  url: string;
};

export default function StockChecker({ sku }: { sku: string }) {
  const [storeStockLevels, setStoreStockLevels] = useState<store[]>();

  async function checkStock(sku: string) {
    const response = await fetch(`/api/stock-checker`, {
      method: "POST",
      body: JSON.stringify({ sku: sku }),
    })
      .then((res) => res.json())
      .then((res) => JSON.parse(res.body))
      .then((res) => setStoreStockLevels(res));
  }

  useEffect(() => {
    checkStock(sku);
  }, [sku]);

  console.log(storeStockLevels);

  return (
    <div>
      {storeStockLevels && storeStockLevels.length > 0 ? (
        <div className="grid grid-cols-2 w-1/4 text-center ">
          <h3 className="font-bold">Store Name</h3>
          <h3 className="font-bold">Quantity</h3>
          {storeStockLevels.map((store) => (
            <>
              <p key={store.name}>{store.name}</p>
              <p key={store.name + store.quantity}>{store.quantity}</p>
            </>
          ))}
        </div>
      ) : (
        <p>Bad sku. Could not find stock levels</p>
      )}
    </div>
  );
}
