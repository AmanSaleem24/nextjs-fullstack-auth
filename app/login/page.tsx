"use client"
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast"


export default function Login() {
  const router = useRouter()
  const [user, setUser] = useState({
      email: "", password: ""
    })
    const [buttonDisable, setButtonDisable] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    const onLogin = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        setIsLoading(true)
        const res = await axios.post("/api/users/login", user);
        toast.success("Login Success");
        router.push(`/profile/${user.email}`)
      } catch (error: any) {
        console.log('Login failed', error.message);
        toast.error("Login Failed");
      }finally{
        setIsLoading(false)
      }
    }

    useEffect(()=>{
      if(user.email.length > 4 && user.password.length > 3){
        setButtonDisable(false)
      }
      else{
        setButtonDisable(true)
      }
    }, [user])
  return (
    <div className="flex  flex-col justify-center items-center min-h-screen gap-5">
      <div className="">
        <h1 className="text-4xl text-amber-600">{isLoading ?  "Processing" : "Login"}</h1>
      </div>
      <form action="" className="flex flex-col gap-4 w-72 " onSubmit={onLogin}>
        <label htmlFor="email">Email</label>
        <input
          className="border-solid border-2 rounded-md p-2"
          type="email"
          name="email"
          placeholder="email"
          onChange={(e)=> setUser({...user, email:e.target.value})}
        />
       
        <label htmlFor="password">Password</label>
        <input
          className="border-solid border-2 rounded-md p-2"
          type="password"
          name="password"
          placeholder="password"
          onChange={(e)=> setUser({...user, password:e.target.value})}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 text-white rounded cursor-pointer"
        >
          {buttonDisable ? "No Login" : "Login"}
        </button>

        <Link href="/signup" className="text-center hover:underline">New user? Signup here</Link>
      </form>
    </div>
  );
}
