import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY)
}

//Route for user login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: true, message: "User doesn't exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Undefined crediential" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: true, message: error.message })
    }
}

//Route for user register
const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //checking user already exists or not
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }
        //validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "PLease enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "PLease enter a strong password" })
        }

        //hashing user password
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new userModel(
            {
                name,
                email,
                password: hashedPassword,
            }
        )

        const user = await newUser.save();

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: true, message: error.message })
    }
}

//Route for Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = await jwt.sign(email+password,process.env.JWT_KEY)
            res.json({ success: true, token })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: true, message: error.message })
    }
}

export default { userRegister, userLogin, adminLogin };