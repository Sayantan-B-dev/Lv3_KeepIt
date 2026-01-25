import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import SimpleModal from "@/components/ui/SimpleModal";
import { Loader } from "@/components/ui";

const UserListModal = ({ open, onClose, title, userId, type }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            if (!open || !userId) return;
            setLoading(true);
            setError(null);
            try {
                const endpoint = `/api/profile/${userId}/${type}`;
                const res = await axiosInstance.get(endpoint);
                setUsers(res.data);
            } catch (err) {
                setError("Failed to load users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [open, userId, type]);

    const handleUserClick = (targetUserId) => {
        onClose();
        navigate(`/profile/${targetUserId}`);
    };

    return (
        <SimpleModal open={open} onClose={onClose} title={title}>
            {loading ? (
                <div className="flex justify-center p-8">
                    <Loader size="md" />
                </div>
            ) : error ? (
                <div className="text-center text-red-400 font-mono p-4">{error}</div>
            ) : users.length === 0 ? (
                <div className="text-center text-type-3 font-mono p-8 italic">
                    No users found.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {users.map((user) => (
                        <div
                            key={user._id}
                            onClick={() => handleUserClick(user._id)}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer group"
                        >
                            {user.profileImage?.url ? (
                                <img
                                    src={user.profileImage.url}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white/10 group-hover:border-white/30 transition-colors"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-type-2 flex items-center justify-center text-lg font-bold text-type-1 border-2 border-white/10 group-hover:border-white/30 transition-colors font-mono">
                                    {user.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-type-1 font-bold group-hover:text-white transition-colors">
                                    {user.username}
                                </span>
                                {user.bio && (
                                    <span className="text-xs text-type-3 line-clamp-1 max-w-[200px]">
                                        {user.bio}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SimpleModal>
    );
};

export default UserListModal;
