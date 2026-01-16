import React from 'react';

export enum AppModule {
  COMMERCIAL = 'Commercial',
  ADMISSION = 'Admission',
  RH = 'RH',
  STUDENT = 'Étudiant'
}

export enum AdmissionTab {
  TESTS = 'tests',
  ENTRETIEN = 'entretien',
  DOCUMENTS = 'documents',
  QUESTIONNAIRE = 'questionnaire', // Fiche Étudiant
  ENTREPRISE = 'entreprise', // Fiche Entreprise
  ADMINISTRATIF = 'administratif' // Documents générés
}

export enum RHTab {
  FICHE_ENTREPRISE = 'fiche_entreprise',
  CERFA = 'cerfa',
  PEC = 'pec',
  RUPTURES = 'ruptures',
  SUIVI = 'suivi'
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