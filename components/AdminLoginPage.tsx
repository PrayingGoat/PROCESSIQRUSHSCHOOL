import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Terminal, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ token: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // MOCK ADMIN LOGIN
        setTimeout(() => {
            localStorage.setItem('adminAuthToken', 'admin-pulse-' + Date.now());
            setIsLoading(false);
            navigate('/admin');
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] font-mono text-slate-300 relative overflow-hidden">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }}>
            </div>

            {/* Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-sm relative z-10 px-6">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6 group cursor-default shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                        <Shield className="text-blue-500 group-hover:scale-110 transition-transform duration-500" size={32} />
                    </div>
                    <h1 className="text-xl font-black text-white tracking-[0.2em] uppercase mb-2">Technical Vault</h1>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest leading-relaxed">
                        Accès restreint aux administrateurs réseau <br />
                        <span className="text-blue-500/50">Process IQ Infra v4.0</span>
                    </p>
                </div>

                <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Terminal size={12} className="text-emerald-500" />
                                Jeton d'administration
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-600 transition-colors group-focus-within:text-blue-500">
                                    <Lock size={16} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••••••"
                                    required
                                    className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl pl-11 pr-12 py-3.5 text-sm text-white placeholder:text-slate-700 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all"
                                    value={formData.token}
                                    onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-slate-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Vérification...</span>
                                </>
                            ) : (
                                <>
                                    <span>Déverrouiller</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 text-center overflow-hidden h-4">
                    <p className="text-[10px] text-slate-700 animate-pulse uppercase tracking-[0.3em]">
                        Secure layer active. Monitoring connections...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
