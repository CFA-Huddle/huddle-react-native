import BottomModal from "@/components/ui/BottomModal";
import CheckboxInput from "@/components/ui/CheckboxInput";
import { TextStyles } from "@/constants/theme";
import { Role, RoleLabels } from "@/types/Membership";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { StyleSheet, Text, View } from "react-native";


const HIDDEN_ROLES = [Role.ADMIN, Role.OPERATOR];

interface RolesModalProps {
    ref: React.RefObject<BottomSheetModal>;
    selectedRole: Role;
    onSelectRole: (role: Role) => void;
    onSave: () => void;
}

export default function RolesModal({ ref, selectedRole, onSelectRole, onSave }: RolesModalProps) {
    return (
        <BottomModal
            ref={ref}
            onSave={onSave}
            headerText="Set Role"
            closeButtonText="Save"
        >
            <View style={styles.modalContent}>
                <Text style={styles.modalSectionLabel}>Role</Text>
                <View style={styles.modalList}>
                    {Object.values(Role).filter((value: Role) => !HIDDEN_ROLES.includes(value)).map((value: Role) => (
                        <CheckboxInput<Role>
                            key={value}
                            label={RoleLabels[value]}
                            optionKey={value}
                            selected={selectedRole === value}
                            onPress={onSelectRole}
                        />
                    ))}
                </View>
            </View>
        </BottomModal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
        width: "100%",
        alignSelf: "stretch",
    },
    modalSectionLabel: {
        fontFamily: TextStyles.body.fontFamily,
        fontSize: TextStyles.subHeading.fontSize,
        color: TextStyles.subHeading.color,
        marginBottom: 10,
        alignSelf: "flex-start",
    },
    modalList: {
        width: "100%",
        gap: 8,
    },
});
