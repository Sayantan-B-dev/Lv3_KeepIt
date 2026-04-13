import React, { useState, useEffect } from "react";

const CipherNumber = ({ value, isOffline }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const chars = "0123456789X@#$%&*";

    useEffect(() => {
        if (!isOffline) {
            setDisplayValue(value);
            return;
        }

        const interval = setInterval(() => {
            const length = String(value).length || 3;
            let result = "";
            for (let i = 0; i < length; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            setDisplayValue(result);
        }, 80);

        return () => clearInterval(interval);
    }, [isOffline, value]);

    return <span>{displayValue}</span>;
};

export default CipherNumber;
