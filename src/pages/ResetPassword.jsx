import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5283/api/Connexion/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Erreur");
        return;
      }

      setMessage("Mot de passe modifié avec succès 🎉");

      setTimeout(() => {
        navigate("/connexion");
      }, 2000);

    } catch (error) {
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">

        <h2 className="text-2xl font-bold mb-4 text-green-700">
          Réinitialisation du mot de passe
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Votre email"
            className="w-full border p-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Nouveau mot de passe"
            className="w-full border p-3 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white p-3 rounded"
          >
            {loading ? "Modification..." : "Modifier le mot de passe"}
          </button>

          {message && (
            <p className="text-center text-sm mt-2 text-red-600">
              {message}
            </p>
          )}

        </form>
      </div>
    </div>
  );
}