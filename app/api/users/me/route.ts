import { NextRequest, NextResponse} from "next/server";
import {getTokenData} from "@/helpers/getDataFromToken"
import User from "@/models/userModel";
import connect from "@/dbConfig/connect"

connect()

export async function GET(request: NextRequest){
    const userId = await getTokenData(request)
    
    
    const user = await User.findOne({_id: userId})


    return NextResponse.json({
        message: "user fetched successfully",
        data: user
    })
}