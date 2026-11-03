"use client";

import { useState } from "react";

export default function CliCommandBar({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl text-sm text-gray-300 font-mono w-full sm:w-max max-w-full shadow-lg">
      <div className="overflow-x-auto sm:overflow-visible whitespace-nowrap select-all py-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <span>{command}</span>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy CLI command"
        className="shrink-0 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-xs font-mono text-white transition-all"
      >
        {copied ? (
          <span className="text-emerald-400 font-semibold">Copied</span>
        ) : (
          <span>Copy</span>
        )}
      </button>
    </div>
  );
}
