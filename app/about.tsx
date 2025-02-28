import { View, Text } from 'react-native'; // Import View and Text from react-native

export default function AboutPage() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>About Critter Central</Text>
      <Text style={{ marginTop: 10 }}>
        Welcome to the About page! Learn more about our mission to provide excellent care for animals and help veterinary staff manage critical cases efficiently.
      </Text>
    </View>
  );
}