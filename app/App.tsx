"use client";

import { useCallback } from "react";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function App() {
  const { scheme, setScheme } = useColorScheme("light");

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[ChatKitPanel] widget action", action);
    }
  }, []);

  const handleResponseEnd = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[ChatKitPanel] response end");
    }
  }, []);

  const handleClose = useCallback(() => {
    // Send message to parent window to close the chat
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'CLOSE_CHAT' }, '*');
    }
  }, []);

  return (
    <main className="flex h-screen flex-col bg-white overflow-hidden">
      {/* Custom Header - Fixed */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
            <img
              src="/avatar.png"
              alt="Annie"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">Annie</h2>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
            <p className="text-xs text-gray-500 -mt-0.5">Online</p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close chat"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-gray-600"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* ChatKit Panel - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ChatKitPanel
          theme={scheme}
          onWidgetAction={handleWidgetAction}
          onResponseEnd={handleResponseEnd}
          onThemeRequest={setScheme}
        />
      </div>
    </main>
  );
}
