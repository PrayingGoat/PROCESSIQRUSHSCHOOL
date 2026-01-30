import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building, Calculator, PenTool, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import Button from './ui/Button';

import Input from './ui/Input';
import Select from './ui/Select';
import Card from './ui/Card';

const companySchema = z.object({
    identification: z.object({
        raison_sociale: z.string().min(2, "La raison sociale est requise"),
        siret: z.string().regex(/^[0-9]{14}$/, "Le SIRET doit contenir exactement 14 chiffres"),
        code_ape_naf: z.string().regex(/^[0-9]{4}[A-Z]$/, "Code APE invalide (ex: 4711D)"),
        type_employeur: z.string().min(1, "Veuillez sélectionner le type d'employeur"),
        effectif: z.string().min(1, "L'effectif est requis"),
        convention: z.string().optional().or(z.literal(""))
    }),
    adresse: z.object({
        num: z.string().optional().or(z.literal("")),
        voie: z.string().min(2, "La voie est requise"),
        complement: z.string().optional().or(z.literal("")),
        code_postal: z.string().regex(/^[0-9]{5}$/, "Le code postal doit contenir 5 chiffres"),
        ville: z.string().min(1, "La ville est requise"),
        telephone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Téléphone invalide"),
        email: z.string().email("L'adresse e-mail est invalide")
    }),
    maitre_apprentissage: z.object({
        nom: z.string().min(2, "Le nom est requis"),
        prenom: z.string().min(2, "Le prénom est requis"),
        date_naissance: z.string().min(1, "La date de naissance est requise"),
        fonction: z.string().min(2, "La fonction est requise"),
        diplome: z.string().min(1, "Veuillez sélectionner le diplôme"),
        experience: z.string().optional().or(z.literal("")),
        telephone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Téléphone invalide"),
        email: z.string().email("L'adresse e-mail est invalide")
    }),
    opco: z.object({
        nom: z.string().min(1, "Veuillez sélectionner votre OPCO")
    }),
    formation: z.object({
        choisie: z.string().min(1, "Veuillez sélectionner la formation"),
        date_debut: z.string().min(1, "Date de début requise"),
        date_fin: z.string().min(1, "Date de fin requise"),
        code_rncp: z.string().optional().or(z.literal("")),
        code_diplome: z.string().optional().or(z.literal("")),
        nb_heures: z.string().optional().or(z.literal("")),
        jours_cours: z.string().optional().or(z.literal(""))
    }),
    cfa: z.object({
        rush_school: z.string(),
        entreprise: z.string(),
        denomination: z.string(),
        uai: z.string(),
        siret: z.string(),
        adresse: z.string(),
        complement: z.string().optional().or(z.literal("")),
        code_postal: z.string(),
        commune: z.string()
    }),
    contrat: z.object({
        type_contrat: z.string().min(1, "Type de contrat requis"),
        type_derogation: z.string().optional().or(z.literal("")),
        date_debut: z.string().optional().or(z.literal("")),
        date_fin: z.string().optional().or(z.literal("")),
        duree_hebdomadaire: z.string().min(1, "Durée requise"),
        poste_occupe: z.string().min(2, "Poste occupé requis"),
        lieu_execution: z.string().optional().or(z.literal("")),
        pourcentage_smic: z.number().optional(),
        smic: z.string().optional(),
        montant_salaire_brut: z.number().optional(),
        date_conclusion: z.string().optional().or(z.literal("")),
        date_debut_execution: z.string().optional().or(z.literal("")),
        numero_deca_ancien_contrat: z.string().optional().or(z.literal("")),
        machines_dangereuses: z.string(),
        caisse_retraite: z.string().optional().or(z.literal("")),
        date_avenant: z.string().optional().or(z.literal("")),
        nombre_mois: z.number().optional()
    }),
    salaire: z.object({
        age: z.string().min(1, "Tranche d'âge requise"),
        annee: z.string().min(1, "Année requise"),
        pourcentage: z.number().optional(),
        montant: z.number().optional()
    }),
    missions: z.object({
        formation_alternant: z.string().optional().or(z.literal("")),
        selectionnees: z.array(z.string()).min(3, "Veuillez sélectionner au moins 3 missions")
    }),
    record_id_etudiant: z.string()
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface EntrepriseFormProps {
    onNext: () => void;
    studentRecordId: string | null;
}

const EntrepriseForm: React.FC<EntrepriseFormProps> = ({ onNext, studentRecordId }) => {
    const { showToast } = useAppStore();
    const [isSubmitting, setIsSubmitting] = useState(false);


    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            identification: { raison_sociale: "", siret: "", code_ape_naf: "", type_employeur: "", effectif: "", convention: "" },
            adresse: { num: "", voie: "", complement: "", code_postal: "", ville: "", telephone: "", email: "" },
            maitre_apprentissage: { nom: "", prenom: "", date_naissance: "", fonction: "", diplome: "", experience: "", telephone: "", email: "" },
            opco: { nom: "" },
            formation: { choisie: "", date_debut: "", date_fin: "", code_rncp: "", code_diplome: "", nb_heures: "", jours_cours: "" },
            cfa: {
                rush_school: "oui", entreprise: "non", denomination: "RUSH SCHOOL", uai: "0932731W",
                siret: "91901416300018", adresse: "11-13 AVENUE DE LA DIVISION LECLERC", complement: "", code_postal: "93000", commune: "BOBIGNY"
            },
            contrat: {
                type_contrat: "", type_derogation: "", date_debut: "", date_fin: "", duree_hebdomadaire: "35h", poste_occupe: "",
                lieu_execution: "", pourcentage_smic: 0, smic: "1823.03", montant_salaire_brut: 0, date_conclusion: "", date_debut_execution: "",
                numero_deca_ancien_contrat: "", machines_dangereuses: "Non", caisse_retraite: "", date_avenant: "", nombre_mois: 12
            },
            salaire: { age: "", annee: "", pourcentage: 0, montant: 0 },
            missions: { formation_alternant: "", selectionnees: [] as string[] },
            record_id_etudiant: studentRecordId || ""
        }
    });

    const formData = watch();

    const FORMATION_DETAILS: Record<string, any> = {
        "BTS MCO A": { debut: "2024-09-02", fin: "2026-08-31", rncp: "RNCP38368", diplome: "32031310", heures: "1350", jours: "Lundi/Mardi" },
        "BTS NDRC 1": { debut: "2024-09-02", fin: "2026-08-31", rncp: "RNCP38368", diplome: "32031310", heures: "1350", jours: "Mercredi/Jeudi" },
        "Titre Pro NTC": { debut: "2024-09-02", fin: "2025-08-31", rncp: "RNCP34059", diplome: "46T31201", heures: "600", jours: "Lundi/Mardi" },
        "Bachelor RDC": { debut: "2024-09-16", fin: "2025-09-12", rncp: "RNCP36504", diplome: "26X31204", heures: "525", jours: "Vendredi" }
    };

    const handleFormationChange = (val: string) => {
        const details = FORMATION_DETAILS[val] || { debut: "", fin: "", rncp: "", diplome: "", heures: "", jours: "" };

        let nbMois = 12;
        if (details.debut && details.fin) {
            const d1 = new Date(details.debut);
            const d2 = new Date(details.fin);
            nbMois = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
            if (nbMois < 1) nbMois = 1;
        }

        setValue('formation.choisie', val);
        setValue('formation.date_debut', details.debut);
        setValue('formation.date_fin', details.fin);
        setValue('formation.code_rncp', details.rncp);
        setValue('formation.code_diplome', details.diplome);
        setValue('formation.nb_heures', details.heures);
        setValue('formation.jours_cours', details.jours);
        setValue('contrat.nombre_mois', nbMois);
    };

    const handleSalaryCalc = (age: string, annee: string) => {
        let montantCalc = 0;
        let pctCalc = 0;

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

        setValue('salaire.age', age);
        setValue('salaire.annee', annee);
        setValue('salaire.pourcentage', pctCalc);
        setValue('salaire.montant', montantCalc);
        setValue('contrat.pourcentage_smic', pctCalc);
        setValue('contrat.montant_salaire_brut', montantCalc);
    };

    const toggleMission = (mission: string) => {
        const current = formData.missions.selectionnees;
        const next = current.includes(mission)
            ? current.filter(m => m !== mission)
            : [...current, mission];
        setValue('missions.selectionnees', next, { shouldValidate: true });
    };

    const onSubmit = async (data: CompanyFormValues) => {
        if (!studentRecordId) {
            showToast("Erreur: ID étudiant manquant. Veuillez revenir à l'étape précédente.", "error");
            return;
        }


        setIsSubmitting(true);
        try {
            await api.submitCompany(data as any);
            onNext();
        } catch (error) {
            console.error("Erreur soumission entreprise:", error);
            showToast("Une erreur est survenue lors de l'enregistrement. Vérifiez les données et réessayez.", "error");
        } finally {

            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-6 md:p-10 shadow-xl border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"></div>

                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-blue-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 shrink-0">
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
                                <Input label="Raison sociale" required placeholder="Nom de l'entreprise" error={errors.identification?.raison_sociale?.message} {...register('identification.raison_sociale')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Numéro SIRET" required placeholder="14 chiffres" error={errors.identification?.siret?.message} {...register('identification.siret')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Code APE/NAF" required placeholder="Ex: 4711D" error={errors.identification?.code_ape_naf?.message} {...register('identification.code_ape_naf')} />
                            </div>
                            <div className="col-span-12">
                                <Select
                                    label="Type d'employeur"
                                    required
                                    error={errors.identification?.type_employeur?.message}
                                    {...register('identification.type_employeur')}
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
                                <Input label="Effectif salarié" required type="number" placeholder="Nombre" error={errors.identification?.effectif?.message} {...register('identification.effectif')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Convention collective" placeholder="Intitulé" {...register('identification.convention')} />
                            </div>
                        </div>
                    </Card>

                    <Card step={2} title="Adresse de l'entreprise" collapsible defaultOpen={false}>
                        <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-12 md:col-span-3">
                                <Input label="Numéro" placeholder="N°" {...register('adresse.num')} />
                            </div>
                            <div className="col-span-12 md:col-span-9">
                                <Input label="Voie" required placeholder="Rue, avenue, boulevard..." error={errors.adresse?.voie?.message} {...register('adresse.voie')} />
                            </div>
                            <div className="col-span-12">
                                <Input label="Complément d'adresse" placeholder="Bâtiment, étage, etc." {...register('adresse.complement')} />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <Input label="Code postal" required placeholder="Ex: 75001" error={errors.adresse?.code_postal?.message} {...register('adresse.code_postal')} />
                            </div>
                            <div className="col-span-12 md:col-span-8">
                                <Input label="Ville" required placeholder="Ville" error={errors.adresse?.ville?.message} {...register('adresse.ville')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Téléphone" required type="tel" placeholder="Téléphone entreprise" error={errors.adresse?.telephone?.message} {...register('adresse.telephone')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Email" required type="email" placeholder="Email de contact" error={errors.adresse?.email?.message} {...register('adresse.email')} />
                            </div>
                        </div>
                    </Card>

                    <Card step={3} title="Maître d'apprentissage" collapsible defaultOpen={false}>
                        <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Nom" required placeholder="Nom" error={errors.maitre_apprentissage?.nom?.message} {...register('maitre_apprentissage.nom')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Prénom" required placeholder="Prénom" error={errors.maitre_apprentissage?.prenom?.message} {...register('maitre_apprentissage.prenom')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Date de naissance" required type="date" error={errors.maitre_apprentissage?.date_naissance?.message} {...register('maitre_apprentissage.date_naissance')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Fonction" required placeholder="Poste occupé" error={errors.maitre_apprentissage?.fonction?.message} {...register('maitre_apprentissage.fonction')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Select
                                    label="Diplôme le plus élevé"
                                    error={errors.maitre_apprentissage?.diplome?.message}
                                    {...register('maitre_apprentissage.diplome')}
                                    options={[
                                        { value: "Aucun diplôme", label: "Aucun diplôme" },
                                        { value: "CAP, BEP", label: "CAP, BEP" },
                                        { value: "Baccalauréat", label: "Baccalauréat" },
                                        { value: "DEUG, BTS, DUT, DEUST", label: "DEUG, BTS, DUT, DEUST" },
                                        { value: "Licence, Licence professionnelle, BUT, Maîtrise", label: "Licence, Licence professionnelle, BUT, Maîtrise" },
                                        { value: "Master, Diplôme d études approfondies, Diplôme d études spécialisées, Diplôme d ingénieur", label: "Master, DEA, DESS, Diplôme d'ingénieur" },
                                        { value: "Doctorat, Habilitation à diriger des recherches", label: "Doctorat, HDR" }
                                    ]}
                                    placeholder="Sélectionnez"
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <Input label="Années d'expérience" type="number" placeholder="Années" {...register('maitre_apprentissage.experience')} />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <Input label="Téléphone" required type="tel" placeholder="Téléphone" error={errors.maitre_apprentissage?.telephone?.message} {...register('maitre_apprentissage.telephone')} />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <Input label="Email" required type="email" placeholder="Email" error={errors.maitre_apprentissage?.email?.message} {...register('maitre_apprentissage.email')} />
                            </div>
                        </div>
                    </Card>

                    <Card step={4} title="OPCO (Opérateur de Compétences)" collapsible defaultOpen={false}>
                        <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-12">
                                <Select
                                    label="Sélectionnez votre OPCO"
                                    required
                                    error={errors.opco?.nom?.message}
                                    {...register('opco.nom')}
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
                                            <input className="peer sr-only" type="radio" value={f} checked={formData.formation.choisie === f} onChange={() => handleFormationChange(f)} />
                                            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all ${formData.formation.choisie === f ? 'bg-primary-50/50 border-primary shadow-indigo' : 'bg-slate-50/50 border-transparent hover:border-slate-200'}`}>
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${formData.formation.choisie === f ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}`}>{String.fromCharCode(65 + idx)}</span>
                                                <span className="font-bold text-slate-700">{f}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.formation?.choisie && <p className="mt-1.5 text-rose-500 text-[11px] font-black uppercase tracking-wider">{errors.formation.choisie.message}</p>}
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Date de début" required type="date" error={errors.formation?.date_debut?.message} {...register('formation.date_debut')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Date de fin" required type="date" error={errors.formation?.date_fin?.message} {...register('formation.date_fin')} />
                            </div>

                            <div className="col-span-12 mt-4">
                                <div className="flex items-center gap-8 mb-6 px-2">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            value="oui"
                                            checked={formData.cfa.rush_school === 'oui'}
                                            onChange={() => {
                                                setValue('cfa.rush_school', 'oui');
                                                setValue('cfa.entreprise', 'non');
                                            }}
                                            className="w-5 h-5 accent-primary"
                                        />
                                        <span className="font-bold text-slate-700 text-sm group-hover:text-primary transition-colors">CFA Rush School</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="radio"
                                            value="non"
                                            checked={formData.cfa.rush_school === 'non'}
                                            onChange={() => {
                                                setValue('cfa.rush_school', 'non');
                                                setValue('cfa.entreprise', 'oui');
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
                                            <Input label="Dénomination du CFA" required {...register('cfa.denomination')} />
                                        </div>
                                        <div className="col-span-12 md:col-span-6">
                                            <Input label="N° SIRET" required {...register('cfa.siret')} />
                                        </div>
                                        <div className="col-span-12 md:col-span-6">
                                            <Input label="Code UAI" required {...register('cfa.uai')} />
                                        </div>
                                        <div className="col-span-12">
                                            <Input label="Adresse complète" required {...register('cfa.adresse')} />
                                        </div>
                                        <div className="col-span-12 md:col-span-4">
                                            <Input label="Code Postal" required {...register('cfa.code_postal')} />
                                        </div>
                                        <div className="col-span-12 md:col-span-8">
                                            <Input label="Commune" required {...register('cfa.commune')} />
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
                                    error={errors.contrat?.type_contrat?.message}
                                    {...register('contrat.type_contrat')}
                                    options={[
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
                                    ]}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Select
                                    label="Type de dérogation"
                                    {...register('contrat.type_derogation')}
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
                                <Input label="Durée hebdomadaire" required placeholder="Ex: 35h" error={errors.contrat?.duree_hebdomadaire?.message} {...register('contrat.duree_hebdomadaire')} />
                            </div>
                            <div className="col-span-12">
                                <Input label="Poste occupé" required placeholder="Intitulé exact du poste" error={errors.contrat?.poste_occupe?.message} {...register('contrat.poste_occupe')} />
                            </div>
                            <div className="col-span-12">
                                <Input label="Lieu d'exécution" placeholder="Adresse si différente" {...register('contrat.lieu_execution')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="N° DECA ancien contrat" placeholder="Si applicable" {...register('contrat.numero_deca_ancien_contrat')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Date de conclusion" type="date" {...register('contrat.date_conclusion')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Date début exécution" type="date" {...register('contrat.date_debut_execution')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Date avenant" type="date" {...register('contrat.date_avenant')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Caisse de retraite" placeholder="Nom de la caisse" {...register('contrat.caisse_retraite')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Select
                                    label="Travail sur machines dangereuses"
                                    required
                                    {...register('contrat.machines_dangereuses')}
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
                                        error={errors.salaire?.age?.message}
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
                                        error={errors.salaire?.annee?.message}
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
                                {errors.missions?.selectionnees && <p className="mt-4 text-rose-500 text-[11px] font-black uppercase tracking-wider">{errors.missions.selectionnees.message}</p>}
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
                                    {...register('missions.formation_alternant')}
                                />
                            </div>
                        </div>
                    </Card>
                </div>

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
                        <Button variant="outline" type="button" className="flex-1 md:flex-none" onClick={() => showToast("Brouillon enregistré", "info")}>
                            Brouillon
                        </Button>

                        <Button
                            size="lg"
                            type="submit"
                            isLoading={isSubmitting}
                            rightIcon={<ArrowRight size={20} />}
                            className="flex-[2] md:flex-none"
                        >
                            Valider la fiche
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default EntrepriseForm;