import { useEffect, useState,useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from "axios";
import {
  faArrowLeft,
  faCamera,
  faBell,
  faTag,
  faLocationDot,
  faCheck,
  faCity,
  faWallet,
  faUsers,
  faUser,
  faTrash,
  faBars,
  faXmark,
  faStar,
  faGlobe,
  faCoins,
  faHandshake,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import image4 from '../assets/image1.jpg';

const Icon = ({ name, className = 'w-5 h-5 text-green-600' }) => {
  const icons = {
    camera: faCamera,
    price: faTag,
    map: faLocationDot,
    check: faCheck,
    city: faCity,
    wallet: faWallet,
    users: faUsers,
  };

  const icon = icons[name];
  return icon ? <FontAwesomeIcon icon={icon} className={className} /> : null;
}

function Home() {
  return (
    <section className="scroll-smooth">
      <Navbar />
      <Body />
      <Footer />
    </section>
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
            <Link to="/marketplace" className="hover:text-green-800">Tableau de bord</Link>  
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

function Body() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const featuredProducts = [
    {
      id: 1,
      title: 'Carcasse Toyota Corolla 2008',
      price: '80 000 FCFA',
      category: 'Automobile',
      location: 'Bafoussam',
      seller: 'Théodore A.',
      rating: '4.9',
      reviews: 31,
      initial: 'T',
      image:  '/images/carcasse3.jpg',
    },
    {
      id: 2,
      title: 'Micro onde',
      price: '22 000 FCFA',
      category: 'Electromenager',
      location: 'Yaoundé',
      age: 'Il y a 2 jours',
      seller: 'Jean-Baptiste N.',
      rating: '4.9',
      reviews: 29,
      initial: 'J',
      image: '/images/carcasse2.jpg',
    },
    {
      id: 3,
      title: 'Réfrigérateur  en panne',
      price: '15 000 FCFA',
      category: 'Électroménager',
      location: 'Douala',
      age: 'Il y a 1 jour',
      seller: 'Paul M.',
      rating: '4.9',
      reviews: 34,
      initial: 'P',
      image:  '/images/Carcasse.jpg',
    },
    {
      id: 4,
      title: 'Moteur Peugeot 504 hors service',
      price: '35 000 FCFA',
      category: 'Automobile',
      location: 'Bafoussam',
      age: 'Il y a 5 jours',
      seller: 'Marie K.',
      rating: '4.9',
      reviews: 18,
      initial: 'M',
      image: '/images/carcasse4.jpg',
    },
  ];

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

  const confirmOrder = () => {
    setCheckoutComplete(true);
  };

  return (
    <>
      <main
        id="hero"
        className="relative min-h-100 bg-cover bg-center text-white"
        style={{
          backgroundImage: `url(${image4})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, rgba(4,77,45,0.9) 0%, rgba(4,77,45,0.75) 35%, rgba(241,135,42,0.85) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div className="relative">
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div className="text-left">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold max-w-2xl leading-tight drop-shadow-md text-white">
                  Transformez vos vieux appareils en <span className="text-orange-300">argent</span> liquide
                </h2>

                <p className="mt-6 max-w-xl text-lg text-gray-100">
                  Photo, prix, position — en 3 clics votre annonce est en ligne. Les recycleurs de votre ville vous contactent directement.
                </p>
              </div>

              <div className="hidden lg:block">
                {/* decorative area, kept empty to show background image */}
              </div>

              <div className=' mt-10 '>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4  '>
                    <div className='flex flex-col backdrop-blur-sm w-full justify-center items-center md:w-55 h-35 bg-gray-400/50 rounded-2xl'>
                      <span className='font-bold text-4xl'>1200+</span>
                      <span>Annonces actives</span>
                    </div>
                    <div className='flex flex-col backdrop-blur-sm justify-center items-center w-full md:w-55 h-35 bg-gray-400/50 rounded-2xl'>
                      <span className='font-bold text-4xl'>1000+</span>
                      <span>Utilisateur</span>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    <section className="bg-[#f7f5f0]">
        <section id="process" className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">

            <h1 className="text-4xl md:text-5xl font-bold text-green-800 text-center">
            Vendre en 4 étapes simples
            </h1>

            <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto mt-4">
            Pas besoin d'être expert. En quelques minutes, votre annonce est publiée
            et visible par des centaines de recycleurs professionnels.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

            {/* ETAPE 01 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative">
                <div className="absolute -top-4 left-6 bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold">
                ÉTAPE 01
                </div>

                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mt-4">
                <Icon name="camera" className="w-8 h-8 text-green-700" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-center">
                Prenez une photo
                </h3>

                <p className="mt-4 text-gray-600 text-center leading-7">
                Photographiez votre appareil en panne, votre carcasse de voiture ou
                tout autre déchet métallique.
                </p>
            </div>

            {/* ETAPE 02 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative">
                <div className="absolute -top-4 left-6 bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-xs font-bold">
                ÉTAPE 02
                </div>

                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mt-4">
                <Icon name="price" className="w-8 h-8 text-orange-600" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-center">
                Fixez votre prix
                </h3>

                <p className="mt-4 text-gray-600 text-center leading-7">
                Indiquez la quantité, l'état et votre prix souhaité grâce à notre
                guide d'estimation.
                </p>
            </div>

            {/* ETAPE 03 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative">
                <div className="absolute -top-4 left-6 bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold">
                ÉTAPE 03
                </div>

                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mt-4">
                <Icon name="map" className="w-8 h-8 text-green-700" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-center">
                Partagez votre position
                </h3>

                <p className="mt-4 text-gray-600 text-center leading-7">
                Activez la géolocalisation afin que les recycleurs proches voient
                votre annonce en priorité.
                </p>
            </div>

            {/* ETAPE 04 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative">
                <div className="absolute -top-4 left-6 bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-xs font-bold">
                ÉTAPE 04
                </div>

                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mt-4">
                <Icon name="check" className="w-8 h-8 text-orange-600" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-center">
                Concluez la vente
                </h3>

                <p className="mt-4 text-gray-600 text-center leading-7">
                Recevez des offres, négociez et planifiez la collecte directement
                depuis la plateforme.
                </p>
            </div>

            </div>
        </div>
        </section>
            <div className="p-10" id="featured">
              <h1 className="text-3xl font-bold text-green-800 text-center">Annonces à la une</h1>
              <div className="flex flex-wrap gap-6 mt-6 justify-center">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="max-w-sm bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition">
                    <div className="relative">
                      <img src={product.image} alt={product.title} className="w-full h-56 object-cover" />
                      <span className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">{product.category}</span>
                    </div>

                    <div className="p-5">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{product.title}</h3>
                        <p className="text-xl font-bold text-green-700 mt-2">{product.price}</p>
                      </div>

                      <div className="mt-4 space-y-2 text-gray-500 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <FontAwesomeIcon icon={faLocationDot} className="text-green-700" /> <span>{product.location}</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 my-5"></div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center font-bold">{product.initial}</div>
                          <span className="text-gray-700">{product.seller}</span>
                        </div>

                        <div className="flex items-center gap-1 text-yellow-500">
                          <FontAwesomeIcon icon={faStar} />
                          <span className="font-semibold text-gray-700">{product.rating}</span>
                          <span className="text-gray-400">({product.reviews})</span>
                        </div>
                      </div>

                      <button type="button" onClick={() => openSidebar(product)} className="w-full mt-5 bg-linear-to-r from-emerald-500 via-green-600 to-emerald-700 text-white py-3 rounded-full font-semibold shadow-lg transition duration-200 transform hover:from-emerald-600 hover:via-green-700 hover:to-emerald-800 active:scale-95 active:shadow-sm">
                        Acheter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isSidebarOpen && selectedProduct && (
              <div className="fixed inset-0 z-50 flex">
                <div className="fixed inset-0 bg-black/40" onClick={closeSidebar} />
                <div className="relative ml-auto w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto">
                  <button type="button" onClick={closeSidebar} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900">
                    <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                  </button>

                  <div className="mt-8">
                    <div className="text-sm text-gray-500 uppercase tracking-[0.2em] mb-2">Commande rapide</div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.title}</h2>
                    <p className="mt-3 text-gray-600">{selectedProduct.category} • {selectedProduct.location}</p>

                    <div className="mt-6 space-y-4">
                      <div className="rounded-2xl bg-green-50 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Prix</span>
                          <span className="text-lg font-semibold text-green-700">{selectedProduct.price}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-yellow-500">
                          <FontAwesomeIcon icon={faStar} />
                          <span className="font-semibold text-gray-700">{selectedProduct.rating}</span>
                          <span className="text-gray-500">({selectedProduct.reviews} avis)</span>
                        </div>
                      </div>
                      <div className='grid grid-cols-2 gap-4 justify-center items-center'>
                        <img src='./images/MTN.jpg' alt="imc" className='shadow-2xl p-2 rounded-2xl h-20 w-40 hover:-translate-y-2 transition-all duration-300 cursor-pointer'/>
                        <img src='./images/orange.jpg' alt="imc" className='shadow-2xl hover:-translate-y-2 transition-all duration-300  p-2 rounded-2xl h-20 w-40 cursor-pointer'/>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-sm text-gray-500 mb-3">Vos informations</p>
                        <div className="space-y-3">
                          <input type="text" placeholder="Nom complet" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-700" />
                          <input type="tel" placeholder="Téléphone" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-700" />
                        </div>
                      </div>

                      <button type="button" onClick={confirmOrder} className="w-full bg-linear-to-r from-emerald-500 via-green-600 to-emerald-700 text-white py-3 rounded-full font-semibold shadow-lg transition duration-200 transform hover:from-emerald-600 hover:via-green-700 hover:to-emerald-800 active:scale-95 active:shadow-sm">
                        Terminer la commande
                      </button>

                      {checkoutComplete && (
                        <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-green-800">
                          Votre commande est prise en compte ! Notre équipe vous contactera bientôt.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-green-800 py-20 px-6">
            <div className="max-w-7xl mx-auto">
                
                <h1 className="text-4xl font-bold text-white text-center">
                Gagnant pour vous, gagnant pour le Cameroun
                </h1>

                <p className="text-center text-green-100 max-w-3xl mx-auto mt-4">
                RecycloCam connecte citoyens et industriels pour créer un cycle vertueux :
                moins de pollution, plus d'emplois et une économie locale renforcée.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300">
                    <div className="w-14 h-14 bg-green-700 rounded-2xl flex items-center justify-center mb-6">
                      <FontAwesomeIcon icon={faGlobe} className="text-3xl text-white" />
                    </div>

                    <h2 className="text-2xl font-semibold text-white mb-4">
                    Villes plus propres
                    </h2>

                    <p className="text-green-100 leading-7">
                    Chaque annonce retire un appareil de la rue. Ensemble, nous avons déjà
                    collecté plus de 850 tonnes de déchets dans nos villes.
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300">
                    <div className="w-14 h-14 bg-green-700 rounded-2xl flex items-center justify-center mb-6">
                      <FontAwesomeIcon icon={faCoins} className="text-3xl text-white" />
                    </div>

                    <h2 className="text-2xl font-semibold text-white mb-4">
                    Source de revenus
                    </h2>

                    <p className="text-green-100 leading-7">
                    Transformez vos déchets en argent liquide. Des milliers de Camerounais
                    gagnent déjà en moyenne 45 000 FCFA par mois grâce à RecycloCam.
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300">
                    <div className="w-14 h-14 bg-green-700 rounded-2xl flex items-center justify-center mb-6">
                      <FontAwesomeIcon icon={faHandshake} className="text-3xl text-white" />
                    </div>

                    <h2 className="text-2xl font-semibold text-white mb-4">
                    Communauté locale
                    </h2>

                    <p className="text-green-100 leading-7">
                    Vendeurs, acheteurs et recycleurs forment une même communauté engagée
                    pour un Cameroun plus propre et une économie circulaire durable.
                    </p>
                </div>

                </div>
            </div>
        </div>
            <section className="py-20 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto">

                <h1 className="text-4xl font-bold text-center text-green-800">
                Ce que disent nos vendeurs
                </h1>

                <p className="text-center text-gray-600 mt-4 max-w-2xl mx-auto">
                Découvrez comment RecycloCam aide déjà des centaines de Camerounais à
                transformer leurs déchets en revenus tout en participant à la protection
                de l'environnement.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">

                {/* Témoignage 1 */}
                <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition">
                    <div className="flex gap-1 text-yellow-400 mb-4">
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                    </div>

                    <p className="text-gray-600 italic">
                    "J'avais plusieurs appareils électroniques inutilisés à la maison.
                    Grâce à RecycloCam, j'ai trouvé un acheteur en moins de deux jours."
                    </p>

                    <div className="flex items-center gap-4 mt-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700">
                        JM
                    </div>

                    <div>
                        <h4 className="font-semibold">Jean M.</h4>
                        <span className="text-sm text-gray-500">Douala</span>
                    </div>
                    </div>
                </div>

                {/* Témoignage 2 */}
                <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition">
                    <div className="flex gap-1 text-yellow-400 mb-4">
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                    </div>

                    <p className="text-gray-600 italic">
                    "J'ai vendu une vieille carcasse de voiture qui occupait mon terrain
                    depuis des années. Processus simple et rapide."
                    </p>

                    <div className="flex items-center gap-4 mt-6">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                        AM
                    </div>

                    <div>
                        <h4 className="font-semibold">Aline M.</h4>
                        <span className="text-sm text-gray-500">Yaoundé</span>
                    </div>
                    </div>
                </div>

                {/* Témoignage 3 */}
                <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition">
                    <div className="flex gap-1 text-yellow-400 mb-4">
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                    </div>

                    <p className="text-gray-600 italic">
                    "Une excellente initiative pour le Cameroun. Je gagne un revenu
                    supplémentaire tout en contribuant à garder mon quartier propre."
                    </p>

                    <div className="flex items-center gap-4 mt-6">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700">
                        EN
                    </div>

                    <div>
                        <h4 className="font-semibold">Eric N.</h4>
                        <span className="text-sm text-gray-500">Bafoussam</span>
                    </div>
                    </div>
                </div>

                </div>

            </div>
            </section>

            <section>
            <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                
                    <div className="relative p-40 bg-orange-500 text-white overflow-hidden rounded-3xl">

                    {/* Cercles décoratifs */}
                    <div className="absolute w-40 h-40 bg-white/20 rounded-full -top-10 -left-10"></div>
                    <div className="absolute w-60 h-60 bg-white/10 rounded-full top-[30%] -right-20"></div>
                    <div className="absolute w-32 h-32 bg-white/20 rounded-full -bottom-7.5 left-[20%]"></div>
                    <div className="absolute w-52 h-52 bg-white/10 rounded-full -bottom-15 right-[10%]"></div>

                    {/* Contenu */}
                    <div className="relative z-10">
                        
                        <h1 className="text-4xl font-bold text-center">
                        Publiez votre première annonce
                    gratuitement aujourd'hui
                        </h1>

                        <p className="text-center mt-3 max-w-2xl mx-auto">
                       Rejoignez plus de 12 000 Camerounais qui transforment leurs déchets en argent tout en contribuant à un environnement plus sain.
                        </p>
                        <div>
                            <Link to="/creerannonce" className="inline-block mt-6 bg-white text-orange-500 px-6 py-3 rounded-full font-bold transition">
                                Publier une annonce
                            </Link>
                            <a href="#" className="inline-block mt-6 ml-4 border-2 border-white text-white px-6 py-3 rounded-full font-bold hover:bg-white hover:text-orange-500 transition">
                                Je suis recycleur
                            </a>
                        </div>

                    </div>
                    </div>
            </div>
            </section>
    </section>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-extrabold text-white">MBOA<span className="text-orange-400">GREEN</span></div>
            <p className="mt-4 text-sm text-gray-300 max-w-sm">Une marketplace pour transformer vos déchets en revenus, connecter vendeurs et recycleurs, et rendre nos villes plus propres.</p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" aria-label="Twitter" className="hover:text-white text-gray-300">
                <FontAwesomeIcon icon={faTwitter} className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-white text-gray-300">
                <FontAwesomeIcon icon={faFacebook} className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-white text-gray-300">
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-semibold">Raccourcis</h4>
              <ul className="mt-4 text-sm text-gray-300 space-y-2">
                <li><a href="/" className="hover:text-white">Accueil</a></li>
                <li><a href="/marketplace" className="hover:text-white">Marketplace</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Aide</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} MBOA GREEN — Tous droits réservés.
        </div>
      </div>
    </footer>
  )
}

export default Home;