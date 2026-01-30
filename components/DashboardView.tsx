import React, { useState, useEffect } from 'react';
import {
    Loader2
} from 'lucide-react';
import { ViewId } from '../types';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';

import CandidateDetailsModal from './dashboard/CandidateDetailsModal';
import CommercialOverview from './dashboard/CommercialOverview';
import CommercialToPlace from './dashboard/CommercialToPlace';
import CommercialAlternance from './dashboard/CommercialAlternance';



interface DashboardViewProps {
    activeSubView: ViewId;
}

const DashboardView: React.FC<DashboardViewProps> = ({ activeSubView }) => {
    const { showToast } = useAppStore();
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterFormation, setFilterFormation] = useState('');
    const [filterRupture, setFilterRupture] = useState('');
    const [filterCV, setFilterCV] = useState('');
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Reset pagination when activeSubView or search/filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeSubView, searchQuery, filterFormation]);

    const handleViewDetails = async (id: string) => {
        setDetailsLoading(true);
        setIsModalOpen(true);
        setIsEditing(false);
        try {
            const data = await api.getCandidateById(id);
            setSelectedCandidate(data);
        } catch (error) {
            console.error("Failed to fetch candidate details", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleEdit = async (id: string) => {
        // Find candidate in local state first for instant pre-fill
        const localRaw = candidates.find(cand => {
            const c = getC(cand);
            return c.id === id;
        });

        if (localRaw) {
            const c = getC(localRaw);
            setSelectedCandidate(localRaw);
            setEditForm({
                prenom: c.prenom || "",
                nom_naissance: c.nom || "",
                email: c.email || "",
                telephone: c.telephone || "",
                formation_souhaitee: c.formation || "",
                ville: c.ville || "",
                entreprise_d_accueil: c.entreprise || "Non",
            });
        }

        setDetailsLoading(true);
        setIsModalOpen(true);
        setIsEditing(true);

        try {
            const data = await api.getCandidateById(id);
            setSelectedCandidate(data);
            const c = getC(data);
            setEditForm({
                prenom: c.prenom || "",
                nom_naissance: c.nom || "",
                email: c.email || "",
                telephone: c.telephone || "",
                formation_souhaitee: c.formation || "",
                ville: c.ville || "",
                entreprise_d_accueil: c.entreprise || "Non",
            });
        } catch (error) {
            console.error("Failed to fetch candidate for edit", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedCandidate || !editForm) return;
        setIsSaving(true);
        try {
            const cleanedForm = Object.keys(editForm).reduce((acc: any, key) => {
                acc[key] = editForm[key] === "" ? null : editForm[key];
                return acc;
            }, {});

            const updatedCandidate = {
                ...selectedCandidate,
                ...cleanedForm,
                informations_personnelles: {
                    ...(selectedCandidate.informations_personnelles || {}),
                    ...cleanedForm
                }
            };

            await api.updateCandidate(selectedCandidate.id, updatedCandidate);
            const data = await api.getAllCandidates();
            setCandidates(data);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save candidate", error);
            showToast("Erreur lors de la sauvegarde", "error");
        } finally {

            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCandidate) return;

        const c = getC(selectedCandidate);
        const candidateId = c.id;

        if (!candidateId) {
            console.error("❌ [UI] Cannot delete: Candidate ID not found in object", selectedCandidate);
            showToast("Erreur: ID de l'étudiant introuvable.", "error");
            return;
        }


        const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant ${c.prenom} ${c.nom} ? Cette action est irréversible.`);
        if (!confirmDelete) return;

        setIsDeleting(true);
        console.log(`🗑️ [UI] Requesting deletion for ID: ${candidateId}`);

        try {
            await api.deleteCandidate(candidateId);
            // Refresh list
            const data = await api.getAllCandidates();
            setCandidates(data);
            setIsModalOpen(false);
            showToast("Étudiant supprimé avec succès.", "success");
        } catch (error) {
            console.error("Failed to delete candidate", error);
            showToast("Erreur lors de la suppression. Vérifiez la console pour plus de détails.", "error");
        } finally {

            setIsDeleting(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [candidatesData, fichesData] = await Promise.all([
                    api.getAllCandidates(),
                    api.getEtudiantsFiches(false)
                ]);

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
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getC = (c: any) => {
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

    const isPlaced = (c: any) => {
        const data = getC(c);
        if (data.alternance === 'Oui') return true;
        const ent = data.entreprise;
        return ent && ent !== 'Non' && ent !== 'En recherche' && ent !== 'En cours' && ent !== 'null';
    };

    const studentsToPlace = candidates.filter(c => !isPlaced(c));
    const studentsPlaced = candidates.filter(c => isPlaced(c));

    const statsToPlace = {
        total: studentsToPlace.length,
        enCours: studentsToPlace.filter(s => getC(s).entreprise === 'En recherche').length,
        cvAActualiser: studentsToPlace.filter(s => !getC(s).has_cv).length
    };

    const statsPlaced = {
        total: studentsPlaced.length,
        contratsSignes: studentsPlaced.filter(s => getC(s).has_cerfa).length,
        missionsValidees: studentsPlaced.filter(s => getC(s).has_fiche_renseignement).length,
        entreprisesPartenaires: new Set(studentsPlaced.map(s => getC(s).entreprise)).size
    };

    const renderMainContent = () => {
        if (loading) {
            return (
                <div className="flex h-full items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                </div>
            );
        }

        if (activeSubView === 'commercial-placer') {
            return (
                <CommercialToPlace
                    candidates={candidates}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterFormation={filterFormation}
                    setFilterFormation={setFilterFormation}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    handleViewDetails={handleViewDetails}
                    getC={getC}
                    isPlaced={isPlaced}
                    statsToPlace={statsToPlace}
                />
            );
        }

        if (activeSubView === 'commercial-alternance') {
            return (
                <CommercialAlternance
                    candidates={candidates}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filterFormation={filterFormation}
                    setFilterFormation={setFilterFormation}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    handleViewDetails={handleViewDetails}
                    handleEdit={handleEdit}
                    getC={getC}
                    isPlaced={isPlaced}
                    statsPlaced={statsPlaced}
                />
            );
        }

        return (
            <CommercialOverview
                candidates={candidates}
                studentsToPlace={studentsToPlace}
                studentsPlaced={studentsPlaced}
                getC={getC}
            />
        );
    };

    return (
        <div className="relative">
            {renderMainContent()}
            <CandidateDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                candidate={selectedCandidate}
                loading={detailsLoading}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editForm={editForm}
                setEditForm={setEditForm}
                handleSaveEdit={handleSaveEdit}
                handleDelete={handleDelete}
                isSaving={isSaving}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default DashboardView;