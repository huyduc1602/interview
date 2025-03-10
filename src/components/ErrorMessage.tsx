import React from "react";
interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{message}</span>
        </div>
    );
}