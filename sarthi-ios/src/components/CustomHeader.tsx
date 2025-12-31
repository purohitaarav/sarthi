import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Menu } from 'lucide-react-native';
import { useDrawer } from '../context/DrawerContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface CustomHeaderProps {
    title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
    const { openDrawer } = useDrawer();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
                        <Menu size={24} color={colors.gray[700]} />
                    </TouchableOpacity>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.placeholder} />
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    safeArea: {
        backgroundColor: '#fff',
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
    },
    menuButton: {
        padding: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.gray[900],
    },
    placeholder: {
        width: 40,
    },
});

export default CustomHeader;
