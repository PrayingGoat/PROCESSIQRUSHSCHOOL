import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, Clock, Calendar, 
  FileText, Download, Upload, AlertTriangle,
  TrendingUp, Target
} from 'lucide-react';
import StudentNavbar from '../../components/StudentNavbar';

interface AttendanceRecord {
  id: number;
  date: string;
  type: 'absence' | 'delay' | 'present';
  course: string;
  duration: string;
  reason: string;
  status: 'pending' | 'justified' | 'unjustified';
  color: string;
  bgColor: string;
}

const StudentAttendance: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('this-month');
  const [showJustificationModal, setShowJustificationModal] = useState<boolean>(false);

  // Données des statistiques
  const stats = [
    {
      title: 'Presences',
      value: '47',
      subtitle: 'Out of 50 scheduled courses',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: <CheckCircle size={24} />,
      percentage: '94%'
    },
    {
      title: 'Absences',
      value: '3',
      subtitle: '1. Not justified',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: <XCircle size={24} />,
      percentage: '6%'
    },
    {
      title: 'Delays',
      value: '2',
      subtitle: '35 minutes total',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: <Clock size={24} />,
      percentage: '4%'
    },
    {
      title: 'Hours worked',
      value: '420h',
      subtitle: 'Out of 1680 hours planned',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: <Calendar size={24} />,
      percentage: '25%'
    }
  ];

  // Historique des absences/retards
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: 1,
      date: '20/01/2026',
      type: 'absence',
      course: 'Digital marketing',
      duration: '3:00',
      reason: '-',
      status: 'pending',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 2,
      date: '15/01/2026',
      type: 'delay',
      course: 'Business negotiation',
      duration: '20 min',
      reason: 'Transportation',
      status: 'justified',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 3,
      date: '08/01/2026',
      type: 'absence',
      course: 'Professional English',
      duration: '2:00',
      reason: 'Disease',
      status: 'justified',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 4,
      date: '18/12/2025',
      type: 'delay',
      course: 'General knowledge',
      duration: '15 min',
      reason: 'Staff',
      status: 'justified',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 5,
      date: '02/12/2025',
      type: 'absence',
      course: 'CRM - Customer Relationship',
      duration: '3:00',
      reason: 'medical appointment',
      status: 'justified',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  // Périodes de filtre
  const periods = [
    { id: 'this-month', label: 'This month' },
    { id: 'this-semester', label: 'This semester' },
    { id: 'this-year', label: 'This year' }
  ];

  // Fonctions
  const downloadCertificate = () => {
    console.log('Downloading attendance certificate...');
    // Logique de téléchargement
  };

  const handleJustify = (id: number) => {
    console.log('Justifying absence:', id);
    setShowJustificationModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            ⏳ Pending
          </span>
        );
      case 'justified':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            ✓ Justified
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'absence':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Absence
          </span>
        );
      case 'delay':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            Delay
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <StudentNavbar />
      
      {/* Header avec jauge principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Jauge circulaire */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <div className="relative w-64 h-64 mx-auto mb-6">
            {/* Jauge SVG */}
            <svg className="w-full h-full" viewBox="0 0 36 36">
              {/* Cercle de fond */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              {/* Cercle de progression */}
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeDasharray="94, 100"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Texte au centre */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-green-600">94%</div>
              <div className="text-gray-600 mt-2">Presence</div>
            </div>
          </div>
          
          <div className="flex justify-center gap-3">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-2">
              <Target size={16} />
              Target: 90% ✓
            </span>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold flex items-center gap-2">
              <TrendingUp size={16} />
              ↑ +4% vs target
            </span>
          </div>
        </div>

        {/* Stats détaillées */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                <div>
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </div>
              </div>
              <div className={`text-sm ${stat.color} font-medium`}>
                {stat.subtitle}
              </div>
              {stat.percentage && (
                <div className="mt-3 text-xs text-gray-500">
                  {stat.percentage} of total
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-500 rounded-xl flex items-center justify-center">
              <FileText size={28} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-yellow-900 text-lg mb-1">
                1 supporting document pending
              </h3>
              <p className="text-yellow-700 text-sm">
                Absence from 01/20/2026 • Deadline: 01/27
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowJustificationModal(true)}
            className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold flex items-center gap-3 hover:bg-yellow-600 transition-colors"
          >
            <Upload size={20} />
            Send proof of purchase
          </button>
        </div>
      </div>

      {/* Historique */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* En-tête du tableau */}
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">📋 History of absences and tardiness</h3>
              <p className="text-sm text-gray-600">Detailed view of your attendance record</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={downloadCertificate}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-blue-600 transition-colors"
            >
              <Download size={16} />
              📄 Certificate of Attendance
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Kind</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Course concerned</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Duration</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Pattern</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr 
                  key={record.id} 
                  className={`border-b border-gray-200 hover:bg-gray-50 ${
                    record.status === 'pending' ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="p-4 font-medium">{record.date}</td>
                  <td className="p-4">
                    {getTypeBadge(record.type)}
                  </td>
                  <td className="p-4 font-medium">{record.course}</td>
                  <td className="p-4">{record.duration}</td>
                  <td className="p-4 text-gray-600">
                    {record.reason === '-' ? (
                      <span className="text-gray-400">-</span>
                    ) : (
                      record.reason
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="p-4 text-center">
                    {record.status === 'pending' ? (
                      <button
                        onClick={() => handleJustify(record.id)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                      >
                        Justify
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Résumé */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-gray-600">
              Showing <span className="font-semibold">{attendanceRecords.length}</span> records
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600">Justified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-600">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600">Unjustified</span>
              </div>
            </div>
            
            <div className="text-blue-600 font-medium flex items-center gap-2">
              <AlertTriangle size={16} />
              Warning: 1 absence to justify before 01/27
            </div>
          </div>
        </div>
      </div>

      {/* Légende et informations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
          <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
            <CheckCircle size={20} />
            Good practices
          </h4>
          <ul className="space-y-3 text-green-700">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
              <span>Always justify absences within 7 days</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
              <span>Notify your tutor in case of absence</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
              <span>Keep medical certificates for 1 year</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
          <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            Important information
          </h4>
          <ul className="space-y-3 text-blue-700">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <span>Minimum attendance required: 90%</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <span>More than 3 unjustified absences: educational meeting</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <span>Company hours are also monitored</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Modal de justification */}
      {showJustificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Justify an absence</h3>
              <button
                onClick={() => setShowJustificationModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of absence
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue="2026-01-20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="medical">Medical appointment</option>
                  <option value="transport">Transportation issue</option>
                  <option value="family">Family emergency</option>
                  <option value="other">Other reason</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting document
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <p className="text-sm text-gray-600">
                    Drag and drop your file or click to browse
                  </p>
                  <input type="file" className="hidden" id="file-upload" />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowJustificationModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Justification submitted');
                    setShowJustificationModal(false);
                  }}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Send justification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;