import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import RouteHeading from "@/components/shared/RouteHeading";
import Button from "@/components/ui/Button";
import { MODULES } from "@/constants/modules";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ModuleEditorDetail = () => {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const module = MODULES.find((item) => item.id.toString() === id);

  const handleBackButton = () => {
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerButtons}>
        <Button
          text="Back"
          onPress={handleBackButton}
          style={styles.backButton}
          contentStyle={styles.backButtonContent}
          variant="transparent"
          iconLeft={ChevronLeftIcon}
        />
      </View>
      <RouteHeading>{module?.title ?? "Module"}</RouteHeading>
      <Button variant="secondary" text="Add Item" onPress={() => console.log('add item')} iconLeft={PlusIcon} />
    </View>
  );
};

export default ModuleEditorDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    marginTop: 30,
    alignSelf: "flex-start",
  },
  backButtonContent: {
    paddingLeft: 0,
  },
});
