// Types based on your PostgreSQL schema
interface ISportDetails {
    name: string,
    level: string
}

// Convert sports array to JSON object for backend
export const convertSportsToObject = (sports: ISportDetails[]): Record<string, string> => {
    return sports.reduce((acc, sport) => {
        acc[sport.name] = sport.level; // Store sport name as key and level as value
        return acc;
    }, {} as Record<string, string>);
};

// Convert JSON object from backend to sports array
export const convertSportsToArray = (sports: Record<string, string>): ISportDetails[] => {
    return Object.entries(sports).map(([name, level]) => ({
        name,
        level
    }));
};
