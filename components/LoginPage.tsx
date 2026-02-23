import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle, ArrowRight, Loader2, Eye, EyeOff, Briefcase, GraduationCap, Users, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { decodeJwtPayload, setAuthToken } from '../services/session';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [activeRole, setActiveRole] = useState('admission');
    const [formData, setFormData] = useState({
        email: 'admin@rush-school.fr',
        password: 'admin'
    });

    const roles = [
        { id: 'commercial', label: 'Commercial', icon: Briefcase },
        { id: 'admission', label: 'Admission', icon: GraduationCap },
        { id: 'rh', label: 'RH', icon: Users },
        { id: 'eleve', label: 'Eleve', icon: BookOpen },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await api.login(formData.email, formData.password);
            setAuthToken(result.access_token);

            const payload = decodeJwtPayload(result.access_token);
            const isStudentToken = payload?.role === 'student';

            if (activeRole === 'eleve' && !isStudentToken) {
                throw new Error("Ce compte n'est pas un compte etudiant.");
            }

            const finalRole = isStudentToken ? 'eleve' : activeRole;
            localStorage.setItem('userRole', finalRole);

            if (finalRole === 'commercial') navigate('/commercial/dashboard');
            else if (finalRole === 'admission') navigate('/admission');
            else if (finalRole === 'rh') navigate('/rh/dashboard');
            else if (finalRole === 'eleve') navigate('/etudiant/dashboard');
            else navigate('/');
        } catch (error: any) {
            console.error('Login failed', error);
            alert(error?.message || 'Identifiants invalides');
        } finally {
            setIsLoading(false);
        }
    };

    const currentRoleLabel = roles.find(r => r.id === activeRole)?.label;

    return (
        <div className="min-h-screen w-full flex bg-white font-sans text-slate-900 overflow-hidden">
            {/* LEFT SIDE - MARKETING (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-slate-50 relative overflow-hidden flex-col justify-between p-16">
                {/* Animated Ambient Background */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-20%] w-[800px] h-[800px] bg-blue-100/60 rounded-full blur-[120px] animate-float"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[100px] animate-float-delayed"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12 stagger-1">
                        <img src="/images/logo-process-iq.png" alt="Process IQ" className="h-10 w-auto drop-shadow-sm" />
                    </div>

                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 stagger-2">
                        Portail de Gestion
                    </div>

                    <h1 className="text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight stagger-3">
                        Optimisez vos <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse-soft">
                            processus metiers
                        </span>
                    </h1>

                    <p className="text-lg text-slate-500 max-w-md leading-relaxed mb-10 stagger-4">
                        Accedez a une plateforme centralisee pour gerer les admissions, le suivi commercial et les ressources humaines en toute simplicite.
                    </p>

                    <div className="space-y-4 stagger-5">
                        {[
                            "Suivi des candidats en temps reel",
                            "Generation automatique des documents",
                            "Tableaux de bord statistiques avances",
                            "Gestion collaborative des dossiers"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-slate-600 font-medium group cursor-default">
                                <div className="transition-transform group-hover:scale-125 duration-300">
                                    <CheckCircle className="text-emerald-500" size={20} />
                                </div>
                                <span className="group-hover:text-slate-900 transition-colors">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-xs text-slate-400 font-medium stagger-5" style={{ animationDelay: '0.8s' }}>
                    (c) 2026 Process IQ - Rush School. Tous droits reserves.
                </div>
            </div>

            {/* RIGHT SIDE - LOGIN FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white relative">
                {/* Subtle background glow for the card */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[100px] animate-pulse"></div>
                </div>

                <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 cubic-bezier(0.16, 1, 0.3, 1)">

                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8 scale-in duration-700">
                        <img src="/images/logo-process-iq.png" alt="Process IQ" className="h-12 w-auto" />
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 p-3 hover:shadow-blue-900/15 transition-shadow duration-500">
                        {/* Role Tabs */}
                        <div className="flex p-1.5 bg-slate-100/60 rounded-[2rem] mb-6 overflow-x-auto scrollbar-hide">
                            {roles.map((role) => {
                                const Icon = role.icon;
                                const isActive = activeRole === role.id;
                                return (
                                    <button
                                        key={role.id}
                                        onClick={() => setActiveRole(role.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${isActive
                                                ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-100 scale-100'
                                                : 'text-slate-400 hover:text-slate-700 hover:bg-white/40 scale-95'
                                            }`}
                                    >
                                        <Icon size={14} className={isActive ? 'text-blue-600 animate-in zoom-in-50 duration-500' : ''} />
                                        {role.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="px-6 pb-10 pt-4">
                            <div className="text-center mb-10 overflow-hidden">
                                <h2 className="text-2xl font-black text-slate-900 mb-2 animate-in slide-in-from-top-4 duration-500">
                                    Connexion <span className="text-blue-600">{currentRoleLabel}</span>
                                </h2>
                                <p className="text-slate-400 text-sm font-medium animate-in slide-in-from-top-6 duration-700">
                                    Heureux de vous revoir parmi nous.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-blue-600 transition-colors">Portail ID</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-all duration-300">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="nom@process-iq.fr"
                                            required
                                            className="w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-slate-900 placeholder:text-slate-300 font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 shadow-sm"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <div className="flex justify-between items-center px-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-focus-within:text-blue-600 transition-colors text-right">Cle d'acces</label>
                                        <a href="#" className="text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-wider hover:translate-x-1 transition-all">Soutien technique</a>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-600 transition-all duration-300">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="........"
                                            required
                                            className="w-full pl-12 pr-14 py-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-slate-900 placeholder:text-slate-300 font-bold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 shadow-sm"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-300 hover:text-blue-600 transition-all duration-300 cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0.5 active:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 mt-6 group overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]"></div>
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            <span>Validation...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="relative z-10">Initialiser la session</span>
                                            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="mt-10 text-center animate-in fade-in duration-1000 delay-500">
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl hover:bg-slate-50 transition-colors inline-block cursor-pointer">
                            Version 2.4.0 - <span className="text-slate-500">Infrastructure Cloud Securisee</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
