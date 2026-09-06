// MaterialIcon — Material Symbols (Outlined) SVG icon component
// Cadet Quest Stitch design system uses Material Symbols across the app.
// We ship the most common glyphs as inline SVG paths (24x24 viewBox) so the
// app doesn't depend on a font or extra package. Each glyph path is the
// canonical Google Material Symbols "Outlined" path data.
//
// Usage:
//   <MaterialIcon name="home" size={24} color={COLORS.primary} />
//   <MaterialIcon name="check" size={16} color="#fff" weight={600} />

import React from "react";
import { View, ViewStyle, TextStyle, Text } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { COLORS } from "../../constants";

export type MaterialIconName =
    // Navigation
    | "home"
    | "menu_book"
    | "assignment"
    | "assignment_turned_in"
    | "smart_toy"
    | "person"
    | "school"
    | "history"
    | "leaderboard"
    | "dashboard"
    // Status / actions
    | "notifications"
    | "check"
    | "check_circle"
    | "cancel"
    | "help"
    | "close"
    | "arrow_back"
    | "arrow_forward"
    | "chevron_right"
    | "chevron_left"
    | "expand_more"
    | "expand_less"
    | "play_arrow"
    | "pause"
    | "flag"
    | "report"
    | "grid_view"
    | "settings"
    | "edit"
    | "delete"
    | "add"
    | "remove"
    | "more_vert"
    | "more_horiz"
    | "logout"
    | "login"
    | "refresh"
    | "sync"
    | "search"
    | "filter_list"
    | "bookmark"
    | "bookmark_border"
    | "share"
    | "download"
    | "upload"
    | "lock"
    | "lock_open"
    | "visibility"
    | "visibility_off"
    | "star"
    | "star_border"
    | "favorite"
    | "favorite_border"
    | "thumb_up"
    | "local_fire_department"
    | "bolt"
    | "emoji_events"
    | "military_tech"
    | "workspace_premium"
    | "shield"
    | "stars"
    // Subjects
    | "calculate"
    | "psychology"
    | "public"
    | "translate"
    | "science"
    | "functions"
    | "biotech"
    | "language"
    | "menu_book_outlined"
    | "book"
    | "library_books"
    | "auto_stories"
    | "calendar_month"
    | "calendar_today"
    // Charts / analytics
    | "trending_up"
    | "trending_down"
    | "trending_flat"
    | "assessment"
    | "analytics"
    | "insights"
    | "donut_large"
    | "bar_chart"
    | "pie_chart"
    | "show_chart"
    | "schedule"
    | "timer"
    | "event"
    | "access_time"
    | "auto_awesome"
    | "lightbulb"
    | "psychology_alt"
    | "tips_and_updates"
    | "task_alt"
    | "done"
    | "done_all"
    | "pending_actions"
    | "task"
    // Misc
    | "email"
    | "lock_outline"
    | "person_outline"
    | "visibility_outline"
    | "favorite_outline"
    | "info"
    | "warning"
    | "error"
    | "chat"
    | "chat_bubble"
    | "chat_bubble_outline"
    | "send"
    | "mic"
    | "attach_file"
    | "image"
    | "camera"
    | "celebration"
    | "card_giftcard"
    | "redeem"
    | "workspace_premium_filled"
    | "login_outlined"
    | "verified"
    | "rocket_launch"
    | "school_outlined"
    | "menu_book_filled"
    | "quiz"
    | "fact_check"
    | "play_circle"
    | "forward_10"
    | "replay"
    | "campaign"
    | "support_agent"
    | "groups"
    | "family_restroom"
    | "bar_chart_4_bars"
    | "workspace_premium_outlined"
    | "bolt_outlined"
    | "trending_up_outlined"
    | "history_edu"
    | "schedule_outlined"
    | "badge"
    | "account_balance";

interface MaterialIconProps {
    name: MaterialIconName;
    size?: number;
    color?: string;
    weight?: 400 | 500 | 600 | 700;
    filled?: boolean;
    style?: ViewStyle;
}

// Each entry is a 24x24 viewBox path. Outlined Material Symbols.
const ICON_PATHS: Record<MaterialIconName, string> = {
    home: "M12 3 2 12h3v8h5v-6h4v6h5v-8h3L12 3Z",
    menu_book: "M21 4H7a3 3 0 0 0-3 3v13a1 1 0 0 0 1.45.9L9 18l3.55 2.9a1 1 0 0 0 1.1 0L17 18l3.55 2.9A1 1 0 0 0 22 20V5a1 1 0 0 0-1-1Zm-1 14.18-2.55-2.08a1 1 0 0 0-1.1 0L12 18.18l-3.35-1.72a1 1 0 0 0-1.1 0L6 18.18V7a1 1 0 0 1 1-1h13Z",
    assignment: "M19 3h-4.18A3 3 0 0 0 12 1a3 3 0 0 0-2.82 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-7-1a1 1 0 1 1-1 1 1 1 0 0 1 1-1Zm5 17H7v-2h10Zm0-4H7v-2h10Zm0-4H7V9h10Z",
    assignment_turned_in: "M19 3h-4.18A3 3 0 0 0 12 1a3 3 0 0 0-2.82 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-7-1a1 1 0 1 1-1 1 1 1 0 0 1 1-1Zm-2.29 13.29-3.54-3.54 1.41-1.41 2.12 2.12 4.95-4.95 1.41 1.41Z",
    smart_toy: "M20 9V7a2 2 0 0 0-2-2h-3a3 3 0 0 0-6 0H6a2 2 0 0 0-2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2a3 3 0 0 0 0-6ZM9 13a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 9 13Zm6 0a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 15 13Z",
    person: "M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z",
    school: "M12 3 1 9l11 6 9-4.91V17h2V9L12 3Zm0 8.18L5.18 8 12 4.82 18.82 8 12 11.18ZM6 13.05v3.86L12 21l6-4.09v-3.86l-6 3.27Z",
    history: "M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 1 1 2.05 4.95l-1.42 1.42A9 9 0 1 0 13 3Zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8Z",
    leaderboard: "M7 21h10v-2H7Zm5-4 8-7V3H4v7l8 7Zm-3-9V5h6v3.35l-3 2.62Z",
    dashboard: "M3 13h8V3H3Zm0 8h8v-6H3Zm10 0h8V11h-8Zm0-18v6h8V3Z",
    notifications: "M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11a6 6 0 0 0-5-5.91V4a1 1 0 0 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1Z",
    check: "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z",
    check_circle: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1 14.59L6.41 12 7.83 10.59 11 13.76l5.17-5.17L17.59 10Z",
    cancel: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12Z",
    help: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 17h-2v-2h2Zm2.07-7.75-.9.92A3.4 3.4 0 0 0 13 14.5h-2v-.5a4.4 4.4 0 0 1 1.17-2.83l1.24-1.26A1.94 1.94 0 0 0 14 8.5a2 2 0 0 0-4 0H8a4 4 0 0 1 8 0 3.2 3.2 0 0 1-.93 2.25Z",
    close: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12Z",
    arrow_back: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20Z",
    arrow_forward: "m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8Z",
    chevron_right: "M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6Z",
    chevron_left: "M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12Z",
    expand_more: "M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6Z",
    expand_less: "m6 15 6-6 6 6-1.41 1.41L12 11.83l-4.59 4.58Z",
    play_arrow: "M8 5v14l11-7Z",
    pause: "M6 5h4v14H6Zm8 0h4v14h-4Z",
    flag: "M14.4 6 14 4H5v17h2v-7h5.6l.4 2h7V6Z",
    report: "M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27ZM12 17.3a1.7 1.7 0 1 1 1.7-1.7 1.7 1.7 0 0 1-1.7 1.7Zm1.7-5.7a1.7 1.7 0 0 1-3.4 0V7.7a1.7 1.7 0 0 1 3.4 0Z",
    grid_view: "M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z",
    settings: "M19.14 12.94a7.49 7.49 0 0 0 .05-.94 7.49 7.49 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7.03 7.03 0 0 0-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.49 7.49 0 0 0-.05.94 7.49 7.49 0 0 0 .05.94L2.83 14.52a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .61.22l2.39-.96a7.03 7.03 0 0 0 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54a7.03 7.03 0 0 0 1.62-.94l2.39.96a.5.5 0 0 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64ZM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5Z",
    edit: "M3 17.25V21h3.75L17.81 9.93l-3.75-3.75ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75Z",
    delete: "M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14Z",
    add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6Z",
    remove: "M19 13H5v-2h14Z",
    more_vert: "M12 8a2 2 0 1 0-2-2 2 2 0 0 0 2 2Zm0 2a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm0 6a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z",
    more_horiz: "M6 10a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm12 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm-6 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z",
    logout: "m17 8-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4ZM5 5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7v-2H5Z",
    login: "M11 7 9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5ZM22 5h-9v2h9Zm0 14h-9v2h9Z",
    refresh: "M17.65 6.35A8 8 0 1 0 19.73 14H17.6a6 6 0 1 1-1.46-6.24L13 11h7V4Z",
    sync: "M12 4V1L8 5l4 4V6a6 6 0 0 1 6 6 6 6 0 0 1-6 6 6 6 0 0 1-6-6H4a8 8 0 1 0 8-8Z",
    search: "M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19Zm-6 0A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14Z",
    filter_list: "M10 18h4v-2h-4Zm0-4h10v-2H10Zm0-4h10V8H10Zm-4 0V4H4v6Zm0 8h4v-6H4Z",
    bookmark: "M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2Z",
    bookmark_border: "M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2Zm0 17-5-2.18L7 20V5h10Z",
    share: "M18 16.08a2.93 2.93 0 0 0-1.97.77L8.91 12.7a3.27 3.27 0 0 0 0-1.4l7.05-4.11A3 3 0 1 0 15 5.19l-7.13 4.16a3 3 0 1 0 0 5.3L15 18.81a3 3 0 1 0 3-2.73Z",
    download: "M5 20h14v-2H5Zm7-18-5.5 5.5L9 9.5 11 11V4h2v7l2-1.5L17.5 7.5Z",
    upload: "M5 20h14v-2H5Zm7-18L6.5 7.5 9 10l2-1.5V16h2V8.5L15 10l2.5-2.5Z",
    lock: "M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Zm-6 9a2 2 0 1 1 2-2 2 2 0 0 1-2 2Zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0Z",
    lock_open: "M12 17a2 2 0 1 0-2-2 2 2 0 0 0 2 2Zm6-9a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Zm-2 0v10H6V8h7V6a3 3 0 0 1 6 0Z",
    visibility: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5ZM12 17a5 5 0 1 1 5-5 5 5 0 0 1-5 5Zm0-8a3 3 0 1 0 3 3 3 3 0 0 0-3-3Z",
    visibility_off: "M12 7a5 5 0 0 1 5 5 5 5 0 0 1-.11 1.05l2.92 2.92C21.27 14.61 23 12 24 12c-1.73-4.39-6-7.5-11-7.5a11.6 11.6 0 0 0-3.27.46L14.4 9.6A5 5 0 0 1 12 7ZM2 4.27l2.28 2.28.46.46A11.5 11.5 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5a11.6 11.6 0 0 0 4.06-.72l.93.93L21 23l1.27-1.27ZM7.53 9.8l1.55 1.55a3 3 0 0 0 4.05 4.05l1.55 1.55A5 5 0 0 1 7.53 9.8Z",
    star: "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21Z",
    star_border: "M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03ZM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28Z",
    favorite: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3a6.5 6.5 0 0 1 4.5 1.81A6.5 6.5 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54Z",
    favorite_border: "M16.5 3a6.5 6.5 0 0 0-4.5 1.81A6.5 6.5 0 0 0 7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3Zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5A3.5 3.5 0 0 1 7.5 5a4 4 0 0 1 3 1.35L12 7.79l1.5-1.44A4 4 0 0 1 16.5 5 3.5 3.5 0 0 1 20 8.5c0 2.89-3.14 5.74-7.9 10.05Z",
    thumb_up: "M9 21h9a2 2 0 0 0 2-1.85l1.1-9A2 2 0 0 0 19.1 8H14V5a3 3 0 0 0-3-3l-4 9v10ZM3 21h4V10H3Z",
    local_fire_department: "M12 23a8 8 0 0 1-8-8c0-3.59 2.6-6.32 4.32-8.07l.6-.6.7.5A11 11 0 0 1 12 9.5a11 11 0 0 1 2.38-2.67l.7-.5.6.6C17.4 8.68 20 11.41 20 15a8 8 0 0 1-8 8Zm-3-9.5a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5Zm5-1.5a1.5 1.5 0 1 0 1.5 1.5 1.5 1.5 0 0 0-1.5-1.5Z",
    bolt: "M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21Z",
    emoji_events: "M19 5h-2V3H7v2H5a2 2 0 0 0-2 2v2a4 4 0 0 0 4 4v1a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4v-1a4 4 0 0 0 4-4V7a2 2 0 0 0-2-2Zm-5 14h-2a2 2 0 0 1-2-2v-1h6v1a2 2 0 0 1-2 2Zm5-7v1a2 2 0 0 1-2 2h-2v-2h2V8h2ZM7 9H5V7h2Z",
    military_tech: "M17 11V7l-5-3-5 3v4l-3 2v2l3-1v3l5 3 5-3v-3l3 1v-2ZM12 7.5 14 8.7V11h-4V8.7Z",
    workspace_premium: "M9.68 13.31 7.95 19l4.05-2.41L16.05 19l-1.73-5.69L18 9.94l-5.76-.49L10 4l-2.24 5.45L2 9.94Z",
    shield: "M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5Z",
    stars: "M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5Z",
    calculate: "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM7 7h4v2H7Zm0 4h4v2H7Zm0 4h4v2H7Zm10 4h-2v-2h-2v-2h2v-2h2v2h2v2h-2Zm-2-6V9h2v4Z",
    psychology: "M13 8.5a1 1 0 0 0-1-1H9.5A1.5 1.5 0 0 0 8 9v6a1.5 1.5 0 0 0 1.5 1.5H12v3l3-3h-1a1 1 0 0 0 0-2h-1V13a3 3 0 0 0 3-3V8.5ZM19 7a9 9 0 0 0-9-9c-3.86 0-7.16 2.46-8.43 5.91A10 10 0 0 0 0 13a10 10 0 0 0 5 8.66V23a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1.34A10 10 0 0 0 24 13c0-1.95-.55-3.78-1.51-5.34A8.97 8.97 0 0 0 19 7Z",
    public: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1 17.93A8 8 0 0 1 5.07 14H8c.5 2.42 1.39 4.45 3 5.93Zm-3-9.93H5.07A8 8 0 0 1 11 4.07c-1.61 1.48-2.5 3.51-3 5.93Zm6 9.93c1.61-1.48 2.5-3.51 3-5.93h2.93A8 8 0 0 1 14 19.93Zm3-9.93c-.5-2.42-1.39-4.45-3-5.93A8 8 0 0 1 19.93 10Z",
    translate: "M12.87 15.07 10.33 12.56l.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11ZM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2Zm-2.62 7 1.62-4.33L19.12 17Z",
    science: "M19.8 18.4 14 10.67V6.5l1.35-1.69c.26-.33.03-.81-.39-.81H9.04c-.42 0-.65.48-.39.81L10 6.5v4.17L4.2 18.4c-.49.66-.02 1.6.8 1.6h14c.82 0 1.29-.94.8-1.6Z",
    functions: "M18 4H6v2l6 7-6 7v2h12v-2l-6-7 6-7Z",
    biotech: "M7 19a3 3 0 0 0 3 3 3 3 0 0 0 3-3v-1H7Zm11-9.5A2.5 2.5 0 0 0 15.5 12 2.5 2.5 0 0 0 18 14.5 2.5 2.5 0 0 0 20.5 12 2.5 2.5 0 0 0 18 9.5ZM7 5a3 3 0 0 0-3 3 3 3 0 0 0 3 3h1V5Zm11 .5A2.5 2.5 0 0 0 15.5 3 2.5 2.5 0 0 0 13 5.5 2.5 2.5 0 0 0 15.5 8 2.5 2.5 0 0 0 18 5.5ZM5 12a3 3 0 0 0-3 3 3 3 0 0 0 3 3h1v-6Z",
    language: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2Zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8ZM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96ZM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2Zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.08 16Zm2.95-8H5.08a7.99 7.99 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8ZM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96ZM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2Zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56ZM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2Z",
    menu_book_outlined: "M21 4H7a3 3 0 0 0-3 3v13a1 1 0 0 0 1.45.9L9 18l3.55 2.9a1 1 0 0 0 1.1 0L17 18l3.55 2.9A1 1 0 0 0 22 20V5a1 1 0 0 0-1-1Z",
    book: "M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm0 18H6V4h1v8l2.5-1.5L12 12V4h6Z",
    library_books: "M4 6h16v2H4Zm0 5h16v2H4Zm0 5h16v2H4ZM3 4v17h18V3Zm16 15H5V5h14Z",
    auto_stories: "M21 4H7a3 3 0 0 0-3 3v13a1 1 0 0 0 1.45.9L9 18l3.55 2.9a1 1 0 0 0 1.1 0L17 18l3.55 2.9A1 1 0 0 0 22 20V5a1 1 0 0 0-1-1Z",
    calendar_month: "M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V10h14Zm-6-7h-2v2h-2v-2H7v-2h2V9h2v2h2Zm6 0h-2v-2h2Zm-2-4h-2V7h2Z",
    calendar_today: "M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 18H5V8h14Z",
    trending_up: "M3.5 17.5 9 12l4 4 7-7-1.41-1.41L13 13.17l-4-4-7 7Z",
    trending_down: "M3.5 6.5 9 12l4 4 7-7-1.41-1.41L13 9.17l-4-4-7 7Z",
    trending_flat: "M22 12 14 4v3H2v2h12v3Z",
    assessment: "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM9 17H7v-7h2Zm4 0h-2V7h2Zm4 0h-2v-4h2Z",
    analytics: "M3 3h2v18H3Zm4 10h2v8H7Zm4-6h2v14h-2Zm4 4h2v10h-2Zm4-7h2v17h-2Z",
    insights: "M21 8c0-3.86-3.14-7-7-7S7 4.14 7 8c0 2.38 1.19 4.47 3 5.74V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7.26A6.96 6.96 0 0 0 21 8Zm-7 12h-2v-3h2Zm0-5h-2v-2h2Zm-2-4V9.5A4.5 4.5 0 0 1 9 5h2a2.5 2.5 0 0 0 2 2.45V11Z",
    donut_large: "M11 5.08V2.05A10 10 0 0 0 4.05 11H7.1A6 6 0 0 1 11 7.08ZM2.05 13a10 10 0 0 0 8.95 8.95v-3.03A6 6 0 0 1 4.07 13Zm19.95-2H19a6 6 0 0 1-3.95 5.66v3.05A10 10 0 0 0 22 13ZM13 4.07V7.1A6 6 0 0 1 16.92 11H19.95A10 10 0 0 0 13 4.07Z",
    bar_chart: "M5 9.2h3V21H5Zm6-4.2h3v16h-3Zm6-4h3v20h-3Z",
    pie_chart: "M11 2.05V13H21.95A10 10 0 0 0 11 2.05Zm2 19.9V11h10.95A10 10 0 0 1 13 21.95ZM4 13a9 9 0 0 1 5-8.06v16.12A9 9 0 0 1 4 13Z",
    show_chart: "M3.5 18.5 9 13l4 4 7-7-1.41-1.41L13 14.17l-4-4-7 7Z",
    schedule: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2ZM12 20a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67Z",
    timer: "M15 1H9v2h6Zm-4 13h2V8h-2Zm8.03-6.61 1.42-1.42a10 10 0 1 1-1.41 1.41ZM12 6a8 8 0 1 0 8 8 8 8 0 0 0-8-8Z",
    event: "M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 16H5V9h14Zm-2-7H7v-2h10Z",
    access_time: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2ZM12 20a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67Z",
    auto_awesome: "M19 9 14 4 9 9 4 4v15h15Z",
    lightbulb: "M9 21h6v-1H9Zm3-19a7 7 0 0 0-4 12.74V18h8v-3.26A7 7 0 0 0 12 2Z",
    psychology_alt: "M19.94 9.06A8 8 0 0 0 12 4a8 8 0 0 0-7.94 7H2v2h2.06A8 8 0 0 0 12 20a8 8 0 0 0 7.94-7H22v-2ZM12 18a6 6 0 1 1 6-6 6 6 0 0 1-6 6Zm-1-9h2v2h-2Zm0 3h2v5h-2Z",
    tips_and_updates: "M7 20h10v1H7Zm5-19a7 7 0 0 0-4 12.74V17h8v-3.26A7 7 0 0 0 12 1Zm5 14H7v-2h10Z",
    task_alt: "M22 5.18 20.59 3.77 10 14.36l-4.59-4.59L4 15.18l6 6Z",
    done: "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z",
    done_all: "m9 16.17-4.17-4.17L3.41 13.41 9 19l12-12-1.41-1.41Zm0-4L4.83 8 3.41 9.41 9 15l7-7-1.41-1.41Z",
    pending_actions: "M17 12.5a1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5 1.5 1.5 0 0 1-1.5-1.5Zm-5 0a1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5 1.5 1.5 0 0 1-1.5-1.5ZM7 12.5A1.5 1.5 0 0 1 8.5 11a1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5A1.5 1.5 0 0 1 7 12.5ZM21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z",
    task: "M9 11.75A1.25 1.25 0 1 0 9 14.25a1.25 1.25 0 0 0 0-2.5Zm6 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2Z",
    email: "M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5Z",
    lock_outline: "M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Zm-2 0H8V6a3 3 0 0 1 6 0Z",
    person_outline: "M12 5.9a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2Zm0 9c-2.97 0-6.1 1.46-6.1 2.1v.6h12.2V17c0-.64-3.13-2.1-6.1-2.1ZM12 4a4 4 0 1 1-4 4 4 4 0 0 1 4-4Zm0 9c2.67 0 8 1.34 8 4v3H4v-3c0-2.66 5.33-4 8-4Z",
    visibility_outline: "M12 6a9 9 0 0 0-9 6 9 9 0 0 0 9 6 9 9 0 0 0 9-6 9 9 0 0 0-9-6Zm0-4a13 13 0 0 1 13 10A13 13 0 0 1 12 22 13 13 0 0 1-1 12 13 13 0 0 1 12 2Zm0 6a4 4 0 1 0 4 4 4 4 0 0 0-4-4Z",
    favorite_outline: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3a6.5 6.5 0 0 1 4.5 1.81A6.5 6.5 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54Z",
    info: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-6h2Zm0-8h-2V7h2Z",
    warning: "M1 21h22L12 2Zm12-3h-2v-2h2Zm0-4h-2v-4h2Z",
    error: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12Z",
    chat: "M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z",
    chat_bubble: "M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z",
    chat_bubble_outline: "M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm0 14H5.17L4 17.17V4h16Z",
    send: "m2 21 21-9L2 3v7l15 2-15 2Z",
    mic: "M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11Z",
    attach_file: "M16.5 6v11.5a4 4 0 1 1-4-4v3a1 1 0 1 0 1 1V6a6 6 0 1 0-6 6v3a4 4 0 1 0 4-4V6a2 2 0 1 1 2 2v9.5a1.5 1.5 0 1 1-3 0V6Z",
    image: "M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM8.5 13.5l2.5 3 3.5-4.5L19 18H5Z",
    camera: "M9.4 5 7.6 7H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.6L14.6 5ZM12 18a5 5 0 1 1 5-5 5 5 0 0 1-5 5Z",
    celebration: "M2 22 16 8l3 3-14 14Zm14.83-12.83 2.83 2.83 2.83-2.83-2.83-2.83ZM16.83 9.17 19.66 6.34l-2.83-2.83-2.83 2.83Z",
    card_giftcard: "M20 6h-2.18a3 3 0 0 0 .18-1 3 3 0 0 0-5.4-1.65L12 4l-.6-.65A3 3 0 0 0 6 5a3 3 0 0 0 .18 1H4a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h8v-2H4v-3h2v1h12v-1h2v3h-7v2h7a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2ZM12 5a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1Z",
    redeem: "M20 6h-2.18a3 3 0 0 0 .18-1 3 3 0 0 0-5.4-1.65L12 4l-.6-.65A3 3 0 0 0 6 5a3 3 0 0 0 .18 1H4a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h7v-2H4v-3h2v1h12v-1h2v3h-7v2h7a1 1 0 0 0 1-1V8a2 2 0 0 0-2-2Z",
    workspace_premium_filled: "M9.68 13.31 7.95 19l4.05-2.41L16.05 19l-1.73-5.69L18 9.94l-5.76-.49L10 4l-2.24 5.45L2 9.94Z",
    login_outlined: "M11 7 9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5Z",
    verified: "M23 12 19.95 8.95 20 5l-3.95-.05L12 1 7.95 4.95 4 5l.05 3.95L1 12l3.05 3.05L4 19l3.95.05L12 23l4.05-3.95L20 19l-.05-3.95ZM10 17l-4-4 1.41-1.41L10 14.17l6.59-6.58L18 9Z",
    rocket_launch: "M9.19 6.49a10 10 0 0 1 8.32 8.32l-2.79-.7A7 7 0 0 0 9.89 9.28ZM11 17a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm10-6a8 8 0 0 0-15.45 3.18l-3.39 4.07L4 17l3.75.16L9.13 19l1.36-3.41A8 8 0 0 0 21 11Zm-3 4-1.59-1.59L13 15.5l-1.41-1.41 3.59-3.59L17 12.5l-1.59 1.59 1.59 1.59Z",
    school_outlined: "M12 3 1 9l11 6 9-4.91V17h2V9Z",
    menu_book_filled: "M21 4H7a3 3 0 0 0-3 3v13a1 1 0 0 0 1.45.9L9 18l3.55 2.9a1 1 0 0 0 1.1 0L17 18l3.55 2.9A1 1 0 0 0 22 20V5a1 1 0 0 0-1-1Z",
    quiz: "M4 6h16v2H4Zm0 5h16v2H4Zm0 5h16v2H4Zm-1-13v18h18V3Zm16 16H5V5h14Z",
    fact_check: "M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8Z",
    play_circle: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-2 14.5v-9l6 4.5Z",
    forward_10: "M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6v4l5-5-5-5v4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8Zm-9 0v-2l-3 3 3 3v-2h2v-2Z",
    replay: "M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8Z",
    campaign: "M18 11v3l3 1V8l-3 1.5v1.5Zm-3-7.5v3.05L5 13v2c0 .55.45 1 1 1h3l4 3v-9l-4-3H6c-.55 0-1 .45-1 1v1.5L15 3.5Z",
    support_agent: "M21 12c0 4.97-4.03 9-9 9-1.5 0-2.91-.37-4.16-1.03L3 21l1.03-4.84A8.96 8.96 0 0 1 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9Z",
    groups: "M12 12.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm-7.5 6.75a7.5 7.5 0 0 1 15 0v.75H4.5Z",
    family_restroom: "M16 4a3 3 0 1 1-3 3 3 3 0 0 1 3-3Zm-8 7a3 3 0 1 1 3-3 3 3 0 0 1-3 3Zm8 1a4.49 4.49 0 0 0-4.5 4.5v.5h9v-.5A4.49 4.49 0 0 0 16 12Zm-8 1a3.51 3.51 0 0 0-3.5 3.5V18h7v-1.5A3.51 3.51 0 0 0 8 13Z",
    bar_chart_4_bars: "M5 9.2h3V21H5Zm6-4.2h3v16h-3Zm6-4h3v20h-3Zm-12 0h3v20H5Z",
    workspace_premium_outlined: "M9.68 13.31 7.95 19l4.05-2.41L16.05 19l-1.73-5.69L18 9.94l-5.76-.49L10 4l-2.24 5.45L2 9.94Z",
    bolt_outlined: "M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21Z",
    trending_up_outlined: "M3.5 17.5 9 12l4 4 7-7-1.41-1.41L13 13.17l-4-4-7 7Z",
    history_edu: "M9 4v1.5A2.5 2.5 0 0 1 6.5 8 1.5 1.5 0 0 0 5 9.5V13a3 3 0 0 0 3 3h1v-2H8a1 1 0 0 1-1-1V9.5a4 4 0 0 0 4-4V4h2v1.5a4 4 0 0 0 4 4V13h-3v-2.07c1.25-.36 2.2-1.43 2.2-2.78 0-1.58-1.27-2.86-2.85-2.86-.5 0-.97.13-1.39.36A4.92 4.92 0 0 0 14 7.6 4.92 4.92 0 0 0 12.79 8 1.5 1.5 0 0 0 11 7c-1.58 0-2.85 1.28-2.85 2.86 0 1.35.95 2.42 2.2 2.78V15h-2a1 1 0 0 1-1-1V9.5a3 3 0 0 0 3-3V4h-1.35Z",
    schedule_outlined: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2ZM12 20a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67Z",
    badge: "M20 7h-5V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-9-3h2v3h-2Zm5 14H8v-1.25c0-1.67 3.33-2.5 4-2.5s4 .83 4 2.5Zm-4-4.5A1.75 1.75 0 1 1 13.75 12 1.75 1.75 0 0 1 12 13.5Z",
    account_balance: "M4 10v7h3v-7Zm6.5 0v7h3v-7ZM2 19v2h20v-2ZM16 10v7h3v-7ZM12 1 2 6v2h20V6Z",
};

// These paths are complete filled Material Symbols silhouettes. The even-odd
// rule keeps cutouts consistent on Android.
const FILLED_VARIANTS: MaterialIconName[] = [
    "favorite", "star", "check_circle", "bookmark", "home", "menu_book", "person", "assignment_turned_in",
    "notifications", "school", "smart_toy", "check", "thumb_up", "shield", "verified",
    "military_tech", "workspace_premium", "emoji_events", "rocket_launch", "play_circle",
    "auto_awesome", "lightbulb", "local_fire_department", "stars", "error", "info",
    "warning", "task_alt", "donut_large", "bookmark", "favorite_outline",
    "star_border", "thumb_up", "workspace_premium_filled", "card_giftcard", "redeem",
    "menu_book_filled", "school_outlined", "celebration", "rocket_launch", "insights",
    "tips_and_updates", "psychology_alt", "quiz", "fact_check", "play_circle", "auto_stories",
];

export const MaterialIcon: React.FC<MaterialIconProps> = ({
    name,
    size = 24,
    color = COLORS.onSurface,
    weight = 400,
    filled = false,
    style,
}) => {
    const path = ICON_PATHS[name];
    if (!path) {
        // Fallback: small question circle so the screen still renders cleanly
        return (
            <View
                style={[
                    { width: size, height: size, alignItems: "center", justifyContent: "center" },
                    style,
                ]}
            >
                <Text style={{ color, fontSize: size * 0.7 } as TextStyle}>?</Text>
            </View>
        );
    }

    return (
        <View
            style={[
                { width: size, height: size, alignItems: "center", justifyContent: "center" },
                style,
            ]}
        >
            <Svg width={size} height={size} viewBox="0 0 24 24">
                {filled && FILLED_VARIANTS.includes(name) ? (
                    <Path d={path} fill={color} fillRule="evenodd" />
                ) : (
                    <Path
                        d={path}
                        stroke={color}
                        strokeWidth={weight >= 600 ? 1.6 : 1.2}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}
            </Svg>
        </View>
    );
};

export default MaterialIcon;
