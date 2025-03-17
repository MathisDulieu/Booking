import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow shadow-slate-300 max-w-lg mx-auto my-20">
            <h1 className="text-4xl font-medium">Connexion</h1>
            <p className="text-slate-500 my-2">Bonjour, ravi de vous revoir 👋</p>

            <form action="" className="my-16">
                <div className="flex flex-col space-y-5">
                    <label htmlFor="email">
                        <p className="font-medium text-slate-700 pb-2">Adresse e-mail</p>
                        <input id="email" name="email" type="email" className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="Entrez votre adresse e-mail" />
                    </label>
                    <label htmlFor="password" className="relative">
                        <p className="font-medium text-slate-700 pb-2">Mot de passe</p>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                                placeholder="Entrez votre mot de passe"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </label>
                    <div className="flex flex-row justify-between">
                        <div>
                            <a href="/envoyer-email-validation" className="font-medium text-indigo-600">E-mail non validé ?</a>
                        </div>
                    </div>
                    <button className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>Se connecter</span>
                    </button>
                    <p className="text-center">Pas encore inscrit ?
                        <a href="/inscription" className="text-indigo-600 font-medium inline-flex space-x-1 items-center">
                            <span>S'inscrire maintenant </span>
                            <span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </span>
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Login;