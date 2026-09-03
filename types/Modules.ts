export {
  TrainingModuleIcon,
  TrainingModuleIconLabels
} from "@/types/TrainingModuleIcon";

export interface GetTrainingModulesResponse {
  training_modules: Module[];
}

export interface CreateModuleRequest {
  name: string;
  group_name: string;
  icon: string;
}

export interface CreateTaskRequest {
  name: string;
  link_url?: string;
}

export interface UpdateModuleRequest {
  name: string;
  group_name: string;
  icon: string;
}

export interface Task {
  id: string;
  name: string;
  link_url?: string;
}

export interface Module {
  id: string;
  location_id: string;
  name: string;
  icon: string;
  group_name: string;
  tasks: Task[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
