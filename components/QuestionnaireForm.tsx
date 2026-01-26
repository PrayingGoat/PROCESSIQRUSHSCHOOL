import React, { useState } from 'react';
import { User, Save, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface QuestionnaireFormProps {
    onNext: (data: any) => void;
    onBack?: () => void;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ onNext }) => {
    const [formData, setFormData] = useState({
        prenom: '',
        nom_naissance: '',
        nom_usage: '',
        sexe: '',
        date_naissance: '',
        nationalite: '',
        commune_naissance: '',
        departement: '',
        adresse_residence: '',
        code_postal: '',
        ville: '',
        email: '',
        telephone: '',
        nir: '',
        situation: '',
        regime_social: '',
        declare_inscription_sportif_haut_niveau: false,
        declare_avoir_projet_creation_reprise_entreprise: false,
        declare_travailleur_handicape: false,
        alternance: false,
        dernier_diplome_prepare: '',
        derniere_classe: '',
        intitulePrecisDernierDiplome: '',
        bac: '',
        formation_souhaitee: '',
        date_de_visite: '',
        date_de_reglement: '',
        entreprise_d_accueil: '',
        connaissance_rush_how: '',
        motivation_projet_professionnel: '',
        agreement: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        let finalValue = type === 'checkbox' ? checked : value;

        // Convert 'oui'/'non' to boolean for declaration fields
        if (['declare_inscription_sportif_haut_niveau', 'declare_avoir_projet_creation_reprise_entreprise', 'declare_travailleur_handicape', 'alternance'].includes(name)) {
            finalValue = value === 'oui';
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.prenom || !formData.nom_naissance || !formData.email || !formData.agreement) {
            alert("Veuillez remplir les champs obligatoires (*) et accepter l'attestation sur l'honneur.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.submitStudent(formData);
            if (response && response.record_id) localStorage.setItem('candidateRecordId', response.record_id);
            onNext(response);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'enregistrement. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-6 md:p-10 shadow-xl border border-blue-100 relative overflow-hidden animate-slide-in">
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
                {/* Section 1 */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm mb-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-blue-500/10">1</div>
                        <h3 className="text-lg font-bold text-slate-800">Informations personnelles</h3>
                    </div>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Prénom <span className="text-red-500">*</span></label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="text" name="prenom" placeholder="Votre prénom" value={formData.prenom} onChange={handleChange} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nom de naissance <span className="text-red-500">*</span></label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="text" name="nom_naissance" placeholder="Votre nom de naissance" value={formData.nom_naissance} onChange={handleChange} />
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nom d'usage </label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="text" name="nom_usage" placeholder="Si différent du nom de naissance" value={formData.nom_usage} onChange={handleChange} />
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Sexe *</label>
                            <div className="flex gap-3 flex-wrap">
                                <label className="relative cursor-pointer group flex-1 min-w-[120px]">
                                    <input className="peer sr-only" type="radio" name="sexe" value="Féminin" checked={formData.sexe === 'Féminin'} onChange={handleChange} />
                                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${formData.sexe === 'Féminin' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${formData.sexe === 'Féminin' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>A</span>
                                        <span className="font-medium text-slate-600">Féminin</span>
                                    </div>
                                </label>
                                <label className="relative cursor-pointer group flex-1 min-w-[120px]">
                                    <input className="peer sr-only" type="radio" name="sexe" value="Masculin" checked={formData.sexe === 'Masculin'} onChange={handleChange} />
                                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${formData.sexe === 'Masculin' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${formData.sexe === 'Masculin' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>B</span>
                                        <span className="font-medium text-slate-600">Masculin</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date de naissance <span className="text-red-500">*</span></label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nationalité <span className="text-red-500">*</span></label>
                            <select name="nationalite" value={formData.nationalite} onChange={handleChange} className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 transition-all focus:ring-4 focus:outline-none cursor-pointer border-slate-200 focus:border-blue-500 focus:ring-blue-500/10">
                                <option value="">Sélectionnez</option>
                                <option value="francaise">Française</option>
                                <option value="ue">Union Européenne</option>
                                <option value="hors_ue">Etranger hors Union Européenne</option>
                            </select>
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Commune de naissance <span className="text-red-500">*</span></label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="text" name="commune_naissance" placeholder="Ville de naissance" value={formData.commune_naissance} onChange={handleChange} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Département de naissance <span className="text-red-500">*</span></label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="text" name="departement" placeholder="Ex: 75 - Paris" value={formData.departement} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm mb-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-blue-500/10">2</div>
                        <h3 className="text-lg font-bold text-slate-800">Coordonnées</h3>
                    </div>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Adresse de résidence <span className="text-red-500">*</span></label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="text" name="adresse_residence" placeholder="Numéro et nom de rue" value={formData.adresse_residence} onChange={handleChange} />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Code postal <span className="text-red-500">*</span></label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="text" name="code_postal" placeholder="Ex: 75001" value={formData.code_postal} onChange={handleChange} />
                        </div>
                        <div className="col-span-12 md:col-span-8">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Ville <span className="text-red-500">*</span></label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="text" name="ville" placeholder="Ville de résidence" value={formData.ville} onChange={handleChange} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail <span className="text-red-500">*</span></label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="email" name="email" placeholder="votre@email.com" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone <span className="text-red-500">*</span></label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="tel" name="telephone" placeholder="06 12 34 56 78" value={formData.telephone} onChange={handleChange} />
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">NIR (Numéro de Sécurité Sociale) </label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="text" name="nir" placeholder="1 85 12 75 108 123 45" value={formData.nir} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Section 3 */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm mb-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-blue-500/10">3</div>
                        <h3 className="text-lg font-bold text-slate-800">Situation & Déclarations</h3>
                    </div>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Situation avant le contrat <span className="text-red-500">*</span></label>
                            <select name="situation" value={formData.situation} onChange={handleChange} className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 transition-all focus:ring-4 focus:outline-none cursor-pointer border-slate-200 focus:border-blue-500 focus:ring-blue-500/10">
                                <option value="">Sélectionnez votre situation</option>
                                <option value="Etudiant : (Etude supérieur)">Etudiant : (Etude supérieur)</option>
                                <option value="Scolaire : (Bac / brevet...)">Scolaire : (Bac / brevet...)</option>
                                <option value="contrat_pro">Contrat pro</option>
                                <option value="Salarié : (CDD/CDI)">Salarié : (CDD/CDI)</option>
                                <option value="Contrat d'apprentissage">Contrat apprentissage</option>
                            </select>
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Régime social </label>
                            <select name="regime_social" value={formData.regime_social} onChange={handleChange} className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 transition-all focus:ring-4 focus:outline-none cursor-pointer border-slate-200 focus:border-blue-500 focus:ring-blue-500/10">
                                <option value="">Sélectionnez</option>
                                <option value="urssaf">URSSAF</option>
                                <option value="msa">MSA (Mutualité Sociale Agricole)</option>
                            </select>
                        </div>
                        {/* Yes/No Groups */}
                        {[
                            { label: "Déclare être inscrit(e) sur la liste des sportifs de haut niveau", name: "declare_inscription_sportif_haut_niveau" },
                            { label: "Déclare avoir un projet de création ou de reprise d'entreprise", name: "declare_avoir_projet_creation_reprise_entreprise" },
                            { label: "Déclare bénéficier de la reconnaissance travailleur handicapé (RQTH)", name: "declare_travailleur_handicape" },
                            { label: "Alternance", name: "alternance" }
                        ].map((item) => (
                            <div key={item.name} className="col-span-12 space-y-4 pt-2">
                                <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                                    <label className="block text-sm font-semibold text-slate-800 mb-4">{item.label}</label>
                                    <div className="flex gap-3">
                                        <label className="relative cursor-pointer group flex-1">
                                            <input className="peer sr-only" type="radio" name={item.name} value="oui" checked={formData[item.name as keyof typeof formData] === true} onChange={handleChange} />
                                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${formData[item.name as keyof typeof formData] === true ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${formData[item.name as keyof typeof formData] === true ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>A</span>
                                                <span className="font-medium text-slate-700">Oui</span>
                                            </div>
                                        </label>
                                        <label className="relative cursor-pointer group flex-1">
                                            <input className="peer sr-only" type="radio" name={item.name} value="non" checked={formData[item.name as keyof typeof formData] === false} onChange={handleChange} />
                                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${formData[item.name as keyof typeof formData] === false ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${formData[item.name as keyof typeof formData] === false ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>B</span>
                                                <span className="font-medium text-slate-700">Non</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 4 */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm mb-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-blue-500/10">4</div>
                        <h3 className="text-lg font-bold text-slate-800">Parcours scolaire</h3>
                    </div>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Dernier diplôme ou titre préparé <span className="text-red-500">*</span></label>
                            <select name="dernier_diplome_prepare" value={formData.dernier_diplome_prepare} onChange={handleChange} className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 transition-all focus:ring-4 focus:outline-none cursor-pointer border-slate-200 focus:border-blue-500 focus:ring-blue-500/10">
                                <option value="">Sélectionnez</option>
                                <option value="bac_techno">Baccalauréat Technologique</option>
                                <option value="bac_general">Baccalauréat général</option>
                                <option value="bac_pro">Baccalauréat pro</option>
                                <option value="brevet">Brevet</option>
                                <option value="cap">CAP</option>
                                <option value="bts">BTS</option>
                                <option value="aucun">Aucun diplôme</option>
                            </select>
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Dernière année ou classe suivie <span className="text-red-500">*</span></label>
                            <select name="derniere_classe" value={formData.derniere_classe} onChange={handleChange} className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 transition-all focus:ring-4 focus:outline-none cursor-pointer border-slate-200 focus:border-blue-500 focus:ring-blue-500/10">
                                <option value="">Sélectionnez</option>
                                <option value="derniere_annee_obtenu">Dernière année du cycle de formation - diplôme obtenu</option>
                                <option value="1ere_annee_validee">1ère année du cycle validée (année non diplômante)</option>
                                <option value="1ere_annee_non_validee">1ère année du cycle non validée (échec/interruption)</option>
                                <option value="2e_annee_validee">2è année du cycle validée (année non diplômante)</option>
                                <option value="2e_annee_non_validee">2è année du cycle non validée (échec/interruption)</option>
                                <option value="3e_annee_validee">3è année du cycle validée (année non diplômante)</option>
                                <option value="3e_annee_non_validee">3è année du cycle non validée (échec/interruption)</option>
                                <option value="1er_cycle_secondaire">1er cycle de l'enseignement secondaire achevé (collège)</option>
                                <option value="interrompu_3e">Études interrompues en classe de 3è</option>
                                <option value="interrompu_4e">Études interrompues en classe de 4è</option>
                            </select>
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Intitulé précis du dernier diplôme ou titre préparé </label>
                            <select name="intitulePrecisDernierDiplome" value={formData.intitulePrecisDernierDiplome} onChange={handleChange} className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 transition-all focus:ring-4 focus:outline-none cursor-pointer border-slate-200 focus:border-blue-500 focus:ring-blue-500/10">
                                <option value="">Sélectionnez</option>
                                <option value="Baccalauréat Technologique">Baccalauréat Technologique</option>
                                <option value="Baccalauréat général">Baccalauréat général</option>
                                <option value="Baccalauréat pro">Baccalauréat pro</option>
                                <option value="Brevet">Brevet</option>
                                <option value="CAP">CAP</option>
                                <option value="BTS">BTS</option>
                                <option value="Aucun diplôme">Aucun diplôme</option>
                            </select>
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Diplôme ou titre le plus élevé obtenu *</label>
                            <div className="flex gap-3 grid grid-cols-2 md:grid-cols-3">
                                {['BAC', 'BAC+1', 'BAC+2', 'BAC+3', 'BAC+4', 'BAC+5'].map((val, idx) => (
                                    <label key={val} className="relative cursor-pointer group flex-1 min-w-[120px]">
                                        <input className="peer sr-only" type="radio" name="bac" value={val} checked={formData.bac === val} onChange={handleChange} />
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${formData.bac === val ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${formData.bac === val ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{String.fromCharCode(65 + idx)}</span>
                                            <span className="font-medium text-slate-600">{val}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 5 */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm mb-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-blue-500/10">5</div>
                        <h3 className="text-lg font-bold text-slate-800">Formation souhaitée</h3>
                    </div>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Formation <span className="text-red-500">*</span></label>
                            <select name="formation_souhaitee" value={formData.formation_souhaitee} onChange={handleChange} className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 transition-all focus:ring-4 focus:outline-none cursor-pointer border-slate-200 focus:border-blue-500 focus:ring-blue-500/10">
                                <option value="">Sélectionnez une formation</option>
                                <option value="bts_mco">BTS MCO - Management Commercial Opérationnel</option>
                                <option value="bts_ndrc">BTS NDRC - Négociation et Digitalisation de la Relation Client</option>
                                <option value="bachelor_rdc">BACHELOR RDC - Responsable Développement Commercial</option>
                                <option value="tp_ntc">TP NTC - Négociateur Technico-Commercial</option>
                            </select>
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date de visite / JPO </label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="date" name="date_de_visite" value={formData.date_de_visite} onChange={handleChange} />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date d'envoi du règlement </label>
                            <input className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10" type="date" name="date_de_reglement" value={formData.date_de_reglement} onChange={handleChange} />
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Avez-vous déjà une entreprise d'accueil ?</label>
                            <div className="flex gap-3 flex-wrap">
                                {['Oui', 'En recherche', 'Non'].map((val, idx) => (
                                    <label key={val} className="relative cursor-pointer group flex-1 min-w-[120px]">
                                        <input className="peer sr-only" type="radio" name="entreprise_d_accueil" value={val} checked={formData.entreprise_d_accueil === val} onChange={handleChange} />
                                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${formData.entreprise_d_accueil === val ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}>
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${formData.entreprise_d_accueil === val ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{String.fromCharCode(65 + idx)}</span>
                                            <span className="font-medium text-slate-600">{val}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 6 */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-blue-100 shadow-sm mb-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ring-1 ring-blue-500/10">6</div>
                        <h3 className="text-lg font-bold text-slate-800">Informations complémentaires</h3>
                    </div>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Comment avez-vous connu Rush School ? </label>
                            <select name="connaissance_rush_how" value={formData.connaissance_rush_how} onChange={handleChange} className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 transition-all focus:ring-4 focus:outline-none cursor-pointer border-slate-200 focus:border-blue-500 focus:ring-blue-500/10">
                                <option value="">Sélectionnez</option>
                                <option value="reseaux_sociaux">Réseaux sociaux</option>
                                <option value="google">Recherche Google</option>
                                <option value="parcoursup">Parcoursup</option>
                                <option value="salon">Salon / Forum</option>
                                <option value="bouche_oreille">Bouche à oreille</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>
                        <div className="col-span-12">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Motivations et projet professionnel </label>
                            <textarea name="motivation_projet_professionnel" value={formData.motivation_projet_professionnel} onChange={handleChange} placeholder="Décrivez brièvement vos motivations et votre projet professionnel..." rows={4} className="w-full px-4 py-3 bg-white border rounded-xl text-base text-slate-800 placeholder:text-slate-400 transition-all focus:ring-4 focus:outline-none resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-blue-100 flex flex-col items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input className="w-5 h-5 accent-blue-600 rounded cursor-pointer" type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} />
                    <span className="font-medium text-slate-700">J'atteste sur l'honneur l'exactitude des informations fournies <span className="text-red-500">*</span></span>
                </label>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2.5 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:-translate-y-1 shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    Enregistrer et continuer
                    <ArrowRight size={20} />
                </button>
            </div>
        </form>
    );
};

export default QuestionnaireForm;