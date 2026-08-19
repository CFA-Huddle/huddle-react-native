import UserProfilePage from "@/components/settings/UserProfilePage";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";


const ProfileDetailsScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View style={styles.container}>
            <UserProfilePage id={id} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
    }
});

export default ProfileDetailsScreen;