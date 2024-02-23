"use client";

import { Button, Input } from "@nextui-org/react";
import { User } from "@prisma/client";
import { SearchItem } from "./search-item";

interface SearchBarProps {
  profiles: User[];
  owner: User;
  isFollowed: boolean;
}

const SearchBar = ({ profiles, owner, isFollowed }: SearchBarProps) => {
  return (
    <>
      <div className="flex items-center justify-center gap-x-2 mb-4 mt-4 w-full">
        <div className="w-3/4">
          <Input />
        </div>

        <Button variant="ghost">Search</Button>
      </div>
      <div className="flex flex-col gap-2  items-center">
        {profiles.map((profile) => (
          <SearchItem
            profile={profile}
            key={profile.id}
            isFollowed={isFollowed}
            owner={owner}
          />
        ))}
      </div>
    </>
  );
};

export default SearchBar;
