import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import LocationPicker from "@/components/shared/LocationPicker";
import { Colors, TextStyles } from "@/constants/theme";
import { useLocationContext } from "@/context/LocationContext";
import { LocationLabels } from "@/types/Location";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const LocationHeader: React.FC = () => {
    const { selectedLocation, locations } = useLocationContext();
    if (!selectedLocation) return null;

    return (
        <>
            <View style={styles.container}>
                {locations.length > 1 ? (
                    <LocationPicker>
                        <View style={styles.locationContainer}>
                            <Text style={styles.fadedText}>{selectedLocation}</Text>
                            <Text style={styles.separator}>·</Text>
                            <Text style={styles.text}>{LocationLabels[selectedLocation]}</Text>
                            <ChevronDownIcon color={Colors.primary} width={24} height={24} />
                        </View>
                    </LocationPicker>
                ) :
                    <View style={styles.locationContainer}>
                        <Text style={styles.fadedText}>{selectedLocation}</Text>
                        <Text style={styles.separator}>·</Text>
                        <Text style={styles.text}>{LocationLabels[selectedLocation]}</Text>
                    </View>
                }
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    locationContainer: {
        width: "100%",
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
