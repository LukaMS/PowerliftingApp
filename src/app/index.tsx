import { View, Text, ActivityIndicator, Button } from 'react-native';
import React from 'react';
import { Link, Redirect } from 'expo-router';

const index = () => {


  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
      <Link href={'/(user)'} asChild>
        <Button title="User" />
      </Link>
      <Link href={'/(auth)/sign-in'} asChild>
        <Button title="Auth" />
      </Link>

    </View>
  );
};

export default index;