"use client";

const API_ROUTE_LOGOUT = process.env.NEXT_PUBLIC_API_ROUTE_LOGOUT;

export const logoutHandler = async (): Promise<boolean> => {
  if (!API_ROUTE_LOGOUT) {
    console.error("API_ROUTE_LOGOUT is not defined.");
    return false;
  }

  try {
    const res = await fetch(API_ROUTE_LOGOUT, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    return res.ok;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};

