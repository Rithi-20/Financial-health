import React, { useState } from 'react';
import { login } from '../api';

const Login = ({ onLogin, onSwitchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await login(email, password);
            sessionStorage.setItem('token', data.access_token);
            onLogin(data.user);
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="bg-white p-10 rounded-3xl border border-emerald-100 shadow-2xl w-full max-w-md transform transition-all duration-500">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 rotate-3">
                        <span className="text-white font-bold text-2xl">F</span>
                    </div>
                </div>
                <h2 className="text-4xl font-black text-center mb-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent tracking-tighter">
                    Financial Engine
                </h2>
                <p className="text-gray-500 text-center mb-10 font-medium">Welcome back! Please enter your details.</p>

                {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-8 text-sm font-semibold flex items-center gap-2 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {error}
                </div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                            placeholder="name@company.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/25 disabled:opacity-50 mt-4 active:scale-95"
                    >
                        {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                    <p className="text-gray-500 font-medium">
                        New here?{' '}
                        <button onClick={onSwitchToSignup} className="text-emerald-600 hover:text-emerald-700 font-bold underline decoration-2 underline-offset-4">
                            Create your account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
