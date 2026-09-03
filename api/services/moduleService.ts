import apiClient from "@/api/client";
import {
  CreateModuleRequest,
  CreateTaskRequest,
  GetTrainingModulesResponse,
  Module,
  Task,
  UpdateModuleRequest,
} from "@/types/Modules";

export const moduleService = {
  getModulesByLocationId: async (locationId: string): Promise<Module[]> => {
    const response = await apiClient.get<GetTrainingModulesResponse>(
      `/locations/${locationId}/training-modules`,
    );
    return response.data.training_modules ?? [];
  },
  createModule: async (
    locationId: string,
    payload: CreateModuleRequest,
  ): Promise<Module> => {
    const response = await apiClient.post<Module>(
      `/locations/${locationId}/training-modules`,
      payload,
    );
    return response.data;
  },
  updateModule: async (
    locationId: string,
    moduleId: string,
    payload: UpdateModuleRequest,
  ): Promise<Module> => {
    const response = await apiClient.patch<Module>(
      `/locations/${locationId}/training-modules/${moduleId}`,
      payload,
    );
    return response.data;
  },
  createTask: async (
    locationId: string,
    moduleId: string,
    payload: CreateTaskRequest,
  ): Promise<Task> => {
    const response = await apiClient.post<Task>(
      `/locations/${locationId}/training-modules/${moduleId}/tasks`,
      payload,
    );
    return response.data;
  },
  deleteTask: async (
    locationId: string,
    moduleId: string,
    taskId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `/locations/${locationId}/training-modules/${moduleId}/tasks/${taskId}`,
    );
  },
  deleteModule: async (locationId: string, moduleId: string): Promise<void> => {
    await apiClient.delete(
      `/locations/${locationId}/training-modules/${moduleId}`,
    );
  },
};
