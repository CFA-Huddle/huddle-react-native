import { Tabs } from "expo-router";

import ChecklistIcon from "@/assets/icons/checklist.svg";
import GiftIcon from "@/assets/icons/gift.svg";
import HomeIcon from "@/assets/icons/home.svg";
import LetterIcon from "@/assets/icons/letter.svg";
import UserIcon from "@/assets/icons/user.svg";
import { Apercu, Colors } from "@/constants/theme";
import { DeviceType, deviceType } from "expo-device";
export default function TabLayout() {
  const isDesktop = deviceType === DeviceType.DESKTOP;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarLabelStyle: {
          fontFamily: Apercu.medium,
          fontSize: 11,
        },
        tabBarActiveBackgroundColor: isDesktop ? Colors.background : undefined,
        tabBarPosition: isDesktop ? "left" : "bottom",
        tabBarLabelPosition: isDesktop ? "beside-icon" : "below-icon",
        tabBarStyle: {
          borderRightWidth: 0,
        },
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="posts"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color} fill={color} />,
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: "Training",
          tabBarIcon: ({ color }) => (
            <ChecklistIcon color={color} fill={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="feedback/index"
        options={{
          href: null,
          title: "Feedback",
          tabBarIcon: ({ color }) => <LetterIcon color={color} fill={color} />,
        }}
      />
      <Tabs.Screen
        name="rewards/index"
        options={{
          href: null,
          title: "Rewards",
          tabBarIcon: ({ color }) => <GiftIcon color={color} fill={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Your Profile",
          tabBarIcon: ({ color }) => <UserIcon color={color} fill={color} />,
        }}
      />
    </Tabs>
  );
}
