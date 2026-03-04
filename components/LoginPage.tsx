<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle, ArrowRight, Loader2, Eye, EyeOff, Briefcase, GraduationCap, Users, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { decodeJwtPayload, setAuthToken } from '../services/session';
=======
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './LoginPage.css';
>>>>>>> b28a87303c60b11d4a67eb9b85007063f750ee43

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);

<<<<<<< HEAD
    const roles = [
        { id: 'commercial', label: 'Commercial', icon: Briefcase },
        { id: 'admission', label: 'Admission', icon: GraduationCap },
        { id: 'rh', label: 'RH', icon: Users },
        { id: 'eleve', label: 'Eleve', icon: BookOpen },
    ];
=======
    useEffect(() => {
        // Clear background scroll lock just in case
        document.body.style.overflow = '';
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear field error when user types
        if (fieldErrors[name as keyof typeof fieldErrors]) {
            setFieldErrors(prev => ({ ...prev, [name]: undefined }));
        }
        if (error) setError(null);
    };

    const validate = () => {
        const errors: { email?: string; password?: string } = {};
        if (!formData.email) {
            errors.email = "Adresse e-mail requise.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Adresse e-mail invalide.";
        }
        if (!formData.password) {
            errors.password = "Mot de passe requis.";
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };
>>>>>>> b28a87303c60b11d4a67eb9b85007063f750ee43

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

<<<<<<< HEAD
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
=======
        setLoading(true);
        setError(null);

        try {
            const data = await api.login(formData.email, formData.password);
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userName', data.name);

            // Redirect to appropriate dashboard based on role
            if (data.role === 'super_admin') navigate('/admission');
            else if (data.role === 'commercial') navigate('/commercial/dashboard');
            else if (data.role === 'admission') navigate('/admission');
            else if (data.role === 'rh') navigate('/rh/dashboard');
            else if (data.role === 'eleve') navigate('/etudiant');
            else navigate('/admission');
        } catch (err: any) {
            setError(err.message || "Identifiants invalides");
        } finally {
            setLoading(false);
>>>>>>> b28a87303c60b11d4a67eb9b85007063f750ee43
        }
    };

    return (
        <div className="login-page">
            {/* ════════════ LEFT — BRAND PANEL ════════════ */}
            <aside className="panel-brand" aria-label="ProcessIQ — présentation">
                {/* Decorative shapes */}
                <div className="brand-glow-btm" aria-hidden="true"></div>
                <div className="bs bs-1" aria-hidden="true"></div>
                <div className="bs bs-2" aria-hidden="true"></div>
                <div className="bs bs-3" aria-hidden="true"></div>
                <div className="bs bs-4" aria-hidden="true"></div>

                <div className="brand-inner">
                    {/* Logo */}
                    <Link to="/" className="brand-logo-wrap">
                        <img src="/images/logo-process-iq.png" alt="ProcessIQ" className="brand-logo" />
                        <span className="brand-logo-name">ProcessIQ</span>
                    </Link>

<<<<<<< HEAD
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
=======
                    {/* Copy */}
                    <div className="brand-copy">
                        <p className="brand-eyebrow">Plateforme alternance</p>
                        <h2 className="brand-headline">
                            La plateforme qui <strong>libère l'alternance</strong> de la paperasse
                        </h2>
                        <p className="brand-desc">
                            Gerez vos conventions, suivis pédagogiques et conformités en un seul endroit. Moins d'administratif, plus de résultats.
>>>>>>> b28a87303c60b11d4a67eb9b85007063f750ee43
                        </p>

                        {/* Stats */}
                        <div className="brand-stats">
                            <div className="stat-item">
                                <span className="stat-value">1M+</span>
                                <span className="stat-label">Alternants en France</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">15Md€</span>
                                <span className="stat-label">Marché adressable</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">85%</span>
                                <span className="stat-label">Gain de temps admin</span>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="brand-features">
                            <div className="feat-item">
                                <div className="feat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                        <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                                        <polyline points="13 2 13 9 20 9" />
                                    </svg>
                                </div>
                                <div className="feat-text">
                                    <p className="feat-title">Automatisation admin</p>
                                    <p className="feat-sub">Conventions et livrables générés automatiquement</p>
                                </div>
                            </div>
                            <div className="feat-item">
                                <div className="feat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                </div>
                                <div className="feat-text">
                                    <p className="feat-title">Suivi pédagogique</p>
                                    <p className="feat-sub">Tableau de bord temps réel pour tuteurs et RH</p>
                                </div>
                            </div>
                            <div className="feat-item">
                                <div className="feat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <div className="feat-text">
                                    <p className="feat-title">Conformité RGPD</p>
                                    <p className="feat-sub">Données hébergées en France, certifié ISO 27001</p>
                                </div>
                            </div>
                            <div className="feat-item">
                                <div className="feat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                        <rect x="2" y="3" width="20" height="14" rx="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                </div>
                                <div className="feat-text">
                                    <p className="feat-title">Solution tout-en-un</p>
                                    <p className="feat-sub">CFA, entreprise et alternant, sur une seule plateforme</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Brand footer */}
                    <nav className="brand-footer-links" aria-label="Liens utiles">
                        <Link to="/">Accueil</Link>
                        <a href="#">Politique de confidentialité</a>
                        <a href="#">Mentions légales</a>
                    </nav>
                </div>
            </aside>

            {/* ════════════ RIGHT — FORM PANEL ════════════ */}
            <main className="panel-form" role="main">
                <Link to="/" className="form-back" aria-label="Retour à l'accueil">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    Retour à l'accueil
                </Link>

                <div className="form-inner">
                    <h1 className="form-heading">Bienvenue</h1>
                    <p className="form-sub">Connectez-vous à votre espace ProcessIQ</p>

                    {error && <div className="server-error" role="alert">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        {/* Email */}
                        <div className="field-group">
                            <label className="field-label" htmlFor="email">Adresse email</label>
                            <div className="field-wrap">
                                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <input
                                    className={`field-input ${fieldErrors.email ? 'error' : ''}`}
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="votre@email.fr"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {fieldErrors.email && <span className="field-error" role="alert">{fieldErrors.email}</span>}
                        </div>

                        {/* Mot de passe */}
                        <div className="field-group">
                            <label className="field-label" htmlFor="password">Mot de passe</label>
                            <div className="field-wrap">
                                <svg className="field-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                                <input
                                    className={`field-input ${fieldErrors.password ? 'error' : ''}`}
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    className="field-toggle"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                        {showPassword ? (
                                            <>
                                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                                                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </>
                                        ) : (
                                            <>
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                            {fieldErrors.password && <span className="field-error" role="alert">{fieldErrors.password}</span>}
                        </div>

                        {/* Mot de passe oublié */}
                        <div className="forgot-row">
                            <a href="#" className="forgot-link">Mot de passe oublié&nbsp;?</a>
                        </div>

                        {/* Bouton connexion */}
                        <button type="submit" className="btn-submit" disabled={loading}>
                            <span>{loading ? 'Connexion…' : 'Se connecter'}</span>
                        </button>
                    </form>

                    <div className="form-divider"><span>ou</span></div>

                    {/* Demo CTA */}
                    <Link to="/register" className="btn-demo">Demander une démo gratuite</Link>

                    {/* Inscription */}
                    <p className="form-register">
                        Pas encore de compte&nbsp;?
                        <Link to="/register"> Créer un compte</Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
