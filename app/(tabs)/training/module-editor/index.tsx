import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import ActionModal from "@/components/shared/ActionModal";
import ErrorModal from "@/components/shared/ErrorModal";
import RouteHeading from "@/components/shared/RouteHeading";
import { ModuleItem } from "@/components/training/Module";
import Button from "@/components/ui/Button";
import { Colors, TextStyles } from "@/constants/theme";
import { useDeleteModule } from "@/hooks/useDeleteModule";
import { useModules } from "@/hooks/useModules";
import { Module } from "@/types/Modules";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { RefreshControl, SectionList, StyleSheet, Text, View } from "react-native";
import { Circle } from "react-native-animated-spinkit";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

type ModuleSection = { title: string; data: Module[] };

const ModuleEditor = () => {
  const insets = useSafeAreaInsets();
  const styles = makeStyles(insets);

  const {
    data: modules,
    error,
    refetch,
    isRefetching,
    isLoading,
  } = useModules();
  const { mutate: deleteModule, error: deleteError, reset: resetDelete } = useDeleteModule();

  const [dismissedError, setDismissedError] = useState<Error | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [isDeleteErrorVisible, setIsDeleteErrorVisible] = useState(false);

  const sections = useMemo(() => {
    return (modules ?? []).reduce<ModuleSection[]>((acc, module) => {
      const existing = acc.find((section) => section.title === module.group_name);
      if (existing) {
        existing.data.push(module);
      } else {
        acc.push({ title: module.group_name, data: [module] });
      }
      return acc;
    }, []);
  }, [modules]);

  const handleBackButton = () => {
    router.back();
  };

  const handleDelete = () => {
    if (!moduleToDelete) return;
    const moduleId = moduleToDelete.id;
    setModuleToDelete(null);
    deleteModule(moduleId, {
      onError: () => {
        setIsDeleteErrorVisible(true);
      },
    });
  };

  return (
    <View style={styles.container}>
      <ErrorModal
        errorCode={error?.message ?? ""}
        visible={!!error && error !== dismissedError}
        onClose={() => setDismissedError(error)}
        subtitle="We're having some trouble loading this content. Please try again later."
      />
      <ErrorModal
        visible={isDeleteErrorVisible}
        errorCode={deleteError?.message ?? ""}
        onClose={() => {
          setIsDeleteErrorVisible(false);
          resetDelete();
        }}
        subtitle="We couldn't delete this module. Please try again later."
      />
      <ActionModal
        title="Delete Module?"
        subtitle="Are you sure that you would like to delete this module? This cannot be undone."
        visible={!!moduleToDelete}
        actionLabel="Delete Module"
        onAction={handleDelete}
        onCancel={() => setModuleToDelete(null)}
      />
      <SectionList
        style={styles.sectionList}
        sections={sections}
        extraData={modules}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            progressViewOffset={insets.top}
            refreshing={isRefetching && !isLoading}
            onRefresh={refetch}
            colors={[Colors.muted]}
            tintColor={Colors.muted}
          />
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 40 }} />}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <Circle size={64} color={Colors.primary} />
            </View>
          ) : null
        }
        ListHeaderComponent={() => (
          <>
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
            <RouteHeading>Module Editor</RouteHeading>
            <Button
              variant="secondary"
              text="Create New Module"
              onPress={() => router.push("/training/module-editor/create")}
              iconLeft={PlusIcon}
            />
          </>
        )}
        renderItem={({ item }) => (
          <ModuleItem
            module={item}
            onPress={() => router.push(`/training/module-editor/${item.id}`)}
            onLongPress={() => setModuleToDelete(item)}
          />
        )}
      />
    </View>
  );
};

export default ModuleEditor;

const makeStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    sectionList: {
      paddingTop: insets.top,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      fontFamily: TextStyles.largeLabel.fontFamily,
      fontSize: TextStyles.largeLabel.fontSize,
      color: TextStyles.largeLabel.color,
      marginVertical: 15,
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
    loadingContainer: {
      paddingVertical: 40,
      alignItems: "center",
      justifyContent: "center",
    },
  });
