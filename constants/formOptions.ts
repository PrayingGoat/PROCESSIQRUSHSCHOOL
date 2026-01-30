export interface SelectOption {
    value: string;
    label: string;
}

const toOptions = (arr: string[]): SelectOption[] => arr.map(v => ({ value: v, label: v }));

export const NATIONALITY_OPTIONS: SelectOption[] = [
    { value: 'francaise', label: 'Française' },
    { value: 'ue', label: 'Union Européenne' },
    { value: 'hors_ue', label: 'Etranger hors Union Européenne' }
];

export const SITUATION_BEFORE_CONTRACT_OPTIONS: SelectOption[] = [
    { value: 'Etudiant', label: 'Etudiant : (Etude supérieur)' },
    { value: 'Scolaire', label: 'Scolaire : (Bac / brevet...)' },
    { value: 'contrat_pro', label: 'Contrat pro' },
    { value: 'Salarié', label: 'Salarié : (CDD/CDI)' },
    { value: 'Contrat d\'apprentissage', label: 'Contrat apprentissage' }
];

export const REGIME_SOCIAL_OPTIONS: SelectOption[] = [
    { value: 'Sécurité Sociale', label: 'URSSAF / Sécurité Sociale' },
    { value: 'MSA', label: 'MSA (Mutualité Sociale Agricole)' }
];

export const DIPLOMA_PREPARED_OPTIONS: SelectOption[] = toOptions([
    'Baccalauréat Technologique',
    'Baccalauréat général',
    'Baccalauréat pro',
    'Brevet',
    'CAP',
    'BTS',
    'Aucun diplôme'
]);

export const LAST_CLASS_OPTIONS: SelectOption[] = toOptions([
    'Diplôme obtenu',
    '1ère année suivie et validée',
    '1ère année validée',
    '1ère année suivie non validée',
    '1ère année non validée',
    '2ème année suivie et validée',
    '2ème année validée',
    '2ème année suivie non validée',
    '2ème année non validée',
    '3ème année suivie et validée',
    '3ème année validée',
    '3ème année suivie non validée',
    '3ème année non validée',
    'Fin du collège',
    'Études interrompues en 3ème',
    'Études interrompues en 4ème'
]);

export const HIGHEST_DIPLOMA_OPTIONS: SelectOption[] = [
    { value: "Doctorat", label: "Doctorat" },
    { value: "Master", label: "Master" },
    { value: "Diplôme ingénieur", label: "Diplôme ingénieur" },
    { value: "Diplôme école de commerce", label: "Diplôme école de commerce" },
    { value: "Autre diplôme ou titre bac +5 ou plus", label: "Autre diplôme ou titre bac +5 ou plus" },
    { value: "Licence professionnelle", label: "Licence professionnelle" },
    { value: "Licence générale", label: "Licence générale" },
    { value: "Bachelor universitaire de technologie (BUT)", label: "Bachelor universitaire de technologie (BUT)" },
    { value: "Autre diplôme ou titre bac +3 ou 4", label: "Autre diplôme ou titre bac +3 ou 4" },
    { value: "Brevet de Technicien Supérieur (BTS)", label: "Brevet de Technicien Supérieur (BTS)" },
    { value: "BTS", label: "BTS" },
    { value: "BTS MCO", label: "BTS MCO" },
    { value: "BTS NDRC", label: "BTS NDRC" },
    { value: "BTS COM", label: "BTS COM" },
    { value: "TP NTC", label: "TP NTC" },
    { value: "Bachelor RDC", label: "Bachelor RDC" },
    { value: "Diplôme Universitaire de Technologie (DUT)", label: "Diplôme Universitaire de Technologie (DUT)" },
    { value: "DUT", label: "DUT" },
    { value: "Autre diplôme ou titre bac +2", label: "Autre diplôme ou titre bac +2" },
    { value: "Baccalauréat professionnel", label: "Baccalauréat professionnel" },
    { value: "Bac Pro", label: "Bac Pro" },
    { value: "Baccalauréat général", label: "Baccalauréat général" },
    { value: "Bac général", label: "Bac général" },
    { value: "Baccalauréat technologique", label: "Baccalauréat technologique" },
    { value: "Bac techno", label: "Bac techno" },
    { value: "Diplôme de spécialisation professionnelle", label: "Diplôme de spécialisation professionnelle" },
    { value: "Autre diplôme ou titre niveau bac", label: "Autre diplôme ou titre niveau bac" },
    { value: "CAP", label: "CAP" },
    { value: "BEP", label: "BEP" },
    { value: "Certificat de spécialisation", label: "Certificat de spécialisation" },
    { value: "Autre diplôme ou titre CAP/BEP", label: "Autre diplôme ou titre CAP/BEP" },
    { value: "Diplôme National du Brevet", label: "Diplôme National du Brevet" },
    { value: "Brevet", label: "Brevet" },
    { value: "Certificat de Formation Générale", label: "Certificat de Formation Générale" },
    { value: "Aucun diplôme ni titre professionnel", label: "Aucun diplôme ni titre professionnel" },
    { value: "Aucun", label: "Aucun" }
];

export const FORMATION_SOUHAITEE_OPTIONS: SelectOption[] = [
    { value: 'BTS MCO', label: 'BTS MCO - Management Commercial Opérationnel' },
    { value: 'BTS NDRC', label: 'BTS NDRC - Négociation et Digitalisation de la Relation Client' },
    { value: 'BACHELOR RDC', label: 'BACHELOR RDC - Responsable Développement Commercial' },
    { value: 'TP NTC', label: 'TP NTC - Négociateur Technico-Commercial' }
];

export const KNOW_RUSH_SCHOOL_OPTIONS: SelectOption[] = [
    { value: 'reseaux_sociaux', label: 'Réseaux sociaux' },
    { value: 'google', label: 'Recherche Google' },
    { value: 'parcoursup', label: 'Parcoursup' },
    { value: 'salon', label: 'Salon / Forum' },
    { value: 'bouche_oreille', label: 'Bouche à oreille' },
    { value: 'autre', label: 'Autre' }
];

// Entreprise Form Specific
export const EMPLOYER_TYPE_OPTIONS: SelectOption[] = [
    { value: "11 Entreprise inscrite au répertoire des métiers ou au registre des entreprises pour l Alsace-Moselle", label: "11 - Entreprise inscrite au répertoire des métiers ou au registre des entreprises pour l'Alsace-Moselle" },
    { value: "12 Entreprise inscrite uniquement au registre du commerce et des sociétés", label: "12 - Entreprise inscrite uniquement au registre du commerce et des sociétés" },
    { value: "13 Entreprises dont les salariés relèvent de la mutualité sociale agricole", label: "13 - Entreprises dont les salariés relèvent de la mutualité sociale agricole" },
    { value: "14 Profession libérale", label: "14 - Profession libérale" },
    { value: "15 Association", label: "15 - Association" },
    { value: "16 Autre employeur privé", label: "16 - Autre employeur privé" },
    { value: "21 Service de l État (administrations centrales et leurs services déconcentrés)", label: "21 - Service de l'État (administrations centrales et leurs services déconcentrés)" },
    { value: "22 Commune", label: "22 - Commune" },
    { value: "23 Département", label: "23 - Département" },
    { value: "24 Région", label: "24 - Région" },
    { value: "25 Etablissement public hospitalier", label: "25 - Etablissement public hospitalier" },
    { value: "26 Etablissement public local d enseignement", label: "26 - Etablissement public local d'enseignement" },
    { value: "27 Etablissement public administratif de l Etat", label: "27 - Etablissement public administratif de l'État" },
    { value: "28 Etablissement public administratif local (y compris établissement public de coopération intercommunale EPCI)", label: "28 - Etablissement public administratif local (y compris EPCI)" },
    { value: "29 Autre employeur public", label: "29 - Autre employeur public" },
    { value: "30 Etablissement public industriel et commercial", label: "30 - Etablissement public industriel et commercial" }
];

export const MAITRE_DIPLOMA_OPTIONS: SelectOption[] = [
    { value: "Aucun diplôme", label: "Aucun diplôme" },
    { value: "CAP, BEP", label: "CAP, BEP" },
    { value: "Baccalauréat", label: "Baccalauréat" },
    { value: "DEUG, BTS, DUT, DEUST", label: "DEUG, BTS, DUT, DEUST" },
    { value: "Licence, Licence professionnelle, BUT, Maîtrise", label: "Licence, Licence professionnelle, BUT, Maîtrise" },
    { value: "Master, Diplôme d études approfondies, Diplôme d études spécialisées, Diplôme d ingénieur", label: "Master, DEA, DESS, Diplôme d'ingénieur" },
    { value: "Doctorat, Habilitation à diriger des recherches", label: "Doctorat, HDR" }
];

export const OPCO_OPTIONS: SelectOption[] = [
    { value: "AFDAS - Culture, médias, loisirs", label: "AFDAS (Culture, médias, loisirs, sport)" },
    { value: "AKTO - Services à forte intensité de main-d œuvre", label: "AKTO (Services à forte intensité de main-d'œuvre)" },
    { value: "ATLAS - Services financiers et conseil", label: "ATLAS (Services financiers et conseil)" },
    { value: "CONSTRUCTYS - Construction", label: "CONSTRUCTYS (Construction)" },
    { value: "OCAPIAT - Agriculture, pêche, agroalimentaire", label: "OCAPIAT (Agricole, pêche, agroalimentaire)" },
    { value: "OPCO 2i - Interindustriel", label: "OPCO 2i (Interindustriel)" },
    { value: "OPCO EP - Entreprises de proximité", label: "OPCO EP (Entreprises de proximité)" },
    { value: "OPCO Mobilités - Transports", label: "OPCO Mobilités (Transports)" },
    { value: "OPCO Santé - Santé", label: "OPCO Santé (Santé)" },
    { value: "OPCOMMERCE - Commerce", label: "OPCOMMERCE (Commerce)" },
    { value: "UNIFORMATION - Cohésion sociale", label: "UNIFORMATION (Cohésion sociale)" }
];

export const CONTRAT_TYPE_OPTIONS: SelectOption[] = [
    { value: "11 Premier contrat d apprentissage de l apprenti", label: "11 Premier contrat'apprentissage de l'apprenti" },
    { value: "21 Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d un même employeur", label: "21 Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d'un même employeur" },
    { value: "22 Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d un autre employeur", label: "22 Nouveau contrat avec un apprenti qui a terminé son précédent contrat auprès d'un autre employeur" },
    { value: "23 Nouveau contrat avec un apprenti dont le précédent contrat a été rompu", label: "23 Nouveau contrat avec un apprenti dont le précédent contrat a été rompu" },
    { value: "31 Modification de la situation juridique de l employeur", label: "31	Modification de la situation juridique de l'employeur" },
    { value: "32 Changement d employeur dans le cadre d un contrat saisonnier", label: "32 Changement d'employeur dans le cadre d'un contrat saisonnier" },
    { value: "33 Prolongation du contrat suite à un échec à l examen de l apprenti", label: "33	Prolongation du contrat suite à un échec à l'examen de l'apprenti" },
    { value: "34 Prolongation du contrat suite à la reconnaissance de l apprenti comme travailleur handicapé", label: "34 Prolongation du contrat suite à la reconnaissance de l'apprenti comme travailleur handicapé" },
    { value: "35 Diplôme supplémentaire préparé par l apprenti dans le cadre de l article L. 6222-22-1 du code du travail", label: "35 Diplôme supplémentaire préparé par l'apprenti dans le cadre de l'article L. 6222-22-1 du code du travail" },
    { value: "36 Autres changements : changement de maître d apprentissage, de durée de travail hebdomadaire, réduction de durée, etc.", label: "36	Autres changements : changement de maître d'apprentissage, de durée de travail hebdomadaire, réduction de durée, etc." },
    { value: "37 Modifications de lieu d exécution du contrat", label: "37 Modifications de lieu d'exécution du contrat" },
    { value: "38 Modification du lieu principale de réalisation de la formation théorique", label: "38 Modification du lieu principal de réalisation de la formation théorique" }
];

export const DEROGATION_TYPE_OPTIONS: SelectOption[] = [
    { value: "0 - Aucune dérogation", label: "0 - Aucune dérogation" },
    { value: "11 - Âge de l apprenti inférieur à 16 ans", label: "11 - Âge de l'apprenti inférieur à 16 ans" },
    { value: "12 - Âge supérieur à 29 ans : cas spécifiques prévus dans le code du travail", label: "12 - Âge supérieur à 29 ans : cas spécifiques prévus dans le code du travail" },
    { value: "21 - Réduction de la durée du contrat ou de la période d apprentissage", label: "21 - Réduction de la durée du contrat ou de la période d'apprentissage" },
    { value: "22 - Allongement de la durée du contrat ou de la période d apprentissage", label: "22 - Allongement de la durée du contrat ou de la période d'apprentissage" },
    { value: "50 - Cumul de dérogations", label: "50 - Cumul de dérogations" },
    { value: "60 - Autre dérogation", label: "60 - Autre dérogation" }
];

export const AGE_TRANCHE_OPTIONS: SelectOption[] = [
    { value: "16-17", label: "De 16 à 17 ans" },
    { value: "18-20", label: "De 18 à 20 ans" },
    { value: "21-25", label: "De 21 à 25 ans" },
    { value: "26+", label: "26 ans et plus" }
];

export const APPRENTISSAGE_YEAR_OPTIONS: SelectOption[] = [
    { value: "1", label: "1ère année" },
    { value: "2", label: "2ème année" },
    { value: "3", label: "3ème année" }
];

export const YES_NO_OPTIONS: SelectOption[] = [
    { value: "Oui", label: "Oui" },
    { value: "Non", label: "Non" }
];

export const FORMATION_DETAILS: Record<string, { debut: string; fin: string; rncp: string; diplome: string; heures: string; jours: string }> = {
    "BTS MCO A": { debut: "2024-09-02", fin: "2026-08-31", rncp: "RNCP38368", diplome: "32031310", heures: "1350", jours: "Lundi/Mardi" },
    "BTS NDRC 1": { debut: "2024-09-02", fin: "2026-08-31", rncp: "RNCP38368", diplome: "32031310", heures: "1350", jours: "Mercredi/Jeudi" },
    "Titre Pro NTC": { debut: "2024-09-02", fin: "2025-08-31", rncp: "RNCP34059", diplome: "46T31201", heures: "600", jours: "Lundi/Mardi" },
    "Bachelor RDC": { debut: "2024-09-16", fin: "2025-09-12", rncp: "RNCP36504", diplome: "26X31204", heures: "525", jours: "Vendredi" }
};

export const FORMATION_FILTER_OPTIONS: SelectOption[] = [
    { value: "mco", label: "BTS MCO" },
    { value: "ndrc", label: "BTS NDRC" },
    { value: "bachelor", label: "Bachelor RDC" },
    { value: "ntc", label: "TP NTC" }
];


