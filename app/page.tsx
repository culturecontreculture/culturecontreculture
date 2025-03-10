import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="homepage">
      {/* Deux colonnes */}
      <div className="columns">
        <div className="column">
          <a href="https://tix.to/saezAR" target="_blank" rel="noopener noreferrer">
            <Image 
              src="/saez_apocalypse_tour.jpg"
              alt="SAEZ Apocalypse Tour"
              width={600}
              height={400}
              priority
              style={{ width: '100%', height: 'auto' }}
            />
          </a>
        </div>
        <div className="column">
          <div className="content">
            <Link href="/achats" prefetch={false}>
              <Image 
                src="/saez_poesie_anthologie.jpg"
                alt="Saez Poésie Anthologie"
                width={600}
                height={400}
                priority
                style={{ width: '100%', height: 'auto' }}
              />
            </Link>
            <p>Damien Saez, Poésie - Anthologie 1999-2024</p>
            <p><a href="https://poesie.culturecontreculture.fr/" target="_blank" rel="noopener noreferrer">poesie.culturecontreculture.fr</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}