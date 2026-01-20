import React, { useState, useEffect } from 'react';
import { ViewId } from '../types';
import { 
  FileText, 
  Euro, 
  UserMinus, 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Download, 
  Edit,
  Loader2,
  Building,
  History
} from 'lucide-react';
import { api } from '../services/api';

const RHView: React.FC<{ activeSubView: ViewId }> = ({ activeSubView }) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await api.getAllCandidates();
            setCandidates(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const getC = (c: any) => {
    const d = c.fields || c.data || c || {};
    return {
        id: c.id || d.id || d.record_id,
        prenom: d['Prénom'] || d.prenom || "",
        nom: d['NOM de naissance'] || d.nom || "",
        formation: d['Formation'] || d.formation || "",
        entreprise: d['Entreprise daccueil'] || d.entreprise || "",
        // Add more mapping as needed
    };
  };

  if (loading) {
      return (
          <div className="flex h-full items-center justify-center">
              <Loader2 className="animate-spin text-blue-500" size={48} />
          </div>
      )
  }

  // --- DASHBOARD HEADER ---
  const renderHeader = () => (
    <>
        <div className="page-header">
            <div>
                <h1 className="page-title">Ressources Humaines</h1>
                <div className="page-meta">
                    <div className="page-meta-item">
                        <Users size={18} />
                        <span>Gestion administrative des alternants</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="rh-stats-row">
            <div className="rh-stat-card blue">
                <div className="rh-stat-icon">
                    <FileText size={24} />
                </div>
                <div className="rh-stat-info">
                    <span className="rh-stat-value">{candidates.length}</span>
                    <span className="rh-stat-label">CERFA en cours</span>
                </div>
            </div>
            <div className="rh-stat-card green">
                <div className="rh-stat-icon">
                    <Euro size={24} />
                </div>
                <div className="rh-stat-info">
                    <span className="rh-stat-value">0</span>
                    <span className="rh-stat-label">Prises en charge</span>
                </div>
            </div>
            <div className="rh-stat-card orange">
                <div className="rh-stat-icon">
                    <UserMinus size={24} />
                </div>
                <div className="rh-stat-info">
                    <span className="rh-stat-value">0</span>
                    <span className="rh-stat-label">Ruptures ce mois</span>
                </div>
            </div>
            <div className="rh-stat-card purple">
                <div className="rh-stat-icon">
                    <Users size={24} />
                </div>
                <div className="rh-stat-info">
                    <span className="rh-stat-value">{candidates.length}</span>
                    <span className="rh-stat-label">Étudiants actifs</span>
                </div>
            </div>
        </div>
    </>
  );

  if (activeSubView === 'rh-cerfa') {
      return (
          <div>
              {renderHeader()}
              <div className="rh-section active">
                  <div className="hero-section">
                      <div className="hero-content">
                          <div className="hero-left">
                              <div className="hero-icon">
                                  <FileText size={28} color="white" />
                              </div>
                              <div>
                                  <h1 className="hero-title">Gestion des CERFA</h1>
                                  <p className="hero-subtitle">Suivi complet des contrats</p>
                              </div>
                          </div>
                          <div className="hero-actions">
                              <button className="btn-secondary">Historique</button>
                              <button className="btn-primary">Nouveau CERFA</button>
                          </div>
                      </div>
                  </div>

                  <div className="table-container">
                      <div className="table-wrapper">
                          <table>
                              <thead>
                                  <tr>
                                      <th>Formation</th>
                                      <th>Nom Apprenti</th>
                                      <th>Entreprise</th>
                                      <th>Statut</th>
                                      <th>Actions</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {candidates.map((raw) => {
                                      const row = getC(raw);
                                      return (
                                          <tr key={row.id}>
                                              <td>{row.formation}</td>
                                              <td style={{fontWeight: 600}}>{row.prenom} {row.nom}</td>
                                              <td>{row.entreprise}</td>
                                              <td><span className="status-badge warning">En cours</span></td>
                                              <td>
                                                  <div className="actions-cell">
                                                      <button className="action-btn"><Eye size={14} /></button>
                                                      <button className="action-btn"><Edit size={14} /></button>
                                                  </div>
                                              </td>
                                          </tr>
                                      );
                                  })}
                              </tbody>
                          </table>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // Fallback for main dashboard or other views
  return (
      <div>
          {renderHeader()}
          <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 mt-8">
              <p>Sélectionnez une section dans le menu RH</p>
          </div>
      </div>
  );
};

export default RHView;