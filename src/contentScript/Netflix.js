const badge = document.createElement("div");
badge.textContent = "Netflix";
badge.style.cssText = `
  position: fixed;
  z-index: 999999;
  top: 12px;
  right: 12px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(0,0,0,0.75);
  color: white;
  font: 12px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial;
`;
document.documentElement.appendChild(badge);

setTimeout(() => badge.remove(), 2000);

const WHERE_TO_ADD_CLASS = "videoMetadata--line";

const BADGE_ID = "my-imdb-rating-extension-badge";

let apiKey;

chrome.storage.sync.get("apiKey", (r) => {
  apiKey = r.apiKey;
});

async function findFilm(title) {
  if (!apiKey) return null;
  if (!title) return null;
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`,
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (data?.Response === "False") return null;
    return data;
  } catch {
    return null;
  }
}

function getTitleFromPage() {
  const titleEl = document.querySelector(".about-header strong");
  const img = document.querySelector(".previewModal--boxart");

  const title = titleEl?.textContent?.trim() || img?.alt?.trim() || null;

  return title || null;
}

function ensureBadgeContainer() {
  const BADGE_ID = "my-imdb-rating-extension-badge";
  const WHERE_TO_ADD_CLASS = "videoMetadata--line";

  let host = document.querySelector(`.${WHERE_TO_ADD_CLASS}`);
  if (host) host.style.cssText = "margin-bottom: 5px";

  let badge = document.getElementById(BADGE_ID);
  if (!badge) {
    badge = document.createElement("div");
    badge.id = BADGE_ID;

    badge.style.cssText = `
    height: 1.25rem;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
               "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
               sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
               "Segoe UI Symbol", "Noto Color Emoji";
  font-weight: 500;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: inherit;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: 0.25rem;
  font-size:12px;
    `;
    host.appendChild(badge);
  }

  return badge;
}

function setBadgeText(text) {
  const badge = ensureBadgeContainer();
  if (!badge) return;
  badge.textContent = text;
}

(async () => {
  let title = getTitleFromPage();
  const startObservers = async () => {
    const observer = new MutationObserver(async () => {
      const temp = getTitleFromPage();

      if (temp !== title) {
        title = temp;
        const movie = await findFilm(temp);
        if (!movie?.imdbRating) {
          setBadgeText("No IMDb");
        }
        if (movie?.imdbRating === "N/A") {
          setBadgeText("No IMDb");
        }

        setBadgeText(`IMDb ${movie.imdbRating}`);
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  };
  startObservers();
})();
