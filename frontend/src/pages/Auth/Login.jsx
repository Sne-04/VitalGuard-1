import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex justify-center"
            >
                <SignIn routing="path" path="/login" signUpUrl="/register" forceRedirectUrl="/check" />
            </motion.div>
        </div>
    );
};

export default Login;
