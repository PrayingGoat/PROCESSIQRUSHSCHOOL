import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizData } from '../data/quizData';
import { Timer, User, ChevronRight, ChevronLeft, ChevronDown, Send, CheckCircle2, Award, Download, ArrowRight, GraduationCap, Loader2 } from 'lucide-react';
import Button from './ui/Button';
import jsPDF from 'jspdf';
import { api } from '../services/api';

interface AdmissionTestProps {
    selectedFormation?: string | null;
    onFinish: () => void;
    initialUserData?: {
        nom?: string;
        prenom?: string;
        email?: string;
    };
}

export default function AdmissionTest({ selectedFormation, onFinish, initialUserData }: AdmissionTestProps) {
    const [step, setStep] = useState<'home' | 'registration' | 'quiz' | 'results'>('home');
    const [quizType, setQuizType] = useState<string>(selectedFormation || 'mco');
    const [userName, setUserName] = useState<string>(initialUserData ? `${initialUserData.prenom || ''} ${initialUserData.nom || ''}`.trim() : '');
    const [userEmail, setUserEmail] = useState<string>(initialUserData?.email || '');
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(35 * 60);
    const [score, setScore] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Sync quizType if selectedFormation changes
    useEffect(() => {
        if (selectedFormation && quizData[selectedFormation]) {
            setQuizType(selectedFormation);
        }
    }, [selectedFormation]);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
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

    const startQuiz = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!quizData[quizType]) {
            alert("Formation non trouvée ou pas encore disponible.");
            return;
        }

        setUserAnswers(new Array(quizData[quizType].questions.length).fill(null));
        setTimeLeft(quizData[quizType].duration);
        setStep('quiz');
    };

    const selectOption = (idx: number) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIdx] = idx;
        setUserAnswers(newAnswers);
    };

    const nextQuestion = () => {
        if (!quizData[quizType]) return;

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

    const generatePDF = (finalScore?: number) => {
        const doc = new jsPDF();
        const date = new Date().toLocaleDateString('fr-FR');
        const currentScore = finalScore !== undefined ? finalScore : score;

        const addHeader = (pageNum: number) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('RUSH SCHOOL - PORTAIL D\'ADMISSION', 20, 15);

            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(20, 18, 190, 18);

            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`Document généré le ${date}`, 20, 23);
            doc.text(`Page ${pageNum}`, 190, 23, { align: 'right' });
        };

        // --- PAGE 1: SYNTHÈSE ---
        addHeader(1);

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('COMPTE-RENDU DE TEST D\'ADMISSION', 105, 45, { align: 'center' });

        // Section: Candidat
        doc.setFontSize(12);
        doc.text('1. IDENTITÉ DU CANDIDAT', 20, 65);
        doc.line(20, 67, 80, 67);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Nom et Prénom : ${userName.toUpperCase()}`, 25, 75);
        doc.text(`Formation visée : ${quizData[quizType]?.title || quizType}`, 25, 82);

        // Section: Résultats
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('2. RÉSULTATS GÉNÉRAUX', 20, 100);
        doc.line(20, 102, 80, 102);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('Score obtenu :', 25, 110);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(`${currentScore} / 40`, 60, 110);

        const percentage = Math.round((currentScore / 40) * 100);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Taux de réussite : ${percentage}%`, 25, 120);

        // Observations
        doc.setFont('helvetica', 'bold');
        doc.text('3. OBSERVATIONS', 20, 140);
        doc.line(20, 142, 80, 142);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const obs = "Ce document certifie la participation du candidat au test d'admission en ligne de Rush School. Les résultats détaillés sont fournis en annexe de ce compte-rendu.";
        const splitObs = doc.splitTextToSize(obs, 165);
        doc.text(splitObs, 25, 150);

        // Signature area
        doc.setFontSize(9);
        doc.text('Fait à Clichy, le ' + date, 130, 180);
        doc.text('Direction Pédagogique RUSH SCHOOL', 130, 185);

        // --- PAGE 2+: DÉTAIL DES RÉPONSES ---
        let pageNum = 2;
        doc.addPage();
        addHeader(pageNum);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('ANNEXE : DÉTAIL DES RÉPONSES', 20, 35);
        doc.line(20, 37, 90, 37);

        let y = 45;
        const questions = quizData[quizType]?.questions || [];

        questions.forEach((q, idx) => {
            const userAnswerIdx = userAnswers[idx];
            const isCorrect = userAnswerIdx === q.correct;

            if (y > 260) {
                pageNum++;
                doc.addPage();
                addHeader(pageNum);
                y = 35;
            }

            // Question text
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const qHeader = `Q${idx + 1}. [${q.section}]`;
            doc.text(qHeader, 20, y);

            doc.setFont('helvetica', 'normal');
            const qLines = doc.splitTextToSize(q.text, 160);
            doc.text(qLines, 25, y + 5);
            y += (qLines.length * 5) + 5;

            // Answers
            doc.setFontSize(8);
            if (isCorrect) {
                doc.setTextColor(0, 128, 0); // Green
                doc.text(`Réponse donnée : ${q.options[userAnswerIdx as number]} (Correct)`, 28, y);
            } else {
                doc.setTextColor(180, 0, 0); // Red
                const given = userAnswerIdx !== null ? q.options[userAnswerIdx] : "Aucune";
                doc.text(`Réponse donnée : ${given} (Incorrect)`, 28, y);
                y += 4;
                doc.setTextColor(0, 0, 0);
                doc.text(`Réponse attendue : ${q.options[q.correct]}`, 28, y);
            }

            doc.setTextColor(0, 0, 0);
            y += 10;
        });

        return doc.output('blob');
    };

    const finishQuiz = async () => {
        if (!quizData[quizType]) return;

        let finalScore = 0;
        const questions = quizData[quizType].questions;
        userAnswers.forEach((ans, idx) => {
            if (questions[idx] && ans === questions[idx].correct) finalScore += questions[idx].points;
        });
        setScore(finalScore);
        setStep('results');
        setIsUploading(true);
        setUploadError(null);

        try {
            const pdfBlob = generatePDF(finalScore);
            await api.submitAdmissionResult(userEmail, pdfBlob);
            console.log("✅ PDF Result successfully sent to backend");
        } catch (error) {
            console.error("❌ Failed to send PDF result:", error);
            setUploadError("Erreur lors de l'envoi des résultats au serveur.");
        } finally {
            setIsUploading(false);
        }
    };

    const formatTime = (seconds: number) => {
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
                                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium tracking-wider uppercase inline-block"
                            >
                                Bienvenue chez Rush School
                            </motion.span>
                            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tight leading-none">
                                Évaluez votre <br /> <span className="text-[#ff006e]">Potentiel</span>
                            </h1>
                            <p className="text-xl text-white/40 font-light leading-relaxed max-w-lg mx-auto">
                                Prêt pour l'entrée dans notre institution ? Relevez le défi et montrez-nous votre talent en 35 minutes.
                            </p>
                        </div>
                        <button
                            onClick={() => setStep('registration')}
                            className="group relative px-10 py-5 bg-white text-[#1b1121] font-bold text-xl rounded-2xl hover:bg-[#ff006e] hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
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
                        <div className="admission-test-glass p-10 rounded-3xl space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8a1ed2]/10 blur-3xl rounded-full"></div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-white">Identifiez-vous</h2>
                                <p className="text-white/40">Commençons par faire connaissance.</p>
                            </div>

                            <form onSubmit={startQuiz} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#8a1ed2] transition-colors" size={20} />
                                        <input
                                            required
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="Votre Nom & Prénom"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-5 focus:border-[#8a1ed2] outline-none transition-all text-lg placeholder:text-white/20 text-white"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Send className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#8a1ed2] transition-colors" size={20} />
                                        <input
                                            required
                                            type="email"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            placeholder="Votre adresse Email"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-5 focus:border-[#8a1ed2] outline-none transition-all text-lg placeholder:text-white/20 text-white"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-2 ml-1">Parcours souhaité</p>
                                        <GraduationCap className="absolute left-5 bottom-5 text-white/20 group-focus-within:text-[#8a1ed2] transition-colors pointer-events-none" size={20} />
                                        <select
                                            value={quizType}
                                            onChange={(e) => setQuizType(e.target.value)}
                                            disabled={!!selectedFormation}
                                            className={`w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-5 focus:border-[#8a1ed2] outline-none transition-all appearance-none cursor-pointer text-lg text-white/70 hover:border-white/20 ${selectedFormation ? 'opacity-75 cursor-not-allowed' : ''}`}
                                        >
                                            <option value="mco" className="bg-[#1b1121]">MCO - Management Commercial Opérationnel</option>
                                            <option value="bachelor" className="bg-[#1b1121]">Bachelor - Responsable Développement</option>
                                            <option value="ndrc" className="bg-[#1b1121]">NDRC - Relation Client Digitale</option>
                                            <option value="tpntc" className="bg-[#1b1121]">TP NTC - Négociateur Technico-Commercial</option>
                                        </select>
                                        <ChevronDown className="absolute right-5 bottom-5 text-white/30 pointer-events-none group-focus-within:text-[#8a1ed2] transition-colors" size={22} />
                                    </div>
                                </div>

                                <div className="bg-[#ff006e]/10 border border-[#ff006e]/20 p-5 rounded-2xl flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-xl bg-[#ff006e] flex items-center justify-center shrink-0">
                                        <Timer className="text-white" size={24} />
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-white font-bold italic">Chronomètre : 35 Minutes</p>
                                        <p className="text-white/50">Le test s'auto-soumettra à la fin du temps.</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-white text-[#1b1121] font-bold text-xl rounded-2xl hover:bg-[#8a1ed2] hover:text-white transition-all transform hover:scale-[1.02]"
                                >
                                    Lancer le Test
                                </button>
                            </form>
                        </div>
                    </motion.div>
                );

            case 'quiz':
                if (!quizData[quizType]) return <div className="text-white">Erreur de chargement du quiz</div>;
                const q = quizData[quizType].questions[currentQuestionIdx];
                const progress = ((currentQuestionIdx + 1) / quizData[quizType].questions.length) * 100;

                return (
                    <div className="w-full max-w-5xl mx-auto px-4 pb-20">
                        {/* Quiz Header */}
                        <div className="fixed top-0 left-0 right-0 z-40 px-6 py-4 admission-test-glass border-none bg-[#1b1121]/80 backdrop-blur-xl">
                            <div className="max-w-7xl mx-auto flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#8a1ed2] flex items-center justify-center font-bold text-lg text-white">
                                        {userName[0] || '?'}
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Candidat</p>
                                        <p className="text-sm font-bold truncate max-w-[150px] text-white">{userName}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-2 flex-grow mx-10">
                                    <div className="w-full max-w-md h-2 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-gradient-to-r from-[#8a1ed2] to-[#ff006e] rounded-full"
                                        />
                                    </div>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Progression</p>
                                </div>

                                <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all ${timeLeft < 300 ? 'bg-[#ff006e]/20 border-[#ff006e] animate-pulse' : 'bg-white/5 border-white/10'}`}>
                                    <Timer className={timeLeft < 300 ? 'text-[#ff006e]' : 'text-[#8a1ed2]'} size={20} />
                                    <span className={`text-xl font-mono font-bold ${timeLeft < 300 ? 'text-[#ff006e]' : 'text-white'}`}>{formatTime(timeLeft)}</span>
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
                                    <span className="px-4 py-1.5 rounded-full bg-[#8a1ed2]/20 border border-[#8a1ed2]/20 text-[#8a1ed2] text-xs font-bold uppercase tracking-widest">
                                        {q.section}
                                    </span>
                                    <div className="flex justify-between items-end">
                                        <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl text-white">
                                            {q.text}
                                        </h2>
                                        <span className="text-2xl font-mono text-white/20 shrink-0">
                                            Q <span className="text-white/60">{currentQuestionIdx + 1}</span><span className="text-white/10">/{quizData[quizType].questions.length}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((opt: string, idx: number) => {
                                        const isSelected = userAnswers[currentQuestionIdx] === idx;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => selectOption(idx)}
                                                className={`group relative flex items-center gap-6 p-6 rounded-3xl transition-all duration-300 border text-left ${isSelected
                                                    ? 'border-[#ff006e] bg-[#ff006e]/10 shadow-[0_0_30px_rgba(255,0,110,0.15)]'
                                                    : 'border-white/5 bg-white/5 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-[#ff006e] bg-[#ff006e]' : 'border-white/20 group-hover:border-white/40'
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
                                        className="px-8 py-5 admission-test-glass rounded-2xl flex items-center gap-3 font-bold hover:bg-white/10 transition-all text-white"
                                    >
                                        <ChevronLeft size={24} /> Précédent
                                    </button>
                                )}
                                <button
                                    onClick={nextQuestion}
                                    disabled={userAnswers[currentQuestionIdx] === null}
                                    className={`flex-grow py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-xl transition-all ${userAnswers[currentQuestionIdx] === null
                                        ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                        : 'bg-white text-[#1b1121] shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-98'
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
                        <div className="admission-test-glass p-12 rounded-[40px] text-center space-y-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-[#8a1ed2]/10 to-transparent pointer-events-none"></div>

                            <div className="relative">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#8a1ed2] to-[#ff006e] rounded-3xl mx-auto flex items-center justify-center shadow-2xl rotate-3">
                                    <Award className="text-white" size={48} />
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#8a1ed2]/20 blur-3xl -z-10"></div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-4xl font-bold text-white">Félicitations, <br /> {userName} !</h2>
                                <p className="text-white/40">Le test est terminé. Votre candidature va maintenant être examinée par notre équipe pédagogique.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                    <p className="text-xs text-white/30 uppercase font-bold tracking-widest mb-1">Score Final</p>
                                    <p className="text-4xl font-mono font-bold text-[#ff006e]">{score}<span className="text-lg text-white/20">/40</span></p>
                                </div>
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                                    <p className="text-xs text-white/30 uppercase font-bold tracking-widest mb-1">Parcours</p>
                                    <p className="text-xl font-bold truncate text-[#8a1ed2] uppercase">{quizType}</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-6">
                                {isUploading ? (
                                    <div className="w-full py-5 bg-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-3">
                                        <Loader2 size={24} className="animate-spin text-[#8a1ed2]" />
                                        Envoi des résultats...
                                    </div>
                                ) : uploadError ? (
                                    <div className="w-full py-4 bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-2xl text-sm font-bold">
                                        {uploadError}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-400/10 py-4 rounded-2xl border border-emerald-400/20">
                                        <CheckCircle2 size={16} /> Résultats envoyés avec succès
                                    </div>
                                )}
                                
                                <Button
                                    variant="success"
                                    className="w-full py-5 text-lg mt-4"
                                    onClick={onFinish}
                                    leftIcon={<CheckCircle2 size={24} />}
                                >
                                    Retour au dossier
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-20 relative">
            <div className="admission-test-grain"></div>
            <div className="admission-test-blob top-[-10%] left-[-10%]"></div>
            <div className="admission-test-blob bottom-[-10%] right-[-10%] animate-pulse-slow"></div>

            {renderStep()}
        </div>
    );
}
