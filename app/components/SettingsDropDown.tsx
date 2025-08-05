"use client";
import { logoutHandler } from "../apis/LogoutHandler";

type Props = {
  show: boolean;
};

export default function SettingsDropDown({ show }: Props) {
  return (
    <div
      className={`
        absolute right-0 mt-10 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50 transition-opacity duration-200
        ${show ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
    >
      <button
        title="Logout"
        name="Logout"
        className="w-full px-4 py-2 text-sm text-center text-red-500 hover:bg-red-500 hover:text-white rounded-md"
        onClick={async () => {
          const success = await logoutHandler();
          if (success) {
            window.location.reload(); // or redirect
          }
        }}
      >
        Logout
      </button>
    </div>
  );
}

