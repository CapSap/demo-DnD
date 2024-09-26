"use client";

import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useState, useRef } from "react";

export default function UploadSkusPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  return (
    <>
      <h1>Upload New sku list</h1>
      <p>csv must have the following columns in this order: </p>
      <ol>
        <li>Item Code </li>
        <li>GTIN</li>
        <li>Style </li>
        <li>Colour </li>
        <li>Size</li>
        <li>Gender</li>
        <li>Item Category Code</li>
        <li>Item Class Code</li>
        <li>ABC Class</li>
        <li>Brand</li>
      </ol>
      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error("No file selected");
          }

          const file = inputFileRef.current.files[0];

          const newBlob = await upload("prontoData/pronto-database.csv", file, {
            access: "public",
            handleUploadUrl: "/api/upload",
            contentType: "text/csv",
          });

          console.log("new blobl", newBlob);

          setBlob(newBlob);
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}
