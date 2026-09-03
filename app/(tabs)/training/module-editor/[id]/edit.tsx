import ModuleForm from "@/components/training/ModuleForm";
import { useLocalSearchParams } from "expo-router";

export default function EditModuleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ModuleForm mode="edit" moduleId={id} />;
}
