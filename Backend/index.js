const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./Database/connection');
const authenticateToken = require('./Middleware/authenticateToken');
const Menu = require('./Database/Models/menuSchema');
const mongoose = require('mongoose');

// Express app
const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server from Express
const server = http.createServer(app);

// Create WebSocket server
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175','https://qradmin-brown.vercel.app'],
        methods: ['GET', 'POST']
    }
});

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175','https://qradmin-brown.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Routes
app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api/menu', require('./Routes/menuRoutes'));
app.use('/api/orders', require('./Routes/orderRoutes'));
app.use('/api/admin', require('./Routes/adminRoutes'));

app.get('/api/authcheck', authenticateToken, (req, res) => {
    res.status(200).json({ message: "Authenticated" });
});



io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('orderItem', async (orderItems,table) => {
    try {
      const response = [];

      for (const order of orderItems) {
        const objectId = new mongoose.Types.ObjectId(order.itemId);

        // Find the menu document that contains the itemId
        const menuDoc = await Menu.findOne({
          'menuitems._id': objectId
        });

        if (!menuDoc) continue;

        // Extract the specific item
        const matchedItem = menuDoc.menuitems.id(order.itemId);

        if (matchedItem) {
          const itemname = matchedItem.itemname;
          const price = matchedItem.price?.get(order.size) || 0;

          response.push({
            itemname,
            size: order.size,
            quantity: order.quantity,
            price
          });
        }
      }
      io.emit('orderReceive', response,table); // send the enriched item list
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  });
});



server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


