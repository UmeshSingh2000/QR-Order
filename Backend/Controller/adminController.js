const Admin = require('../Database/Models/adminSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const comparePassword = async (password,hashedPassword)=>{
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        console.error("Error comparing password:", error);
        throw error;
        
    }
}

const generateAuthToken = function(adminId) {
    const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    return token;
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isMatch = await comparePassword(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateAuthToken(admin._id);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const adminSignup = async (req, res) => {
    const { name, email, password, phone, restaurantName } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = new Admin({ name, email, password : await bcrypt.hash(password,10), phone, restaurantName });
        await admin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.log('Error during admin signup:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { adminLogin, adminSignup };