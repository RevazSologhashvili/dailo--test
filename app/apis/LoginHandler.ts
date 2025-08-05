"use client"



const API_ROUTE_LOGIN = process.env.NEXT_PUBLIC_API_ROUTE_LOGIN;

export const LoginHandler = async (username: string, password: string) => {
  const body = new URLSearchParams({ username, password }).toString();

  const res = await fetch(API_ROUTE_LOGIN!, {
    method: "POST",
    credentials: "include",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    throw new Error("Login Failed");
  }

  const user = await res.json();
  return user;
};