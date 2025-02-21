import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, useColorScheme, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useQuoteStore } from '../../stores/quoteStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { dailyQuote, loadDailyQuote, toggleFavorite, shareQuote } = useQuoteStore();

  const x = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    loadDailyQuote();
  }, []);

  const handleSwipeComplete = (liked: boolean) => {
    if (liked) {
      toggleFavorite(dailyQuote?.id || 0);
    }
    loadDailyQuote();
    x.value = 0;
    rotation.value = 0;
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      x.value = event.translationX;
      rotation.value = interpolate(
        event.translationX,
        [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        [-15, 0, 15]
      );
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        x.value = withSpring(Math.sign(event.translationX) * SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(handleSwipeComplete)(event.translationX > 0);
        });
      } else {
        x.value = withSpring(0);
        rotation.value = withSpring(0);
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const likeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      x.value,
      [0, SCREEN_WIDTH / 4],
      [0, 1]
    );
    return { opacity };
  });

  const nopeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      x.value,
      [-SCREEN_WIDTH / 4, 0],
      [1, 0]
    );
    return { opacity };
  });

  if (!dailyQuote) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <Text style={[styles.loading, isDark && styles.darkText]}>
          Loading your daily wisdom...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.overlayBadge, styles.likeBadge, likeStyle]}>
          <Text style={styles.overlayText}>LIKE</Text>
        </Animated.View>
        <Animated.View style={[styles.overlayBadge, styles.nopeBadge, nopeStyle]}>
          <Text style={styles.overlayText}>NOPE</Text>
        </Animated.View>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, rStyle]}>
          <LinearGradient
            colors={isDark ? ['#000', '#1a1a1a'] : ['#fff', '#f0f0f0']}
            style={styles.gradient}
          >
            <View style={styles.quoteContainer}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{dailyQuote.category}</Text>
              </View>

              <Text style={[styles.quote, isDark && styles.darkText]}>
                "{dailyQuote.text}"
              </Text>
              
              <Text style={[styles.author, isDark && styles.darkAuthorText]}>
                — {dailyQuote.author}
              </Text>

              <View style={styles.actionButtons}>
                <Pressable
                  onPress={() => toggleFavorite(dailyQuote.id)}
                  style={styles.actionButton}
                >
                  <Animated.View>
                    <Ionicons
                      name={dailyQuote.isFavorite ? 'heart' : 'heart-outline'}
                      size={28}
                      color={dailyQuote.isFavorite ? '#ef4444' : (isDark ? '#fff' : '#000')}
                    />
                  </Animated.View>
                </Pressable>

                <Pressable
                  onPress={() => shareQuote(dailyQuote)}
                  style={styles.actionButton}
                >
                  <Ionicons
                    name="share-outline"
                    size={28}
                    color={isDark ? '#fff' : '#000'}
                  />
                </Pressable>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>

      <View style={styles.instructions}>
        <Text style={[styles.instructionText, isDark && styles.darkText]}>
          Swipe right to like, left to skip
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  card: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    bottom: 100,
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
  },
  quoteContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  categoryBadge: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 24,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quote: {
    fontSize: 28,
    lineHeight: 40,
    textAlign: 'center',
    fontWeight: '300',
    marginBottom: 24,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  author: {
    fontSize: 20,
    color: '#666',
    marginBottom: 40,
    fontWeight: '500',
  },
  darkAuthorText: {
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  actionButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  overlayBadge: {
    position: 'absolute',
    top: '40%',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 3,
    transform: [{ rotate: '-30deg' }],
  },
  likeBadge: {
    right: '25%',
    borderColor: '#22c55e',
  },
  nopeBadge: {
    left: '25%',
    borderColor: '#ef4444',
  },
  overlayText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  instructions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});