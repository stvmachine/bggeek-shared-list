"use client";

// Simple toast implementation
export const toaster = {
  create: (options: { title?: string; description?: string; type?: string; duration?: number }) => {
    console.log("Toast:", options.title, options.description);
  }
};

export const Toaster = () => {
  return null;
};
