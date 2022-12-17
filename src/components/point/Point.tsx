import React, { useState } from "react";
import { IPoint } from "../../domain/entities/point";
import { Circle } from "react-konva";
import Konva from "konva";

type PointProps = IPoint & {
    onChange?: (point: IPoint) => void;
};

const Point: React.FC<PointProps> = ({ onChange, ...props }) => {
    const [isHovered, setHovered] = useState<boolean>(false);

    const onDragMoveHandler = (event: Konva.KonvaEventObject<DragEvent>) => {
        onChange?.({ ...event.target.attrs });
    };

    return (
        <Circle
            {...props}
            radius={isHovered ? 8 : 6}
            stroke="#e57373"
            fill={!isHovered ? "#e57373" : undefined}
            draggable
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
            onDragMove={onDragMoveHandler}
        />
    );
};

export default Point;
