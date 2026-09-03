import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import LocationPicker from "@/components/shared/LocationPicker";
import Skeleton from "@/components/ui/Skeleton";
import { Colors, TextStyles } from "@/constants/theme";
import { useLocationContext } from "@/context/LocationContext";
import { LocationLabels } from "@/types/Location";
import { DeviceType, deviceType } from "expo-device";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const LocationHeader: React.FC = () => {
    const isDesktop = deviceType === DeviceType.DESKTOP;
    const styles = makeStyles(isDesktop);
    
    const { selectedLocation, locations } = useLocationContext();
    
    if (!selectedLocation) return (
        <View style={styles.container}>
            <View style={styles.locationContainer}>
                <Skeleton width={56} height={16} />
                <Skeleton width={8} height={16} />
                <Skeleton width={120} height={16} />
            </View>
        </View>
    );

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

const makeStyles = (isDesktop: boolean) => StyleSheet.create({
    locationContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    container: {
        width: "100%",
        paddingTop: isDesktop ? 0 : 64,
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
