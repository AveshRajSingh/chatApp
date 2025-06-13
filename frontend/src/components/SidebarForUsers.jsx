import { useState, useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const SidebarForUsers = () => {
  const { onlineUsers, fetchOnlineUsers, authUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      await fetchOnlineUsers();
      setLoading(false);
    };
    getUsers();
  }, [fetchOnlineUsers]);

  const filteredUsers = onlineUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (userId) => {
    navigate(`/chat?id=${userId}`);
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-2 pl-10 pr-3 block w-full rounded-md bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* User List */}
      <div className="divide-y divide-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
        {loading ? (
          <div className="p-4 flex justify-center">
            <div className="animate-spin h-5 w-5 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user._id)}
              className="p-4 flex items-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <img
                  src={user.profilePicture || "/public/avatarmale.png"}
                  alt={user.username}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                    user.isOnline ? "bg-green-400" : "bg-gray-400"
                  }`}
                ></span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500 truncate">
                  {user.status || "Available"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? "No users found" : "No users available"}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarForUsers;
