using Backend_Mboagreen.Data;
using Backend_Mboagreen.DTOs;
using Backend_Mboagreen.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend_Mboagreen.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnonceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnnonceController(AppDbContext context)
        {
            _context = context;
        }

        // ==========================
        // CREER UNE ANNONCE
        // ==========================
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateAnnonce(
            [FromForm] CreateAnnonceDto dto,
            IFormFile? file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new
                    {
                        message = "Image obligatoire"
                    });
                }

                var userClaim =
                    User.FindFirst(ClaimTypes.NameIdentifier);

                if (userClaim == null)
                {
                    return Unauthorized(new
                    {
                        message = "Utilisateur non authentifié"
                    });
                }

                var userId = int.Parse(userClaim.Value);

                var fileName =
                    Guid.NewGuid().ToString() +
                    Path.GetExtension(file.FileName);

                var uploadFolder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads");

                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }

                var filePath =
                    Path.Combine(uploadFolder, fileName);

                using (var stream =
                       new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var annonce = new AnnonceModel
                {
                    Titre = dto.Titre,
                    Categorie = dto.Categorie,
                    Etat = dto.Etat,
                    Prix = dto.Prix,
                    Photo = fileName,
                    Users_Id = userId
                };

                _context.Annonce.Add(annonce);
                // Création de la notification
                _context.Notifications.Add(new Notification
                {
                    UserId = userId,
                    Titre = "Annonce créée",
                    Message = $"Votre annonce '{dto.Titre}' a été publiée avec succès.",
                    TypeNotification = "Annonce",
                    EstLue = false,
                    DateCreation = DateTime.Now
                });
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Annonce créée avec succès",
                    annonce
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = ex.Message
                });
            }
        }


        // ==========================
        // TOUTES LES ANNONCES
        // ==========================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var annonces = await _context.Annonce
                .Include(a => a.User)
                .ToListAsync();

            var result = annonces.Select(a => new
            {
                a.Id,
                a.Titre,
                a.Categorie,
                a.Etat,
                a.Prix,

                Photo =
                    $"{Request.Scheme}://{Request.Host}/uploads/{a.Photo}",

                Proprietaire = a.User == null
                    ? null
                    : new
                    {
                        a.User.Id,
                        a.User.Nom,
                        a.User.Prenom,
                        a.User.Ville,
                        a.User.Quartier,
                        a.User.Email
                    }
            });

            return Ok(result);
        }

        // ==========================
        // MES ANNONCES
        // ==========================
        [Authorize]
        [HttpGet("mes-annonces")]
        public async Task<IActionResult> MesAnnonces()
        {
            var userClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userClaim.Value);

            var annonces = await _context.Annonce
                .Where(a => a.Users_Id == userId)
                .ToListAsync();

            return Ok(annonces);
        }

        // ==========================
        // MODIFIER UNE ANNONCE
        // ==========================
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAnnonce(
            int id,
            [FromBody] CreateAnnonceDto dto)
        {
            var userClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userClaim.Value);

            var annonce =
                await _context.Annonce.FindAsync(id);

            if (annonce == null)
            {
                return NotFound(new
                {
                    message = "Annonce introuvable"
                });
            }

            if (annonce.Users_Id != userId)
            {
                return Forbid();
            }

            annonce.Titre = dto.Titre;
            annonce.Categorie = dto.Categorie;
            annonce.Etat = dto.Etat;
            annonce.Prix = dto.Prix;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Annonce modifiée avec succès"
            });
        }

        // ==========================
        // SUPPRIMER UNE ANNONCE
        // ==========================
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnonce(int id)
        {
            var userClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userClaim.Value);

            var annonce =
                await _context.Annonce.FindAsync(id);

            if (annonce == null)
            {
                return NotFound(new
                {
                    message = "Annonce introuvable"
                });
            }

            if (annonce.Users_Id != userId)
            {
                return Forbid();
            }

            _context.Annonce.Remove(annonce);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Annonce supprimée avec succès"
            });
        }

        // ==========================
        // TEST
        // ==========================
        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok("AnnonceController fonctionne");
        }
    }
}