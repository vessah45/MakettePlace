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
    public class PasswordResetControler : ControllerBase
    {
        private readonly AppDbContext _context;
        public PasswordResetControler(AppDbContext context)
        {
            _context = context;
        }

       [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return Ok(); // ne pas révéler si email existe (sécurité)

            var token = Guid.NewGuid().ToString();

            var reset = new PasswordReset
            {
                Email = email,
                Token = token,
                Expiration = DateTime.UtcNow.AddMinutes(30)
            };

            _context.Add(reset);
            await _context.SaveChangesAsync();

            var link = $"http://localhost:3000/reset-password?token={token}";

            return Ok(new { message = "Lien de réinitialisation généré", link });
        } 
    }
}