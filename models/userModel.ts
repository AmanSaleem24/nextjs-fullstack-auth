import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type : String,
        required: [true, "Please provide a username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    isVerified:{ 
        type: String,
        default: false
    },
    isAdmin: {
        type: String,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: String,
    verifyUserToken: String,
    verifyUserTokenExpiry: String
})

const User = mongoose.models.User ||  mongoose.model("User", userSchema);

export default User;