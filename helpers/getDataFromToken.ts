import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getTokenData = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken:any = jwt.verify(token, process.env.SECRET_KEY!)
    return decodedToken.id;
  } catch (error:any) {
    console.log(error.message);
  }
};
