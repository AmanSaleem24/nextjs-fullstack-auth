import connect from "@/dbConfig/connect"
import { sendEmail } from "@/helpers/mailer"  // ← Import from mailer.ts
import User from "@/models/userModel"
import bcryptjs from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        // Validation
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        // Check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 409 }
            )
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        // Create user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        console.log('User created:', savedUser._id);

        await sendEmail({ 
            email: savedUser.email,
            emailType: "VERIFY", 
            userId: savedUser._id
        })

        return NextResponse.json(
            {
                message: "User created successfully. Please check your email to verify your account.",
                success: true
            },
            { status: 201 }
        )

    } catch (error: any) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: "Failed to create user" },
            { status: 500 }
        )
    }
}