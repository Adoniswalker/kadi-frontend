'use client'
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

const Dashboard = () => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login'); // Redirect to login if not authenticated
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) return null; // Prevent rendering until authentication is confirmed

    return (
        <div>
            <h1>Welcome to your Dashboard</h1>
            <p>You are logged in!</p>
        </div>
    );
};

export default Dashboard;