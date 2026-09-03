import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import ErrorModal from "@/components/shared/ErrorModal";
import RouteHeading from "@/components/shared/RouteHeading";
import { ModuleItem } from "@/components/training/Module";
import Button from "@/components/ui/Button";
import { Colors, TextStyles } from "@/constants/theme";
import { useModules } from "@/hooks/useModules";
import { Module } from "@/types/Modules";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

  const [dismissedError, setDismissedError] = useState<Error | null>(null);

  const sections = useMemo(() => {
    const grouped = (modules ?? []).reduce<ModuleSection[]>((acc, module) => {
      const existing = acc.find(
        (section) => section.title === module.group_name,
      );

      if (existing) {
        existing.data.push(module);
      } else {
        acc.push({
          title: module.group_name,
          data: [module],
        });
      }

      return acc;
    }, []);

    return grouped
      .map((section) => ({
        ...section,
        data: [...section.data].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [modules]);

  const handleBackButton = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ErrorModal
        errorCode={error?.message ?? ""}
        visible={!!error && error !== dismissedError}
        onClose={() => setDismissedError(error)}
        subtitle="We're having some trouble loading this content. Please try again later."
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
          <Text style={[styles.sectionHeader, TextStyles.largeLabel]}>
            {title}
          </Text>
        )}
        renderSectionFooter={() => <View style={styles.sectionFooter} />}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
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
      marginBottom: 16,
      marginTop: 16,
    },
    sectionFooter: {
      marginBottom: 10,
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
