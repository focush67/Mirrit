"use client";

import { useCallback, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { User } from "@prisma/client";
import { SearchItem } from "./search-item";

interface SearchBarProps {
  profiles: User[];
  owner: User;
  isFollowed: boolean;
}

const SearchBar = ({ profiles, owner, isFollowed }: SearchBarProps) => {
  const [filteredProfiles, setFilteredProfiles] = useState<User[]>(profiles);
  const [search, setSearch] = useState("");

  const debouncedFilter = useCallback(
    debounced((searchText: string) => {
      const newFilteredProfiles = profiles.filter((profile) =>
        profile.username.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProfiles(newFilteredProfiles);
    }, 1000),
    [profiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchText = e.target.value;
      setSearch(searchText);
      debouncedFilter(searchText);
    },
    [profiles]
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-x-2 mb-4 mt-4">
        <div className="w-3/4">
          <Input
            value={search}
            onChange={handleChange}
            placeholder="Search User"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-start items-center">
        {filteredProfiles.length === 0 ? (
          <div>No user found</div>
        ) : (
          filteredProfiles.map((profile) => (
            <SearchItem
              profile={profile}
              key={profile.id}
              isFollowed={isFollowed}
              owner={owner}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchBar;

export const debounced = (fn: any, delay: number) => {
  let timerId: any;
  return (...args: any) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
