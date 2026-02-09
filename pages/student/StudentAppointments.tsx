import React, { useState } from 'react';
import { 
  Calendar, Clock, Users, MapPin, Plus, 
  Edit, ExternalLink, FileText, CheckCircle,
  ChevronRight, Search
} from 'lucide-react';
import StudentNavbar from '../../components/StudentNavbar';

interface Appointment {
  id: number;
  title: string;
  description: string;
  type: 'educational' | 'company' | 'orientation' | 'other';
  date: string;
  time: string;
  duration: string;
  person: string;
  location: string;
  status: 'upcoming' | 'completed';
  daysUntil: string;
  color: string;
  bgColor: string;
  gradient: string;
}

interface AppointmentType {
  id: string;
  label: string;
  icon: string;
  description: string;
}

interface TimeSlot {
  id: number;
  date: string;
  time: string;
  available: boolean;
}

const StudentAppointments: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('educational');
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>('dubois');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [reason, setReason] = useState<string>('');
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Données des RDV à venir
  const upcomingAppointments: Appointment[] = [
    {
      id: 1,
      title: 'Pedagogical point',
      description: 'Tracking your progress',
      type: 'educational',
      date: 'Thursday, January 30th',
      time: '2:00 PM - 2:30 PM',
      duration: '30 min',
      person: 'Mrs. Dubois',
      location: 'Office 105',
      status: 'upcoming',
      daysUntil: 'In 4 days',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      gradient: 'from-blue-50 to-blue-100'
    },
    {
      id: 2,
      title: 'Company visit',
      description: 'Meeting with your tutor',
      type: 'company',
      date: 'Monday, February 10th',
      time: '10:00 - 11:00',
      duration: '1 hour',
      person: 'Mrs. Dubois + Mr. Dupont',
      location: 'Carrefour Clichy',
      status: 'upcoming',
      daysUntil: 'In 15 days',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      gradient: 'from-green-50 to-green-100'
    }
  ];

  // Historique des RDV
  const pastAppointments: Appointment[] = [
    {
      id: 3,
      title: 'Pedagogical point',
      description: 'Follow-up meeting',
      type: 'educational',
      date: '15/12/2025',
      time: '2:00 PM',
      duration: '30 min',
      person: 'Ms. Dubois',
      location: 'Office 105',
      status: 'completed',
      daysUntil: 'Completed',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      gradient: 'from-gray-50 to-gray-100'
    },
    {
      id: 4,
      title: 'Back-to-school interview',
      description: 'Start of year assessment',
      type: 'educational',
      date: '05/09/2025',
      time: '10:00 AM',
      duration: '45 min',
      person: 'Mr. Lambert',
      location: 'Meeting room',
      status: 'completed',
      daysUntil: 'Completed',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      gradient: 'from-gray-50 to-gray-100'
    }
  ];

  // Types de RDV
  const appointmentTypes: AppointmentType[] = [
    { id: 'educational', label: 'Pedagogical point', icon: '📚', description: 'Educational follow-up' },
    { id: 'company', label: 'Work-study monitoring', icon: '🏢', description: 'Company supervision' },
    { id: 'orientation', label: 'Guidance counseling', icon: '🎯', description: 'Professional guidance' },
    { id: 'other', label: 'Another request', icon: '💬', description: 'Other subject' }
  ];

  // Conseillers disponibles
  const advisors = [
    { id: 'dubois', name: 'Ms. Dubois - Educational Coordinator' },
    { id: 'lambert', name: 'Mr. Lambert - Training Manager' },
    { id: 'garcia', name: 'Ms. Garcia - Employment Advisor' },
    { id: 'martin', name: 'Mr. Martin - Management' }
  ];

  // Créneaux disponibles
  const timeSlots: TimeSlot[] = [
    { id: 1, date: 'Wednesday, January 29th', time: '11:00 - 11:30', available: true },
    { id: 2, date: 'Friday, January 31st', time: '2:00 PM - 2:30 PM', available: true },
    { id: 3, date: 'Monday, February 3rd', time: '4:00 PM - 4:30 PM', available: true }
  ];

  // Fonctions
  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const confirmAppointment = () => {
    if (!selectedSlot) {
      alert('Please select a time slot');
      return;
    }
    console.log('Appointment confirmed:', {
      type: selectedType,
      advisor: selectedAdvisor,
      slot: selectedSlot,
      reason
    });
    // Logique de confirmation
  };

  const downloadReport = (id: number) => {
    console.log('Downloading report for appointment:', id);
    // Logique de téléchargement
  };

  return (
    <div className="p-6 space-y-6">
      <StudentNavbar />
      
      {/* Grid principale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mes RDV à venir */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">My upcoming appointments</h3>
                <p className="text-sm text-gray-600">Manage your scheduled meetings</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold">
              {upcomingAppointments.length}
            </span>
          </div>

          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div 
                key={appointment.id}
                className={`bg-gradient-to-br ${appointment.gradient} rounded-xl p-5 border-l-4 ${appointment.color.replace('text-', 'border-')}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{appointment.title}</h4>
                    <p className="text-sm text-gray-600">{appointment.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-white bg-opacity-90 text-sm font-semibold rounded-full">
                    {appointment.daysUntil}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className={appointment.color} />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className={appointment.color} />
                    <span>{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className={appointment.color} />
                    <span>{appointment.person}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className={appointment.color} />
                    <span>{appointment.location}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    <Edit size={16} className="inline mr-2" />
                    To modify
                  </button>
                  <button className="flex-1 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                    <ExternalLink size={16} />
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Remarque pour RDV 2 */}
          {upcomingAppointments[1] && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-700 text-sm flex items-center gap-2">
                <span className="text-lg">📝</span>
                Remember to prepare your summary of completed missions
              </p>
            </div>
          )}

          {/* Historique des RDV */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-600">Historical</h4>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                {showHistory ? 'Hide' : 'Show'} history
                <ChevronRight size={16} className={`transition-transform ${showHistory ? 'rotate-90' : ''}`} />
              </button>
            </div>

            {showHistory && (
              <div className="space-y-3">
                {pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{appointment.title}</h5>
                        <p className="text-sm text-gray-600">
                          {appointment.date} • {appointment.person}
                        </p>
                      </div>
                      <button
                        onClick={() => downloadReport(appointment.id)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                      >
                        See CR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prendre un RDV */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Plus size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Schedule a new appointment</h3>
              <p className="text-sm text-gray-600">Book a meeting with your advisors</p>
            </div>
          </div>

          {/* Type de RDV */}
          <div className="mb-6">
            <label className="block font-medium mb-3 text-gray-700">Type of appointment</label>
            <div className="grid grid-cols-2 gap-3">
              {appointmentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium text-sm mb-1">{type.label}</div>
                  <div className="text-xs text-gray-500">{type.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Conseiller */}
          <div className="mb-6">
            <label className="block font-medium mb-3 text-gray-700">With whom?</label>
            <select
              value={selectedAdvisor}
              onChange={(e) => setSelectedAdvisor(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {advisors.map((advisor) => (
                <option key={advisor.id} value={advisor.id}>
                  {advisor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Motif */}
          <div className="mb-6">
            <label className="block font-medium mb-3 text-gray-700">
              Pattern <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe the purpose of your request..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
            />
          </div>

          {/* Créneaux disponibles */}
          <div className="mb-6">
            <label className="block font-medium mb-3 text-gray-700">Available time slots this week</label>
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot.id)}
                  className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-200 flex items-center justify-between ${
                    selectedSlot === slot.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedSlot === slot.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <Calendar size={18} className={selectedSlot === slot.id ? 'text-blue-600' : 'text-gray-500'} />
                    </div>
                    <div>
                      <div className="font-medium">{slot.date}</div>
                      <div className="text-sm text-gray-600">{slot.time}</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
                    Available
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={confirmAppointment}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <CheckCircle size={20} />
            Confirm the appointment
          </button>

          {/* Informations supplémentaires */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <Search size={16} />
              <span className="font-medium">Need another time?</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Send a request to your advisor for a custom appointment.
            </p>
            <button className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors">
              + Request custom time slot
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques et informations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-blue-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-800">30 min</div>
              <div className="text-sm text-blue-700">Average appointment duration</div>
            </div>
          </div>
          <p className="text-sm text-blue-600">
            Plan accordingly for your meetings
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-green-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-800">24h</div>
              <div className="text-sm text-green-700">Minimum notice for cancellation</div>
            </div>
          </div>
          <p className="text-sm text-green-600">
            Cancel or modify at least 24 hours in advance
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-200 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-purple-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-800">4</div>
              <div className="text-sm text-purple-700">Available advisors</div>
            </div>
          </div>
          <p className="text-sm text-purple-600">
            Choose the most relevant person for your needs
          </p>
        </div>
      </div>

      {/* Modal de confirmation (optionnel) */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm your appointment</h3>
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="font-medium mb-2">
                  {appointmentTypes.find(t => t.id === selectedType)?.label}
                </div>
                <div className="text-sm text-gray-600">
                  With: {advisors.find(a => a.id === selectedAdvisor)?.name}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Time: {timeSlots.find(s => s.id === selectedSlot)?.date} - {timeSlots.find(s => s.id === selectedSlot)?.time}
                </div>
              </div>
              {reason && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-sm font-medium text-blue-800 mb-1">Reason:</div>
                  <div className="text-sm text-blue-700">{reason}</div>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedSlot(null)}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAppointment}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAppointments;