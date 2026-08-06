import { membershipService } from "@/api/services/membershipService";
import { getPreference, savePreference } from "@/utils/preferences";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";

interface LocationContextType {
  selectedLocation: string | null;
  setSelectedLocation: (location: string) => void;
  locations: string[];
  setLocations: (locations: string[]) => void;
}

const LocationContext = createContext<LocationContextType>({
    selectedLocation: null,
    setSelectedLocation: () => {},
    locations: [],
    setLocations: () => {},
});

// choose first location from user's memberships
export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthContext();
    const [selectedLocation, setSelectedLocation] = useState<string | null>("Loading...");
    const [locations, setLocations] = useState<string[]>([]);

    useEffect(() => {
        const initializeLocation = async () => {
            const userID = user?.sub;
            if (!userID) return;
            const memberships = await membershipService.getMembershipsByUserId(userID);
            const savedLocation = await getPreference("selectedLocation");
            setSelectedLocation(savedLocation ?? memberships[0]?.location_id ?? null);
            setLocations(memberships.map((membership) => membership.location_id));
        }
        initializeLocation();
    }, [user]);

    useEffect(() => {
        if (selectedLocation && selectedLocation !== "Loading...") {
            savePreference("selectedLocation", selectedLocation);
        }
    }, [selectedLocation]);

    return <LocationContext.Provider value={{ selectedLocation, setSelectedLocation, locations, setLocations }}>{children}</LocationContext.Provider>;
};

export const useLocationContext = () => useContext(LocationContext);
