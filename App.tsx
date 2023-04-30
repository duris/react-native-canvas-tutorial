import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import Canvas from "react-native-canvas";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const App = () => {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const ref = useRef<Canvas>(null);

  const [headerHeight, setHeaderHeight] = useState(100);

  const [boxDimensions, setBoxDimensions] = useState({
    width: 100,
    height: 100,
  });

  const [rect, setRect] = useState({
    x: width / 2 - boxDimensions.width / 2,
    y: height / 2 - boxDimensions.height,
    w: boxDimensions.width,
    h: boxDimensions.height,
  });

  useEffect(() => {
    const canvas = ref.current as Canvas;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  }, [rect]);

  return (
    <SafeAreaView className=" bg-black h-full">
      <TouchableOpacity>
        <View
          onTouchStart={(e) => {
            console.log("touchMove", e.nativeEvent);
            setRect({
              ...rect,
              x: e.nativeEvent.pageX - boxDimensions.width / 2,
              y: e.nativeEvent.pageY - boxDimensions.height,
            });
          }}
        >
          <Canvas
            ref={ref}
            style={{
              width: width,
              height: height,
              backgroundColor: "black",
            }}
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default App;
