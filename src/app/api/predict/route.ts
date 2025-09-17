import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const resp = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  return NextResponse.json(data);
}
