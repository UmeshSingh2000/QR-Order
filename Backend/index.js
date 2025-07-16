const express = require('express')
const app = express();
require('dotenv').config();
const connectDB = require('./Database/connection');
connectDB();
const port = process.env.PORT || 3000;
app.use(express.json())



app.get('/', (req, res) => {
    res.send('server is running')
})
app.use('/api/menu',require('./Routes/menuRoutes'));
app.use('/api/orders', require('./Routes/orderRoutes'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})