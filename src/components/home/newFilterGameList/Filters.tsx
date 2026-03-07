export interface FiltersState {
    city: string;
    place: string;
}
import type { City } from "../../../types/game";
//gameLocationCity
//gameLocationPlace
/*Why This Is “Best Practice”
✅ Single Source of Truth

Only filters is state.

    Everything else is derived.

    No duplicated data.

✅ useMemo for Derived Data

Prevents unnecessary recalculation + rerenders.
*/

interface FiltersProps {
    filters: FiltersState;
    cities: City[];
    places: string[];
    onChange: (filters: FiltersState) => void;
}

export default function Filters({
                                    filters,
                                    cities,
                                    places,
                                    onChange
                                }: FiltersProps) {

    return (
        <div className="filters">

            <select
                value={filters.city}
                onChange={(e) =>
                    onChange({
                        ...filters,
                        city: e.target.value,
                        place: ""
                    })
                }
            >
                <option value="">All Cities</option>
                {cities.map((s) => (
                    <option key={s.id} value={s.cityName || ""}>
                        {s.cityName}
                    </option>
                ))}
            </select>

            <select
                value={filters.place}
                onChange={(e) =>
                    onChange({
                        ...filters,
                        place: e.target.value
                    })
                }
            >
                <option value="">All Places</option>
                {places.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </select>

        </div>
    );
}