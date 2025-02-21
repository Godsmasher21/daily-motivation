import { View, Text, StyleSheet, FlatList, Pressable, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuoteStore } from '../../stores/quoteStore';

export default function CategoriesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { categories } = useQuoteStore();

  const gradientColors = [
    ['#6366f1', '#818cf8'],
    ['#ec4899', '#f472b6'],
    ['#14b8a6', '#2dd4bf'],
    ['#f59e0b', '#fbbf24'],
    ['#8b5cf6', '#a78bfa'],
    ['#ef4444', '#f87171'],
  ];

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        numColumns={2}
        renderItem={({ item, index }) => (
          <Pressable style={styles.categoryCard}>
            <LinearGradient
              colors={gradientColors[index % gradientColors.length]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.categoryText}>{item}</Text>
            </LinearGradient>
          </Pressable>
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
    padding: 8,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    height: 120,
    maxWidth: '50%',
  },
  gradient: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});