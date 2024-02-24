"use client";

import { useCallback, useState, useTransition } from "react";
import { Input } from "@nextui-org/react";
import { User } from "@prisma/client";
import { SearchItem } from "./search-item";
import { onRemoveFollower, onUnfollow } from "@/server_actions/follow";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  removeFollower,
  removeRelationship,
} from "@/redux_store/slices/users/user-slice";

interface SearchBarProps {
  profiles: User[];
  owner: User;
  isFollowed: boolean;
}

const SearchBar = ({ profiles, owner, isFollowed }: SearchBarProps) => {
  const [filteredProfiles, setFilteredProfiles] = useState<User[]>(profiles);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [trigger, setTrigger] = useState(false);
  const dispatch = useDispatch();

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

  const handleUnfollow = (profile: User) => {
    startTransition(() => {
      onUnfollow(profile.id)
        .then(() => {
          toast.success(`Unfollowed ${profile.username}`);
          dispatch(
            removeRelationship({
              initiator: owner.id,
              target: profile.id,
            })
          );
        })
        .catch(() => toast.error(`Error unfollowing ${profile.username}`));
    });
  };

  const handleRemoveFollower = (profile: User) => {
    startTransition(() => {
      onRemoveFollower(profile.id).then(() => {
        toast.success(`Removed ${profile.username} from followers`);
        dispatch(
          removeFollower({
            initiator: owner.id,
            target: profile.id,
          })
        );
      });
    });
  };

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
              handleUnfollow={handleUnfollow}
              handleRemoveFollower={handleRemoveFollower}
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
