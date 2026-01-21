const badge = document.createElement("div");
badge.textContent = "Disney+ CS ✅";
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

const WHERE_TO_ADD_CLASS = "_1aa1a522";
const BADGE_ID = "my-imdb-rating-extension-badge";

async function findFilm(title) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=31951a57`,
    );
    if (!res.ok) return null;

    const data = await res.json();
    if (data?.Response === "False") return null;
    console.log(data);
    return data;
  } catch {
    return null;
  }
}

function getTitleFromPage() {
  const titleEl = document.querySelector('[data-testid="details-tab-title"]');
  const title = titleEl?.textContent?.trim();
  return title && title.length > 0 ? title : null;
}

function ensureBadgeContainer() {
  const host = document.querySelector(`.${WHERE_TO_ADD_CLASS}`);

  if (!host) return null;

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
  background-color: rgb(55, 65, 81);
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
  console.log("Loading");
  let title = getTitleFromPage();
  const startObservers = async () => {
    const observer = new MutationObserver(async () => {
      const temp = getTitleFromPage();
      console.log(title);
      console.log(temp);
      if (temp !== title) {
        title = temp;
        const movie = await findFilm(temp);
        if (!movie?.imdbRating) {
          setBadgeText("N/A");
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
