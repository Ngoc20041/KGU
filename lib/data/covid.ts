import Papa from 'papaparse';
import { parse, format, startOfWeek, isSameWeek } from 'date-fns';

// Data Types
export interface CovidRecord {
    RecordNo: string;
    endtime: string; // "09/04/2020 13:33"
    region: string;
    age: string;
    gender: string;
    // Health behaviors(Frequency)
    // i12_health_1: Wore a face mask outside your home
    // i12_health_2: Washed hands with soap
    // i12_health_3: Used hand sanitizer
    // i12_health_4: Covered nose and mouth when sneezing / coughing
    // i12_health_5: Avoided contact with people who have symptoms
    // i12_health_6: Avoided going out in general
    // i12_health_7: Avoided small gatherings
    // i12_health_8: Avoided medium gatherings
    // i12_health_9: Avoided large gatherings
    // i12_health_10: Avoided crowded areas
    // i12_health_11: Avoided shops
    // i12_health_12: Slept in separate room
    // i12_health_13: Ate separately
    // i12_health_14: Cleaned surfaces
    // i12_health_15: Worked from home
    // i12_health_16: Wash clothes
    // i12_health_17: Avoided public transport
    // i12_health_18: Avoided guests
    // i12_health_19: Avoided touching objects in public
    // i12_health_20: Avoided touching face
    i12_health_1?: string;
    i12_health_2?: string;
    i12_health_3?: string;
    i12_health_4?: string;
    i12_health_5?: string;
    i12_health_6?: string;
    i12_health_7?: string;
    i12_health_8?: string;
    i12_health_9?: string;
    i12_health_10?: string;
    i12_health_11?: string;
    i12_health_12?: string;
    i12_health_13?: string;
    i12_health_14?: string;
    i12_health_15?: string;
    i12_health_16?: string;
    i12_health_17?: string;
    i12_health_18?: string;
    i12_health_19?: string;
    i12_health_20?: string;
    // Mental Health (PHQ-4)
    PHQ4_1?: string; // Interest
    PHQ4_2?: string; // Depressed
    PHQ4_3?: string; // Anxious
    PHQ4_4?: string; // Worry
    // Life Satisfaction
    cantril_ladder?: string; // 0-10
}

export interface AggregatedWeek {
    weekStart: string; // ISO date string
    weekEnd: string;
    totalRespondents: number;
    avgLifeSatisfaction: number;
    avgDepressionScore: number; // 0-12
    avgAnxietyScore: number; // 0-6 (PHQ-4 first 2 items)
    maskwearingPct: number; // % Always/Frequently
    handwashingPct: number;
    avoidingCrowdsPct: number;
}

export interface DashboardData {
    weeklyData: AggregatedWeek[];
    totalRecords: number;
    ageDistribution: Record<string, number>;
    genderDistribution: Record<string, number>;
}

const CSV_URL = 'https://raw.githubusercontent.com/YouGov-Data/covid-19-tracker/master/data/vietnam.csv';

// Helpers
const parseScore = (val?: string) => {
    if (!val) return 0;
    // 'Not at all' -> 0, 'Several days' -> 1, 'More than half the days' -> 2, 'Nearly every day' -> 3
    if (val.includes('Not at all')) return 0;
    if (val.includes('Several days')) return 1;
    if (val.includes('More than half')) return 2;
    if (val.includes('Nearly every day')) return 3;
    return 0;
};

const isCompliant = (val?: string) => {
    return val === 'Always' || val === 'Frequently';
};

export async function fetchCovidData(): Promise<DashboardData> {
    console.log('Fetching COVID data from YouGov...');
    const res = await fetch(CSV_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch data');
    const csvText = await res.text();

    const { data } = Papa.parse<CovidRecord>(csvText, {
        header: true,
        skipEmptyLines: true,
    });

    console.log('Parsed records:', data.length);

    // Group by Week
    const weeklyGroups: Record<string, CovidRecord[]> = {};
    const ageDist: Record<string, number> = {};
    const genderDist: Record<string, number> = {};

    data.forEach((record) => {
        if (!record.endtime) return;

        // Parse Date "09/04/2020 13:33"
        // Note: CSV format might be dd/MM/yyyy HH:mm
        let date: Date;
        try {
            date = parse(record.endtime, 'dd/MM/yyyy HH:mm', new Date());
            if (isNaN(date.getTime())) {
                // Fallback or skip
                return;
            }
        } catch (e) {
            return;
        }

        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekKey = format(weekStart, 'yyyy-MM-dd');

        if (!weeklyGroups[weekKey]) weeklyGroups[weekKey] = [];
        weeklyGroups[weekKey].push(record);

        // Demographics
        if (record.age) {
            // Group age: 18-24, 25-34, 35-44, 45-54, 55+
            const age = parseInt(record.age);
            let group = 'Unknown';
            if (!isNaN(age)) {
                if (age < 25) group = '18-24';
                else if (age < 35) group = '25-34';
                else if (age < 45) group = '35-44';
                else if (age < 55) group = '45-54';
                else group = '55+';
            }
            ageDist[group] = (ageDist[group] || 0) + 1;
        }

        if (record.gender) {
            genderDist[record.gender] = (genderDist[record.gender] || 0) + 1;
        }
    });

    // Calculate Aggregates
    const weeklyData: AggregatedWeek[] = Object.keys(weeklyGroups).sort().map(weekKey => {
        const records = weeklyGroups[weekKey];
        const count = records.length;

        // Avg Life Satisfaction
        const sumLife = records.reduce((acc, r) => acc + (parseFloat(r.cantril_ladder || '0') || 0), 0);

        // Avg PHQ4
        const sumDepression = records.reduce((acc, r) => {
            return acc + parseScore(r.PHQ4_1) + parseScore(r.PHQ4_2) + parseScore(r.PHQ4_3) + parseScore(r.PHQ4_4);
        }, 0);

        // Behaviors
        const maskCount = records.filter(r => isCompliant(r.i12_health_1)).length;
        const handCount = records.filter(r => isCompliant(r.i12_health_2)).length;
        const crowdCount = records.filter(r => isCompliant(r.i12_health_10)).length; // Avoided crowded areas

        return {
            weekStart: weekKey,
            weekEnd: weekKey, // simplifies for now
            totalRespondents: count,
            avgLifeSatisfaction: count ? (sumLife / count) : 0,
            avgDepressionScore: count ? (sumDepression / count) : 0,
            avgAnxietyScore: 0, // Placeholder
            maskwearingPct: count ? (maskCount / count) * 100 : 0,
            handwashingPct: count ? (handCount / count) * 100 : 0,
            avoidingCrowdsPct: count ? (crowdCount / count) * 100 : 0,
        };
    });

    return {
        weeklyData,
        totalRecords: data.length,
        ageDistribution: ageDist,
        genderDistribution: genderDist
    };
}
