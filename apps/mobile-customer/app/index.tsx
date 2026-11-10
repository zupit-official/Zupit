import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { Colors } from '../constants/Colors';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'food' | 'grocery' | 'bike'>('food');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>Zupit</Text>
          <Text style={styles.locationSubtitle}>📍 Jamui, Bihar</Text>
        </View>
        <TouchableOpacity style={styles.profileBadge}>
          <Text style={styles.profileBadgeText}>M</Text>
        </TouchableOpacity>
      </View>

      {/* Service Selector Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'food' && styles.activeTabButton]}
          onPress={() => setActiveTab('food')}
        >
          <Text style={[styles.tabText, activeTab === 'food' && styles.activeTabText]}>
            🍔 Food
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'grocery' && styles.activeTabButton]}
          onPress={() => setActiveTab('grocery')}
        >
          <Text style={[styles.tabText, activeTab === 'grocery' && styles.activeTabText]}>
            🛒 Mart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'bike' && styles.activeTabButton]}
          onPress={() => setActiveTab('bike')}
        >
          <Text style={[styles.tabText, activeTab === 'bike' && styles.activeTabText]}>
            🛵 Bike Taxi
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder={
              activeTab === 'food'
                ? 'Search restaurants or dishes in Jamui...'
                : activeTab === 'grocery'
                ? 'Search daily essentials & groceries...'
                : 'Where do you want to go?'
            }
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        {/* Dynamic Service View */}
        {activeTab === 'food' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular in Jamui</Text>
            <View style={styles.card}>
              <View style={styles.cardCover} />
              <View style={styles.cardBody}>
                <View style={styles.cardRow}>
                  <Text style={styles.restaurantName}>Royal Biryani & Rolls</Text>
                  <Text style={styles.ratingBadge}>★ 4.6</Text>
                </View>
                <Text style={styles.restaurantMeta}>North Indian, Biryani • 20-30 mins</Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardCover} />
              <View style={styles.cardBody}>
                <View style={styles.cardRow}>
                  <Text style={styles.restaurantName}>Jamui Sweets & Bakers</Text>
                  <Text style={styles.ratingBadge}>★ 4.8</Text>
                </View>
                <Text style={styles.restaurantMeta}>Sweets, Snacks • 15-20 mins</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'grocery' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Essentials (Fast Delivery)</Text>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>🛒 Grocery & Mart catalog rolling out in Phase 2</Text>
            </View>
          </View>
        )}

        {activeTab === 'bike' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instant Bike Ride</Text>
            <View style={styles.rideBox}>
              <Text style={styles.rideBoxTitle}>Affordable quick rides across Jamui</Text>
              <Text style={styles.rideBoxSubtitle}>Fares starting at ₹25</Text>
              <TouchableOpacity style={styles.rideButton}>
                <Text style={styles.rideButtonText}>Choose Destination</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  locationSubtitle: {
    fontSize: 13,
    color: '#F9D5D5',
    marginTop: 2,
  },
  profileBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBadgeText: {
    color: Colors.white,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: Colors.primaryLight,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardCover: {
    height: 140,
    backgroundColor: '#EAEAEA',
  },
  cardBody: {
    padding: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  ratingBadge: {
    backgroundColor: '#E8F5E9',
    color: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontWeight: '700',
    fontSize: 12,
  },
  restaurantMeta: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  emptyState: {
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  rideBox: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rideBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  rideBoxSubtitle: {
    color: Colors.textMuted,
    marginTop: 4,
    marginBottom: 12,
  },
  rideButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rideButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
