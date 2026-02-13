import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Download, Calculator, BarChart3, 
  Trophy, Activity, Eye, Filter
} from 'lucide-react';
import StudentNavbar from '../../components/StudentNavbar';
import { api } from '../../services/api';

interface Grade {
  subject: string;
  type: string;
  grade: number;
  coefficient: number;
  classAverage: number;
  date: string;
  appreciation: string;
  color: string;
}

interface Skill {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  color: string;
}

const StudentNotes: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showEvolution, setShowEvolution] = useState<boolean>(true);
  const [remoteGrades, setRemoteGrades] = useState<Grade[]>([]);

  // DEBUG: verify backend data arrival
  useEffect(() => {
    (async () => {
      try {
        const studentId = await api.getCurrentStudentId();
        const grades = await api.getGrades(studentId);
        const mapped: Grade[] = (Array.isArray(grades) ? grades : []).map((g: any) => ({
          subject: g.subject || 'N/A',
          type: g.type || 'exam',
          grade: Number(g.grade ?? 0),
          coefficient: Number(g.coefficient ?? 1),
          classAverage: Number(g.classAverage ?? 0),
          date: g.date ? new Date(g.date).toLocaleDateString('fr-FR') : '',
          appreciation: g.appreciation || '',
          color: Number(g.grade ?? 0) >= 15 ? 'text-green-600' : Number(g.grade ?? 0) >= 12 ? 'text-blue-600' : 'text-yellow-600'
        }));
        setRemoteGrades(mapped);
        console.log('🔔 StudentNotes - getGrades:', grades);
      } catch (err) {
        console.error('🔔 StudentNotes - error fetching grades:', err);
      }
    })();
  }, []);

  // Données des statistiques rapides
  const quickStats = [
    { value: '16.5', label: 'Best rating', subLabel: 'Digital marketing', color: 'text-green-600' },
    { value: '11.0', label: 'Lowest rating', subLabel: 'English', color: 'text-yellow-600' },
    { value: '13.8', label: 'Middle class', subLabel: '+0.4 vs you', color: 'text-blue-600' },
    { value: '8', label: 'Evaluations', subLabel: 'this semester', color: 'text-purple-600' }
  ];

  // Données des compétences
  const skills: Skill[] = [
    { name: 'Negotiation', score: 15, maxScore: 20, percentage: 75, color: 'bg-green-500' },
    { name: 'Marketing', score: 16.5, maxScore: 20, percentage: 82.5, color: 'bg-green-500' },
    { name: 'Customer relations', score: 14, maxScore: 20, percentage: 70, color: 'bg-blue-500' },
    { name: 'Communication', score: 13.5, maxScore: 20, percentage: 67.5, color: 'bg-blue-500' },
    { name: 'English', score: 11, maxScore: 20, percentage: 55, color: 'bg-yellow-500' }
  ];

  // Données des notes détaillées
  const grades: Grade[] = [
    {
      subject: 'Digital marketing',
      type: 'Exam',
      grade: 16.5,
      coefficient: 3,
      classAverage: 14.2,
      date: '15/01/2026',
      appreciation: 'Excellent work, very good command of the subject',
      color: 'text-green-600'
    },
    {
      subject: 'Business negotiation',
      type: 'Oral',
      grade: 15,
      coefficient: 4,
      classAverage: 13.5,
      date: '10/01/2026',
      appreciation: 'Good argument',
      color: 'text-green-600'
    },
    {
      subject: 'Customer relations',
      type: 'CC',
      grade: 14,
      coefficient: 2,
      classAverage: 14.8,
      date: '08/01/2026',
      appreciation: 'Good level, keep it up!',
      color: 'text-blue-600'
    },
    {
      subject: 'General knowledge',
      type: 'Writing',
      grade: 13.5,
      coefficient: 2,
      classAverage: 12.9,
      date: '18/12/2025',
      appreciation: 'Relevant analysis',
      color: 'text-blue-600'
    },
    {
      subject: 'Professional English',
      type: 'Exam',
      grade: 11,
      coefficient: 2,
      classAverage: 12.3,
      date: '12/12/2025',
      appreciation: 'To improve, work on your speaking skills.',
      color: 'text-yellow-600'
    }
  ];

  const displayedGrades = remoteGrades.length > 0 ? remoteGrades : grades;

  // Données de l'évolution des notes
  const monthlyEvolution = [
    { month: 'Sep', value: 65, label: 'Sep' },
    { month: 'Oct', value: 70, label: 'Oct' },
    { month: 'Nov', value: 68, label: 'Nov' },
    { month: 'Dec', value: 72, label: 'Dec' },
    { month: 'Jan', value: 71, label: 'Jan', isCurrent: true }
  ];

  const subjects = [
    'All materials',
    'Business negotiation',
    'Digital marketing',
    'Customer relations',
    'English'
  ];

  // Fonction pour simuler la moyenne
  const simulateAverage = () => {
    const weighted = displayedGrades.reduce((acc, g) => acc + (g.grade * g.coefficient), 0);
    const totalCoef = displayedGrades.reduce((acc, g) => acc + g.coefficient, 0);
    const avg = totalCoef > 0 ? (weighted / totalCoef).toFixed(2) : '0.00';
    alert(`Current weighted average: ${avg}/20`);
  };

  // Fonction pour télécharger le bulletin
  const downloadReport = () => {
    const header = 'Subject,Type,Grade,Coefficient,ClassAverage,Date,Appreciation';
    const rows = displayedGrades.map((g) =>
      [
        g.subject,
        g.type,
        g.grade,
        g.coefficient,
        g.classAverage,
        g.date,
        `"${String(g.appreciation || '').replace(/"/g, '""')}"`
      ].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student-newsletter.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <StudentNavbar />
      
      {/* Header avec moyenne et actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-2xl text-center text-white">
            <div className="text-4xl font-bold mb-1">14.2</div>
            <div className="text-sm opacity-90">Overall average</div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-2">My results</h2>
            <p className="text-gray-600 mb-4">Semester 1 - 2025/2026</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                ↑ +0.8 vs S1
              </span>
              <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                Rank: 5/28
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={simulateAverage}
            className="px-5 py-3 border border-gray-300 bg-white rounded-xl font-medium flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <Calculator size={18} />
            Simulate my average
          </button>
          <button
            onClick={downloadReport}
            className="px-5 py-3 bg-blue-500 text-white rounded-xl font-medium flex items-center gap-3 hover:bg-blue-600 transition-colors"
          >
            <Download size={18} />
            Download the newsletter
          </button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
            <div className={`text-3xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className={`text-xs ${stat.color.replace('text-', 'text-').replace('-600', '-500')} font-medium`}>
              {stat.subLabel}
            </div>
          </div>
        ))}
      </div>

      {/* Graphique d'évolution + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Évolution des notes */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold">Evolution of your results</h3>
            </div>
            <button
              onClick={() => setShowEvolution(!showEvolution)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {showEvolution ? 'Hide details' : 'Show details'}
            </button>
          </div>

          {showEvolution && (
            <>
              <div className="relative h-48 flex items-end gap-3 pb-8">
                {/* Lignes de référence */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gray-200"></div>
                <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-200"></div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-green-300 border-dashed"></div>
                <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-200"></div>
                
                {/* Étiquettes des valeurs */}
                <div className="absolute left-0 top-0 text-xs text-gray-500">20</div>
                <div className="absolute left-0 top-1/4 text-xs text-gray-500">15</div>
                <div className="absolute left-0 top-1/2 text-xs text-green-600 font-medium">10</div>
                <div className="absolute left-0 top-3/4 text-xs text-gray-500">5</div>
                <div className="absolute left-0 bottom-8 text-xs text-gray-500">0</div>
                
                {/* Barres */}
                {monthlyEvolution.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className={`w-3/4 max-w-12 rounded-t-lg transition-all duration-500 ${
                        item.isCurrent 
                          ? 'bg-gradient-to-t from-green-500 to-green-400 shadow-lg shadow-green-200' 
                          : 'bg-gradient-to-t from-blue-500 to-blue-400'
                      }`}
                      style={{ height: `${item.value}%` }}
                    ></div>
                    <span className={`text-sm ${item.isCurrent ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 text-sm text-gray-600">
                <span>Average class: 13.8</span>
                <span className="text-green-600 font-semibold flex items-center gap-1">
                  <TrendingUp size={16} />
                  Trend: ↑ Progress
                </span>
              </div>
            </>
          )}
        </div>

        {/* Radar des compétences */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Activity size={20} className="text-purple-600" />
            📊 Skills
          </h3>
          
          <div className="space-y-5">
            {skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className={`text-sm font-semibold ${
                    skill.score >= 15 ? 'text-green-600' : 
                    skill.score >= 12 ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {skill.score}/{skill.maxScore}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${skill.color}`}
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Excellent (≥15)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Good (12-14)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>To improve (12)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau détaillé des notes */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Trophy size={20} className="text-blue-600" />
            📝 Detailed ratings
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter size={16} />
              <span>Filter:</span>
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject.toLowerCase().replace(' ', '-')}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Matter</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Kind</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600">Note</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600">Coef.</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600">Average class</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Appreciation</th>
              </tr>
            </thead>
            <tbody>
              {displayedGrades.map((grade, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4">
                    <span className="font-medium">{grade.subject}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      grade.type === 'Exam' ? 'bg-red-100 text-red-800' :
                      grade.type === 'Oral' ? 'bg-blue-100 text-blue-800' :
                      grade.type === 'CC' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {grade.type}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xl font-bold ${grade.color}`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="p-4 text-center font-semibold">
                    {grade.coefficient}
                  </td>
                  <td className="p-4 text-center text-gray-600">
                    {grade.classAverage}
                  </td>
                  <td className="p-4 text-gray-600">
                    {grade.date}
                  </td>
                  <td className="p-4">
                    <span className={`${
                      grade.grade >= 15 ? 'text-green-600' : 
                      grade.grade >= 12 ? 'text-blue-600' : 'text-yellow-600'
                    }`}>
                      {grade.appreciation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Résumé du tableau */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <div className="text-gray-600">
              Showing <span className="font-semibold">{displayedGrades.length}</span> of {displayedGrades.length} evaluations
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-gray-600">Excellent (≥15)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span className="text-gray-600">Good (12-14)</span>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              <Eye size={16} />
              View all details
            </button>
          </div>
        </div>
      </div>

      {/* Section conseils */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
          <h4 className="font-semibold text-blue-800 mb-3">🎯 Areas for improvement</h4>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>English: Focus on oral comprehension</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>General knowledge: Regular reading</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Keep your strengths in marketing</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
          <h4 className="font-semibold text-green-800 mb-3">📈 Next objectives</h4>
          <ul className="space-y-2 text-green-700">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Reach 15.0 average in S2</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Improve English by 2 points</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Validate 3 more skills</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentNotes;
