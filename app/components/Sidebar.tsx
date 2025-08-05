"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Filters from "./Filters";
import { LogOut } from "lucide-react";
import UserCard from "./UserCard";
import { useAppSelector } from "../store"; // path to your store
import { useChatSelectors } from "../hooks/useChatActions"; // adjust if path differs
import ChatBox from "./ChatBox";

export default function Sidebar() {
  const isAsideOpen = useAppSelector((state) => state.chat.isAsideOpen);
  const { filteredChats } = useChatSelectors(); 
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const logoutModalRef = useRef<HTMLDialogElement>(null);

  // Handle logout modal
  useEffect(() => {
    const modal = logoutModalRef.current;
    if (showLogoutModal && modal) {
      modal.showModal();
    } else if (modal) {
      modal.close();
    }
  }, [showLogoutModal]);

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
    setShowLogoutModal(false);
     router.push('/Login');
    // Example: redirect to login page
    // window.location.href = '/login';
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };



  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white shadow-lg z-50 border-r-[1px] border-gray-400/30 transform transition-transform duration-300 ${
          isAsideOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <header className="pb-2 p-4 border-b-[1px] border-gray-400/30">
          <div className="py-2 flex items-center justify-between relative">
            <div>
              <h5 className="font-medium flex items-center gap-2">
                <span className="w-8 h-8 inline-flex items-center justify-center bg-[linear-gradient(rgb(0,219,195),rgb(33,150,243))] rounded-lg">
                  D
                </span>
                <span>dailo.ai</span>
              </h5>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-800 rounded-md p-4 my-4">
            <UserCard />
          </div>
        </header>
        <div className="p-4 border-b-[1px] border-gray-400/30 ">
          <Filters />
        </div>
        <div className="py-4 px-2 flex-1 flex flex-col gap-2 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="text-center text-gray-400 text-sm">
              No chats found.
            </div>
          ) : (
            filteredChats.map((chat) => <ChatBox key={chat.id} chat={chat} />)
          )}
        </div>
        <footer className="p-4 border-t-[1px] border-gray-400/30">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center cursor-pointer gap-3 px-4 py-3 text-gray-300 hover:text-red-400 hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Logout</span>
          </button>
        </footer>
      </aside>

      {/* Logout Confirmation Modal */}
    <dialog
        ref={logoutModalRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   rounded-md bg-gray-700 text-white shadow-2xl max-w-md w-full
                   p-6 open:animate-fadeIn transition-all duration-200 z-50"
        onCancel={() => setShowLogoutModal(false)}
      >
        <form method="dialog" className="flex flex-col">
          <h3 className="text-white font-semibold text-lg mb-4">Confirm Logout</h3>
          <p className="text-gray-300 mb-2">
            Are you sure you want to log out?
          </p>
          <p className="text-gray-300 mb-6">
            You will be redirected to the login page and will need to sign in again to access your account.
          </p>
          <div className="flex justify-end gap-4">
            <button
              title='Cancel'
              name='Cancel'
              onClick={handleLogoutCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
              title='Logout'
              name='Logout'
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}