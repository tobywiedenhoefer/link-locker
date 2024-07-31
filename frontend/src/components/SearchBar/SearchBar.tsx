import React, { useState } from "react";
import "./SearchBar.css";

type SearchBarProps = {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
};

export default function SearchBar({ setFilter }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setFilter(searchTerm);
    }
  };
  const onClick = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setFilter(searchTerm);
  };
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search..."
        onKeyDown={onKeyDown}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" onClick={onClick}>
        Filter
      </button>
    </div>
  );
}
