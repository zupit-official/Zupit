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

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9c1c21" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last updated: November 2026</Text>

        <Text style={styles.paragraph}>
          Welcome to <Text style={styles.bold}>Zupit</Text>. By downloading, accessing, or using the Zupit customer mobile application, you agree to be bound by these Terms of Service.
        </Text>

        <Text style={styles.sectionTitle}>1. Services Provided</Text>
        <Text style={styles.paragraph}>
          Zupit operates an on-demand technology platform connecting customers in Jamui, Bihar with local restaurants, merchants, and independent delivery/ride partners for food ordering, quick mart purchases, and bike taxi hailing.
        </Text>

        <Text style={styles.sectionTitle}>2. Account & Verification</Text>
        <Text style={styles.paragraph}>
          You must provide a valid Indian mobile number to create an account. You are responsible for maintaining the confidentiality of your verification OTPs and account activity.
        </Text>

        <Text style={styles.sectionTitle}>3. Orders & Cancellations</Text>
        <Text style={styles.paragraph}>
          Orders placed through the platform are forwarded directly to partner merchants for immediate preparation. Once an order has been accepted by the merchant, cancellations may incur a fee or be restricted.
        </Text>

        <Text style={styles.sectionTitle}>4. Payments & Pricing</Text>
        <Text style={styles.paragraph}>
          Prices for items are determined by merchant partners. You agree to pay all applicable charges, including item costs, delivery fees, and platform convenience charges via Cash on Delivery (COD) or approved online UPI gateways.
        </Text>

        <Text style={styles.sectionTitle}>5. Contact & Inquiries</Text>
        <Text style={styles.paragraph}>
          If you have questions or concerns regarding these terms, please contact us at:
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

