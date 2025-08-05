"use client";
import { Ellipsis, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useChatSelectors, useChatActions } from "../hooks/useChatActions";
import { setActiveFilter } from '../store/slices/chatSlice';
import { useUser } from '../context/UserContext';
import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (modalOpen && !dialog.open) {
      dialog.showModal();
    } else if (!modalOpen && dialog.open) {
      dialog.close();
    }
  }, [modalOpen]);

  const { selectedChat, isAsideOpen } = useChatSelectors();
  const { user } = useUser();
  const {
    toggleAside,
    transferChatToHuman,
    transferChatToAI,
    assignChatToUser
  } = useChatActions();

  if (!selectedChat) {
    return (
      <header className="bg-gray-900 w-full px-4 border-b-[1px] border-gray-400/30 flex items-center py-3 h-[73px]">
        <span className="cursor-pointer p-2" onClick={toggleAside}>
          {isAsideOpen ? (
            <X className="text-slate-200/60 w-5 h-5 hover:text-slate-200/80" />
          ) : (
            <Menu className="text-slate-200/60 w-5 h-5 hover:text-slate-200/80" />
          )}
        </span>
      </header>
    );
  }

  const fullname = selectedChat.assigned_to
    ? `${selectedChat.assigned_to_fn} ${selectedChat.assigned_to_ln}`
    : null;

  const initials = selectedChat.customer_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const iconSrc = `/${selectedChat.page_type.toLowerCase()}.png`;

  const handleTransferToHuman = (chatId: string) => {
    transferChatToHuman(chatId);
    setActiveFilter("human");
  };

  const handleTransferToAI = (chatId: string) => {
    transferChatToAI(chatId);
    setActiveFilter("ai");
  };

  const isMine = user.id === selectedChat.assigned_to;

  const handleAssign = () => {
    setModalOpen(false);
    assignChatToUser(selectedChat.id, user.id);
  };

  return (
    <header className="bg-gray-900 w-full px-4 border-b-[1px] border-gray-400/30 flex items-center py-3">
      <span className="cursor-pointer p-2" onClick={toggleAside}>
        {isAsideOpen ? (
          <X className="text-slate-200/60 w-5 h-5 hover:text-slate-200/80" />
        ) : (
          <Menu className="text-slate-200/60 w-5 h-5 hover:text-slate-200/80" />
        )}
      </span>

      <div className="flex flex-1 px-4 justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="w-10 h-10 rounded-full flex justify-center items-center bg-gray-600 text-white font-medium">
            {initials}
          </span>
          <div>
            <h2 className="text-white font-semibold">{selectedChat.customer_name}</h2>
            <div className="flex items-center gap-2">
              <Image
                src={iconSrc}
                width={8}
                height={8}
                alt={selectedChat.page_name}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-400">
                {selectedChat.page_name}
              </span>
              <span
                className={`ml-3 text-xs font-semibold ${selectedChat.is_human ? "text-green-400" : "text-cyan-400"}`}
              >
                {selectedChat.is_human ? "Human Handling" : "AI Handling"}
                {selectedChat.is_human && fullname && (
                  <span className='ml-3 text-xs font-semibold text-blue-500'>
                    &ordm; Assigned to {fullname}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">

          {/* Show "Assign to Me" only if chat is unassigned and human */}
          {selectedChat.is_human && selectedChat.assigned_to === null && (
            <button
            name='Assign to Me'
            title='Assign to Me'
              onClick={() => assignChatToUser(selectedChat.id, user.id)}
              className="rounded-md bg-orange-600 hover:bg-orange-700 px-3 py-2 text-white cursor-pointer text-sm"
            >
              Assign to Me
            </button>
          )}

          {/* Show "Pause AI" only if chat is being handled by AI */}
          {!selectedChat.is_human && (
            <button
             name='Pause AI'
            title='Pause AI'
              onClick={() => handleTransferToHuman(selectedChat.id)}
              className="rounded-md bg-orange-600 hover:bg-orange-700 px-3 py-2 text-white cursor-pointer text-sm"
            >
              Pause AI
            </button>
          )}

          {/* Show "Mark as Resolved" only if chat is assigned to current user and handled by human */}
          {isMine && selectedChat.is_human && (
            <button
             name='Mark as Resolved'
            title='Mark as Resolved'
              onClick={() => handleTransferToAI(selectedChat.id)}
              className="bg-green-600 hover:bg-green-700 px-3 py-2 text-white cursor-pointer rounded-md text-sm"
            >
              Mark as Resolved
            </button>
          )}

          {/* Show "Reassign to Me" only if chat is assigned to someone else & handled by human */}
          {selectedChat.is_human && !isMine && selectedChat.assigned_to !== null && (
            <button
            name='Reassign to Me'
            title='Reassign to Me'
              onClick={() => setModalOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 px-3 py-2 text-white cursor-pointer rounded-md text-sm"
            >
              Reassign to Me
            </button>
          )}

          <button name='Elipsis Icon' title='Elipsis Icon' className="cursor-pointer text-center text-gray-400 hover:text-gray-500 p-2 rounded-full">
            <Ellipsis className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal Dialog */}
      <dialog
        ref={dialogRef}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
               rounded-md bg-gray-700 text-white shadow-2xl max-w-md w-full 
               p-6 open:animate-fadeIn transition-all duration-200 z-50"
        onCancel={() => setModalOpen(false)}
      >
        <form method="dialog" className="flex flex-col">
          <h3 className="text-white font-semibold text-lg mb-4">Reassign Conversation</h3>
          <p className="text-gray-300 mb-2">
            This conversation is currently assigned to <strong>{fullname}</strong>.
          </p>
          <p className="text-gray-300 mb-6">Do you want to reassign it to yourself?</p>
          <div className="flex justify-end gap-4">
            <button
              title='Cancel'
              name='Cancel'
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md cursor-pointer"
            >
              Cancel
            </button>
            <button
             title='Reassign to Me'
              name='Reassign to Me'
              type="button"
              onClick={handleAssign}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer"
            >
              Reassign to Me
            </button>
          </div>
        </form>
      </dialog>
    </header>
  );
}
