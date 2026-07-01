using Backend_Mboagreen.Models;
using Microsoft.AspNetCore.Mvc;
using Backend_Mboagreen.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Backend_Mboagreen.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend_Mboagreen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController:ControllerBase
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (dto == null)
                return BadRequest("Données invalides");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Vérification email
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "Email déjà utilisé" });

            // Validation UserType
            if (dto.UserType != "vendeur" && dto.UserType != "acheteur")
                return BadRequest(new { message = "UserType invalide" });

            // Mapping DTO -> Model
            var user = new UserModel
            {
                Nom = dto.Nom,
                Prenom = dto.Prenom,
                Email = dto.Email,
                Telephone = dto.Telephone,
                Adresse = dto.Adresse,
                Ville = dto.Ville,
                Quartier = dto.Quartier,
                AcceptTerms = dto.AcceptTerms,
                Newsletter = dto.Newsletter,
                UserType = dto.UserType
            };

            // Hash password
            var hasher = new PasswordHasher<UserModel>();
            user.Password = hasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Inscription réussie" });
        }
         [Authorize]
        [HttpGet("me")] 
        public async Task<IActionResult> GetMe()
        {
            // 1. Récupérer le claim utilisateur depuis le token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            // 2. Sécurité : si pas de token ou claim manquant
            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized(new { message = "Token invalide ou manquant" });

            // 3. Sécurité : éviter crash si conversion échoue
            if (!int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { message = "UserId invalide dans le token" });

            // 4. Récupérer l'utilisateur
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId);

            // 5. Si utilisateur introuvable
            if (user == null)
                return NotFound(new { message = "Utilisateur introuvable" });

            // 6. Ne jamais renvoyer le password
            return Ok(new
            {
                user.Id,
                user.Nom,
                user.Prenom,
                user.Email,
                user.Telephone,
                user.Ville,
                user.Quartier,
                user.UserType
            });
        }
    }
       
}