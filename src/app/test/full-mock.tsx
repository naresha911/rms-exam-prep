import { Redirect, type Href } from "expo-router";

/** Legacy Full Mock Test start route now opens the mock catalogue. */
export default function FullMockTestRedirect() {
    return <Redirect href={"/test" as Href} />;
}
