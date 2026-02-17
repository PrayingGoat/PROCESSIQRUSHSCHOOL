import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdmissionTest from './AdmissionTest';
import { useAppStore } from '../store/useAppStore';

const TestPage = () => {
    const [searchParams] = useSearchParams();
    const formation = searchParams.get('formation');
    const navigate = useNavigate();
    const { draftStudent } = useAppStore();

    const handleFinish = () => {
        navigate('/admission');
    };

    return (
        <div className="min-h-screen bg-[#1b1121] text-white overflow-hidden relative">
            <AdmissionTest
                selectedFormation={formation}
                onFinish={handleFinish}
                initialUserData={draftStudent || undefined}
            />
        </div>
    );
};

export default TestPage;
