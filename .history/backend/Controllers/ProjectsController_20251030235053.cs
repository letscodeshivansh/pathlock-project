using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MiniProjectManager.Backend.DTOs;
using MiniProjectManager.Backend.Services;

namespace MiniProjectManager.Backend.Controllers
{
    [ApiController]
    [Route("api/v1/projects")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _svc;

        public ProjectsController(IProjectService svc)
        {
            _svc = svc;
        }

        private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var res = await _svc.GetProjectsAsync(UserId);
            return Ok(res);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(ProjectCreateDto dto)
        {
            var res = await _svc.CreateProjectAsync(UserId, dto);
            return Ok(res);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var ok = await _svc.DeleteProjectAsync(UserId, id);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpGet("{projectId}/tasks")]
        public async Task<IActionResult> GetTasks(int projectId)
        {
            try
            {
                var res = await _svc.GetTasksAsync(UserId, projectId);
                return Ok(res);
            }
            catch (ApplicationException)
            {
                return NotFound();
            }
        }

        [HttpPost("{projectId}/tasks")]
        public async Task<IActionResult> AddTask(int projectId, TaskCreateDto dto)
        {
            try
            {
                var res = await _svc.AddTaskAsync(UserId, projectId, dto);
                return Ok(res);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPut("{projectId}/tasks/{taskId}")]
        public async Task<IActionResult> UpdateTask(int projectId, int taskId, TaskUpdateDto dto)
        {
            var res = await _svc.UpdateTaskAsync(UserId, projectId, taskId, dto);
            if (res == null) return NotFound();
            return Ok(res);
        }

        [HttpDelete("{projectId}/tasks/{taskId}")]
        public async Task<IActionResult> DeleteTask(int projectId, int taskId)
        {
            var ok = await _svc.DeleteTaskAsync(UserId, projectId, taskId);
            if (!ok) return NotFound();
            return NoContent();
        }

        [HttpPatch("{projectId}/tasks/{taskId}/toggle")]
        public async Task<IActionResult> ToggleTask(int projectId, int taskId)
        {
            var res = await _svc.ToggleTaskAsync(UserId, projectId, taskId);
            if (res == null) return NotFound();
            return Ok(res);
        }
    }
}
