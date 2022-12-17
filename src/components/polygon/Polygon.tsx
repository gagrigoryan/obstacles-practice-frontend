import React, { useState } from "react";
import { IPolygon } from "../../domain/entities/polygon";
import { Line } from "react-konva";
import { IPoint } from "../../domain/entities/point";
import Point from "../point";
import Konva from "konva";
import { getPreparedPoints } from "../../utils/getPreparedPoints";

type PolygonProps = IPolygon & {
    onChange?: (polygon: IPolygon) => void;
};

const Polygon: React.FC<PolygonProps> = ({ id, points, onChange }) => {
    const [isDragged, setDragged] = useState<boolean>(false);

    const onPointChangeHandler = (sourcePoint: IPoint, sourceIndex: number) => {
        onChange?.({ id, points: points.map((point, index) => (index === sourceIndex ? sourcePoint : point)) });
    };

    const onDragEndHandler = (event: Konva.KonvaEventObject<DragEvent>) => {
        setDragged(false);
        const { x, y } = event.target.position();
        event.target.position({ x: 0, y: 0 });
        onChange?.({
            id,
            points: points.map((point) => ({
                x: point.x + x,
                y: point.y + y,
            })),
        });
    };

    return (
        <>
            <Line
                points={getPreparedPoints(points)}
                closed
                fill="#e5737366"
                stroke="#e57373"
                draggable
                onDragStart={() => setDragged(true)}
                onDragEnd={onDragEndHandler}
            />
            {!isDragged &&
                points.map((point, index) => (
                    <Point key={index.toString()} {...point} onChange={(point) => onPointChangeHandler(point, index)} />
                ))}
        </>
    );
};

export default Polygon;
