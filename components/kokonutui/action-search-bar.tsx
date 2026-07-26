"use client";

/**
 * Adapted from "Action Search Bar" by @kokonutui
 * @license MIT
 * @website https://kokonutui.com
 * @github https://github.com/kokonut-labs/kokonutui
 *
 * Repurposed here to search real site content: cities, services, and blog guides.
 */

import { Search, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { SEARCH_ENTRIES, iconForType, type SearchAction } from "@/lib/search-data";

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: { height: { duration: 0.4 }, staggerChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { height: { duration: 0.3 }, opacity: { duration: 0.2 } },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  },
} as const;

export default function ActionSearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 150);

  const filtered = useMemo(() => {
    if (!debouncedQuery) return SEARCH_ENTRIES.slice(0, 6);
    const q = debouncedQuery.toLowerCase().trim();
    return SEARCH_ENTRIES.filter((a) =>
      `${a.label} ${a.description || ""}`.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [debouncedQuery]);

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(-1);
  }, []);

  const goTo = useCallback(
    (action: SearchAction) => {
      router.push(action.href);
      onNavigate?.();
    },
    [router, onNavigate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!filtered.length) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && filtered[activeIndex]) goTo(filtered[activeIndex]);
          break;
      }
    },
    [filtered, activeIndex, goTo]
  );

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="relative flex flex-col items-center justify-start">
        <div className="w-full">
          <div className="relative">
            <Input
              autoFocus
              aria-autocomplete="list"
              aria-expanded={isFocused}
              autoComplete="off"
              className="h-12 rounded-xl py-2 pr-10 pl-4 text-base focus-visible:ring-offset-0"
              onChange={handleQueryChange}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search cities, services, or guides..."
              role="combobox"
              type="text"
              value={query}
            />
            <div className="absolute top-1/2 right-3.5 h-5 w-5 -translate-y-1/2">
              <AnimatePresence mode="popLayout">
                {query.length > 0 ? (
                  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} key="send">
                    <Send className="h-5 w-5 text-teal-500" />
                  </motion.div>
                ) : (
                  <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} key="search">
                    <Search className="h-5 w-5 text-slate-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="w-full">
          <AnimatePresence>
            {isFocused && filtered.length > 0 && (
              <motion.div
                animate="show"
                aria-label="Search results"
                className="mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                exit="exit"
                initial="hidden"
                role="listbox"
                variants={ANIMATION_VARIANTS.container}
              >
                <motion.ul role="none">
                  {filtered.map((action, i) => {
                    const Icon = iconForType(action.iconType);
                    return (
                      <motion.li
                        aria-selected={activeIndex === i}
                        className={
                          "flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-slate-50 " +
                          (activeIndex === i ? "bg-teal-50" : "")
                        }
                        key={action.id}
                        layout
                        onClick={() => goTo(action)}
                        role="option"
                        variants={ANIMATION_VARIANTS.item}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
                            <Icon className="h-4 w-4 text-teal-600" />
                          </span>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{action.label}</p>
                            {action.description && (
                              <p className="text-slate-400 text-xs">{action.description}</p>
                            )}
                          </div>
                        </div>
                        {action.end && (
                          <span className="text-slate-400 text-xs font-medium">{action.end}</span>
                        )}
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
