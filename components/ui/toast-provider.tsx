"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "hsl(222, 13%, 14%)", // Color de fondo que coincide con el tema oscuro
          color: "white",
          border: "1px solid hsla(190, 95%, 39%, 0.3)",
          fontWeight: "500", // Texto más visible
        },
        className: "border-skyblue/20",
        descriptionClassName: "text-white text-sm mt-1 font-normal", // Texto de descripción en blanco
      }}
    />
  );
}
