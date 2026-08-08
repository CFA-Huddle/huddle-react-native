import ActionModal from "@/components/shared/ActionModal";
import Avatar from "@/components/shared/Avatar";
import ErrorModal from "@/components/shared/ErrorModal";
import Card from "@/components/ui/Card";
import { TextStyles } from "@/constants/theme";
import { useDeletePost } from "@/hooks/useDeletePost";
import { formatLongDateTime } from "@/utils/string";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

interface PostCardProps {
  postId: string;
  authorName: string; 
  avatarUrl?: string;
  authorId: string;
  title: string;
  date: string;
  content: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const PostCard: React.FC<PostCardProps> = ({
  postId,
  authorName,
  authorId,
  avatarUrl,
  title,
  date,
  content,
  onPress,
  style,
}) => {
  const { mutate, error } = useDeletePost();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteModalOpen(false);
    mutate(postId, {
      onError: () => {
        setTimeout(() => {
          setIsErrorModalOpen(true);
        }, 2000);
      },
    });
  };

  const handleLongPress = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCancel = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <ErrorModal
        visible={isErrorModalOpen}
        errorCode={error?.message ?? ""}
        onClose={() => setIsErrorModalOpen(false)}
        subtitle="We couldn't delete this post. Please try again later."
      />
      <ActionModal
        title="Delete Post?"
        subtitle="Are you sure that you would like to delete this post? This cannot be undone."
        visible={isDeleteModalOpen}
        actionLabel="Delete Post"
        onAction={handleDelete}
        onCancel={handleCancel}
      ></ActionModal>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
        activeOpacity={0.6}
        onLongPress={handleLongPress}
      >
        <Card style={styles.card}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push(`/(user)/${authorId}`)} style={styles.header} activeOpacity={0.6}>
              <Avatar avatarUrl={avatarUrl}></Avatar>
              <Text style={styles.author} numberOfLines={1}>
                {authorName}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title} numberOfLines={3}>
            {title}
          </Text>
          <Text style={styles.date}>{formatLongDateTime(date)}</Text>
          <Text style={styles.content} numberOfLines={4}>
            {content}
          </Text>
          <Text style={styles.seeMore}>Tap to see more</Text>
        </Card>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 9,
  },
  card: {
    padding: 15,
    gap: 9,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  author: {
    fontFamily: TextStyles.label.fontFamily,
    fontSize: TextStyles.label.fontSize,
    color: TextStyles.label.color,
  },
  title: {
    fontFamily: TextStyles.title.fontFamily,
    fontSize: TextStyles.title.fontSize,
    color: TextStyles.title.color,
  },
  date: {
    fontFamily: TextStyles.meta.fontFamily,
    fontSize: TextStyles.meta.fontSize,
    color: TextStyles.meta.color,
  },
  content: {
    fontFamily: TextStyles.body.fontFamily,
    fontSize: TextStyles.body.fontSize,
    color: TextStyles.body.color,
    lineHeight: 22,
  },
  seeMore: {
    fontFamily: TextStyles.hint.fontFamily,
    fontSize: TextStyles.hint.fontSize,
    color: TextStyles.hint.color,
    marginTop: 2,
  },
});

export default PostCard;
