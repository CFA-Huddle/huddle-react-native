import Card from "@/components/ui/Card";
import { TextStyles } from "@/constants/theme";
import { Task } from "@/types/Modules";
import { StyleSheet, Text } from "react-native";

export const TaskItem = ({ task }: { task: Task }) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.name}>{task.name}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
  },
  name: {
    fontFamily: TextStyles.body.fontFamily,
    fontSize: TextStyles.body.fontSize,
    color: TextStyles.body.color,
    lineHeight: 18,
  },
});
