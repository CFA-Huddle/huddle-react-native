import PlusIcon from "@/assets/icons/plus.svg";
import PostCard from "@/components/posts/PostCard";
import ErrorModal from "@/components/shared/ErrorModal";
import Heading from "@/components/shared/Heading";
import Button from "@/components/ui/Button";
import { Colors } from "@/constants/theme";
import { useLocationUsers } from "@/hooks/useLocationUsers";
import { usePosts } from "@/hooks/usePosts";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  const {
    data: posts,
    error,
    refetch,
    isRefetching,
    isPending,
    isLoading,
  } = usePosts("30023");

  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const { data: users, isLoading: isUsersLoading } = useLocationUsers("30023");

  const userMap = React.useMemo(() => {
    if (!users) return {};

    return Object.fromEntries(
      users.map((user) => [user.id, { name: `${user.first_name} ${user.last_name}`, avatar_url: user.avatar_url ?? undefined }]),
    );
  }, [users]);

  useEffect(() => {
    if (error) {
      setIsErrorVisible(true);
    }
  }, [error]);

  const HandlePostTouch = (id: string) => {
    router.navigate({
      pathname: "/posts/[id]",
      params: { id: id },
    });
  };

  const HandleCreatePostTouch = () => {
    router.navigate({
      pathname: "/posts/create",
    });
  };

  return (
    <View style={styles.container}>
      <ErrorModal
        errorCode={error?.message ?? ""}
        visible={!!error && isErrorVisible}
        onClose={() => setIsErrorVisible(false)}
        subtitle="We're having some trouble loading this content. Please try again later."
      />
      <FlatList
        style={{ paddingTop: insets.top }}
        contentContainerStyle={styles.listContainer}
        data={posts}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            progressViewOffset={insets.top}
            refreshing={
              isRefetching || isLoading || isPending || isUsersLoading
            }
            onRefresh={refetch}
            colors={[Colors.muted]}
            tintColor={Colors.muted}
          />
        }
        ListHeaderComponent={() => (
          <>
            <Heading>Latest Announcements</Heading>
            <Button
              iconLeft={PlusIcon}
              variant="secondary"
              text="Create New Post"
              onPress={HandleCreatePostTouch}
              style={styles.button}
            />
          </>
        )}
        renderItem={({ item }) => (
          <PostCard
            postId={item.id}
            authorId={item.author_id}
            authorName={userMap[item.author_id]?.name ?? ""}
            avatarUrl={userMap[item.author_id]?.avatar_url}
            title={item.title}
            date={item.created_at}
            content={item.content}
            onPress={() => {
              HandlePostTouch(item.id);
            }}
            style={styles.card}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginBottom: 15,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    marginBottom: 10,
  },
});

export default HomeScreen;
