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

    const newOrder = { ...orderData, id: (Math.random() * 1000).toString() };
    res.status(201).json({ message: "Order created!", order: newOrder });
  } else if (req.method === "GET") {
    res.status(200).json([]);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
