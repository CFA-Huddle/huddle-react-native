import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import LocationPicker from "@/components/shared/LocationPicker";
import { Colors, TextStyles } from "@/constants/theme";
import { LocationLabels } from "@/types/Location";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

interface LocationHeaderProps {
    location: string;
    style?: StyleProp<ViewStyle>;
}

const LocationHeader: React.FC<LocationHeaderProps> = ({ location, style }) => {
    return (
        <>
            <View style={styles.container}>
                <LocationPicker>
                    <View style={styles.locationContainer}>
                        <Text style={styles.fadedText}>{location}</Text>
                        <Text style={styles.separator}>·</Text>
                        <Text style={styles.text}>{LocationLabels[location]}</Text>
                        <ChevronDownIcon color={Colors.primary} width={24} height={24} />
                    </View>
                </LocationPicker>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    container: {
        width: "100%",
        paddingTop: 64,
        padding: 12,
        backgroundColor: Colors.headerBackground,
        justifyContent: "center",
        alignItems: "center",
    },
    separator: {
        color: TextStyles.body.color,
        fontFamily: TextStyles.body.fontFamily,
        fontSize: TextStyles.body.fontSize,
    },
    fadedText: {
        color: Colors.textMuted,
        fontFamily: TextStyles.body.fontFamily,
        fontSize: TextStyles.body.fontSize,
    },
    text: {
        color: TextStyles.body.color,
        fontFamily: TextStyles.body.fontFamily,
        fontSize: TextStyles.body.fontSize,
    },
});

export default LocationHeader;
