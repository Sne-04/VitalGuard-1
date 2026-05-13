const { createClerkClient } = require('@clerk/clerk-sdk-node');

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

exports.protect = async (req, res, next) => {
    console.log(`🛡️ Auth Middleware hit for: ${req.method} ${req.url}`);
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            console.log('🛡️ No token found in request');
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }

        try {
            // Verify token with Clerk
            const decoded = await clerkClient.verifyToken(token);
            if (!decoded || !decoded.sub) {
                return res.status(401).json({ success: false, message: 'Invalid Clerk token' });
            }

            const userId = decoded.sub;
            const user = await clerkClient.users.getUser(userId);
            
            req.user = {
                id: user.id,
                _id: user.id,
                name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User',
                email: user.emailAddresses[0]?.emailAddress,
                age: 30, // Default fallback
                gender: 'Not specified',
                medicalHistory: { comorbidities: [], allergies: [], currentMedications: [] }
            };
            return next();
        } catch (error) {
            console.error('Clerk verification error:', error);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    } catch (error) {
        console.error('Server auth error:', error);
        return res.status(500).json({ success: false, message: 'Server error in authentication' });
    }
};

