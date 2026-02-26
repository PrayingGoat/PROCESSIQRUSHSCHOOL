import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ContactPage.css';

const ContactPage: React.FC = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        organisation: '',
        sujet: '',
        message: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        // Nav scroll effect
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        // Scroll reveal animations
        const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

        revealEls.forEach(el => observer.observe(el));

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.prenom.trim()) newErrors.prenom = "Prénom requis.";
        if (!formData.nom.trim()) newErrors.nom = "Nom requis.";
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email invalide.";
        }
        if (!formData.telephone.trim()) newErrors.telephone = "Téléphone requis.";
        if (!formData.organisation.trim()) newErrors.organisation = "Organisation requise.";
        if (!formData.sujet.trim()) newErrors.sujet = "Sujet requis.";
        if (!formData.message.trim()) newErrors.message = "Message requis.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setIsSuccess(true);
        }, 900);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        document.body.style.overflow = !mobileMenuOpen ? 'hidden' : '';
    };

    return (
        <div className="contact-page">
            {/* NAVIGATION */}
            <nav id="nav" className={scrolled ? 'scrolled' : ''} role="navigation" aria-label="Navigation principale">
                <div className="container">
                    <div className="nav-inner">
                        <Link to="/landing" className="nav-brand" aria-label="ProcessIQ — Accueil">
                            <div className="nav-crest">
                                <img src="/images/logo-process-iq.png" alt="ProcessIQ" />
                            </div>
                            <div className="nav-brand-text">
                                <strong>ProcessIQ</strong>
                                <span>Gestion de l'alternance</span>
                            </div>
                        </Link>

                        <div className="nav-links" role="list">
                            <Link to="/landing#solution" role="listitem">Solution</Link>
                            <Link to="/landing#segments" role="listitem">Segments</Link>
                            <Link to="/landing#advantages" role="listitem">Avantages</Link>
                            <a href="#footer" className="active" role="listitem">Contact</a>
                        </div>

                        <div className="nav-right">
                            <div className="nav-lang">
                                <span className="active">FR</span>
                                <span className="nav-separator">/</span>
                                <span>EN</span>
                            </div>
                            <Link to="/login" className="nav-connexion">Connexion</Link>
                            <Link to="/contact" className="nav-cta">Demander une démo</Link>
                        </div>

                        <button
                            className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
                            aria-label="Menu"
                            aria-expanded={mobileMenuOpen}
                            onClick={toggleMobileMenu}
                        >
                            <span></span><span></span><span></span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} aria-hidden={!mobileMenuOpen} role="dialog">
                <Link to="/landing#solution" className="mobile-link" onClick={toggleMobileMenu}>Solution</Link>
                <Link to="/landing#segments" className="mobile-link" onClick={toggleMobileMenu}>Segments</Link>
                <Link to="/landing#advantages" className="mobile-link" onClick={toggleMobileMenu}>Avantages</Link>
                <a href="#footer" className="mobile-link" onClick={toggleMobileMenu}>Contact</a>
            </div>

            {/* PAGE HERO */}
            <section id="page-hero" aria-label="Contactez-nous">
                <div className="page-hero-bg" aria-hidden="true"></div>
                <div className="hero-line-v" aria-hidden="true"></div>
                <div className="hero-shape-rect" aria-hidden="true"></div>
                <div className="hero-shape-dot" aria-hidden="true"></div>

                <div className="container">
                    <div className="page-hero-inner">
                        <button onClick={() => navigate(-1)} className="back-link reveal">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                            Retour
                        </button>

                        <div className="page-eyebrow reveal delay-1">
                            <span className="page-eyebrow-line"></span>
                            <span>Prise de contact</span>
                        </div>

                        <h1 className="page-title reveal delay-2">
                            Contactez-<em>nous</em>
                        </h1>

                        <p className="page-subtitle reveal delay-3">
                            Une question&nbsp;? Besoin d'une démo&nbsp;? Notre équipe est à votre
                            disposition pour vous accompagner dans votre projet.
                        </p>
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" aria-label="Formulaire de contact">
                <div className="container">
                    <div className="contact-grid">
                        {/* Info Column */}
                        <div className="contact-info">
                            <div className="info-label reveal">
                                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 500 }}>Nous écrire</span>
                            </div>
                            <h2 className="info-heading reveal delay-1">
                                Envoyez-nous<br />un <em>message</em>
                            </h2>
                            <p className="info-text reveal delay-2">
                                Remplissez le formulaire et notre équipe vous répondra
                                sous 24&nbsp;h ouvrées. Pour une démo personnalisée,
                                précisez le nombre d'alternants de votre établissement.
                            </p>

                            <div className="info-items reveal delay-3">
                                <div className="info-item">
                                    <div className="info-item-icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="info-item-body">
                                        <span className="info-item-label">Email</span>
                                        <span className="info-item-value">contact@processiq.fr</span>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-item-icon" aria-hidden="true">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div className="info-item-body">
                                        <span className="info-item-label">Téléphone</span>
                                        <span className="info-item-value">+33 1 23 45 67 89</span>
                                    </div>
                                </div>
                            </div>

                            <blockquote className="info-quote reveal delay-4">
                                <p>"Notre équipe répond sous 24&nbsp;h et vous accompagne de la démo
                                    jusqu'au déploiement complet."</p>
                            </blockquote>
                        </div>

                        {/* Form Column */}
                        <div className="reveal-right">
                            <div className="form-card">
                                {!isSuccess ? (
                                    <>
                                        <h3 className="form-card-title">Envoyez-nous un message</h3>
                                        <p className="form-card-sub">Tous les champs marqués d'un * sont obligatoires</p>
                                        <div className="form-accent" aria-hidden="true"></div>

                                        <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                            <div className="form-row">
                                                <div className="field-group">
                                                    <label className="field-label" htmlFor="prenom">Prénom <span className="req">*</span></label>
                                                    <input
                                                        className={`field-input ${errors.prenom ? 'error' : ''}`}
                                                        type="text" id="prenom" name="prenom"
                                                        placeholder="Votre prénom" autoComplete="given-name"
                                                        value={formData.prenom} onChange={handleChange} required
                                                    />
                                                    {errors.prenom && <span className="field-error visible">{errors.prenom}</span>}
                                                </div>
                                                <div className="field-group">
                                                    <label className="field-label" htmlFor="nom">Nom <span className="req">*</span></label>
                                                    <input
                                                        className={`field-input ${errors.nom ? 'error' : ''}`}
                                                        type="text" id="nom" name="nom"
                                                        placeholder="Votre nom" autoComplete="family-name"
                                                        value={formData.nom} onChange={handleChange} required
                                                    />
                                                    {errors.nom && <span className="field-error visible">{errors.nom}</span>}
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="field-group">
                                                    <label className="field-label" htmlFor="email">Email <span className="req">*</span></label>
                                                    <input
                                                        className={`field-input ${errors.email ? 'error' : ''}`}
                                                        type="email" id="email" name="email"
                                                        placeholder="votre.email@exemple.com" autoComplete="email"
                                                        value={formData.email} onChange={handleChange} required
                                                    />
                                                    {errors.email && <span className="field-error visible">{errors.email}</span>}
                                                </div>
                                                <div className="field-group">
                                                    <label className="field-label" htmlFor="telephone">Téléphone <span className="req">*</span></label>
                                                    <input
                                                        className={`field-input ${errors.telephone ? 'error' : ''}`}
                                                        type="tel" id="telephone" name="telephone"
                                                        placeholder="+33 6 12 34 56 78" autoComplete="tel"
                                                        value={formData.telephone} onChange={handleChange} required
                                                    />
                                                    {errors.telephone && <span className="field-error visible">{errors.telephone}</span>}
                                                </div>
                                            </div>

                                            <div className="field-group">
                                                <label className="field-label" htmlFor="organisation">Organisation <span className="req">*</span></label>
                                                <input
                                                    className={`field-input ${errors.organisation ? 'error' : ''}`}
                                                    type="text" id="organisation" name="organisation"
                                                    placeholder="Nom de votre établissement/entreprise" autoComplete="organization"
                                                    value={formData.organisation} onChange={handleChange} required
                                                />
                                                {errors.organisation && <span className="field-error visible">{errors.organisation}</span>}
                                            </div>

                                            <div className="field-group">
                                                <label className="field-label" htmlFor="sujet">Sujet <span className="req">*</span></label>
                                                <input
                                                    className={`field-input ${errors.sujet ? 'error' : ''}`}
                                                    type="text" id="sujet" name="sujet"
                                                    placeholder="Objet de votre message"
                                                    value={formData.sujet} onChange={handleChange} required
                                                />
                                                {errors.sujet && <span className="field-error visible">{errors.sujet}</span>}
                                            </div>

                                            <div className="field-group">
                                                <label className="field-label" htmlFor="message">Message <span className="req">*</span></label>
                                                <textarea
                                                    className={`field-textarea ${errors.message ? 'error' : ''}`}
                                                    id="message" name="message"
                                                    placeholder="Décrivez votre demande…"
                                                    value={formData.message} onChange={handleChange} required
                                                ></textarea>
                                                {errors.message && <span className="field-error visible">{errors.message}</span>}
                                            </div>

                                            <button type="submit" className="btn-submit" disabled={loading}>
                                                <span>{loading ? 'Envoi en cours…' : 'Envoyer le message'}</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                                </svg>
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    /* Message de succès */
                                    <div className="form-success visible" role="status" aria-live="polite">
                                        <div className="success-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                                                <polyline points="22 4 12 14.01 9 11.01" />
                                            </svg>
                                        </div>
                                        <h3 className="success-title">Message envoyé !</h3>
                                        <p className="success-text">
                                            Merci pour votre message. Notre équipe vous contactera
                                            sous 24&nbsp;h ouvrées.
                                        </p>
                                        <button
                                            onClick={() => setIsSuccess(false)}
                                            style={{ marginTop: '1.5rem', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 500, textDecoration: 'underline' }}
                                        >
                                            Envoyer un autre message
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer id="footer" role="contentinfo">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="nav-brand" style={{ marginBottom: '0.5rem' }}>
                                <div className="nav-crest">
                                    <img src="/images/logo-process-iq.png" alt="ProcessIQ" />
                                </div>
                                <div className="nav-brand-text">
                                    <strong>ProcessIQ</strong>
                                    <span>Gestion de l'alternance</span>
                                </div>
                            </div>
                            <p className="footer-tagline">
                                "La plateforme intégrée qui libère l'alternance et le stage de la paperasse et des silos."
                            </p>
                            <div className="footer-social" aria-label="Réseaux sociaux">
                                <a href="#" className="footer-social-btn" aria-label="LinkedIn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </a>
                                <a href="#" className="footer-social-btn" aria-label="X (Twitter)">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="footer-col-title">Liens rapides</h3>
                            <ul className="footer-links">
                                <li><Link to="/landing">Accueil</Link></li>
                                <li><Link to="/landing#solution">Solution</Link></li>
                                <li><Link to="/landing#segments">Segments</Link></li>
                                <li><Link to="/landing#advantages">Avantages</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="footer-col-title">Légal</h3>
                            <ul className="footer-links">
                                <li><a href="#">Mentions légales</a></li>
                                <li><a href="#">Politique de confidentialité</a></li>
                                <li><a href="#">RGPD &amp; données</a></li>
                                <li><a href="#">Conditions générales</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="footer-col-title">Contact</h3>
                            <div className="footer-contact-item">
                                <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <span>contact@processiq.fr</span>
                            </div>
                            <div className="footer-contact-item">
                                <svg className="footer-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <span>+33 1 23 45 67 89</span>
                            </div>
                            <a href="#contact" className="nav-cta" style={{ marginTop: '1.2rem', fontSize: '0.75rem', padding: '0.75rem 1.4rem', display: 'inline-block', borderRadius: '4px' }}>
                                Demander une démo →
                            </a>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p className="footer-copy">© 2025 ProcessIQ. Tous droits réservés.</p>
                        <div className="footer-bottom-links">
                            <a href="#">Mentions légales</a>
                            <a href="#">Politique de confidentialité</a>
                            <a href="#">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ContactPage;
