using System.ComponentModel.DataAnnotations;

namespace Backend_Mboagreen.Models
{
    public class PasswordReset
    {
        public int Id { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        public DateTime Expiration { get; set; }
    }
}