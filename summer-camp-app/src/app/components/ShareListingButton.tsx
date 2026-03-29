"use client";

import { useCallback, useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { cn } from './ui/utils';

function resolveShareUrl(href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  if (typeof window === "undefined") {
    return href;
  }
  return new URL(href, window.location.origin).href;
}

type ShareListingButtonProps = {
  /** Relative app path (e.g. `/campground/id`) or absolute URL. */
  href: string;
  title: string;
  text?: string;
  className?: string;
  /** Icon-only control (e.g. card toolbar). */
  compact?: boolean;
};

export function ShareListingButton({ href, title, text, className, compact }: ShareListingButtonProps) {
  const [copied, setCopied] = useState(false);

  const share = useCallback(async () => {
    const url = resolveShareUrl(href);
    const body = text ?? title;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: body, url });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [href, title, text]);

  return (
    <button
      type="button"
      onClick={() => void share()}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1",
        compact ? "size-9 shrink-0 p-0" : "px-3 py-2",
        className,
      )}
      aria-label={copied ? "Link copied" : `Share ${title}`}
    >
      {copied ? (
        <Check className="size-4 text-green-600" aria-hidden />
      ) : (
        <Share2 className="size-4" aria-hidden />
      )}
      {!compact && <span>{copied ? "Copied" : "Share"}</span>}
    </button>
  );
}
