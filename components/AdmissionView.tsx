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
  Phone
} from 'lucide-react';
import { AdmissionTab } from '../types';
import QuestionnaireForm from './QuestionnaireForm';
import { api } from '../services/api';

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
                <button 
                    onClick={onClose}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all"
                >
                    Continuer
                </button>
            </div>
        </div>
    );
};

const StepItem = ({ step, label, isActive, isCompleted }: { step: number, label: string, isActive: boolean, isCompleted: boolean }) => (
  <div className="flex flex-col items-center gap-2 relative z-10 group">
    <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-base transition-all duration-300 ${
      isCompleted 
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
    
    const [formData, setFormData] = useState({
        identification: {
            raison_sociale: "",
            nom_entreprise: "",
            siret: "",
            code_ape_naf: "",
            type_employeur: "SARL",
            employeur_specifique: "Aucun",
            nombre_salaries: 0,
            code_idcc: "",
            convention_collective: ""
        },
        adresse: {
            numero: "",
            voie: "Rue", 
            nom_rue: "",
            complement: "",
            code_postal: "",
            ville: "",
            telephone: "",
            email: ""
        },
        representant_legal: {
            nom: "", // Nom complet
            titre: "",
            telephone_direct: "",
            email: ""
        },
        maitre_apprentissage: {
            nom: "",
            prenom: "",
            date_naissance: "",
            numero_securite_sociale: "",
            fonction: "",
            diplome_plus_eleve: "",
            niveau_diplome: "Aucun diplôme",
            annees_experience: 0,
            telephone: "",
            email: "",
            deja_maitre_apprentissage: "Non"
        },
        opco: {
            nom_opco: "",
            adresse: "",
            code_postal: "",
            ville: ""
        },
        contrat: {
            nature_contrat: "Contrat",
            type_contrat: "Contrat d'apprentissage",
            type_derogation: "Aucune dérogation",
            date_debut: "",
            date_fin: "",
            nombre_mois: 12,
            duree_hebdomadaire: "35h",
            poste_occupe: "",
            lieu_execution: "",
            base_calcul_salaire: "SMIC",
            montant_salaire_brut: 0,
            numero_bon_commande: ""
        },
        contact_taxe: {
            fonction_contact: "",
            telephone_contact: "",
            email_contact: ""
        },
        contact_rh: {
            nom_contact_rh: "",
            fonction_contact_rh: "",
            telephone_contact_rh: "",
            email_contact_rh: ""
        },
        formation_missions: {
            formation_alternant: ""
        }
    });

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

        const payload = {
            ...formData,
            record_id_etudiant: studentRecordId,
            identification: {
                ...formData.identification,
                nom_entreprise: formData.identification.nom_entreprise || formData.identification.raison_sociale, // Fallback
                nombre_salaries: Number(formData.identification.nombre_salaries)
            },
            maitre_apprentissage: {
                ...formData.maitre_apprentissage,
                annees_experience: Number(formData.maitre_apprentissage.annees_experience)
            },
            contrat: {
                ...formData.contrat,
                nombre_mois: Number(formData.contrat.nombre_mois),
                montant_salaire_brut: Number(formData.contrat.montant_salaire_brut)
            }
        };

        try {
            await api.submitCompany(payload);
            onNext();
        } catch (error) {
            console.error("Erreur soumission entreprise:", error);
            alert("Une erreur est survenue lors de l'enregistrement. Vérifiez les données et réessayez.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-6 md:p-10 shadow-xl border border-emerald-100 relative overflow-hidden animate-slide-in">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500"></div>

            <div className="flex items-center gap-6 mb-10 pb-8 border-b border-emerald-100">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                    <Building size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Fiche de Renseignement Entreprise</h2>
                    <p className="text-slate-500">Informations nécessaires pour l'établissement du CERFA</p>
                </div>
            </div>

            <div className="space-y-6">
                
                {/* 1. Identification */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-emerald-100 shadow-sm mb-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">1</div>
                        <h3 className="text-lg font-bold text-slate-800">Identification de l'entreprise</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Raison sociale <span className="text-red-400">*</span></label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" 
                                value={formData.identification.raison_sociale} 
                                onChange={(e) => handleNestedChange('identification', 'raison_sociale', e.target.value)}
                                placeholder="Nom juridique de l'entreprise" 
                            />
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nom commercial (si différent)</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" 
                                value={formData.identification.nom_entreprise} 
                                onChange={(e) => handleNestedChange('identification', 'nom_entreprise', e.target.value)}
                                placeholder="Nom d'enseigne" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">N° SIRET <span className="text-red-400">*</span></label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" 
                                value={formData.identification.siret}
                                onChange={(e) => handleNestedChange('identification', 'siret', e.target.value)}
                                placeholder="14 chiffres" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Code APE/NAF</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" 
                                value={formData.identification.code_ape_naf}
                                onChange={(e) => handleNestedChange('identification', 'code_ape_naf', e.target.value)}
                                placeholder="Ex: 6201Z" 
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Convention Collective</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" 
                                value={formData.identification.convention_collective}
                                onChange={(e) => handleNestedChange('identification', 'convention_collective', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Code IDCC</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" 
                                value={formData.identification.code_idcc}
                                onChange={(e) => handleNestedChange('identification', 'code_idcc', e.target.value)}
                                placeholder="Ex: 1486" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de salariés</label>
                            <input type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all" 
                                value={formData.identification.nombre_salaries}
                                onChange={(e) => handleNestedChange('identification', 'nombre_salaries', e.target.value)}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Type Employeur</label>
                            <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none cursor-pointer"
                                value={formData.identification.type_employeur}
                                onChange={(e) => handleNestedChange('identification', 'type_employeur', e.target.value)}
                            >
                                <option value="SARL">SARL</option>
                                <option value="SAS">SAS</option>
                                <option value="SA">SA</option>
                                <option value="Microentreprise">Microentreprise</option>
                                <option value="Association">Association</option>
                                <option value="EURL">EURL</option>
                                <option value="EI">EI</option>
                                <option value="SNC">SNC</option>
                                <option value="SCOP">SCOP</option>
                                <option value="Employeur spécifique">Employeur spécifique</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. Adresse */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-emerald-100 shadow-sm mb-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">2</div>
                        <h3 className="text-lg font-bold text-slate-800">Adresse de l'établissement</h3>
                    </div>
                    <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-3">
                             <label className="block text-sm font-semibold text-slate-700 mb-2">N°</label>
                             <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.adresse.numero}
                                onChange={(e) => handleNestedChange('adresse', 'numero', e.target.value)}
                             />
                        </div>
                        <div className="col-span-9">
                             <label className="block text-sm font-semibold text-slate-700 mb-2">Voie & Nom de rue</label>
                             <div className="flex gap-2">
                                <select className="w-1/3 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none cursor-pointer"
                                    value={formData.adresse.voie}
                                    onChange={(e) => handleNestedChange('adresse', 'voie', e.target.value)}
                                >
                                    <option value="Rue">Rue</option>
                                    <option value="Avenue">Avenue</option>
                                    <option value="Boulevard">Boulevard</option>
                                    <option value="Impasse">Impasse</option>
                                    <option value="Chemin">Chemin</option>
                                    <option value="Place">Place</option>
                                    <option value="ZI">ZI</option>
                                </select>
                                <input type="text" className="w-2/3 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                    value={formData.adresse.nom_rue}
                                    onChange={(e) => handleNestedChange('adresse', 'nom_rue', e.target.value)}
                                    placeholder="Nom de la voie"
                                />
                             </div>
                        </div>
                        <div className="col-span-12">
                             <label className="block text-sm font-semibold text-slate-700 mb-2">Complément d'adresse</label>
                             <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.adresse.complement}
                                onChange={(e) => handleNestedChange('adresse', 'complement', e.target.value)}
                                placeholder="Étage, Bâtiment..."
                             />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                             <label className="block text-sm font-semibold text-slate-700 mb-2">Code Postal</label>
                             <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.adresse.code_postal}
                                onChange={(e) => handleNestedChange('adresse', 'code_postal', e.target.value)}
                             />
                        </div>
                        <div className="col-span-12 md:col-span-8">
                             <label className="block text-sm font-semibold text-slate-700 mb-2">Ville</label>
                             <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.adresse.ville}
                                onChange={(e) => handleNestedChange('adresse', 'ville', e.target.value)}
                             />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                             <label className="block text-sm font-semibold text-slate-700 mb-2">Email Entreprise</label>
                             <input type="email" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.adresse.email}
                                onChange={(e) => handleNestedChange('adresse', 'email', e.target.value)}
                             />
                        </div>
                         <div className="col-span-12 md:col-span-6">
                             <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone Standard</label>
                             <input type="tel" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.adresse.telephone}
                                onChange={(e) => handleNestedChange('adresse', 'telephone', e.target.value)}
                             />
                        </div>
                    </div>
                </div>

                {/* 3. Représentant Légal */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-emerald-100 shadow-sm mb-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">3</div>
                        <h3 className="text-lg font-bold text-slate-800">Représentant Légal (Signataire)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nom & Prénom</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.representant_legal.nom}
                                onChange={(e) => handleNestedChange('representant_legal', 'nom', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Fonction / Titre</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.representant_legal.titre}
                                onChange={(e) => handleNestedChange('representant_legal', 'titre', e.target.value)}
                                placeholder="Ex: Gérant, DRH..."
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email direct</label>
                            <input type="email" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.representant_legal.email}
                                onChange={(e) => handleNestedChange('representant_legal', 'email', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone direct</label>
                            <input type="tel" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.representant_legal.telephone_direct}
                                onChange={(e) => handleNestedChange('representant_legal', 'telephone_direct', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Maître d'apprentissage */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-emerald-100 shadow-sm mb-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">4</div>
                        <h3 className="text-lg font-bold text-slate-800">Maître d'apprentissage (Tuteur)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nom</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.maitre_apprentissage.nom}
                                onChange={(e) => handleNestedChange('maitre_apprentissage', 'nom', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Prénom</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.maitre_apprentissage.prenom}
                                onChange={(e) => handleNestedChange('maitre_apprentissage', 'prenom', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date de naissance</label>
                            <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.maitre_apprentissage.date_naissance}
                                onChange={(e) => handleNestedChange('maitre_apprentissage', 'date_naissance', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">NIR (Sécu) - Obligatoire</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.maitre_apprentissage.numero_securite_sociale}
                                onChange={(e) => handleNestedChange('maitre_apprentissage', 'numero_securite_sociale', e.target.value)}
                                placeholder="15 chiffres"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Fonction</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.maitre_apprentissage.fonction}
                                onChange={(e) => handleNestedChange('maitre_apprentissage', 'fonction', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Niveau de diplôme</label>
                            <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none cursor-pointer"
                                value={formData.maitre_apprentissage.niveau_diplome}
                                onChange={(e) => handleNestedChange('maitre_apprentissage', 'niveau_diplome', e.target.value)}
                            >
                                <option value="Aucun diplôme">Aucun diplôme</option>
                                <option value="CAP">CAP</option>
                                <option value="BEP">BEP</option>
                                <option value="BAC">BAC</option>
                                <option value="BAC+2">BAC+2</option>
                                <option value="BAC+3">BAC+3</option>
                                <option value="BAC+5">BAC+5</option>
                                <option value="Master">Master</option>
                                <option value="Doctorat">Doctorat</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Intitulé du diplôme</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.maitre_apprentissage.diplome_plus_eleve}
                                onChange={(e) => handleNestedChange('maitre_apprentissage', 'diplome_plus_eleve', e.target.value)}
                                placeholder="Ex: Master Droit Social"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Années d'expérience</label>
                            <input type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.maitre_apprentissage.annees_experience}
                                onChange={(e) => handleNestedChange('maitre_apprentissage', 'annees_experience', e.target.value)}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                            <input type="email" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.maitre_apprentissage.email}
                                onChange={(e) => handleNestedChange('maitre_apprentissage', 'email', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone</label>
                            <input type="tel" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.maitre_apprentissage.telephone}
                                onChange={(e) => handleNestedChange('maitre_apprentissage', 'telephone', e.target.value)}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Déjà maître d'apprentissage ?</label>
                            <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none cursor-pointer"
                                value={formData.maitre_apprentissage.deja_maitre_apprentissage}
                                onChange={(e) => handleNestedChange('maitre_apprentissage', 'deja_maitre_apprentissage', e.target.value)}
                            >
                                <option value="Non">Non</option>
                                <option value="Oui">Oui</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 5. OPCO */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-emerald-100 shadow-sm mb-6 transition-all hover:shadow-md">
                     <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">5</div>
                        <h3 className="text-lg font-bold text-slate-800">OPCO (Opérateur de Compétences)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nom de l'OPCO</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.opco.nom_opco}
                                onChange={(e) => handleNestedChange('opco', 'nom_opco', e.target.value)}
                                placeholder="Si connu (ex: ATLAS, AKTO...)"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Adresse OPCO</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.opco.adresse}
                                onChange={(e) => handleNestedChange('opco', 'adresse', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Code Postal</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.opco.code_postal}
                                onChange={(e) => handleNestedChange('opco', 'code_postal', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Ville</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.opco.ville}
                                onChange={(e) => handleNestedChange('opco', 'ville', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* 6. Contrat */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-emerald-100 shadow-sm mb-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">6</div>
                        <h3 className="text-lg font-bold text-slate-800">Détails du Contrat</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nature du contrat</label>
                             <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none cursor-pointer"
                                value={formData.contrat.nature_contrat}
                                onChange={(e) => handleNestedChange('contrat', 'nature_contrat', e.target.value)}
                             >
                                 <option value="Contrat">Contrat</option>
                                 <option value="Avenant">Avenant</option>
                             </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Type de dérogation</label>
                             <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none cursor-pointer"
                                value={formData.contrat.type_derogation}
                                onChange={(e) => handleNestedChange('contrat', 'type_derogation', e.target.value)}
                             >
                                 <option value="Aucune dérogation">Aucune dérogation</option>
                                 <option value="Dérogation d'âge">Dérogation d'âge</option>
                                 <option value="Dérogation handicap">Dérogation handicap</option>
                                 <option value="Autre">Autre</option>
                             </select>
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date de début</label>
                            <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contrat.date_debut}
                                onChange={(e) => handleNestedChange('contrat', 'date_debut', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date de fin</label>
                            <input type="date" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contrat.date_fin}
                                onChange={(e) => handleNestedChange('contrat', 'date_fin', e.target.value)}
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-slate-700 mb-2">Durée (mois)</label>
                             <input type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contrat.nombre_mois}
                                onChange={(e) => handleNestedChange('contrat', 'nombre_mois', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Durée Hebdomadaire</label>
                             <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none cursor-pointer"
                                value={formData.contrat.duree_hebdomadaire}
                                onChange={(e) => handleNestedChange('contrat', 'duree_hebdomadaire', e.target.value)}
                             >
                                 <option value="35h">35 heures</option>
                                 <option value="39h">39 heures</option>
                             </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Poste occupé</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contrat.poste_occupe}
                                onChange={(e) => handleNestedChange('contrat', 'poste_occupe', e.target.value)}
                                placeholder="Intitulé du poste de l'apprenti"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Lieu d'exécution (si différent du siège)</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contrat.lieu_execution}
                                onChange={(e) => handleNestedChange('contrat', 'lieu_execution', e.target.value)}
                                placeholder="Adresse complète"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Rémunération Brute (€)</label>
                            <input type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contrat.montant_salaire_brut}
                                onChange={(e) => handleNestedChange('contrat', 'montant_salaire_brut', e.target.value)}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Base calcul salaire</label>
                            <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none cursor-pointer"
                                value={formData.contrat.base_calcul_salaire}
                                onChange={(e) => handleNestedChange('contrat', 'base_calcul_salaire', e.target.value)}
                            >
                                <option value="SMIC">SMIC</option>
                                <option value="SMC">SMC (Conventionnel)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 7. Contact Taxe & Formation & RH */}
                <div className="bg-white/80 p-6 md:p-8 rounded-2xl border border-emerald-100 shadow-sm mb-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">7</div>
                        <h3 className="text-lg font-bold text-slate-800">Divers</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                         <div className="md:col-span-2">
                             <h4 className="font-bold text-slate-600 mb-3 text-sm uppercase">Contact Ressources Humaines (Optionnel)</h4>
                         </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Nom & Prénom</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contact_rh.nom_contact_rh}
                                onChange={(e) => handleNestedChange('contact_rh', 'nom_contact_rh', e.target.value)}
                                placeholder="Nom du contact RH"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Fonction</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contact_rh.fonction_contact_rh}
                                onChange={(e) => handleNestedChange('contact_rh', 'fonction_contact_rh', e.target.value)}
                                placeholder="Ex: DRH, Chargé RH..."
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone</label>
                            <input type="tel" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contact_rh.telephone_contact_rh}
                                onChange={(e) => handleNestedChange('contact_rh', 'telephone_contact_rh', e.target.value)}
                            />
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                            <input type="email" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contact_rh.email_contact_rh}
                                onChange={(e) => handleNestedChange('contact_rh', 'email_contact_rh', e.target.value)}
                            />
                        </div>

                         <div className="md:col-span-2 mt-4">
                             <h4 className="font-bold text-slate-600 mb-3 text-sm uppercase">Contact Taxe d'Apprentissage / Admin</h4>
                         </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Fonction du contact</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contact_taxe.fonction_contact}
                                onChange={(e) => handleNestedChange('contact_taxe', 'fonction_contact', e.target.value)}
                                placeholder="Ex: Comptable, RH..."
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone</label>
                            <input type="tel" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contact_taxe.telephone_contact}
                                onChange={(e) => handleNestedChange('contact_taxe', 'telephone_contact', e.target.value)}
                            />
                        </div>
                         <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                            <input type="email" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.contact_taxe.email_contact}
                                onChange={(e) => handleNestedChange('contact_taxe', 'email_contact', e.target.value)}
                            />
                        </div>

                        <div className="md:col-span-2 mt-4">
                             <h4 className="font-bold text-slate-600 mb-3 text-sm uppercase">Formation</h4>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Formation visée par l'alternant</label>
                            <input type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                                value={formData.formation_missions.formation_alternant}
                                onChange={(e) => handleNestedChange('formation_missions', 'formation_alternant', e.target.value)}
                                placeholder="Ex: BTS MCO"
                            />
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex justify-end pt-8 border-t-2 border-emerald-100 mt-8">
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold hover:shadow-xl hover:shadow-green-500/20 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    Valider et continuer
                </button>
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
        // Vérifier que le dossier étudiant et entreprise est rempli
        // (Pour la démo, on vérifie surtout qu'on a l'ID étudiant, 
        // l'entreprise est techniquement requise par la logique métier backend)
        
        if (!studentData && !localStorage.getItem('candidateRecordId')) {
            alert("Veuillez d'abord compléter la Fiche Étudiant.");
            return;
        }

        const recordId = studentData?.record_id || studentData?.id || localStorage.getItem('candidateRecordId');
        if (!recordId) {
            alert("Identifiant étudiant introuvable. Veuillez recharger ou compléter le dossier.");
            return;
        }
        
        // Optionnel : Vérifier si l'entreprise est complétée
        // if (!entrepriseCompleted) { ... }

        try {
            // Feedback visuel temporaire
            const btn = document.getElementById(`btn-${doc.id}`);
            const originalText = btn ? btn.innerText : "";
            if(btn) btn.innerText = "Génération...";

            await api.generateFicheRenseignement(recordId);
            
            // Succès - Show Modal instead of alert
            setShowSuccessModal(true);
            
            if(btn) btn.innerText = originalText;
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la génération de la fiche.");
             const btn = document.getElementById(`btn-${doc.id}`);
             // Remettre le texte original si possible, sinon "Compléter"
             if(btn) btn.innerText = "Compléter"; 
        }
    } else {
        // Placeholder pour les autres documents
        console.log("Action pour le document:", doc.title);
        // Si d'autres logiques existent (modales etc.), elles iraient ici
    }
  };

  const uploadedCount = Object.keys(uploadedFiles).length;
  const progressPercent = (uploadedCount / REQUIRED_DOCUMENTS.length) * 100;
  const allDocumentsUploaded = uploadedCount >= REQUIRED_DOCUMENTS.length;

  // --- NTC VIEW RENDER ---
  if (mainTab === 'ntc') {
      return (
          <div className="animate-fade-in">
              {/* NTC View Content (Same as before) */}
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
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center gap-2">
                          <Download size={18} />
                          Exporter CSV
                      </button>
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
                          <tr className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-800">BAMBA</td>
                              <td className="px-6 py-4 text-slate-600">Fatim</td>
                              <td className="px-6 py-4"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">◐ En cours</span></td>
                              <td className="px-6 py-4"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">○ Non remplie</span></td>
                              <td className="px-6 py-4 text-center"><span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200 shadow-sm">NON</span></td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      );
  }

  // --- DASHBOARD VIEW (DEFAULT) ---
  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-20 relative">
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      
      {/* Hero Section */}
      <div className="admission-hero">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 w-full max-w-[60%]">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-white/10">
                <Briefcase size={14} /> Processus d'admission
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Admission Rush School</h1>
              <p className="text-indigo-100 text-lg leading-relaxed opacity-90">Complétez votre dossier d'admission : tests, documents et formalités administratives.</p>
            </div>
         </div>
      </div>

      {/* Stepper - Correct Order */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8 flex items-center justify-center overflow-x-auto shadow-sm">
        <div className="flex items-center min-w-max">
          <StepItem step={1} label="Tests" isActive={activeTab === AdmissionTab.TESTS} isCompleted={testCompleted} />
          <StepLine isCompleted={testCompleted} />
          
          <StepItem step={2} label="Étudiant" isActive={activeTab === AdmissionTab.QUESTIONNAIRE} isCompleted={!!studentData} />
          <StepLine isCompleted={!!studentData} />
          
          <StepItem step={3} label="Documents" isActive={activeTab === AdmissionTab.DOCUMENTS} isCompleted={allDocumentsUploaded} />
          <StepLine isCompleted={allDocumentsUploaded} />
          
          <StepItem step={4} label="Entreprise" isActive={activeTab === AdmissionTab.ENTREPRISE} isCompleted={entrepriseCompleted} />
          <StepLine isCompleted={entrepriseCompleted} />
          
          <StepItem step={5} label="Admin" isActive={activeTab === AdmissionTab.ADMINISTRATIF} isCompleted={adminCompleted} />
          <StepLine isCompleted={adminCompleted} />

          <StepItem step={6} label="Entretien" isActive={activeTab === AdmissionTab.ENTRETIEN} isCompleted={false} />
        </div>
      </div>

      {/* Main Tabs Switcher */}
      <div className="flex gap-2 mb-8 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 w-fit shadow-inner">
          <button onClick={() => setMainTab('dashboard')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200">
              Tableau de bord
          </button>
          <button onClick={() => setMainTab('ntc')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-white/50">
              Classe NTC
              <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px]">35</span>
          </button>
      </div>

      {/* Internal Tabs for Admission Flow - Correct Order */}
      <div className="flex overflow-x-auto gap-2 mb-8 bg-[#F1F5F9] p-2 rounded-2xl border border-slate-200 no-scrollbar">
        <button onClick={() => setActiveTab(AdmissionTab.TESTS)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === AdmissionTab.TESTS ? 'bg-white text-black shadow-sm' : 'text-slate-500'}`}>
            <PenTool size={16}/> Tests
        </button>
        <button onClick={() => setActiveTab(AdmissionTab.QUESTIONNAIRE)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === AdmissionTab.QUESTIONNAIRE ? 'bg-white text-black shadow-sm' : 'text-slate-500'}`}>
            <Info size={16}/> Fiche Étudiant
        </button>
        <button onClick={() => setActiveTab(AdmissionTab.DOCUMENTS)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === AdmissionTab.DOCUMENTS ? 'bg-white text-black shadow-sm' : 'text-slate-500'}`}>
            <Upload size={16}/> Documents
        </button>
        <button onClick={() => setActiveTab(AdmissionTab.ENTREPRISE)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === AdmissionTab.ENTREPRISE ? 'bg-white text-black shadow-sm' : 'text-slate-500'}`}>
            <Building size={16}/> Fiche Entreprise
        </button>
        <button onClick={() => setActiveTab(AdmissionTab.ADMINISTRATIF)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === AdmissionTab.ADMINISTRATIF ? 'bg-white text-black shadow-sm' : 'text-slate-500'}`}>
            <Printer size={16}/> Administratif
        </button>
        <button onClick={() => setActiveTab(AdmissionTab.ENTRETIEN)} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === AdmissionTab.ENTRETIEN ? 'bg-white text-black shadow-sm' : 'text-slate-500'}`}>
            <UserCheck size={16}/> Entretien
        </button>
      </div>

      {/* --- TEST SECTION (IFRAME) --- */}
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
                            <button onClick={handleFinishTest} className="px-5 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-sm">
                               <CheckCircle2 size={16} /> J'ai envoyé mes réponses
                            </button>
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

      {/* --- QUESTIONNAIRE SECTION --- */}
      {activeTab === AdmissionTab.QUESTIONNAIRE && (
          <div className="animate-slide-in">
              <QuestionnaireForm onNext={(data) => {
                  setStudentData(data);
                  setActiveTab(AdmissionTab.DOCUMENTS);
              }} />
          </div>
      )}

      {/* --- DOCUMENTS SECTION --- */}
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
                      <div key={doc.id} className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative overflow-hidden ${
                          isUploaded 
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

                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                              isUploaded 
                                ? 'bg-emerald-100 text-emerald-600' 
                                : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'
                          }`}>
                              {isUploaded ? <CheckCircle2 size={24} /> : <Upload size={24} />}
                          </div>
                          <h4 className={`font-bold mb-1 ${isUploaded ? 'text-emerald-800' : 'text-slate-700'}`}>{doc.title}</h4>
                          <p className={`text-xs mb-4 ${isUploaded ? 'text-emerald-600' : 'text-slate-400'}`}>{doc.desc}</p>
                          
                          <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors pointer-events-none ${
                              isUploaded
                                ? 'bg-emerald-200 text-emerald-800'
                                : 'bg-slate-900 text-white group-hover:bg-slate-800'
                          }`}>
                              {isUploaded ? 'Document reçu' : 'Téléverser'}
                          </button>
                      </div>
                  )})}
              </div>

              {/* Progress Bar */}
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
                  <button 
                      onClick={() => setActiveTab(AdmissionTab.ENTREPRISE)}
                      disabled={!studentData}
                      className={`w-full md:w-auto px-8 py-3 font-bold rounded-xl transition-all shadow-lg ${
                          studentData 
                           ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25 hover:-translate-y-0.5' 
                           : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                  >
                      Continuer vers la Fiche Entreprise
                  </button>
              </div>
          </div>
      )}

      {/* --- ENTREPRISE SECTION --- */}
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

      {/* --- ADMIN DOCS SECTION --- */}
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
                  <button 
                      onClick={() => setActiveTab(AdmissionTab.ENTRETIEN)}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg transition-all"
                  >
                      Continuer vers Entretien
                  </button>
              </div>
          </div>
      )}

      {/* --- ENTRETIEN SECTION --- */}
      {activeTab === AdmissionTab.ENTRETIEN && (
           <div className="animate-slide-in">
               <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                   <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                       <UserCheck size={40} />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-800 mb-2">Entretien d'admission</h2>
                   <p className="text-slate-500 max-w-md mx-auto mb-8">
                       Votre dossier est en cours d'analyse. Un chargé d'admission prendra contact avec vous prochainement pour planifier votre entretien.
                   </p>
                   <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                       Contacter l'école
                   </button>
               </div>
           </div>
      )}

    </div>
  );
};

export default AdmissionView;