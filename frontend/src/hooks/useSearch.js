import { useDebouncedCallback } from "@mantine/hooks";
import { useState, useEffect } from "react";

export default function useSearch(
  initialState,
  searchCallback,
  searchDelay = 500
) {
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(initialState);

  useEffect(() => {
    setSearched(initialState);
  }, [initialState]);

  function handleSearchValue(query) {
    if (searchCallback.then) {
      searchCallback(query).then((searchResult) => setSearched(searchResult));
    } else {
      setSearched(searchCallback(query));
    }
    setIsSearching(false);
  }

  const debouncedSearch = useDebouncedCallback(handleSearchValue, searchDelay);

  return {
    search: searched,
    isSearching,
    handleSearch: (query) => {
      setIsSearching(true);
      debouncedSearch(query);
    },
  };
}
