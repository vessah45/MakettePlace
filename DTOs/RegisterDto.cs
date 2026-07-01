namespace Backend_Mboagreen.DTOs
{
    public class RegisterDto
    {
        public string Nom { get; set; }
        public string Prenom { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        public string Password { get; set; }

        public string? Adresse { get; set; }
        public string? Ville { get; set; }
        public string? Quartier { get; set; }

        public bool AcceptTerms { get; set; }
        public bool Newsletter { get; set; }

        public string UserType { get; set; }
    }
}