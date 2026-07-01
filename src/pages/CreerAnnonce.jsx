import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faImage, faTimes, faTriangleExclamation, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function CreerAnnonce() {
  const [formData, setFormData] = useState({
    categorie: '',
    titre: '',
    etat: 'bon',
    prix: '',
    photos: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const categories = [
    { value: 'electronique', label: 'Électronique' },
    { value: 'metal', label: 'Métal & Fer' },
    { value: 'plastique', label: 'Plastique' },
    { value: 'verre', label: 'Verre' },
    { value: 'papier', label: 'Papier & Carton' },
    { value: 'automobile', label: 'Carcasse automobile' },
    { value: 'autre', label: 'Autre' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files].slice(0, 5), // Max 5 photos
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setApiError('');
  setSuccess(false);

  const newErrors = {};

  if (!formData.categorie)
    newErrors.categorie = 'Catégorie requise';

  if (!formData.titre)
    newErrors.titre = 'Titre requis';

  if (!formData.etat)
    newErrors.etat = 'Etat requis';

  if (!formData.prix)
    newErrors.prix = 'Prix requis';

  if (formData.photos.length === 0)
    newErrors.photos = 'Au moins une photo requise';

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    setLoading(false);
    return;
  }

  try {
   const token = localStorage.getItem("token");

    const form = new FormData();

    form.append("titre", formData.titre);
    form.append("categorie", formData.categorie);
    form.append("etat", formData.etat);
    form.append("prix", formData.prix);

    // ⚠️ ici c'est le FICHIER pas le nom
    form.append("file", formData.photos[0]);

    const response = await fetch("http://localhost:5283/api/Annonce", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    });

    const data = await response.json();

    console.log("Réponse API :", data);

    if (!response.ok) {
      throw new Error(
        data.message ||
        JSON.stringify(data) ||
        "Erreur lors de la création"
      );
    }

    setSuccess(true);

    setFormData({
      categorie: '',
      titre: '',
      etat: 'bon',
      prix: '',
      photos: [],
    });

    setErrors({});
  }
  catch (error) {
    console.error(error);
    setApiError(error.message);
  }
  finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 mb-3">
            Créer une annonce
          </h1>
          <p className="text-gray-600 text-lg">
            Vendez vos déchets recyclables en quelques minutes
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center font-medium flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-700" />
            <span>Annonce créée avec succès ! Elle sera bientôt en ligne.</span>
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Catégorie */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Catégorie *
              </label>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.categorie && (
                <p className="text-red-600 text-sm mt-2">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />{errors.categorie}
                </p>
              )}
            </div>

            {/* Titre et Description */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre de l'annonce *
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="Ex: Réfrigérateur Samsung en panne"
                  maxLength="100"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.titre.length}/100</p>
                {errors.titre && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500" /> {errors.titre}
                  </p>
                )}
              </div>
            </div>

            {/* Quantité et État */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  État de l'article
                </label>
                <select
                  name="etat"
                  value={formData.etat}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="bon">En Panne</option>
                  <option value="a-reparer">Hors service</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prix (FCFA) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="prix"
                    value={formData.prix}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
                    placeholder="0"
                    min="0"
                  />
                  <span className="absolute right-4 top-3 text-gray-500">FCFA</span>
                </div>
                {errors.prix && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500" /> {errors.prix}
                  </p>
                )}
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Photos (Max 5) *
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-700 transition">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="sr-only"
                  id="photo-input"
                />
                <label htmlFor="photo-input" className="cursor-pointer">
                  <div className="text-4xl mb-2 text-green-700">
                    <FontAwesomeIcon icon={faCamera} />
                  </div>
                  <p className="text-gray-700 font-semibold">Cliquez pour ajouter des photos</p>
                  <p className="text-gray-500 text-sm">ou glissez-déposez vos fichiers</p>
                  <p className="text-gray-400 text-xs mt-2">JPG, PNG - Max 5 Mo par photo</p>
                </label>
              </div>

              {/* Photos preview */}
              {formData.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-1 text-gray-400">
                          <FontAwesomeIcon icon={faImage} />
                        </div>
                        <p className="text-xs text-gray-600 truncate">{photo.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errors.photos && (
                <p className="text-red-600 text-sm mt-2">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="mr-2" />{errors.photos}
                </p>
              )}
            </div>
            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white font-bold py-4 rounded-lg hover:from-green-800 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                  Publication en cours...
                </span>
              ) : (
                '✓ Publier l\'annonce'
              )}
            </button>

            <div className="text-center text-gray-600 text-sm">
              Retour à l'accueil : <a href="/" className="text-green-700 font-semibold hover:underline">MBOA GREEN</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
