import CloseIcon from "@/assets/icons/close-outline.svg";
import SearchIcon from "@/assets/icons/search.svg";
import { Colors, TextStyles } from "@/constants/theme";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from "react-native";

interface SearchBarProps extends Omit<TextInputProps, "style"> {
  value: string;
  onChangeText: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search...",
  containerStyle,
  ...rest
}: SearchBarProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <SearchIcon width={20} height={20} color={Colors.secondary} />
      <TextInput
        placeholderTextColor={Colors.secondary}
        placeholder={placeholder}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} hitSlop={8}>
          <CloseIcon width={20} height={20} color={Colors.secondary} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.darkBackground,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
  },
  input: {
    paddingVertical: 10,
    borderRadius: 8,
    fontFamily: TextStyles.body.fontFamily,
    fontSize: TextStyles.body.fontSize,
    color: Colors.secondary,
    flex: 1,
  },
});

export default SearchBar;
