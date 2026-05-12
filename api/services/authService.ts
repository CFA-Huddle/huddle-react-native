import {
  confirmResetPassword,
  confirmSignIn,
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
  resetPassword,
  signIn,
  signOut,
  updateUserAttributes,
} from "aws-amplify/auth";

export const authService = {
  login: async (email: string, password: string) => {
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password,
    });
    return { isSignedIn, nextStep };
  },
  logout: async (global = false) => {
    await signOut({ global });
  },
  loginNewPassword: async (newPassword: string) => {
    await confirmSignIn({
      challengeResponse: newPassword,
    });
  },
  getToken: async () => {
    const session = await fetchAuthSession();
    return session.tokens?.accessToken?.toString() ?? null;
  },
  getCurrentUser: async () => {
    try {
      return await getCurrentUser();
    } catch {
      return null;
    }
  },
  fetchUserAttributes: async () => {
    try {
      return await fetchUserAttributes();
    } catch {
      return null;
    }
  },
  resetPassword: async (email: string) => {
    const { nextStep } = await resetPassword({
      username: email,
    });
    return { nextStep };
  },
  confirmResetPassword: async (
    confirmationCode: string,
    email: string,
    newPassword: string,
  ) => {
    await confirmResetPassword({
      confirmationCode: confirmationCode,
      username: email,
      newPassword: newPassword,
    });
  },
  updateUserAttributes: async (
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined,
    profilePicture: string | undefined = undefined,
  ) => {
    let userAttributes: Record<string, string> = {};
    if (firstName) {
      userAttributes.given_name = firstName;
    }
    if (lastName) {
      userAttributes.family_name = lastName;
    }
    if (email) {
      userAttributes.email = email;
    }
    if (profilePicture) {
      userAttributes.picture = profilePicture;
    }
    return await updateUserAttributes({
      userAttributes: userAttributes,
    });
  },
};
