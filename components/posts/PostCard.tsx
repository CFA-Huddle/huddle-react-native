import ActionModal from "@/components/shared/ActionModal";
import Avatar from "@/components/shared/Avatar";
import ErrorModal from "@/components/shared/ErrorModal";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { TextStyles } from "@/constants/theme";
import { useDeletePost } from "@/hooks/useDeletePost";
import { formatLongDateTime } from "@/utils/string";
import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type LoadedPostCardProps = {
  isLoading?: false;
  postId: string;
  authorName: string;
  avatarUrl?: string;
  title: string;
  date: string;
  content: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

type PostCardProps =
  | LoadedPostCardProps
  | { isLoading: true; style?: StyleProp<ViewStyle> };

const PostCardSkeleton: React.FC = () => {
  return (
    <>
      <View style={styles.header}>
        <Skeleton width={28} height={28} borderRadius={14} />
        <Skeleton width={120} height={16} />
      </View>
      <Skeleton width="85%" height={20} />
      <Skeleton width={140} height={16} />
      <View style={styles.contentSkeleton}>
        <Skeleton width="100%" height={16} />
        <Skeleton width="100%" height={16} />
        <Skeleton width="70%" height={16} />
      </View>
      <Skeleton width={110} height={16} style={styles.seeMoreSkeleton} />
    </>
  );
};

const PostCard: React.FC<PostCardProps> = (props) => {
  if (props.isLoading) {
    return (
      <View style={[styles.container, props.style]}>
        <Card style={styles.card}>
          <PostCardSkeleton />
        </Card>
      </View>
    );
  }

  return <LoadedPostCard {...props} />;
};

const LoadedPostCard: React.FC<LoadedPostCardProps> = ({
  postId,
  authorName,
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
            <Avatar avatarUrl={avatarUrl}></Avatar>
            <Text style={styles.author} numberOfLines={1}>
              {authorName}
            </Text>
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
  contentSkeleton: {
    gap: 6,
  },
  seeMoreSkeleton: {
    marginTop: 2,
  },
});

export default PostCard;
