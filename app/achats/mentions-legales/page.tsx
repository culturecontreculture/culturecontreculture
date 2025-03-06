export default function MentionsLegalesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-primary mb-8 robot-text">
        Mentions Légales
      </h1>

      <div className="space-y-6 text-text-primary">
        <section>
          <h2 className="text-xl font-bold text-primary mb-4">1. Informations légales</h2>
          <p>
            Le site MiniShop est édité par une entité fictive à des fins de démonstration.
            Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">2. Coordonnées</h2>
          <p>
            Siège social : Adresse fictive, 75000 Paris, France<br />
            Numéro de téléphone : +33 (0)1 23 45 67 89<br />
            Email : contact@minishop.fr
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">3. Hébergement</h2>
          <p>
            Le site est hébergé par un hébergeur fictif, situé à une adresse imaginaire.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">4. Données personnelles</h2>
          <p>
            Conformément à la loi Informatique et Libertés du 6 janvier 1978 modifiée, 
            vous disposez d'un droit d'accès, de modification, de rectification et de 
            suppression des données vous concernant.
          </p>
          <p>
            Pour exercer ce droit, contactez-nous par email à : privacy@minishop.fr
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">5. Propriété intellectuelle</h2>
          <p>
            L'ensemble des éléments composant ce site (textes, images, design) 
            sont la propriété exclusive de MiniShop, protégés par les lois sur 
            la propriété intellectuelle.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">6. Limitation de responsabilité</h2>
          <p>
            MiniShop ne peut être tenu responsable des dommages directs ou indirects 
            résultant de l'utilisation de ce site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">7. Cookies</h2>
          <p>
            Ce site utilise des cookies uniquement pour améliorer l'expérience utilisateur 
            et le fonctionnement du site. Ces cookies sont strictement nécessaires au 
            bon fonctionnement du service.
          </p>
        </section>

        <p className="text-text-secondary italic">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>
    </div>
  );
}