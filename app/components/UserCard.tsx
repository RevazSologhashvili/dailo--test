"use client";
import React from "react";
import { useUser } from "../context/UserContext";

export default function UserCard() {
  const { user } = useUser();

  if (!user) return null; // or placeholder

  const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`;
  const fullName = `${user.first_name} ${user.last_name}`;
  // const role = user.is_admin ? "Administrator" : "Customer Support";

  return (
    <>
      <div className='rounded-full w-7 h-7 flex justify-center items-center font-medium text-xs text-white bg-teal-700'>
        {initials.toUpperCase()}
      </div>
      <div>
        <h4 className='font-medium text-xs'>{fullName}</h4>
      </div>
    </>
  );
}
