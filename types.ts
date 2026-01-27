import React from 'react';

export enum AppModule {
  COMMERCIAL = 'Commercial',
  ADMISSION = 'Admissions',
  RH = 'RH',
  STUDENT = 'Étudiant',
  PARAMETRES = 'Paramètres'
}

export type ViewId =
  // Commercial
  | 'commercial-dashboard'
  | 'commercial-placer'
  | 'commercial-alternance'
  // Admission
  | 'admission-main'
  // RH
  | 'rh-dashboard' // Main RH view
  | 'rh-fiche'
  | 'rh-cerfa'
  | 'rh-pec'
  | 'rh-ruptures'
  // Others
  | 'etudiant'
  | 'parametres';

export enum AdmissionTab {
  TESTS = 'tests',
  QUESTIONNAIRE = 'questionnaire', // Fiche Étudiant
  DOCUMENTS = 'documents-etudiant',
  ENTREPRISE = 'questionnaire-entreprise', // Fiche Entreprise
  ADMINISTRATIF = 'documents-generes', // Documents générés
  ENTRETIEN = 'entretien'
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: 'blue' | 'orange' | 'green' | 'purple' | 'cyan';
  footerText?: string;
  footerIcon?: React.ReactNode;
  progress?: number;
}

// --- API & DATA TYPES ---

export interface StudentFormData {
  prenom: string;
  nom_naissance: string;
  nom_usage?: string;
  sexe: string;
  date_naissance: string;
  nationalite: string;
  commune_naissance: string;
  departement: string;
  adresse_residence: string;
  code_postal: string;
  ville: string;
  email: string;
  telephone: string;
  nir?: string;
  situation: string;
  regime_social?: string;
  declare_inscription_sportif_haut_niveau: boolean;
  declare_avoir_projet_creation_reprise_entreprise: boolean;
  declare_travailleur_handicape: boolean;
  alternance: boolean;
  dernier_diplome_prepare: string;
  derniere_classe?: string;
  intitulePrecisDernierDiplome?: string;
  bac: string;
  formation_souhaitee: string;
  date_de_visite?: string;
  date_de_reglement?: string;
  entreprise_d_accueil?: string;
  connaissance_rush_how?: string;
  motivation_projet_professionnel?: string;
  agreement?: boolean;

  // Représentant légal (Champs à plat)
  nom_representant_legal?: string;
  numero_legal?: string;
  voie_representant_legal?: string;
  complement_adresse_legal?: string;
  code_postal_legal?: string;
  commune_legal?: string;
  courriel_legal?: string;

  representant_legal_1?: {
    nom: string;
    prenom: string;
    numero: string;
    voie: string;
    complement: string;
    code_postal: string;
    ville: string;
    email: string;
    telephone: string;
  };
  representant_legal_2?: {
    nom: string;
    prenom: string;
    numero: string;
    voie: string;
    complement: string;
    code_postal: string;
    ville: string;
    email: string;
    telephone: string;
  };
}

export interface CompanyFormData {
  identification: {
    raison_sociale: string;
    nom_entreprise?: string;
    siret: string;
    code_ape: string;
    type_employeur: string;
    employeur_specifique?: string | null;
    effectif: string | number;
    code_idcc?: string;
    convention: string;
  };
  adresse: {
    num: string;
    voie: string;
    nom_rue?: string;
    complement?: string;
    code_postal: string;
    ville: string;
    telephone: string;
    email: string;
  };
  representant_legal: {
    nom: string;
    titre?: string;
    telephone_direct?: string;
    email?: string;
  };
  maitre_apprentissage: {
    nom: string;
    prenom: string;
    date_naissance: string;
    numero_securite_sociale?: string;
    fonction: string;
    diplome?: string;
    niveau_diplome?: string;
    experience?: string | number;
    telephone: string;
    email: string;
    deja_maitre_apprentissage?: string;
  };
  opco: {
    nom: string;
    adresse?: string;
    code_postal?: string;
    ville?: string;
  };
  facturation?: {
    code_postal_facturation?: string;
    ville_facturation?: string;
    numero_bon_commande?: string;
  };
  formation: {
    choisie: string;
    date_debut: string;
    date_fin: string;
    code_rncp?: string;
    code_diplome?: string;
    nb_heures?: string | number;
    jours_cours?: string;
  };
  cfa: {
    rush_school: string;
    entreprise: string;
    denomination: string;
    diplome_vise?: string;
    intitule_formation?: string;
    uai: string;
    siret: string;
    adresse: string;
    complement?: string;
    code_postal: string;
    commune: string;
  };
  contrat: {
    nature_contrat?: string;
    type: string;
    type_derogation?: string;
    derogation?: string;
    numero_deca_ancien?: string;
    date_conclusion?: string;
    date_debut_execution?: string;
    date_formation_employeur?: string;
    date_fin_apprentissage?: string;
    date_avenant?: string;
    machines_dangereuses: string;
    duree_hebdo: string;
    poste: string;
    lieu?: string;
    base_calcul_salaire?: string;
    montant_salaire_brut?: number;
    date_debut?: string;
    date_fin?: string;
    nombre_mois?: number;
    caisse_retraite?: string;
  };
  salaire: {
    age: string;
    annee: string;
    pourcentage: number;
    montant: number;
  };
  missions: {
    formation_alternant?: string;
    selectionnees: string[];
  };
  contact_rh: {
    nom_prenom_rh?: string;
    fonction_rh?: string;
    telephone_rh?: string;
    email_rh?: string;
  };
  contact_taxe: {
    fonction_contact?: string;
    telephone_contact?: string;
    email_contact?: string;
  };
  record_id_etudiant?: string;
}

export interface CompanyBackendPayload {
  identification: {
    raison_sociale: string | null;
    nom_entreprise: string | null;
    siret: string | null;
    code_ape_naf: string | null;
    type_employeur: string | null;
    employeur_specifique: string | null;
    nombre_salaries: number | null;
    code_idcc: string | null;
    convention_collective: string | null;
  };
  adresse: {
    numero: string | null;
    voie: string | null;
    nom_rue: string | null;
    complement: string | null;
    code_postal: string | null;
    ville: string | null;
    telephone: string | null;
    email: string | null;
  };
  representant_legal: {
    nom: string | null;
    titre: string | null;
    telephone_direct: string | null;
    email: string | null;
  } | null;
  maitre_apprentissage: {
    nom: string | null;
    prenom: string | null;
    date_naissance: string | null; // date as string
    numero_securite_sociale: string | null;
    fonction: string | null;
    diplome_plus_eleve: string | null;
    niveau_diplome: string | null;
    annees_experience: number | null;
    telephone: string | null;
    email: string | null;
    deja_maitre_apprentissage: string | null;
  };
  opco: {
    nom_opco: string | null;
    adresse: string | null;
    code_postal: string | null;
    ville: string | null;
  };
  facturation: {
    code_postal_facturation: string | null;
    ville_facturation: string | null;
    numero_bon_commande: string | null;
  } | null;
  contact_rh: {
    nom_prenom_rh: string | null;
    fonction_rh: string | null;
    telephone_rh: string | null;
    email_rh: string | null;
  } | null;
  contrat: {
    nature_contrat: string | null;
    type_contrat: string | null;
    type_derogation: string | null;
    date_debut: string | null; // date as string
    date_fin: string | null; // date as string
    nombre_mois: number | null;
    duree_hebdomadaire: string | null;
    poste_occupe: string | null;
    lieu_execution: string | null;
    base_calcul_salaire: string | null;
    montant_salaire_brut: number | null;
    date_conclusion: string | null; // date as string
    date_debut_execution: string | null; // date as string
    numero_deca_ancien_contrat: string | null;
    travail_machine_dangereuse: string | null;
    caisse_retraite: string | null;
    date_avenant: string | null; // date as string
  };
  contact_taxe: {
    fonction_contact: string | null;
    telephone_contact: string | null;
    email_contact: string | null;
  } | null;
  formation_missions: {
    formation_alternant: string | null;
    mission_suggere: string | null;
    formation_choisie: string | null;
    date_debut_formation: string | null; // date as string
    date_fin_formation: string | null; // date as string
    code_rncp: string | null;
    code_diplome: string | null;
    nombre_heures_formation: number | null;
    jours_de_cours: number | null;
    cfaEnterprise: boolean | null;
    DenominationCFA: string | null;
    diplomeVise: string | null;
    intituleDiplome: string | null;
    NumeroUAI: string | null;
    NumeroSiretCFA: string | null;
    AdresseCFA: string | null;
    complementAdresseCFA: string | null;
    codePostalCFA: string | null;
    communeCFA: string | null;
  };
  record_id_etudiant: string | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  record_id?: string;
  data?: T;
  id?: string;
  detail?: any;
}