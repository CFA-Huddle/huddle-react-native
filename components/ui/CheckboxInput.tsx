import CheckmarkIcon from "@/assets/icons/checkmark.svg";
import { Colors, TextStyles } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type CheckboxInputProps<T> = {
    label: string;
    optionKey: T;
    selected: boolean;
    onPress: (optionKey: T) => void;
};

function CheckboxInput<T>({ label, optionKey, selected, onPress }: CheckboxInputProps<T>) {
    return (
        <TouchableOpacity
            onPress={() => onPress(optionKey)}
            style={[styles.row, selected && styles.rowPressed]}
            activeOpacity={0.6}
        >
            <Text style={styles.rowLabel}>{label}</Text>
            <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                {selected ? (
                    <CheckmarkIcon width={14} height={14} color={Colors.textInverse} />
                ) : null}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: Colors.card,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    rowPressed: {
        opacity: 0.85,
    },
    rowLabel: {
        fontFamily: TextStyles.body.fontFamily,
        fontSize: TextStyles.body.fontSize,
        color: Colors.textPrimary,
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: "center",
        justifyContent: "center",
    },
    radioOuterSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
    },
});

export default CheckboxInput;
