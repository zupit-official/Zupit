import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9c1c21" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: November 2026</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Zupit</Text> respects your privacy and is committed to protecting your personal data. This Privacy Policy describes how we collect, use, and share information when you use our services.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          • <Text style={styles.bold}>Account Details:</Text> Mobile phone number and name.
          {'\n'}• <Text style={styles.bold}>Location Information:</Text> Precise GPS location data to display nearby restaurants and ensure accurate order deliveries.
          {'\n'}• <Text style={styles.bold}>Order History:</Text> Items purchased, delivery addresses, and payment transaction statuses.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use your data solely to fulfill orders, facilitate deliveries with rider partners, prevent fraud, send important transactional SMS updates, and provide customer support.
        </Text>

        <Text style={styles.sectionTitle}>3. Sharing of Information</Text>
        <Text style={styles.paragraph}>
          We share your contact name, delivery address, and phone number only with the restaurant preparing your food and the delivery partner fulfilling your order. We never sell your personal data to third parties.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          All communications between your mobile device and our backend servers are secured using SSL encryption. Sensitive authentication credentials and OTPs are stored securely with automatic time expirations.
        </Text>

        <Text style={styles.sectionTitle}>5. Contact Us</Text>
        <Text style={styles.paragraph}>
          For privacy inquiries or account data removal requests, please write to:
        </Text>
        <Text style={styles.contactEmail}>official.zupit@gmail.com</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#9c1c21',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1E1E',
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 10,
  },
  bold: {
    fontWeight: '700',
    color: '#1E1E1E',
  },
  contactEmail: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9c1c21',
    marginTop: 4,
  },
});

