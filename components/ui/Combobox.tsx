import CheckmarkIcon from "@/assets/icons/checkmark.svg";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import { Apercu, Colors } from "@/constants/theme";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useEffect, useMemo, useState } from "react";
import {
    Dimensions,
    Keyboard,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const WINDOW = Dimensions.get("window");
const INPUT_HEIGHT = 51;
const LIST_GAP = 6;
const LIST_MAX_HEIGHT = 180;
const OPTION_HEIGHT = 44;

interface ComboboxProps {
    options: readonly string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    inBottomSheet?: boolean;
    allowCreate?: boolean;
}

export default function Combobox({
    options,
    value,
    onChange,
    placeholder = "Select...",
    inBottomSheet = false,
    allowCreate = true,
}: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const Input = inBottomSheet ? BottomSheetTextInput : TextInput;
    const query = value.trim();

    const filtered = useMemo(() => {
        if (!query) return [...options];
        return options.filter((option) =>
            option.toLowerCase().includes(query.toLowerCase())
        );
    }, [options, query]);

    const exactMatch = options.some(
        (option) => option.toLowerCase() === query.toLowerCase()
    );
    const canCreate = allowCreate && query.length > 0 && !exactMatch;
    const empty = filtered.length === 0 && !canCreate;
    const listHeight = Math.min(
        Math.max(filtered.length + (canCreate ? 1 : 0) + (empty ? 1 : 0), 1) * OPTION_HEIGHT,
        LIST_MAX_HEIGHT
    );

    useEffect(() => {
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
        const subscription = Keyboard.addListener(hideEvent, () => setOpen(false));
        return () => subscription.remove();
    }, []);

    const close = () => {
        setOpen(false);
        Keyboard.dismiss();
    };

    const commit = (next: string) => {
        const trimmed = next.trim();
        if (!trimmed) return;
        onChange(trimmed);
        close();
    };

    return (
        <View style={styles.container} pointerEvents="box-none" collapsable={false}>
            {open && (
                <>
                    <Pressable
                        accessibilityLabel="Dismiss group menu"
                        onPress={close}
                        style={[
                            styles.dismissArea,
                            { bottom: INPUT_HEIGHT + LIST_GAP + listHeight },
                        ]}
                    />
                    <Pressable
                        accessibilityLabel="Dismiss group menu"
                        onPress={close}
                        style={[styles.dismissArea, styles.dismissBelow]}
                    />
                </>
            )}
            {open && (
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                    bounces={false}
                    style={styles.list}
                >
                    {filtered.map((option) => {
                        const selected = option.toLowerCase() === query.toLowerCase();
                        return (
                            <Pressable
                                key={option}
                                onPressIn={() => commit(option)}
                                style={({ pressed }) => [
                                    styles.option,
                                    selected && styles.optionSelected,
                                    pressed && styles.optionPressed,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        selected && styles.optionTextSelected,
                                    ]}
                                    numberOfLines={1}
                                >
                                    {option}
                                </Text>
                                {selected && (
                                    <CheckmarkIcon
                                        width={14}
                                        height={12}
                                        color={Colors.primary}
                                    />
                                )}
                            </Pressable>
                        );
                    })}
                    {canCreate && (
                        <Pressable
                            onPressIn={() => commit(value)}
                            style={({ pressed }) => [
                                styles.option,
                                pressed && styles.optionPressed,
                            ]}
                        >
                            <PlusIcon width={13} height={13} color={Colors.primary} />
                            <Text style={styles.createText} numberOfLines={1}>
                                Create “{query}”
                            </Text>
                        </Pressable>
                    )}
                    {filtered.length === 0 && !canCreate && (
                        <View style={styles.option}>
                            <Text style={styles.emptyText}>No groups found</Text>
                        </View>
                    )}
                </ScrollView>
            )}
            <View style={styles.inputContainer}>
                <Input
                    style={styles.input}
                    value={value}
                    onChangeText={(text) => {
                        onChange(text);
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                    onSubmitEditing={() => {
                        const match = options.find(
                            (option) => option.toLowerCase() === query.toLowerCase()
                        );
                        commit(match ?? value);
                    }}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textMuted}
                    autoCorrect={false}
                    autoCapitalize="words"
                    returnKeyType="done"
                />
                <Pressable
                    onPress={() => setOpen((current) => !current)}
                    hitSlop={8}
                    style={styles.chevronButton}
                >
                    <View style={[styles.chevron, open && styles.chevronOpen]}>
                        <ChevronLeftIcon
                            width={10}
                            height={16}
                            color={Colors.textPrimary}
                        />
                    </View>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        zIndex: 20,
        overflow: "visible",
    },
    dismissArea: {
        position: "absolute",
        top: -WINDOW.height,
        left: -WINDOW.width,
        right: -WINDOW.width,
        zIndex: 10,
    },
    dismissBelow: {
        top: INPUT_HEIGHT,
        bottom: -WINDOW.height,
    },
    inputContainer: {
        height: INPUT_HEIGHT,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        backgroundColor: Colors.card,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 12,
        zIndex: 31,
    },
    input: {
        flex: 1,
        height: INPUT_HEIGHT,
        paddingVertical: 0,
        fontSize: 16,
        fontFamily: Apercu.regular,
        color: Colors.textPrimary,
    },
    chevronButton: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    chevron: {
        width: 16,
        height: 16,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ rotate: "-90deg" }],
    },
    chevronOpen: {
        transform: [{ rotate: "90deg" }],
    },
    list: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: INPUT_HEIGHT + LIST_GAP,
        maxHeight: LIST_MAX_HEIGHT,
        zIndex: 30,
        elevation: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        backgroundColor: Colors.card,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
    },
    option: {
        minHeight: 44,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    optionSelected: {
        backgroundColor: Colors.background,
    },
    optionPressed: {
        backgroundColor: Colors.background,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        fontFamily: Apercu.regular,
        color: Colors.textPrimary,
    },
    optionTextSelected: {
        fontFamily: Apercu.medium,
    },
    createText: {
        flex: 1,
        fontSize: 16,
        fontFamily: Apercu.medium,
        color: Colors.primary,
    },
    emptyText: {
        fontSize: 16,
        fontFamily: Apercu.regular,
        color: Colors.textMuted,
    },
});
