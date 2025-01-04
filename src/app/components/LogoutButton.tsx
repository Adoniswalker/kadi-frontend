// components/LogoutButton.tsx
import { useRouter } from 'next/router';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/auth/login');
    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
