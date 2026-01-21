import React, { FormEvent, useState } from "react";
import { createRoot } from "react-dom/client";
import "../global.css";

const App: React.FC<{}> = () => {
  const [apikey, setApikey] = useState("");
  let api;
  chrome.storage.sync.get("apiKey", (r) => {
    api = r.apikey;
  });
  const save = (e: FormEvent) => {
    e.preventDefault();
    chrome.storage.sync.set({ apiKey: apikey });
  };

  return (
    <div>
      <div>
        <h2>instrustions</h2>
        <p>
          Go to <a href="https://www.omdbapi.com/apikey.aspx">OMDB API</a>
        </p>
        <p>
          Choose <span>FREE! (1,000 daily limit)</span>
        </p>
        <p>Go to your email</p>
        <p>Click the validation link</p>
        <p>Now enter your api key down below</p>
      </div>
      <form onSubmit={save}>
        <label htmlFor="">API Key</label>
        <input
          type="text"
          value={apikey}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setApikey(e.currentTarget.value)
          }
        />
      </form>
    </div>
  );
};

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
