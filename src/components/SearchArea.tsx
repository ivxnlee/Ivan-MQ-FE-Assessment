import searchIcon from "../assets/icons/search.png";

type SearchAreaProps = {
  cityName: string;
  setCityName: React.Dispatch<React.SetStateAction<string>>;
  onSearch: (city: string) => void;
  loading: boolean;
};

function SearchArea({
  cityName,
  setCityName,
  onSearch,
  loading,
}: SearchAreaProps) {
  return (
    <div className="controls" role="search">
      <div className="field">
        <label className="field-label" htmlFor="cityInput">
          City or Country
        </label>
        <input
          type="text"
          placeholder="Enter city or country name"
          id="cityInput"
          name="city"
          value={cityName}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-describedby="cityInputHint"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch(e.currentTarget.value);
            }
          }}
          onChange={(e) => setCityName(e.target.value)}
        />
        <span id="cityInputHint" className="visually-hidden">
          Press Enter or use the search button to look up the weather.
        </span>
      </div>
      <button
        type="button"
        onClick={() => onSearch(cityName)}
        disabled={loading}
        aria-label={loading ? "Searching" : "Search"}
        aria-busy={loading}
      >
        <img
          src={searchIcon}
          style={{ width: "80%", height: "auto" }}
          alt=""
          // Decorative: the button's aria-label provides the accessible name.
        />
      </button>
    </div>
  );
}

export default SearchArea;
