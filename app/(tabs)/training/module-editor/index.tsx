import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import PlusIcon from '@/assets/icons/plus.svg';
import CreateModuleModal from '@/components/settings/CreateModuleModal';
import RouteHeading from '@/components/shared/RouteHeading';
import { ModuleItem } from '@/components/training/Module';
import Button from '@/components/ui/Button';
import { MODULES } from '@/constants/modules';
import { Colors, TextStyles } from '@/constants/theme';
import { Module } from '@/types/Modules';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

type ModuleSection = { title: string; data: Module[] };

const ModuleEditor = () => {
  const insets = useSafeAreaInsets();
  const styles = makeStyles(insets);

  const [modules, setModules] = useState<Module[]>(MODULES);

  const createModuleBottomSheetRef = useRef<BottomSheetModal>(null);

  const sections = useMemo(() => {
    return modules.reduce<ModuleSection[]>((acc, module) => {
      const existing = acc.find((section) => section.title === module.group);
      if (existing) {
        existing.data.push(module);
      } else {
        acc.push({ title: module.group, data: [module] });
      }
      return acc;
    }, []);
  }, [modules]);

  const handleBackButton = () => {
    router.back();
  }

  const handleCreateModule = (module: Module) => {
    setModules((current) => [...current, module]);
  }

  return (
    <>
      <CreateModuleModal
        ref={createModuleBottomSheetRef as React.RefObject<BottomSheetModal>}
        onSave={handleCreateModule}
      />
      <View style={[styles.container]}>
        <SectionList
          style={styles.sectionList}
          sections={sections}
          extraData={modules}
          keyExtractor={(item) => item.id.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          stickySectionHeadersEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
              <Button variant="secondary" text="Create New Module" onPress={() => createModuleBottomSheetRef.current?.present()} iconLeft={PlusIcon} />
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
    </>
  )
}

export default ModuleEditor

const makeStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    sectionList: {
      paddingTop: insets.top,
    },
    sectionHeader: {
      fontSize: TextStyles.title.fontSize,
      fontFamily: TextStyles.title.fontFamily,
      color: TextStyles.subTitle.color,
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
    moduleItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: Colors.card,
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    moduleIcon: {
      width: 40,
      height: 40,
    },

    moduleTitle: {
      fontSize: TextStyles.subTitle.fontSize,
      fontFamily: TextStyles.subTitle.fontFamily,
      color: TextStyles.title.color,
    },
  });