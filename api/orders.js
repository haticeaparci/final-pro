import fs from "fs/promises";
import path from "path";

const ordersFile = path.join(process.cwd(), "api", "data", "orders.json");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    const body = req.body;
    const orderData = body?.order;
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ message: "Missing data." });
    }
    // Dosya işlemlerini kaldırdık
    const newOrder = { ...orderData, id: (Math.random() * 1000).toString() };
    res.status(201).json({ message: "Order created!", order: newOrder });
  } else if (req.method === "GET") {
    res.status(200).json([]); // Her zaman boş dizi döner
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
