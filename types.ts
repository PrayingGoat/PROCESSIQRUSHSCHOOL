import React from 'react';

export enum AppModule {
  COMMERCIAL = 'Commercial',
  ADMISSION = 'Admission',
  RH = 'RH',
  STUDENT = 'Étudiant'
}

export enum AdmissionTab {
  TESTS = 'tests',
  DOCUMENTS = 'documents',
  QUESTIONNAIRE = 'questionnaire',
  ADMINISTRATIF = 'administratif',
  ENTRETIEN = 'entretien'
}

export enum RHTab {
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