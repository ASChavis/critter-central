import { Link, router } from "expo-router";
import { View, Text, Pressable } from 'react-native'; 

export default function HomePage() {
  return (
    <View> 
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome to Critter Central!</Text> 
       <Pressable onPress={() => router.push("/users/1")}>
        <Text>Link to User Account</Text>
        </Pressable>.
    </View>
  );
}