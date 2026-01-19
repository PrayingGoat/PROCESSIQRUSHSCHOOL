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
  ENTRETIEN = 'entretien',
  DOCUMENTS = 'documents-etudiant',
  QUESTIONNAIRE = 'questionnaire', // Fiche Étudiant
  ENTREPRISE = 'questionnaire-entreprise', // Fiche Entreprise
  ADMINISTRATIF = 'documents-generes' // Documents générés
}

export enum RHTab {
  FICHE_ENTREPRISE = 'fiche-entreprise',
  CERFA = 'cerfas',
  PEC = 'prises-en-charge',
  RUPTURES = 'ruptures'
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