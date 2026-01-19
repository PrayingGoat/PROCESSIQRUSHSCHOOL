
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
      // Note: The input `data` comes from QuestionnaireForm.tsx and uses snake_case keys (mostly).
      const payload = {
        // Identité
        prenom: data.prenom,
        nom_naissance: data.nom_naissance || data.nom,
        nom_usage: data.nom_usage || data.nomUsage || "",
        sexe: mapSexe(data.sexe),
        date_naissance: data.date_naissance || data.dateNaissance,
        nationalite: mapNationalite(data.nationalite),
        commune_naissance: data.commune_naissance || data.villeNaissance,
        departement: data.departement || data.deptNaissance,
        
        // Coordonnées
        adresse_residence: data.adresse_residence || data.adresse,
        code_postal: data.code_postal || data.codePostal,
        ville: data.ville,
        email: data.email,
        telephone: cleanPhone(data.telephone),
        nir: data.nir ? data.nir.replace(/\s/g, '') : "",
        
        // Situation & Déclarations
        situation: mapSituation(data.situation), // apiData already has 'situation' mapped from 'situation_avant'
        regime_social: (data.regime_social === 'urssaf' || data.regimeSocial === 'urssaf') ? "Sécurité Sociale" : (data.regime_social === 'msa' || data.regimeSocial === 'msa' ? "MSA" : "Sécurité Sociale"), 
        
        declare_inscription_sportif_haut_niveau: typeof data.declare_inscription_sportif_haut_niveau === 'boolean' ? data.declare_inscription_sportif_haut_niveau : (data.sportifHautNiveau === 'oui'),
        declare_avoir_projet_creation_reprise_entreprise: typeof data.declare_avoir_projet_creation_reprise_entreprise === 'boolean' ? data.declare_avoir_projet_creation_reprise_entreprise : (data.projetEntreprise === 'oui'),
        declare_travailleur_handicape: typeof data.declare_travailleur_handicape === 'boolean' ? data.declare_travailleur_handicape : (data.rqth === 'oui'),
        
        // Scolarité
        dernier_diplome_prepare: mapDiplome(data.dernier_diplome_prepare || data.diplome),
        intitule_diplome: data.intitule_diplome || "",
        derniere_classe: data.derniere_classe || data.classe || "",
        bac: mapNiveau(data.bac || data.niveau) || "", 
        
        // Projet
        formation_souhaitee: mapFormation(data.formation_souhaitee || data.formation),
        date_de_visite: data.date_de_visite || data.dateVisite || new Date().toISOString().split('T')[0],
        date_de_reglement: data.date_de_reglement || data.dateReglement || new Date().toISOString().split('T')[0],
        
        entreprise_d_accueil: data.entreprise_d_accueil || (data.entrepriseAccueil === 'oui' ? (data.nomEntreprise || "Oui") : (data.entrepriseAccueil === 'en_cours' ? "En recherche" : "Non")),
        
        connaissance_rush_how: formatString(data.connaissance_rush_how || data.source) || "Autre", 
        motivation_projet_professionnel: data.motivation_projet_professionnel || data.motivations || "Non renseigné" 
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
      
      const json = await response.json();
      
      // Ensure we return the expected structure for the form (success, record_id)
      if (json && (json.id || json.record_id)) {
          return {
              success: true,
              record_id: json.record_id || json.id,
              data: json
          };
      }
      
      return json;
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
