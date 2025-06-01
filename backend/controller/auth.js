const bcrypt = require("bcryptjs");                 
const User = require("../schema/user"); 
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const {
            strime_name, full_name, address, pincode, mobile_no, student_whatsapp_no,
            parent_mobileno, parent_occupation, birthdate, school_or_college_name,
            last_education, last_education_percentage, marksheet, cast_certificate,
            student_adhar_card, email, password, role
        } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: "Photo is required!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        const photoUrl = req.file.path;

        const newUser = new User({
            photo: photoUrl,
            strime_name,
            full_name,
            address,
            pincode,
            mobile_no,
            student_whatsapp_no,
            parent_mobileno,
            parent_occupation,
            birthdate,
            school_or_college_name,
            last_education,
            last_education_percentage,
            marksheet,
            cast_certificate,
            student_adhar_card,
            email,
            password: hashedPassword, 
            role
        });

        await newUser.save();
        res.status(201).json({ user: newUser });

    } catch (error) {
        console.error("Add User Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};





exports.login = async(req,res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ data: user._id }, process.env.secret_key);
        
        res.status(200).json({ token,user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login" });
    }
}

exports.getuser = async(req,res) => {
    try {
        const userdata = await User.findById(req.user);
        res.status(200).json({ userdata });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during getuser" });
    }
}
