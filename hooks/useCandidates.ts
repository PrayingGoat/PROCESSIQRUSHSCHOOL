import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useApi } from './useApi';
import { useAppStore } from '../store/useAppStore';

export const getC = (c: any) => {
    const d = c.fields || c.data || c || {};
    const info = c.informations_personnelles || {};
    let alt = d.alternance || info.alternance || c.alternance;
    if (alt === true || alt === 'Oui') alt = "Oui";
    else if (alt === false || alt === 'Non') alt = "Non";
    else alt = alt || "Non";

    // Normalize enterprise info
    const id_ent = c.id_entreprise || c.record_id_entreprise || d.id_entreprise || d.record_id_entreprise || d['ID Entreprise'] || d['record_id_entreprise'];
    const nom_ent = c.entreprise_raison_sociale || d.entreprise_raison_sociale || d['Raison sociale (from Entreprise)'] || d['Entreprise daccueil'] || info.entreprise_d_accueil || d.entreprise;

    return {
        id: c.record_id || c.id || d.id || d.record_id,
        prenom: info.prenom || d['Prénom'] || d.prenom || d.firstname || c.prenom || "",
        nom: info.nom_naissance || d['NOM de naissance'] || d.nom_naissance || d.nom || d.lastname || c.nom || "",
        email: info.email || d['E-mail'] || d.email || c.email || "",
        formation: info.formation_souhaitee || d['Formation'] || d.formation_souhaitee || d.formation || c.formation || "Non renseigné",
        ville: info.ville || d['Commune de naissance'] || d.ville || d.commune_naissance || c.ville || "Non renseigné",
        entreprise: nom_ent || "En recherche",
        telephone: info.telephone || d['Téléphone'] || d.telephone || c.telephone || "",
        alternance: alt,
        id_entreprise: id_ent,
        has_cerfa: c.has_cerfa,
        has_fiche_renseignement: c.has_fiche_renseignement,
        has_cv: c.has_cv
    };
};

export const isPlaced = (c: any) => {
    const data = getC(c);
    const ent = data.entreprise;
    const hasEntId = !!data.id_entreprise;
    return hasEntId || (ent && ent !== 'Non' && ent !== 'En recherche' && ent !== 'En cours' && ent !== 'null' && ent !== 'En recherche');
};

export const useCandidates = () => {
    const { candidates: cachedCandidates, setCandidates, lastCandidatesFetch } = useAppStore();

    const fetchApi = useCallback(() => Promise.all([
        api.getAllCandidates(),
        api.getStudentsList()
    ]), []);

    const { execute, loading, error } = useApi(fetchApi, {
        silentLoading: cachedCandidates.length > 0,
        onSuccess: (rawData: any) => {
            const [candidatesData, fichesData] = rawData as [any, any];
            const fichesList = Array.isArray(fichesData?.etudiants) ? fichesData.etudiants : [];
            
            const mergedData = Array.isArray(candidatesData) ? candidatesData.map((c: any) => {
                const d = c.fields || c;
                const candidateId = c.id || d.id || d.record_id || c.record_id;
                const fiche = fichesList.find((f: any) => f.record_id === candidateId || f.id === candidateId);
                
                return {
                    ...c,
                    // Prioritize fiche info for real-time status
                    id_entreprise: fiche?.id_entreprise || c.id_entreprise || d.id_entreprise || d.record_id_entreprise,
                    record_id_entreprise: fiche?.record_id_entreprise || c.record_id_entreprise || d.record_id_entreprise,
                    entreprise_raison_sociale: fiche?.entreprise_raison_sociale || c.entreprise_raison_sociale || d.entreprise_raison_sociale || d['Raison sociale (from Entreprise)'],
                    has_cerfa: fiche?.has_cerfa || false,
                    has_fiche_renseignement: fiche?.has_fiche_renseignement || false,
                    has_cv: fiche?.has_cv || false,
                    dossier_complet: fiche?.dossier_complet || false
                };
            }) : [];
            setCandidates(mergedData);
        }
    });

    useEffect(() => {
        // Fetch on mount if empty or if data is "old" (e.g. older than 5 minutes)
        const isStale = !lastCandidatesFetch || (Date.now() - lastCandidatesFetch > 5 * 60 * 1000);
        if (cachedCandidates.length === 0 || isStale) {
            execute();
        }
    }, [execute, cachedCandidates.length, lastCandidatesFetch]);

    return {
        candidates: cachedCandidates,
        loading: loading && cachedCandidates.length === 0, // Only show loading if no cache
        error,
        refresh: execute
    };
};
