import image1 from "../assets/fond2.jpg";
import { useState, useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { initierPaiement } from "../services/camerpay";
import axios from "axios";
import {
   faLocationDot,
  faTimes,
  faArrowLeft,
  faMagnifyingGlass,
  faBell,
  faUser,
  faBars,
  faXmark,
  faCartShopping
} from '@fortawesome/free-solid-svg-icons';

export default function Container(){
    return(
      <>
      <Navbar/>
        <Marketplace/>
      </>
    )
}
function Marketplace() {
  /* ================= STATES ================= */

  const [selectedCategory, setSelectedCategory] = useState('tout');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [nomClient, setNomClient] = useState('');
  const [telephoneClient, setTelephoneClient] = useState('');
  const [emailClient, setEmailClient] = useState('');
  const [loadingPaiement, setLoadingPaiement] = useState(false);
  const [panier, setPanier] = useState([]);
  const [ouvrirPanier, setOuvrirPanier] = useState(false);

  // 🔥 AJOUT API DATA
  const [products, setProducts] = useState([]);

  /* ================= FETCH API ================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5283/api/annonce");

        if (!res.ok) {
          throw new Error("Erreur chargement annonces");
        }

        const data = await res.json();

        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);
  const ajouterAuPanier = (produit) => {
    const existe = panier.find((p) => p.id === produit.id);

    if (existe) {
      setPanier(
        panier.map((p) =>
          p.id === produit.id
            ? { ...p, quantite: p.quantite + 1 }
            : p
        )
      );
    } else {
      setPanier([...panier, { ...produit, quantite: 1 }]);
    }
  };

  const confirmOrder = async () => {
  if (!nomClient || !telephoneClient) {
    alert("Veuillez remplir votre nom et téléphone");
    return;
  }

  setLoadingPaiement(true);
  try {
    const data = await initierPaiement(
      selectedProduct.prix,
      selectedProduct.titre,
      { nom: nomClient, telephone: telephoneClient,email: emailClient  }
    );

    if (data.pay_url) {
      window.location.href = data.payment_url;
    } else {
      alert("Erreur lors du paiement");
    }
  } catch (error) {
    console.error(error);
    alert("Erreur de connexion");
  } finally {
    setLoadingPaiement(false);
  }
};

  /* ================= FILTRE ================= */

  const filteredProducts = products.filter((product) => {
  const categoryOk =
    selectedCategory === "tout" ||
    product.categorie?.toLowerCase() === selectedCategory.toLowerCase();

  const searchOk =
    product.titre?.toLowerCase().includes(searchTerm.toLowerCase());

  return categoryOk && searchOk;
  });

  /* ================= SIDEBAR ================= */

  const openSidebar = (product) => {
    setSelectedProduct(product);
    setIsSidebarOpen(true);
    setCheckoutComplete(false);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedProduct(null);
    setCheckoutComplete(false);
  };

  /* ================= UI ================= */

  return (
    <>
      <div className="w-full">
        <main
          id="hero"
          className="relative h-[500px] bg-cover bg-center text-white"
          style={{
            backgroundImage: `url(${image1})`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(4,77,45,0.9) 0%, rgba(4,77,45,0.75) 35%, rgba(241,135,42,0.85) 100%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Bienvenue sur le Marketplace
            </h1>

            <p className="text-lg md:text-xl text-white max-w-3xl mb-8">
              Découvrez une variété de produits recyclables et de services proposés
              par nos vendeurs partout au Cameroun.
            </p>
            {/* SEARCH */}
            <div className=" w-full max-w-200 flex justify-center items-baseline my-8">
              <div className="relative w-full">
                {/* Icône à gauche */}
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                {/* Input avec padding gauche pour l'icône */}
                <input
                  type="search"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pl-10 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* CATEGORIES */}
      <div className="flex justify-center items-center gap-4 mt-20 mb-12">
        <button onClick={() => setSelectedCategory("tout")} className="bg-green-600 hover:bg-green-800 text-white px-6 py-2 rounded-full font-semibold transition">
          Tout
        </button>

        <button onClick={() => setSelectedCategory("plastique")} className="border-1 border-green-600 hover:bg-green-800 text-green-600 px-6 py-2 rounded-full font-semibold transition">
          Plastique
        </button>

        <button onClick={() => setSelectedCategory("metaux")} className="border-1 border-green-600 hover:bg-green-800 text-green-600 px-6 py-2 rounded-full font-semibold transition">
          Métaux
        </button>

        <button onClick={() => setSelectedCategory("automobile")} className="border-1 border-green-600 hover:bg-green-800 text-green-600 px-6 py-2 rounded-full font-semibold transition">
          Automobile
        </button>

        <button onClick={() => setSelectedCategory("electronique")} className="border-1 border-green-600 hover:bg-green-800 text-green-600 px-6 py-2 rounded-full font-semibold transition">
          Électronique
        </button>
        <button onClick={() => setSelectedCategory("electromenager")} className="border-1 border-green-600 hover:bg-green-800 text-green-600 px-6 py-2 rounded-full font-semibold transition">
          Papier & Carton
        </button>
      </div>

      {/* PRODUITS */}
      <div className="p-10" id="featured">

        <div className="flex flex-wrap gap-6 mt-6 justify-center">
          {filteredProducts.map((product) => (
            <div key={product.id} className="max-w-sm w-100 bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition">

              <div className="relative">
                <img
                  src={product.photo}
                  alt={product.titre}
                  className="w-full h-56 object-cover"
                />

                <span className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                  {product.categorie}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900">
                  {product.titre}
                </h3>

                <p className="text-xl font-bold text-green-700 mt-2">
                  {product.prix} FCFA
                </p>

                <div className="mt-4 text-gray-500 text-sm flex items-center gap-2">
                  <FontAwesomeIcon icon={faLocationDot} />
                  {product.proprietaire?.ville} - {product.proprietaire?.quartier}
                </div>

                <div className="border-t border-gray-200 my-5"></div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">
                      {product.proprietaire?.nom?.charAt(0)}
                      {product.proprietaire?.prenom?.charAt(0)}
                    </div>
                    <span className="text-gray-700">{product.proprietaire?.nom} {product.proprietaire?.prenom}</span>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-5">
                  <button
                    type="button"
                    onClick={() => openSidebar(product)}
                    className="w-full mt-5 bg-linear-to-r from-emerald-500 via-green-600 to-emerald-700 text-white py-3 rounded-full font-semibold shadow-lg transition"
                  >
                    Acheter
                  </button>
                  <button
                    type="button"
                     onClick={() => ajouterAuPanier(product)}
                    className="w-full mt-5 bg-linear-to-r from-orange-300 via-orange-400 to-orange-600 text-white py-3 rounded-full font-semibold shadow-lg transition"
                  >
                    Panier
                  </button>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SIDEBAR */}
      {isSidebarOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex">

          <div className="fixed inset-0 bg-black/40" onClick={closeSidebar} />

          <div className="relative ml-auto w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto">

            <button
              type="button"
              onClick={closeSidebar}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>

            <div className="mt-8">

              <h2 className="text-2xl font-bold text-gray-900">
                {selectedProduct.titre}
              </h2>

              <p className="mt-3 text-gray-600">
                {selectedProduct.categorie} • {selectedProduct.location}
              </p>

              <div className="mt-6 space-y-4">

                <div className="rounded-2xl bg-green-50 p-4">
                  <span className="text-lg font-semibold text-green-700">
                    {selectedProduct.prix} FCFA
                  </span>
                </div>
                <div className='grid grid-cols-2 gap-4 justify-center items-center'>
                  <img src='./images/MTN.jpg' alt="imc" className='shadow-2xl p-2 rounded-2xl h-20 w-40 hover:-translate-y-2 transition-all duration-300 cursor-pointer'/>
                  <img src='./images/orange.jpg' alt="imc" className='shadow-2xl hover:-translate-y-2 transition-all duration-300  p-2 rounded-2xl h-20 w-40 cursor-pointer'/>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <input
                    type="text"
                    placeholder="Nom complet"
                    value={nomClient}
                    onChange={(e) => setNomClient(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={emailClient}
                    onChange={(e) => setEmailClient(e.target.value)}
                    className="w-full px-4 py-3 mt-3 rounded-xl border border-gray-200"
                  />
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    value={telephoneClient}
                    onChange={(e) => setTelephoneClient(e.target.value)}
                    className="w-full px-4 py-3 mt-3 rounded-xl border border-gray-200"
                  />
                </div>

                <button
                  type="button"
                  onClick={confirmOrder}
                  disabled={loadingPaiement}
                  className="w-full bg-linear-to-r from-emerald-500 via-green-600 to-emerald-700 text-white py-3 rounded-full font-semibold"
                >
                  {loadingPaiement ? "Traitement..." : "Terminer la commande"}
                </button>

                {checkoutComplete && (
                  <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-green-800">
                    Votre commande est prise en compte !
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
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
