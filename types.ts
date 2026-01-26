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
}

export interface CompanyFormData {
  identification: {
    raison_sociale: string;
    siret: string;
    code_ape: string;
    type_employeur: string;
    effectif: string | number;
    convention: string;
  };
  adresse: {
    num: string;
    voie: string;
    complement?: string;
    code_postal: string;
    ville: string;
    telephone: string;
    email: string;
  };
  representant_legal: {
    nom_prenom: string;
    fonction: string;
    telephone?: string;
    email?: string;
  };
  maitre_apprentissage: {
    nom: string;
    prenom: string;
    date_naissance: string;
    fonction: string;
    diplome?: string;
    experience?: string | number;
    telephone: string;
    email: string;
  };
  opco: {
    nom: string;
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
    type: string;
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
    email_rh?: string;
  };
  contact_taxe: {
    fonction_contact?: string;
    email_contact?: string;
  };
  record_id_etudiant?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  record_id?: string;
  data?: T;
  id?: string;
  detail?: any;
}