using Backend_Mboagreen.Data;
using Backend_Mboagreen.Models;
using Backend_Mboagreen.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Backend_Mboagreen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConnexionController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<UserModel> _hasher;
        private readonly string _key;

        public ConnexionController(IConfiguration config, AppDbContext context)
        {
            _context = context;
            _hasher = new PasswordHasher<UserModel>();

            _key = config["Jwt:Key"] 
                ?? throw new Exception("Jwt:Key manquant");
        }

        [HttpPost("login")]
        public IActionResult Login(ConnexionModel login)
        {
            if (login == null)
                return BadRequest("Données invalides");

            var user = _context.Users.FirstOrDefault(u => u.Email == login.Email);

            if (user == null)
                return BadRequest("Utilisateur introuvable");

            var result = _hasher.VerifyHashedPassword(user, user.Password, login.Password);

            if (result == PasswordVerificationResult.Failed)
                return BadRequest("Mot de passe incorrect");

            var key = Encoding.UTF8.GetBytes(_key);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.UserType)
                }),

                Expires = DateTime.UtcNow.AddDays(1),

                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                message = "Connexion réussie",
                token = tokenHandler.WriteToken(token),
                user = new
                {
                    user.Id,
                    user.Nom,
                    user.Prenom,
                    user.Email,
                    user.UserType
                }
            });
        }
        [Authorize]
        [HttpGet("me")]
        public IActionResult GetMe()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized(new { message = "Token invalide" });

            var user = _context.Users.FirstOrDefault(u => u.Id == int.Parse(userId));

            if (user == null)
                return NotFound(new { message = "Utilisateur introuvable" });

            return Ok(new
            {
                user.Id,
                user.Nom,
                user.Prenom,
                user.Email,
                user.UserType
            });
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (dto == null)
                return BadRequest("Données invalides");

            var resetRequest = await _context.PasswordResets
                .FirstOrDefaultAsync(r => r.Token == dto.Token);

            if (resetRequest == null)
                return BadRequest("Token invalide");

            // Vérification email + token ensemble (sécurité renforcée)
            if (resetRequest.Email != dto.Email)
                return BadRequest("Email ne correspond pas au token");

            if (resetRequest.Expiration < DateTime.UtcNow)
                return BadRequest("Token expiré");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return BadRequest("Utilisateur introuvable");

            // Hash du nouveau mot de passe
            var hasher = new PasswordHasher<UserModel>();
            user.Password = hasher.HashPassword(user, dto.NewPassword);

            // Supprimer le token après utilisation
            _context.PasswordResets.Remove(resetRequest);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Mot de passe réinitialisé avec succès"
            });
        }
    }
}