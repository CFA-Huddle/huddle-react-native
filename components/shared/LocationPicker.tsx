import { useLocationContext } from '@/context/LocationContext';
import { LocationLabels } from '@/types/Location';
import { MenuView } from '@expo/ui/community/menu';

interface LocationPickerProps {
    children: React.ReactElement;
}

export default function LocationPicker({ children }: LocationPickerProps) {
    const { selectedLocation, setSelectedLocation, locations } = useLocationContext();

    return (
        <MenuView
        actions={locations.map((location) => ({
            id: location, title: location + " · " + LocationLabels[location], state: location === selectedLocation ? "on" : "off"
        }))}
        onPressAction={e => {
            const action = e.nativeEvent.event;
            setSelectedLocation(action);
        }}
        >
            {children}
        </MenuView>
    );
}