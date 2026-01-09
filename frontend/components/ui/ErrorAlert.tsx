"use client";

import { XMarkIcon, ExclamationCircleIcon } from "./Icons";

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="animate-fade-in-down">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl
                   bg-danger-50 border border-danger-200
                   shadow-soft"
      >
        <div className="flex-shrink-0">
          <ExclamationCircleIcon className="w-5 h-5 text-danger-500" />
        </div>
        <p className="flex-1 text-sm font-medium text-danger-700">{message}</p>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-lg text-danger-400 hover:text-danger-600
                   hover:bg-danger-100 transition-colors duration-200"
          aria-label="Dismiss error"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
