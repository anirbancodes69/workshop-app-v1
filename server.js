const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;
const DATA_FILE = path.join(__dirname, "data", "items.json");

app.use(bodyParser.json());
app.use(express.static("public"));

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE));
}

// Helper functions for file operations
const readItems = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    return [];
  }
};

const writeItems = (items) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
};

// API Routes

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// GET all items
app.get("/api/items", (req, res) => {
  try {
    const items = readItems();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to read items" });
  }
});

// POST new item
app.post("/api/items", (req, res) => {
  try {
    const items = readItems();
    const newItem = {
      id: Date.now().toString(),
      name: req.body.name,
      price: req.body.price,
      createdAt: new Date().toISOString(),
    };

    // Validation
    if (!newItem.name || !newItem.price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    items.push(newItem);
    writeItems(items);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to save item" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
