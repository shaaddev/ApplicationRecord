"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SUGGESTIONS, type Suggestions } from "@/lib/suggestions";

const SuggestionsContext = createContext<Suggestions>(DEFAULT_SUGGESTIONS);

/**
 * Makes the user's past entries available to the application form no matter
 * where the dialog is opened from (page header, row actions, cards).
 */
export function SuggestionsProvider({
  suggestions,
  children,
}: {
  suggestions: Suggestions;
  children: React.ReactNode;
}) {
  return <SuggestionsContext.Provider value={suggestions}>{children}</SuggestionsContext.Provider>;
}

export function useSuggestions() {
  return useContext(SuggestionsContext);
}
