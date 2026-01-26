import React, { FormEvent, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";

const App: React.FC = () => {
  const [apikey, setApikey] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(["apiKey"], (r) => {
      if (r?.apiKey) {
        (setApikey(r.apiKey), setSaved(true));
      }
      setLoading(false);
    });
  }, []);

  const findFilm = async (title) => {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apikey}`,
      );

      if (!res.ok) return false;

      const data = await res.json();
      if (data?.Response === "False") return false;
      return true;
    } catch {
      return false;
    }
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    const film = await findFilm("The devil wears prada");
    if (film) {
      chrome.storage.sync.set({ apiKey: apikey }, () => {
        setSaved(true);
      });
    } else {
      setError(
        "Error: API Key Failed, please check your email and make sure it is correct and validated",
      );
    }
  };

  return (
    <div className="popup">
      <header className="popup__header">
        <div>
          <div className="popup__title">OMDb Setup</div>
          <div className="popup__subtitle">
            Add your API key to start searching movies
          </div>
        </div>
        <span className="popup__badge">FREE</span>
      </header>

      <main className="popup__card">
        <h2 className="popup__h2">Instructions</h2>
        <ol className="popup__steps">
          <li>
            Go to{" "}
            <a
              className="popup__link"
              href="https://www.omdbapi.com/apikey.aspx"
              target="_blank"
              rel="noreferrer"
            >
              OMDb API
            </a>
          </li>
          <li>
            Choose <span className="popup__pill">FREE (1,000/day)</span>
          </li>
          <li>Check your email</li>
          <li>Click the validation link</li>
          <li>Paste your API key below</li>
        </ol>
        <div className="error">{error ? <p>{error}</p> : ""}</div>
        <form className="popup__form" onSubmit={save}>
          <label className="popup__label" htmlFor="apiKey">
            API Key
          </label>
          <div className="popup__fieldRow">
            <input
              id="apiKey"
              className="popup__input"
              type="text"
              value={apikey}
              placeholder={
                loading
                  ? "Loading..."
                  : apikey
                    ? "Api Key Saved"
                    : "e.g. 123abc456def"
              }
              onChange={(e) => setApikey(e.target.value)}
              disabled={loading}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              className="popup__button"
              type="submit"
              disabled={loading || apikey.trim().length === 0}
              title={
                apikey.trim().length === 0 ? "Enter your key first" : "Save key"
              }
            >
              Save
            </button>
          </div>
          <div className="popup__helpRow">
            <span className="popup__hint">
              Stored <code className="popup__code">on your computer</code>
            </span>
            {saved && <span className="popup__saved">Saved ✓</span>}
          </div>
          <div className="popup__helpRow">
            <span className="popup__hint">
              IMDb Score may not always be upto date
            </span>
          </div>
        </form>
      </main>

      <a
        className="bmc-button"
        href="https://buymeacoffee.com/ollandagreat"
        target="_blank"
        rel="noopener"
        style={{
          width: `330px`,
        }}
      >
        <img src="./coffee.png" alt="☕️" />
        Buy me a coffee
      </a>
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
createRoot(container).render(<App />);
