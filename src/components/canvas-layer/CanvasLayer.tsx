import React from "react";
import styles from "./CanvasLayer.module.scss";
import { Layer, Stage } from "react-konva";
import Konva from "konva";

type CanvasLayerProps = {
  children: React.ReactNode;
  onClick?: (event: Konva.KonvaEventObject<MouseEvent>) => void;
  checkDeselect: (event: Konva.KonvaEventObject<Event>) => void;
};

const CanvasLayer: React.FC<CanvasLayerProps> = ({ onClick, children, checkDeselect }) => {
  return (
    <div className={styles.container}>
      <Stage
        onClick={onClick}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}>
        <Layer>{children}</Layer>
      </Stage>
    </div>
  );
};

export default CanvasLayer;
