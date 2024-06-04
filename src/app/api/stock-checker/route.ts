import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const userInput = await req.json();

  if (!req.body) {
    return NextResponse.json({ error: "no body", status: 400 });
  }

  const stockLevels = await fetch(process.env.STOCK_URL + userInput.sku, {
    method: "GET",
  }).then((res) => res.text());

  return NextResponse.json({ body: stockLevels });
};
