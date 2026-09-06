import { Redirect } from "expo-router";

/** `/profile` without a subpath used to collide with the tab route; send users to the tab hub. */
export default function ProfileIndex() {
    return <Redirect href="/(tabs)/me" />;
}
