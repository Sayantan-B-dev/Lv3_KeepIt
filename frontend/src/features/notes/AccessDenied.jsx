import React from "react";
import { useNavigate } from "react-router-dom";
import { ErrorState } from "@/components/ui";

const AccessDenied = ({ error, redirect, buttonText }) => {
    const navigate = useNavigate();
    const isPrivateErr = error?.toLowerCase().includes("private") || error?.toLowerCase().includes("authorized");

    return (
        <ErrorState
            type={isAccessDeniedError(error) ? "access" : "error"}
            title={isPrivateErr ? "Access Restricted" : "Note Unavailable"}
            message={isPrivateErr
                ? "You cannot see this doc file. This content has been set to private by the owner."
                : error || "Failed to load note."}
            onBack={redirect ? () => navigate(redirect) : undefined}
            // If buttonText is provided, we can potentially pass it but ErrorState handles it mostly
        />
    );
};

const isAccessDeniedError = (err) => {
    const msg = String(err).toLowerCase();
    return msg.includes("private") || msg.includes("authorized") || msg.includes("denied") || msg.includes("login");
};

export default AccessDenied;
