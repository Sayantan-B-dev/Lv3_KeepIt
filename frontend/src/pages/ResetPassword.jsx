import { useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { DottedButton } from "@/components/ui/buttons";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post(`/api/auth/reset-password/${resetToken}`, { password });
            toast.success("Password reset successfully! Login with new password.");
            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Failed to reset password. Please try again."
            );
            toast.error(err.response?.data?.error || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="
        w-full
        lg:w-[70%]
        p-8
        rounded-lg
        border border-muted
        glass-panel
        shadow-xl
        font-mono
      "
            >
                <h2 className="text-2xl font-semibold text-type-1 text-center mb-6">
                    Reset Password
                </h2>

                {error && (
                    <div className="mb-4 text-sm text-red-500 text-center">
                        {error}
                    </div>
                )}

                <div className="formInputDiv">
                    <label className="block mb-1 text-sm text-type-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="textAreaStyle"
                        disabled={loading}
                    />
                </div>

                <div className="formInputDiv mt-4">
                    <label className="block mb-1 text-sm text-type-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="textAreaStyle"
                        disabled={loading}
                    />
                </div>

                <div className="flex justify-center w-full mt-6">
                    <DottedButton
                        text={loading ? "Resetting..." : "Reset Password"}
                        className="w-fit text-lg"
                        onClick={handleSubmit}
                    />
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;
