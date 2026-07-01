import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faTriangleExclamation, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import ResetPassword from './ResetPassword';
export default function Connexion() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Effacer l'erreur du champ quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5283/api/Connexion/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setErrors({ general: data || "Erreur connexion" });
      return;
    }

    // 🔥 STOCKER TOKEN
    localStorage.setItem("token", data.token);

    // (optionnel) stock user aussi
    localStorage.setItem("user", JSON.stringify(data.user));

    setSuccess(true);

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);

  } catch (error) {
    console.error(error);
    setErrors({ general: "Erreur serveur" });
  }
};

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <a href="/" className="inline-block">
            <h1 className="text-4xl font-extrabold text-green-800">
              MBOA<span className="text-orange-400">GREEN</span>
            </h1>
          </a>
          <p className="text-gray-600 text-sm mt-2">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center font-medium flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-700" />
            <span>Connexion réussie ! Redirection en cours...</span>
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email ou téléphone
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                    errors.email
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:border-green-700 focus:ring-2 focus:ring-green-100'
                  }`}
                  placeholder="votre@email.com ou +237 6XX XX XX XX"
                />
                <FontAwesomeIcon icon={faEnvelope} className="absolute right-3 top-3 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500" /> {errors.email}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-semibold text-green-700">
                  Mot de passe
                </label>
                <Link to="/reset-password" className="text-sm text-green-700 font-semibold hover:underline">
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                    errors.password
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:border-green-700 focus:ring-2 focus:ring-green-100'
                  }`}
                  placeholder="Votre mot de passe"
                />
                <FontAwesomeIcon icon={faLock} className="absolute right-3 top-3 text-gray-400" />
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500" /> {errors.password}
                </p>
              )}
            </div>

            {/* Se souvenir de moi */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-green-700 cursor-pointer"
              />
              <span className="text-sm text-gray-700">Se souvenir de moi</span>
            </label>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-green-700 to-green-600 text-white font-bold py-3 rounded-lg hover:from-green-800 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OU</span>
              </div>
            </div>

            {/* Pas de compte */}
            <div className="text-center text-gray-600 text-sm">
              Pas encore de compte ? <a href="/inscription" className="text-green-700 font-semibold hover:underline">S'inscrire</a>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
