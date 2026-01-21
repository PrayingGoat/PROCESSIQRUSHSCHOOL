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