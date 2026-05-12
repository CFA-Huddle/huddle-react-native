import { authService } from "@/api/services/authService";
import { notificationService } from "@/api/services/notificationService";
import { useAuthContext } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginNewPasswordCredentials {
  newPassword: string;
}

interface ConfirmResetPasswordCredentials {
  confirmationCode: string;
  email: string;
  newPassword: string;
}

export function useLogin() {
  const { setIsLoggedIn, setUser } = useAuthContext();

  return useMutation({
    mutationFn: ({ email, password }: LoginCredentials) =>
      authService.login(email, password),
    onSuccess: async ({ nextStep }) => {
      if (nextStep.signInStep === "DONE") {
        try {
          const attributes = await authService.fetchUserAttributes();
          await notificationService.initializeForUser(attributes?.sub);
          setUser(attributes);
        } catch {
          setUser(null);
        }
        setIsLoggedIn(true);
      }
    },
  });
}

export function useLoginNewPassword() {
  const { setIsLoggedIn, setUser } = useAuthContext();
  return useMutation({
    mutationFn: ({ newPassword }: LoginNewPasswordCredentials) =>
      authService.loginNewPassword(newPassword),
    onSuccess: async () => {
      try {
        const attributes = await authService.fetchUserAttributes();
        await notificationService.initializeForUser(attributes?.sub);
        setUser(attributes);
      } catch {
        setUser(null);
      }
      setIsLoggedIn(true);
    },
  });
}

export function useLogout() {
  const { setIsLoggedIn, setUser } = useAuthContext();

  return useMutation({
    mutationFn: async () => {
      await notificationService.unregisterPushToken();
      await authService.logout();
    },
    onSuccess: async () => {
      setUser(null);
      setIsLoggedIn(false);
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.resetPassword(email),
  });
}

export function useConfirmResetPassword() {
  return useMutation({
    mutationFn: ({
      confirmationCode,
      email,
      newPassword,
    }: ConfirmResetPasswordCredentials) =>
      authService.confirmResetPassword(confirmationCode, email, newPassword),
  });
}
