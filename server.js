require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const { Folder } = require("./models");

// Routes
const authRoutes = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const folderRoutes = require("./routes/folder");
const fileRoutes = require("./routes/file");

const app = express();

// ✅ CORS Configuration - Only allow requests from your frontend (e.g., localhost:3007)
const corsOptions = {
  origin: 'http://localhost:3007',  // Replace with your frontend URL when in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));  // Apply CORS with the configured options
app.use(express.json());

// ✅ Root Test Route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// ✅ Route Mounting
app.use("/api/auth", authRoutes);  // Authentication routes
app.use("/api/upload", uploadRoute);  // File upload routes
app.use("/api/folders", folderRoutes);  // Folder-related routes
app.use("/api/files", fileRoutes);  // File-related routes

// Test endpoint for fetching folders (for debugging purposes)
app.get("/test", async (req, res) => {
  try {
    const folders = await Folder.findAll();
    res.json(folders);
  } catch (err) {
    console.error("Test endpoint error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Server & DB Start
const PORT = process.env.PORT || 5011;

db.sequelize
  .sync()
  .then(() => {
    console.log("✅ Database synced");
    // If you're testing locally, you can print the local URL
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    app.listen(PORT, () => {
      console.log(`🌍 API is live at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Error syncing database:", err));