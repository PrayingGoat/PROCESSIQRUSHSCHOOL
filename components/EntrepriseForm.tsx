import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building, Calculator, PenTool, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { useApi } from '../hooks/useApi';
import Button from './ui/Button';

import Input from './ui/Input';
import Select from './ui/Select';
import { formatPhone, formatSIRET } from '../utils/formatters';
import {
    EMPLOYER_TYPE_OPTIONS,
    EMPLOYER_SPECIFIC_OPTIONS,
    MAITRE_DIPLOMA_OPTIONS,
    OPCO_OPTIONS,
    CONTRAT_TYPE_OPTIONS,
    DEROGATION_TYPE_OPTIONS,
    AGE_TRANCHE_OPTIONS,
    APPRENTISSAGE_YEAR_OPTIONS,
    YES_NO_OPTIONS,
    FORMATION_DETAILS
} from '../constants/formOptions';

import Card from './ui/Card';


const companySchema = z.object({
    identification: z.object({
        raison_sociale: z.string().min(2, "La raison sociale est requise"),
        siret: z.string().refine(val => {
            const cleaned = val.replace(/\s/g, '');
            return /^[0-9]{14}$/.test(cleaned);
        }, "Le SIRET doit contenir exactement 14 chiffres"),
        code_ape_naf: z.string().regex(/^[0-9]{4}[A-Z]$/, "Code APE invalide (ex: 4711D)"),
        type_employeur: z.string().min(1, "Veuillez sélectionner le type d'employeur"),
        employeur_specifique: z.string().min(1, "Veuillez sélectionner le type d'employeur spécifique"),
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

        pourcentage_smic1: z.number().optional(),
        smic1: z.string().optional(),
        montant_salaire_brut1: z.number().optional(),

        pourcentage_smic2: z.number().optional(),
        smic2: z.string().optional(),
        montant_salaire_brut2: z.number().optional(),

        pourcentage_smic3: z.number().optional(),
        smic3: z.string().optional(),
        montant_salaire_brut3: z.number().optional(),

        pourcentage_smic4: z.number().optional(),
        smic4: z.string().optional(),
        montant_salaire_brut4: z.number().optional(),

        date_conclusion: z.string().optional().or(z.literal("")),
        date_debut_execution: z.string().optional().or(z.literal("")),
        numero_deca_ancien_contrat: z.string().optional().or(z.literal("")),
        machines_dangereuses: z.string(),
        caisse_retraite: z.string().optional().or(z.literal("")),
        date_avenant: z.string().optional().or(z.literal("")),
        nombre_mois: z.number().optional(),

        // MAPPINGS DES PÉRIODES DE SALAIRE
        date_debut_2periode_1er_annee: z.string().min(1, "Date de début requise"),
        date_fin_2periode_1er_annee: z.string().min(1, "Date de fin requise"),

        date_debut_1periode_2eme_annee: z.string().optional().or(z.literal("")),
        date_fin_1periode_2eme_annee: z.string().optional().or(z.literal("")),
        date_debut_2periode_2eme_annee: z.string().optional().or(z.literal("")),
        date_fin_2periode_2eme_annee: z.string().optional().or(z.literal("")),

        date_debut_1periode_3eme_annee: z.string().optional().or(z.literal("")),
        date_fin_1periode_3eme_annee: z.string().optional().or(z.literal("")),
        date_debut_2periode_3eme_annee: z.string().optional().or(z.literal("")),
        date_fin_2periode_3eme_annee: z.string().optional().or(z.literal("")),

        date_debut_1periode_4eme_annee: z.string().optional().or(z.literal("")),
        date_fin_1periode_4eme_annee: z.string().optional().or(z.literal("")),
        date_debut_2periode_4eme_annee: z.string().optional().or(z.literal("")),
        date_fin_2periode_4eme_annee: z.string().optional().or(z.literal(""))
    }),
    salaire: z.object({
        age1: z.string().min(1, "L'âge est requis"),
        age2: z.string().optional(),
        age3: z.string().optional(),
        age4: z.string().optional()
    }),
    missions: z.object({
        formation_alternant: z.string().optional().or(z.literal("")),
        selectionnees: z.array(z.string()).min(3, "Veuillez sélectionner au moins 3 missions")
    }),
    record_id_etudiant: z.string()
});

type CompanyFormValues = z.infer<typeof companySchema>;

import { useCandidates } from '../hooks/useCandidates';

interface EntrepriseFormProps {
    onNext: (response?: any) => void;
    studentRecordId: string | null;
}

const EntrepriseForm: React.FC<EntrepriseFormProps> = ({ onNext, studentRecordId }) => {
    const { showToast, draftCompany, setDraftCompany, clearDraftCompany } = useAppStore();
    const { refresh: refreshCandidates } = useCandidates();
    const [activeSection, setActiveSection] = useState<string | null>('id');

    const toggleSection = (section: string) => {
        setActiveSection(prev => prev === section ? null : section);
    };


    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            identification: draftCompany?.identification || { raison_sociale: "", siret: "", code_ape_naf: "", type_employeur: "", employeur_specifique: "Aucun de ces cas", effectif: "", convention: "" },
            adresse: draftCompany?.adresse || { num: "", voie: "", complement: "", code_postal: "", ville: "", telephone: "", email: "" },
            maitre_apprentissage: draftCompany?.maitre_apprentissage || { nom: "", prenom: "", date_naissance: "", fonction: "", diplome: "", experience: "", telephone: "", email: "" },
            opco: draftCompany?.opco || { nom: "" },
            formation: draftCompany?.formation || { choisie: "", date_debut: "", date_fin: "", code_rncp: "", code_diplome: "", nb_heures: "", jours_cours: "" },
            cfa: draftCompany?.cfa || {
                rush_school: "oui", entreprise: "non", denomination: "RUSH SCHOOL", uai: "0923033X",
                siret: "918 707 704 00014", adresse: "6 rue des Bateliers", complement: "", code_postal: "92110", commune: "CLICHY"
            },
            contrat: draftCompany?.contrat || {
                type_contrat: "", type_derogation: "", date_debut: "", date_fin: "", duree_hebdomadaire: "35h", poste_occupe: "",
                lieu_execution: "",
                pourcentage_smic1: 0, smic1: "smic", montant_salaire_brut1: 0,
                pourcentage_smic2: 0, smic2: "smic", montant_salaire_brut2: 0,
                pourcentage_smic3: 0, smic3: "smic", montant_salaire_brut3: 0,
                pourcentage_smic4: 0, smic4: "smic", montant_salaire_brut4: 0,
                date_conclusion: "", date_debut_execution: "",
                numero_deca_ancien_contrat: "", machines_dangereuses: "Non", caisse_retraite: "", date_avenant: "", nombre_mois: 12,
                // Initialisation des dates de périodes de salaire
                date_debut_2periode_1er_annee: "", date_fin_2periode_1er_annee: "",
                date_debut_1periode_2eme_annee: "", date_fin_1periode_2eme_annee: "",
                date_debut_2periode_2eme_annee: "", date_fin_2periode_2eme_annee: "",
                date_debut_1periode_3eme_annee: "", date_fin_1periode_3eme_annee: "",
                date_debut_2periode_3eme_annee: "", date_fin_2periode_3eme_annee: "",
                date_debut_1periode_4eme_annee: "", date_fin_1periode_4eme_annee: "",
                date_debut_2periode_4eme_annee: "", date_fin_2periode_4eme_annee: ""
            },
            salaire: draftCompany?.salaire || {
                age1: "", age2: "", age3: "", age4: ""
            },
            missions: draftCompany?.missions || { formation_alternant: "", selectionnees: [] as string[] },
            record_id_etudiant: studentRecordId || ""
        }
    });

    // Force sync studentRecordId prop to form state (avoids stale draft ID)
    useEffect(() => {
        if (studentRecordId) {
            setValue('record_id_etudiant', studentRecordId);
        }
    }, [studentRecordId, setValue]);

    const formData = watch();

    // Auto-save draft
    useEffect(() => {
        const subscription = watch((value) => setDraftCompany(value));
        return () => subscription.unsubscribe();
    }, [watch, setDraftCompany]);



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

    const calculateSalary = (age: string, annee: string) => {
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

        // Use 3rd year rates for 4th year by default if not specified
        if (annee === "4" && age !== "26+") {
            if (age === "16-17") pct = 55;
            else if (age === "18-20") pct = 67;
            else if (age === "21-25") pct = 78;
        }

        const montant = parseFloat(((smicBrut * pct) / 100).toFixed(2));
        return { pct, montant };
    };

    const updateSalary = (yearIndex: string, age: string) => {
        const { pct, montant } = calculateSalary(age, yearIndex);

        // Update the specific year in contrat object for API
        setValue(`contrat.pourcentage_smic${yearIndex}` as any, pct, { shouldValidate: true });
        setValue(`contrat.montant_salaire_brut${yearIndex}` as any, montant, { shouldValidate: true });
        setValue(`contrat.smic${yearIndex}` as any, "smic", { shouldValidate: true });

        // Update the age for this specific year
        setValue(`salaire.age${yearIndex}` as any, age, { shouldValidate: true });
    };

    const toggleMission = (mission: string) => {
        const current = watch('missions.selectionnees') || [];
        if (current.includes(mission)) {
            setValue('missions.selectionnees', current.filter(m => m !== mission), { shouldValidate: true });
        } else {
            setValue('missions.selectionnees', [...current, mission], { shouldValidate: true });
        }
    };

    // Helper to check if any field in a section has an error
    const hasSectionError = (sectionFields: string[]) => {
        return sectionFields.some(field => {
            const parts = field.split('.');
            let current = errors as any;
            for (const part of parts) {
                if (!current || !current[part]) {
                    current = null;
                    break;
                }
                current = current[part];
            }
            return !!current;
        });
    };

    const { execute: submitCompany, loading: isSubmitting } = useApi(api.submitCompany, {
        successMessage: "Informations entreprise enregistrées avec succès !",
        onSuccess: (response) => {
            clearDraftCompany();
            refreshCandidates();
            onNext(response);
        },
        errorMessage: "Une erreur est survenue lors de l'enregistrement. Vérifiez les données et réessayez."
    });

    const onSubmit = async (data: CompanyFormValues) => {
        console.log('📝 Submitting Company for Student ID (Prop):', studentRecordId);
        if (!studentRecordId) {
            showToast("Erreur: ID étudiant manquant. Veuillez revenir à l'étape précédente.", "error");
            return;
        }
        // Force the correct ID from props into the payload to avoid stale draft data
        const finalData = { ...data, record_id_etudiant: studentRecordId };
        console.log('📦 Final Payload sent to API:', finalData);
        await submitCompany(finalData as any);
    };

    const onError = (errors: any) => {
        const errorCount = Object.keys(errors).length;
        showToast(`Veuillez corriger les erreurs dans les ${errorCount} section(s) concernée(s).`, "error");

        const sections = [
            { id: 'id', fields: ['identification'] },
            { id: 'address', fields: ['adresse'] },
            { id: 'maitre', fields: ['maitre_apprentissage'] },
            { id: 'opco', fields: ['opco'] },
            { id: 'training', fields: ['formation', 'cfa'] },
            { id: 'contract', fields: ['contrat', 'salaire', 'missions'] }
        ];

        for (const section of sections) {
            const hasError = section.fields.some(field => errors[field]);
            if (hasError) {
                setActiveSection(section.id);
                break;
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)} className="animate-fade-in">
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 relative">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand via-primary to-violet-500"></div>

                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand to-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand/20 shrink-0">
                        <Building size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">Fiche de renseignement Entreprise</h2>
                        <p className="text-slate-500">Informations sur l'entreprise d'accueil pour le contrat d'apprentissage</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card
                        step={1}
                        title="Identification de l'entreprise"
                        collapsible
                        isOpen={activeSection === 'id'}
                        onToggle={() => toggleSection('id')}
                        hasError={hasSectionError(['identification.raison_sociale', 'identification.siret', 'identification.code_ape_naf', 'identification.type_employeur', 'identification.employeur_specifique', 'identification.effectif', 'identification.convention'])}
                    >
                        <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-12">
                                <Input label="Raison sociale" required placeholder="Nom de l'entreprise" error={errors.identification?.raison_sociale?.message} {...register('identification.raison_sociale')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Numéro SIRET" required placeholder="14 chiffres" error={errors.identification?.siret?.message} {...register('identification.siret', {
                                    onChange: (e) => {
                                        e.target.value = formatSIRET(e.target.value);
                                    }
                                })} />
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
                                    options={EMPLOYER_TYPE_OPTIONS}
                                />
                            </div>
                            <div className="col-span-12">
                                <Select
                                    label="Employeur spécifique"
                                    required
                                    error={errors.identification?.employeur_specifique?.message}
                                    {...register('identification.employeur_specifique')}
                                    placeholder="Sélectionnez"
                                    options={EMPLOYER_SPECIFIC_OPTIONS}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Effectif salarié" required type="number" placeholder="Nombre" error={errors.identification?.effectif?.message} {...register('identification.effectif')} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="IDCC" placeholder="Intitulé" {...register('identification.convention')} />
                            </div>
                        </div>
                    </Card>

                    <Card
                        step={2}
                        title="Adresse de l'entreprise"
                        collapsible
                        isOpen={activeSection === 'address'}
                        onToggle={() => toggleSection('address')}
                        hasError={hasSectionError(['adresse.num', 'adresse.voie', 'adresse.complement', 'adresse.code_postal', 'adresse.ville', 'adresse.telephone', 'adresse.email'])}
                    >
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
                                <Input label="Téléphone" required type="tel" placeholder="Téléphone entreprise" error={errors.adresse?.telephone?.message} {...register('adresse.telephone', {
                                    onChange: (e) => {
                                        e.target.value = formatPhone(e.target.value);
                                    }
                                })} />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Input label="Email" required type="email" placeholder="Email de contact" error={errors.adresse?.email?.message} {...register('adresse.email')} />
                            </div>
                        </div>
                    </Card>

                    <Card
                        step={3}
                        title="Maître d'apprentissage"
                        collapsible
                        isOpen={activeSection === 'maitre'}
                        onToggle={() => toggleSection('maitre')}
                        hasError={hasSectionError(['maitre_apprentissage.nom', 'maitre_apprentissage.prenom', 'maitre_apprentissage.date_naissance', 'maitre_apprentissage.fonction', 'maitre_apprentissage.diplome', 'maitre_apprentissage.experience', 'maitre_apprentissage.telephone', 'maitre_apprentissage.email'])}
                    >
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
                                    options={MAITRE_DIPLOMA_OPTIONS}
                                    placeholder="Sélectionnez"

                                />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <Input label="Années d'expérience" type="number" placeholder="Années" {...register('maitre_apprentissage.experience')} />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <Input label="Téléphone" required type="tel" placeholder="Téléphone" error={errors.maitre_apprentissage?.telephone?.message} {...register('maitre_apprentissage.telephone', {
                                    onChange: (e) => {
                                        e.target.value = formatPhone(e.target.value);
                                    }
                                })} />
                            </div>
                            <div className="col-span-12 md:col-span-4">
                                <Input label="Email" required type="email" placeholder="Email" error={errors.maitre_apprentissage?.email?.message} {...register('maitre_apprentissage.email')} />
                            </div>
                        </div>
                    </Card>

                    <Card
                        step={4}
                        title="OPCO (Opérateur de Compétences)"
                        collapsible
                        isOpen={activeSection === 'opco'}
                        onToggle={() => toggleSection('opco')}
                        hasError={hasSectionError(['opco.nom'])}
                    >
                        <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-12">
                                <Select
                                    label="Sélectionnez votre OPCO"
                                    required
                                    error={errors.opco?.nom?.message}
                                    {...register('opco.nom')}
                                    placeholder="Choisir un OPCO"
                                    options={OPCO_OPTIONS}

                                />
                            </div>
                        </div>
                    </Card>

                    <Card
                        step={5}
                        title="Formation & CFA"
                        collapsible
                        isOpen={activeSection === 'training'}
                        onToggle={() => toggleSection('training')}
                        hasError={hasSectionError(['formation.choisie', 'formation.date_debut', 'formation.date_fin', 'cfa.rush_school', 'cfa.entreprise', 'cfa.denomination', 'cfa.uai', 'cfa.siret', 'cfa.adresse', 'cfa.code_postal', 'cfa.commune'])}
                    >
                        <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-12">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Formation suivie *</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {['BTS MCO A', 'BTS MCO 2', 'BTS NDRC 1', 'BTS COM', 'Titre Pro NTC', 'Titre Pro NTC B (rentrée decalée)', 'Bachelor RDC'].map((f, idx) => (
                                        <label key={f} className="relative cursor-pointer group">
                                            <input className="peer sr-only" type="radio" value={f} checked={formData.formation.choisie === f} onChange={() => handleFormationChange(f)} />
                                            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 h-full transition-all ${formData.formation.choisie === f ? 'bg-brand/10 border-brand shadow-brand/10' : 'bg-slate-50/50 border-transparent hover:border-slate-200'}`}>
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black tracking-tighter shrink-0 transition-colors ${formData.formation.choisie === f ? 'bg-brand text-white' : 'bg-slate-200 text-slate-400'}`}>{idx + 1}</span>
                                                <span className="font-bold text-slate-700 text-xs leading-tight">{f}</span>
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
                                            className="w-5 h-5 accent-brand"
                                        />
                                        <span className="font-bold text-slate-700 text-sm group-hover:text-brand transition-colors">CFA Rush School</span>
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
                                            className="w-5 h-5 accent-brand"
                                        />
                                        <span className="font-bold text-slate-700 text-sm group-hover:text-brand transition-colors">Autre CFA</span>
                                    </label>
                                </div>

                                {formData.cfa.rush_school === 'oui' ? (
                                    <div className="bg-brand/5 p-8 rounded-3xl border border-brand/10 animate-fade-in">
                                        <div className="flex items-center gap-5 mb-6">
                                            <div className="w-12 h-12 bg-brand text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20">
                                                <Building size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-800 tracking-tight">CFA d'accueil : Rush School</h4>
                                                <p className="text-xs text-brand/60 font-bold uppercase tracking-wider mt-0.5">Informations certifiées</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white/60 p-4 rounded-2xl border border-brand/5">
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Dénomination</span>
                                                <span className="font-bold text-slate-700">RUSH SCHOOL</span>
                                            </div>
                                            <div className="bg-white/60 p-4 rounded-2xl border border-brand/5">
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">N° SIRET</span>
                                                <span className="font-bold text-slate-700">918 707 704 00014</span>
                                            </div>
                                            <div className="bg-white/60 p-4 rounded-2xl border border-brand/5">
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Code UAI</span>
                                                <span className="font-bold text-slate-700">0923033X</span>
                                            </div>
                                            <div className="bg-white/60 p-4 rounded-2xl border border-brand/5">
                                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Adresse</span>
                                                <span className="font-bold text-slate-700 text-sm">6 rue des Bateliers</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-12 gap-5 animate-fade-in bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                                        <div className="col-span-12 md:col-span-6">
                                            <Input label="Dénomination du CFA" required {...register('cfa.denomination')} />
                                        </div>
                                        <div className="col-span-12 md:col-span-6">
                                            <Input label="N° SIRET" required {...register('cfa.siret', {
                                                onChange: (e) => {
                                                    e.target.value = formatSIRET(e.target.value);
                                                }
                                            })} />
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

                    <Card
                        step={6}
                        title="Contrat & Salaire"
                        collapsible
                        isOpen={activeSection === 'contract'}
                        onToggle={() => toggleSection('contract')}
                        hasError={hasSectionError(['contrat.type_contrat', 'contrat.type_derogation', 'contrat.duree_hebdomadaire', 'contrat.poste_occupe', 'contrat.lieu_execution', 'contrat.numero_deca_ancien_contrat', 'contrat.date_conclusion', 'contrat.date_debut_execution', 'contrat.date_avenant', 'contrat.caisse_retraite', 'contrat.machines_dangereuses', 'contrat.date_debut_2periode_1er_annee', 'contrat.date_fin_2periode_1er_annee', 'salaire.age1'])}
                    >
                        <div className="grid grid-cols-12 gap-5">
                            <div className="col-span-12 md:col-span-6">
                                <Select
                                    label="Type de contrat"
                                    required
                                    error={errors.contrat?.type_contrat?.message}
                                    {...register('contrat.type_contrat')}
                                    options={CONTRAT_TYPE_OPTIONS}

                                />
                            </div>
                            <div className="col-span-12 md:col-span-6">
                                <Select
                                    label="Type de dérogation"
                                    {...register('contrat.type_derogation')}
                                    placeholder="Sélectionnez si applicable"
                                    options={DEROGATION_TYPE_OPTIONS}

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
                                    options={YES_NO_OPTIONS}

                                />
                            </div>

                            {/* Simulateur de salaire multi-années indépendant */}
                            <div className="col-span-12 mt-8 pt-8 border-t border-slate-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-xl shadow-secondary/20">
                                        <Calculator size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Simulateur de salaire apprenti</h3>
                                        <p className="text-slate-500 text-sm font-bold">Configurez les tranches d'âge pour chaque année d'apprentissage</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {["1", "2", "3", "4"].map((year) => {
                                        const yearAge = (formData.salaire as any)[`age${year}`];
                                        const { pct, montant } = calculateSalary(yearAge, year);

                                        return (
                                            <div
                                                key={year}
                                                className="relative p-8 rounded-[2rem] border-2 border-slate-100 bg-white shadow-sm transition-all duration-300 text-left flex flex-col hover:border-brand/20 hover:shadow-xl hover:shadow-brand/5 group"
                                            >
                                                {/* En-tête de l'année */}
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand mb-1">Étape du contrat</span>
                                                        <h4 className="text-lg font-black text-slate-800">
                                                            {year}{year === "1" ? "ère" : "ème"} année
                                                        </h4>
                                                    </div>
                                                    <div className={`p-3 rounded-2xl transition-colors ${yearAge ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-300'}`}>
                                                        <CheckCircle2 size={20} />
                                                    </div>
                                                </div>

                                                <div className="space-y-8 flex-grow">
                                                    {/* Sélecteur d'âge */}
                                                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                                        <Select
                                                            label={`Configuration de l'âge`}
                                                            required={year === "1"}
                                                            value={yearAge}
                                                            onChange={(e) => updateSalary(year, e.target.value)}
                                                            options={AGE_TRANCHE_OPTIONS}
                                                            className="!bg-white !py-3 !text-sm border-slate-200 focus:border-brand transition-colors"
                                                            placeholder="Choisir l'âge..."
                                                            error={(errors.salaire as any)?.[`age${year}`]?.message}
                                                        />
                                                    </div>

                                                    {/* Périodes de dates */}
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Périodes de rémunération</label>

                                                        {year === "1" ? (
                                                            <div className="bg-brand/5 p-4 rounded-2xl border border-brand/10 space-y-4">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-brand/40"></div>
                                                                    <span className="text-[10px] font-bold text-brand uppercase tracking-wider">2ème Période</span>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    <Input
                                                                        type="date"
                                                                        label="Début"
                                                                        required
                                                                        error={errors.contrat?.date_debut_2periode_1er_annee?.message}
                                                                        className="!bg-white !shadow-none border-brand/20 focus:border-brand"
                                                                        {...register(`contrat.date_debut_2periode_1er_annee` as any)}
                                                                    />
                                                                    <Input
                                                                        type="date"
                                                                        label="Fin"
                                                                        required
                                                                        error={errors.contrat?.date_fin_2periode_1er_annee?.message}
                                                                        className="!bg-white !shadow-none border-brand/20 focus:border-brand"
                                                                        {...register(`contrat.date_fin_2periode_1er_annee` as any)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-1 gap-4">
                                                                {/* Période 1 */}
                                                                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-4">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">1ère Période</span>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <Input
                                                                            type="date"
                                                                            label="Début"
                                                                            className="!bg-white !shadow-none"
                                                                            {...register(`contrat.date_debut_1periode_${year === "2" ? "2eme" : year === "3" ? "3eme" : "4eme"}_annee` as any)}
                                                                        />
                                                                        <Input
                                                                            type="date"
                                                                            label="Fin"
                                                                            className="!bg-white !shadow-none"
                                                                            {...register(`contrat.date_fin_1periode_${year === "2" ? "2eme" : year === "3" ? "3eme" : "4eme"}_annee` as any)}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Période 2 */}
                                                                <div className="bg-brand/5 p-4 rounded-2xl border border-brand/10 space-y-4">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-brand/40"></div>
                                                                        <span className="text-[10px] font-bold text-brand uppercase tracking-wider">2ème Période</span>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <Input
                                                                            type="date"
                                                                            label="Début"
                                                                            className="!bg-white !shadow-none border-brand/20 focus:border-brand"
                                                                            {...register(`contrat.date_debut_2periode_${year === "2" ? "2eme" : year === "3" ? "3eme" : "4eme"}_annee` as any)}
                                                                        />
                                                                        <Input
                                                                            type="date"
                                                                            label="Fin"
                                                                            className="!bg-white !shadow-none border-brand/20 focus:border-brand"
                                                                            {...register(`contrat.date_fin_2periode_${year === "2" ? "2eme" : year === "3" ? "3eme" : "4eme"}_annee` as any)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Résumé de rémunération */}
                                                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Taux SMIC</span>
                                                        <div className="text-2xl font-black text-slate-900">
                                                            {yearAge ? `${pct}%` : "--%"}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Salaire Brut</span>
                                                        <div className="text-2xl font-black text-brand">
                                                            {yearAge ? `${montant.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })}` : "-- €"}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 scale-150 rotate-12 transition-all pointer-events-none">
                                                    <Calculator size={80} className="text-brand/10" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 p-4 rounded-2xl bg-brand/5 border border-brand/10 flex items-start gap-4">
                                    <Info size={18} className="text-brand shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-brand/80 font-medium leading-relaxed italic">
                                        Note : La tranche d'âge peut évoluer au cours du contrat. Configurez l'âge attendu pour chaque période. Calcul basé sur le SMIC 2024 de 1 823,03 € brut mensuel.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card
                        step={7}
                        title="Missions en entreprise"
                        collapsible
                        isOpen={activeSection === 'missions'}
                        onToggle={() => toggleSection('missions')}
                        hasError={hasSectionError(['missions.formation_alternant', 'missions.selectionnees'])}
                    >
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