"use client"
import { NextRequest } from "next/server";
import {getTokenData} from "@/helpers/getDataFromToken"
import axios from "axios";

export default function Hello(request: NextRequest){
    const getData = async ( ) => {
    
        const data = await axios.get('/api/users/me')

        console.log(data.data);
        
    }
return (
    <>
    <button onClick={getData}>GetData</button>
    </>
)
}