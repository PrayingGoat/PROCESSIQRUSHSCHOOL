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
      // Helper pour nettoyer les téléphones (Strictement selon le validator Python)
      const cleanPhone = (p: any) => {
        if (!p) return "";
        let phone = p.toString().replace(/[^\d+]/g, '');
        if (phone.startsWith('0') && phone.length === 10) {
          return '0' + phone.substring(1); // Le backend s'occupe de mettre +33
        }
        return phone;
      };

      const mapSexe = (v: string) => {
        if (v === 'feminin' || v === 'Féminin' || v === 'Femme') return 'Féminin';
        if (v === 'masculin' || v === 'Masculin' || v === 'Homme') return 'Masculin';
        return v || "Masculin";
      };

      const mapNationalite = (v: string) => {
        if (v === 'francaise') return 'Française';
        if (v === 'ue') return 'Union Européenne';
        if (v === 'hors_ue') return 'Hors Union Européenne';
        return formatString(v || "");
      };

      const mapClasse = (v: string) => {
        const map: Record<string, string> = {
          'derniere_annee_obtenu': 'Diplôme obtenu',
          'terminale': 'Terminale',
          '1ere_annee_validee': '1ère année validée',
          '3e': 'Classe de 3ème'
        };
        return map[v] || v;
      };

      // Construction du payload selon les types du modèle Pydantic
      const payload = {
        prenom: data.prenom || "",
        nom_naissance: data.nom_naissance || "",
        nom_usage: data.nom_usage || null,
        sexe: mapSexe(data.sexe || ""),
        date_naissance: data.date_naissance || null,
        nationalite: mapNationalite(data.nationalite || ""),
        commune_naissance: data.commune_naissance || "",
        departement: data.departement || "",

        nom_representant_legal: data.nom_representant_legal || (data.representant_legal_1?.nom ? `${data.representant_legal_1.nom} ${data.representant_legal_1.prenom || ""}`.trim() : null),
        voie_representant_legal: data.voie_representant_legal || data.representant_legal_1?.voie || null,
        numero_legal: data.numero_legal || data.representant_legal_1?.numero || null,
        complement_adresse_legal: data.complement_adresse_legal || data.representant_legal_1?.complement || null,
        code_postal_legal: data.code_postal_legal || data.representant_legal_1?.code_postal || null,
        commune_legal: data.commune_legal || data.representant_legal_1?.ville || null,
        courriel_legal: data.courriel_legal || data.representant_legal_1?.email || null,

        adresse_residence: data.adresse_residence || "",
        code_postal: data.code_postal?.toString() || "",
        ville: data.ville || "",
        email: data.email || "",
        telephone: cleanPhone(data.telephone || ""),
        nir: data.nir ? data.nir.replace(/\s/g, '') : null,

        situation: data.situation || null,
        regime_social: data.regime_social || null,
        declare_inscription_sportif_haut_niveau: !!data.declare_inscription_sportif_haut_niveau,
        declare_avoir_projet_creation_reprise_entreprise: !!data.declare_avoir_projet_creation_reprise_entreprise,
        declare_travailleur_handicape: !!data.declare_travailleur_handicape,
        alternance: !!data.alternance,

        dernier_diplome_prepare: data.dernier_diplome_prepare || null,
        derniere_classe: mapClasse(data.derniere_classe || ""),
        bac: data.bac || "",
        intitulePrecisDernierDiplome: data.intitulePrecisDernierDiplome || null,

        formation_souhaitee: data.formation_souhaitee || null,
        date_de_visite: data.date_de_visite || null,
        date_de_reglement: data.date_de_reglement || null,
        entreprise_d_accueil: data.entreprise_d_accueil || null,

        connaissance_rush_how: data.connaissance_rush_how || null,
        motivation_projet_professionnel: data.motivation_projet_professionnel || null
      };

      const requiredFields = ['prenom', 'nom_naissance', 'sexe', 'date_naissance', 'nationalite', 'commune_naissance', 'departement', 'adresse_residence', 'code_postal', 'ville', 'email', 'telephone', 'bac'];

      const finalPayload = Object.keys(payload).reduce((acc: any, key) => {
        const value = (payload as any)[key];
        if (!requiredFields.includes(key) && (value === "" || value === undefined)) {
          acc[key] = null;
        } else {
          acc[key] = value;
        }
        return acc;
      }, {});

      console.log("🚀 Submitting payload to backend:", finalPayload);

      const response = await fetch(`${BASE_URL}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(finalPayload),
      });

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
        } catch (e) {
          const text = await response.text();
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      const json = await response.json();
      return {
        success: true,
        record_id: json.record_id || json.id,
        data: json
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
      const response = await fetch(`${BASE_URL}/candidates/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
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
        'cv': 'cv', 'cni': 'cin', 'lettre': 'lettre-motivation', 'vitale': 'carte-vitale', 'diplome': 'dernier-diplome'
      };
      const endpointSuffix = endpointMap[docType] || docType;
      const url = `${BASE_URL}/candidates/${recordId}/documents/${endpointSuffix}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error(`❌ API Error (Upload ${docType}):`, error);
      throw error;
    }
  },

  // --- GENERATE FICHE (NEW) ---
  async generateFicheRenseignement(etudiantId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_API_URL}/generate-fiche/${etudiantId}`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || response.statusText);
      }
      const json = await response.json();
      return { success: true, data: json };
    } catch (error: any) {
      console.error('❌ API Error (Generate Fiche):', error);
      throw error;
    }
  },

  // --- ENTREPRISE (CRUD) ---

  // CREATE (POST)
  async submitCompany(data: CompanyFormData): Promise<ApiResponse> {
    try {
      const cleanData = (obj: any): any => {
        if (typeof obj !== 'object' || obj === null) return obj;
        const cleaned: any = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          const value = obj[key];
          const numericFields = [
            'nombre_salaries', 'annees_experience', 'nombre_mois', 'montant_salaire_brut',
            'nombre_heures_formation', 'jours_de_cours', 'effectif', 'nb_heures',
            'experience', 'pourcentage', 'montant'
          ];
          if (numericFields.includes(key)) {
            cleaned[key] = (value === null || value === undefined || (typeof value === 'string' && value.trim() === ''))
              ? null
              : (typeof value === 'number' ? value : parseFloat(value.toString()) || null);
          } else if (typeof value === 'object' && value !== null) {
            cleaned[key] = cleanData(value);
          } else if (typeof value === 'string' && value.trim() === '') {
            cleaned[key] = null;
          } else {
            cleaned[key] = value;
          }
        }
        return cleaned;
      };
      const payload = cleanData(data);
      const response = await fetch(`${BASE_URL}/entreprise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || response.statusText);
      }
      const json = await response.json();
      return { success: true, data: json };
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
    } catch (error) { return []; }
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