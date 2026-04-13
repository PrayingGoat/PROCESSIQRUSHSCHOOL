import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle, Award, Bell, BookOpen, Briefcase, Calendar,
  Check, CheckCircle, Clock, Download, Edit, FileText,
  TrendingUp, Upload, GraduationCap, BarChart3, Users
} from 'lucide-react';
import { api } from '../../services/api';

type EventType = 'course' | 'company' | 'exam' | 'meeting';

const formationLabel = (value?: string): string => {
  const map: Record<string, string> = {
    bts_mco: 'BTS MCO',
    bts_ndrc: 'BTS NDRC',
    bachelor_rdc: 'BACHELOR RDC',
    tp_ntc: 'TP NTC'
  };
  return map[value || ''] || '';
};

const hoursBetween = (start?: Date, end?: Date, allDay?: boolean): number => {
  if (allDay) return 7;
  if (!start || !end) return 0;
  return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
};

const StudentDashboard: React.FC = () => {
  const [student, setStudent] = useState<any | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const currentStudent = await api.getCurrentStudent();
        setStudent(currentStudent);
        const studentId = currentStudent?._id || currentStudent?.id;
        const [companiesData, a, ap, e, d, q] = await Promise.all([
          api.getAllCompanies(),
          api.getAttendances(studentId ? String(studentId) : undefined),
          api.getAppointments(studentId ? String(studentId) : undefined),
          api.getEvents(studentId ? String(studentId) : undefined),
          api.getDocuments(studentId ? String(studentId) : undefined),
          api.getQuestionnaires(studentId ? String(studentId) : undefined)
        ]);
        setCompanies(Array.isArray(companiesData) ? companiesData : []);
        setAttendances(Array.isArray(a) ? a : []);
        setAppointments(Array.isArray(ap) ? ap : []);
        setEvents(Array.isArray(e) ? e : []);
        setDocuments(Array.isArray(d) ? d : []);
        setQuestionnaires(Array.isArray(q) ? q : []);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    })();
  }, []);

  const fullName = useMemo(() => {
    if (!student) return '';
    const first = student.firstName || student.prenom || '';
    const last = student.lastName || student.nom || student.nom_usage || student.nom_naissance || '';
    return `${first} ${last}`.trim();
  }, [student]);

  const formation = useMemo(() => formationLabel(student?.formation), [student]);

  const attendanceStats = useMemo(() => {
    const present = attendances.filter((x) => x.type === 'present').length;
    const absences = attendances.filter((x) => x.type === 'absence').length;
    const delays = attendances.filter((x) => x.type === 'delay').length;
    const pending = attendances.filter((x) => x.status === 'pending').length;
    const total = present + absences + delays;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const absencesThisMonth = attendances.filter((x) => {
      if (x.type !== 'absence' || !x.date) return false;
      const d = new Date(x.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
    return { present, absences, delays, pending, rate, absencesThisMonth };
  }, [attendances]);

  const questionnaireStats = useMemo(() => {
    const completed = questionnaires.filter((q) => q.statut === 'completed').length;
    const pending = questionnaires.filter((q) => q.statut === 'pending' || q.statut === 'in_progress').length;
    const percentages = questionnaires
      .map((q) => (typeof q.percentage === 'number' ? q.percentage : null))
      .filter((n): n is number => n !== null);
    const avg = percentages.length > 0 ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length) : 0;
    return { completed, pending, avg };
  }, [questionnaires]);

  const progressData = useMemo(() => {
    const schoolHours = Math.round(
      events.filter((e) => e.type === 'course')
        .reduce((sum, e) => sum + hoursBetween(e.start ? new Date(e.start) : undefined, e.end ? new Date(e.end) : undefined, e.allDay), 0)
    );
    const companyHours = Math.round(
      events.filter((e) => e.type === 'company')
        .reduce((sum, e) => sum + hoursBetween(e.start ? new Date(e.start) : undefined, e.end ? new Date(e.end) : undefined, e.allDay), 0)
    );
    const now = new Date();
    const endDate = new Date('2027-06-30T00:00:00.000Z');
    const monthsRemaining = Math.max(0, Math.round((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const skillsDone = Array.isArray(student?.skills) ? student.skills.length : 0;
    return {
      schoolHours, companyHours, monthsRemaining, skillsDone,
      testsDone: questionnaireStats.completed, testsTotal: questionnaires.length
    };
  }, [events, questionnaires.length, questionnaireStats.completed, student?.skills]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const mappedEvents = events.map((e) => ({
      date: e.start ? new Date(e.start) : null,
      title: e.title || 'Evenement',
      details: `${e.location || ''}${e.teacher ? ` - ${e.teacher}` : ''}`.trim(),
      type: (e.type || 'meeting') as EventType
    }));
    const mappedAppointments = appointments
      .filter((a) => a.status === 'upcoming')
      .map((a) => ({
        date: a.dateStart ? new Date(a.dateStart) : null,
        title: a.reason || 'Rendez-vous',
        details: a.notes || '',
        type: 'meeting' as EventType
      }));
    return [...mappedEvents, ...mappedAppointments]
      .filter((x) => x.date && x.date.getTime() >= now.getTime())
      .sort((a, b) => (a.date!.getTime() - b.date!.getTime()))
      .slice(0, 4);
  }, [appointments, events]);

  const urgentActions = useMemo(() => {
    const actions: Array<{ title: string; subtitle: string; hint: string; kind: 'upload' | 'answer' }> = [];
    const pendingAbsence = attendances.find((a) => a.type === 'absence' && a.status === 'pending');
    if (pendingAbsence) {
      actions.push({
        title: 'Justificatif manquant',
        subtitle: pendingAbsence.course || 'Absence',
        hint: pendingAbsence.date ? `Date: ${new Date(pendingAbsence.date).toLocaleDateString('fr-FR')}` : 'En attente',
        kind: 'upload'
      });
    }
    const pendingDoc = documents.find((d) => d.status === 'pending' || d.status === 'to_sign');
    if (pendingDoc) {
      actions.push({
        title: 'Document a traiter',
        subtitle: pendingDoc.title || 'Document',
        hint: `Statut: ${pendingDoc.status}`,
        kind: 'upload'
      });
    }
    if (questionnaireStats.pending > 0) {
      actions.push({
        title: 'Questionnaire en attente',
        subtitle: `${questionnaireStats.pending} questionnaire(s) a completer`,
        hint: 'Duree estimee: 5-20 min',
        kind: 'answer'
      });
    }
    return actions.slice(0, 3);
  }, [attendances, documents, questionnaireStats.pending]);

  const notifications = useMemo(() => {
    const items: Array<{ title: string; subtitle: string; time: string; icon: 'download' | 'edit' | 'calendar' | 'award' }> = [];
    const doc = documents[0];
    if (doc) {
      items.push({ title: 'Nouveau document', subtitle: doc.title || 'Document', time: doc.createdAt ? new Date(doc.createdAt).toLocaleString('fr-FR') : 'Recent', icon: 'download' });
    }
    const att = attendances[0];
    if (att) {
      items.push({ title: 'Presence mise a jour', subtitle: `${att.type} - ${att.course || ''}`, time: att.updatedAt ? new Date(att.updatedAt).toLocaleString('fr-FR') : 'Recent', icon: 'edit' });
    }
    const appt = appointments.find((a) => a.status === 'upcoming');
    if (appt) {
      items.push({ title: 'Rappel rendez-vous', subtitle: appt.reason || '', time: appt.dateStart ? new Date(appt.dateStart).toLocaleString('fr-FR') : 'Bientot', icon: 'calendar' });
    }
    if (questionnaireStats.completed > 0) {
      items.push({ title: 'Questionnaire termine', subtitle: `${questionnaireStats.completed} termine(s)`, time: 'Recent', icon: 'award' });
    }
    return items.slice(0, 4);
  }, [appointments, attendances, documents, questionnaireStats.completed]);

  const typeBadge = (type: EventType) => {
    if (type === 'company') return { text: 'Entreprise', color: 'bg-emerald-500', dot: 'bg-emerald-400' };
    if (type === 'exam') return { text: 'Examen', color: 'bg-rose-500', dot: 'bg-rose-400' };
    if (type === 'meeting') return { text: 'RDV', color: 'bg-amber-500', dot: 'bg-amber-400' };
    return { text: 'Cours', color: 'bg-blue-500', dot: 'bg-blue-400' };
  };

  const notifIcon = (icon: string) => {
    const cls = "text-slate-400";
    if (icon === 'download') return <Download size={15} className={cls} />;
    if (icon === 'edit') return <Edit size={15} className={cls} />;
    if (icon === 'calendar') return <Calendar size={15} className={cls} />;
    return <Award size={15} className={cls} />;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { value: `${attendanceStats.rate}%`, label: 'Taux de presence', sub: `${attendanceStats.present}/${attendances.length}`, icon: <Check size={18} />, accent: 'emerald' },
          { value: questionnaireStats.avg > 0 ? `${questionnaireStats.avg}%` : '-', label: 'Moyenne questionnaires', sub: `${questionnaireStats.completed} termine(s)`, icon: <TrendingUp size={18} />, accent: 'blue' },
          { value: `${attendanceStats.absencesThisMonth}`, label: 'Absences ce mois', sub: `${attendanceStats.pending} en attente`, icon: <AlertCircle size={18} />, accent: 'amber' },
          { value: `${urgentActions.length}`, label: 'Actions urgentes', sub: 'A traiter', icon: <Bell size={18} />, accent: 'rose' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${kpi.accent}-50 text-${kpi.accent}-500`}>
                {kpi.icon}
              </div>
            </div>
            <div className={`text-2xl font-bold text-slate-800 mb-0.5`}>{kpi.value}</div>
            <div className="text-xs text-slate-500 font-medium">{kpi.label}</div>
            <div className={`text-[0.7rem] text-${kpi.accent}-600 mt-1.5 font-medium`}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <BarChart3 size={16} className="text-indigo-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Progression de la formation</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[0.7rem] font-semibold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Donnees en direct
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { value: `${progressData.schoolHours}h`, label: 'Heures ecole', color: 'blue' },
            { value: `${progressData.companyHours}h`, label: 'Heures entreprise', color: 'emerald' },
            { value: `${progressData.monthsRemaining}`, label: 'Mois restants', color: 'amber' },
            { value: `${progressData.skillsDone}`, label: 'Competences', color: 'purple' },
            { value: `${progressData.testsDone}/${progressData.testsTotal}`, label: 'Tests valides', color: 'rose' },
          ].map((item, i) => (
            <div key={i} className={`bg-slate-50 rounded-lg p-4 text-center border border-slate-100`}>
              <div className={`text-xl font-bold text-slate-800`}>{item.value}</div>
              <div className="text-[0.7rem] text-slate-500 mt-1 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Events + Urgent Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar size={16} className="text-blue-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">Evenements a venir</h3>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <Calendar size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Aucun evenement a venir</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingEvents.map((event, index) => {
                const badge = typeBadge(event.type);
                return (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="text-center min-w-[40px]">
                      <div className="text-lg font-bold text-slate-800 leading-none">
                        {event.date ? String(event.date.getDate()).padStart(2, '0') : '--'}
                      </div>
                      <div className="text-[0.65rem] text-slate-400 uppercase mt-0.5">
                        {event.date ? event.date.toLocaleString('fr-FR', { month: 'short' }) : ''}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-700 truncate">{event.title}</div>
                      {event.details && <div className="text-xs text-slate-400 truncate">{event.details}</div>}
                    </div>
                    <span className={`${badge.color} text-white px-2 py-0.5 rounded text-[0.65rem] font-semibold flex-shrink-0`}>
                      {badge.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Urgent Actions */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                <AlertCircle size={16} className="text-rose-500" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Actions urgentes</h3>
            </div>
            {urgentActions.length > 0 && (
              <span className="w-6 h-6 bg-rose-500 text-white rounded-full text-xs font-bold flex items-center justify-center">
                {urgentActions.length}
              </span>
            )}
          </div>

          {urgentActions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={32} className="text-emerald-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Tout est a jour</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {urgentActions.map((action, index) => (
                <div key={index} className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      {action.kind === 'upload' ? <Upload size={14} className="text-amber-600" /> : <CheckCircle size={14} className="text-amber-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-700">{action.title}</div>
                      <div className="text-xs text-slate-500">{action.subtitle}</div>
                      <div className="text-[0.7rem] text-amber-600 mt-1">{action.hint}</div>
                    </div>
                    <button className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors flex-shrink-0">
                      {action.kind === 'upload' ? 'Envoyer' : 'Repondre'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <Bell size={16} className="text-slate-500" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">Notifications recentes</h3>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-6">
            <Bell size={28} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Aucune notification</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n, index) => (
              <div key={index} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  {notifIcon(n.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-700">{n.title}</div>
                  <div className="text-xs text-slate-400">{n.subtitle}</div>
                </div>
                <div className="text-[0.7rem] text-slate-400 flex-shrink-0">{n.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apprenticeship Overview */}
      <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-4">
            <GraduationCap size={20} />
            <h3 className="text-base font-semibold">Vue d'ensemble alternance</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { value: `${attendanceStats.rate}%`, label: 'Assiduite' },
              { value: `${questionnaireStats.completed}`, label: 'Questionnaires' },
              { value: `${appointments.filter((a) => a.status === 'upcoming').length}`, label: 'RDV a venir' },
              { value: attendanceStats.rate >= 90 ? 'A+' : attendanceStats.rate >= 75 ? 'B' : 'C', label: 'Note globale' },
              { value: `${documents.length}`, label: 'Documents' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                <div className="text-xl font-bold">{item.value}</div>
                <div className="text-[0.7rem] text-white/60 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
