using Microsoft.AspNetCore.Mvc;
using Backend_Mboagreen.Models;
using Backend_Mboagreen.Services;
using System.Text.Json;

namespace Backend_Mboagreen.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaiementController : ControllerBase
    {
        private readonly CamerPayService _camerpay;

        public PaiementController(CamerPayService camerpay)
        {
            _camerpay = camerpay;
        }

        [HttpPost("initier")]
        public async Task<IActionResult> Initier([FromBody] PaiementRequest request)
        {
            var result = await _camerpay.InitierPaiement(request);
            return Ok(result);
        }

        [HttpGet("statut/{uuid}")]
        public async Task<IActionResult> Statut(string uuid)
        {
            var result = await _camerpay.VerifierPaiement(uuid);
            return Ok(result);
        }

        [HttpPost("callback")]
        public IActionResult Callback([FromBody] JsonElement payload)
        {
            Console.WriteLine("Callback reçu : " + payload.ToString());
            return Ok();
        }
    }
}