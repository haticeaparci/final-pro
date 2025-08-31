import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const filePath = path.join(
        process.cwd(),
        "api",
        "data",
        "available-meals.json"
      );
      const data = await fs.readFile(filePath, "utf8");
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ message: "Could not load meals." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
