"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast"


export default function Signup() {
  const [user, setUser] = React.useState({
    username: "", email : "", password: ""
  })
  const [isloading, setIsLoading] = React.useState(false)
  const [buttonDisable, setButtonDisable] = React.useState(false)
const router = useRouter()
  useEffect(()=>{
    if(user.email.length > 0 && user.password.length > 4 && user.username.length >= 3){
      setButtonDisable(false)
    }
    else {
      setButtonDisable(true)
    }
  }, [user])
  const onSignup = async (e:React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await axios.post("/api/users/signup", user);
      console.log('Signup success', res);
      toast.success("Signup Successful")
    
      router.push("/login")
    } catch (error:any) {
      console.log('Error during signing up', error.message);
      
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <div className="flex  flex-col justify-center items-center min-h-screen gap-5">
      <div className="">
        <h1 className="text-4xl text-amber-600">{isloading ? "Processing..." : "Signup"}</h1>
      </div>
      <form action="" className="flex flex-col gap-4 w-72" onSubmit={onSignup}>
        <label htmlFor="username">Username</label>
        <input
          className="border-solid border-2 rounded-md p-2 "
          type="text"
          name="username"
          placeholder="username"
          value={user.username}
          onChange={(e)=> setUser({...user, username: e.target.value})}
        />

        <label htmlFor="email">Email</label>
        <input
          className="border-solid border-2 rounded-md p-2"
          type="email"
          name="email"
          placeholder="email"
          value={user.email}
          onChange={(e)=>setUser({...user, email: e.target.value})}
        />

        <label htmlFor="password">Password</label>
        <input
          className="border-solid border-2 rounded-md p-2"
          type="password"
          name="password"
          placeholder="password"
          value={user.password}
          onChange={(e)=>setUser({...user, password: e.target.value})}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 text-white rounded cursor-pointer"
        >
          {buttonDisable ? "No Signup" : "Signup"}
        </button>

        <Link href="/login" className="text-center hover:underline">Already a user? Login</Link>
      </form>
    </div>
  );
}
