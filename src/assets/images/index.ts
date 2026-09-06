// Mascot Images — Cadet Vijay expressions for onboarding and UI feedback.
// Local image assets for reliable offline-first rendering.

import { ImageSourcePropType } from "react-native";

export type MascotExpression =
    | "waving"
    | "happy"
    | "studying"
    | "thinking"
    | "encouraging"
    | "victory"
    | "celebrating"
    | "surprised"
    | "sad";

export interface MascotImageMeta {
    url: ImageSourcePropType;
    alt: string;
}

export const MASCOT_IMAGES: Record<MascotExpression, MascotImageMeta> = {
    waving: {
        url: require("./a_cute_kid_mascot_named_cadet_vijay_in_an_indian_army_olive_green_uniform_with_1/screen.png"),
        alt: "Cadet Vijay waving hello",
    },
    happy: {
        url: require("./a_cute_friendly_indian_kid_mascot_named_cadet_vijay_wearing_a_neat_indian_army/screen.png"),
        alt: "Cadet Vijay smiling",
    },
    studying: {
        url: require("./a_cute_kid_mascot_named_cadet_vijay_in_an_indian_army_olive_green_uniform_with_2/screen.png"),
        alt: "Cadet Vijay studying",
    },
    thinking: {
        url: require("./a_cute_kid_mascot_named_cadet_vijay_in_an_indian_army_olive_green_uniform_with_3/screen.png"),
        alt: "Cadet Vijay thinking",
    },
    encouraging: {
        url: require("./a_cute_kid_mascot_named_cadet_vijay_in_an_indian_army_olive_green_uniform_with_4/screen.png"),
        alt: "Cadet Vijay encouraging",
    },
    victory: {
        url: require("./a_cute_kid_mascot_named_cadet_vijay_in_an_indian_army_olive_green_uniform_with_5/screen.png"),
        alt: "Cadet Vijay celebrating victory",
    },
    celebrating: {
        url: require("./a_cute_kid_mascot_named_cadet_vijay_in_an_indian_army_olive_green_uniform_with_6/screen.png"),
        alt: "Cadet Vijay celebrating",
    },
    surprised: {
        url: require("./a_cute_kid_mascot_named_cadet_vijay_in_an_indian_army_olive_green_uniform_with_7/screen.png"),
        alt: "Cadet Vijay surprised",
    },
    sad: {
        url: require("./a_cute_kid_mascot_named_cadet_vijay_in_an_indian_army_olive_green_uniform_with_8/screen.png"),
        alt: "Cadet Vijay sad",
    },
};