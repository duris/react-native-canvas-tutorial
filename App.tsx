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

  const [isTouching, setIsTouching] = useState(false);

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

  const touchRange = {
    x: {
      leftLimit: rect.x,
      rightLimit: rect.x + boxDimensions.width,
    },
    y: {
      topLimit: rect.y,
      bottomLimit: rect.y + boxDimensions.height,
    },
  };

  const hasTouched = (touchX: number, touchY: number) => {
    const result =
      touchX > touchRange.x.leftLimit &&
      touchX < touchRange.x.rightLimit &&
      touchY > touchRange.y.topLimit &&
      touchY < touchRange.y.bottomLimit;

    return result;
  };

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
      <View
        onTouchStart={(e) => {
          const touchX = e.nativeEvent.locationX;
          const touchY = e.nativeEvent.locationY;
          if (hasTouched(touchX, touchY)) {
            setIsTouching(true);
          }
        }}
        onTouchMove={(e) => {
          const touchX = e.nativeEvent.locationX;
          const touchY = e.nativeEvent.locationY;

          if (hasTouched(touchX, touchY) || isTouching) {
            setRect({
              ...rect,
              x: e.nativeEvent.locationX - boxDimensions.width / 2,
              y: e.nativeEvent.locationY - boxDimensions.height / 2,
            });
          }
        }}
        onTouchEndCapture={(e) => {
          setIsTouching(false);
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
    </SafeAreaView>
  );
};

export default App;
