import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';
import {
    BookOpen,
    Sparkles,
    Quote,
    ChevronDown,
    ChevronUp,
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';
import { GuidanceResponse } from '../types';

const { width } = Dimensions.get('window');

interface ResponseDisplayProps {
    response: GuidanceResponse;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
    const [expandedVerses, setExpandedVerses] = useState<Record<number, boolean>>({});
    const animations = useRef<Record<number, Animated.Value>>({}).current;

    if (!response) return null;

    const { query, guidance, verses_referenced, timestamp } = response;

    const toggleVerse = (index: number) => {
        if (!animations[index]) {
            animations[index] = new Animated.Value(0);
        }

        const isExpanding = !expandedVerses[index];

        Animated.timing(animations[index], {
            toValue: isExpanding ? 1 : 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();

        setExpandedVerses((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const getAnimatedStyle = (index: number) => {
        if (!animations[index]) {
            animations[index] = new Animated.Value(0);
        }

        const opacity = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

        const translateY = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 0],
        });

        return {
            opacity,
            transform: [{ translateY }],
            display: expandedVerses[index] ? 'flex' as const : 'none' as const,
        };
    };

    return (
        <View style={styles.container}>
            {/* Query Display */}
            <LinearGradient
                colors={[colors.spiritual.blue.light + '20', colors.spiritual.gold.light + '20']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.queryCard}
            >
                <View style={styles.queryContent}>
                    <Quote size={20} color={colors.spiritual.blue.DEFAULT} style={styles.quoteIcon} />
                    <View style={styles.flex1}>
                        <Text style={styles.queryLabel}>Your Question:</Text>
                        <Text style={styles.queryText}>{query}</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Guidance Response */}
            <View style={styles.guidanceCard}>
                <View style={styles.cardHeader}>
                    <Sparkles size={24} color={colors.spiritual.gold.DEFAULT} />
                    <Text style={styles.cardTitle}>Spiritual Guidance</Text>
                </View>

                <Text style={styles.guidanceText}>{guidance}</Text>

                <View style={styles.footer}>
                    <Text style={styles.timestamp}>
                        Received: {new Date(timestamp).toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* Referenced Verses */}
            {verses_referenced && verses_referenced.length > 0 && (
                <LinearGradient
                    colors={['#f3e8ff', '#ede9fe', '#ffffff']}
                    style={styles.versesSection}
                >
                    <View style={styles.cardHeader}>
                        <BookOpen size={24} color={colors.spiritual.blue.DEFAULT} />
                        <Text style={styles.cardTitle}>Referenced Verses</Text>
                    </View>

                    <View style={styles.versesList}>
                        {verses_referenced.map((verse, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.9}
                                onPress={() => toggleVerse(index)}
                                style={styles.verseItem}
                            >
                                <View style={styles.verseHeader}>
                                    <Text style={styles.verseReference}>
                                        Bhagavad Gita {verse.reference}
                                    </Text>
                                    {expandedVerses[index] ? (
                                        <ChevronUp size={20} color={colors.gray[400]} />
                                    ) : (
                                        <ChevronDown size={20} color={colors.gray[400]} />
                                    )}
                                </View>

                                <Text style={styles.verseTranslation}>{verse.translation}</Text>

                                <Animated.View style={[styles.versePurportContainer, getAnimatedStyle(index)]}>
                                    <Text style={styles.versePurport}>{verse.purport || 'No purport available.'}</Text>
                                </Animated.View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </LinearGradient>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: spacing.xl,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.xxl,
    },
    flex1: {
        flex: 1,
    },
    queryCard: {
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.spiritual.blue.light + '30',
    },
    queryContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    quoteIcon: {
        marginRight: spacing.sm,
        marginTop: 2,
    },
    queryLabel: {
        fontSize: 12,
        color: colors.gray[500],
        marginBottom: 2,
    },
    queryText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.gray[800],
    },
    guidanceCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.gray[100],
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.gray[800],
        marginLeft: spacing.sm,
    },
    guidanceText: {
        fontSize: 16,
        color: colors.gray[700],
        lineHeight: 24,
    },
    footer: {
        marginTop: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.gray[100],
    },
    timestamp: {
        fontSize: 12,
        color: colors.gray[400],
    },
    versesSection: {
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.gray[200],
    },
    versesList: {
        marginTop: spacing.sm,
    },
    verseItem: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    verseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    verseReference: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.spiritual.blue.DEFAULT,
    },
    verseTranslation: {
        fontSize: 15,
        color: colors.gray[700],
        lineHeight: 22,
    },
    versePurportContainer: {
        marginTop: spacing.sm,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.gray[100],
    },
    versePurport: {
        fontSize: 14,
        color: colors.gray[600],
        fontStyle: 'italic',
        lineHeight: 20,
    },
});

export default ResponseDisplay;
