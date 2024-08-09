const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware')

// Register Route
router.post('/register', async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(200).send({ message: "User already exists", success: false });
        }

        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashPassword
        });

        res.status(201).send({ message: 'User created successfully', success: true });
    } catch (error) {
        res.status(500).send({ message: "Error creating user", success: false, error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // No need to await req.body

        const isUser = await User.findOne({ email });
        if (!isUser) {
            return res.status(400).send({ message: "Sign up to login", success: false });
        }

        const isMatch = await bcrypt.compare(password, isUser.password);
        if (isMatch) {
            const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            });
            return res.status(200).send({ message: "Login successfully", success: true, token : token });
        } else {
            return res.status(400).send({ message: "Email or password is wrong!", success: false });
        }
    } catch (error) {
        return res.status(500).send({ message: "Error while trying to login", success: false, error });
    }
});

// Get User Info By ID Route
router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
    // console.log("Request received"); // Log request
    // console.log()
    try {
        // console.log(await req.body)
        const user = await User.findOne({ _id: req.body.userId });
        if (!user) {
            return res.status(400).send({ message: "User does not exist", success: false });
        } else {
            res.status(200).send({ success: true, 
                data: {
                 _id:user._id,
                 name: user.name,
                 email: user.email ,
                 isAdmin:user.isAdmin,
                } 
            });
        }
    } catch (error) {
        console.error('Error getting user info:', error); 
        res.status(500).send({ message: "Error getting user info", success: false, error });
    }
});

// Retrieve all users from the database
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(400).send({ message: "No users found", success: false });
        } else {
            res.status(200).send({ success: true, data: users });
        }
    } catch (error) {
        console.error('Error getting user info:', error); 
        res.status(500).send({ message: "Error getting user info", success: false, error });
    }
});

module.exports = router;