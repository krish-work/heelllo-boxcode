"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import {
  LogOutIcon,
  MenuIcon,
  MessageSquareIcon,
  MicIcon,
  PaperclipIcon,
  PlusIcon,
  SendIcon,
  XIcon,
} from "@/components/icons";
import {
  fetchChatHistory,
  sendChat,
  type ChatHistoryItem,
  type User,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type Role = "bot" | "user";

type Message = {
  id: string;
  role: Role;
  content: string;
};

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((word) => word[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

function BotAvatar() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-sm shadow-brand-500/30">
      <svg
        viewBox="0 0 20 20"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m7.5 6.5 3.5 3.5-3.5 3.5" />
        <path d="M12 13.5h2.5" />
      </svg>
    </span>
  );
}

function MessageBubble({ message, user }: { message: Message; user: User }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex items-end gap-3", isUser && "flex-row-reverse")}>
      {isUser ? (
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 text-[11px] font-bold text-white">
          {initials(user.name)}
        </span>
      ) : (
        <BotAvatar />
      )}
      <div
        className={cn(
          "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-6",
          isUser
            ? "rounded-br-md bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-md shadow-brand-500/20"
            : "rounded-bl-md border border-zinc-200 bg-white text-zinc-800 shadow-sm"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-3">
      <BotAvatar />
      <div className="rounded-2xl rounded-bl-md border border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="size-1.5 animate-bounce rounded-full bg-zinc-400"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardShell({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const firstName = user.name.trim().split(/\s+/)[0] || "there";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "bot",
      content: `Hi, I'm Boxcode. How can I help you today, ${firstName}?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  // SpeechRecognition is Chromium-only — check once, lazily.
  const [isVoiceSupported] = useState(
    () =>
      typeof window !== "undefined" &&
      !!(window.SpeechRecognition ?? window.webkitSpeechRecognition)
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const idRef = useRef(0);
  const versionRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");

  const nextId = () => `msg-${idRef.current++}`;

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  // Keep the newest message / typing indicator in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // Load the sidebar's mock chat history from the backend.
  useEffect(() => {
    fetchChatHistory()
      .then(setHistory)
      .catch(() => setHistory([]));
  }, []);

  // Set up the Web Speech API once on mount (Chromium browsers only).
  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      setInput(finalTranscriptRef.current + interim);
      resizeTextarea();
    };

    recognition.onerror = (event) => {
      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setIsListening(false);
      }
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const version = versionRef.current;
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: trimmed },
    ]);
    setInput("");
    setFile(null);
    requestAnimationFrame(() => {
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    });
    setIsTyping(true);

    try {
      const { reply } = await sendChat(trimmed);
      if (versionRef.current !== version) return;
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "bot", content: reply },
      ]);
    } catch {
      if (versionRef.current !== version) return;
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "bot",
          content: "I couldn't reach the backend. Please try again in a moment.",
        },
      ]);
    } finally {
      if (versionRef.current === version) setIsTyping(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    finalTranscriptRef.current = "";
    setInput("");
    requestAnimationFrame(() => {
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    });
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      // Recognition already started — nothing to do.
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    // Allow re-selecting the same file later.
    e.target.value = "";
  };

  const handleNewChat = () => {
    versionRef.current += 1;
    setIsTyping(false);
    setActiveChat(null);
    setInput("");
    setFile(null);
    setMessages([
      {
        id: "greeting",
        role: "bot",
        content: `Hi, I'm Boxcode. How can I help you today, ${firstName}?`,
      },
    ]);
    setSidebarOpen(false);
  };

  const openHistory = (item: ChatHistoryItem) => {
    versionRef.current += 1;
    setIsTyping(false);
    setActiveChat(item.content);
    setFile(null);
    setMessages([{ id: item.id, role: item.role, content: item.content }]);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-svh overflow-hidden bg-zinc-50">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-zinc-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-100 px-4">
          <Logo />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="grid size-9 place-items-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 md:hidden"
            aria-label="Close sidebar"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="p-4">
          <Button onClick={handleNewChat} className="w-full">
            <PlusIcon className="size-4" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Recent chats
          </p>
          <ul className="space-y-1">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openHistory(item)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    activeChat === item.content
                      ? "bg-brand-50 font-medium text-brand-700"
                      : "text-zinc-600 hover:bg-zinc-100"
                  )}
                >
                  <MessageSquareIcon className="size-4 shrink-0" />
                  <span className="truncate">{item.content}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0 border-t border-zinc-100 p-4">
          <div className="flex items-center gap-3">
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-xs font-bold text-white"
              title={user.email}
            >
              {initials(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {user.name}
              </p>
              <p className="truncate text-xs text-zinc-400">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500"
              title="Log out"
              aria-label="Log out"
            >
              <LogOutIcon className="size-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main chat panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/85 px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="grid size-9 place-items-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 md:hidden"
            aria-label="Open sidebar"
          >
            <MenuIcon className="size-5" />
          </button>
          <h1 className="truncate text-sm font-semibold text-zinc-900">
            {activeChat ?? "New chat"}
          </h1>
          <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Connected
          </span>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} user={user} />
            ))}
            {isTyping && <TypingBubble />}
          </div>
        </div>

        {/* Input bar */}
        <div className="shrink-0 border-t border-zinc-200 bg-white">
          <form
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-3xl px-4 py-4 sm:px-6"
          >
            {file && (
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-brand-200 bg-brand-50 py-1 pl-3 pr-1 text-xs font-medium text-brand-700">
                  <PaperclipIcon className="size-3.5 shrink-0" />
                  <span className="max-w-[180px] truncate sm:max-w-xs">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="grid size-5 shrink-0 place-items-center rounded-full text-brand-500 transition-colors hover:bg-brand-100 hover:text-brand-700"
                    aria-label={`Remove ${file.name}`}
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </span>
              </div>
            )}

            <div className="flex items-end gap-1.5 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm transition-colors focus-within:border-brand-400 focus-within:ring-4 focus-within:ring-brand-500/10">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="grid size-9 shrink-0 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
                aria-label="Attach file"
                title="Attach a file"
              >
                <PaperclipIcon className="size-4.5" />
              </button>
              <button
                type="button"
                onClick={toggleListening}
                aria-disabled={!isVoiceSupported}
                aria-label={
                  isVoiceSupported
                    ? isListening
                      ? "Stop voice input"
                      : "Start voice input"
                    : "Voice input not supported"
                }
                title={
                  isVoiceSupported
                    ? isListening
                      ? "Stop listening"
                      : "Voice input"
                    : "Voice input isn't supported in this browser"
                }
                className={cn(
                  "relative grid size-9 shrink-0 place-items-center rounded-full transition-colors",
                  isListening
                    ? "bg-red-500 text-white shadow-md shadow-red-500/30"
                    : isVoiceSupported
                      ? "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                      : "cursor-not-allowed text-zinc-300"
                )}
              >
                {isListening && (
                  <span
                    aria-hidden
                    className="absolute inset-0 animate-ping rounded-full bg-red-400/50"
                  />
                )}
                <MicIcon className="relative size-4.5" />
              </button>
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  resizeTextarea();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask Boxcode anything…"
                className="max-h-40 min-h-[2.25rem] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-6 text-zinc-900 placeholder:text-zinc-400 outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet-500 text-white shadow-md shadow-brand-500/30 transition-all hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:shadow-none"
                aria-label="Send message"
              >
                <SendIcon className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-zinc-400">
              Replies come from the local keyword dataset — no external AI yet.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
