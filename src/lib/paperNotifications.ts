// Local incomplete-paper reminders (no server push required).
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const REMINDER_MAP_KEY = "papers:reminderIds:v1";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

async function ensurePermissions(): Promise<boolean> {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const asked = await Notifications.requestPermissionsAsync();
    return !!asked.granted;
}

async function readMap(): Promise<Record<string, string>> {
    try {
        const raw = await AsyncStorage.getItem(REMINDER_MAP_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

async function writeMap(map: Record<string, string>) {
    await AsyncStorage.setItem(REMINDER_MAP_KEY, JSON.stringify(map));
}

/** Schedule a local reminder ~2 hours after leaving an incomplete paper. */
export async function scheduleIncompletePaperReminder(paperId: string, title: string) {
    try {
        if (Platform.OS === "web") return;
        const ok = await ensurePermissions();
        if (!ok) return;

        await cancelIncompletePaperReminder(paperId);

        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Finish your paper",
                body: `"${title}" is still in progress. Resume when you're ready.`,
                data: { paperId, type: "incomplete_paper" },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 2 * 60 * 60,
                repeats: false,
            },
        });

        const map = await readMap();
        map[paperId] = id;
        await writeMap(map);
    } catch (e) {
        console.warn("Could not schedule paper reminder:", e);
    }
}

export async function cancelIncompletePaperReminder(paperId: string) {
    try {
        const map = await readMap();
        const id = map[paperId];
        if (id) {
            await Notifications.cancelScheduledNotificationAsync(id);
            delete map[paperId];
            await writeMap(map);
        }
    } catch (e) {
        console.warn("Could not cancel paper reminder:", e);
    }
}
