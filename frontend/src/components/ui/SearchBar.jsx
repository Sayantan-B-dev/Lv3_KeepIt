const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-type-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-type-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607Z"
          />
        </svg>
      </div>

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          flex-1 h-11 px-5
          rounded-full
          border border-muted
          bg-type-1
          text-type-1
          placeholder:text-type-3
          focus:outline-none
        "
      />
    </div>
  );
};

export default SearchBar;
