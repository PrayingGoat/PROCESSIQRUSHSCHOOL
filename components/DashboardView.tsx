import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  Edit,
  Loader2,
  FileText,
  Calendar,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { ViewId } from '../types';
import { api } from '../services/api';

interface DashboardViewProps {
  activeSubView: ViewId;
}

const DashboardView: React.FC<DashboardViewProps> = ({ activeSubView }) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await api.getAllCandidates();
            setCandidates(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // Normalizer to handle different field names
  const getC = (c: any) => {
    const d = c.fields || c.data || c || {};
    return {
        id: c.id || d.id || d.record_id,
        prenom: d['Prénom'] || d.prenom || d.firstname || "",
        nom: d['NOM de naissance'] || d.nom_naissance || d.nom || d.lastname || "",
        email: d['E-mail'] || d.email || "",
        formation: d['Formation'] || d.formation_souhaitee || d.formation || "",
        situation: d['Situation avant le contrat'] || d.situation || d.situation_actuelle || "En recherche",
        ville: d['Commune de naissance'] || d.ville || d.commune_naissance || "",
        departement: d['Département'] || d.departement || "",
        entreprise: d['Entreprise daccueil'] || d.entreprise_d_accueil || d.entreprise || "En recherche",
        telephone: d['Téléphone'] || d.telephone || "",
        age: d['Age'] || "20" // Default for display if missing
    };
  };

  // Filter helpers
  const isPlaced = (rawCandidate: any) => {
      const c = getC(rawCandidate);
      const ent = c.entreprise;
      return ent && ent !== 'Non' && ent !== 'En recherche' && ent !== 'En cours' && ent !== 'null';
  };

  const studentsToPlace = candidates.filter(c => !isPlaced(c));
  const studentsPlaced = candidates.filter(c => isPlaced(c));
  const uniqueCompanies = new Set(studentsPlaced.map(raw => getC(raw).entreprise)).size;

  if (loading) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
      )
  }

  // --- SUB-VIEW: PLACER ---
  if (activeSubView === 'commercial-placer') {
      return (
          <div className="eleves-section-wrapper">
              <div className="eleves-hero danger">
                  <div className="eleves-hero-content">
                      <div className="eleves-hero-left">
                          <div className="eleves-hero-icon">
                              <Users size={36} />
                          </div>
                          <div className="eleves-hero-text">
                              <h1>Élèves à placer</h1>
                              <p>Étudiants en recherche d'alternance ou suite à une rupture de contrat</p>
                          </div>
                      </div>
                      <div className="eleves-hero-actions">
                          <button className="btn-hero primary">
                              Ajouter un élève
                          </button>
                          <button className="btn-hero secondary">
                              Exporter
                          </button>
                      </div>
                  </div>
              </div>

              <div className="eleves-stats-grid">
                  <div className="eleves-stat-card danger">
                      <div className="eleves-stat-header">
                          <div className="eleves-stat-icon danger">
                              <Users size={24} />
                          </div>
                          <span className="eleves-stat-trend down">Urgent</span>
                      </div>
                      <div className="eleves-stat-value">{studentsToPlace.length}</div>
                      <div className="eleves-stat-label">Élèves à placer</div>
                  </div>
                  <div className="eleves-stat-card warning">
                      <div className="eleves-stat-header">
                          <div className="eleves-stat-icon warning">
                              <Calendar size={24} />
                          </div>
                          <span className="eleves-stat-trend neutral">En cours</span>
                      </div>
                      <div className="eleves-stat-value">0</div>
                      <div className="eleves-stat-label">En cours de placement</div>
                  </div>
                  <div className="eleves-stat-card info">
                      <div className="eleves-stat-header">
                          <div className="eleves-stat-icon info">
                              <FileText size={24} />
                          </div>
                          <span className="eleves-stat-trend down">À mettre à jour</span>
                      </div>
                      <div className="eleves-stat-value">0</div>
                      <div className="eleves-stat-label">CV à actualiser</div>
                  </div>
                  <div className="eleves-stat-card success">
                      <div className="eleves-stat-header">
                          <div className="eleves-stat-icon success">
                              <CheckCircle2 size={24} />
                          </div>
                          <span className="eleves-stat-trend up">+2 ce mois</span>
                      </div>
                      <div className="eleves-stat-value">0</div>
                      <div className="eleves-stat-label">Entretiens programmés</div>
                  </div>
              </div>

              <div className="eleves-toolbar">
                  <div className="eleves-toolbar-left">
                      <div className="eleves-search">
                          <Search size={20} />
                          <input type="text" placeholder="Rechercher un élève..." />
                      </div>
                  </div>
              </div>

              <div className="eleves-table-container">
                  <div style={{overflowX: 'auto'}}>
                    <table className="eleves-table">
                        <thead className="danger">
                            <tr>
                                <th className="danger">Formation</th>
                                <th className="danger">Nom</th>
                                <th className="danger">Prénom</th>
                                <th className="danger">Ville</th>
                                <th className="danger">N° Téléphone</th>
                                <th className="danger">Adresse mail</th>
                                <th className="danger">Statut</th>
                                <th className="danger" style={{textAlign: 'center'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsToPlace.map((raw: any) => {
                                const c = getC(raw);
                                return (
                                <tr key={c.id}>
                                    <td><span className="tag formation">{c.formation || 'Non renseigné'}</span></td>
                                    <td style={{fontWeight: 600}}>{c.nom}</td>
                                    <td>{c.prenom}</td>
                                    <td>{c.ville}</td>
                                    <td>{c.telephone}</td>
                                    <td><a href={`mailto:${c.email}`} style={{color: '#3B82F6'}}>{c.email}</a></td>
                                    <td><span className="tag status non">{c.situation}</span></td>
                                    <td>
                                        <div className="eleves-actions" style={{justifyContent: 'center'}}>
                                            <button className="action-btn-new" title="Voir"><Eye size={16}/></button>
                                            <button className="action-btn-new" title="Modifier"><Edit size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                  </div>
              </div>
          </div>
      )
  }

  // --- SUB-VIEW: ALTERNANCE ---
  if (activeSubView === 'commercial-alternance') {
    return (
        <div className="eleves-section-wrapper">
             <div className="eleves-hero success">
                  <div className="eleves-hero-content">
                      <div className="eleves-hero-left">
                          <div className="eleves-hero-icon">
                              <CheckCircle2 size={36} />
                          </div>
                          <div className="eleves-hero-text">
                              <h1>Élèves en alternance</h1>
                              <p>Étudiants ayant trouvé une entreprise d'accueil</p>
                          </div>
                      </div>
                      <div className="eleves-hero-actions">
                          <button className="btn-hero primary">
                              Ajouter un élève
                          </button>
                          <button className="btn-hero secondary">
                              Exporter
                          </button>
                      </div>
                  </div>
              </div>

              <div className="eleves-stats-grid">
                  <div className="eleves-stat-card success">
                      <div className="eleves-stat-header">
                          <div className="eleves-stat-icon success">
                              <Users size={24} />
                          </div>
                          <span className="eleves-stat-trend up">+2 ce mois</span>
                      </div>
                      <div className="eleves-stat-value">{studentsPlaced.length}</div>
                      <div className="eleves-stat-label">Élèves en alternance</div>
                  </div>
                  {/* ... other stats ... */}
              </div>

              <div className="eleves-table-container">
                  <div style={{overflowX: 'auto'}}>
                    <table className="eleves-table">
                        <thead className="success">
                            <tr>
                                <th className="success">Formation</th>
                                <th className="success">Nom</th>
                                <th className="success">Prénom</th>
                                <th className="success">Entreprise</th>
                                <th className="success">Ville</th>
                                <th className="success">N° Téléphone</th>
                                <th className="success">Statut</th>
                                <th className="success" style={{textAlign: 'center'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsPlaced.map((raw: any) => {
                                const c = getC(raw);
                                return (
                                <tr key={c.id}>
                                    <td><span className="tag formation">{c.formation}</span></td>
                                    <td style={{fontWeight: 600}}>{c.nom}</td>
                                    <td>{c.prenom}</td>
                                    <td style={{fontWeight: 600}}>{c.entreprise}</td>
                                    <td>{c.ville}</td>
                                    <td>{c.telephone}</td>
                                    <td><span className="tag status cerfa-valide">✓ Validé</span></td>
                                    <td>
                                        <div className="eleves-actions" style={{justifyContent: 'center'}}>
                                            <button className="action-btn-new" title="Voir"><Eye size={16}/></button>
                                            <button className="action-btn-new" title="Modifier"><Edit size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                  </div>
              </div>
        </div>
    )
  }

  // Default: Dashboard
  return (
    <div className="commercial-section active">
      <div className="bg-indigo-500 rounded-3xl p-8 mb-6 text-white">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold mb-2">Vue d'ensemble</h2>
                <p className="opacity-90">Suivi du placement en alternance</p>
            </div>
        </div>
      </div>

      <div className="stats-grid mb-8">
          <div className="stat-card" style={{background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', borderColor: '#DDD6FE'}}>
              <div className="stat-header">
                  <div className="stat-icon purple">
                      <Users size={24} color="white" />
                  </div>
                  <div className="stat-label" style={{color: '#A78BFA'}}>À placer</div>
              </div>
              <div className="stat-value" style={{color: '#8B5CF6'}}>{studentsToPlace.length}</div>
          </div>
          <div className="stat-card" style={{background: 'linear-gradient(135deg, #F0FFF4 0%, #E6FFFA 100%)', borderColor: '#C6F6D5'}}>
              <div className="stat-header">
                  <div className="stat-icon green">
                      <CheckCircle2 size={24} color="white" />
                  </div>
                  <div className="stat-label" style={{color: '#86EFAC'}}>En alternance</div>
              </div>
              <div className="stat-value" style={{color: '#6EE7B7'}}>{studentsPlaced.length}</div>
          </div>
          <div className="stat-card" style={{background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', borderColor: '#C7D2FE'}}>
              <div className="stat-header">
                  <div className="stat-icon blue">
                      <Briefcase size={24} color="white" />
                  </div>
                  <div className="stat-label" style={{color: '#6366F1'}}>Total Entreprises</div>
              </div>
              <div className="stat-value" style={{color: '#4F46E5'}}>{uniqueCompanies}</div>
          </div>
      </div>
    </div>
  );
};

export default DashboardView;