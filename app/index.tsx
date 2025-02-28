import { Link } from "expo-router";
import { View, Text } from 'react-native'; 

export default function HomePage() {
  return (
    <View> 
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Welcome to Critter Central!</Text> 
      <Text>
        This is the home page. You can <Link href="/about">go to About</Link>.
      </Text>
    </View>
  );
}