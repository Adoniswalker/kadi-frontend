"use client"

import React, {useState} from "react";
import api from "@/lib/axios";
import axios from "axios";
import {useRouter} from "next/navigation";
import {string} from "postcss-selector-parser";

type InputErrors = {
    [key: string]: string[];
};

function isValidKenyanPhoneNumber(phoneNumber: string): boolean {
    const phonePattern = /^(\+254|0)([7][0-9]|[1][0-1]){1}[0-9]{1}[0-9]{6}$/;
    return phonePattern.test(phoneNumber);
}

function isValidPassword(password: string): boolean {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(password);
}

export default function Signup() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phone_number: '',
        name: '',
        confirm_password: ''
    });
    const [errors, setErrors] = useState<InputErrors>({
        email: [],
        password: [],
        phone_number: [],
        name: [],
        confirm_password: []
    });
    const [success, setSuccess] = useState('');
    const [generalError, setGeneralError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        if (errors[name]) {
            setErrors({...errors, [name]: []});
        }
    };
    const validateForm = (): boolean => {
        let hasErrors = false;
        let newErrors: InputErrors = {email: [], password: [], phone_number: [], name: [], confirm_password: []};
        if (formData.confirm_password !== formData.password) {
            newErrors.confirm_password.push("Passwords do not match");
            hasErrors = true;
        }
        if (formData.phone_number && !isValidKenyanPhoneNumber(formData.phone_number)) {
            newErrors.phone_number.push("Invalid kenyan phone number");
            hasErrors = true;
        }
        if (!isValidPassword(formData.password)) {
            newErrors.password.push("Password should be atleast 8 characters long, have a number and capital letter");
            hasErrors = true;
        }
        setErrors(newErrors);
        return hasErrors;
    }
    const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        if (validateForm()) return;
        try {
            const response = await api.post('signup/', formData);
            localStorage.setItem('token', response.data.token);
            setSuccess('Signup successful!');
            setGeneralError('');
            router.push('/dashboard');
        } catch (err) {
            if (axios.isAxiosError(err)) {
                let errors_ = {...errors};
                for (let key in err.response?.data) {
                    errors_[key] = err.response.data[key];
                }
                console.log(err.response?.data);
                setErrors(errors_);
                setGeneralError(err.response?.data?.message);
            } else {
                console.log('Signup failed', err);
                setGeneralError('Signup failed');
            }
        }
    };

    return (
        <form className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow-lg" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Signup</h1>
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                    type="text"
                    id="name"
                    name='name'
                    placeholder="Your name"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name.length > 0 && errors.name.map(error => <p style={{color: 'red'}}>{error}</p>)}
            </div>
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
                {errors.email.length > 0 && errors.email.map(error => <p style={{color: 'red'}}>{error}</p>)}
            </div>
            <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                    id="phone"
                    type="tel"
                    name="phone_number"
                    placeholder="Your phone"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.phone_number.length > 0 && errors.phone_number.map(error => <p
                    style={{color: 'red'}}>{error}</p>)}
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
                {errors.password.length > 0 && errors.password.map(error => <p style={{color: 'red'}}>{error}</p>)}
            </div>
            <div className="mb-4">
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2"> Confirm
                    Password</label>
                <input
                    id="password_confirmation"
                    type="password"
                    name='confirm_password'
                    placeholder="Your password"
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.confirm_password.length > 0 && errors.confirm_password.map(error => <p
                    style={{color: 'red'}}>{error}</p>)}
            </div>
            <button type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blu">Submit
            </button>
            {success && <p style={{color: 'green'}}>{success}</p>}
            {generalError && <p style={{color: 'red'}}>{generalError}</p>}
        </form>
    );
}
