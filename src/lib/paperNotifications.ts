// Local incomplete-paper reminders (no server push required).
// Do not statically import expo-notifications: on Android Expo Go (SDK 53+),
// importing the package evaluates push-token auto-registration and throws.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";

const REMINDER_MAP_KEY = "papers:reminderIds:v1";

type NotificationsModule = typeof import("expo-notifications");

/** Android Expo Go removed remote push and throws on package init; skip there. */
const canUseNotifications =
    Platform.OS !== "web" && !(Platform.OS === "android" && isRunningInExpoGo());

let notificationsPromise: Promise<NotificationsModule | null> | null = null;
let handlerConfigured = false;

async function getNotifications(): Promise<NotificationsModule | null> {
    if (!canUseNotifications) return null;
    if (!notificationsPromise) {
        notificationsPromise = import("expo-notifications")
            .then((Notifications) => {
                if (!handlerConfigured) {
                    handlerConfigured = true;
                    Notifications.setNotificationHandler({
                        handleNotification: async () => ({
                            shouldShowAlert: true,
                            shouldPlaySound: false,
                            shouldSetBadge: false,
                            shouldShowBanner: true,
                            shouldShowList: true,
                        }),
                    });
                }
                return Notifications;
            })
            .catch((e) => {
                console.warn("expo-notifications unavailable:", e);
                return null;
            });
    }
    return notificationsPromise;
}

async function ensurePermissions(Notifications: NotificationsModule): Promise<boolean> {
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
        const Notifications = await getNotifications();
        if (!Notifications) return;

        const ok = await ensurePermissions(Notifications);
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
        const Notifications = await getNotifications();
        if (!Notifications) return;

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
