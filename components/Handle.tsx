import { View, Text } from "react-native";
import React from "react";
import { Coordinates } from "../App";

type Handle = {
  coordinates: Coordinates;
};

const Handle = ({ coordinates }: Handle) => {
  return (
    <View
      style={{
        left: coordinates.x,
        top: coordinates.y,
        position: "absolute",
        height: 20,
        width: 20,
        backgroundColor: "white",
        borderColor: "red",
        borderWidth: 4,
        zIndex: 30,
        borderRadius: 9000,
      }}
    ></View>
  );
};

export default Handle;
