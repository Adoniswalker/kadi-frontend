import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { useRouter } from 'next/router';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                router.push('/login');
                return;
            }
            try {
                const response = await api.get('user/', {
                    headers: { Authorization: `Token ${token}` },
                });
                setUser(response.data);
            } catch (err) {
                setError('Failed to fetch user data');
                localStorage.removeItem('authToken');
                router.push('/login');
            }
        };
        fetchUser();
    }, [router]);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>Welcome, {user.email}!</h1>
            <p>Phone Number: {user.phone_number || 'N/A'}</p>
            <button onClick={() => {
                localStorage.removeItem('authToken');
                router.push('/login');
            }}>Log Out</button>
        </div>
    );
}