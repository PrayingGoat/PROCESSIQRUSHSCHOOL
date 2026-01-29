import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    FileText,
    PenTool,
    Briefcase,
    GraduationCap,
    Upload,
    Info,
    Building,
    UserCheck,
    Printer,
    X,
    Loader2,
    Download,
    RotateCcw,
    Save,
    Users,
    ArrowRight,
    ChevronLeft,
    AlertCircle,
    MapPin,
    Calendar,
    Euro,
    Phone,
    Calculator
} from 'lucide-react';
import { AdmissionTab, CompanyFormData } from '../types';
import QuestionnaireForm from './QuestionnaireForm';
import { api } from '../services/api';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Card from './ui/Card';

// --- CONFIGURATION ---

const FORMATION_FORMS: Record<string, string> = {
    mco: "https://docs.google.com/forms/d/e/1FAIpQLSdoGS2NZKs3sGRZ-dZ-3a8x9JZ32FQcpBQupMmD4CUQpEhnuw/viewform?embedded=true",
    ndrc: "https://docs.google.com/forms/d/e/1FAIpQLSeDDzl2VDR__aY776N_7auk4uAZc04uC6mQNUsRNOr9D3eCmw/viewform?embedded=true",
    bachelor: "https://docs.google.com/forms/d/e/1FAIpQLSdzOg66p81XV9Ghb4dS6xP2r-BCw4qiGECU4F01Vs7VlrJNCQ/viewform?embedded=true",
    tpntc: "https://docs.google.com/forms/d/e/1FAIpQLSfW-Gi40ZBpU9zymrYBZ05P8s2TSSL88OYwkp5lzPSNDXTnhA/viewform?embedded=true",
};

const REQUIRED_DOCUMENTS = [
    { id: 'cv', title: "CV", desc: "Curriculum Vitae à jour" },
    { id: 'cni', title: "Carte d'Identité", desc: "Recto-verso de la CNI" },
    { id: 'lettre', title: "Lettre de motivation", desc: "Exposez vos motivations" },
    { id: 'vitale', title: "Carte Vitale", desc: "Attestation de droits" },
    { id: 'diplome', title: "Dernier Diplôme", desc: "Copie du dernier diplôme" },
];

const ADMIN_DOCS = [
    { id: 'atre', title: "Fiche ATRE", subtitle: "Autorisation de Travail et Renseignements", desc: "Information entreprise et tuteur", color: 'orange', btnText: 'Compléter' },
    { id: 'renseignements', title: "Fiche de renseignements", subtitle: "Informations personnelles", desc: "Coordonnées et état civil", color: 'blue', btnText: 'Compléter' },
    { id: 'cerfa', title: "Fiche CERFA", subtitle: "Contrat d'apprentissage", desc: "Génération du contrat officiel FA13", color: 'emerald', btnText: 'Générer' },
    { id: 'reglement', title: "Règlement intérieur", subtitle: "Engagement étudiant", desc: "Document à lire et signer", color: 'green', btnText: 'Signer' },
    { id: 'connaissance', title: "Prise de connaissance", subtitle: "Attestation documents", desc: "Charte informatique, Livret d'accueil...", color: 'purple', btnText: 'Signer' },
    { id: 'livret', title: "Livret d'apprentissage", subtitle: "Suivi pédagogique", desc: "Document de liaison CFA/Entreprise", color: 'cyan', btnText: 'Générer' },
];

const FORMATION_CARDS = [
    { id: 'mco', title: 'BTS MCO', subtitle: 'Management Commercial Opérationnel', color: 'blue' },
    { id: 'ndrc', title: 'BTS NDRC', subtitle: 'Négociation et Digitalisation de la Relation Client', color: 'green' },
    { id: 'bachelor', title: 'BACHELOR RDC', subtitle: 'Responsable Développement Commercial', color: 'purple' },
    { id: 'tpntc', title: 'TP NTC', subtitle: 'Titre Pro Négociateur Technico-Commercial', color: 'orange' }
];

// --- COMPONENTS ---

const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100 animate-slide-up text-center border border-white/20">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 size={40} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Félicitations !</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    La fiche de renseignements a été générée et envoyée avec succès.
                </p>
                <Button variant="success" size="lg" className="w-full" onClick={onClose}>
                    Continuer
                </Button>
            </div>
        </div>
    );
};

const StepItem = ({ step, label, isActive, isCompleted }: { step: number, label: string, isActive: boolean, isCompleted: boolean }) => (
    <div className="flex flex-col items-center gap-2 relative z-10 group">
        <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all duration-300 ${isCompleted
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : isActive
                ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30'
                : 'bg-[#F8FAFC] border-slate-200 text-slate-400'
            }`}>
            {isCompleted ? <CheckCircle2 size={20} /> : step}
        </div>
        <div className={`text-xs font-semibold uppercase tracking-wide transition-colors duration-300 ${isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>
            {label}
        </div>
    </div>
);

const StepLine = ({ isCompleted }: { isCompleted: boolean }) => (
    <div className={`w-12 h-0.5 mx-1 transition-colors duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
);

const EntrepriseForm = ({ onNext, studentRecordId }: { onNext: () => void, studentRecordId: string | null }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<CompanyFormData>({
        identification: {
            raison_sociale: "",
            siret: "",
            code_ape_naf: "",
            type_employeur: "",
            effectif: "",
            convention: ""
        },
        adresse: {
            num: "",
            voie: "",
            complement: "",
            code_postal: "",
            ville: "",
            telephone: "",
            email: ""
        },
        maitre_apprentissage: {
            nom: "",
            prenom: "",
            date_naissance: "",
            fonction: "",
            diplome: "",
            experience: "",
            telephone: "",
            email: ""
        },
        opco: {
            nom: ""
        },
        formation: {
            choisie: "",
            date_debut: "",
            date_fin: "",
            code_rncp: "",
            code_diplome: "",
            nb_heures: "",
            jours_cours: ""
        },
        cfa: {
            rush_school: "oui",
            entreprise: "non",
            denomination: "RUSH SCHOOL",
            uai: "0932731W",
            siret: "91901416300018",
            adresse: "11-13 AVENUE DE LA DIVISION LECLERC",
            complement: "",
            code_postal: "93000",
            commune: "BOBIGNY"
        },
        contrat: {
            type_contrat: "",
            type_derogation: "",
            date_debut: "",
            date_fin: "",
            duree_hebdomadaire: "35h",
            poste_occupe: "",
            lieu_execution: "",
            pourcentage_smic: 0,
            smic: "1823.03",
            montant_salaire_brut: 0,
            date_conclusion: "",
            date_debut_execution: "",
            numero_deca_ancien_contrat: "",
            machines_dangereuses: "Non",
            caisse_retraite: "",
            date_avenant: ""
        },
        salaire: {
            age: "",
            annee: "",
            pourcentage: 0,
            montant: 0
        },
        missions: {
            formation_alternant: "",
            selectionnees: [] as string[]
        },


        record_id_etudiant: studentRecordId || ""
    });

    const FORMATION_DETAILS: Record<string, any> = {
        "BTS MCO A": { debut: "2024-09-02", fin: "2026-08-31", rncp: "RNCP38368", diplome: "32031310", heures: "1350", jours: "Lundi/Mardi" },
        "BTS NDRC 1": { debut: "2024-09-02", fin: "2026-08-31", rncp: "RNCP38368", diplome: "32031310", heures: "1350", jours: "Mercredi/Jeudi" },
        "Titre Pro NTC": { debut: "2024-09-02", fin: "2025-08-31", rncp: "RNCP34059", diplome: "46T31201", heures: "600", jours: "Lundi/Mardi" },
        "Bachelor RDC": { debut: "2024-09-16", fin: "2025-09-12", rncp: "RNCP36504", diplome: "26X31204", heures: "525", jours: "Vendredi" }
    };

    const handleFormationChange = (val: string) => {
        const details = FORMATION_DETAILS[val] || { debut: "", fin: "", rncp: "", diplome: "", heures: "", jours: "" };

        // Calcul automatique du nombre de mois
        let nbMois = 12;
        if (details.debut && details.fin) {
            const d1 = new Date(details.debut);
            const d2 = new Date(details.fin);
            nbMois = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
            if (nbMois < 1) nbMois = 1;
        }

        setFormData(prev => ({
            ...prev,
            formation: {
                ...prev.formation,
                choisie: val,
                date_debut: details.debut,
                date_fin: details.fin,
                code_rncp: details.rncp,
                code_diplome: details.diplome,
                nb_heures: details.heures,
                jours_cours: details.jours
            },
            contrat: {
                ...prev.contrat,
                nombre_mois: nbMois
            }
        }));
    };

    const handleSalaryCalc = (age: string, annee: string) => {
        // On met à jour l'âge et l'année immédiatement pour que les Select reflètent la sélection
        const newSalaire = { ...formData.salaire, age, annee };
        let montantCalc = newSalaire.montant;
        let pctCalc = newSalaire.pourcentage;

        if (age && annee) {
            const smicBrut = 1823.03;
            let pct = 0;

            if (age === "16-17") {
                pct = annee === "1" ? 27 : annee === "2" ? 39 : 55;
            } else if (age === "18-20") {
                pct = annee === "1" ? 43 : annee === "2" ? 51 : 67;
            } else if (age === "21-25") {
                pct = annee === "1" ? 53 : annee === "2" ? 61 : 78;
            } else if (age === "26+") {
                pct = 100;
            }

            pctCalc = pct;
            montantCalc = parseFloat(((smicBrut * pct) / 100).toFixed(2));
        }

        setFormData(prev => ({
            ...prev,
            salaire: {
                ...newSalaire,
                pourcentage: pctCalc,
                montant: montantCalc
            },
            // On synchronise aussi avec le contrat pour api.ts
            contrat: {
                ...prev.contrat,
                pourcentage_smic: pctCalc,
                montant_salaire_brut: montantCalc
            }
        }));
    };

    const toggleMission = (mission: string) => {
        setFormData(prev => {
            const current = prev.missions.selectionnees;
            const next = current.includes(mission)
                ? current.filter(m => m !== mission)
                : [...current, mission];
            return {
                ...prev,
                missions: {
                    ...prev.missions,
                    selectionnees: next
                }
            };
        });
    };

    const handleNestedChange = (section: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                // @ts-ignore
                ...prev[section],
                [field]: value
            }
        }));
    };

    // Calcul automatique du nombre de mois en fonction des dates de formation
    useEffect(() => {
        const { date_debut, date_fin } = formData.formation;
        if (date_debut && date_fin) {
            const start = new Date(date_debut);
            const end = new Date(date_fin);

            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

                if (end.getDate() < start.getDate()) {
                    months--;
                }

                const finalMonths = Math.max(1, months);

                if (formData.contrat.nombre_mois !== finalMonths) {
                    handleNestedChange('contrat', 'nombre_mois', finalMonths);
                }
            }
        }
    }, [formData.formation.date_debut, formData.formation.date_fin]);

    const handleSubmit = async () => {
        if (!formData.identification.raison_sociale || !formData.identification.siret) {
            alert("Veuillez remplir au moins la raison sociale et le SIRET.");
            return;
        }

        if (!studentRecordId) {
            alert("Erreur: ID étudiant manquant. Veuillez revenir à l'étape précédente.");
            return;
        }

        setIsSubmitting(true);

        try {
            await api.submitCompany(formData);
            onNext();
        } catch (error) {
            console.error("Erreur soumission entreprise:", error);
            alert("Une erreur est survenue lors de l'enregistrement. Vérifiez les données et réessayez.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-6 md:p-10 shadow-xl border border-blue-100 relative overflow-hidden animate-slide-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"></div>

            {/* Header */}
            <div className="flex items-center gap-6 mb-10 pb-8 border-b border-blue-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                    <Building size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Fiche de renseignement Entreprise</h2>
                    <p className="text-slate-500">Informations sur l'entreprise d'accueil pour le contrat d'apprentissage</p>
                </div>
            </div>

            <div className="space-y-6">
                <Card step={1} title="Identification de l'entreprise" collapsible>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <Input label="Raison sociale" required placeholder="Nom de l'entreprise" value={formData.identification.raison_sociale} onChange={(e) => handleNestedChange('identification', 'raison_sociale', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Numéro SIRET" required placeholder="14 chiffres" value={formData.identification.siret} onChange={(e) => handleNestedChange('identification', 'siret', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Code APE/NAF" required placeholder="Ex: 4711D" value={formData.identification.code_ape_naf} onChange={(e) => handleNestedChange('identification', 'code_ape_naf', e.target.value)} />
                        </div>
                        <div className="col-span-12">
                            <Select
                                label="Type d'employeur"
                                required
                                value={formData.identification.type_employeur}
                                onChange={(e) => handleNestedChange('identification', 'type_employeur', e.target.value)}
                                placeholder="Sélectionnez"
                                options={[
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
                                ]}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Effectif salarié" required type="number" placeholder="Nombre" value={formData.identification.effectif} onChange={(e) => handleNestedChange('identification', 'effectif', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Convention collective" placeholder="Intitulé" value={formData.identification.convention} onChange={(e) => handleNestedChange('identification', 'convention', e.target.value)} />
                        </div>
                    </div>
                </Card>

                <Card step={2} title="Adresse de l'entreprise" collapsible defaultOpen={false}>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12 md:col-span-3">
                            <Input label="Numéro" placeholder="N°" value={formData.adresse.num} onChange={(e) => handleNestedChange('adresse', 'num', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-9">
                            <Input label="Voie" required placeholder="Rue, avenue, boulevard..." value={formData.adresse.voie} onChange={(e) => handleNestedChange('adresse', 'voie', e.target.value)} />
                        </div>
                        <div className="col-span-12">
                            <Input label="Complément d'adresse" placeholder="Bâtiment, étage, etc." value={formData.adresse.complement} onChange={(e) => handleNestedChange('adresse', 'complement', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <Input label="Code postal" required placeholder="Ex: 75001" value={formData.adresse.code_postal} onChange={(e) => handleNestedChange('adresse', 'code_postal', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-8">
                            <Input label="Ville" required placeholder="Ville" value={formData.adresse.ville} onChange={(e) => handleNestedChange('adresse', 'ville', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Téléphone" required type="tel" placeholder="Téléphone entreprise" value={formData.adresse.telephone} onChange={(e) => handleNestedChange('adresse', 'telephone', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Email" required type="email" placeholder="Email de contact" value={formData.adresse.email} onChange={(e) => handleNestedChange('adresse', 'email', e.target.value)} />
                        </div>
                    </div>
                </Card>

                <Card step={3} title="Maître d'apprentissage" collapsible defaultOpen={false}>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Nom" required placeholder="Nom" value={formData.maitre_apprentissage.nom} onChange={(e) => handleNestedChange('maitre_apprentissage', 'nom', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Prénom" required placeholder="Prénom" value={formData.maitre_apprentissage.prenom} onChange={(e) => handleNestedChange('maitre_apprentissage', 'prenom', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Date de naissance" required type="date" value={formData.maitre_apprentissage.date_naissance} onChange={(e) => handleNestedChange('maitre_apprentissage', 'date_naissance', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Fonction" required placeholder="Poste occupé" value={formData.maitre_apprentissage.fonction} onChange={(e) => handleNestedChange('maitre_apprentissage', 'fonction', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Select
                                label="Diplôme le plus élevé"
                                value={formData.maitre_apprentissage.diplome}
                                onChange={(e) => handleNestedChange('maitre_apprentissage', 'diplome', e.target.value)}
                                options={[
                                    { value: "Aucun diplôme", label: "Aucun diplôme" },
                                    { value: "CAP, BEP", label: "CAP, BEP" },
                                    { value: "Baccalauréat", label: "Baccalauréat" },
                                    { value: "DEUG, BTS, DUT, DEUST", label: "DEUG, BTS, DUT, DEUST" },
                                    { value: "Licence, Licence professionnelle, BUT, Maîtrise", label: "Licence, Licence professionnelle, BUT, Maîtrise" },
                                    { value: "Master, Diplôme d'études approfondies, Diplôme d études spécialisées, Diplôme d ingénieur", label: "Master, DEA, DESS, Diplôme d'ingénieur" },
                                    { value: "Doctorat, Habilitation à diriger des recherches", label: "Doctorat, HDR" }
                                ]}
                                placeholder="Sélectionnez"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <Input label="Années d'expérience" type="number" placeholder="Années" value={formData.maitre_apprentissage.experience} onChange={(e) => handleNestedChange('maitre_apprentissage', 'experience', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <Input label="Téléphone" required type="tel" placeholder="Téléphone" value={formData.maitre_apprentissage.telephone} onChange={(e) => handleNestedChange('maitre_apprentissage', 'telephone', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <Input label="Email" required type="email" placeholder="Email" value={formData.maitre_apprentissage.email} onChange={(e) => handleNestedChange('maitre_apprentissage', 'email', e.target.value)} />
                        </div>
                    </div>
                </Card>

                <Card step={4} title="OPCO (Opérateur de Compétences)" collapsible defaultOpen={false}>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <Select
                                label="Sélectionnez votre OPCO"
                                required
                                value={formData.opco.nom}
                                onChange={(e) => handleNestedChange('opco', 'nom', e.target.value)}
                                placeholder="Choisir un OPCO"
                                options={[
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
                                ]}
                            />
                        </div>
                    </div>
                </Card>

                <Card step={5} title="Formation & CFA" collapsible defaultOpen={false}>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Formation suivie *</label>
                            <div className="flex gap-3 flex-wrap">
                                {['BTS MCO A', 'BTS NDRC 1', 'Titre Pro NTC', 'Bachelor RDC'].map((f, idx) => (
                                    <label key={f} className="relative cursor-pointer group flex-1 min-w-[120px]">
                                        <input className="peer sr-only" type="radio" name="formation_choisie" value={f} checked={formData.formation.choisie === f} onChange={() => handleFormationChange(f)} />
                                        <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${formData.formation.choisie === f ? 'bg-primary-50/50 border-primary shadow-indigo' : 'bg-slate-50/50 border-transparent hover:border-slate-200'}`}>
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${formData.formation.choisie === f ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}`}>{String.fromCharCode(65 + idx)}</span>
                                            <span className="font-bold text-slate-700">{f}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Date de début" required type="date" value={formData.formation.date_debut} onChange={(e) => handleNestedChange('formation', 'date_debut', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Date de fin" required type="date" value={formData.formation.date_fin} onChange={(e) => handleNestedChange('formation', 'date_fin', e.target.value)} />
                        </div>

                        <div className="col-span-12 mt-4">
                            <div className="flex items-center gap-8 mb-6 px-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="cfa_choice"
                                        checked={formData.cfa.rush_school === 'oui'}
                                        onChange={() => {
                                            handleNestedChange('cfa', 'rush_school', 'oui');
                                            handleNestedChange('cfa', 'entreprise', 'non');
                                        }}
                                        className="w-5 h-5 accent-primary"
                                    />
                                    <span className="font-bold text-slate-700 text-sm group-hover:text-primary transition-colors">CFA Rush School</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="cfa_choice"
                                        checked={formData.cfa.rush_school === 'non'}
                                        onChange={() => {
                                            handleNestedChange('cfa', 'rush_school', 'non');
                                            handleNestedChange('cfa', 'entreprise', 'oui');
                                        }}
                                        className="w-5 h-5 accent-primary"
                                    />
                                    <span className="font-bold text-slate-700 text-sm group-hover:text-primary transition-colors">Autre CFA</span>
                                </label>
                            </div>

                            {formData.cfa.rush_school === 'oui' ? (
                                <div className="bg-primary-50/30 p-8 rounded-3xl border border-primary-100 animate-fade-in">
                                    <div className="flex items-center gap-5 mb-6">
                                        <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                            <Building size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-800 tracking-tight">CFA d'accueil : Rush School</h4>
                                            <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mt-0.5">Informations certifiées</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white/60 p-4 rounded-2xl border border-primary-50">
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Dénomination</span>
                                            <span className="font-bold text-slate-700">RUSH SCHOOL</span>
                                        </div>
                                        <div className="bg-white/60 p-4 rounded-2xl border border-primary-50">
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">N° SIRET</span>
                                            <span className="font-bold text-slate-700">919 233 135 00014</span>
                                        </div>
                                        <div className="bg-white/60 p-4 rounded-2xl border border-primary-50">
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Code UAI</span>
                                            <span className="font-bold text-slate-700">0756342X</span>
                                        </div>
                                        <div className="bg-white/60 p-4 rounded-2xl border border-primary-50">
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Adresse</span>
                                            <span className="font-bold text-slate-700 text-sm">15 passage de la Main d'Or, 75011 Paris</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-12 gap-5 animate-fade-in bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                                    <div className="col-span-12 md:col-span-6">
                                        <Input label="Dénomination du CFA" required value={formData.cfa.denomination} onChange={(e) => handleNestedChange('cfa', 'denomination', e.target.value)} />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <Input label="N° SIRET" required value={formData.cfa.siret} onChange={(e) => handleNestedChange('cfa', 'siret', e.target.value)} />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <Input label="Code UAI" required value={formData.cfa.uai} onChange={(e) => handleNestedChange('cfa', 'uai', e.target.value)} />
                                    </div>
                                    <div className="col-span-12">
                                        <Input label="Adresse complète" required value={formData.cfa.adresse} onChange={(e) => handleNestedChange('cfa', 'adresse', e.target.value)} />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <Input label="Code Postal" required value={formData.cfa.code_postal} onChange={(e) => handleNestedChange('cfa', 'code_postal', e.target.value)} />
                                    </div>
                                    <div className="col-span-12 md:col-span-8">
                                        <Input label="Commune" required value={formData.cfa.commune} onChange={(e) => handleNestedChange('cfa', 'commune', e.target.value)} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                <Card step={6} title="Contrat & Salaire" collapsible defaultOpen={false}>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12 md:col-span-6">
                            <Select
                                label="Type de contrat"
                                required
                                value={formData.contrat.type_contrat}
                                onChange={(e) => handleNestedChange('contrat', 'type_contrat', e.target.value)}
                                options={[
                                    { value: "11 Premier contrat d apprentissage de l apprenti", label: "11 Premier contrat d'apprentissage de l'apprenti" },
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

                                ]}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Select
                                label="Type de dérogation"
                                value={formData.contrat.type_derogation}
                                onChange={(e) => handleNestedChange('contrat', 'type_derogation', e.target.value)}
                                placeholder="Sélectionnez si applicable"
                                options={[
                                    { value: "0 - Aucune dérogation", label: "0 - Aucune dérogation" },
                                    { value: "11 - Âge de l apprenti inférieur à 16 ans", label: "11 - Âge de l'apprenti inférieur à 16 ans" },
                                    { value: "12 - Âge supérieur à 29 ans : cas spécifiques prévus dans le code du travail", label: "12 - Âge supérieur à 29 ans : cas spécifiques prévus dans le code du travail" },
                                    { value: "21 - Réduction de la durée du contrat ou de la période d apprentissage", label: "21 - Réduction de la durée du contrat ou de la période d'apprentissage" },
                                    { value: "22 - Allongement de la durée du contrat ou de la période d apprentissage", label: "22 - Allongement de la durée du contrat ou de la période d'apprentissage" },
                                    { value: "50 - Cumul de dérogations", label: "50 - Cumul de dérogations" },
                                    { value: "60 - Autre dérogation", label: "60 - Autre dérogation" }
                                ]}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Durée hebdomadaire" required placeholder="Ex: 35h" value={formData.contrat.duree_hebdomadaire} onChange={(e) => handleNestedChange('contrat', 'duree_hebdomadaire', e.target.value)} />
                        </div>
                        <div className="col-span-12">
                            <Input label="Poste occupé" required placeholder="Intitulé exact du poste" value={formData.contrat.poste_occupe} onChange={(e) => handleNestedChange('contrat', 'poste_occupe', e.target.value)} />
                        </div>
                        <div className="col-span-12">
                            <Input label="Lieu d'exécution" placeholder="Adresse si différente" value={formData.contrat.lieu_execution} onChange={(e) => handleNestedChange('contrat', 'lieu_execution', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="N° DECA ancien contrat" placeholder="Si applicable" value={formData.contrat.numero_deca_ancien_contrat} onChange={(e) => handleNestedChange('contrat', 'numero_deca_ancien_contrat', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Date de conclusion" type="date" value={formData.contrat.date_conclusion} onChange={(e) => handleNestedChange('contrat', 'date_conclusion', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Date début exécution" type="date" value={formData.contrat.date_debut_execution} onChange={(e) => handleNestedChange('contrat', 'date_debut_execution', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Date avenant" type="date" value={formData.contrat.date_avenant} onChange={(e) => handleNestedChange('contrat', 'date_avenant', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Caisse de retraite" placeholder="Nom de la caisse" value={formData.contrat.caisse_retraite} onChange={(e) => handleNestedChange('contrat', 'caisse_retraite', e.target.value)} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Select
                                label="Travail sur machines dangereuses"
                                required
                                value={formData.contrat.machines_dangereuses}
                                onChange={(e) => handleNestedChange('contrat', 'machines_dangereuses', e.target.value)}
                                options={[
                                    { value: "Oui", label: "Oui" },
                                    { value: "Non", label: "Non" }
                                ]}
                            />
                        </div>

                        {/* Simulateur de salaire */}
                        <div className="col-span-12 mt-6 p-8 rounded-3xl border-2 border-secondary/20 bg-secondary-50/30">
                            <label className="text-base font-black text-slate-800 mb-6 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center shadow-lg shadow-secondary/20">
                                    <Calculator size={20} />
                                </span>
                                Simulateur de salaire apprenti
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <Select
                                    label="Tranche d'âge"
                                    required
                                    value={formData.salaire.age}
                                    onChange={(e) => handleSalaryCalc(e.target.value, formData.salaire.annee)}
                                    options={[
                                        { value: "16-17", label: "De 16 à 17 ans" },
                                        { value: "18-20", label: "De 18 à 20 ans" },
                                        { value: "21-25", label: "De 21 à 25 ans" },
                                        { value: "26+", label: "26 ans et plus" }
                                    ]}
                                    className="!bg-white"
                                />
                                <Select
                                    label="Année d'apprentissage"
                                    required
                                    value={formData.salaire.annee}
                                    onChange={(e) => handleSalaryCalc(formData.salaire.age, e.target.value)}
                                    options={[
                                        { value: "1", label: "1ère année" },
                                        { value: "2", label: "2ème année" },
                                        { value: "3", label: "3ème année" }
                                    ]}
                                    className="!bg-white"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Pourcentage du SMIC</label>
                                    <div className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-secondary text-lg">
                                        {formData.salaire.pourcentage ? `${formData.salaire.pourcentage}%` : "-- %"}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Salaire brut mensuel</label>
                                    <div className="w-full px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-secondary text-lg">
                                        {formData.salaire.montant ? `${formData.salaire.montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}` : "-- €"}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 block text-center italic">Basé sur le SMIC 2024 : 1 823,03 € brut mensuel</span>
                        </div>
                    </div>
                </Card>

                <Card step={7} title="Missions en entreprise" collapsible defaultOpen={false}>
                    <div className="space-y-8">
                        <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Sélection des missions</h4>
                                    <p className="text-slate-500 text-sm font-bold mt-1">Choisissez au moins 3 missions principales</p>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.missions.selectionnees.length >= 3 ? 'bg-secondary text-white shadow-secondary/20' : 'bg-rose-50 text-rose-500'}`}>
                                    {formData.missions.selectionnees.length} / 3 missions
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Prospection et développement commercial",
                                    "Gestion et suivi de la relation client",
                                    "Vente en face à face ou à distance",
                                    "Animation et gestion d un espace de vente",
                                    "Mise en place d opérations promotionnelles",
                                    "Analyse des performances commerciales",
                                    "Veille concurrentielle et étude de marché",
                                    "Gestion des stocks et approvisionnements",
                                    "Management d une petite équipe",
                                    "Reporting et tableaux de bord"
                                ].map((mission) => (
                                    <label key={mission} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${formData.missions.selectionnees.includes(mission) ? 'bg-white border-primary shadow-indigo' : 'bg-white/50 border-transparent hover:border-slate-200'}`}>
                                        <div className="relative flex items-center justify-center shrink-0">
                                            <input type="checkbox" className="peer hidden" checked={formData.missions.selectionnees.includes(mission)} onChange={() => toggleMission(mission)} />
                                            <div className="w-6 h-6 rounded-lg border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                                                <CheckCircle2 size={14} className="text-white scale-0 peer-checked:scale-100 transition-transform" />
                                            </div>
                                        </div>
                                        <span className={`text-sm font-bold transition-colors ${formData.missions.selectionnees.includes(mission) ? 'text-slate-800' : 'text-slate-500'}`}>{mission}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                            <div className="flex items-center gap-5 mb-6 relative z-10">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <PenTool size={24} className="text-primary-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black tracking-tight leading-none">Détails complémentaires</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Précisez vos missions spécifiques</p>
                                </div>
                            </div>
                            <textarea
                                className="w-full px-6 py-5 bg-white/5 border-2 border-white/10 rounded-2xl focus:border-primary focus:bg-white/10 outline-none transition-all font-bold text-white placeholder:text-slate-600 resize-none h-32 relative z-10"
                                placeholder="Décrivez ici les spécificités de votre poste..."
                            />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Footer Actions */}
            <div className="mt-10 p-8 bg-white/50 border-t border-blue-100 flex flex-col md:flex-row items-center justify-between gap-8 rounded-b-3xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
                        <Info size={24} />
                    </div>
                    <p className="text-xs font-medium text-slate-500 max-w-xs">
                        En validant ce formulaire, vous certifiez l'exactitude des informations transmises.
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none" onClick={() => alert("Brouillon enregistré")}>
                        Brouillon
                    </Button>
                    <Button
                        size="lg"
                        isLoading={isSubmitting}
                        disabled={formData.missions.selectionnees.length < 3}
                        rightIcon={<ArrowRight size={20} />}
                        onClick={handleSubmit}
                        className="flex-[2] md:flex-none"
                    >
                        Valider la fiche
                    </Button>
                </div>
            </div>
        </div>
    );
};

const EvaluationGrid = ({ studentData }: { studentData: any }) => {
    const [evalData, setEvalData] = useState({
        candidatNom: '',
        heureEntretien: '',
        chargeAdmission: '',
        dateEntretien: '',
        formation: '',
        critere1: 0,
        critere2: 0,
        critere3: 0,
        critere4: 0,
        commentaires: ''
    });

    useEffect(() => {
        if (studentData) {
            const data = studentData.data || studentData;
            setEvalData(prev => ({
                ...prev,
                candidatNom: `${data.prenom || ''} ${data.nom_naissance || ''}`.trim(),
                formation: data.formation_souhaitee || '',
                dateEntretien: new Date().toISOString().split('T')[0]
            }));
        }
    }, [studentData]);

    const totalScore = (Number(evalData.critere1) || 0) +
        (Number(evalData.critere2) || 0) +
        (Number(evalData.critere3) || 0) +
        (Number(evalData.critere4) || 0);

    const getAppreciation = (score: number) => {
        if (score === 0) return '-';
        if (score <= 8) return 'Insuffisant';
        if (score <= 12) return 'Passable';
        if (score <= 16) return 'Satisfaisant';
        return 'Excellent';
    };

    const resetEvaluation = () => {
        if (window.confirm("Voulez-vous vraiment réinitialiser la grille ?")) {
            setEvalData({
                candidatNom: '',
                heureEntretien: '',
                chargeAdmission: '',
                dateEntretien: '',
                formation: '',
                critere1: 0,
                critere2: 0,
                critere3: 0,
                critere4: 0,
                commentaires: ''
            });
        }
    };

    const saveEvaluation = () => {
        alert("Évaluation enregistrée avec succès !");
    };

    const exportEvaluationPDF = () => {
        window.print();
    };

    const handleScoreChange = (critere: string, value: number) => {
        setEvalData(prev => ({ ...prev, [critere]: value }));
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">CR d'entretien / Grille d'évaluation</h2>
                    <p className="text-slate-400 text-sm">Évaluation des compétences et du savoir-être</p>
                </div>
                <div className="flex flex-col items-end">
                    <img src="/images/logo-process-iq.png" alt="Process IQ" className="h-8 brightness-0 invert" />
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Informations candidat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <Input label="Nom et Prénom du candidat" placeholder="Entrez le nom complet" value={evalData.candidatNom} onChange={(e) => setEvalData({ ...evalData, candidatNom: e.target.value })} />
                        <Input label="Heure d'entretien" type="time" value={evalData.heureEntretien} onChange={(e) => setEvalData({ ...evalData, heureEntretien: e.target.value })} />
                    </div>
                    <div className="space-y-4">
                        <Input label="Nom et Prénom chargé(e) d'admission" placeholder="Votre nom" value={evalData.chargeAdmission} onChange={(e) => setEvalData({ ...evalData, chargeAdmission: e.target.value })} />
                        <Input label="Date d'entretien" type="date" value={evalData.dateEntretien} onChange={(e) => setEvalData({ ...evalData, dateEntretien: e.target.value })} />
                    </div>
                </div>

                {/* Formation selection */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-4 ml-1">Formation visée</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {['TP NTC', 'BTS CI', 'BTS COM', 'BTS MCO', 'BTS NDRC', 'BACHELOR RDC'].map((f) => (
                            <label key={f} className={`relative cursor-pointer group`}>
                                <input
                                    type="radio"
                                    name="formation-eval"
                                    className="peer sr-only"
                                    value={f}
                                    checked={evalData.formation === f}
                                    onChange={(e) => setEvalData({ ...evalData, formation: e.target.value })}
                                />
                                <div className={`px-4 py-3 rounded-xl border-2 text-center text-xs font-bold transition-all ${evalData.formation === f ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200'}`}>
                                    {f}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Critères d'évaluation */}
                <div className="space-y-6">
                    <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        <div className="col-span-7">Critères d'évaluation</div>
                        <div className="col-span-5 grid grid-cols-5 text-center">
                            <div>Insuff. (1)</div>
                            <div>Pass. (2)</div>
                            <div>Satisf. (3)</div>
                            <div>T.Satisf (4)</div>
                            <div>Exc. (5)</div>
                        </div>
                    </div>

                    {[
                        { id: 'critere1', title: 'Savoir-être et présentation', desc: 'Capacité à bien se connaître : ses points forts, ses points de progression, culture générale, curiosité, ouverture aux autres.' },
                        { id: 'critere2', title: 'Cohérence du projet académique et professionnel', desc: 'Logique de construction du projet d\'orientation, projet professionnel, motivation pour le programme.' },
                        { id: 'critere3', title: 'Engagements et expérience péri ou extra-scolaires', desc: 'Activités extra-scolaires, richesse des expériences, valorisation des compétences développées.' },
                        { id: 'critere4', title: 'Expression en Anglais', desc: 'Savoir répondre spontanément à quelques questions en anglais.' }
                    ].map((c) => (
                        <div key={c.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                            <div className="md:col-span-7">
                                <h4 className="font-bold text-slate-800 text-sm mb-1">{c.title}</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
                            </div>
                            <div className="md:col-span-5 flex items-center justify-between md:grid md:grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((score) => (
                                    <label key={score} className="cursor-pointer">
                                        <input
                                            type="radio"
                                            name={c.id}
                                            className="peer sr-only"
                                            value={score}
                                            checked={evalData[c.id as keyof typeof evalData] === score}
                                            onChange={() => handleScoreChange(c.id, score)}
                                        />
                                        <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all ${evalData[c.id as keyof typeof evalData] === score ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-200'}`}>
                                            {score}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Commentaires et Note globale */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Commentaires et observations</label>
                        <textarea
                            className="w-full h-32 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none font-medium transition-all resize-none"
                            value={evalData.commentaires}
                            onChange={(e) => setEvalData({ ...evalData, commentaires: e.target.value })}
                            placeholder="Vos observations sur le candidat..."
                        ></textarea>
                    </div>
                    <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col items-center justify-center text-center shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Note globale</span>
                        <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-6xl font-black text-emerald-400">{totalScore}</span>
                            <span className="text-xl font-bold text-slate-500">/ 20</span>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${totalScore >= 12 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {getAppreciation(totalScore)}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row gap-4 pt-8 border-t border-slate-100">
                    <Button variant="secondary" className="flex-1" onClick={resetEvaluation} leftIcon={<RotateCcw size={18} />}>
                        Réinitialiser
                    </Button>
                    <Button variant="success" className="flex-1" onClick={saveEvaluation} leftIcon={<Save size={18} />}>
                        Enregistrer
                    </Button>
                    <Button variant="primary" className="flex-1 !bg-slate-900" onClick={exportEvaluationPDF} leftIcon={<Printer size={18} />}>
                        Exporter PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};


const AdmissionView = () => {
    const [mainTab, setMainTab] = useState<'dashboard' | 'ntc'>('dashboard');
    const [activeTab, setActiveTab] = useState<AdmissionTab>(AdmissionTab.TESTS);
    const [selectedFormation, setSelectedFormation] = useState<string | null>(null);

    // States to track progress
    const [testCompleted, setTestCompleted] = useState(false);
    const [studentData, setStudentData] = useState<any>(null);

    const [uploadedFiles, setUploadedFiles] = useState<Record<string, boolean>>({});
    const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

    const [entrepriseCompleted, setEntrepriseCompleted] = useState(false);
    const [adminCompleted, setAdminCompleted] = useState(false);

    // Modal state
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleFinishTest = () => {
        setTestCompleted(true);
        setActiveTab(AdmissionTab.QUESTIONNAIRE);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, docId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check for record ID
        const recordId = studentData?.record_id || localStorage.getItem('candidateRecordId');

        if (!recordId) {
            alert("Erreur : Aucun dossier étudiant trouvé. Veuillez remplir la fiche étudiant avant de déposer des documents.");
            return;
        }

        setUploadingFiles(prev => ({ ...prev, [docId]: true }));

        try {
            await api.uploadDocument(recordId, docId, file);
            setUploadedFiles(prev => ({ ...prev, [docId]: true }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Erreur lors du téléversement du document. Veuillez réessayer.");
        } finally {
            setUploadingFiles(prev => ({ ...prev, [docId]: false }));
        }
    };

    // Handle Document Action (e.g. Generate Fiche Renseignement)
    const handleDocAction = async (doc: any) => {
        // Cas spécifique pour la Fiche de renseignements
        if (doc.id === 'renseignements') {
            if (!studentData && !localStorage.getItem('candidateRecordId')) {
                alert("Veuillez d'abord compléter la Fiche Étudiant.");
                return;
            }

            const recordId = studentData?.record_id || studentData?.id || localStorage.getItem('candidateRecordId');
            if (!recordId) {
                alert("Identifiant étudiant introuvable. Veuillez recharger ou compléter le dossier.");
                return;
            }

            try {
                const btn = document.getElementById(`btn-${doc.id}`);
                const originalText = btn ? btn.innerText : "";
                if (btn) btn.innerText = "Génération...";

                await api.generateFicheRenseignement(recordId);
                setShowSuccessModal(true);

                if (btn) btn.innerText = originalText;
            } catch (e) {
                console.error(e);
                alert("Erreur lors de la génération de la fiche.");
                const btn = document.getElementById(`btn-${doc.id}`);
                if (btn) btn.innerText = "Compléter";
            }
        } else if (doc.id === 'cerfa') {
            if (!studentData && !localStorage.getItem('candidateRecordId')) {
                alert("Veuillez d'abord compléter la Fiche Étudiant.");
                return;
            }

            const recordId = studentData?.record_id || studentData?.id || localStorage.getItem('candidateRecordId');
            if (!recordId) {
                alert("Identifiant étudiant introuvable. Veuillez recharger ou compléter le dossier.");
                return;
            }

            try {
                const btn = document.getElementById(`btn-${doc.id}`);
                const originalText = btn ? btn.innerText : "";
                if (btn) btn.innerText = "Génération...";

                await api.generateCerfa(recordId);
                setShowSuccessModal(true);

                if (btn) btn.innerText = originalText;
            } catch (e) {
                console.error(e);
                alert("Erreur lors de la génération du CERFA.");
                const btn = document.getElementById(`btn-${doc.id}`);
                if (btn) btn.innerText = "Générer";
            }
        } else {
            console.log("Action pour le document:", doc.title);
        }
    };

    const uploadedCount = Object.keys(uploadedFiles).length;
    const progressPercent = (uploadedCount / REQUIRED_DOCUMENTS.length) * 100;

    // --- NTC VIEW RENDER ---
    if (mainTab === 'ntc') {
        return (
            <div className="animate-fade-in">
                <div className="flex gap-2 mb-6 bg-slate-50 p-2 rounded-2xl border border-slate-200 w-fit">
                    <button onClick={() => setMainTab('dashboard')} className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-white hover:text-slate-700">
                        Tableau de bord
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200">
                        Classe NTC
                        <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">35</span>
                    </button>
                </div>

                {/* Header NTC */}
                <div className="bg-gradient-to-br from-[#eff6ff] to-[#f8fafc] border border-blue-100 rounded-3xl p-8 mb-8 relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Classe NTC — Vue d'ensemble</h2>
                                <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    35 étudiants
                                </span>
                            </div>
                            <p className="text-slate-500">Suivi en temps réel des dossiers d'admission et statut des alternances</p>
                        </div>
                        <Button variant="primary" leftIcon={<Download size={18} />}>
                            Exporter CSV
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 text-2xl">👥</div>
                        <div className="text-4xl font-extrabold text-slate-800 mb-1">35</div>
                        <div className="text-sm font-medium text-slate-500">Étudiants inscrits</div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4 text-2xl">👩</div>
                        <div className="text-4xl font-extrabold text-slate-800 mb-1">22</div>
                        <div className="text-sm font-medium text-slate-500">Femmes (62.9%)</div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-green-50 shadow-sm border-l-4 border-l-green-400 hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-4 text-2xl">✅</div>
                        <div className="text-4xl font-extrabold text-slate-800 mb-1">16</div>
                        <div className="text-sm font-medium text-slate-500">Avec Alternance</div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <div className="relative w-96">
                            <input type="text" placeholder="Rechercher un étudiant..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                            <div className="absolute left-3 top-3.5 text-slate-400">🔍</div>
                        </div>
                    </div>
                    <table className="w-full">
                        <thead className="bg-[#1a1a2e] text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Prénom</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Dossier Étudiant</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Dossier Entreprise</th>
                                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider">Alternance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-800">KELLAL KINY</td>
                                <td className="px-6 py-4 text-slate-600">Miriam</td>
                                <td className="px-6 py-4"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✓ Complétée</span></td>
                                <td className="px-6 py-4"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✓ Complétée</span></td>
                                <td className="px-6 py-4 text-center"><span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 shadow-sm">OUI</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-6xl mx-auto pb-20 relative">
            <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />

            {/* Hero Section */}
            <div className="admission-hero">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full max-w-[60%]">
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <img src="/images/logo-process-iq.png" alt="Process IQ" className="h-10 w-fit brightness-0 invert" />
                            <div className="hidden md:block w-px h-8 bg-white/20"></div>
                            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
                                <Briefcase size={14} /> Processus d'admission
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Admission Rush School</h1>
                        <p className="text-indigo-100 text-lg leading-relaxed opacity-90">Complétez votre dossier d'admission : tests, documents et formalités administratives.</p>
                    </div>
                </div>
            </div>

            {/* Stepper */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 flex items-center justify-center overflow-x-auto shadow-sm">
                <div className="flex items-center min-w-max">
                    <StepItem step={1} label="Tests" isActive={activeTab === AdmissionTab.TESTS} isCompleted={testCompleted} />
                    <StepLine isCompleted={testCompleted} />
                    <StepItem step={2} label="Étudiant" isActive={activeTab === AdmissionTab.QUESTIONNAIRE} isCompleted={!!studentData} />
                    <StepLine isCompleted={!!studentData} />
                    <StepItem step={3} label="Documents" isActive={activeTab === AdmissionTab.DOCUMENTS} isCompleted={uploadedCount >= REQUIRED_DOCUMENTS.length} />
                    <StepLine isCompleted={uploadedCount >= REQUIRED_DOCUMENTS.length} />
                    <StepItem step={4} label="Entreprise" isActive={activeTab === AdmissionTab.ENTREPRISE} isCompleted={entrepriseCompleted} />
                    <StepLine isCompleted={entrepriseCompleted} />
                    <StepItem step={5} label="Admin" isActive={activeTab === AdmissionTab.ADMINISTRATIF} isCompleted={adminCompleted} />
                    <StepLine isCompleted={adminCompleted} />
                    <StepItem step={6} label="Entretien" isActive={activeTab === AdmissionTab.ENTRETIEN} isCompleted={false} />
                </div>
            </div>

            {/* Main Tabs Switcher */}
            <div className="flex gap-2 mb-8 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 w-fit shadow-inner">
                <button onClick={() => setMainTab('dashboard')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${mainTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500'}`}>
                    Tableau de bord
                </button>
                <button onClick={() => setMainTab('ntc')} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${mainTab === 'ntc' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                    Classe NTC
                    <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px]">35</span>
                </button>
            </div>

            {/* Internal Tabs for Admission Flow */}
            <div className="flex overflow-x-auto gap-2 mb-8 bg-[#F1F5F9] p-2 rounded-2xl border border-slate-200 no-scrollbar">
                {[
                    { id: AdmissionTab.TESTS, label: 'Tests', icon: PenTool },
                    { id: AdmissionTab.QUESTIONNAIRE, label: 'Fiche Étudiant', icon: Info },
                    { id: AdmissionTab.DOCUMENTS, label: 'Documents', icon: Upload },
                    { id: AdmissionTab.ENTREPRISE, label: 'Fiche Entreprise', icon: Building },
                    { id: AdmissionTab.ADMINISTRATIF, label: 'Administratif', icon: Printer },
                    { id: AdmissionTab.ENTRETIEN, label: 'Entretien', icon: UserCheck }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as AdmissionTab)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Sections */}
            {activeTab === AdmissionTab.TESTS && (
                <div className="space-y-6 animate-slide-in">
                    {!selectedFormation ? (
                        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                                <GraduationCap className="text-blue-500" /> Sélectionnez votre formation
                            </h3>
                            <p className="text-slate-500 mb-8 ml-9">Choisissez la formation pour accéder au test.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {FORMATION_CARDS.map(f => (
                                    <div key={f.id} onClick={() => setSelectedFormation(f.id)} className="bg-[#F8FAFC] border-2 border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-blue-500 hover:-translate-y-1 hover:shadow-lg transition-all group">
                                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white bg-gradient-to-br from-${f.color}-500 to-${f.color}-600 shadow-lg`}>
                                            <Briefcase size={28} />
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">{f.title}</h4>
                                        <p className="text-xs text-slate-500 mb-4 h-10">{f.subtitle}</p>
                                        <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-semibold text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">~20 min</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col relative animate-slide-in shadow-lg">
                            <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
                                <button
                                    onClick={() => setSelectedFormation(null)}
                                    className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-semibold text-sm transition-colors"
                                >
                                    <ChevronLeft size={18} /> Changer de formation
                                </button>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-700 hidden md:block">Test: {FORMATION_CARDS.find(f => f.id === selectedFormation)?.title}</span>
                                    <Button variant="success" size="sm" onClick={handleFinishTest} leftIcon={<CheckCircle2 size={16} />}>
                                        J'ai envoyé mes réponses
                                    </Button>
                                </div>
                            </div>
                            <div className="w-full h-[800px] bg-slate-100 relative">
                                <iframe
                                    src={selectedFormation ? FORMATION_FORMS[selectedFormation] : ""}
                                    className="absolute inset-0 w-full h-full border-0"
                                    title="Formulaire de test"
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === AdmissionTab.QUESTIONNAIRE && (
                <div className="animate-slide-in">
                    <QuestionnaireForm onNext={(data) => {
                        setStudentData(data);
                        setActiveTab(AdmissionTab.DOCUMENTS);
                    }} />
                </div>
            )}

            {activeTab === AdmissionTab.DOCUMENTS && (
                <div className="animate-slide-in">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-6 flex items-center gap-5 relative overflow-hidden">
                        <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm relative z-10">
                            <Upload size={28} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-slate-800">Documents à téléverser</h3>
                            <p className="text-slate-500 text-sm">Complétez votre dossier avec les pièces justificatives.</p>
                        </div>
                        {!studentData && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
                                <AlertCircle size={18} />
                                <span className="text-sm font-bold">Dossier étudiant requis</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {REQUIRED_DOCUMENTS.map((doc) => {
                            const isUploaded = uploadedFiles[doc.id];
                            const isUploading = uploadingFiles[doc.id];

                            return (
                                <div key={doc.id} className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative overflow-hidden ${isUploaded
                                    ? 'border-emerald-400 bg-emerald-50'
                                    : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50'
                                    }`}>
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                        disabled={isUploading || !studentData}
                                        onChange={(e) => handleFileChange(e, doc.id)}
                                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                    />

                                    {isUploading ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20">
                                            <Loader2 size={32} className="animate-spin text-blue-600 mb-2" />
                                            <span className="text-xs font-bold text-blue-600">Envoi en cours...</span>
                                        </div>
                                    ) : null}

                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isUploaded
                                        ? 'bg-emerald-100 text-emerald-600'
                                        : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'
                                        }`}>
                                        {isUploaded ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                                    </div>
                                    <h4 className={`font-bold mb-1 ${isUploaded ? 'text-emerald-800' : 'text-slate-700'}`}>{doc.title}</h4>
                                    <p className={`text-xs mb-4 ${isUploaded ? 'text-emerald-600' : 'text-slate-400'}`}>{doc.desc}</p>

                                    <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors pointer-events-none ${isUploaded
                                        ? 'bg-emerald-200 text-emerald-800'
                                        : 'bg-slate-900 text-white group-hover:bg-slate-800'
                                        }`}>
                                        {isUploaded ? 'Document reçu' : 'Téléverser'}
                                    </button>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="w-full md:w-1/2">
                            <div className="flex justify-between text-sm font-semibold mb-2">
                                <span className="text-slate-800">{uploadedCount} / {REQUIRED_DOCUMENTS.length} documents</span>
                                <span className="text-blue-500">{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 to-indigo-500"
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                        </div>
                        <Button
                            disabled={!studentData}
                            onClick={() => setActiveTab(AdmissionTab.ENTREPRISE)}
                            className="w-full md:w-auto"
                        >
                            Continuer vers la Fiche Entreprise
                        </Button>
                    </div>
                </div>
            )}

            {activeTab === AdmissionTab.ENTREPRISE && (
                <div className="animate-slide-in">
                    <EntrepriseForm
                        onNext={() => {
                            setEntrepriseCompleted(true);
                            setActiveTab(AdmissionTab.ADMINISTRATIF);
                        }}
                        studentRecordId={studentData?.record_id || localStorage.getItem('candidateRecordId')}
                    />
                </div>
            )}

            {activeTab === AdmissionTab.ADMINISTRATIF && (
                <div className="animate-slide-in">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 flex items-center gap-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                            <Printer size={28} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Dossier administratif</h3>
                            <p className="text-slate-500 text-sm">Ces documents seront complétés avec le chargé d'admission.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ADMIN_DOCS.map(doc => (
                            <div key={doc.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${doc.color}-400 to-${doc.color}-600 flex items-center justify-center text-white mb-4 shadow-lg`}>
                                    <FileText size={24} />
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg mb-1">{doc.title}</h4>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{doc.subtitle}</p>
                                <p className="text-sm text-slate-400 mb-6">{doc.desc}</p>
                                <button
                                    id={`btn-${doc.id}`}
                                    onClick={() => handleDocAction(doc)}
                                    className="w-full py-2.5 rounded-lg border-2 border-slate-100 font-bold text-slate-600 hover:border-slate-300 hover:text-slate-800 transition-all flex items-center justify-center gap-2"
                                >
                                    {doc.btnText} <ArrowRight size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end mt-8">
                        <Button onClick={() => setActiveTab(AdmissionTab.ENTRETIEN)} rightIcon={<ArrowRight size={20} />}>
                            Continuer vers Entretien
                        </Button>
                    </div>
                </div>
            )}

            {activeTab === AdmissionTab.ENTRETIEN && (
                <div className="animate-slide-in">
                    <EvaluationGrid studentData={studentData} />
                </div>
            )}

        </div>
    );
};

export default AdmissionView;