import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const withRoleProtection = (
    WrappedComponent: React.FC,
    allowedRoles: string[],
    redirectPath: string = '/'
) => {
    const ProtectedComponent: React.FC = (props) => {
        const router = useRouter();
        const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

        useEffect(() => {
            const user = localStorage.getItem('loggedInUser');
            if (user) {
                const parsedUser = JSON.parse(user);
                if (allowedRoles.includes(parsedUser.role)) {
                    setIsAuthorized(true); // Allow rendering
                } else {
                    router.push(redirectPath); // Redirect unauthorized users
                }
            } else {
                router.push('/login'); // Redirect unauthenticated users
            }
        }, [router]);

        // Render a loading state while the authorization check is in progress
        if (isAuthorized === null) {
            return <div>Loading...</div>; // You can customize this with a loading spinner
        }

        return <WrappedComponent {...props} />;
    };

    return ProtectedComponent;
};

export default withRoleProtection;
