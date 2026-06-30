import { useState, useCallback } from 'react';
import { tryCopy } from '../utils/rateLimiter.js';
import { sanitizeText } from '../utils/sanitizer.js';

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  const copy = useCallback(async (text, label = 'Copied to clipboard') => {
    if (!tryCopy()) {
      setToast({ message: 'Too many requests, please slow down', type: 'error' });
      setTimeout(() => setToast(null), 2000);
      return false;
    }

    const sanitized = sanitizeText(text);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(sanitized);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = sanitized;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setToast({ message: label, type: 'success' });
      setTimeout(() => {
        setCopied(false);
        setToast(null);
      }, 2000);
      return true;
    } catch {
      setToast({ message: 'Failed to copy', type: 'error' });
      setTimeout(() => setToast(null), 2000);
      return false;
    }
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  }, []);

  return { copied, toast, copy, showToast };
}
