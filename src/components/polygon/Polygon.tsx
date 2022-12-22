import React, { useEffect, useRef, useState } from "react";
import { Line, Transformer } from "react-konva";
import Konva from "konva";

import { IPolygon } from "../../domain/entities/polygon";
import { IPoint } from "../../domain/entities/point";
import Point from "../point";
import { getPreparedPoints } from "../../utils/getPreparedPoints";
import { Colors } from "../../domain/entities/colors";

type PolygonProps = IPolygon & {
  onChange?: (polygon: IPolygon) => void;
  isSelected: boolean;
  onSelect: () => void;
};

const Polygon: React.FC<PolygonProps> = ({ id, points, linePoints, isSelected, onSelect, onChange }) => {
  const polygonRef = useRef<Konva.Line | null>(null);
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const polygonPointsRef = useRef<IPoint[]>([]);
  const [isDragged, setDragged] = useState<boolean>(false);

  const onPointChangeHandler = (sourcePoint: IPoint, sourceIndex: number) => {
    onChange?.({
      id,
      linePoints: linePoints.map((linePoint, index) => (index === sourceIndex ? sourcePoint : linePoint)),
      points,
    });
  };

  const onDragEndHandler = (event: Konva.KonvaEventObject<DragEvent>) => {
    setDragged(false);
    const { x, y } = event.target.position();
    event.target.position({ x: 0, y: 0 });

    // считаем новое положение точек
    const newPoints = linePoints.map((linePoint) => ({
      x: linePoint.x + x,
      y: linePoint.y + y,
    }));

    polygonPointsRef.current = newPoints;

    onChange?.({
      id,
      linePoints: newPoints,
      points: newPoints,
    });
  };

  const onTransformEndHandler = (event: Konva.KonvaEventObject<Event>) => {
    setDragged(false);
    const prevPoints = polygonPointsRef.current;

    // считаем новое положение точек
    const newPoints = prevPoints.map((point) => {
      const newPoint = event.target.getAbsoluteTransform().point(point);

      return {
        x: newPoint.x,
        y: newPoint.y,
      };
    });

    const polygon = polygonRef.current;

    // возвращаем исходный вид
    polygon?.scaleX(1);
    polygon?.scaleY(1);

    event.target.position({ x: 0, y: 0 });
    event.target.rotation(0);

    onChange?.({
      id,
      points: newPoints,
      linePoints: newPoints,
    });
  };

  const handleMouseUpTransformer = () => {
    polygonPointsRef.current = points;

    if (!transformerRef.current || !polygonRef.current) {
      return;
    }
    transformerRef.current.nodes([polygonRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  };

  useEffect(() => {
    polygonPointsRef.current = points;

    if (!transformerRef.current || !polygonRef.current || !isSelected) {
      return;
    }
    transformerRef.current.nodes([polygonRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [isSelected, points]);

  return (
    <>
      <Line
        ref={polygonRef}
        points={getPreparedPoints(linePoints)}
        closed
        fill={Colors.alabaster}
        stroke={Colors.lightGray}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragStart={() => setDragged(true)}
        onDragEnd={onDragEndHandler}
        onTransformStart={() => setDragged(true)}
        onTransformEnd={onTransformEndHandler}
      />

      {isSelected && <Transformer onTransformEnd={handleMouseUpTransformer} ref={transformerRef} padding={10} />}

      {!isDragged &&
        points.map((point, index) => (
          <Point key={index.toString()} {...point} onChange={(point) => onPointChangeHandler(point, index)} />
        ))}
    </>
  );
};

export default Polygon;
