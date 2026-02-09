import React, { useState } from 'react';
import { 
  ClipboardCheck, PlayCircle, CheckCircle, Clock, 
  Award, Eye, TrendingUp, AlertTriangle, Calendar,
  ChevronRight, BarChart3
} from 'lucide-react';
import StudentNavbar from '../../components/StudentNavbar';

interface Questionnaire {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'future' | 'urgent';
  completionDate?: string;
  deadline?: string;
  duration: string;
  questionCount: number;
  score?: number;
  category: 'satisfaction' | 'skills' | 'company' | 'academic';
  color: string;
  bgColor: string;
  gradient: string;
}

const StudentQuestionnaires: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showQuestionnaire, setShowQuestionnaire] = useState<number | null>(null);

  // Données des questionnaires
  const questionnaires: Questionnaire[] = [
    {
      id: 1,
      title: 'Satisfaction rating S1',
      description: 'Evaluate your trainers and the quality of teaching',
      status: 'urgent',
      deadline: 'January 31, 2026',
      duration: '~5 minutes',
      questionCount: 15,
      category: 'satisfaction',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      gradient: 'from-yellow-50 to-yellow-100'
    },
    {
      id: 2,
      title: 'Back-to-school questionnaire',
      description: 'Your expectations and objectives',
      status: 'completed',
      completionDate: '15/09/2025',
      duration: '~3 minutes',
      questionCount: 8,
      category: 'academic',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      gradient: 'from-green-50 to-green-100'
    },
    {
      id: 3,
      title: 'Self-assessment skills',
      description: 'Mid-term review',
      status: 'completed',
      completionDate: '15/11/2025',
      duration: '~8 minutes',
      questionCount: 12,
      score: 72,
      category: 'skills',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      gradient: 'from-green-50 to-green-100'
    },
    {
      id: 4,
      title: 'Company tutor evaluation',
      description: 'Relationship with your tutor',
      status: 'completed',
      completionDate: '10/12/2025',
      duration: '~5 minutes',
      questionCount: 10,
      category: 'company',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      gradient: 'from-green-50 to-green-100'
    },
    {
      id: 5,
      title: 'Year-end review',
      description: 'Overall assessment of the year',
      status: 'future',
      deadline: '15/06/2026',
      duration: '~10 minutes',
      questionCount: 20,
      category: 'academic',
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      gradient: 'from-gray-50 to-gray-100'
    }
  ];

  // Statistiques
  const stats = {
    completed: questionnaires.filter(q => q.status === 'completed').length,
    pending: questionnaires.filter(q => q.status === 'pending' || q.status === 'urgent').length,
    future: questionnaires.filter(q => q.status === 'future').length
  };

  // Filtres
  const filters = [
    { id: 'all', label: 'All', count: questionnaires.length },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'completed', label: 'Completed', count: stats.completed },
    { id: 'future', label: 'Future', count: stats.future }
  ];

  // Filtrer les questionnaires
  const filteredQuestionnaires = questionnaires.filter(q => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return q.status === 'pending' || q.status === 'urgent';
    return q.status === activeFilter;
  });

  // Fonctions
  const startQuestionnaire = (id: number) => {
    console.log('Starting questionnaire:', id);
    // Logique de démarrage du questionnaire
    setShowQuestionnaire(id);
  };

  const viewResults = (id: number) => {
    console.log('Viewing results for questionnaire:', id);
    // Logique d'affichage des résultats
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            ✓ Completed
          </span>
        );
      case 'urgent':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            Urgent
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
            Pending
          </span>
        );
      case 'future':
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
            Future
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <StudentNavbar />
      
      {/* Header avec statistiques */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Questionnaires & Assessments</h2>
          <p className="text-gray-600">Complete your questionnaires to improve your training</p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-5 py-4 bg-green-50 rounded-xl text-center min-w-[120px]">
            <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
            <div className="text-sm text-green-600 font-medium">Completed</div>
          </div>
          <div className="px-5 py-4 bg-yellow-50 rounded-xl text-center min-w-[120px]">
            <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
            <div className="text-sm text-yellow-600 font-medium">On hold</div>
          </div>
        </div>
      </div>

      {/* Questionnaire urgent */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-2xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-yellow-500 rounded-xl flex items-center justify-center">
              <ClipboardCheck size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-yellow-900 text-lg">Satisfaction rating S1</h3>
                <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                  Urgent
                </span>
              </div>
              <p className="text-yellow-800 mb-3">Evaluate your trainers and the quality of teaching</p>
              <div className="flex flex-wrap gap-4 text-sm text-yellow-700">
                <span className="flex items-center gap-2">
                  <Clock size={14} />
                  ~5 minutes
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={14} />
                  Deadline: January 31, 2026
                </span>
                <span className="flex items-center gap-2">
                  <AlertTriangle size={14} />
                  15 questions
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => startQuestionnaire(1)}
            className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold flex items-center gap-3 hover:bg-yellow-600 transition-colors whitespace-nowrap"
          >
            <PlayCircle size={20} />
            To start
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
              activeFilter === filter.id
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
            <span className="ml-2 px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs">
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Liste des questionnaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuestionnaires.map((questionnaire) => (
          <div 
            key={questionnaire.id}
            className={`bg-white border rounded-2xl p-6 hover:shadow-md transition-all duration-200 ${
              questionnaire.status === 'future' ? 'opacity-70' : ''
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-3 ${questionnaire.bgColor} rounded-xl`}>
                {questionnaire.status === 'completed' ? (
                  <CheckCircle size={24} className={questionnaire.color} />
                ) : questionnaire.status === 'urgent' ? (
                  <AlertTriangle size={24} className={questionnaire.color} />
                ) : (
                  <Clock size={24} className={questionnaire.color} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-lg truncate">{questionnaire.title}</h4>
                  {getStatusBadge(questionnaire.status)}
                </div>
                <p className="text-gray-600 text-sm mb-3">{questionnaire.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {questionnaire.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <ClipboardCheck size={12} />
                    {questionnaire.questionCount} questions
                  </span>
                  {questionnaire.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Deadline: {questionnaire.deadline}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Score pour les questionnaires complétés */}
            {questionnaire.score && (
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Your overall score</span>
                  <span className="font-bold text-green-600">{questionnaire.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full"
                    style={{ width: `${questionnaire.score}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {questionnaire.status === 'completed' ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle size={14} />
                      Completed on {questionnaire.completionDate}
                    </span>
                  ) : questionnaire.status === 'future' ? (
                    <span className="flex items-center gap-2">
                      <Calendar size={14} />
                      📅 Available on {questionnaire.deadline}
                    </span>
                  ) : (
                    <span>Ready to complete</span>
                  )}
                </div>
                
                {questionnaire.status === 'completed' ? (
                  <button
                    onClick={() => viewResults(questionnaire.id)}
                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <Eye size={16} />
                    See my answers
                  </button>
                ) : questionnaire.status === 'future' ? (
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                  >
                    Unavailable
                  </button>
                ) : (
                  <button
                    onClick={() => startQuestionnaire(questionnaire.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    <PlayCircle size={16} />
                    {questionnaire.status === 'urgent' ? 'Start now' : 'Start'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistiques et informations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-blue-700" />
            </div>
            <div>
              <div className="text-xl font-bold text-blue-800">86%</div>
              <div className="text-sm text-blue-700">Completion rate</div>
            </div>
          </div>
          <p className="text-sm text-blue-600">
            Excellent! Keep completing your questionnaires
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center">
              <Award size={20} className="text-green-700" />
            </div>
            <div>
              <div className="text-xl font-bold text-green-800">72%</div>
              <div className="text-sm text-green-700">Average score</div>
            </div>
          </div>
          <p className="text-sm text-green-600">
            Based on your completed assessments
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center">
              <BarChart3 size={20} className="text-purple-700" />
            </div>
            <div>
              <div className="text-xl font-bold text-purple-800">3 days</div>
              <div className="text-sm text-purple-700">Average response time</div>
            </div>
          </div>
          <p className="text-sm text-purple-600">
            Faster than the class average (5 days)
          </p>
        </div>
      </div>

      {/* Conseils */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <AlertTriangle size={24} className="text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 text-lg">Why complete questionnaires?</h4>
            <p className="text-blue-700 text-sm">Your feedback helps improve your training experience</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Improve teaching quality</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Personalize your training</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Develop your self-assessment skills</span>
            </li>
          </ul>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Contribute to school improvement</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Track your progress</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Earn feedback from trainers</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Modal de questionnaire (simplifié) */}
      {showQuestionnaire && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {questionnaires.find(q => q.id === showQuestionnaire)?.title}
              </h3>
              <button
                onClick={() => setShowQuestionnaire(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-600">
                This is a preview of the questionnaire. In a real implementation, 
                this would show the actual questions and form.
              </p>
              
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={18} className="text-blue-600" />
                  <span className="font-medium text-blue-800">Estimated time: 5 minutes</span>
                </div>
                <p className="text-sm text-blue-700">
                  Please answer honestly, your feedback is valuable for improving the training.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowQuestionnaire(null)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Questionnaire completed');
                    setShowQuestionnaire(null);
                  }}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Start questionnaire
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQuestionnaires;