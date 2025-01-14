"use client"

import React, {useState} from "react";
import api from "@/lib/axios";
import axios from "axios";
import {useRouter} from "next/navigation";

export default function Signup() {
    const [formData, setFormData] = useState({email: '', password: ''});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };
    const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        try {
            const response = await api.post('login/', formData);
            localStorage.setItem('token', response.data.token);
            setSuccess('Login successful!');
            setError('');
            router.push('/dashboard');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Login failed');
            }
            console.log(err);
            setError('Login failed')
        }
    };

    return (
        <form className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow-lg" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h1>

            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Your email"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Your password"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blu">Login
            </button>
            {success && <p style={{color: 'green'}}>{success}</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
        </form>
    );
}
