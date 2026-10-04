import { StyleSheet } from 'react-native';

/** Appearance-independent layout. Prefer these over one-off flex/row objects. */
export const layout = StyleSheet.create({
    fill: { flex: 1 },
    row: { flexDirection: 'row', alignItems: 'center' },
    rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    center: { alignItems: 'center', justifyContent: 'center' },
    pressed: { opacity: 0.85 },
    disabled: { opacity: 0.5 },
});
