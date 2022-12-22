import React, { useState } from "react";
import { IPoint } from "../../domain/entities/point";
import { Circle, Text } from "react-konva";
import Konva from "konva";
import { Colors } from "../../domain/entities/colors";

type PointProps = IPoint & {
  onChange?: (point: IPoint) => void;
  isDraggable?: boolean;
  pointColor?: Colors;
};

const Point: React.FC<PointProps> = ({ onChange, x, y, isDraggable = true, pointColor = Colors.silverSand }) => {
  const [isHovered, setHovered] = useState<boolean>(false);

  const onDragMoveHandler = (event: Konva.KonvaEventObject<DragEvent>) => {
    onChange?.({ ...event.target.attrs });
  };

  return (
    <>
      {isHovered && (
        <Text fontStyle="bold" x={x} y={y} offsetX={28} offsetY={24} text={`(${x}, ${y})`} fill={Colors.lightRed} />
      )}
      <Circle
        x={x}
        y={y}
        radius={isHovered ? 5 : 3}
        stroke={isHovered ? Colors.lightRed : pointColor}
        fill={isHovered ? undefined : pointColor}
        draggable={isDraggable}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        onDragMove={onDragMoveHandler}
      />
    </>
  );
};

export default Point;
