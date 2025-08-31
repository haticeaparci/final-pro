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
    let body = req.body;
    if (!body) {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      body = JSON.parse(Buffer.concat(buffers).toString());
    }

    const orderData = body.order;
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ message: "Missing data." });
    }

    let orders = [];
    try {
      const fileData = await fs.readFile(ordersFile, "utf8");
      orders = JSON.parse(fileData);
    } catch (e) {
      orders = [];
    }
    const newOrder = { ...orderData, id: (Math.random() * 1000).toString() };
    orders.push(newOrder);
    await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));

    res.status(201).json({ message: "Order created!", order: newOrder });
  } else if (req.method === "GET") {
    try {
      const fileData = await fs.readFile(ordersFile, "utf8");
      const orders = JSON.parse(fileData);
      res.status(200).json(orders);
    } catch (e) {
      res.status(200).json([]);
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
