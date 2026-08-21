import BottomModal from "@/components/ui/BottomModal";
import Combobox from "@/components/ui/Combobox";
import TextField from "@/components/ui/TextField";
import { MODULE_GROUPS } from "@/constants/modules";
import { Apercu, Colors } from "@/constants/theme";
import { Module } from "@/types/Modules";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const EMPTY_MODULE: Module = {
    id: "",
    title: "",
    icon: "https://media.pathway.cfahome.com/img/procedures/WHED.svg",
    group: "",
};

interface CreateModuleModalProps {
    ref: React.RefObject<BottomSheetModal>;
    onSave: (module: Module) => void;
}

export default function CreateModuleModal({ ref, onSave }: CreateModuleModalProps) {
    const [module, setModule] = useState<Module>(EMPTY_MODULE);
    const [groups, setGroups] = useState<string[]>([...MODULE_GROUPS]);

    const handleSave = () => {
        const group = module.group.trim();
        onSave({ ...module, group });
        if (group && !groups.includes(group)) {
            setGroups((current) => [...current, group]);
        }
        console.log(module);
        setModule(EMPTY_MODULE);
    };

    return (
        <BottomModal
            ref={ref}
            onSave={handleSave}
            headerText="Create New Module"
            closeButtonText="Continue"
            saveDisabled={!module.title.trim() || !module.group.trim()}
        >
            <View style={styles.modalContent}>
                <View style={styles.field}>
                    <Text style={styles.label}>Module Name</Text>
                    <TextField
                        inBottomSheet
                        placeholder="Enter name..."
                        value={module.title}
                        onChangeText={(text) => {
                            setModule({
                                ...module,
                                title: text,
                                id: text.toLowerCase().replace(/ /g, "-"),
                            });
                        }}
                        containerStyle={styles.fieldControl}
                        inputContainerStyle={styles.inputContainer}
                        style={styles.input}
                        returnKeyType="done"
                    />
                </View>
                <View style={[styles.field, styles.groupField]}>
                    <Text style={styles.label}>Group</Text>
                    <Combobox
                        inBottomSheet
                        options={groups}
                        value={module.group}
                        onChange={(group) => setModule((current) => ({ ...current, group }))}
                        placeholder="Select a group"
                    />
                </View>
            </View>
        </BottomModal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        width: "100%",
        alignSelf: "stretch",
        gap: 20,
        overflow: "visible",
        zIndex: 1,
    },
    field: {
        width: "100%",
        gap: 6,
        overflow: "visible",
    },
    groupField: {
        zIndex: 3,
    },
    fieldControl: {
        marginBottom: 0,
    },
    label: {
        fontSize: 18,
        fontFamily: Apercu.regular,
        color: Colors.textSecondary,
        alignSelf: "flex-start",
    },
    inputContainer: {
        height: 51,
    },
    input: {
        height: 51,
        paddingVertical: 0,
        paddingHorizontal: 20,
    },
});
