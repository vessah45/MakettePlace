namespace Backend_Mboagreen.DTOs
{
    public class CreateAnnonceDto
    {
        public string Titre { get; set; }
        public string Categorie { get; set; }
        public string Etat { get; set; }
        public decimal Prix { get; set; }
    }
}