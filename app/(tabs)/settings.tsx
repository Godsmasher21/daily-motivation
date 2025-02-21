import { View, Text, StyleSheet, Switch, Pressable, useColorScheme } from 'react-native';
import { useState } from 'react';
import { useQuoteStore } from '../../stores/quoteStore';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { notificationTime, setNotificationTime } = useQuoteStore();
  const [notifications, setNotifications] = useState(true);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationTime(e.target.value);
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={[styles.section, isDark && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
          Notifications
        </Text>
        <View style={styles.setting}>
          <Text style={[styles.settingText, isDark && styles.darkText]}>
            Daily Quote Notifications
          </Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={notifications ? '#6366f1' : '#f4f3f4'}
          />
        </View>
        
        <View style={[styles.setting, !notifications && styles.disabled]}>
          <Text style={[styles.settingText, isDark && styles.darkText]}>
            Notification Time
          </Text>
          <input
            type="time"
            value={notificationTime}
            onChange={handleTimeChange}
            style={{
              background: 'transparent',
              border: 'none',
              color: isDark ? '#fff' : '#000',
              fontSize: '16px',
            }}
            disabled={!notifications}
          />
        </View>
      </View>

      <View style={[styles.section, isDark && styles.darkSection]}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
          About
        </Text>
        <Text style={[styles.version, isDark && styles.darkText]}>
          Version 1.0.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  darkSection: {
    backgroundColor: '#111',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
    color: '#000',
  },
  timeText: {
    fontSize: 16,
    color: '#6366f1',
  },
  disabled: {
    opacity: 0.5,
  },
  version: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});