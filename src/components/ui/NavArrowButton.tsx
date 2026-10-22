import React from 'react';
import { Pressable } from 'react-native';
import { BORDER_RADIUS } from '../../constants';
import { layout, useColors, useThemedStyles, type ColorPalette } from '../../theme';
import { MaterialIcon } from './MaterialIcon';

interface NavArrowButtonProps {
    direction: 'back' | 'forward';
    onPress: () => void;
    disabled?: boolean;
}

function createStyles(colors: ColorPalette) {
    return {
        button: {
            width: 44,
            height: 44,
            borderRadius: BORDER_RADIUS.full,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            borderWidth: 1,
            borderColor: colors.cardBorder,
            backgroundColor: colors.cardBackground,
        },
    };
}

/** Round prev/next arrow for session footers — sits at the screen edges. */
export const NavArrowButton: React.FC<NavArrowButtonProps> = ({
    direction,
    onPress,
    disabled = false,
}) => {
    const styles = useThemedStyles(createStyles);
    const colors = useColors();

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                disabled ? layout.disabled : null,
                pressed && !disabled ? layout.pressed : null,
            ]}
            accessibilityRole="button"
            accessibilityLabel={direction === 'back' ? 'Previous question' : 'Next question'}
            accessibilityState={{ disabled }}
        >
            <MaterialIcon
                name={direction === 'back' ? 'arrow_back' : 'arrow_forward'}
                size={22}
                color={disabled ? colors.textTertiary : colors.primary}
            />
        </Pressable>
    );
};

export default NavArrowButton;
