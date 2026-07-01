namespace Backend_Mboagreen.Models
{
    public class PaiementRequest
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "XAF";
        public string Description { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
    }
}