import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar, Download,
  Filter, Building, Users, FileText, BookOpen
} from 'lucide-react';
import StudentNavbar from '../../components/StudentNavbar';

interface Event {
  id: string;
  title: string;
  time: string;
  location: string;
  teacher: string;
  type: 'course' | 'company' | 'exam' | 'meeting';
  color: string;
  gradient: string;
}

interface Day {
  date: string;
  dayName: string;
  dayNumber: string;
  month: string;
}

const StudentPlanning: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(5);
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState('January');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showEventDetails, setShowEventDetails] = useState<string | null>(null);

  // Données des jours de la semaine
  const weekDays: Day[] = [
    { date: '2026-01-27', dayName: 'Mon.', dayNumber: '27', month: 'January' },
    { date: '2026-01-28', dayName: 'Tue.', dayNumber: '28', month: 'January' },
    { date: '2026-01-29', dayName: 'Wed.', dayNumber: '29', month: 'January' },
    { date: '2026-01-30', dayName: 'Thu.', dayNumber: '30', month: 'January' },
    { date: '2026-01-31', dayName: 'Fri.', dayNumber: '31', month: 'January' }
  ];

  // Filtres
  const filters = [
    { id: 'all', label: ' All', icon: '📅' },
    { id: 'course', label: ' Course', icon: '📘' },
    { id: 'company', label: 'Company', icon: '🏢' },
    { id: 'exam', label: 'Exams', icon: '📝' },
    { id: 'meeting', label: 'Meeting', icon: '👥' }
  ];

  // Événements du matin (9h-12h)
  const morningEvents: (Event | null)[][] = [
    [
      {
        id: 'monday-morning',
        title: 'Business negotiation',
        time: '9:00 AM - 12:00 PM',
        location: 'Room 201',
        teacher: 'Mr. Martin',
        type: 'course',
        color: 'blue',
        gradient: 'from-blue-500 to-blue-600'
      },
      null,
      null,
      null,
      null
    ],
    [
      null,
      {
        id: 'tuesday-morning',
        title: 'Professional English',
        time: '9:00 AM - 11:00 AM',
        location: 'Room 105',
        teacher: 'Mrs. Johnson',
        type: 'course',
        color: 'purple',
        gradient: 'from-purple-500 to-purple-600'
      },
      null,
      null,
      null
    ],
    [
      null,
      null,
      {
        id: 'wednesday-morning',
        title: 'Company',
        time: 'Full day',
        location: 'Carrefour Clichy',
        teacher: 'Mr. Dupont (tutor)',
        type: 'company',
        color: 'green',
        gradient: 'from-green-500 to-green-600'
      },
      null,
      null
    ],
    [
      null,
      null,
      null,
      {
        id: 'thursday-morning',
        title: 'Company',
        time: 'Full day',
        location: 'Carrefour Clichy',
        teacher: '',
        type: 'company',
        color: 'green',
        gradient: 'from-green-500 to-green-600'
      },
      null
    ],
    [
      null,
      null,
      null,
      null,
      {
        id: 'friday-morning',
        title: 'CRM - Customer Relationship',
        time: '9:00 AM - 12:00 PM',
        location: 'Room 302',
        teacher: 'Ms. Dubois',
        type: 'course',
        color: 'yellow',
        gradient: 'from-yellow-500 to-yellow-600'
      }
    ]
  ];

  // Événements de l'après-midi (14h-17h)
  const afternoonEvents: (Event | null)[][] = [
    [
      {
        id: 'monday-afternoon',
        title: 'Digital Marketing',
        time: '2:00 PM - 5:00 PM',
        location: 'Info Room 2',
        teacher: 'Mr. Bernard',
        type: 'course',
        color: 'pink',
        gradient: 'from-pink-500 to-pink-600'
      },
      null,
      null,
      null,
      null
    ],
    [
      null,
      {
        id: 'tuesday-afternoon',
        title: 'General knowledge',
        time: '2:00 PM - 4:00 PM',
        location: 'Amphitheater A',
        teacher: 'Mr. Leroy',
        type: 'course',
        color: 'indigo',
        gradient: 'from-indigo-500 to-indigo-600'
      },
      null,
      null,
      null
    ],
    [
      null,
      null,
      {
        id: 'wednesday-afternoon',
        title: 'In business',
        time: 'Full day',
        location: '',
        teacher: '',
        type: 'company',
        color: 'green',
        gradient: 'from-green-500 to-green-600'
      },
      null,
      null
    ],
    [
      null,
      null,
      null,
      {
        id: 'thursday-afternoon-1',
        title: 'Educational point',
        time: '2:00 PM - 2:30 PM',
        location: '',
        teacher: 'Mrs. Dubois',
        type: 'meeting',
        color: 'yellow',
        gradient: 'from-yellow-500 to-yellow-600'
      },
      null
    ],
    [
      null,
      null,
      null,
      null,
      {
        id: 'friday-afternoon',
        title: 'Professional Project',
        time: '2:00 PM - 5:00 PM',
        location: 'Room 201',
        teacher: 'Ms. Garcia',
        type: 'course',
        color: 'teal',
        gradient: 'from-teal-500 to-teal-600'
      }
    ]
  ];

  // Légende
  const legendItems = [
    { color: 'bg-gradient-to-r from-blue-500 to-blue-600', label: 'Theoretical courses' },
    { color: 'bg-gradient-to-r from-green-500 to-green-600', label: 'Business' },
    { color: 'bg-gradient-to-r from-red-500 to-red-600', label: 'Exams' },
    { color: 'bg-gradient-to-r from-yellow-500 to-yellow-600', label: 'Appointments / Events' }
  ];

  // Fonctions de navigation
  const navigateWeek = (direction: number) => {
    if (direction === -1) {
      setCurrentWeek(prev => prev - 1);
    } else {
      setCurrentWeek(prev => prev + 1);
    }
  };

  const handleExportICal = () => {
    // Logique d'export iCal
    console.log('Exporting iCal...');
    // Ici tu pourrais appeler une API ou générer un fichier
  };

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
  };

  const handleEventClick = (eventId: string) => {
    setShowEventDetails(eventId);
    // Tu peux aussi ouvrir un modal ici
  };

  return (
    <div className="space-y-6">
        <StudentNavbar />
      {/* Header planning avec actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateWeek(-1)}
            className="w-10 h-10 border border-gray-300 bg-white rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              Week of January 27, {currentYear}
            </h2>
            <span className="text-sm text-gray-600">
              Week {currentWeek} • {currentMonth} {currentYear}
            </span>
          </div>
          
          <button
            onClick={() => navigateWeek(1)}
            className="w-10 h-10 border border-gray-300 bg-white rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => console.log('Month view')}
            className="px-4 py-2 border border-gray-300 bg-white rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Calendar size={16} />
            Month
          </button>
          <button
            onClick={handleExportICal}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <Download size={16} />
            Export iCal
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
              ${activeFilter === filter.id || (activeFilter === 'all' && filter.id === 'all')
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {filter.icon} {filter.label}
          </button>
        ))}
      </div>

      {/* Planning grid */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header jours */}
        <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-200">
          <div className="p-4 font-semibold text-gray-500 text-center border-r border-gray-200">
            Hourly
          </div>
          {weekDays.map((day) => (
            <div key={day.date} className="p-4 text-center border-r border-gray-200 last:border-r-0">
              <div className={`font-bold ${day.dayName === 'Mon.' ? 'text-blue-600' : 'text-gray-900'}`}>
                {day.dayName} {day.dayNumber}
              </div>
              <div className="text-sm text-gray-500">{day.month}</div>
            </div>
          ))}
        </div>

        {/* Matin */}
        <div className="grid grid-cols-6 min-h-[160px] border-b border-gray-200">
          <div className="p-4 font-semibold text-gray-500 text-center border-r border-gray-200 flex flex-col justify-center">
            <div>9:00</div>
            <div className="text-sm">12:00</div>
          </div>
          
          {morningEvents.map((dayEvents, dayIndex) => (
            <div key={dayIndex} className="p-2 border-r border-gray-200 last:border-r-0">
              {dayEvents.map((event, eventIndex) => (
                event && (
                  <div
                    key={`${dayIndex}-${eventIndex}`}
                    onClick={() => handleEventClick(event.id)}
                    className={`bg-gradient-to-br ${event.gradient} text-white p-3 rounded-xl h-full cursor-pointer transition-transform hover:scale-[1.02]`}
                  >
                    <div className="font-semibold mb-1 text-sm md:text-base">{event.title}</div>
                    <div className="text-xs opacity-90">{event.time}</div>
                    {event.location && (
                      <div className="text-xs opacity-80 mt-2">📍 {event.location}</div>
                    )}
                    {event.teacher && (
                      <div className="text-xs opacity-80">👤 {event.teacher}</div>
                    )}
                  </div>
                )
              ))}
            </div>
          ))}
        </div>

        {/* Après-midi */}
        <div className="grid grid-cols-6 min-h-[160px]">
          <div className="p-4 font-semibold text-gray-500 text-center border-r border-gray-200 flex flex-col justify-center">
            <div>2:00 PM</div>
            <div className="text-sm">5:00 PM</div>
          </div>
          
          {afternoonEvents.map((dayEvents, dayIndex) => (
            <div key={dayIndex} className="p-2 border-r border-gray-200 last:border-r-0">
              {dayEvents.map((event, eventIndex) => (
                event && (
                  <div
                    key={`${dayIndex}-${eventIndex}`}
                    onClick={() => handleEventClick(event.id)}
                    className={`bg-gradient-to-br ${event.gradient} text-white p-3 rounded-xl mb-2 last:mb-0 cursor-pointer transition-transform hover:scale-[1.02]`}
                  >
                    <div className="font-semibold mb-1 text-sm">{event.title}</div>
                    <div className="text-xs opacity-90">{event.time}</div>
                    {event.location && (
                      <div className="text-xs opacity-80 mt-1">📍 {event.location}</div>
                    )}
                    {event.teacher && (
                      <div className="text-xs opacity-80">👤 {event.teacher}</div>
                    )}
                  </div>
                )
              ))}
              
              {/* Affichage spécial pour les journées en entreprise */}
              {dayIndex === 2 && (
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl opacity-70 flex items-center justify-center h-full">
                  <span className="font-medium">🏢 In business</span>
                </div>
              )}
              
              {dayIndex === 3 && (
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-xl opacity-70 text-center mt-2">
                  <span className="text-sm">🏢 Company</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div className="flex flex-wrap gap-6 mt-6">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${item.color}`}></div>
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Modal d'événement (optionnel) */}
      {showEventDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Event Details</h3>
              <button
                onClick={() => setShowEventDetails(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p>Details for event: {showEventDetails}</p>
              <button
                onClick={() => setShowEventDetails(null)}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes et informations supplémentaires */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={18} className="text-blue-600" />
            <h4 className="font-semibold text-blue-800">Course Summary</h4>
          </div>
          <p className="text-sm text-blue-700">
            This week: <strong>15 hours</strong> of courses, <strong>2 days</strong> in company
          </p>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building size={18} className="text-green-600" />
            <h4 className="font-semibold text-green-800">Company Information</h4>
          </div>
          <p className="text-sm text-green-700">
            Wednesday & Thursday: Work at Carrefour Clichy
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentPlanning;