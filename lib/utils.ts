import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Comprueba si la API del portapapeles está disponible en el entorno actual.
 * Esto es útil para evitar errores en entornos donde el acceso al portapapeles está bloqueado.
 */
export function isClipboardAvailable() {
  return typeof navigator !== 'undefined' && 
         typeof navigator.clipboard !== 'undefined' && 
         typeof navigator.clipboard.writeText !== 'undefined';
}

/**
 * Copia texto al portapapeles de manera segura, con fallback para entornos donde la API está bloqueada.
 * @param text El texto a copiar
 * @returns Una promesa que se resuelve a true si la copia fue exitosa, false en caso contrario
 */
export async function safeCopyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  
  // Si estamos en el servidor o en un entorno donde window no está definido
  if (typeof window === 'undefined') return false;
  
  try {
    // Si la API del portapapeles está disponible, la usamos
    if (isClipboardAvailable()) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback: usar el método de selección+document.execCommand 
    // (aunque también puede estar bloqueado en algunos entornos)
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch (err) {
      document.body.removeChild(textArea);
      console.warn('Fallback clipboard copy failed:', err);
      return false;
    }
  } catch (err) {
    console.warn('Copy to clipboard failed:', err);
    return false;
  }
}
