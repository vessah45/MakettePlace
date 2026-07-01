using System.ComponentModel.DataAnnotations;

namespace Backend_Mboagreen.Models
{
    public class Notification
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Titre { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public string? TypeNotification { get; set; }

        public bool EstLue { get; set; } = false;

        public string? Lien { get; set; }

        public DateTime DateCreation { get; set; } = DateTime.Now;
        
    }
}