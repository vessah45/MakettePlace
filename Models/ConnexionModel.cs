using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Backend_Mboagreen.Models
{
    public class ConnexionModel
    {
        [Key]
        public int Id { get; set; } // Primary Key (Auto Increment)

        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MaxLength(255)]
        public string Password { get; set; }
    }
}