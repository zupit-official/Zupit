import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<'delivery' | 'rides'>('delivery');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />

      {/* Rider Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Zupit Partner</Text>
          <Text style={styles.statusSubtitle}>
            {isOnline ? '🟢 Online & Ready for Orders' : '⚪ Offline'}
          </Text>
        </View>
        <Switch
          value={isOnline}
          onValueChange={setIsOnline}
          trackColor={{ false: '#444', true: '#27AE60' }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Mode Switcher */}
      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeButton, activeTab === 'delivery' && styles.activeModeButton]}
          onPress={() => setActiveTab('delivery')}
        >
          <Text style={[styles.modeText, activeTab === 'delivery' && styles.activeModeText]}>
            🍔 Food Delivery
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, activeTab === 'rides' && styles.activeModeButton]}
          onPress={() => setActiveTab('rides')}
        >
          <Text style={[styles.modeText, activeTab === 'rides' && styles.activeModeText]}>
            🛵 Bike Taxi
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Earnings Card */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Today's Earnings</Text>
          <Text style={styles.earningsValue}>₹0.00</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>Completed: 0</Text>
            <Text style={styles.statsText}>Acceptance: 100%</Text>
          </View>
        </View>

        {/* Incoming Orders Section */}
        <View style={styles.ordersSection}>
          <Text style={styles.sectionTitle}>
            {isOnline ? 'Active Requests Nearby' : 'Go Online to Receive Requests'}
          </Text>

          {isOnline ? (
            <View style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <Text style={styles.requestType}>🍔 Food Order #1042</Text>
                <Text style={styles.payout}>₹35.00 Payout</Text>
              </View>
              <Text style={styles.restaurantName}>Royal Biryani & Rolls</Text>
              <Text style={styles.distanceText}>📍 Pickup: 1.2 km away (Main Road, Jamui)</Text>
              <Text style={styles.distanceText}>🎯 Drop: 2.8 km away (Station Road)</Text>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.rejectButton}>
                  <Text style={styles.rejectText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton}>
                  <Text style={styles.acceptText}>Accept Order</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.offlineBox}>
              <Text style={styles.offlineText}>
                Turn on the toggle switch at the top to start receiving food orders or bike rides in Jamui.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },
  header: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statusSubtitle: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 2,
  },
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeModeButton: {
    backgroundColor: '#961E1E',
  },
  modeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  activeModeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  earningsCard: {
    backgroundColor: '#961E1E',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  earningsLabel: {
    color: '#F9D5D5',
    fontSize: 13,
    fontWeight: '600',
  },
  earningsValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingTop: 8,
    marginTop: 6,
  },
  statsText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  ordersSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#961E1E',
  },
  payout: {
    fontSize: 16,
    fontWeight: '800',
    color: '#27AE60',
  },
  restaurantName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  distanceText: {
    color: '#475569',
    fontSize: 13,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectText: {
    color: '#64748B',
    fontWeight: '700',
  },
  acceptButton: {
    flex: 2,
    backgroundColor: '#27AE60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  offlineBox: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  offlineText: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
