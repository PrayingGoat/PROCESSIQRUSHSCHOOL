import { StudentFormData, CompanyFormData, ApiResponse } from '../types';

const BASE_API_URL = 'https://liantsoaxx08-apirushscholl.hf.space/api/v1';
const BASE_URL = `${BASE_API_URL}/admission`;

// Helper to format string (remove underscores, capitalize)
const formatString = (str: string) => {
  if (!str) return "";
  // Replace underscores with spaces and capitalize first letter
  return str.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
};

const mapToBackendFormat = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;
  if (Array.isArray(data)) return data.map(mapToBackendFormat);
  return Object.keys(data).reduce((acc, key) => {
    // Convert camelCase to snake_case for backend
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = mapToBackendFormat(data[key]);
    return acc;
  }, {} as any);
};

export const api = {
  // --- HEALTH ---
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/health`, { method: 'GET' });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // --- CANDIDATES (CRUD) ---

  // CREATE (POST)
  async submitStudent(data: StudentFormData): Promise<ApiResponse> {
    try {
      // Helper pour nettoyer les téléphones
      const cleanPhone = (p: any) => {
        if (!p) return "";
        let phone = p.toString().replace(/\D/g, '');
        // Gestion du format international +33
        if (phone.length === 11 && phone.startsWith('33')) {
          return '0' + phone.substring(2);
        }
        // Gestion du format sans 0
        if (phone.length === 9) {
          return '0' + phone;
        }
        return phone;
      };

      // --- MAPPINGS ---
      const mapSexe = (v: string) => {
        // Normalisation pour envoyer strictement Féminin ou Masculin
        if (v === 'feminin' || v === 'Féminin' || v === 'Femme') return 'Féminin';
        if (v === 'masculin' || v === 'Masculin' || v === 'Homme') return 'Masculin';
        return v;
      };

      const mapNationalite = (v: string) => {
        if (v === 'francaise') return 'Française';
        if (v === 'ue') return 'Union Européenne';
        if (v === 'hors_ue') return 'Hors Union Européenne';
        return formatString(v);
      };

      const mapSituation = (v: string) => {
        const map: Record<string, string> = {
          'scolaire': 'Scolaire : (Bac / brevet...)',
          'etudiant': 'Etudiant : (Etude supérieur)',
          'contrat_pro': 'Contrat pro',
          'salarie': 'Salarié : (CDD/CDI)',
          'apprentissage': "Contrat d'apprentissage"
        };
        // Try exact match first, then formatted, then pass through
        return map[v] || v || formatString(v);
      };

      const mapDiplome = (v: string) => {
        const map: Record<string, string> = {
          'bac_techno': 'Baccalauréat Technologique',
          'bac_general': 'Baccalauréat général',
          'bac_pro': 'Baccalauréat pro',
          'brevet': 'Brevet',
          'cap': 'CAP',
          'bts': 'BTS',
          'aucun': 'Aucun diplôme'
        };
        return map[v] || v || formatString(v);
      };

      const mapNiveau = (v: string) => {
        // The new form sends "BAC", "BAC +2" strings directly.
        // Only map if it's a code
        const map: Record<string, string> = {
          'aucun': 'Aucun',
          'cap_bep': 'CAP / BEP',
          'bac': 'BAC',
          'bac2': 'BAC +2',
          'bac3_4': 'BAC +3/4',
          'bac5': 'BAC +5',
          'bac5+': 'BAC +5+'
        };
        return map[v] || v;
      };

      const mapFormation = (v: string) => {
        const map: Record<string, string> = {
          'bts_mco': 'BTS MCO',
          'bts_ndrc': 'BTS NDRC',
          'bachelor': 'BACHELOR RDC',
          'bachelor_rdc': 'BACHELOR RDC',
          'tp_ntc': 'TP NTC'
        };
        return map[v] || formatString(v);
      };

      // Construction du payload STRICTEMENT selon la spec backend
      const payload = {
        // Identité
        prenom: data.prenom,
        nom_naissance: data.nom_naissance,
        nom_usage: data.nom_usage || "",
        sexe: mapSexe(data.sexe),
        date_naissance: data.date_naissance,
        nationalite: mapNationalite(data.nationalite),
        commune_naissance: data.commune_naissance,
        departement: data.departement,

        // representant legal 1
        nom_representant_legal: data.nom_representant_legal || data.representant_legal_1?.nom || "",
        prenom_representant_legal: data.prenom_representant_legal || data.representant_legal_1?.prenom || "",
        voie_representant_legal: data.voie_representant_legal || data.representant_legal_1?.voie || "",
        lien_parente_legal: data.lien_parente_legal || data.representant_legal_1?.lien_parente || "",
        numero_legal: data.numero_legal || data.representant_legal_1?.telephone || "",
        numero_adress_legal: data.numero_adress_legal || data.representant_legal_1?.numero || "",
        complement_adresse_legal: data.complement_adresse_legal || data.representant_legal_1?.complement || "",
        code_postal_legal: parseInt(data.code_postal_legal?.toString() || data.representant_legal_1?.code_postal || "0", 10),
        commune_legal: data.commune_legal || data.representant_legal_1?.ville || "",
        courriel_legal: data.courriel_legal || data.representant_legal_1?.email || "",

        // representant legal 2
        nom_representant_legal2: data.nom_representant_legal2 || data.representant_legal_2?.nom || "",
        prenom_representant_legal2: data.prenom_representant_legal2 || data.representant_legal_2?.prenom || "",
        voie_representant_legal2: data.voie_representant_legal2 || data.representant_legal_2?.voie || "",
        lien_parente_legal2: data.lien_parente_legal2 || data.representant_legal_2?.lien_parente || "",
        numero_legal2: data.numero_legal2 || data.representant_legal_2?.telephone || "",
        numero_adress_legal2: data.numero_adress_legal2 || data.representant_legal_2?.numero || "",
        complement_adresse_legal2: data.complement_adresse_legal2 || data.representant_legal_2?.complement || "",
        code_postal_legal2: parseInt(data.code_postal_legal2?.toString() || data.representant_legal_2?.code_postal || "0", 10),
        commune_legal2: data.commune_legal2 || data.representant_legal_2?.ville || "",
        courriel_legal2: data.courriel_legal2 || data.representant_legal_2?.email || "",

        // Coordonnées
        adresse_residence: data.adresse_residence,
        code_postal: parseInt(data.code_postal?.toString() || "0", 10),
        ville: data.ville,
        email: data.email,
        telephone: cleanPhone(data.telephone),
        nir: data.nir ? data.nir.replace(/\s/g, '') : "",

        // Situation & Déclarations
        situation: mapSituation(data.situation),
        regime_social: (data.regime_social === 'urssaf') ? "Sécurité Sociale" : (data.regime_social === 'msa' ? "MSA" : "Sécurité Sociale"),

        declare_inscription_sportif_haut_niveau: data.declare_inscription_sportif_haut_niveau || false,
        declare_avoir_projet_creation_reprise_entreprise: data.declare_avoir_projet_creation_reprise_entreprise || false,
        declare_travailleur_handicape: data.declare_travailleur_handicape || false,
        alternance: data.alternance || false,

        // Scolarité
        dernier_diplome_prepare: mapDiplome(data.dernier_diplome_prepare),
        derniere_classe: data.derniere_classe || "",
        bac: mapNiveau(data.bac) || "",
        intitulePrecisDernierDiplome: data.intitulePrecisDernierDiplome || "",

        // Projet
        formation_souhaitee: mapFormation(data.formation_souhaitee),
        date_de_visite: data.date_de_visite || new Date().toISOString().split('T')[0],
        date_de_reglement: data.date_de_reglement || new Date().toISOString().split('T')[0],

        entreprise_d_accueil: data.entreprise_d_accueil || "Non",

        connaissance_rush_how: formatString(data.connaissance_rush_how || "") || "Autre",
        motivation_projet_professionnel: data.motivation_projet_professionnel || "Non renseigné"
      };

      console.log("📤 Submitting payload:", payload);

      console.log("📤 [API] Submitting Student payload:", payload);

      const response = await fetch(`${BASE_URL}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("❌ [API] Student Submission Error Details:", errorData);
          if (errorData.detail) errorMessage = Array.isArray(errorData.detail) ? errorData.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ') : errorData.detail;
        } catch (e) {
          const text = await response.text();
          console.error("❌ [API] Raw Error Text:", text);
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      const json = await response.json();

      // Ensure we return the expected structure for the form (success, record_id)
      if (json && (json.id || json.record_id)) {
        return {
          success: true,
          record_id: json.record_id || json.id,
          data: json
        };
      }

      return {
        success: true,
        ...json
      };
    } catch (error: any) {
      console.error('❌ API Error (Submit Student):', error);
      throw error;
    }
  },

  // READ ALL (GET)
  async getAllCandidates(): Promise<any[]> {
    try {
      const response = await fetch(`${BASE_URL}/candidates`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch candidates');
      return await response.json();
    } catch (error) {
      console.error('❌ API Error (Get All Candidates):', error);
      return [];
    }
  },

  // GET ETUDIANTS FICHES (Document tracking)
  async getEtudiantsFiches(avecFicheUniquement: boolean = false): Promise<any> {
    try {
      const url = `${BASE_API_URL}/rh/etudiants-fiches?avec_fiche_uniquement=${avecFicheUniquement}`;
      console.log(`🔍 Fetching étudiants fiches from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch étudiants fiches');
      return await response.json();
    } catch (error) {
      console.error('❌ API Error (Get Étudiants Fiches):', error);
      throw error;
    }
  },

  // GET RH STATS
  async getRHStats(): Promise<any> {
    try {
      const response = await fetch(`${BASE_API_URL}/rh/statistiques`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch RH stats');
      return await response.json();
    } catch (error) {
      console.error('❌ API Error (Get RH Stats):', error);
      throw error;
    }
  },

  // READ ONE (GET)
  async getCandidateById(id: string): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/candidates/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Candidate not found');
      return await response.json();
    } catch (error) {
      console.error('❌ API Error (Get Candidate):', error);
      throw error;
    }
  },

  // UPDATE (PUT)
  async updateCandidate(id: string, data: Partial<StudentFormData>): Promise<any> {
    try {
      const payload = mapToBackendFormat(data);
      const response = await fetch(`${BASE_URL}/candidates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Update failed');
      return await response.json();
    } catch (error) {
      console.error('❌ API Error (Update Candidate):', error);
      throw error;
    }
  },

  // DELETE (DELETE)
  async deleteCandidate(id: string): Promise<boolean> {
    try {
      const url = `${BASE_URL}/candidates/${id}`;
      console.log(`🗑️ [API] Attempting to delete candidate at: ${url}`);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ [API] Delete failed with status ${response.status}:`, errorText);
        throw new Error(`Delete failed: ${response.status}`);
      }

      console.log("✅ [API] Candidate deleted successfully");
      return true;
    } catch (error) {
      console.error('❌ API Error (Delete Candidate):', error);
      throw error;
    }
  },

  // --- DOCUMENTS ---
  async uploadDocument(recordId: string, docType: string, file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpointMap: Record<string, string> = {
        'cv': 'cv',
        'cni': 'cin',
        'lettre': 'lettre-motivation',
        'vitale': 'carte-vitale',
        'diplome': 'dernier-diplome'
      };

      const endpointSuffix = endpointMap[docType] || docType;
      const url = `${BASE_URL}/candidates/${recordId}/documents/${endpointSuffix}`;

      console.log(`🚀 Uploading ${docType} to ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`❌ API Error (Upload ${docType}):`, error);
      throw error;
    }
  },

  // --- GENERATE FICHE (NEW) ---
  async generateFicheRenseignement(etudiantId: string): Promise<ApiResponse> {
    try {
      console.log(`🚀 Génération fiche pour étudiant: ${etudiantId}`);
      const response = await fetch(`${BASE_API_URL}/generate-fiche/${etudiantId}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || response.statusText);
      }

      const json = await response.json();
      return {
        success: true,
        data: json
      };
    } catch (error: any) {
      console.error('❌ API Error (Generate Fiche):', error);
      throw error;
    }
  },

  // --- ENTREPRISE (CRUD) ---

  // CREATE (POST)
  async submitCompany(data: CompanyFormData): Promise<ApiResponse> {
    try {
      // Helper pour s'assurer qu'on envoie une chaîne vide et non null
      const ensureString = (val: any) => {
        if (val === undefined || val === null) return "";
        return String(val);
      };

      // Mapper la structure imbriquée du frontend vers la structure plate attendue par le backend
      const payload = {
        // SECTION 1: IDENTIFICATION ENTREPRISE
        identification: {
          raison_sociale: ensureString(data.identification.raison_sociale),
          siret: ensureString(data.identification.siret),
          code_ape_naf: ensureString(data.identification.code_ape_naf),
          type_employeur: ensureString(data.identification.type_employeur),
          nombre_salaries: data.identification.effectif ? parseInt(data.identification.effectif.toString()) : null,
          convention_collective: ensureString(data.identification.convention)
        },

        // SECTION 2: ADRESSE ENTREPRISE
        adresse: {
          numero: ensureString(data.adresse.num),
          voie: ensureString(data.adresse.voie),
          complement: ensureString(data.adresse.complement),
          code_postal: ensureString(data.adresse.code_postal),
          ville: ensureString(data.adresse.ville),
          telephone: ensureString(data.adresse.telephone),
          email: ensureString(data.adresse.email)
        },

        // SECTION 3: MAÎTRE D'APPRENTISSAGE
        maitre_apprentissage: {
          nom: ensureString(data.maitre_apprentissage.nom),
          prenom: ensureString(data.maitre_apprentissage.prenom),
          date_naissance: ensureString(data.maitre_apprentissage.date_naissance),
          fonction: ensureString(data.maitre_apprentissage.fonction),
          diplome_plus_eleve: ensureString(data.maitre_apprentissage.diplome),
          annees_experience: ensureString(data.maitre_apprentissage.experience),
          telephone: ensureString(data.maitre_apprentissage.telephone),
          email: ensureString(data.maitre_apprentissage.email)
        },

        // SECTION 4: OPCO
        opco: {
          nom_opco: ensureString(data.opco.nom),
        },

        // SECTION 5: CONTRAT
        contrat: {
          type_contrat: ensureString(data.contrat.type_contrat),
          type_derogation: ensureString(data.contrat.type_derogation),
          date_debut: ensureString(data.formation.date_debut),
          date_fin: ensureString(data.formation.date_fin),
          duree_hebdomadaire: ensureString(data.contrat.duree_hebdomadaire),
          poste_occupe: ensureString(data.contrat.poste_occupe),
          lieu_execution: ensureString(data.contrat.lieu_execution),
          pourcentage_smic: data.contrat.pourcentage_smic || 0,
          smic: ensureString(data.contrat.smic),
          montant_salaire_brut: data.contrat.montant_salaire_brut ? parseFloat(data.contrat.montant_salaire_brut.toString()) : null,

          date_conclusion: ensureString(data.contrat.date_conclusion),
                    date_debut_execution: ensureString(data.contrat.date_debut_execution),
                    numero_deca_ancien_contrat: ensureString(data.contrat.numero_deca_ancien_contrat),
                    travail_machine_dangereuse: ensureString(data.contrat.machines_dangereuses),
                    caisse_retraite: ensureString(data.contrat.caisse_retraite),
          date_avenant: ensureString(data.contrat.date_avenant)
        },

        // SECTION 6: FORMATION & MISSIONS
        formation_missions: {
          formation_alternant: data.missions.selectionnees.length > 0 ? data.missions.selectionnees.join(', ') : "",
          formation_choisie: ensureString(data.formation.choisie),
          code_rncp: ensureString(data.formation.code_rncp),
          code_diplome: ensureString(data.formation.code_diplome),
          nombre_heures_formation: data.formation.nb_heures ? parseFloat(data.formation.nb_heures.toString()) : 0,
          jours_de_cours: (() => {
            const val = data.formation.jours_cours;
            if (!val) return 0;
            const strVal = String(val);
            if (strVal.includes('/')) return strVal.split('/').length;
            const parsed = parseFloat(strVal);
            return isNaN(parsed) ? 0 : parsed;
          })(),

          // Informations CFA
          cfaEnterprise: data.cfa.entreprise === 'oui',
          DenominationCFA: ensureString(data.cfa.denomination),
          NumeroUAI: ensureString(data.cfa.uai),
          NumeroSiretCFA: ensureString(data.cfa.siret),
          AdresseCFA: ensureString(data.cfa.adresse),
          complementAdresseCFA: ensureString(data.cfa.complement),
          codePostalCFA: ensureString(data.cfa.code_postal),
          communeCFA: ensureString(data.cfa.commune)
        },

        // RECORD ID ÉTUDIANT
        record_id_etudiant: ensureString(data.record_id_etudiant)
      };

      console.log("📤 [API] Submitting Company payload:", payload);

      const response = await fetch(`${BASE_URL}/entreprise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("❌ [API] Company Submission Error Details:", errorData);
          if (errorData.detail) errorMessage = Array.isArray(errorData.detail) ? errorData.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ') : errorData.detail;
        } catch (e) {
          const text = await response.text();
          console.error("❌ [API] Raw Error Text:", text);
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      const json = await response.json();
      return {
        success: true,
        data: json
      };
    } catch (error: any) {
      console.error('❌ API Error (Submit Company):', error);
      throw error;
    }
  },

  // READ ALL (GET)
  async getAllCompanies(): Promise<any[]> {
    try {
      const response = await fetch(`${BASE_URL}/entreprise`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to fetch companies');
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  // READ ONE (GET)
  async getCompanyById(id: string): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/entreprise/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('Company not found');
      return await response.json();
    } catch (error) {
      console.error('❌ API Error (Get Company):', error);
      throw error;
    }
  },

  // UPDATE (PUT)
  async updateCompany(id: string, data: Partial<CompanyFormData>): Promise<any> {
    try {
      const payload = mapToBackendFormat(data);
      const response = await fetch(`${BASE_URL}/entreprise/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Update company failed');
      return await response.json();
    } catch (error) {
      console.error('❌ API Error (Update Company):', error);
      throw error;
    }
  }
};