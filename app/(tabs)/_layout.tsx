import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '@/utils/auth';

export default function TabLayout() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopWidth: 1,
          borderTopColor: '#333333',
        },
        tabBarActiveTintColor: '#10B981',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hábitos',
          tabBarIcon: ({ color }) => <Ionicons name="checkmark-done" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="gym"
        options={{
          title: 'Gym',
          tabBarIcon: ({ color }) => <MaterialIcons name="fitness-center" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null, // Ocultar el template "two"
        }}
      />
    </Tabs>
  );
}
