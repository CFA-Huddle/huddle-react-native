import OpenOutlineIcon from "@/assets/icons/open-outline.svg";
import Card from "@/components/ui/Card";
import { Colors, TextStyles } from "@/constants/theme";
import { Task } from "@/types/Modules";
import { openSafeUrl } from "@/utils/helper";
import { removeUrlProtocol } from "@/utils/string";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface TaskItemProps {
  item: Task;
  onLongPress?: () => void;
}

export const TaskItem = ({ item, onLongPress }: TaskItemProps) => {
  return (
    <TouchableOpacity activeOpacity={0.6} onLongPress={onLongPress}>
      <Card style={styles.taskCard}>
        <Text style={styles.taskNameText}>{item.name}</Text>
        {item.link_url && (
          <TouchableOpacity
            style={styles.taskLink}
            onPress={() => openSafeUrl(item.link_url!)}
            activeOpacity={0.6}
          >
            <OpenOutlineIcon width={18} height={18} color={Colors.accent} />
            <Text numberOfLines={1} style={styles.taskLinkText}>
              {removeUrlProtocol(item.link_url)}
            </Text>
          </TouchableOpacity>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    padding: 20,
    gap: 10,
    alignItems: "flex-start",
  },
  taskNameText: {
    fontFamily: TextStyles.body.fontFamily,
    fontSize: TextStyles.body.fontSize,
    color: TextStyles.body.color,
    lineHeight: 22,
  },
  taskLink: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  taskLinkText: {
    fontFamily: TextStyles.hint.fontFamily,
    fontSize: TextStyles.hint.fontSize,
    color: Colors.accent,
    flex: 1,
  },
});
