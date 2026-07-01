using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Backend_Mboagreen.Models
{
   public class AnnonceModel
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Titre { get; set; }

        [Required]
        [MaxLength(100)]
        public string Categorie { get; set; }

        [Required]
        [MaxLength(100)]
        public string Etat { get; set; }

        [Required]
        public decimal Prix { get; set; }

        [Required]
        public string Photo { get; set; }

        [Required]
        [Column("Users_Id")]
        public int Users_Id { get; set; }

        // 🔥 IMPORTANT : relation FK propre EF
        [ForeignKey("Users_Id")]
        public UserModel User { get; set; }
    }
}