// app/page.tsx
export default function HomePage() {
  return (
    <div className="homepage">
      {/* Deux colonnes */}
      <div className="columns">
        <div className="column">
          <a href="https://tix.to/saezAR">
            <img src="https://www.saez.mu/saez_apocalypse_tour.jpg" alt="SAEZ Apocalypse Tour" />
          </a>
        </div>

        <div className="column">
          <div className="content">
            <a href="https://poesie.culturecontreculture.fr/">
              <img src="/saez_poesie_anthologie.jpg" alt="Saez Poésie Anthologie" />
            </a>
            <p>Damien Saez, Poésie - Anthologie 1999-2024.</p>
            <p><a href="https://poesie.culturecontreculture.fr/">poesie.culturecontreculture.fr</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}