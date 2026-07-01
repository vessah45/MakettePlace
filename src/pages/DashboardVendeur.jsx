import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  faBoxOpen,
  faTrash,
  faLocationDot,
  faChartLine,
  faCoins,
  faTag,
  faBell,
  faXmark,
  faBars,
  faUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

/* =========================
   DASHBOARD
========================= */

export default function DashboardVendeur() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState("tous");
  const [confirmerSuppression, setConfirmerSuppression] = useState(null);

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    try {
      const res = await axios.get("http://localhost:5283/api/Annonce");

      const data = res.data.map((item) => ({
        id: item.id,
        nom: item.titre,
        prix: item.prix,
        categorie: item.categorie,
        lieu: "Non défini",
        image: item.photo,
        ventes: 0,
        statut: "actif",
      }));

      setProduits(data);
    } catch (err) {
      console.error("Erreur chargement produits:", err);
    } finally {
      setLoading(false);
    }
  };

  const supprimerProduit = (id) => {
    setProduits((prev) => prev.filter((p) => p.id !== id));
    setConfirmerSuppression(null);
  };

  const totalProduits = produits.length;
  const totalVentes = produits.reduce((a, p) => a + p.ventes, 0);
  const totalProfit = produits.reduce((a, p) => a + p.prix * p.ventes, 0);
  const produitsActifs = produits.filter((p) => p.statut === "actif").length;

  const produitsFiltres = produits.filter((p) => {
    if (filtre === "actif") return p.statut === "actif";
    if (filtre === "inactif") return p.statut === "inactif";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F7F9F7] font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center items-center h-40">
            Chargement des produits...
          </div>
        )}

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Mes annonces</h1>

          <Link to="/creerannonce" className="bg-green-700 text-white px-4 py-2 rounded-full">
            <FontAwesomeIcon icon={faPlus} /> Nouvelle annonce
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Kpi title="Produits" value={totalProduits} icon={faBoxOpen} />
          <Kpi title="Ventes" value={totalVentes} icon={faChartLine} />
          <Kpi title="Profit" value={totalProfit} icon={faCoins} />
          <Kpi title="Actifs" value={produitsActifs} icon={faTag} />
        </div>

        {/* FILTRES */}
        {/* <div className="flex gap-3 mb-6">
          {["tous", "actif", "inactif"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-4 py-2 rounded-full ${
                filtre === f ? "bg-green-700 text-white" : "bg-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div> */}
        <h1 className="text-3xl font-bold">Mes annonces</h1>

        {/* PRODUITS */}
        {produitsFiltres.length === 0 ? (
          <p>Aucun produit</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {produitsFiltres.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow p-4">
                <img src={p.image} className="h-40 w-full object-cover rounded" />

                <h3 className="font-bold mt-2">{p.nom}</h3>
                <p>{p.prix} FCFA</p>

                <button
                  onClick={() => setConfirmerSuppression(p.id)}
                  className="text-red-500 mt-2"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* MODAL DELETE */}
        {confirmerSuppression && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl">
              <p>Supprimer ce produit ?</p>

              <div className="flex gap-3 mt-4">
                <button onClick={() => setConfirmerSuppression(null)}>
                  Annuler
                </button>
                <button
                  onClick={() => supprimerProduit(confirmerSuppression)}
                  className="text-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   KPI COMPONENT
========================= */
function Kpi({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <FontAwesomeIcon icon={icon} />
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

/* =========================
   NAVBAR
========================= */

function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return; // pas connecté

      const res = await fetch("http://localhost:5283/api/User/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Erreur API");

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };
  const logout = () => {
  localStorage.removeItem("token"); // supprime session
  setUser(null); // vide utilisateur
};
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setOpen(false);
    }
  };

  return (
    <header className="bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-extrabold text-green-800">MBOA<span className="text-orange-400">GREEN</span></div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-green-800">Acceuil</Link>
            <Link to="/marketplace" className="hover:text-green-800">Marketplace</Link>  
            <Link to="/Dashboard" className="hover:text-green-800">Tableau de bord</Link>  
          </nav>
          <div className=" hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 text-sm text-green-800 font-semibold">
                <AvatarUpload/>
                {user.nom} {user.prenom}
                <button
                  onClick={logout}
                  className="ml-3 px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link className="hidden sm:inline-block bg-white text-green-700 px-4 py-2 rounded-full shadow" to="/inscription">
                  S'inscrire
                </Link>

                <Link className="hidden sm:inline-block bg-green-700 text-white px-4 py-2 rounded-full shadow hover:bg-green-800" to="/connexion">
                  Se connecter
                </Link>
              </>
            )}
          </div>
          <div className=" hidden md:flex">
            <Notification/>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-green-700 bg-white/90 hover:bg-white"
            >
              {open ? (
                <FontAwesomeIcon icon={faXmark} className="w-6 h-6" aria-hidden />
              ) : (
                <FontAwesomeIcon icon={faBars} className="w-6 h-6" aria-hidden />
              )}
            </button>
          </div>
        </div>

        <div className={`${open ? 'block' : 'hidden'} md:hidden pb-4`}> 
          <nav className="flex flex-col  gap-2 text-gray-700">
            <Link to="/" className="hover:text-green-800">Accueil</Link>
            <Link to="/marketplace" className="hover:text-green-800">Marketplace</Link>
            <Link to="/marketplace" className="hover:text-green-800">Tableau de bord</Link>
             <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 text-sm text-green-800 font-semibold">
                <AvatarUpload/>
                {user.nom} {user.prenom}
                <button
                  onClick={logout}
                  className="ml-3 px-3 py-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link className="hidden sm:inline-block bg-white text-green-700 px-4 py-2 rounded-full shadow" to="/inscription">
                  S'inscrire
                </Link>

                <Link className="hidden sm:inline-block bg-green-700 text-white px-4 py-2 rounded-full shadow hover:bg-green-800" to="/connexion">
                  Se connecter
                </Link>
              </>
            )}
            </div>
            <div>
            <Notification/>
          </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

{/*Photo de profil*/}
function AvatarUpload() {
  const inputRef = useRef(null);
  const [image, setImage] = useState(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      {/* Cercle cliquable */}
      <div
        onClick={handleClick}
        className="w-14 h-14 rounded-full bg-green-800 flex items-center justify-center cursor-pointer overflow-hidden"
      >
        {image ? (
          <img
            src={image}
            alt="Profil"
            className="w-full h-full object-cover"
          />
        ) : (
          <FontAwesomeIcon icon={faUser} className="text-white text-3xl" />
        )}
      </div>

      {/* Input caché */}
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />
    </div>
  );
}

{/*Notification*/}
function Notification() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    chargerNotifications();
  }, []);

  const chargerNotifications = async () => {
    try {
      const res = await axios.get(
        " http://localhost:5283/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const supprimerNotification = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5283/api/notifications/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Retirer la notification de la liste
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  } catch (err) {
    console.error(err);
  }
};

  const nonLues = notifications.filter(n => !n.estLue).length;

  return (
    <>
      {/* Icône */}
      <div
        className="relative cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon
          icon={faBell}
          className="text-2xl text-gray-700"
        />

        {nonLues > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
            {nonLues}
          </span>
        )}
      </div>

      {/* Fond noir */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 bg-white shadow-xl z-50 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">
            Notifications
          </h2>

          <FontAwesomeIcon
            icon={faXmark}
            className="text-xl cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="overflow-y-auto h-[calc(100vh-70px)]">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              Aucune notification.
            </p>
          ) : (
            notifications.map((notif) => (
            <div
              key={notif.id}
              className={`border-b p-4 hover:bg-gray-100 ${
                !notif.estLue ? "bg-pink-50" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{notif.titre}</h3>

                  <p className="text-gray-600 text-sm mt-1">
                    {notif.message}
                  </p>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notif.dateCreation).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => supprimerNotification(notif.id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  X
                </button>
              </div>
            </div>
          ))
          )}
        </div>
      </div>
    </>
  );
}