const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: ["https://erp-gamma-teal.vercel.app", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes")); 
app.use("/api/attendance", require("./routes/attendanceRoutes")); 
app.use("/api/leaves", require("./routes/leaveRoutes")); 
app.use("/api/finance", require("./routes/financeRoutes"));
app.use("/api/forecast", require("./routes/forecastRoutes"));
app.use("/api/supplychain", require("./routes/supplyChainRoutes"));

app.get("/", (req, res) => res.send("ERP API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));