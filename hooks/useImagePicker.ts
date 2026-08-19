import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const pickProfilePicture = async (): Promise<{ base64: string; extension: string } | null> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Photo Library Access', 'Allow access to your photo library in your device Settings to upload images.');
      return null;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
      base64: true,
      shape: 'oval'
    });

    if (result.canceled) return null;
    if(result.assets.length === 0) return null;
    if(!result.assets[0].base64) return null;
    if(!result.assets[0].mimeType) return null;

    return {
        base64: `data:${result.assets[0].mimeType};base64,${result.assets[0].base64}`,
        extension: result.assets[0].mimeType?.split('/')[1],
    };
};

export default pickProfilePicture;