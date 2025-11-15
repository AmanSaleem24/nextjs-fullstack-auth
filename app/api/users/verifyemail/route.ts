import connect from "@/dbConfig/connect";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { token } = reqBody
        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            )
        }

        console.log("Verifying token:", token.substring(0, 20));
        
        const user = await User.findOne({
            verifyUserToken: token, 
            verifyUserTokenExpiry: { $gt: Date.now() }
        })

        if (!user) {
            return NextResponse.json({
                error: "Invalid or expired token"
            },
            { status: 400 })
        }

        console.log("User found:", user.email);

        user.isVerified = true;
        user.verifyUserToken = undefined
        user.verifyUserTokenExpiry = undefined

        await user.save()
        console.log("User verified successfully:", user.email);
        
        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        }, { status: 200 })

    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({
            error: error.message || "Failed to verify email"
        }, { status: 500 })
    }
}