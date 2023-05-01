import React, { useState, useRef } from "react";
import { View, PanResponder, LayoutChangeEvent } from "react-native";
import Canvas from "react-native-canvas";

type Props = {
  initialWidth: number;
  initialHeight: number;
};

type CanvasProps = {
  canvasWidth: number;
  canvasHeight: number;
};

type ResizableCanvasProps = Props & CanvasProps;

const ResizableCanvas: React.FC<Props> = ({ initialWidth, initialHeight }) => {
  const [canvasSize, setCanvasSize] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const [draggingCorner, setDraggingCorner] = useState<
    "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | null
  >(null);

  const canvasRef = useRef<Canvas>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvasSize({ width, height });
  };

  const handleDragStart = (
    corner: "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
  ) => {
    setDraggingCorner(corner);
  };

  const handleDragEnd = () => {
    setDraggingCorner(null);
  };

  const handleDragMove = (dx: number, dy: number) => {
    if (canvasRef.current && draggingCorner) {
      const { width, height } = canvasSize;

      let newWidth = width;
      let newHeight = height;

      switch (draggingCorner) {
        case "topLeft":
          newWidth += dx;
          newHeight += dy;
          break;
        case "topRight":
          newWidth -= dx;
          newHeight += dy;
          break;
        case "bottomLeft":
          newWidth += dx;
          newHeight -= dy;
          break;
        case "bottomRight":
          newWidth -= dx;
          newHeight -= dy;
          break;
      }

      setCanvasSize({ width: newWidth, height: newHeight });
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onPanResponderGrant: () => {
        // Allow responder to handle gesture
        return true;
      },
      onPanResponderMove: (_, gestureState) => {
        handleDragMove(gestureState.dx, gestureState.dy);
      },
      onPanResponderRelease: () => {
        handleDragEnd();
      },
      onPanResponderTerminate: () => {
        handleDragEnd();
      },
    })
  ).current;

  const cornerStyles = {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "white",
    borderColor: "black",
  };

  return (
    <View style={{ flex: 1 }} onLayout={handleLayout}>
      <Canvas
        ref={canvasRef}
        style={{ flex: 1, backgroundColor: "green", width: 200, height: 200 }}
      />

      {/* Top left corner */}
      <View
        style={{
          position: "absolute",
          width: 20,
          height: 20,
          backgroundColor: "white",
          borderColor: "black",
          top: 0,
          left: 0,
        }}
        {...panResponder.panHandlers}
        onTouchStart={() => handleDragStart("topLeft")}
        onTouchEnd={() => handleDragEnd()}
      />

      {/* Top right corner */}
      <View
        style={{
          position: "absolute",
          width: 20,
          height: 20,
          backgroundColor: "white",
          borderColor: "black",
          top: 0,
          right: 0,
        }}
        {...panResponder.panHandlers}
        onTouchStart={() => handleDragStart("topRight")}
        onTouchEnd={() => handleDragEnd()}
      />
      {/* Bottom left corner */}
      <View
        style={{
          position: "absolute",
          width: 20,
          height: 20,
          backgroundColor: "white",
          borderColor: "black",
          bottom: 0,
          left: 0,
        }}
        {...panResponder.panHandlers}
        onTouchStart={() => handleDragStart("bottomLeft")}
        onTouchEnd={() => handleDragEnd()}
      />

      {/* Bottom right corner */}
      <View
        style={{
          position: "absolute",
          width: 20,
          height: 20,
          backgroundColor: "white",
          borderColor: "black",
          bottom: 0,
          right: 0,
        }}
        {...panResponder.panHandlers}
        onTouchStart={() => handleDragStart("bottomRight")}
        onTouchEnd={() => handleDragEnd()}
      />
    </View>
  );
};

export default ResizableCanvas;
