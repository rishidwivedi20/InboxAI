"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/signin");
  };

  if (!user) {
    return null;
  }

  return (
    <header className="bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <span
              onClick={() => router.push("/dashboard")}
              className="text-xl cursor-pointer hover:opacity-80 transition-opacity"
              style={{ fontFamily: "Press Start 2P" }}
            >
              InboxAI
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-[10px] text-black">
              Welcome, {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all text-[10px] font-normal cursor-pointer"
              style={{
                fontFamily: "Press Start 2P",
                boxShadow: "3px 3px 0px #000000",
              }}
            >
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
