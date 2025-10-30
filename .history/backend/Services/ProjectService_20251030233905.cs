using Microsoft.EntityFrameworkCore;
using MiniProjectManager.Backend.Data;
using MiniProjectManager.Backend.DTOs;
using MiniProjectManager.Backend.Models;

namespace MiniProjectManager.Backend.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _db;

        public ProjectService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ProjectDto> CreateProjectAsync(int userId, ProjectCreateDto dto)
        {
            var project = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                UserId = userId
            };
            _db.Projects.Add(project);
            await _db.SaveChangesAsync();
            return new ProjectDto { Id = project.Id, Title = project.Title, Description = project.Description, CreatedAt = project.CreatedAt };
        }

        public async Task<bool> DeleteProjectAsync(int userId, int projectId)
        {
            var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
            if (project == null) return false;
            _db.Projects.Remove(project);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<ProjectDto>> GetProjectsAsync(int userId)
        {
            return await _db.Projects
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new ProjectDto { Id = p.Id, Title = p.Title, Description = p.Description, CreatedAt = p.CreatedAt })
                .ToListAsync();
        }

        public async Task<TaskDto> AddTaskAsync(int userId, int projectId, TaskCreateDto dto)
        {
            var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
            if (project == null) throw new ApplicationException("Project not found");

            var task = new TaskItem
            {
                Title = dto.Title,
                DueDate = dto.DueDate,
                ProjectId = projectId
            };
            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();
            return new TaskDto { Id = task.Id, Title = task.Title, DueDate = task.DueDate, IsCompleted = task.IsCompleted, ProjectId = projectId };
        }

        public async Task<bool> DeleteTaskAsync(int userId, int projectId, int taskId)
        {
            var task = await _db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.ProjectId == projectId && t.Project!.UserId == userId);
            if (task == null) return false;
            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<TaskDto>> GetTasksAsync(int userId, int projectId)
        {
            var project = await _db.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
            if (project == null) throw new ApplicationException("Project not found");

            return await _db.Tasks
                .Where(t => t.ProjectId == projectId)
                .Select(t => new TaskDto { Id = t.Id, Title = t.Title, DueDate = t.DueDate, IsCompleted = t.IsCompleted, ProjectId = t.ProjectId })
                .ToListAsync();
        }

        public async Task<TaskDto?> UpdateTaskAsync(int userId, int projectId, int taskId, TaskUpdateDto dto)
        {
            var task = await _db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.ProjectId == projectId && t.Project!.UserId == userId);
            if (task == null) return null;
            task.Title = dto.Title;
            task.DueDate = dto.DueDate;
            task.IsCompleted = dto.IsCompleted;
            await _db.SaveChangesAsync();
            return new TaskDto { Id = task.Id, Title = task.Title, DueDate = task.DueDate, IsCompleted = task.IsCompleted, ProjectId = task.ProjectId };
        }

        public async Task<TaskDto?> ToggleTaskAsync(int userId, int projectId, int taskId)
        {
            var task = await _db.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.ProjectId == projectId && t.Project!.UserId == userId);
            if (task == null) return null;
            task.IsCompleted = !task.IsCompleted;
            await _db.SaveChangesAsync();
            return new TaskDto { Id = task.Id, Title = task.Title, DueDate = task.DueDate, IsCompleted = task.IsCompleted, ProjectId = task.ProjectId };
        }
    }
}
