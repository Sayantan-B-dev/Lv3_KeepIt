import React, { useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { ConfirmPopUp } from "@/components/ui";
import { toast } from 'react-toastify';

const DeleteAccountModal = ({ open, onClose }) => {
    const [deleteStep, setDeleteStep] = useState(1);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [serverOtp, setServerOtp] = useState("");
    const [inputOtp1, setInputOtp1] = useState("");
    const [inputOtp2, setInputOtp2] = useState("");

    const handleClose = () => {
        setDeleteStep(1);
        setServerOtp("");
        setInputOtp1("");
        setInputOtp2("");
        setDeleteError(null);
        onClose();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(serverOtp);
        toast.info("Code copied to clipboard!");
    };

    const handleConfirmDeleteAccount = async () => {
        if (deleteLoading) return;

        if (deleteStep === 2) {
            setDeleteLoading(true);
            setDeleteError(null);
            try {
                const res = await axiosInstance.post("/api/profile/request-delete-otp");
                setServerOtp(res.data.otp);
                setDeleteStep(3);
            } catch (err) {
                setDeleteError(err.response?.data?.message || "Failed to generate code");
            } finally {
                setDeleteLoading(false);
            }
            return;
        }

        if (deleteStep === 1) {
            setDeleteStep(2);
            return;
        }

        if (deleteStep === 3) {
            if (!inputOtp1 || !inputOtp2) {
                setDeleteError("Please fill both confirmation fields.");
                return;
            }
            if (inputOtp1 !== inputOtp2) {
                setDeleteError("Confirmation codes do not match.");
                return;
            }
            if (inputOtp1 !== serverOtp) {
                setDeleteError("Invalid code entered.");
                return;
            }

            setDeleteLoading(true);
            setDeleteError(null);
            try {
                // Ensure code is trimmed just in case
                await axiosInstance.delete("/api/profile/MyProfile", { data: { otp: inputOtp1.trim() } });
                window.location.replace("/login");
            } catch (err) {
                setDeleteError(err.response?.data?.error || "Failed to delete account.");
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    return (
        <ConfirmPopUp
            open={open}
            onClose={handleClose}
            onConfirm={handleConfirmDeleteAccount}
            loading={deleteLoading}
            title={
                deleteStep === 1
                    ? "Delete Account"
                    : deleteStep === 2
                        ? "Send Verification Code"
                        : "Verify Deletion"
            }
            confirmText={
                deleteStep === 1
                    ? "Continue"
                    : deleteStep === 2
                        ? "Get Code"
                        : "Permanently Delete"
            }
            message={
                deleteStep === 1 ? (
                    "Are you sure you want to delete your account?"
                ) : deleteStep === 2 ? (
                    "This will permanently delete ALL your categories and notes. This action CANNOT be undone."
                ) : (
                    <div className="flex flex-col gap-4">
                        <div
                            onClick={copyToClipboard}
                            className="bg-red-900/20 p-4 border border-red-500/50 rounded flex flex-col items-center gap-2 cursor-pointer hover:bg-red-900/30 transition group"
                            title="Click to copy"
                        >
                            <p className="text-[10px] uppercase tracking-widest text-red-400 group-hover:text-red-300">
                                Click to Copy Code
                            </p>
                            <p className="text-3xl font-bold tracking-[10px] text-white select-all">
                                {serverOtp}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-xs text-type-3">Type (or paste) the code above:</p>
                            <input
                                type="text"
                                value={inputOtp1}
                                onChange={(e) => setInputOtp1(e.target.value.trim())}
                                className="p-2 border border-gray-600 rounded bg-black text-white text-center tracking-widest font-bold focus:border-red-500 outline-none"
                                placeholder="XXXXXX"
                                maxLength={10}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-xs text-type-3">Type it again to verify:</p>
                            <input
                                type="text"
                                value={inputOtp2}
                                onChange={(e) => setInputOtp2(e.target.value.trim())}
                                className="p-2 border border-gray-600 rounded bg-black text-white text-center tracking-widest font-bold focus:border-red-500 outline-none"
                                placeholder="XXXXXX"
                                maxLength={10}
                            />
                        </div>
                        {deleteError && (
                            <span className="text-red-500 text-xs text-center font-bold">
                                {deleteError}
                            </span>
                        )}
                        <p className="text-[10px] text-center text-type-3 italic">
                            Note: Codes are case-sensitive and must match exactly.
                        </p>
                    </div>
                )
            }
        />
    );
};

export default DeleteAccountModal;
