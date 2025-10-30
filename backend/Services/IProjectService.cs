using MiniProjectManager.Backend.DTOs;

namespace MiniProjectManager.Backend.Services
{
    public interface IProjectService
    {
        Task<List<ProjectDto>> GetProjectsAsync(int userId);
        Task<ProjectDto> CreateProjectAsync(int userId, ProjectCreateDto dto);
        Task<bool> DeleteProjectAsync(int userId, int projectId);

        Task<List<TaskDto>> GetTasksAsync(int userId, int projectId);
        Task<TaskDto> AddTaskAsync(int userId, int projectId, TaskCreateDto dto);
        Task<TaskDto?> UpdateTaskAsync(int userId, int projectId, int taskId, TaskUpdateDto dto);
        Task<bool> DeleteTaskAsync(int userId, int projectId, int taskId);
        Task<TaskDto?> ToggleTaskAsync(int userId, int projectId, int taskId);
    }
}
