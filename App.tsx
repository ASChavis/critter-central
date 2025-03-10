import React from "react";
import { ExpoRoot } from "expo-router";
import { useEffect } from "react";
import { registerRootComponent } from "expo";

export default function App() {
  return <ExpoRoot context={require("./app/_layout").context} />;
}

registerRootComponent(App);