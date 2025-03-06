export default function ConditionsGeneralesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-primary mb-8 robot-text">
        Conditions Générales de Vente
      </h1>

      <div className="space-y-6 text-text-primary">
        <section>
          <h2 className="text-xl font-bold text-primary mb-4">1. Préambule</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) définissent les conditions 
            contractuelles de vente de produits entre MiniShop et ses clients.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">2. Produits</h2>
          <p>
            Les produits proposés sont ceux qui figurent sur le site au moment de la commande. 
            Les photographies et descriptions des produits sont fournies à titre indicatif 
            et peuvent légèrement varier du produit réel.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">3. Prix</h2>
          <p>
            Les prix sont indiqués en euros, toutes taxes comprises. MiniShop se réserve 
            le droit de modifier ses prix à tout moment, étant entendu que le prix figurant 
            sur le site le jour de la commande sera le seul applicable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">4. Commande</h2>
          <p>
            Toute commande vaut acceptation des prix, des descriptions et des CGV en vigueur. 
            Le client déclare avoir la capacité de contracter, c'est-à-dire être majeur 
            et ne pas faire l'objet d'une mesure de protection juridique.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">5. Paiement</h2>
          <p>
            Le règlement des achats s'effectue par carte bancaire via un système de paiement 
            sécurisé. Le paiement est exigible immédiatement à la commande.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">6. Livraison</h2>
          <p>
            Les délais de livraison sont donnés à titre indicatif. Un dépassement éventuel 
            ne pourra donner lieu à des dommages et intérêts, ni à une annulation de la commande.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">7. Rétractation</h2>
          <p>
            Conformément à la législation, le client dispose d'un délai de 14 jours 
            à compter de la réception des produits pour exercer son droit de rétractation, 
            sans avoir à justifier de motifs ni à payer de pénalités.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">8. Garantie</h2>
          <p>
            Les produits bénéficient de la garantie légale contre les défauts cachés. 
            En cas de problème, le client devra contacter le service client dans un délai 
            de 30 jours suivant la découverte du défaut.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">9. Données personnelles</h2>
          <p>
            Les informations collectées font l'objet d'un traitement informatique. 
            Conformément à la loi Informatique et Libertés, le client dispose d'un droit 
            d'accès, de modification et de suppression des données personnelles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary mb-4">10. Litiges</h2>
          <p>
            En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. 
            En cas de contestation, les tribunaux compétents seront ceux du lieu du siège social.
          </p>
        </section>

        <p className="text-text-secondary italic">
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>
    </div>
  );
}