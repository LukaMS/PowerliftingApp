import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useProfile } from '@/hooks/useProfile';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkoutCount } from '@/api/profile';

const ProfileScreen = () => {
  const { session, loading: authLoading } = useAuth();
  const userId = session?.user.id || '';
  const { data: profileData, isLoading: profileLoading, error: profileError } = useProfile(userId);
  const { data: workoutCount, isLoading: countLoading, error: countError } = useQuery({
    queryKey: ['workoutCount', userId],
    queryFn: () => fetchWorkoutCount(userId),
    enabled: !!userId,
  });

  if (authLoading || profileLoading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  if (profileError) {
    console.log(profileError);
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error loading profile</Text>
      </SafeAreaView>
    );
  }

  const initials = profileData?.name[0]
  const name = profileData?.name || session?.user.user_metadata?.full_name || initials;
  const email = session?.user.email || '';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Total Workouts</Text>
        <Text style={styles.value}>
          {countLoading ? '...' : countError ? 'Error' : workoutCount}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => {/* TODO: navigate to edit */}}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    padding: 15,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
    alignItems: 'center',
    margin: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '600',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});