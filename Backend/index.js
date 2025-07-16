const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./Database/connection');
connectDB();
const port = process.env.PORT || 3000;
app.use(express.json())

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


app.get('/', (req, res) => {
    res.send('server is running')
})
app.use('/api/menu',require('./Routes/menuRoutes'));
app.use('/api/orders', require('./Routes/orderRoutes'));
app.use('/api/admin', require('./Routes/adminRoutes'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})