import UserInformationForm from "@/components/settings/UserInformationForm";
import Spinner from "@/components/ui/Spinner";
import { useAuthContext } from "@/context/AuthContext";
import { useLocationUsers } from "@/hooks/useLocationUsers";
import { User } from "@/types/User";

const AccountInformationScreen = () => {
    const { user: authUser } = useAuthContext();

    const { data: users, isLoading: isUsersLoading } = useLocationUsers();
    const user = users?.find((user: User) => user.id === authUser?.sub);

    if (!user) {
        return null;
    }

    return (
        <>
            <Spinner isVisible={isUsersLoading} />
            <UserInformationForm user={user} />
        </>
    );
};



export default AccountInformationScreen;
