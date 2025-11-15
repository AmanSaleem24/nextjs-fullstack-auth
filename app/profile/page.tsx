"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const handleLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged Out Successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Cannot logout");
    }
  };
  const getData = async () => {
    console.log("clicked");

    const data = await axios.get("/api/users/me");

    setUser(data.data.data._id);
  };
  return (
    <div className="p-10">
      <h1 className="text-red-500 text-3xl font-bold">Profile</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-amber-500 text-white rounded cursor-pointer"
      >
        Logout
      </button>

      <button
        onClick={getData}
        className="px-4 py-2 bg-amber-500 text-white rounded cursor-pointer ml-4 border-solid border-4 border-green-400"
      >
        Get Data
      </button>
      <p className="text-white p-3 mt-4 bg-amber-600">
        {user  ?  (
          <Link href={`/profile/${user}`}>{user}</Link>
        ) : ""}
      </p>
    </div>
  );
}
