import React from "react";
import { Image, ImageBackground, StyleSheet, Text } from "react-native";

export default function AppSplash() {
  return (
    <ImageBackground
      source={require('../assets/images/splashBG.jpg')} // your image
      style={styles.container}
      resizeMode="cover" // cover, contain, stretch, etc.
    >
      <Image
        source={require("../assets/images/splashLogo.png")}
        style={styles.logo}
      />
      <Text style={styles.text}>Your Smart Grocery Shopping Assistant</Text>
      <Image
        source={require("../assets/images/loader.gif")}
        style={styles.gif}
      />
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical:50
  },
  gif: {
    width: 300,
    height: 300,
  },
  logo:{
    width:420,
    height:'auto',
    objectFit:"contain",
    aspectRatio:1.32
  },
  text:{
    color:'white',
    fontSize:24,
    fontFamily:'Avenir',
    textAlign:'center'
  }
});
