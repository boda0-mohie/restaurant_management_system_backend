const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const menuRoutes = require("./routes/menuRoutes")
const orderRoutes = require("./routes/orderRoutes")
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require("./routes/adminRoutes")
const categoryRoutes = require("./routes/categoryRoutes")

dotenv.config();
const app = express();
app.use(express.json());


// DB Connection 
connectDB()



app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes )
app.use('/api/menu', menuRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/orders', orderRoutes)


app.get("/", (req, res) => {
    res.send("Restaurant Management System API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
