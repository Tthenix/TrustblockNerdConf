"use client";

import { useEffect } from "react";
import { safeCopyToClipboard } from "@/lib/utils";

// Extender la interfaz Window para incluir nuestra propiedad personalizada
declare global {
  interface Window {
    __originalClipboardWriteText?: (text: string) => Promise<void>;
  }
}

/**
 * Componente que corrige los problemas de acceso al portapapeles en entornos restringidos
 * como iframes o sandbox donde la API del portapapeles está bloqueada.
 */
export function ClipboardFix() {
  useEffect(() => {
    // Solo se ejecuta en el cliente
    if (typeof window === "undefined") return;

    // Verificar si estamos en un iframe o entorno restringido
    const isEmbedded = window !== window.parent || window.frameElement !== null;
    
    if (isEmbedded || !navigator.clipboard) {
      console.log("Aplicando fix para el portapapeles en entorno restringido");
      
      // Sobrescribir la API del portapapeles nativa
      if (navigator.clipboard) {
        const originalWriteText = navigator.clipboard.writeText;
        
        // Reemplazar con nuestra implementación segura
        navigator.clipboard.writeText = async (text: string) => {
          try {
            const result = await safeCopyToClipboard(text);
            if (!result) {
              console.warn("No se pudo copiar al portapapeles. Esta funcionalidad está limitada en modo preview.");
            }
            // Devolver una promesa resuelta para mantener la compatibilidad con la API original
            return Promise.resolve();
          } catch (error) {
            console.error("Error al copiar al portapapeles:", error);
            return Promise.resolve();
          }
        };
        
        // Almacenar la referencia original para restaurarla si es necesario
        window.__originalClipboardWriteText = originalWriteText;
      }
    }
    
    // Cleanup al desmontar el componente
    return () => {
      if (window.__originalClipboardWriteText && navigator.clipboard) {
        navigator.clipboard.writeText = window.__originalClipboardWriteText;
        delete window.__originalClipboardWriteText;
      }
    };
  }, []);

  // Este componente no renderiza nada visible
  return null;
}
