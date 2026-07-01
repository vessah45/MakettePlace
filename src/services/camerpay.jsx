const API_URL = "http://localhost:5283/api/paiement";

export const initierPaiement = async (montant, description, client) => {
  const response = await fetch(`${API_URL}/initier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: montant,
      currency: "XAF",
      description: description,
      customerName: client.nom,
      customerEmail: client.email,
      customerPhone: client.telephone,
    }),
  });
  return await response.json();
};