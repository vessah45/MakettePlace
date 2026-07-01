using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Backend_Mboagreen.Models;

namespace Backend_Mboagreen.Services
{
    public class CamerPayService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public CamerPayService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;

            var token = _config["CamerPay:Token"];
            var apiUrl = _config["CamerPay:ApiUrl"];

            _httpClient.BaseAddress = new Uri(apiUrl);
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);
        }

        public async Task<JsonElement> InitierPaiement(PaiementRequest request)
        {
           var payload = new
            {
                amount = request.Amount,
                currency = request.Currency,
                description = request.Description,
                customer_name = request.CustomerName,
                customer_email = request.CustomerEmail,
                customer_phone = request.CustomerPhone,
                merchant_invoice_id = "INV_" + DateTime.Now.Ticks,  // ← ID unique
                merchant_return_url = "http://localhost:5173/Maketteplace",
                merchant_callback_url = "http://localhost:5173/callback"
            };
            var content = new StringContent(
                JsonSerializer.Serialize(payload),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync("/api/payment/initiate", content);
            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Status CamerPay : " + response.StatusCode);
            Console.WriteLine("Réponse CamerPay : " + json);
            return JsonSerializer.Deserialize<JsonElement>(json);
        }

        public async Task<JsonElement> VerifierPaiement(string uuid)
        {
            var response = await _httpClient.GetAsync($"/api/payment/{uuid}/status");
            var json = await response.Content.ReadAsStringAsync();

            return JsonSerializer.Deserialize<JsonElement>(json);
        }
    }
}