import React from 'react';
import { 
  Check, FileText, AlertCircle, Bell, Calendar, 
  TrendingUp, BookOpen, Briefcase, Clock, Award,
  Upload, MessageSquare, Download, Edit, CheckCircle
} from 'lucide-react';
import StudentNavbar from '../../components/StudentNavbar';

const StudentDashboard: React.FC = () => {
  // Données des KPI
  const kpis = [
    {
      value: '94%',
      label: 'Attendance rate',
      trend: '+2% this month',
      color: 'success',
      icon: <Check size={24} />,
      gradient: 'from-green-100 to-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-l-green-500'
    },
    {
      value: '14.2',
      label: 'Overall average',
      trend: '+0.8 vs S1',
      color: 'primary',
      icon: <TrendingUp size={24} />,
      gradient: 'from-blue-100 to-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-l-blue-500'
    },
    {
      value: '3',
      label: 'Absences this month',
      trend: '1. Not justified',
      color: 'warning',
      icon: <AlertCircle size={24} />,
      gradient: 'from-yellow-100 to-yellow-50',
      textColor: 'text-yellow-600',
      borderColor: 'border-l-yellow-500'
    },
    {
      value: '2',
      label: 'Urgent actions',
      trend: 'To be processed',
      color: 'danger',
      icon: <Bell size={24} />,
      gradient: 'from-red-100 to-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-l-red-500'
    }
  ];

  // Progression vers le diplôme
  const progressData = [
    { value: '420h', label: 'School hours', color: 'bg-gradient-to-br from-blue-100 to-blue-200', textColor: 'text-blue-600' },
    { value: '680h', label: 'Company Hours', color: 'bg-gradient-to-br from-green-100 to-green-200', textColor: 'text-green-600' },
    { value: '18', label: 'Months remaining', color: 'bg-gradient-to-br from-yellow-100 to-yellow-200', textColor: 'text-yellow-600' },
    { value: '12/16', label: 'SKILLS', color: 'bg-gradient-to-br from-purple-100 to-purple-200', textColor: 'text-purple-600' },
    { value: '3/5', label: 'Tests validated', color: 'bg-gradient-to-br from-pink-100 to-pink-200', textColor: 'text-pink-600' }
  ];

  // Événements à venir
  const upcomingEvents = [
    {
      day: '27',
      month: 'Jan',
      title: 'Business negotiation',
      details: '9:00 a.m. - 12:00 p.m. • Room 201 • Mr. Martin',
      type: 'Course',
      color: 'bg-blue-50',
      borderColor: 'border-l-blue-500',
      badgeColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      day: '30',
      month: 'Jan',
      title: 'Pedagogical point',
      details: '2:00 PM - 2:30 PM • Office 105 • Ms. Dubois',
      type: 'Appointment',
      color: 'bg-yellow-50',
      borderColor: 'border-l-yellow-500',
      badgeColor: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      day: '05',
      month: 'Feb',
      title: 'Digital Marketing Exam',
      details: '9:00 AM - 11:00 AM • Room 301 • Coefficient 3',
      type: 'Exam',
      color: 'bg-red-50',
      borderColor: 'border-l-red-500',
      badgeColor: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      day: '10',
      month: 'Feb',
      title: 'Company tutor visit',
      details: '10:00 AM • Carrefour Clichy • Ms. Dubois',
      type: 'Visit',
      color: 'bg-green-50',
      borderColor: 'border-l-green-500',
      badgeColor: 'bg-green-500',
      textColor: 'text-green-600'
    }
  ];

  // Actions urgentes
  const urgentActions = [
    {
      icon: <FileText size={22} />,
      title: 'Missing proof of absence',
      subtitle: 'Absence on 20/01/2026',
      deadline: 'Deadline: 27/01/2026',
      color: 'bg-yellow-500',
      gradient: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-700'
    },
    {
      icon: <CheckCircle size={22} />,
      title: 'Satisfaction questionnaire',
      subtitle: 'Semester 1 Assessment',
      duration: 'Estimated duration: 5 min',
      color: 'bg-blue-500',
      gradient: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700'
    }
  ];

  // Notifications
  const notifications = [
    {
      icon: <Download size={16} />,
      title: 'New document available',
      subtitle: 'School certificate ready to download',
      time: '2 hours ago',
      borderColor: 'border-l-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: <Edit size={16} />,
      title: 'Note added',
      subtitle: 'Digital marketing: 15/20',
      time: 'Yesterday at 4:30 PM',
      borderColor: 'border-l-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: <Calendar size={16} />,
      title: 'Appointment reminder',
      subtitle: 'Educational update in 4 days',
      time: '2 days ago',
      borderColor: 'border-l-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: <Award size={16} />,
      title: 'Skill validated',
      subtitle: 'C4 - Organize and host an event ✓',
      time: '3 days ago',
      borderColor: 'border-l-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  // Calendrier
  const calendarDays = [
    ['29', '30', '31', '1', '2', '3', '4'],
    ['5', '6', '7', '8', '9', '10', '11'],
    ['12', '13', '14', '15', '16', '17', '18'],
    ['19', '20', '21', '22', '23', '24', '25'],
    ['26', '27', '28', '29', '30', '31', '1']
  ];

  const dayColors: Record<string, string> = {
    '5': 'bg-blue-100 text-blue-600',
    '6': 'bg-blue-100 text-blue-600',
    '12': 'bg-blue-100 text-blue-600',
    '13': 'bg-blue-100 text-blue-600',
    '19': 'bg-blue-100 text-blue-600',
    '20': 'bg-red-100 text-red-600',
    '26': 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
    '27': 'bg-blue-100 text-blue-600',
    '28': 'bg-blue-100 text-blue-600',
    '30': 'bg-yellow-100 text-yellow-600'
  };

  return (
    <div className="p-6 space-y-6">
        <StudentNavbar />
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div 
            key={index}
            className={`bg-white rounded-2xl border border-gray-200 p-5 ${kpi.gradient} ${kpi.borderColor} border-l-4`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${kpi.textColor} bg-opacity-20`}>
                {kpi.icon}
              </div>
              <div className="flex-1">
                <div className={`text-2xl font-bold ${kpi.textColor}`}>
                  {kpi.value}
                </div>
                <div className="text-sm text-gray-600">{kpi.label}</div>
              </div>
            </div>
            <div className={`text-xs ${kpi.textColor} font-medium mt-2`}>
              ↑ {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Progression vers le diplôme */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold">
              Progression towards the BTS NDRC diploma
            </h3>
          </div>
          <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full text-sm font-semibold">
            On the right track 🎯
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {progressData.map((item, index) => (
            <div key={index} className={`${item.color} rounded-xl p-4 text-center`}>
              <div className={`text-2xl font-bold ${item.textColor}`}>{item.value}</div>
              <div className="text-xs text-gray-600 mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="relative bg-gray-200 rounded-xl h-7 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-xl flex items-center justify-center transition-all duration-500"
            style={{ width: '25%' }}
          >
            <span className="text-white text-sm font-bold">25%</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 mt-3">
          <span>📅 Start date: 01/09/2025</span>
          <span>🎓 Expected end date: 30/06/2027</span>
        </div>
      </div>

      {/* Grille principale: Événements + Calendrier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prochains événements */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar size={18} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold">Upcoming events</h3>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index}
                className={`${event.color} ${event.borderColor} border-l-4 rounded-xl p-4 flex items-center gap-4`}
              >
                <div className="min-w-[50px] text-center">
                  <div className={`text-xl font-bold ${event.textColor}`}>{event.day}</div>
                  <div className={`text-xs ${event.textColor} uppercase`}>{event.month}</div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-sm text-gray-600">{event.details}</div>
                </div>
                <span className={`${event.badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mini calendrier */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">📅 January 2026</h3>
            <div className="flex gap-2">
              <button className="w-7 h-7 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                &lt;
              </button>
              <button className="w-7 h-7 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50">
                &gt;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-6">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
              <div key={index} className="py-2 text-gray-500 font-semibold">{day}</div>
            ))}
            
            {calendarDays.flat().map((day, index) => (
              <div 
                key={index}
                className={`py-2 rounded ${dayColors[day] || (parseInt(day) <= 4 ? 'text-gray-300' : '')}`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded"></div>
              <span>Course</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded"></div>
              <span>Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded"></div>
              <span>Appointment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded"></div>
              <span>Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions urgentes + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions urgentes */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <AlertCircle size={18} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold">Urgent actions</h3>
            </div>
            <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">2</span>
          </div>

          <div className="space-y-4">
            {urgentActions.map((action, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${action.gradient} border ${action.borderColor} rounded-xl p-4`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 ${action.color} rounded-xl flex items-center justify-center`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${action.textColor}`}>{action.title}</div>
                    <div className={`text-sm ${action.textColor}`}>{action.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${action.textColor}`}>
                    ⏰ {action.deadline || action.duration}
                  </span>
                  <button className={`px-4 py-2 ${action.color} text-white rounded-lg font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity`}>
                    {index === 0 ? (
                      <>
                        <Upload size={16} />
                        Send
                      </>
                    ) : (
                      'Answer'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Bell size={18} className="text-green-500" />
            </div>
            <h3 className="text-lg font-semibold">Recent notifications</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {notifications.map((notification, index) => (
              <div 
                key={index}
                className={`${notification.bgColor} ${notification.borderColor} border-l-4 rounded-xl p-3 flex items-start gap-3`}
              >
                <div className={`w-9 h-9 ${notification.bgColor} rounded-lg flex items-center justify-center`}>
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-xs text-gray-600">{notification.subtitle}</div>
                  <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Météo alternance */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-7 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-3">
              ☀️ Weather forecast for your apprenticeship
            </h3>
            <p className="opacity-90 mb-6 text-lg">
              Your journey is going very well! Keep it up.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white bg-opacity-15 px-5 py-3 rounded-xl">
                <div className="text-sm opacity-80 mb-1">Attendance</div>
                <div className="text-lg font-bold">Excellent</div>
              </div>
              <div className="bg-white bg-opacity-15 px-5 py-3 rounded-xl">
                <div className="text-sm opacity-80 mb-1">Results</div>
                <div className="text-lg font-bold">Alright</div>
              </div>
              <div className="bg-white bg-opacity-15 px-5 py-3 rounded-xl">
                <div className="text-sm opacity-80 mb-1">Business</div>
                <div className="text-lg font-bold">Satisfied</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-5">
            <div className="bg-white bg-opacity-10 p-5 rounded-2xl text-center min-w-[120px]">
              <div className="text-4xl mb-2">😊</div>
              <div className="text-sm font-semibold">School</div>
              <div className="text-xs opacity-80 mt-1">14.2/20</div>
            </div>
            <div className="bg-white bg-opacity-10 p-5 rounded-2xl text-center min-w-[120px]">
              <div className="text-4xl mb-2">🤩</div>
              <div className="text-sm font-semibold">Business</div>
              <div className="text-xs opacity-80 mt-1">Very satisfied</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;