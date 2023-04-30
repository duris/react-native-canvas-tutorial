import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import Canvas from "react-native-canvas";
import {
  GestureResponderEvent,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Handle from "./components/Handle";

type Touch = {
  x: number;
  y: number;
};

type Area = {
  coordinates: Coordinates;
  dimensions: Dimensions;
};

export type Coordinates = {
  x: number;
  y: number;
};

type Dimensions = {
  width: number;
  height: number;
};

type Range = {
  leftLimit: number;
  rightLimit: number;
  topLimit: number;
  bottomLimit: number;
};

const App = () => {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const ref = useRef<Canvas>(null);
  const ref2 = useRef<Canvas>(null);
  const bottomRight = useRef<View>(null);

  const [isTouching, setIsTouching] = useState(false);

  const [isTouchingArea, setIsTouchingArea] = useState({
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  });

  const [headerHeight, setHeaderHeight] = useState(100);

  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 100,
    height: 100,
  });

  const [rect, setRect] = useState({
    x: width / 2 - dimensions.width / 2,
    y: height / 2 - dimensions.height,
  });

  const rectToCheck = {
    coordinates: { x: rect.x, y: rect.y },
    dimensions: dimensions,
  };

  const [layerPosition, setLayerPosition] = useState();

  const [layerDimensions, setLayerDimensions] = useState({
    width: 100,
    height: 100,
  });

  const [layerCoordinates, setLayerCooridinates] = useState<Coordinates>({
    x: 100,
    y: 100,
  });

  const [layer, setLayer] = useState({
    coordinates: {
      x: layerCoordinates.x,
      y: layerCoordinates.y,
    },
    topRight: {
      x: layerCoordinates.x + layerDimensions.width - 10,
      y: layerCoordinates.y - 10,
    },
    bottomRight: {
      x: layerCoordinates.x + layerDimensions.width - 10,
      y: layerCoordinates.y + layerDimensions.height - 10,
    },
  });

  const getTouchRange = (area: Area) => {
    const range = {
      leftLimit: area.coordinates.x,
      rightLimit: area.coordinates.x + area.dimensions.width,
      topLimit: area.coordinates.y,
      bottomLimit: area.coordinates.y + area.dimensions.height,
    } as Range;

    return range;
  };

  const inTouchRange = (touch: Touch, range: Range) => {
    const result =
      touch.x > range.leftLimit - 100 &&
      touch.x < range.rightLimit - 100 &&
      touch.y > range.topLimit - 100 &&
      touch.y < range.bottomLimit - 100;

    return result;
  };

  const inCanvasTouchRange = (touch: Touch, range: Range) => {
    const result =
      touch.x > range.leftLimit &&
      touch.x < range.rightLimit &&
      touch.y > range.topLimit &&
      touch.y < range.bottomLimit;

    return result;
  };

  useEffect(() => {
    const canvas = ref.current as Canvas;
    const canvas2 = ref2.current as Canvas;
    if (!canvas) return;
    if (!canvas2) return;
    canvas2.width = width;
    canvas2.height = width;
    canvas.width = width;
    canvas.height = height;
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "blue";
    ctx.fillRect(rect.x, rect.y, 100, 100);

    const ctx2 = ref2.current?.getContext("2d");
    if (!ctx2) return;
    ctx2.fillStyle = "white";
    ctx2.fillRect(0, 0, 10, 10);
  }, [rect]);

  const handleDrag = (e: GestureResponderEvent) => {
    const topRightHandleRange = {
      coordinates: { x: layer.topRight.x - 50, y: layer.topRight.y - 50 },
      dimensions: { width: 200, height: 200 },
    };
    const bottomRightHandleRange = {
      coordinates: { x: layer.bottomRight.x - 50, y: layer.bottomRight.y - 50 },
      dimensions: { width: 200, height: 200 },
    };

    const topRightRange = getTouchRange(topRightHandleRange);
    const bottomRightRange = getTouchRange(bottomRightHandleRange);

    const touch = {
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    };

    if (inTouchRange(touch, topRightRange) || isTouchingArea.topRight) {
      console.log(touch);
      setIsTouchingArea({ ...isTouchingArea, topRight: true });
      const toMoveX = e.nativeEvent.pageX - layerCoordinates.x;
      const toMoveY = e.nativeEvent.pageY - layerCoordinates.y;
      if (toMoveX > 0 && toMoveY > 0) {
        // setLayerDimensions({
        //   ...layerDimensions,
        //   width: toMoveX,
        //   height: toMoveY,
        // });
        // setLayerCooridinates({
        //   ...layerCoordinates,
        // });
        setLayer({
          ...layer,
          topRight: {
            x: e.nativeEvent.pageX - 10,
            y: e.nativeEvent.pageY - 10,
          },
        });
      }
    }
    if (inTouchRange(touch, bottomRightRange) || isTouchingArea.bottomRight) {
      console.log(touch);
      setIsTouchingArea({ ...isTouchingArea, bottomRight: true });
      const toMoveX = e.nativeEvent.pageX - layerCoordinates.x;
      const toMoveY = e.nativeEvent.pageY - layerCoordinates.y;
      if (toMoveX > 0 && toMoveY > 0) {
        setLayerDimensions({
          ...layerDimensions,
          width: toMoveX,
          height: toMoveY,
        });
        setLayerCooridinates({
          ...layerCoordinates,
        });
        setLayer({
          ...layer,
          topRight: {
            x: e.nativeEvent.pageX - 10,
            y: layerCoordinates.y - 10,
          },
          bottomRight: {
            x: e.nativeEvent.pageX - 10,
            y: e.nativeEvent.pageY - 10,
          },
        });
      }
    }
  };

  return (
    <View
      className=" bg-white h-full"
      onTouchMove={(e) => handleDrag(e)}
      onTouchStart={(e) => handleDrag(e)}
      onTouchEndCapture={(e) => {
        setIsTouchingArea({
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        });
      }}
    >
      <View
        onTouchStart={(e) => {
          const touch = {
            x: e.nativeEvent.locationX,
            y: e.nativeEvent.locationY,
          };
          const range = getTouchRange(rectToCheck);
          if (inCanvasTouchRange(touch, range)) {
            setIsTouching(true);
          }
        }}
        onTouchMove={(e) => {
          const touch = {
            x: e.nativeEvent.locationX,
            y: e.nativeEvent.locationY,
          };
          const range = getTouchRange(rectToCheck);
          if (inCanvasTouchRange(touch, range) || isTouching) {
            setRect({
              ...rect,
              x: e.nativeEvent.locationX - dimensions.width / 2,
              y: e.nativeEvent.locationY - dimensions.height / 2,
            });
          }
        }}
        onTouchEndCapture={(e) => {
          setIsTouching(false);
        }}
      >
        <View className=" bg-white w-12 abosolute z-20">
          <View className="relative">
            <Handle
              coordinates={{
                x: layer.topRight.x,
                y: layer.topRight.y,
              }}
            />
            <Handle
              coordinates={{
                x: layer.bottomRight.x,
                y: layer.bottomRight.y,
              }}
            />

            <View
              className={layerStyle}
              style={{ top: layer.coordinates.y, left: layer.coordinates.x }}
            >
              <Canvas
                ref={ref2}
                style={{
                  width: layerDimensions.width,
                  height: layerDimensions.height,
                  backgroundColor: "red",
                }}
              />
            </View>
          </View>
        </View>
        <View className=" absolute top-0">
          <Canvas
            ref={ref}
            style={{
              width: width,
              height: height,
              backgroundColor: "black",
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default App;

const layerStyle = `absolute `;

const handleStyle = ` absolute w-5 h-5 bg-blue-200 border-2 border-[red] rounded-full z-30`;
