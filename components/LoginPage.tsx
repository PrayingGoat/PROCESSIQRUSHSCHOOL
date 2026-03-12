import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './LoginPage.css';

const STATIC_USERS = [
    { email: 'superadmin@processiq.fr', password: 'superadmin', role: 'super_admin', name: 'Super Administrateur' },
    { email: 'rh@processiq.fr', password: 'rh', role: 'rh', name: 'Responsable RH' },
    { email: 'commercial@processiq.fr', password: 'commercial', role: 'commercial', name: 'Commercial' },
    { email: 'admission@processiq.fr', password: 'admission', role: 'admission', name: 'Administrateur Admission' },
];

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
    const [loading, setLoading] = useState(false);
    const [previousUser, setPreviousUser] = useState<{ name: string; email: string } | null>(null);
    const [showPreviousAccount, setShowPreviousAccount] = useState(true);

    useEffect(() => {
        const savedName = localStorage.getItem('userName');
        const savedEmail = localStorage.getItem('userEmail');
        if (savedName && savedEmail) {
            setPreviousUser({ name: savedName, email: savedEmail });
            setFormData(prev => ({ ...prev, email: savedEmail }));
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setError(null);

        try {
            // Check for static users first
            const staticUser = STATIC_USERS.find(
                u => u.email.toLowerCase() === formData.email.toLowerCase() && u.password === formData.password
            );

            let data;
            if (staticUser) {
                // Mock backend response for static users with a valid JWT format (3 parts separated by dots)
                // 'static.e30.static' is a valid format that decodeJwtPayload can parse (middle is '{' in base64url)
                data = {
                    access_token: 'static.eyJSb2xlIjoic3RhdGljIiwidXNlcm5hbWUiOiJzdGF0aWMifQ.static',
                    role: staticUser.role,
                    email: staticUser.email,
                    name: staticUser.name
                };
            } else {
                // Call backend for students
                data = await api.login(formData.email, formData.password);
            }

            // Normalize role: backend might return 'student', frontend needs 'eleve'
            const normalizedRole = data.role === 'student' ? 'eleve' : (data.role || 'eleve');

            // USE 'authToken' to match session.ts
            localStorage.setItem('authToken', data.access_token);
            localStorage.setItem('userRole', normalizedRole);
            localStorage.setItem('userEmail', data.email || formData.email);
            localStorage.setItem('userName', data.name || previousUser?.name || 'Étudiant');

            // Redirect to appropriate dashboard based on role
            if (normalizedRole === 'super_admin') navigate('/admission');
            else if (normalizedRole === 'commercial') navigate('/commercial/dashboard');
            else if (normalizedRole === 'admission') navigate('/admission');
            else if (normalizedRole === 'rh') navigate('/rh/dashboard');
            else if (normalizedRole === 'eleve') navigate('/etudiant/dashboard');
            else navigate('/admission');
        } catch (err: any) {
            setError(err.message || "Identifiants invalides");
        } finally {
            setLoading(false);
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

                    {/* Copy */}
                    <div className="brand-copy">
                        <p className="brand-eyebrow">Plateforme alternance</p>
                        <h2 className="brand-headline">
                            La plateforme qui <strong>libère l'alternance</strong> de la paperasse
                        </h2>
                        <p className="brand-desc">
                            Gerez vos conventions, suivis pédagogiques et conformités en un seul endroit. Moins d'administratif, plus de résultats.
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
                    {previousUser && showPreviousAccount ? (
                        <div className="previous-account-card">
                            <h1 className="form-heading">Bon retour !</h1>
                            <p className="form-sub">Connectez-vous à votre espace ProcessIQ</p>

                            <div className="user-profile-preview">
                                <div className="user-avatar">
                                    {previousUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-info">
                                    <span className="user-name">{previousUser.name}</span>
                                    <span className="user-email">{previousUser.email}</span>
                                </div>
                            </div>

                            <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
                                                    <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
                                                ) : (
                                                    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                                                )}
                                            </svg>
                                        </button>
                                    </div>
                                    {fieldErrors.password && <span className="field-error" role="alert">{fieldErrors.password}</span>}
                                </div>

                                <button type="submit" className="btn-submit" disabled={loading}>
                                    <span>{loading ? 'Connexion…' : `Se connecter en tant que ${previousUser.name}`}</span>
                                </button>
                            </form>

                            <button
                                className="btn-use-another"
                                onClick={() => {
                                    setShowPreviousAccount(false);
                                    setFormData({ email: '', password: '' });
                                }}
                            >
                                Utiliser un autre compte
                            </button>
                        </div>
                    ) : (
                        <>
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

                            {previousUser && !showPreviousAccount && (
                                <button
                                    className="btn-back-to-previous"
                                    onClick={() => {
                                        setShowPreviousAccount(true);
                                        setFormData(prev => ({ ...prev, email: previousUser.email }));
                                    }}
                                >
                                    Retour au compte de {previousUser.name}
                                </button>
                            )}
                        </>
                    )}

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
