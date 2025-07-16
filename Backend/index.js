const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./Database/connection');
const authenticateToken = require('./Middleware/authenticateToken');
const Menu = require('./Database/Models/menuSchema');

// Express app
const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server from Express
const server = http.createServer(app);

// Create WebSocket server
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
        methods: ['GET', 'POST']
    }
});

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

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

    socket.on('orderItem', (order) => {
        console.log('Message received:', order);

        io.emit('orderReceive', order);
    });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



// const fetchItem = async(id)=>{
//     try {
//         const item = await Menu.findById(id);
//         if (!item) {
//             throw new Error('Item not found');
//         }
//         return item;
//     } catch (error) {
        
//     }
// }