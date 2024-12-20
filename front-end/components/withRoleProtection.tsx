import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const withRoleProtection = (WrappedComponent: React.FC, allowedRoles: string[]) => {
    const ProtectedComponent: React.FC = (props) => {
        const router = useRouter();
        const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

        useEffect(() => {
            const user = localStorage.getItem('loggedInUser');
            if (user) {
                const parsedUser = JSON.parse(user);
                if (allowedRoles.includes(parsedUser.role)) {
                    setIsAuthorized(true);
                } else {
                    router.replace('/unauthorized');
                }
            } else {
                router.replace('/login');
            }
        }, [router]);

        if (isAuthorized === null) {
            return (
                <div className="flex items-center justify-center h-screen">
                    <p>Loading...</p>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };

    return ProtectedComponent;
};

export default withRoleProtection;
