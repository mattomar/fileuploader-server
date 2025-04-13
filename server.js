require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const { Folder } = require("./models");

const authRoutes = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const folderRoutes = require("./routes/folder");
const fileRoutes = require("./routes/file");

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:3007',
  'https://fileuploader-server-production.up.railway.app',
  // Add your deployed frontend URL here (e.g., Vercel/Netlify domain)
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Test Routes
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

app.get("/test", async (req, res) => {
  try {
    const folders = await Folder.findAll();
    res.json(folders);
  } catch (err) {
    console.error("Test endpoint error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5011;
db.sequelize
  .sync()
  .then(() => {
    console.log("✅ Database synced");
    app.listen(PORT, () => {
      console.log(`🌍 API is live at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Error syncing database:", err));