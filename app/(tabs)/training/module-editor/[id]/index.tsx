import CheckListIcon from "@/assets/icons/checklist.svg";
import ChevronLeftIcon from "@/assets/icons/chevron-left.svg";
import EditIcon from "@/assets/icons/edit.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import ActionModal from "@/components/shared/ActionModal";
import ErrorModal from "@/components/shared/ErrorModal";
import RouteHeading from "@/components/shared/RouteHeading";
import AddItemModal from "@/components/training/AddItemModal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { Colors, TextStyles } from "@/constants/theme";
import { useCreateTask } from "@/hooks/useCreateTask";
import { useDeleteTask } from "@/hooks/useDeleteTask";
import { useModule } from "@/hooks/useModules";
import { Task } from "@/types/Modules";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Circle } from "react-native-animated-spinkit";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ModuleEditorDetail = () => {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: module, error, isLoading } = useModule(id);
  const createTask = useCreateTask();
  const { mutate: deleteTask, error: deleteError, reset: resetDelete } = useDeleteTask();
  const addItemRef = useRef<BottomSheetModal>(null);
  const [dismissedError, setDismissedError] = useState<Error | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleteErrorVisible, setIsDeleteErrorVisible] = useState(false);

  const tasks = useMemo(
    () => module?.tasks ?? [],
    [module?.tasks],
  );

  const handleBackButton = () => {
    router.back();
  };

  const handleEditButton = () => {
    router.navigate(`/training/module-editor/${id}/edit`);
  };

  const handleAddItem = ({ name, link_url }: { name: string; link_url?: string }) => {
    if (!id) return;
    addItemRef.current?.dismiss()
    createTask.mutate(
      {
        moduleId: id,
        payload: { name, ...(link_url ? { link_url } : {}) },
      }
    );
  };

  const handleDelete = () => {
    if (!taskToDelete || !id) return;
    const taskId = taskToDelete.id;
    setTaskToDelete(null);
    deleteTask(
      { moduleId: id, taskId },
      {
        onError: () => {
          setIsDeleteErrorVisible(true);
        },
      },
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Spinner isVisible={createTask.isPending} />
      <AddItemModal
        ref={addItemRef as React.RefObject<BottomSheetModal>}
        isSubmitting={createTask.isPending}
        onSubmit={handleAddItem}
      />
      <ErrorModal
        errorCode={error?.message ?? ""}
        visible={!!error && error !== dismissedError}
        onClose={() => setDismissedError(error)}
        subtitle="We're having some trouble loading this module. Please try again later."
      />
      <ErrorModal
        visible={createTask.isError}
        errorCode={createTask.error instanceof Error ? createTask.error.message : "Unknown error"}
        onClose={createTask.reset}
        subtitle="We couldn't add this item. Please try again."
      />
      <ErrorModal
        visible={isDeleteErrorVisible}
        errorCode={deleteError?.message ?? ""}
        onClose={() => {
          setIsDeleteErrorVisible(false);
          resetDelete();
        }}
        subtitle="We couldn't delete this item. Please try again later."
      />
      <ActionModal
        title="Delete Item?"
        subtitle="Are you sure that you would like to delete this item? This cannot be undone."
        visible={!!taskToDelete}
        actionLabel="Delete Item"
        onAction={handleDelete}
        onCancel={() => setTaskToDelete(null)}
      />
      <View style={styles.header}>
        <View style={styles.headerButtons}>
          <Button
            text="Back"
            onPress={handleBackButton}
            style={styles.backButton}
            contentStyle={styles.backButtonContent}
            variant="transparent"
            iconLeft={ChevronLeftIcon}
          />
          <Button
            text="Edit"
            onPress={handleEditButton}
            style={styles.backButton}
            variant="secondary"
            iconLeft={EditIcon}
          />
        </View>
        <RouteHeading>{module?.name ?? "Module"}</RouteHeading>
        <Button
          variant="secondary"
          text="Add Item"
          onPress={() => addItemRef.current?.present()}
          iconLeft={PlusIcon}
        />
        <Text style={styles.checklistHeading}>Checklist</Text>
      </View>
      {isLoading && !module ? (
        <View style={styles.loadingContainer}>
          <Circle size={64} color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.noResultsContainer}>
              <CheckListIcon width={48} height={48} color={Colors.secondary} />
              <Text style={styles.noResultsText}>{`This module has no tasks`}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              onLongPress={() => setTaskToDelete(item)}
            >
              <Card style={styles.taskCard}>
                <Text style={styles.taskText}>{item.name}</Text>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default ModuleEditorDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  checklistHeading: {
    fontFamily: TextStyles.largeLabel.fontFamily,
    fontSize: TextStyles.largeLabel.fontSize,
    color: TextStyles.largeLabel.color,
    marginTop: 16,
    marginBottom: 16,
  },
  separator: {
    height: 10,
  },
  taskCard: {
    padding: 20,
  },
  taskText: {
    fontFamily: TextStyles.body.fontFamily,
    fontSize: TextStyles.body.fontSize,
    color: TextStyles.body.color,
    lineHeight: 18,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  noResultsText: {
    fontFamily: TextStyles.subHeading.fontFamily,
    fontSize: TextStyles.subHeading.fontSize,
    color: Colors.secondary,
    textAlign: "center",
  },
});
