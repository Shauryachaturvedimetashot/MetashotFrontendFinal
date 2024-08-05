import { NextRequest, NextResponse } from "next/server";


export async function GET(request:NextRequest){
    try {
        const response =  NextResponse.json({message:"User Logged out!",success:true});
        
        response.cookies.set("token","",{httpOnly:true,expires:new Date(0)});
        return response;
        
    } catch (error) {
        return NextResponse.json({error:error.message},{status:500});
    }
}