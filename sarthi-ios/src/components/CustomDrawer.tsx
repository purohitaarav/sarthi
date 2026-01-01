import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import { Sparkles, BookOpen, History, Info, X } from 'lucide-react-native';
import { useDrawer } from '../context/DrawerContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

const CustomDrawer: React.FC = () => {
    const { isOpen, closeDrawer } = useDrawer();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isOpen) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -DRAWER_WIDTH,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isOpen]);

    const navigateTo = (screen: keyof RootStackParamList) => {
        // For HomeMain, we use the HomeMain navigator name
        // But since we are likely switching top-level stack screens now
        // I'll update the navigation structure to be flat stacks if possible
        // Or just use the names from RootStackParamList
        navigation.navigate(screen as any);
        closeDrawer();
    };

    // No conditional return to avoid private property access lint error
    // The component is hidden via transform and pointerEvents when closed

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'none'}>
            {/* Backdrop */}
            <TouchableWithoutFeedback onPress={closeDrawer}>
                <Animated.View
                    style={[
                        styles.backdrop,
                        {
                            opacity: fadeAnim,
                        },
                    ]}
                />
            </TouchableWithoutFeedback>

            {/* Drawer Content */}
            <Animated.View
                style={[
                    styles.drawer,
                    {
                        transform: [{ translateX: slideAnim }],
                    },
                ]}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Sarthi</Text>
                    <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
                        <X size={24} color={colors.gray[600]} />
                    </TouchableOpacity>
                </View>

                <View style={styles.navItems}>
                    <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('HomeMain' as any)}>
                        <Sparkles size={22} color={colors.primary[700]} />
                        <Text style={styles.navText}>Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('Reflections')}>
                        <BookOpen size={22} color={colors.primary[700]} />
                        <Text style={styles.navText}>Reflections</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('History')}>
                        <History size={22} color={colors.primary[700]} />
                        <Text style={styles.navText}>History</Text>
                    </TouchableOpacity>



                    <TouchableOpacity style={styles.navItem} onPress={() => navigateTo('About')}>
                        <Info size={22} color={colors.primary[700]} />
                        <Text style={styles.navText}>About Sarthi</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2025 Sarthi</Text>
                </View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#fff',
        paddingTop: 60,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[100],
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.primary[700],
    },
    closeButton: {
        padding: 4,
    },
    navItems: {
        paddingTop: spacing.xl,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
    },
    navText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.gray[800],
        marginLeft: spacing.lg,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: colors.gray[400],
    },
});

export default CustomDrawer;
