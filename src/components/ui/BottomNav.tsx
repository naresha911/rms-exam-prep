// BottomNav — 5-destination bottom tab bar matching Stitch home_dashboard.
// Active state: filled circular pill with primary-container bg + on-primary-container icon.
// Inactive: text-only with on-surface-variant color.

import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { BORDER_RADIUS, TYPOGRAPHY } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { MaterialIcon, MaterialIconName } from './MaterialIcon';

interface NavItem {
    name: string;
    label: string;
    icon: MaterialIconName;
    activeIcon?: MaterialIconName;
    href: string;
}

const NAV_ITEMS: NavItem[] = [
    { name: 'index', label: 'Home', icon: 'home', href: '/(tabs)' },
    { name: 'practice', label: 'Practice', icon: 'menu_book', href: '/(tabs)/practice' },
    { name: 'tests', label: 'Mock Tests', icon: 'assignment', href: '/(tabs)/tests' },
    { name: 'ai', label: 'AI Tutor', icon: 'smart_toy', href: '/(tabs)/ai' },
    { name: 'profile', label: 'Profile', icon: 'person', href: '/(tabs)/me' },
];

interface BottomNavProps {
    style?: any;
}

function createStyles(colors: ColorPalette) {
    return {
        container: {
            justifyContent: 'space-around' as const,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.outlineVariant,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            paddingTop: 8,
            height: 70,
        },
        tab: {
            flex: 1,
        },
        tabContent: {
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: BORDER_RADIUS.xl,
            minWidth: 52,
            minHeight: 48,
        },
        tabContentActive: {
            backgroundColor: colors.primaryContainer,
        },
        label: {
            fontFamily: TYPOGRAPHY.fontFamily.semibold,
            fontSize: TYPOGRAPHY.fontSize.xs,
            fontWeight: TYPOGRAPHY.fontWeight.semibold,
            marginTop: 2,
        },
        labelActive: {
            color: colors.onPrimaryContainer,
        },
        labelInactive: {
            color: colors.onSurfaceVariant,
        },
    };
}

export const BottomNav: React.FC<BottomNavProps> = ({ style }) => {
    const router = useRouter();
    const pathname = usePathname();
    const colors = useColors();
    const styles = useThemedStyles(createStyles);

    const isActive = (item: NavItem) => {
        if (item.name === 'index') return pathname === '/(tabs)' || pathname === '/(tabs)/';
        return pathname.startsWith(item.href);
    };

    return (
        <View style={[layout.row, styles.container, style]}>
            {NAV_ITEMS.map((item) => {
                const active = isActive(item);
                return (
                    <Pressable
                        key={item.name}
                        onPress={() => router.push(item.href as any)}
                        style={({ pressed }) => [
                            layout.center,
                            styles.tab,
                            pressed ? layout.pressed : null,
                        ]}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: active }}
                    >
                        <View style={[layout.center, styles.tabContent, active ? styles.tabContentActive : null]}>
                            <MaterialIcon
                                name={active ? (item.activeIcon ?? item.icon) : item.icon}
                                size={24}
                                color={active ? colors.onPrimaryContainer : colors.onSurfaceVariant}
                            />
                            <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
                                {item.label}
                            </Text>
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
};

export default BottomNav;
