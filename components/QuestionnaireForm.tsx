import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Save, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { StudentFormData } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Card from './ui/Card';

// Validation Schema with Zod
const studentSchema = z.object({
    prenom: z.string().min(2, "Le prénom est requis"),
    nom_naissance: z.string().min(2, "Le nom de naissance est requis"),
    nom_usage: z.string().optional().or(z.literal("")),
    sexe: z.string().min(1, "Veuillez sélectionner votre sexe"),
    date_naissance: z.string().min(1, "La date de naissance est requise"),
    nationalite: z.string().min(1, "Veuillez sélectionner votre nationalité"),
    commune_naissance: z.string().min(1, "La commune de naissance est requise"),
    departement: z.string().min(1, "Le département est requis"),
    adresse_residence: z.string().min(5, "L'adresse est requise"),
    code_postal: z.string().min(5, "Code postal invalide"),
    ville: z.string().min(1, "La ville est requise"),
    email: z.string().email("Email invalide"),
    telephone: z.string().min(10, "Téléphone invalide"),
    nir: z.string().optional().or(z.literal("")),
    situation: z.string().min(1, "Veuillez sélectionner votre situation"),
    regime_social: z.string().optional().or(z.literal("")),
    declare_inscription_sportif_haut_niveau: z.boolean(),
    declare_avoir_projet_creation_reprise_entreprise: z.boolean(),
    declare_travailleur_handicape: z.boolean(),
    alternance: z.boolean(),
    dernier_diplome_prepare: z.string().min(1, "Veuillez sélectionner votre dernier diplôme"),
    derniere_classe: z.string().min(1, "Veuillez sélectionner votre dernière classe"),
    intitulePrecisDernierDiplome: z.string().optional().or(z.literal("")),
    bac: z.string().min(1, "Veuillez sélectionner votre niveau d'études"),
    formation_souhaitee: z.string().min(1, "Veuillez sélectionner une formation"),
    date_de_visite: z.string().optional().or(z.literal("")),
    date_de_reglement: z.string().optional().or(z.literal("")),
    entreprise_d_accueil: z.string().optional().or(z.literal("")),
    connaissance_rush_how: z.string().optional().or(z.literal("")),
    motivation_projet_professionnel: z.string().optional().or(z.literal("")),
    agreement: z.boolean().refine(val => val === true, {
        message: "Vous devez attester sur l'honneur l'exactitude des informations"
    }),
    
    add_second_representative: z.boolean().optional(),
    representant_legal_1: z.object({
        nom: z.string().optional(),
        prenom: z.string().optional(),
        lien_parente: z.string().optional(),
        numero: z.string().optional(),
        voie: z.string().optional(),
        complement: z.string().optional(),
        code_postal: z.string().optional(),
        ville: z.string().optional(),
        email: z.string().optional(),
        telephone: z.string().optional(),
    }).optional(),
    representant_legal_2: z.object({
        nom: z.string().optional(),
        prenom: z.string().optional(),
        lien_parente: z.string().optional(),
        numero: z.string().optional(),
        voie: z.string().optional(),
        complement: z.string().optional(),
        code_postal: z.string().optional(),
        ville: z.string().optional(),
        email: z.string().optional(),
        telephone: z.string().optional(),
    }).optional()
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface QuestionnaireFormProps {
    onNext: (data: any) => void;
    onBack?: () => void;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ onNext }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            prenom: '', nom_naissance: '', nom_usage: '', sexe: '', date_naissance: '',
            nationalite: '', commune_naissance: '', departement: '', adresse_residence: '',
            code_postal: '', ville: '', email: '', telephone: '', nir: '',
            situation: '', regime_social: '',
            declare_inscription_sportif_haut_niveau: false,
            declare_avoir_projet_creation_reprise_entreprise: false,
            declare_travailleur_handicape: false,
            alternance: false,
            dernier_diplome_prepare: '', derniere_classe: '', intitulePrecisDernierDiplome: '',
            bac: '', formation_souhaitee: '', date_de_visite: '', date_de_reglement: '',
            entreprise_d_accueil: '', connaissance_rush_how: '', motivation_projet_professionnel: '',
            agreement: false as any,
            add_second_representative: false,
            representant_legal_1: { nom: '', prenom: '', lien_parente: '', numero: '', voie: '', complement: '', code_postal: '', ville: '', email: '', telephone: '' },
            representant_legal_2: { nom: '', prenom: '', lien_parente: '', numero: '', voie: '', complement: '', code_postal: '', ville: '', email: '', telephone: '' }
        }
    });

    const onSubmit = async (data: StudentFormValues) => {
        setIsSubmitting(true);
        try {
            const response = await api.submitStudent(data as any);
            if (response && response.record_id) {
                localStorage.setItem('candidateRecordId', response.record_id);
            }
            onNext(response);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedSexe = watch('sexe');
    const selectedBac = watch('bac');
    const selectedEntreprise = watch('entreprise_d_accueil');
    const declarations = watch();
    const dateNaissance = watch('date_naissance');
    const addSecondRep = watch('add_second_representative');

    const isMinor = React.useMemo(() => {
        if (!dateNaissance) return false;
        const birth = new Date(dateNaissance);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age < 18;
    }, [dateNaissance]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-6 md:p-10 shadow-xl border border-blue-100 relative overflow-hidden animate-slide-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"></div>

            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 pb-8 border-b border-blue-100">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 shrink-0">
                        <User size={32} />
                    </div>
                    <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                    <img src="/images/logo-process-iq.png" alt="Process IQ" className="h-10 w-auto" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Fiche d'inscription étudiant</h2>
                    <p className="text-slate-500">Complétez toutes les informations pour finaliser votre dossier</p>
                </div>
            </div>

            <div className="space-y-6">
                <Card step={1} title="Informations personnelles">
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Prénom" required placeholder="Votre prénom" error={errors.prenom?.message} {...register('prenom')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Nom de naissance" required placeholder="Votre nom de naissance" error={errors.nom_naissance?.message} {...register('nom_naissance')} />
                        </div>
                        <div className="col-span-12">
                            <Input label="Nom d'usage" placeholder="Si différent du nom de naissance" {...register('nom_usage')} />
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Sexe *</label>
                            <div className="flex gap-3 flex-wrap">
                                {['Féminin', 'Masculin'].map((val, idx) => (
                                    <label key={val} className="relative cursor-pointer group flex-1 min-w-[120px]">
                                        <input className="peer sr-only" type="radio" value={val} {...register('sexe')} />
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${selectedSexe === val ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${selectedSexe === val ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{String.fromCharCode(65 + idx)}</span>
                                            <span className="font-medium text-slate-600">{val}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.sexe && <p className="mt-1.5 text-rose-500 text-xs font-bold">{errors.sexe.message}</p>}
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Date de naissance" required type="date" error={errors.date_naissance?.message} {...register('date_naissance')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Select
                                label="Nationalité"
                                required
                                error={errors.nationalite?.message}
                                {...register('nationalite')}
                                options={[
                                    { value: 'francaise', label: 'Française' },
                                    { value: 'ue', label: 'Union Européenne' },
                                    { value: 'hors_ue', label: 'Etranger hors Union Européenne' }
                                ]}
                                placeholder="Sélectionnez"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Commune de naissance" required placeholder="Ville de naissance" error={errors.commune_naissance?.message} {...register('commune_naissance')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Département de naissance" required placeholder="Ex: 75 - Paris" error={errors.departement?.message} {...register('departement')} />
                        </div>
                    </div>
                </Card>

                <Card step={2} title="Coordonnées">
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <Input label="Adresse de résidence" required placeholder="Numéro et nom de rue" error={errors.adresse_residence?.message} {...register('adresse_residence')} />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <Input label="Code postal" required placeholder="Ex: 75001" error={errors.code_postal?.message} {...register('code_postal')} />
                        </div>
                        <div className="col-span-12 md:col-span-8">
                            <Input label="Ville" required placeholder="Ville de résidence" error={errors.ville?.message} {...register('ville')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="E-mail" required type="email" placeholder="votre@email.com" error={errors.email?.message} {...register('email')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Téléphone" required type="tel" placeholder="06 12 34 56 78" error={errors.telephone?.message} {...register('telephone')} />
                        </div>
                        <div className="col-span-12">
                            <Input label="NIR (Numéro de Sécurité Sociale)" placeholder="1 85 12 75 108 123 45" {...register('nir')} />
                        </div>
                    </div>
                </Card>

                {isMinor && (
                    <Card step={3} title="Représentants Légaux">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Représentant légal 1</h3>
                                <div className="grid grid-cols-12 gap-5">
                                    <div className="col-span-12 md:col-span-6">
                                        <Input label="Nom" required={isMinor} {...register('representant_legal_1.nom')} />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <Input label="Prénom" required={isMinor} {...register('representant_legal_1.prenom')} />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <Input label="Lien de parenté" placeholder="Père, Mère, Tuteur..." required={isMinor} {...register('representant_legal_1.lien_parente')} />
                                    </div>
                                    <div className="col-span-12 md:col-span-6">
                                        <Input label="Téléphone" required={isMinor} type="tel" {...register('representant_legal_1.telephone')} />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <Input label="Numéro" required={isMinor} {...register('representant_legal_1.numero')} />
                                    </div>
                                    <div className="col-span-12 md:col-span-8">
                                        <Input label="Voie" required={isMinor} {...register('representant_legal_1.voie')} />
                                    </div>
                                    <div className="col-span-12">
                                        <Input label="Complément d'adresse" {...register('representant_legal_1.complement')} />
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <Input label="Code postal" required={isMinor} {...register('representant_legal_1.code_postal')} />
                                    </div>
                                    <div className="col-span-12 md:col-span-8">
                                        <Input label="Ville" required={isMinor} {...register('representant_legal_1.ville')} />
                                    </div>
                                    <div className="col-span-12">
                                        <Input label="Email" required={isMinor} type="email" {...register('representant_legal_1.email')} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="add_second_rep"
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    {...register('add_second_representative')}
                                />
                                <label htmlFor="add_second_rep" className="text-slate-700 font-medium cursor-pointer">
                                    Ajouter un second représentant légal
                                </label>
                            </div>

                            {addSecondRep && (
                                <div className="animate-fade-in border-t border-slate-100 pt-8">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Représentant légal 2</h3>
                                    <div className="grid grid-cols-12 gap-5">
                                        <div className="col-span-12 md:col-span-6">
                                            <Input label="Nom" {...register('representant_legal_2.nom')} />
                                        </div>
                                        <div className="col-span-12 md:col-span-6">
                                            <Input label="Prénom" {...register('representant_legal_2.prenom')} />
                                        </div>
                                        <div className="col-span-12 md:col-span-6">
                                            <Input label="Lien de parenté" placeholder="Père, Mère, Tuteur..." {...register('representant_legal_2.lien_parente')} />
                                        </div>
                                        <div className="col-span-12 md:col-span-6">
                                            <Input label="Téléphone" type="tel" {...register('representant_legal_2.telephone')} />
                                        </div>
                                        <div className="col-span-12 md:col-span-4">
                                            <Input label="Numéro" {...register('representant_legal_2.numero')} />
                                        </div>
                                        <div className="col-span-12 md:col-span-8">
                                            <Input label="Voie" {...register('representant_legal_2.voie')} />
                                        </div>
                                        <div className="col-span-12">
                                            <Input label="Complément d'adresse" {...register('representant_legal_2.complement')} />
                                        </div>
                                        <div className="col-span-12 md:col-span-4">
                                            <Input label="Code postal" {...register('representant_legal_2.code_postal')} />
                                        </div>
                                        <div className="col-span-12 md:col-span-8">
                                            <Input label="Ville" {...register('representant_legal_2.ville')} />
                                        </div>
                                        <div className="col-span-12">
                                            <Input label="Email" type="email" {...register('representant_legal_2.email')} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                <Card step={isMinor ? 4 : 3} title="Situation & Déclarations">
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <Select
                                label="Situation avant le contrat"
                                required
                                error={errors.situation?.message}
                                {...register('situation')}
                                options={[
                                    { value: 'Etudiant', label: 'Etudiant : (Etude supérieur)' },
                                    { value: 'Scolaire', label: 'Scolaire : (Bac / brevet...)' },
                                    { value: 'contrat_pro', label: 'Contrat pro' },
                                    { value: 'Salarié', label: 'Salarié : (CDD/CDI)' },
                                    { value: 'Contrat d\'apprentissage', label: 'Contrat apprentissage' }
                                ]}
                                placeholder="Sélectionnez votre situation"
                            />
                        </div>
                        <div className="col-span-12">
                            <Select
                                label="Régime social"
                                {...register('regime_social')}
                                options={[
                                    { value: 'Sécurité Sociale', label: 'URSSAF / Sécurité Sociale' },
                                    { value: 'MSA', label: 'MSA (Mutualité Sociale Agricole)' }
                                ]}
                                placeholder="Sélectionnez"
                            />
                        </div>
                        {[{"label": "Déclare être inscrit(e) sur la liste des sportifs de haut niveau", "name": "declare_inscription_sportif_haut_niveau"},
                            {"label": "Déclare avoir un projet de création ou de reprise d'entreprise", "name": "declare_avoir_projet_creation_reprise_entreprise"},
                            {"label": "Déclare bénéficier de la reconnaissance travailleur handicapé (RQTH)", "name": "declare_travailleur_handicape"},
                            {"label": "Alternance", "name": "alternance"}
                        ].map((item) => (
                            <div key={item.name} className="col-span-12 space-y-4 pt-2">
                                <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                                    <label className="block text-sm font-semibold text-slate-800 mb-4">{item.label}</label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setValue(item.name as any, true)}
                                            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${declarations[item.name as keyof StudentFormValues] === true ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300'}`}
                                        >
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${declarations[item.name as keyof StudentFormValues] === true ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>A</span>
                                            <span className="font-medium text-slate-700">Oui</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setValue(item.name as any, false)}
                                            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${declarations[item.name as keyof StudentFormValues] === false ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300'}`}
                                        >
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${declarations[item.name as keyof StudentFormValues] === false ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>B</span>
                                            <span className="font-medium text-slate-700">Non</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card step={isMinor ? 5 : 4} title="Parcours scolaire">
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <Select
                                label="Dernier diplôme ou titre préparé"
                                required
                                error={errors.dernier_diplome_prepare?.message}
                                {...register('dernier_diplome_prepare')}
                                options={[
                                    { value: 'Baccalauréat Technologique', label: 'Baccalauréat Technologique' },
                                    { value: 'Baccalauréat général', label: 'Baccalauréat général' },
                                    { value: 'Baccalauréat pro', label: 'Baccalauréat pro' },
                                    { value: 'Brevet', label: 'Brevet' },
                                    { value: 'CAP', label: 'CAP' },
                                    { value: 'BTS', label: 'BTS' },
                                    { value: 'Aucun diplôme', label: 'Aucun diplôme' }
                                ]}
                                placeholder="Sélectionnez"
                            />
                        </div>
                        <div className="col-span-12">
                            <Select
                                label="Dernière année ou classe suivie"
                                required
                                error={errors.derniere_classe?.message}
                                {...register('derniere_classe')}
                                options={[
                                    { value: 'derniere_annee_obtenu', label: 'Dernière année du cycle de formation - diplôme obtenu' },
                                    { value: 'terminale', label: 'Terminale' },
                                    { value: '1ere_annee_validee', label: '1ère année du cycle validée' },
                                    { value: '3e', label: 'Études interrompues en classe de 3ème' }
                                ]}
                                placeholder="Sélectionnez"
                            />
                        </div>
                        <div className="col-span-12">
                            <Select
                                label="Intitulé précis du dernier diplôme ou titre préparé"
                                {...register('intitulePrecisDernierDiplome')}
                                options={[
                                    { value: 'Baccalauréat Technologique', label: 'Baccalauréat Technologique' },
                                    { value: 'Baccalauréat général', label: 'Baccalauréat général' },
                                    { value: 'Baccalauréat pro', label: 'Baccalauréat pro' },
                                    { value: 'Brevet', label: 'Brevet' },
                                    { value: 'CAP', label: 'CAP' },
                                    { value: 'BTS', label: 'BTS' },
                                    { value: 'Aucun diplôme', label: 'Aucun diplôme' }
                                ]}
                                placeholder="Sélectionnez"
                            />
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Diplôme ou titre le plus élevé obtenu *</label>
                            <div className="flex gap-3 grid grid-cols-2 md:grid-cols-3">
                                {['BAC', 'BAC+1', 'BAC+2', 'BAC+3', 'BAC+4', 'BAC+5'].map((val, idx) => (
                                    <label key={val} className="relative cursor-pointer group flex-1 min-w-[120px]">
                                        <input className="peer sr-only" type="radio" value={val} {...register('bac')} />
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${selectedBac === val ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${selectedBac === val ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{String.fromCharCode(65 + idx)}</span>
                                            <span className="font-medium text-slate-600">{val}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.bac && <p className="mt-1.5 text-rose-500 text-xs font-bold">{errors.bac.message}</p>}
                        </div>
                    </div>
                </Card>

                <Card step={isMinor ? 6 : 5} title="Formation souhaitée">
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <Select
                                label="Formation"
                                required
                                error={errors.formation_souhaitee?.message}
                                {...register('formation_souhaitee')}
                                options={[
                                    { value: 'BTS MCO', label: 'BTS MCO - Management Commercial Opérationnel' },
                                    { value: 'BTS NDRC', label: 'BTS NDRC - Négociation et Digitalisation de la Relation Client' },
                                    { value: 'BACHELOR RDC', label: 'BACHELOR RDC - Responsable Développement Commercial' },
                                    { value: 'TP NTC', label: 'TP NTC - Négociateur Technico-Commercial' }
                                ]}
                                placeholder="Sélectionnez une formation"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Date de visite / JPO" type="date" {...register('date_de_visite')} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <Input label="Date d'envoi du règlement" type="date" {...register('date_de_reglement')} />
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Avez-vous déjà une entreprise d'accueil ?</label>
                            <div className="flex gap-3 flex-wrap">
                                {['Oui', 'En recherche', 'Non'].map((val, idx) => (
                                    <label key={val} className="relative cursor-pointer group flex-1 min-w-[120px]">
                                        <input className="peer sr-only" type="radio" value={val} {...register('entreprise_d_accueil')} />
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${selectedEntreprise === val ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${selectedEntreprise === val ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{String.fromCharCode(65 + idx)}</span>
                                            <span className="font-medium text-slate-600">{val}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                <Card step={isMinor ? 7 : 6} title="Informations complémentaires">
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <Select
                                label="Comment avez-vous connu Rush School ?"
                                {...register('connaissance_rush_how')}
                                options={[
                                    { value: 'reseaux_sociaux', label: 'Réseaux sociaux' },
                                    { value: 'google', label: 'Recherche Google' },
                                    { value: 'parcoursup', label: 'Parcoursup' },
                                    { value: 'salon', label: 'Salon / Forum' },
                                    { value: 'bouche_oreille', label: 'Bouche à oreille' },
                                    { value: 'autre', label: 'Autre' }
                                ]}
                                placeholder="Sélectionnez"
                            />
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Motivations et projet professionnel </label>
                            <textarea placeholder="Décrivez brièvement vos motivations et votre projet professionnel..." rows={4} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none resize-none focus:border-blue-500 focus:ring-blue-500/10" {...register('motivation_projet_professionnel')}></textarea>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="mt-8 pt-8 border-t border-blue-100 flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input className="w-5 h-5 accent-blue-600 rounded cursor-pointer" type="checkbox" {...register('agreement')} />
                        <span className="font-medium text-slate-700">J'atteste sur l'honneur l'exactitude des informations fournies <span className="text-red-500">*</span></span>
                    </label>
                    {errors.agreement && <p className="mt-1.5 text-rose-500 text-xs font-bold animate-slide-in">{errors.agreement.message}</p>}
                </div>

                <Button
                    type="submit"
                    size="lg"
                    isLoading={isSubmitting}
                    rightIcon={<ArrowRight size={20} />}
                >
                    Enregistrer et continuer
                </Button>
            </div>
        </form>
    );
};

export default QuestionnaireForm;
