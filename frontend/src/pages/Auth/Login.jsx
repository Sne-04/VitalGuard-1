import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

const Login = () => (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg-base)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
            className="w-full flex flex-col items-center">
            <div className="flex items-center gap-2.5 mb-8">
                <div className="w-9 h-9 flex items-center justify-center" style={{ background: 'var(--accent)' }}>
                    <HeartPulse className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">
                    <span style={{ color: 'var(--text-primary)' }}>Vital</span>
                    <span style={{ color: 'var(--accent)' }}>Guard</span>
                    <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-muted)' }}>AI</span>
                </span>
            </div>
            <SignIn routing="path" path="/login" signUpUrl="/register" forceRedirectUrl="/check" />
        </motion.div>
    </div>
);

export default Login;
