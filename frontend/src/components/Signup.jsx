import React, { useState } from 'react';
import { signup } from '../api';

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        company_name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signup(formData);
            onSignupSuccess();
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="bg-white p-10 rounded-3xl border border-emerald-100 shadow-2xl w-full max-w-md transform transition-all duration-500">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 -rotate-3">
                        <span className="text-white font-bold text-2xl">F</span>
                    </div>
                </div>
                <h2 className="text-4xl font-black text-center mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tighter">
                    Financial Engine
                </h2>
                <p className="text-gray-500 text-center mb-8 font-medium">Create your professional account today.</p>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold flex items-center gap-2 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {error}
                </div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Full Name</label>
                            <input
                                name="full_name"
                                type="text"
                                value={formData.full_name}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Company</label>
                            <input
                                name="company_name"
                                type="text"
                                value={formData.company_name}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                placeholder="Acme Inc."
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 ml-1 uppercase tracking-wider">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/25 disabled:opacity-50 mt-4 active:scale-95"
                    >
                        {loading ? 'Registering Account...' : 'Initialize Financial AI'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-gray-500 font-medium">
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="text-emerald-600 hover:text-emerald-700 font-bold underline decoration-2 underline-offset-4">
                            Sign in instead
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
