import ChecklistIcon from "@/assets/icons/checklist.svg";
import ModuleIcon from "@/assets/icons/module.svg";
import PeopleIcon from "@/assets/icons/people.svg";
import Heading from "@/components/shared/Heading";
import { Colors, TextStyles } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TrainingScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Heading>Training</Heading>
      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.gridItem}>
            <PeopleIcon width={46} height={46} color={Colors.accent} />
            <Text style={styles.gridItemText}>Team Training</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem}>
            <ModuleIcon width={46} height={46} color={Colors.accent} />
            <Text style={styles.gridItemText}>Module Editor</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={styles.gridItem}>
            <ChecklistIcon width={46} height={46} color={Colors.accent} />
            <Text style={styles.gridItemText}>Your Training Log</Text>
          </TouchableOpacity>
          <View
            style={styles.hiddenItem}
            pointerEvents="none"
            collapsable={false}
            accessible={false}
            importantForAccessibility="no"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  gridContainer: {
    flex: 1,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 30,
    boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
  },
  hiddenItem: {
    flex: 1,
    margin: 15,
  },
  gridItemText: {
    fontSize: TextStyles.subTitle.fontSize,
    fontFamily: TextStyles.subTitle.fontFamily,
    color: TextStyles.body.color,
    textAlign: "center",
    lineHeight: 16,
  },
});

export default TrainingScreen;
