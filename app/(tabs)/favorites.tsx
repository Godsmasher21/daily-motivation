import { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useQuoteStore } from '../../stores/quoteStore';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { favorites, loadFavorites, shareQuote } = useQuoteStore();

  useEffect(() => {
    loadFavorites();
  }, []);

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <Ionicons 
          name="heart-outline" 
          size={64} 
          color={isDark ? '#333' : '#e5e5e5'}
          style={styles.emptyIcon}
        />
        <Text style={[styles.emptyText, isDark && styles.darkText]}>
          No favorite quotes yet
        </Text>
        <Text style={[styles.emptySubtext, isDark && styles.darkSubtext]}>
          Save some quotes to see them here!
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Animated.View
            entering={FadeIn}
            style={[styles.quoteCard, isDark && styles.darkQuoteCard]}
          >
            <Text style={[styles.quoteText, isDark && styles.darkText]}>
              "{item.text}"
            </Text>
            <Text style={[styles.authorText, isDark && styles.darkAuthorText]}>
              — {item.author}
            </Text>
            <View style={styles.cardActions}>
              <Text style={[styles.categoryTag, isDark && styles.darkCategoryTag]}>
                {item.category}
              </Text>
              <Pressable
                onPress={() => shareQuote(item)}
                style={styles.shareButton}
              >
                <Ionicons
                  name="share-outline"
                  size={24}
                  color={isDark ? '#fff' : '#000'}
                />
              </Pressable>
            </View>
          </Animated.View>
        )}
        contentContainerStyle={styles.listContainer}
      />
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
  listContainer: {
    padding: 16,
  },
  quoteCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkQuoteCard: {
    backgroundColor: '#1a1a1a',
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 12,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  authorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    fontWeight: '500',
  },
  darkAuthorText: {
    color: '#999',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    fontSize: 14,
    color: '#6366f1',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
  },
  darkCategoryTag: {
    backgroundColor: '#312e81',
    color: '#fff',
  },
  shareButton: {
    padding: 8,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  darkSubtext: {
    color: '#999',
  },
});