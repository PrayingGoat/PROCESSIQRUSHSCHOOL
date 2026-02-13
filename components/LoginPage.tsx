import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import { api } from '../services/api';
import { setAuthToken } from '../services/session';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log("Authenticating against backend...");
            const result = await api.login(formData.email, formData.password);

            setAuthToken(result.access_token);
            setIsLoading(false);
            navigate('/');

        } catch (error: any) {
            console.error("Login failed", error);
            setIsLoading(false);
            alert(error.message || "Identifiants incorrects");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md p-6 relative z-10 animate-fade-in">
                <div className="mb-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-brand to-primary rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-brand/20 mb-6 transform hover:scale-105 transition-transform duration-300">
                        <img src="/images/logo-process-iq.png" alt="Logo" className="w-12 h-auto brightness-0 invert" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Bon retour !</h1>
                    <p className="text-slate-500 font-medium">Connectez-vous à votre espace Rush School</p>
                </div>

                <div className="bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl shadow-slate-200/50">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Adresse e-mail"
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-slate-100/50 border-2 border-transparent rounded-2xl text-slate-900 placeholder:text-slate-400 font-bold outline-none focus:bg-white focus:border-brand focus:shadow-lg focus:shadow-brand/10 transition-all duration-300"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mot de passe"
                                    required
                                    className="w-full pl-11 pr-12 py-4 bg-slate-100/50 border-2 border-transparent rounded-2xl text-slate-900 placeholder:text-slate-400 font-bold outline-none focus:bg-white focus:border-brand focus:shadow-lg focus:shadow-brand/10 transition-all duration-300"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-brand transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-3 cursor-pointer group select-none">
                                <div className="relative">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-brand peer-checked:border-brand transition-all"></div>
                                    <svg className="absolute top-1 left-1 w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Se souvenir de moi</span>
                            </label>
                            <a href="#" className="text-sm font-bold text-brand hover:text-indigo-600 transition-colors">Mot de passe oublié ?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-brand to-primary text-white rounded-2xl font-black text-lg shadow-lg shadow-brand/30 hover:shadow-brand/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" />
                                    <span>Connexion...</span>
                                </>
                            ) : (
                                <>
                                    <span>Se connecter</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-400 font-medium text-sm">
                    Vous n'avez pas de compte ? <a href="#" className="text-brand font-bold hover:underline">Contactez l'administration</a>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
