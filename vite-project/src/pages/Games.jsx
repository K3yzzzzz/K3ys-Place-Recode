import { useEffect, useState } from "react";

export function Games() {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");

  const zonesurls = [
    "https://cdn.jsdelivr.net/gh/gn-math/assets@main/zones.json",
    "https://cdn.jsdelivr.net/gh/gn-math/assets@latest/zones.json",
    "https://cdn.jsdelivr.net/gh/gn-math/assets@master/zones.json",
    "https://cdn.jsdelivr.net/gh/gn-math/assets/zones.json",
  ];

  const coverURL = "https://cdn.jsdelivr.net/gh/gn-math/covers@main";
  const htmlURL = "https://cdn.jsdelivr.net/gh/gn-math/html@main";

  useEffect(() => {
    async function fetchGames() {
      try {
        const url = zonesurls[Math.floor(Math.random() * zonesurls.length)];
        const res = await fetch(url);
        const data = await res.json();
        setGames(data.slice(1));
      } catch (err) {
        console.error("Failed to load games:", err);
      }
    }
    fetchGames();
  }, []);

  const filteredGames = games.filter(
    (game) =>
      game.name && game.name.toLowerCase().includes(search.toLowerCase()),
  );

  function openGame(zone) {
    const url = zone.url
      .replace("{COVER_URL}", coverURL)
      .replace("{HTML_URL}", htmlURL);

    fetch(url + "?t=" + Date.now())
      .then((response) => response.text())
      .then((html) => {
        html = html.replace(/<link rel="manifest".*?>/i, "");
        document.documentElement.innerHTML = html;

        const popup = document.createElement("div");
        popup.innerText = "Game loaded!";
        popup.className =
          "fixed bottom-5 right-5 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow-lg font-sans z-50";
        document.body.appendChild(popup);

        setTimeout(() => popup.remove(), 3000);
      })
      .catch((err) => console.error("Failed to load game:", err));
  }

  return (
    <div className="flex flex-col items-center min-h-screen overflow-auto">
      {/* Search input */}
      <input
        type="text"
        placeholder="Search for a game..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input w-96 fixed top-0 left-1/2 -translate-x-1/2 z-50 mt-13 bg-base-100 backdrop-blur-3xl"
      />

      {/* Grid of games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-24 px-4 w-full max-w-6xl">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => openGame(game)}
            className="cursor-pointer transform hover:scale-105 transition duration-200"
          >
            <div className="rounded-xl shadow-lg overflow-hidden">
              <img
                src={`${coverURL}/${game.id}.png`}
                alt={game.name}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-3 text-center">
                <h2 className="font-semibold text-sm">{game.name}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
