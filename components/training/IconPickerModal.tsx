import PathwayIcon from "@/components/training/PathwayIcon";
import { getPathwayIconFilename, PATHWAY_ICON_CATEGORIES } from "@/constants/pathwayIcons";
import { Apercu, Colors, TextStyles } from "@/constants/theme";
import {
  BottomSheetModal,
  BottomSheetSectionList,
  TouchableOpacity,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CloseButton from "../ui/CloseButton";

const ICON_COLUMNS = 4;
const ICON_GAP = 10;
const FADE_HEIGHT = 28;
const SNAP_POINTS = ["80%"];
const FADE_TRANSPARENT = "rgba(247, 247, 247, 0)";

type IconSection = {
  title: string;
  data: string[][];
};

interface IconPickerModalProps {
  ref: React.RefObject<BottomSheetModal | null>;
  selectedIcon?: string;
  onSelect: (icon: string) => void;
}

function chunkIcons(icons: string[], size: number) {
  const rows: string[][] = [];
  for (let i = 0; i < icons.length; i += size) {
    rows.push(icons.slice(i, i + size));
  }
  return rows;
}

export default function IconPickerModal({
  ref,
  selectedIcon,
  onSelect,
}: IconPickerModalProps) {
  const insets = useSafeAreaInsets();
  const selectedFilename = getPathwayIconFilename(selectedIcon ?? "");

  const sections = useMemo<IconSection[]>(
    () =>
      PATHWAY_ICON_CATEGORIES.map((category) => ({
        title: category.name,
        data: chunkIcons(category.icons, ICON_COLUMNS),
      })),
    []
  );

  const handleClose = () => {
    ref.current?.dismiss();
  };

  const handleSelect = (icon: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(icon);
  };

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={SNAP_POINTS}
      enableDynamicSizing={false}
      enableOverDrag={false}
      enablePanDownToClose
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.background}
      style={styles.modal}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Select Icon</Text>
        <CloseButton style={styles.closeButton} onPress={handleClose} />
      </View>
      <View style={styles.listContainer}>
        <LinearGradient
          colors={[Colors.background, FADE_TRANSPARENT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          pointerEvents="none"
          style={styles.topFade}
        />
        <BottomSheetSectionList
          style={styles.list}
          sections={sections}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 20,
          }}
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
                const selected = selectedFilename === icon;
                return (
                  <TouchableOpacity
                    key={icon}
                    style={[styles.icon, selected && styles.cellSelected]}
                    onPress={() => handleSelect(icon)}
                    activeOpacity={0.6}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={icon.replace(/\.svg$/i, "").replace(/[_-]+/g, " ")}
                  >
                    <PathwayIcon icon={icon} size={40} />
                  </TouchableOpacity>
                );
              })}
              {Array.from({ length: ICON_COLUMNS - item.length }).map((_, index) => (
                <View key={`spacer-${index}`} style={styles.cellSpacer} />
              ))}
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: ICON_GAP }} />}
        />
        <LinearGradient
          colors={[FADE_TRANSPARENT, Colors.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          pointerEvents="none"
          style={styles.bottomFade}
        />
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: Colors.background,
  },
  modal: {
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,

      elevation: 10,
  },
  handleIndicator: {
      width: 24,
      height: 4,
      borderRadius: 2.5,
      backgroundColor: Colors.secondary,
  },
  header: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 12,
    justifyContent: "center",
    minHeight: 34,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  topFade: {
    height: FADE_HEIGHT,
    marginBottom: -FADE_HEIGHT,
    zIndex: 1,
  },
  bottomFade: {
    height: FADE_HEIGHT,
    marginTop: -FADE_HEIGHT,
    zIndex: 1,
  },
  headerText: {
    fontFamily: Apercu.bold,
    fontSize: 20,
    color: Colors.textPrimary,
    letterSpacing: -0.32,
  },
  closeButton: {
    position: "absolute",
    top: -7,
    right: 20,
  },
  sectionHeader: {
    fontSize: TextStyles.title.fontSize,
    fontFamily: TextStyles.title.fontFamily,
    color: TextStyles.subTitle.color,
    marginTop: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: ICON_GAP,
  },
  icon: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  cellSelected: {
    borderColor: Colors.primary,
  },
  cellSpacer: {
    flex: 1,
  },
});
