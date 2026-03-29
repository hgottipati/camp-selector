"use client";

import { useCallback, useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { cn } from './ui/utils';

function resolveShareUrl(href: string): string {
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href;
  }
  if (typeof window === 'undefined') {
    return href;
  }
  return new URL(href, window.location.origin).href;
}

function isAbortError(e: unknown): boolean {
  return (
    (typeof DOMException !== 'undefined' && e instanceof DOMException && e.name === 'AbortError') ||
    (e instanceof Error && e.name === 'AbortError')
  );
}

/** Works when Clipboard API is blocked (some Safari / embedded WebViews / strict policies). */
function copyWithExecCommand(text: string): boolean {
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'fixed';
  el.style.top = '0';
  el.style.left = '0';
  el.style.width = '1px';
  el.style.height = '1px';
  el.style.padding = '0';
  el.style.border = 'none';
  el.style.outline = 'none';
  el.style.boxShadow = 'none';
  el.style.background = 'transparent';
  document.body.appendChild(el);

  const isIOS = /ipad|iphone|ipod/i.test(navigator.userAgent);
  try {
    if (isIOS) {
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      el.setSelectionRange(0, 999999);
    } else {
      el.focus();
      el.select();
    }
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    document.body.removeChild(el);
  }
}

async function copyUrlToClipboard(url: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    /* fall through */
  }
  return copyWithExecCommand(url);
}

type ShareListingButtonProps = {
  href: string;
  title: string;
  text?: string;
  className?: string;
  compact?: boolean;
};

export function ShareListingButton({ href, title, text, className, compact }: ShareListingButtonProps) {
  const [copied, setCopied] = useState(false);

  const share = useCallback(async () => {
    const url = resolveShareUrl(href);
    const body = text ?? title;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      const payload: ShareData = { title, text: body, url };
      const canTry = typeof navigator.canShare !== 'function' || navigator.canShare(payload);
      if (canTry) {
        try {
          await navigator.share(payload);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
          return;
        } catch (e) {
          if (isAbortError(e)) return;
          /* User gesture still valid: fall through to copy */
        }
      }
    }

    const ok = await copyUrlToClipboard(url);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      return;
    }

    window.prompt('Copy this link (press Ctrl+C / ⌘C):', url);
  }, [href, title, text]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void share();
      }}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1',
        compact ? 'size-9 shrink-0 p-0' : 'px-3 py-2',
        className,
      )}
      aria-label={copied ? 'Link copied' : `Share ${title}`}
    >
      {copied ? (
        <Check className="size-4 text-green-600" aria-hidden />
      ) : (
        <Share2 className="size-4" aria-hidden />
      )}
      {!compact && <span>{copied ? 'Copied' : 'Share'}</span>}
    </button>
  );
}
