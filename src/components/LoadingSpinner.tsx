import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-g-blue" />
    </div>
  );
}