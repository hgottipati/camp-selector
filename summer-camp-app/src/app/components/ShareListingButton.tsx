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

/**
 * Synchronous copy in the same turn as the click — required for many browsers to honor
 * user activation (async/await before copy often causes silent Clipboard API failure).
 */
function copyWithExecCommand(text: string): boolean {
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.setAttribute('aria-hidden', 'true');
  el.style.position = 'fixed';
  el.style.top = '0';
  el.style.left = '0';
  el.style.width = '2em';
  el.style.height = '2em';
  el.style.padding = '0';
  el.style.border = 'none';
  el.style.outline = 'none';
  el.style.boxShadow = 'none';
  el.style.background = 'transparent';
  document.body.appendChild(el);

  const isIOS = /ipad|iphone|ipod/i.test(navigator.userAgent);
  let ok = false;
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
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  } finally {
    document.body.removeChild(el);
  }
  return ok;
}

async function tryWebShare(title: string, text: string, url: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false;
  }
  const payload: ShareData = { title, text, url };
  let canTry = true;
  if (typeof navigator.canShare === 'function') {
    try {
      canTry = navigator.canShare(payload);
    } catch {
      canTry = false;
    }
  }
  if (!canTry) return false;
  try {
    await navigator.share(payload);
    return true;
  } catch (e) {
    if (isAbortError(e)) return false;
    return false;
  }
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

  const flashCopied = useCallback(() => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, []);

  const runShare = useCallback(() => {
    const url = resolveShareUrl(href);
    const body = text ?? title;

    // 1) Sync copy — same synchronous call stack as the click (critical).
    if (copyWithExecCommand(url)) {
      flashCopied();
      return;
    }

    // 2) Clipboard API — do not await anything before this in the handler.
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(url).then(
        () => {
          flashCopied();
        },
        () => {
          void (async () => {
            const shared = await tryWebShare(title, body, url);
            if (shared) flashCopied();
            else window.prompt('Copy this link (Ctrl+C / ⌘C):', url);
          })();
        },
      );
      return;
    }

    // 3) No clipboard API — try Web Share, then prompt.
    void (async () => {
      const shared = await tryWebShare(title, body, url);
      if (shared) flashCopied();
      else window.prompt('Copy this link (Ctrl+C / ⌘C):', url);
    })();
  }, [href, title, text, flashCopied]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        runShare();
      }}
      className={cn(
        'relative z-20 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1',
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
