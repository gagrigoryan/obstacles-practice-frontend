import React, { useRef } from "react";
import { Line } from "react-konva";
import Konva from "konva";

import { IPolygon } from "../../domain/entities/polygon";
import Point from "../point";
import { getPreparedPoints } from "../../utils/getPreparedPoints";
import { Colors } from "../../domain/entities/colors";

type PolygonProps = IPolygon;

const Polygon: React.FC<PolygonProps> = ({ points, linePoints }) => {
  const polygonRef = useRef<Konva.Line | null>(null);

  return (
    <>
      <Line ref={polygonRef} points={getPreparedPoints(linePoints)} strokeWidth={5} stroke={Colors.pastelGreen} />
      {points.map((point, index) => (
        <Point key={index.toString()} {...point} isDraggable={false} pointColor={Colors.lightRed} />
      ))}
    </>
  );
};

export default Polygon;
