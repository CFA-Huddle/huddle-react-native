import ModuleIcon from "@/components/training/ModuleIcon";
import { getModuleIconLabel, MODULE_ICON_CATEGORIES } from "@/constants/moduleIcons";
import { Apercu, Colors } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const LIST_PADDING_HORIZONTAL = 20;
const ICON_GAP = 11;
const MIN_CELL_SIZE = 58;
const ICON_SIZE = 35;

type IconSection = {
  title: string;
  data: string[][];
};

interface IconPickerProps {
  selectedIcon?: string;
  onSelect: (icon: string) => void;
  width: number;
}

function chunkIcons(icons: string[], size: number) {
  const rows: string[][] = [];
  for (let i = 0; i < icons.length; i += size) {
    rows.push(icons.slice(i, i + size));
  }
  return rows;
}

function getGridMetrics(containerWidth: number) {
  const contentWidth = Math.max(0, containerWidth - LIST_PADDING_HORIZONTAL * 2);
  const columns = Math.max(
    1,
    Math.floor((contentWidth + ICON_GAP) / (MIN_CELL_SIZE + ICON_GAP)),
  );
  const cellSize = (contentWidth - ICON_GAP * (columns - 1)) / columns;

  return { columns, cellSize };
}

export default function IconPicker({ selectedIcon, onSelect, width }: IconPickerProps) {
  const { columns, cellSize } = useMemo(
    () => getGridMetrics(width),
    [width],
  );

  const sections = useMemo<IconSection[]>(
    () =>
      MODULE_ICON_CATEGORIES.map((category) => ({
        title: category.name,
        data: chunkIcons(category.icons, columns),
      })),
    [columns]
  );

  const handleSelect = (icon: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(icon);
  };

  if (width <= 0) {
    return <View style={styles.list} />;
  }

  return (
    <SectionList
      style={styles.list}
      sections={sections}
      extraData={`${columns}-${cellSize}-${selectedIcon}`}
      contentContainerStyle={styles.listContent}
      keyExtractor={(item, index) => `${item.join("|")}-${index}`}
      stickySectionHeadersEnabled={false}
      initialNumToRender={6}
      windowSize={8}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
      renderItem={({ item }) => (
        <View style={styles.row}>
          {item.map((icon) => {
            const selected = selectedIcon === icon;
            return (
              <TouchableOpacity
                key={icon}
                style={[styles.cell, { width: cellSize }, selected && styles.cellSelected]}
                onPress={() => handleSelect(icon)}
                activeOpacity={0.6}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={getModuleIconLabel(icon)}
              >
                <ModuleIcon icon={icon} size={ICON_SIZE} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: ICON_GAP }} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: LIST_PADDING_HORIZONTAL,
    paddingBottom: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontFamily: Apercu.regular,
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 11,
  },
  row: {
    flexDirection: "row",
    gap: ICON_GAP,
  },
  cell: {
    aspectRatio: 1,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  cellSelected: {
    backgroundColor: "#FAFAFA",
    borderColor: Colors.textPrimary,
  },
});
