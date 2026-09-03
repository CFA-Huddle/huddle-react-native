import ChecklistIcon from "@/assets/icons/checklist.svg";
import ModuleIcon from "@/assets/icons/module.svg";
import PeopleIcon from "@/assets/icons/people.svg";
import Heading from "@/components/shared/Heading";
import { Colors, TextStyles } from "@/constants/theme";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GRID_GAP = 10;
const MIN_TILE_SIZE = 160;
const MAX_TILE_SIZE = 200;

const ITEMS = [
  { href: "/training/team-training", label: "Team Training", Icon: PeopleIcon },
  { href: "/training/module-editor", label: "Module Editor", Icon: ModuleIcon },
  { href: "/training/training-log", label: "Your Training Log", Icon: ChecklistIcon },
] as const;

const TrainingScreen = () => {
  const insets = useSafeAreaInsets();
  const [gridWidth, setGridWidth] = useState(0);

  const tileSize = useMemo(() => {
    if (gridWidth <= 0) {
      return MIN_TILE_SIZE;
    }

    const columns = Math.max(
      1,
      Math.min(
        ITEMS.length,
        Math.floor((gridWidth + GRID_GAP) / (MIN_TILE_SIZE + GRID_GAP)),
      ),
    );

    return Math.min(
      MAX_TILE_SIZE,
      (gridWidth - GRID_GAP * (columns - 1)) / columns,
    );
  }, [gridWidth]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Heading>Training</Heading>
      <View
        style={styles.gridContainer}
        onLayout={(event) => {
          const nextWidth = event.nativeEvent.layout.width;
          setGridWidth((current) => (current === nextWidth ? current : nextWidth));
        }}
      >
        {ITEMS.map(({ href, label, Icon }) => (
          <TouchableOpacity
            key={href}
            style={[styles.gridItem, { width: tileSize }]}
            onPress={() => router.push(href)}
            activeOpacity={0.6}
          >
            <Icon width={46} height={46} color={Colors.accent} />
            <Text style={styles.gridItemText}>{label}</Text>
          </TouchableOpacity>
        ))}
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  gridItem: {
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
  gridItemText: {
    fontSize: TextStyles.subTitle.fontSize,
    fontFamily: TextStyles.subTitle.fontFamily,
    color: TextStyles.body.color,
    textAlign: "center",
    lineHeight: 16,
  },
});

export default TrainingScreen;
