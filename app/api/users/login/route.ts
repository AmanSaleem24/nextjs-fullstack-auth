import connect from "@/dbConfig/connect"
import User from "@/models/userModel"
import bcryptjs from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

connect()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        const user = await User.findOne({email})

        // If user doesn't exist 
        if(!user){
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            )
        }

        const comparison = await bcryptjs.compare(password, user.password)

        if(!comparison){
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            )
        }

        // Generate token 
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = jwt.sign(tokenData, process.env.SECRET_KEY!, {expiresIn: "1d"})

        const response = NextResponse.json(
            {
                message: "Logged in successfully",
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            },
            { status: 200 }
        )

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 // 1 day in seconds
        })

        return response

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        )
    }
}