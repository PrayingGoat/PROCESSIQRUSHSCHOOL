
const BASE_URL = 'https://liantsoaxx08-apirushscholl.hf.space/api/v1/admission';

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
  async checkHealth() {
    try {
      const response = await fetch(`${BASE_URL}/health`, { method: 'GET' });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // --- CANDIDATES (CRUD) ---
  
  // CREATE (POST)
  async submitStudent(data: any) {
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

      // Conversion des booléens "oui"/"non" en true/false
      const toBool = (val: string) => val === 'oui';

      // Construction du payload STRICTEMENT selon la spec backend fournie
      const payload = {
        // Identité
        prenom: data.prenom,
        nom_naissance: data.nom,
        nom_usage: data.nomUsage || "",
        sexe: data.sexe,
        date_naissance: data.dateNaissance,
        nationalite: formatString(data.nationalite),
        commune_naissance: data.villeNaissance,
        departement: data.deptNaissance,
        
        // Coordonnées
        adresse_residence: data.adresse,
        code_postal: data.codePostal,
        ville: data.ville,
        email: data.email,
        telephone: cleanPhone(data.telephone),
        nir: data.nir ? data.nir.replace(/\s/g, '') : "",
        
        // Situation & Déclarations
        situation: formatString(data.situation) || "Candidat", 
        regime_social: data.regimeSocial === 'urssaf' ? "Sécurité Sociale" : (data.regimeSocial === 'msa' ? "MSA" : "Sécurité Sociale"), 
        declare_inscription_sportif_haut_niveau: toBool(data.sportifHautNiveau),
        declare_avoir_projet_creation_reprise_entreprise: toBool(data.projetEntreprise),
        declare_travailleur_handicape: toBool(data.rqth),
        
        // Scolarité
        dernier_diplome_prepare: formatString(data.diplome),
        derniere_classe: data.classe || "",
        bac: formatString(data.niveau) || "", 
        
        // Projet
        formation_souhaitee: formatString(data.formation),
        date_de_visite: data.dateVisite || new Date().toISOString().split('T')[0], // Fallback to today to avoid 500
        date_de_reglement: data.dateReglement || new Date().toISOString().split('T')[0],
        
        entreprise_d_accueil: data.entrepriseAccueil === 'oui' ? (data.nomEntreprise || "Oui") : (data.entrepriseAccueil === 'en_cours' ? "En recherche" : "Non"),
        
        connaissance_rush_how: formatString(data.source) || "Autre", 
        motivation_projet_professionnel: data.motivations || "Non renseigné" 
      };

      console.log("📤 Submitting payload:", payload);

      const response = await fetch(`${BASE_URL}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          // Gestion des erreurs Pydantic détaillées
          if (Array.isArray(errorData.detail)) {
            const details = errorData.detail
              .map((err: any) => {
                 const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : 'champ inconnu';
                 return `${field}: ${err.msg}`;
              })
              .join(', ');
            if (details) errorMessage = details;
          } else if (typeof errorData.detail === 'string' && errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (e) {
           const text = await response.text();
           if (text) errorMessage = `Erreur ${response.status}: ${text}`;
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ API Error (Submit Student):', error);
      throw error; 
    }
  },

  // READ ALL (GET)
  async getAllCandidates() {
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

  // READ ONE (GET)
  async getCandidateById(id: string) {
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
  async updateCandidate(id: string, data: any) {
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
  async deleteCandidate(id: string) {
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
  async uploadDocument(recordId: string, docType: string, file: File) {
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

  // --- ENTREPRISE (CRUD) ---
  
  // CREATE (POST)
  async submitCompany(data: any) {
    try {
      const payload = mapToBackendFormat(data);
      const response = await fetch(`${BASE_URL}/entreprise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || response.statusText);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ API Error (Submit Company):', error);
      throw error;
    }
  },

  // READ ALL (GET)
  async getAllCompanies() {
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
  async getCompanyById(id: string) {
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
  async updateCompany(id: string, data: any) {
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
