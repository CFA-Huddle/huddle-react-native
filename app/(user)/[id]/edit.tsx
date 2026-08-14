import UserInformationForm from "@/components/settings/UserInformationForm";
import { useLocationUsers } from "@/hooks/useLocationUsers";
import { User } from "@/types/User";
import { router, useLocalSearchParams } from "expo-router";

const EditProfileScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data: users } = useLocationUsers();
    const user = users?.find((user: User) => user.id === id);

    if (!user) {
        router.back();
        return null;
    }

    return (
        <>
            <UserInformationForm user={user} />
        </>
    );
};

export default EditProfileScreen;