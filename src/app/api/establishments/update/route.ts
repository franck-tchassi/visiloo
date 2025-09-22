// app/api/establishments/update/route.ts


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismadb';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { GoogleEstablishment, GooglePhoto } from '../../../../../types/google';
import { Prisma } from '@prisma/client';

function isValidObjectId(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

function getGooglePhotoUrl(photo_reference: string, maxwidth = 400) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${photo_reference}&key=${apiKey}`;
}

// ✅ Fonction de traduction des types Google en catégories lisibles
function translateGoogleType(type: string): string {
  const mapping: Record<string, string> = {
    accounting: 'Comptabilité',
    airport: 'Aéroport',
    amusement_park: 'Parc d\'attractions',
    aquarium: 'Aquarium',
    art_gallery: 'Galerie d\'art',
    atm: 'Distributeur automatique',
    bakery: 'Boulangerie',
    bank: 'Banque',
    bar: 'Bar',
    beauty_salon: 'Salon de beauté',
    bicycle_store: 'Magasin de vélos',
    book_store: 'Librairie',
    bowling_alley: 'Bowling',
    bus_station: 'Gare routière',
    cafe: 'Café',
    campground: 'Camping',
    car_dealer: 'Concession automobile',
    car_rental: 'Location de voiture',
    car_repair: 'Réparation automobile',
    car_wash: 'Lavage auto',
    casino: 'Casino',
    cemetery: 'Cimetière',
    church: 'Église',
    city_hall: 'Mairie',
    clothing_store: 'Magasin de vêtements',
    convenience_store: 'Supérette',
    courthouse: 'Palais de justice',
    dentist: 'Dentiste',
    department_store: 'Grand magasin',
    doctor: 'Médecin',
    drugstore: 'Pharmacie',
    electrician: 'Électricien',
    electronics_store: 'Magasin d\'électronique',
    embassy: 'Ambassade',
    fire_station: 'Caserne de pompiers',
    florist: 'Fleuriste',
    funeral_home: 'Pompes funèbres',
    furniture_store: 'Magasin de meubles',
    gas_station: 'Station-service',
    gym: 'Salle de sport',
    hair_care: 'Soin de cheveux',
    hair_salon: 'Salon de coiffure',
    hardware_store: 'Quincaillerie',
    hospital: 'Hôpital',
    insurance_agency: 'Agence d\'assurance',
    jewelry_store: 'Bijouterie',
    laundry: 'Laverie',
    lawyer: 'Avocat',
    library: 'Bibliothèque',
    lodging: 'Hébergement',
    meal_delivery: 'Livraison de repas',
    meal_takeaway: 'À emporter',
    mosque: 'Mosquée',
    movie_theater: 'Cinéma',
    moving_company: 'Entreprise de déménagement',
    museum: 'Musée',
    night_club: 'Boîte de nuit',
    park: 'Parc',
    parking: 'Parking',
    pet_store: 'Animalerie',
    pharmacy: 'Pharmacie',
    police: 'Police',
    post_office: 'Bureau de poste',
    primary_school: 'École primaire',
    real_estate_agency: 'Agence immobilière',
    restaurant: 'Restaurant',
    secondary_school: 'École secondaire',
    shoe_store: 'Magasin de chaussures',
    shopping_mall: 'Centre commercial',
    spa: 'Spa',
    stadium: 'Stade',
    storage: 'Entrepôt',
    store: 'Boutique',
    subway_station: 'Station de métro',
    supermarket: 'Supermarché',
    taxi_stand: 'Station de taxi',
    tourist_attraction: 'Attraction touristique',
    travel_agency: 'Agence de voyage',
    university: 'Université',
    veterinary_care: 'Clinique vétérinaire',
    zoo: 'Zoo',
    electric_vehicle_charging_station: 'Station de recharge électrique',
    rest_stop: 'Aire de repos',
    corporate_office: 'Bureau d\'entreprise',
    farm: 'Ferme',
    ranch: 'Ranch',
    amusement_center: 'Centre de loisirs',
    banquet_hall: 'Salle de banquet',
    botanical_garden: 'Jardin botanique',
    community_center: 'Centre communautaire',
    concert_hall: 'Salle de concert',
    convention_center: 'Centre de congrès',
    cultural_center: 'Centre culturel',
    dance_hall: 'Salle de danse',
    dog_park: 'Parc pour chiens',
    garden: 'Jardin',
    hiking_area: 'Zone de randonnée',
    karaoke: 'Karaoké',
    marina: 'Marina',
    planetarium: 'Planétarium',
    plaza: 'Place',
    roller_coaster: 'Montagnes russes',
    water_park: 'Parc aquatique',
    wedding_venue: 'Lieu de réception',
    wildlife_park: 'Parc animalier',
    wildlife_refuge: 'Refuge pour animaux',
    beach: 'Plage',
    // Types spécifiques aux établissements français
    boulangerie: 'Boulangerie',
    patisserie: 'Pâtisserie',
    fromagerie: 'Fromagerie',
    charcuterie: 'Charcuterie',
    boucherie: 'Boucherie',
    poissonnerie: 'Poissonnerie',
    epicerie: 'Épicerie',
    cave: 'Cave à vin',
    tabac: 'Tabac',
    presse: 'Maison de la presse',
    coiffeur: 'Coiffeur',
    estheticien: 'Esthéticien',
    pharmacie: 'Pharmacie',
    opticien: 'Opticien',
    audioprothesiste: 'Audioprothésiste',
    orthophoniste: 'Orthophoniste',
    kinesitherapeute: 'Kinésithérapeute',
    infirmier: 'Infirmier',
    generaliste: 'Médecin généraliste',
    specialiste: 'Médecin spécialiste',
    laboratoire: 'Laboratoire d\'analyses',
    radiologie: 'Centre de radiologie',
    maternite: 'Maternité',
    ehpad: 'EHPAD',
    maison_retraite: 'Maison de retraite',
    creche: 'Crèche',
    garderie: 'Garderie',
    college: 'Collège',
    lycee: 'Lycée',
    universite: 'Université',
    grande_ecole: 'Grande école',
    auto_ecole: 'Auto-école',
    centre_formation: 'Centre de formation',
    bibliotheque: 'Bibliothèque',
    mediatheque: 'Médiathèque',
    cinema: 'Cinéma',
    theatre: 'Théâtre',
    opera: 'Opéra',
    salle_concert: 'Salle de concert',
    musee: 'Musée',
    galerie: 'Galerie d\'art',
    monument: 'Monument',
    chateau: 'Château',
    eglise: 'Église',
    cathedrale: 'Cathédrale',
    synagogue: 'Synagogue',
    temple: 'Temple',
    mairie: 'Mairie',
    prefecture: 'Préfecture',
    sous_prefecture: 'Sous-préfecture',
    tribunal: 'Tribunal',
    commissariat: 'Commissariat',
    gendarmerie: 'Gendarmerie',
    pompiers: 'Pompiers',
    poste: 'La Poste',
    banque: 'Banque',
    assurance: 'Assurance',
    immobilier: 'Immobilier',
    notaire: 'Notaire',
    avocat: 'Avocat',
    expert_comptable: 'Expert-comptable',
    architecte: 'Architecte',
    bureau_etude: 'Bureau d\'études',
    agence_communication: 'Agence de communication',
    web_agency: 'Agence web',
    developpement: 'Développement informatique',
    design: 'Design',
    marketing: 'Marketing',
    consulting: 'Consulting',
    fast_food: 'Fast-food',
    brasserie: 'Brasserie',
    bistro: 'Bistro',
    discotheque: 'Discothèque',
    hotel: 'Hôtel',
    chambre_hote: 'Chambre d\'hôtes',
    gite: 'Gîte',
    camping: 'Camping',
    auberge_jeunesse: 'Auberge de jeunesse',
    location_voiture: 'Location de voiture',
    garage: 'Garage',
    station_service: 'Station-service',
    transport: 'Transport',
    taxi: 'Taxi',
    bus: 'Bus',
    train: 'Train',
    metro: 'Métro',
    tramway: 'Tramway',
    aeroport: 'Aéroport',
    gare: 'Gare',
    port: 'Port',
    sport: 'Sport',
    stade: 'Stade',
    piscine: 'Piscine',
    gymnase: 'Gymnase',
    tennis: 'Tennis',
    golf: 'Golf',
    ski: 'Ski',
    randonnee: 'Randonnée',
    velo: 'Vélo',
    equitation: 'Équitation',
    fitness: 'Fitness',
    yoga: 'Yoga',
    bien_etre: 'Bien-être',
    institut_beaute: 'Institut de beauté',
    coiffure: 'Coiffure',
    esthetique: 'Esthétique',
    massage: 'Massage',
    sante: 'Santé',
    medecin: 'Médecin',
    hopital: 'Hôpital',
    clinique: 'Clinique',
    dentiste: 'Dentiste',
    veterinaire: 'Vétérinaire',
    animalerie: 'Animalerie',
    jardinage: 'Jardinage',
    bricolage: 'Bricolage',
    decoration: 'Décoration',
    mode: 'Mode',
    habillement: 'Habillement',
    chaussures: 'Chaussures',
    accessoires: 'Accessoires',
    bijoux: 'Bijoux',
    maroquinerie: 'Maroquinerie',
    maison: 'Maison',
    electromenager: 'Électroménager',
    multimedia: 'Multimédia',
    high_tech: 'High-tech',
    jouet: 'Jouet',
    jeu: 'Jeu',
    livre: 'Livre',
    musique: 'Musique',
    film: 'Film',
    art: 'Art',
    loisir: 'Loisir',
    culture: 'Culture',
    tourisme: 'Tourisme',
    evenement: 'Événement',
    festival: 'Festival',
    exposition: 'Exposition',
    conference: 'Conférence',
    formation: 'Formation',
    education: 'Éducation',
    association: 'Association',
    organisme: 'Organisme',
    service: 'Service',
    entreprise: 'Entreprise',
    industrie: 'Industrie',
    artisanat: 'Artisanat',
    agriculture: 'Agriculture',
    elevage: 'Élevage',
    peche: 'Pêche',
    chasse: 'Chasse',
    environnement: 'Environnement',
    energie: 'Énergie',
    construction: 'Construction',
    renovation: 'Rénovation',
    location: 'Location',
    vente: 'Vente',
    achat: 'Achat',
    investissement: 'Investissement',
    finance: 'Finance',
    droit: 'Droit',
    justice: 'Justice',
    securite: 'Sécurité',
    defense: 'Défense',
    politique: 'Politique',
    administration: 'Administration',
    service_public: 'Service public',
    humanitaire: 'Humanitaire',
    caritatif: 'Caritatif',
    religion: 'Religion',
    spiritualite: 'Spiritualité',
    philosophie: 'Philosophie',
    science: 'Science',
    recherche: 'Recherche',
    technologie: 'Technologie',
    innovation: 'Innovation',
    digital: 'Digital',
    numerique: 'Numérique',
    informatique: 'Informatique',
    programmation: 'Programmation',
    communication: 'Communication',
    publicite: 'Publicité',
    relation_publique: 'Relation publique',
    media: 'Média',
    edition: 'Édition',
    journal: 'Journal',
    magazine: 'Magazine',
    television: 'Télévision',
    radio: 'Radio',
    internet: 'Internet',
    reseau_social: 'Réseau social',
    ecommerce: 'E-commerce',
    logistique: 'Logistique',
    distribution: 'Distribution',
    import: 'Import',
    export: 'Export',
    commerce: 'Commerce',
    negociation: 'Négociation',
    management: 'Management',
    direction: 'Direction',
    strategie: 'Stratégie',
    conseil: 'Conseil',
    audit: 'Audit',
    expertise: 'Expertise',
    coaching: 'Coaching',
    recrutement: 'Recrutement',
    ressources_humaines: 'Ressources humaines',
    sante_travail: 'Santé au travail',
    prevention: 'Prévention',
    qualite: 'Qualité',
    securite_travail: 'Sécurité au travail',
    environnement_travail: 'Environnement de travail',
    ergonomie: 'Ergonomie',
    psychologie: 'Psychologie',
    sociologie: 'Sociologie',
    anthropologie: 'Anthropologie',
    histoire: 'Histoire',
    geographie: 'Géographie',
    economie: 'Économie',
    societe: 'Société',
    litterature: 'Littérature',
    danse: 'Danse',
    photographie: 'Photographie',
    peinture: 'Peinture',
    sculpture: 'Sculpture',
    architecture: 'Architecture',
    gastronomie: 'Gastronomie',
    vin: 'Vin',
    oenologie: 'Œnologie',
    voyage: 'Voyage',
    adventure: 'Aventure',
    nature: 'Nature',
    plein_air: 'Plein air',
    competition: 'Compétition',
    detente: 'Détente',
    medecine: 'Médecine',
    paramedical: 'Paramédical',
    social: 'Social',
    enseignement: 'Enseignement',
    ingenierie: 'Ingénierie',
    production: 'Production',
    fabrication: 'Fabrication',
    agroalimentaire: 'Agroalimentaire',
    international: 'International',
    food: 'Alimentation',
    grocery_or_supermarket: 'Épicerie / supermarché',
  };

  return mapping[type] || type.replace(/_/g, ' ');
}

// Fonction pour normaliser les horaires d'ouverture
function normalizeOpeningHours(openingHours: any): any {
  if (!openingHours) return {};
  if (typeof openingHours === 'string') {
    try {
      return JSON.parse(openingHours);
    } catch (error) {
      console.error('Error parsing openingHours string:', error);
      return {};
    }
  }
  if (typeof openingHours === 'object' && openingHours !== null) {
    return openingHours;
  }
  return {};
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }
  if (!user.currentOrganizationId) {
    return NextResponse.json({ error: 'Pas d\'organisation sélectionnée' }, { status: 400 });
  }

  const body = await req.json();

  // Cas Google establishment
  if (body.placeId) {
    const googleEst = body as GoogleEstablishment;
    const photos = Array.isArray(googleEst.photos) ? googleEst.photos : [];

    try {
      // Récupérer les détails complets depuis Google Places
      const detailsResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${googleEst.placeId}&fields=name,formatted_address,geometry,rating,user_ratings_total,opening_hours,photos,website,international_phone_number,types,editorial_summary,business_status&key=${process.env.GOOGLE_MAPS_API_KEY}&language=fr`
      );
      
      const detailsData = await detailsResponse.json();
      
      if (detailsData.status !== 'OK') {
        throw new Error(`Google Places error: ${detailsData.status}`);
      }

      const placeDetails = detailsData.result || {};

      // ✅ Filtrer et traduire les types Google
      const rawTypes = placeDetails.types || [];
      // Filtrer les types non désirés
      const filteredTypes = rawTypes.filter((type: string) => 
        type !== 'establishment' && type !== 'point_of_interest'
      );
      // Traduire les types restants
      const categories = filteredTypes.map(translateGoogleType);

      const description = placeDetails.editorial_summary?.overview || placeDetails.editorialSummary?.overview || '';

      const website = placeDetails.website || '';
      const businessStatus = placeDetails.business_status || 'OPERATIONAL';
      const phone = placeDetails.international_phone_number || googleEst.international_phone_number || '';

      const establishment = await prisma.establishment.upsert({
        where: { organizationId: user.currentOrganizationId },
        update: {
          placeId: googleEst.placeId,
          name: googleEst.name,
          address: googleEst.formatted_address,
          lat: googleEst.geometry.location.lat,
          lng: googleEst.geometry.location.lng,
          rating: placeDetails.rating ?? googleEst.rating ?? 0,
          reviews: placeDetails.user_ratings_total ?? googleEst.user_ratings_total ?? 0,
          phone: phone,
          googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${googleEst.placeId}`,
          city: null,
          country: null,
          postalCode: null,
          openingHours: placeDetails.opening_hours ?? googleEst.opening_hours ?? {},
          isOpen: placeDetails.opening_hours?.open_now ?? googleEst.opening_hours?.open_now ?? false,
          photos: photos as unknown as Prisma.InputJsonValue,
          description,
          categories,
          website,
          businessStatus,
          lastSyncedAt: new Date()
        },
        create: {
          organizationId: user.currentOrganizationId,
          placeId: googleEst.placeId,
          name: googleEst.name,
          address: googleEst.formatted_address,
          lat: googleEst.geometry.location.lat,
          lng: googleEst.geometry.location.lng,
          rating: placeDetails.rating ?? googleEst.rating ?? 0,
          reviews: placeDetails.user_ratings_total ?? googleEst.user_ratings_total ?? 0,
          phone: phone,
          googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${googleEst.placeId}`,
          city: null,
          country: null,
          postalCode: null,
          openingHours: placeDetails.opening_hours ?? googleEst.opening_hours ?? {},
          isOpen: placeDetails.opening_hours?.open_now ?? googleEst.opening_hours?.open_now ?? false,
          photos: photos as unknown as Prisma.InputJsonValue,
          description,
          categories,
          website,
          businessStatus,
          lastSyncedAt: new Date()
        },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { selectedEstablishmentId: establishment.id },
      });

      return NextResponse.json({ 
        success: true, 
        establishment,
        message: 'Établissement créé/mis à jour avec toutes les informations'
      });

    } catch (error) {
      console.error('Error fetching place details:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des détails Google Places' },
        { status: 500 }
      );
    }
  }

  // Cas établissement en base
  else if (body.establishmentId) {
    const establishmentId: string = body.establishmentId;

    if (!isValidObjectId(establishmentId)) {
      return NextResponse.json({ error: 'ID établissement invalide (format MongoDB requis)' }, { status: 400 });
    }

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { selectedEstablishmentId: establishmentId },
      });

      const establishment = await prisma.establishment.findUnique({
        where: { id: establishmentId }
      });

      return NextResponse.json({ success: true, establishment });
    } catch (error) {
      console.error('Error selecting establishment:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la sélection de l\'établissement' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: 'Mauvais paramètres : placeId ou establishmentId requis' }, { status: 400 });
}