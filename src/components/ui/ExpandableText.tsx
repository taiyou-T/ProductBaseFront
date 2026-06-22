"use client";

import { useLayoutEffect, useRef, useState } from "react";

type ExpandableTextProps = {
  text: string;
  className?: string;
  clampClassName?: string;
};

export function ExpandableText({
  text,
  className = "text-sm text-zinc-600 dark:text-zinc-400",
  clampClassName = "line-clamp-2",
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (expanded) return;

    const el = bodyRef.current;
    if (!el) return;

    const checkTruncation = () => {
      setTruncated(el.scrollHeight > el.clientHeight + 1);
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);

    return () => window.removeEventListener("resize", checkTruncation);
  }, [text, expanded]);

  const showToggle = truncated || expanded;

  return (
    <>
      <p
        ref={bodyRef}
        className={
          expanded
            ? `whitespace-pre-wrap ${className}`
            : `whitespace-pre-wrap ${clampClassName} ${className}`
        }
      >
        {text}
      </p>
      {showToggle && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
          aria-expanded={expanded}
        >
          {expanded ? "閉じる" : "続きを読む"}
        </button>
      )}
    </>
  );
}
