import CheckmarkIcon from "@/assets/icons/checkmark.svg";
import ModuleIcon from "@/components/training/ModuleIcon";
import { Colors, TextStyles } from "@/constants/theme";
import { Module } from "@/types/Modules";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, G } from "react-native-svg";

const PROGRESS_SIZE = 28;
const PROGRESS_STROKE_WIDTH = 3.5;

export const ModuleItem = ({ module, progress, onPress, onLongPress }: { module: Module, progress?: number, onPress?: () => void, onLongPress?: () => void }) => {
  const styles = makeStyles(useSafeAreaInsets());

  return (
    <TouchableOpacity
      style={styles.moduleItem}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={!onPress && !onLongPress}
      activeOpacity={0.6}
    >
      <ModuleIcon icon={module.icon} size={40} />
      <Text style={styles.moduleTitle} numberOfLines={1}>{module.name}</Text>
      {progress != null && (
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>{Math.round(progress)}%</Text>
          {progress >= 100 ? (
            <View style={styles.completeBadge}>
              <CheckmarkIcon width={12} height={10} color={Colors.textInverse} />
            </View>
          ) : (
            <CircularProgress progress={progress} />
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}

const CircularProgress = ({ progress }: { progress: number }) => {
  const radius = (PROGRESS_SIZE - PROGRESS_STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference * (1 - clamped / 100);
  const center = PROGRESS_SIZE / 2;

  return (
    <Svg width={PROGRESS_SIZE} height={PROGRESS_SIZE}>
      <G rotation={-90} origin={`${center}, ${center}`}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors.border}
          strokeWidth={PROGRESS_STROKE_WIDTH}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors.primary}
          strokeWidth={PROGRESS_STROKE_WIDTH}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="butt"
        />
      </G>
    </Svg>
  );
};

const makeStyles = (insets: EdgeInsets) =>
    StyleSheet.create({
      moduleItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: Colors.card,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
      },
      moduleTitle: {
        flex: 1,
        fontSize: TextStyles.subTitle.fontSize,
        fontFamily: TextStyles.subTitle.fontFamily,
        color: TextStyles.title.color,
      },
      progressRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      },
      progressLabel: {
        fontSize: TextStyles.meta.fontSize,
        fontFamily: TextStyles.meta.fontFamily,
        color: TextStyles.meta.color,
      },
      completeBadge: {
        width: PROGRESS_SIZE,
        height: PROGRESS_SIZE,
        borderRadius: PROGRESS_SIZE / 2,
        backgroundColor: Colors.success,
        alignItems: "center",
        justifyContent: "center",
      },
    });