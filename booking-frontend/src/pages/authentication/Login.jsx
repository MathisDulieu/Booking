import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { LoginRequest } from "../../hooks/AuthenticationHooks";

const API_BASE_URL = "https://your-api.com"; // Remplacez par votre URL d'API

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Adresse e-mail invalide.");
            return;
        }

        setLoading(true);
        try {
            const response = await LoginRequest({ email, password });
            console.log("Connexion réussie:", response);
            // Rediriger l'utilisateur ou stocker le token ici
            if (response.authToken) {
                localStorage.setItem("token", response.authToken);
                setIsAuthenticated(true)
            }
            else {
                setError("Échec de la connexion. Vérifiez vos informations.");
            }

            setTimeout(() => {
                window.location.replace("/");
            }, 2000);
        } catch {
            setError("Échec de la connexion. Vérifiez vos informations.");
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto my-20">
            <h1 className="text-4xl font-medium">Connexion</h1>
            <p className="text-slate-500 my-2">
                Bonjour, ravi de vous revoir 👋
            </p>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <form onSubmit={handleSubmit} className="my-16">
                <div className="flex flex-col space-y-5">
                    <label htmlFor="email">
                        <p className="font-medium text-slate-700 pb-2">
                            Adresse e-mail
                        </p>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                            placeholder="Entrez votre adresse e-mail"
                        />
                    </label>
                    <label htmlFor="password" className="relative">
                        <p className="font-medium text-slate-700 pb-2">
                            Mot de passe
                        </p>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                                placeholder="Entrez votre mot de passe"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </label>
                    <div className="flex flex-row justify-between">
                        <a
                            href="/envoyer-email-validation"
                            className="font-medium text-indigo-600"
                        >
                            E-mail non validé ?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                    <p className="text-center">
                        Pas encore inscrit ?
                        <a
                            href="/inscription"
                            className="text-indigo-600 font-medium inline-flex space-x-1 items-center"
                        >
                            <span>S'inscrire maintenant </span>
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Login;
