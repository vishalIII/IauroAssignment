const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware')

// Register Route

// -------------------------
router.get('/get-all-users', authMiddleware, async (req, res) => {
    // console.log("Request received"); // Log request
    // console.log()
    try {
        // console.log(await req.body)
        const users = await User.find({})
        res.status(200).send({
             message: "Users fetched successfully",
             success : true,
             data : users,
        });
    } catch (error) {
        console.error(error); 
        res.status(500).send({ message: "Error getting user info", success: false, error });
    }
});

// -------------------------

module.exports = router;