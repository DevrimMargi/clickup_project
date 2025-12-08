import { useState } from "react";
import { X } from "lucide-react";

export default function InviteModal({ closeModal }) {
  const [email, setEmail] = useState("");

  const handleInvite = () => {
    console.log("Send invite:", email);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1f2937] w-[550px] rounded-2xl shadow-xl p-8 relative">

        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={closeModal}
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Invite people</h2>

        {/* Email input */}
        <label className="text-gray-300 text-sm">Invite by email</label>
        <input
          type="text"
          placeholder="Email, comma or space separated"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 mb-6 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none"
        />

        {/* Role selection (dummy) */}
        <label className="text-gray-300 text-sm">Invite as</label>

        <div className="mt-2 mb-8 flex items-center gap-2 bg-gray-700 p-3 rounded-lg border border-gray-600">
          <span className="text-xl">👥</span>
          <div>
            <p className="text-white font-semibold">Member</p>
            <p className="text-gray-400 text-xs">
              Can access all public items in your Workspace.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleInvite}
          >
            Send Invite
          </button>
        </div>

      </div>
    </div>
  );
}
