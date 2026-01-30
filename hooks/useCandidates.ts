import { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useApi } from './useApi';
import { useAppStore } from '../store/useAppStore';

export const getC = (c: any) => {
    // ... (same implementation)
    const d = c.fields || c.data || c || {};
    const info = c.informations_personnelles || {};
    let alt = d.alternance || info.alternance;
    if (alt === true) alt = "Oui";
    else if (alt === false) alt = "Non";
    else alt = alt || "Non";

    return {
        id: c.id || d.id || d.record_id,
        prenom: info.prenom || d['Prénom'] || d.prenom || d.firstname || "",
        nom: info.nom_naissance || d['NOM de naissance'] || d.nom_naissance || d.nom || d.lastname || "",
        email: info.email || d['E-mail'] || d.email || "",
        formation: info.formation_souhaitee || d['Formation'] || d.formation_souhaitee || d.formation || "Non renseigné",
        ville: info.ville || d['Commune de naissance'] || d.ville || d.commune_naissance || "Non renseigné",
        entreprise: info.entreprise_d_accueil || d['Entreprise daccueil'] || d.entreprise_d_accueil || d.entreprise || "En recherche",
        telephone: info.telephone || d['Téléphone'] || d.telephone || "",
        alternance: alt,
        has_cerfa: c.has_cerfa,
        has_fiche_renseignement: c.has_fiche_renseignement,
        has_cv: c.has_cv
    };
};

export const isPlaced = (c: any) => {
    const data = getC(c);
    if (data.alternance === 'Oui') return true;
    const ent = data.entreprise;
    return ent && ent !== 'Non' && ent !== 'En recherche' && ent !== 'En cours' && ent !== 'null';
};

export const useCandidates = () => {
    const { candidates: cachedCandidates, setCandidates, lastCandidatesFetch } = useAppStore();

    const fetchApi = useCallback(() => Promise.all([
        api.getAllCandidates(),
        api.getEtudiantsFiches(false)
    ]), []);

    const { execute, loading, error } = useApi(fetchApi, {
        silentLoading: cachedCandidates.length > 0, // Silent if we have cache
        onSuccess: (rawData: any) => {
            const [candidatesData, fichesData] = rawData as [any, any];
            const mergedData = Array.isArray(candidatesData) ? candidatesData.map((c: any) => {
                const candidateId = c.id || (c.fields && (c.fields.id || c.fields.record_id)) || c.record_id;
                const fichesList = Array.isArray(fichesData?.etudiants) ? fichesData.etudiants : [];
                const fiche = fichesList.find((f: any) => f.record_id === candidateId);
                return {
                    ...c,
                    has_cerfa: fiche?.has_cerfa || false,
                    has_fiche_renseignement: fiche?.has_fiche_renseignement || false,
                    has_cv: fiche?.has_cv || false
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
