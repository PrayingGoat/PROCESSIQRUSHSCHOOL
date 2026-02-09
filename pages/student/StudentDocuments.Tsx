import React, { useState } from 'react';
import { 
  FileText, Download, Eye, Upload, Plus, 
  Search, Clock, CheckCircle, AlertCircle,
  Folder, Calendar, Clock as ClockIcon, FileSignature
} from 'lucide-react';
import StudentNavbar from '../../components/StudentNavbar';

interface Document {
  id: number;
  title: string;
  description: string;
  category: 'all' | 'administrative' | 'educational' | 'company' | 'certificate';
  status: 'available' | 'pending' | 'signed' | 'in-progress';
  date: string;
  size?: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

interface DocumentCategory {
  id: string;
  label: string;
  icon: string;
  count: number;
}

const StudentDocuments: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Catégories de documents
  const categories: DocumentCategory[] = [
    { id: 'all', label: '📁 All', icon: '📁', count: 12 },
    { id: 'administrative', label: '📋 Administrative staff', icon: '📋', count: 4 },
    { id: 'educational', label: '📚 Educational', icon: '📚', count: 5 },
    { id: 'company', label: '🏢 Company', icon: '🏢', count: 2 },
    { id: 'certificate', label: '🎓 Certificates', icon: '🎓', count: 3 }
  ];

  // Documents
  const documents: Document[] = [
    {
      id: 1,
      title: 'School certificate',
      description: 'Year 2025-2026',
      category: 'certificate',
      status: 'available',
      date: '15/01/2026',
      size: '245 KB',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: <FileText size={28} className="text-green-600" />
    },
    {
      id: 2,
      title: 'Apprenticeship contract',
      description: 'Signed on 01/09/2025',
      category: 'administrative',
      status: 'signed',
      date: '01/09/2025',
      size: '1.2 MB',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: <FileSignature size={28} className="text-blue-600" />
    },
    {
      id: 3,
      title: 'Training agreement',
      description: 'Tripartite Rush School',
      category: 'administrative',
      status: 'available',
      date: '05/09/2025',
      size: '890 KB',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      icon: <FileText size={28} className="text-purple-600" />
    },
    {
      id: 4,
      title: 'Grade report card S1',
      description: 'Semester 1 - 2025/2026',
      category: 'educational',
      status: 'in-progress',
      date: 'Available from 15/02/2026',
      size: 'Pending',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: <FileText size={28} className="text-red-600" />
    },
    {
      id: 5,
      title: 'Time sheet',
      description: 'January 2026',
      category: 'company',
      status: 'available',
      date: '31/01/2026',
      size: '180 KB',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: <ClockIcon size={28} className="text-yellow-600" />
    },
    {
      id: 6,
      title: 'Annual Planning',
      description: 'Alternating calendar',
      category: 'educational',
      status: 'available',
      date: '01/09/2025',
      size: '320 KB',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: <Calendar size={28} className="text-blue-600" />
    }
  ];

  // Filtrer les documents par catégorie et recherche
  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Fonctions
  const handleDownload = (id: number) => {
    console.log('Downloading document:', id);
    // Logique de téléchargement
  };

  const handlePreview = (id: number) => {
    console.log('Previewing document:', id);
    // Logique de prévisualisation
  };

  const handleUpload = () => {
    console.log('Opening file upload...');
    // Logique d'upload
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
            Available
          </span>
        );
      case 'signed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
            Signed ✓
          </span>
        );
      case 'in-progress':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
            In progress ⏳
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <StudentNavbar />
      
      {/* Header avec actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">My documents</h2>
          <p className="text-gray-600">Download your administrative and educational documents</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="px-5 py-3 bg-blue-500 text-white rounded-xl font-medium flex items-center gap-3 hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Request a document
        </button>
      </div>

      {/* Recherche et filtres */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="text-sm text-gray-600 flex items-center gap-2">
          <Folder size={16} />
          <span>{filteredDocuments.length} documents found</span>
        </div>
      </div>

      {/* Catégories de documents */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
              activeCategory === category.id
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
            <span className="ml-2 px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grille de documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredDocuments.map((doc) => (
          <div 
            key={doc.id}
            className={`bg-white border rounded-2xl p-5 hover:shadow-md transition-all duration-200 ${
              doc.status === 'in-progress' ? 'border-yellow-300' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`p-4 ${doc.bgColor} rounded-xl`}>
                {doc.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-lg mb-1 truncate">{doc.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} />
                  <span>{doc.date}</span>
                  {doc.size && <span>• {doc.size}</span>}
                </div>
              </div>
              {getStatusBadge(doc.status)}
            </div>

            {doc.status === 'in-progress' ? (
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800 flex items-center gap-2">
                  <AlertCircle size={16} />
                  📅 Available from 15/02/2026
                </p>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => handlePreview(doc.id)}
                  className="flex-1 py-2.5 bg-gray-50 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  Overview
                </button>
                <button
                  onClick={() => handleDownload(doc.id)}
                  className={`flex-1 py-2.5 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${
                    doc.category === 'certificate' ? 'bg-green-500' :
                    doc.category === 'administrative' ? 'bg-blue-500' :
                    doc.category === 'educational' ? 'bg-purple-500' :
                    doc.category === 'company' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Zone de dépôt */}
      <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload size={32} className="text-gray-400" />
        </div>
        <h4 className="text-xl font-semibold mb-2">Upload your documents here</h4>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          or click to browse your files
        </p>
        <button
          onClick={handleUpload}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors mb-3"
        >
          Select a file
        </button>
        <p className="text-sm text-gray-500">
          PDF, JPG, PNG • Max 10 MB
        </p>
      </div>

      {/* Documents récents */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock size={20} className="text-gray-600" />
          Recently accessed
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents
            .filter(doc => doc.status !== 'in-progress')
            .slice(0, 2)
            .map((doc) => (
              <div key={doc.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${doc.bgColor} rounded-lg`}>
                    {React.cloneElement(doc.icon as React.ReactElement, { size: 20 })}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium">{doc.title}</h5>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(doc.id)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                    title="Download again"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal de demande de document */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Request a document</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of document
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select a document type</option>
                  <option value="certificate">School certificate</option>
                  <option value="transcript">Transcript</option>
                  <option value="attendance">Attendance certificate</option>
                  <option value="other">Other document</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for request
                </label>
                <textarea
                  placeholder="Explain why you need this document..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency
                </label>
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                    Normal
                  </button>
                  <button className="flex-1 py-2.5 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50">
                    Urgent
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Document requested');
                    setShowRequestModal(false);
                  }}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Send request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Informations importantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <CheckCircle size={20} />
            Good to know
          </h4>
          <ul className="space-y-2 text-blue-700 text-sm">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <span>Documents are available for 12 months</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <span>School certificates are updated monthly</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <span>Contact administration for urgent requests</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-5">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <AlertCircle size={20} />
            Important information
          </h4>
          <ul className="space-y-2 text-green-700 text-sm">
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
              <span>Keep digital copies of all signed documents</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
              <span>Report card available 48h after publication</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
              <span>Upload receipts for reimbursement requests</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDocuments;