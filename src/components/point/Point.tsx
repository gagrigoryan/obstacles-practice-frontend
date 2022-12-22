import React, { useState } from "react";
import { IPoint } from "../../domain/entities/point";
import { Circle, Text } from "react-konva";
import Konva from "konva";

type PointProps = IPoint & {
  onChange?: (point: IPoint) => void;
};

const Point: React.FC<PointProps> = ({ onChange, x, y }) => {
  const [isHovered, setHovered] = useState<boolean>(false);

  const onDragMoveHandler = (event: Konva.KonvaEventObject<DragEvent>) => {
    onChange?.({ ...event.target.attrs });
  };

  return (
    <>
      {isHovered && (
        <Text fontStyle="bold" x={x} y={y} offsetX={28} offsetY={24} text={`(${x}, ${y})`} fill="#e57373" />
      )}
      <Circle
        x={x}
        y={y}
        radius={isHovered ? 5 : 3}
        stroke="#e57373"
        fill={!isHovered ? "#e57373" : undefined}
        draggable
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        onDragMove={onDragMoveHandler}
      />
    </>
  );
};

export default Point;
