import { format } from "date-fns";
import styles from "./css/SearchHistory.module.css";
import type { SearchHistoryEntry } from "../interfaces/SearchHistoryEntry";
import searchIcon from "../assets/icons/search.png";
import trashIcon from "../assets/icons/trash.png";

type SearchHistoryProps = {
  history: SearchHistoryEntry[];
  onSearch: (entry: SearchHistoryEntry) => void;
  onDelete: (id: string) => void;
};

function SearchHistory({ history, onSearch, onDelete }: SearchHistoryProps) {
  return (
    <section className={styles["search-history"]}>
      <span className={styles["history-title"]}>Search History</span>

      {history.length === 0 ? (
        <p className={styles["history-empty"]}>No searches yet.</p>
      ) : (
        <ul className={styles["history-list"]}>
          {history.map((entry) => {
            const label = `${entry.city}, ${entry.country}`;

            return (
              <li key={entry.id} className={styles["history-item"]}>
                <div className={styles["history-entry"]}>
                  <span className={styles["history-city"]}>{label}</span>
                  <span className={styles["history-timestamp"]}>
                    {format(entry.timestamp, "dd-MM-yyyy hh:mmaaa")}
                  </span>
                </div>
                <div className={styles["history-actions"]}>
                  <button
                    type="button"
                    className={styles["history-action"]}
                    onClick={() => onSearch(entry)}
                    aria-label={`Search weather for ${label} again`}
                  >
                    <img
                      className={styles["history-icon-search"]}
                      src={searchIcon}
                      alt=""
                    />
                  </button>
                  <button
                    type="button"
                    className={styles["history-action"]}
                    onClick={() => onDelete(entry.id)}
                    aria-label={`Remove ${label} from search history`}
                  >
                    <img
                      className={styles["history-icon-trash"]}
                      src={trashIcon}
                      alt=""
                    />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default SearchHistory;
