import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCartShopping, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function Inscription() {
 
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    adresse: '',
    ville: '',
    quartier: '',
    acceptTerms: false,
    newsletter: false,
    userType: 'vendeur' // AJOUT IMPORTANT
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [registeredUserType, setRegisteredUserType] = useState(null);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  if (!formData.nom) newErrors.nom = 'Le nom est requis';
  if (!formData.prenom) newErrors.prenom = 'Le prénom est requis';
  if (!formData.email) newErrors.email = "L'email est requis";
  if (!formData.telephone) newErrors.telephone = 'Le téléphone est requis';

  if (!formData.password || formData.password.length < 6) {
    newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }

  if (!formData.acceptTerms) {
    newErrors.acceptTerms = "Vous devez accepter les conditions d'utilisation";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);
  setApiError("");
  setErrors({});

  try {
    const response = await fetch("http://localhost:5283/api/User/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password,
        adresse: formData.adresse,
        ville: formData.ville,
        quartier: formData.quartier,
        acceptTerms: formData.acceptTerms,
        newsletter: formData.newsletter,
        userType: formData.userType
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setApiError(data.message || "Erreur inscription");
      return;
    }

    setSuccess(true);
    setRegisteredUserType(formData.userType);

    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      password: "",
      confirmPassword: "",
      adresse: "",
      ville: "",
      quartier: "",
      acceptTerms: false,
      newsletter: false,
      userType: "vendeur",
    });

  } catch (error) {
    console.error(error);
    setApiError("Erreur serveur");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-3">
            MBOA<span className="text-orange-400">GREEN</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Rejoignez la plus grande marketplace de recyclage du Cameroun
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-700" />
            <span>Inscription réussie ! Bienvenue sur MBOA GREEN.</span>
          </div>
        )}

        {registeredUserType === 'vendeur' && success && (
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-3xl">
            <h2 className="text-lg font-semibold text-green-800 mb-3">
              Vous êtes inscrit en tant que vendeur.
            </h2>
            <p className="text-gray-700 mb-4">
              Vous pouvez rester sur l'accueil, consulter toutes les annonces publiées ou publier votre première annonce.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-block bg-white text-green-700 border border-green-200 px-4 py-2 rounded-full font-semibold hover:bg-green-50"
              >
                Retour à l'accueil
              </Link>
              <Link
                to="/marketplace"
                className="inline-block bg-green-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-800"
              >
                Voir les annonces publiées
              </Link>
              <Link
                to="/creerannonce"
                className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-orange-600"
              >
                Publier une annonce
              </Link>
            </div>
          </div>
        )}

        {apiError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {apiError}
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Type d'utilisateur */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Je suis un(e) :
              </label>
              <div className="grid grid-cols-2 gap-4">
                {['vendeur', 'acheteur'].map(type => (
                  <label key={type} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value={type}
                      checked={formData.userType === type}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 transition-all ${
                      formData.userType === type
                        ? 'border-green-700 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}>
                      <div className="text-center">
                        <div className="text-2xl mb-2">
                          {type === 'vendeur' ? (
                            <FontAwesomeIcon icon={faBox} className="text-3xl text-green-700" />
                          ) : (
                            <FontAwesomeIcon icon={faCartShopping} className="text-3xl text-green-700" />
                          )}
                        </div>
                        <div className="font-semibold text-gray-700 capitalize">
                          {type === 'vendeur' ? 'Vendeur' : 'Acheteur'}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Votre prénom"
                />
                {errors.prenom && <p className="text-red-600 text-sm mt-1">{errors.prenom}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Votre nom"
                />
                {errors.nom && <p className="text-red-600 text-sm mt-1">{errors.nom}</p>}
              </div>
            </div>

            {/* Email et Téléphone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="votre@email.com"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="+237 6XX XX XX XX"
                />
                {errors.telephone && <p className="text-red-600 text-sm mt-1">{errors.telephone}</p>}
              </div>
            </div>

            {/* Localisation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ville
                </label>
                <select
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="">Sélectionner une ville</option>
                  <option value="douala">Douala</option>
                  <option value="yaounde">Yaoundé</option>
                  <option value="buea">Buéa</option>
                  <option value="bafoussam">Bafoussam</option>
                  <option value="limbe">Limbé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quartier
                </label>
                <input
                  type="text"
                  name="quartier"
                  value={formData.quartier}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Votre quartier"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Min. 6 caractères"
                />
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmer mot de passe *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Confirmez le mot de passe"
                />
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Conditions d'utilisation */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-5 h-5 mt-1 rounded border-gray-300 text-green-700 cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  J'accepte les <a href="#" className="text-green-700 font-semibold hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-green-700 font-semibold hover:underline">politique de confidentialité</a> *
                </span>
              </label>
              {errors.acceptTerms && <p className="text-red-600 text-sm">{errors.acceptTerms}</p>}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                  className="w-5 h-5 mt-1 rounded border-gray-300 text-green-700 cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  Je souhaite recevoir les actualités et offres de MBOA GREEN
                </span>
              </label>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white font-bold py-3 rounded-lg hover:from-green-800 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription en cours...' : 'S\'inscrire maintenant'}
            </button>

            {/* Connexion */}
            <div className="text-center text-gray-600">
              Vous avez déjà un compte ? <a href="#" className="text-green-700 font-semibold hover:underline">Se connecter</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
