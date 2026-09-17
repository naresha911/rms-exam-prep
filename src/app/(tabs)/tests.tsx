import { Redirect, type Href } from "expo-router";

export default function TestsTab() {
    return <Redirect href={"/test" as Href} />;
}
