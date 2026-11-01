"use client";

import { useState } from "react";

interface ComponentViewerProps {
  children: React.ReactNode;
  code: string;
  previewLabel: string;
  codeLabel: string;
  copyLabel: string;
  copiedLabel: string;
}

export default function ComponentViewer({
  children,
  code,
  previewLabel,
  codeLabel,
  copyLabel,
  copiedLabel,
}: ComponentViewerProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-full border border-white/10 rounded-xl overflow-hidden bg-black/60 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02] gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === "preview"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {previewLabel}
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === "code"
                ? "bg-white text-black"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {codeLabel}
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="shrink-0 px-3 py-1.5 text-xs font-mono text-gray-300 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white active:scale-95 transition-all"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>

      <div className="relative w-full max-w-full overflow-hidden">
        {activeTab === "preview" ? (
          <div className="min-h-[360px] sm:h-[450px] w-full flex items-center justify-center relative overflow-hidden bg-grid-pattern">
            {children}
          </div>
        ) : (
          <div className="w-full max-w-full overflow-x-auto bg-[#050505] max-h-[360px] sm:max-h-[450px] overflow-y-auto">
            <pre className="p-4 sm:p-6 text-xs font-mono text-gray-300 leading-relaxed w-max min-w-full">
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}