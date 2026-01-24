import { useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { DottedButton } from "@/components/ui/buttons";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await axiosInstance.post("/api/auth/forgot-password", { email });
            setSuccess("Email sent successfully! Please check your inbox.");
            toast.success("Email sent successfully!");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Failed to send email. Please try again."
            );
            toast.error(err.response?.data?.error || "Failed to send email.");
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
                    Forgot Password
                </h2>

                {error && (
                    <div className="mb-4 text-sm text-red-500 text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 text-sm text-green-500 text-center">
                        {success}
                    </div>
                )}

                <div className="formInputDiv">
                    <label className="block mb-1 text-sm text-type-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="textAreaStyle"
                        disabled={loading}
                    />
                </div>

                <div className="flex justify-center w-full mt-6">
                    <DottedButton
                        text={loading ? "Sending..." : "Send Email"}
                        className="w-fit text-lg"
                        onClick={handleSubmit}
                    />
                </div>

                <div className="mt-5 text-center text-sm text-type-3">
                    <Link
                        to="/login"
                        className="underline-animation text-type-1"
                    >
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
