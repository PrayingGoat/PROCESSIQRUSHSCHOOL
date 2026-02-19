import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizData } from './data/quizData';
import { Timer, User, ChevronRight, ChevronLeft, ChevronDown, Send, CheckCircle2, Award, Download, ArrowRight, GraduationCap } from 'lucide-react';

export default function App() {
    const [step, setStep] = useState('home');
    const [quizType, setQuizType] = useState('ntc');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(35 * 60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [score, setScore] = useState(0);

    // Timer Logic
    useEffect(() => {
        let interval;
        if (step === 'quiz' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        finishQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timeLeft]);

    const startQuiz = (e) => {
        e.preventDefault();
        setUserAnswers(new Array(quizData[quizType].questions.length).fill(null));
        setTimeLeft(quizData[quizType].duration);
        setStep('quiz');
    };

    const selectOption = (idx) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIdx] = idx;
        setUserAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (currentQuestionIdx < quizData[quizType].questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            finishQuiz();
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIdx > 0) {
            setCurrentQuestionIdx(prev => prev - 1);
        }
    };

    const finishQuiz = () => {
        let finalScore = 0;
        const questions = quizData[quizType].questions;
        userAnswers.forEach((ans, idx) => {
            if (ans === questions[idx].correct) finalScore += questions[idx].points;
        });
        setScore(finalScore);
        setStep('results');
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const renderStep = () => {
        switch (step) {
            case 'home':
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8 max-w-2xl mx-auto px-4"
                    >
                        <div className="space-y-4">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium tracking-wider uppercase"
                            >
                                Bienvenue chez Rush School
                            </motion.span>
                            <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 tracking-tight leading-none">
                                Évaluez votre <br /> <span className="text-coral-pink">Potentiel</span>
                            </h1>
                            <p className="text-xl text-white/40 font-light leading-relaxed max-w-lg mx-auto">
                                Prêt pour l'entrée dans notre institution ? Relevez le défi et montrez-nous votre talent en 35 minutes.
                            </p>
                        </div>
                        <button
                            onClick={() => setStep('registration')}
                            className="group relative px-10 py-5 bg-white text-background-dark font-bold text-xl rounded-2xl hover:bg-coral-pink hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                        >
                            DEMARRER LE TEST
                            <ArrowRight className="inline-block ml-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                );

            case 'registration':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-xl mx-auto px-4"
                    >
                        <div className="glass-card p-10 rounded-3xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full"></div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold">Identifiez-vous</h2>
                                <p className="text-white/40">Commençons par faire connaissance.</p>
                            </div>

                            <form onSubmit={startQuiz} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            required
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="Votre Nom & Prénom"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-5 focus:border-primary outline-none transition-all text-lg placeholder:text-white/20"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Send className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={20} />
                                        <input
                                            required
                                            type="email"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            placeholder="Votre adresse Email"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-5 focus:border-primary outline-none transition-all text-lg placeholder:text-white/20"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-2 ml-1">Parcours souhaité</p>
                                        <GraduationCap className="absolute left-5 bottom-5 text-white/20 group-focus-within:text-primary transition-colors pointer-events-none" size={20} />
                                        <select
                                            value={quizType}
                                            onChange={(e) => setQuizType(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-5 focus:border-primary outline-none transition-all appearance-none cursor-pointer text-lg text-white/70 hover:border-white/20"
                                        >
                                            <option value="ntc" className="bg-[#1b1121]">NTC - Négociateur Technico-Commercial</option>
                                            <option value="mco" className="bg-[#1b1121]">MCO - Management Commercial Opérationnel</option>
                                            <option value="bachelor" className="bg-[#1b1121]">Bachelor - Responsable Développement</option>
                                            <option value="ndrc" className="bg-[#1b1121]">NDRC - Relation Client Digitale</option>
                                        </select>
                                        <ChevronDown className="absolute right-5 bottom-5 text-white/30 pointer-events-none group-focus-within:text-primary transition-colors" size={22} />
                                    </div>
                                </div>

                                <div className="bg-coral-pink/10 border border-coral-pink/20 p-5 rounded-2xl flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-xl bg-coral-pink flex items-center justify-center shrink-0">
                                        <Timer className="text-white" size={24} />
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-white font-bold italic">Chronomètre : 35 Minutes</p>
                                        <p className="text-white/50">Le test s'auto-soumettra à la fin du temps.</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-white text-background-dark font-bold text-xl rounded-2xl hover:bg-primary hover:text-white transition-all transform hover:scale-[1.02]"
                                >
                                    Lancer le Test
                                </button>
                            </form>
                        </div>
                    </motion.div>
                );

            case 'quiz':
                const q = quizData[quizType].questions[currentQuestionIdx];
                const progress = ((currentQuestionIdx + 1) / quizData[quizType].questions.length) * 100;

                return (
                    <div className="w-full max-w-5xl mx-auto px-4 pb-20">
                        {/* Quiz Header */}
                        <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4 glass-card border-none bg-background-dark/80 backdrop-blur-xl">
                            <div className="max-w-7xl mx-auto flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-lg">
                                        {userName[0] || '?'}
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Candidat</p>
                                        <p className="text-sm font-bold truncate max-w-[150px]">{userName}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-2 flex-grow mx-10">
                                    <div className="w-full max-w-md h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-gradient-to-r from-primary to-coral-pink rounded-full"
                                        />
                                    </div>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Progression</p>
                                </div>

                                <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all ${timeLeft < 300 ? 'bg-coral-pink/20 border-coral-pink animate-pulse-slow' : 'bg-white/5 border-white/10'}`}>
                                    <Timer className={timeLeft < 300 ? 'text-coral-pink' : 'text-primary'} size={20} />
                                    <span className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-coral-pink' : 'text-white'}`}>{formatTime(timeLeft)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Question Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestionIdx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="mt-32 space-y-10"
                            >
                                <div className="space-y-4">
                                    <span className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                                        {q.section}
                                    </span>
                                    <div className="flex justify-between items-end">
                                        <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
                                            {q.text}
                                        </h2>
                                        <span className="text-2xl font-mono text-white/20 shrink-0">
                                            Q <span className="text-white/60">{currentQuestionIdx + 1}</span><span className="text-white/10">/{quizData[quizType].questions.length}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((opt, idx) => {
                                        const isSelected = userAnswers[currentQuestionIdx] === idx;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => selectOption(idx)}
                                                className={`group relative flex items-center gap-6 p-6 rounded-3xl transition-all duration-300 border text-left ${isSelected
                                                    ? 'border-coral-pink bg-coral-pink/10 shadow-[0_0_30px_rgba(255,0,110,0.15)]'
                                                    : 'border-white/5 bg-white/5 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-coral-pink bg-coral-pink' : 'border-white/20 group-hover:border-white/40'
                                                    }`}>
                                                    <div className={`w-3 h-3 rounded-full bg-white transition-all transform ${isSelected ? 'scale-100' : 'scale-0'}`} />
                                                </div>
                                                <span className={`text-xl font-medium ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
                                                    {opt}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Footer */}
                        <div className="fixed bottom-0 left-0 right-0 p-8 flex justify-center pointer-events-none">
                            <div className="flex gap-4 max-w-5xl w-full pointer-events-auto">
                                {currentQuestionIdx > 0 && (
                                    <button
                                        onClick={prevQuestion}
                                        className="px-8 py-5 glass-card rounded-2xl flex items-center gap-3 font-bold hover:bg-white/10 transition-all"
                                    >
                                        <ChevronLeft size={24} /> Précédent
                                    </button>
                                )}
                                <button
                                    onClick={nextQuestion}
                                    disabled={userAnswers[currentQuestionIdx] === null}
                                    className={`flex-grow py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-xl transition-all ${userAnswers[currentQuestionIdx] === null
                                        ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                        : 'bg-white text-background-dark shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-98'
                                        }`}
                                >
                                    {currentQuestionIdx === quizData[quizType].questions.length - 1 ? 'Terminer & Soumettre' : 'Question Suivante'}
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'results':
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-xl mx-auto px-4 "
                    >
                        <div className="glass-card p-12 rounded-[40px] text-center space-y-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>

                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-primary to-coral-pink rounded-3xl mx-auto flex items-center justify-center shadow-2xl rotate-3">
                                    <Award className="text-white" size={48} />
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-3xl -z-10"></div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-4xl font-bold">Félicitations, <br /> {userName} !</h2>
                                <p className="text-white/40">Le test est terminé. Votre candidature va maintenant être examinée par notre équipe pédagogique.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                    <p className="text-xs text-white/30 uppercase font-bold tracking-widest mb-1">Score Final</p>
                                    <p className="text-4xl font-mono font-bold text-coral-pink">{score}<span className="text-lg text-white/20">/40</span></p>
                                </div>
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                    <p className="text-xs text-white/30 uppercase font-bold tracking-widest mb-1">Parcours</p>
                                    <p className="text-xl font-bold truncate text-primary uppercase">{quizType}</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-6">
                                <button
                                    onClick={() => window.print()}
                                    className="w-full py-5 bg-white text-background-dark font-bold rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-3"
                                >
                                    <Download size={20} /> Télécharger votre Bilan
                                </button>
                                <div className="flex items-center justify-center gap-2 text-white/30 text-sm">
                                    <CheckCircle2 size={16} /> Résultats envoyés avec succès
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-20">
            <div className="grain-texture"></div>
            <div className="gradient-blob top-[-10%] left-[-10%]"></div>
            <div className="gradient-blob bottom-[-10%] right-[-10%] animate-pulse-slow"></div>

            {renderStep()}
        </div>
    );
}
