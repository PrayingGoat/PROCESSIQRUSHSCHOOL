
const BASE_URL = 'https://liantsoaxx08-apirushscholl.hf.space/api/v1/admission';

// Fonction utilitaire pour convertir camelCase vers snake_case (standard Python/FastAPI)
const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const mapToBackendFormat = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;
  
  if (Array.isArray(data)) {
    return data.map(mapToBackendFormat);
  }
  
  return Object.keys(data).reduce((acc, key) => {
    const snakeKey = toSnakeCase(key);
    // Récursion pour les objets imbriqués
    acc[snakeKey] = mapToBackendFormat(data[key]);
    return acc;
  }, {} as any);
};

export const api = {
  /**
   * Soumet le formulaire étudiant (Candidat)
   * Doc: POST /api/v1/admission/candidates
   */
  async submitStudent(data: any) {
    try {
      const payload = mapToBackendFormat(data);
      console.log('🚀 Submitting student to:', `${BASE_URL}/candidates`);
      console.log('📦 Payload:', payload);

      const response = await fetch(`${BASE_URL}/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API (${response.status}): ${errorText || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ API Error (Student):', error);
      throw error; 
    }
  },

  /**
   * Soumet le formulaire entreprise
   * Doc: POST /api/v1/admission/entreprise
   */
  async submitCompany(data: any) {
    try {
      const payload = mapToBackendFormat(data);
      console.log('🚀 Submitting company to:', `${BASE_URL}/entreprise`);
      console.log('📦 Payload:', payload);

      const response = await fetch(`${BASE_URL}/entreprise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API (${response.status}): ${errorText || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ API Error (Company):', error);
      throw error;
    }
  }
};
