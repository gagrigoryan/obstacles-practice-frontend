import React, { memo, useEffect, useState } from "react";
import Konva from "konva";

import CanvasLayer from "../../components/canvas-layer";
import Polygon from "../../components/polygon";
import { IPolygon } from "../../domain/entities/polygon";
import { IPoint } from "../../domain/entities/point";

import Control from "./components/Control";

import styles from "./HomePage.module.scss";

export type IMode = "create" | "edit";

const HomePage: React.FC = () => {
  const [polygonList, setPolygonList] = useState<IPolygon[]>([]);
  const [selectedId, selectShape] = useState<number | null>(null);
  const [mode, setMode] = useState<IMode>("edit");
  const [newPolygonIndex, setNewPolygonIndex] = useState<number>(0);

  const checkDeselect = (event: Konva.KonvaEventObject<Event>) => {
    // снимаем выбор когда кликаем на пустое место
    const clickedOnEmpty = event.target === event.target.getStage();

    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const onClickHandler = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (mode === "create") {
      const point: IPoint = event.target.getRelativePointerPosition();

      const isOldPolygon = polygonList?.[newPolygonIndex];

      const currentPolygon: IPolygon = isOldPolygon
        ? polygonList?.[newPolygonIndex]
        : {
            id: newPolygonIndex,
            linePoints: [],
            points: [],
          };

      currentPolygon.linePoints.push(point);
      currentPolygon.points.push(point);

      if (!isOldPolygon) {
        setPolygonList([...polygonList, currentPolygon]);
      } else {
        const newPolygonList = [...polygonList];
        newPolygonList[newPolygonIndex] = currentPolygon;

        setPolygonList(newPolygonList);
      }
    }
  };

  const onChangeHandler = (sourcePolygon: IPolygon) => {
    setPolygonList(polygonList.map((polygon) => (polygon.id === sourcePolygon.id ? sourcePolygon : polygon)));
  };

  useEffect(() => {
    if (mode === "create") {
      selectShape(null);
    }
  }, [mode]);

  return (
    <main className={styles.container}>
      <CanvasLayer onClick={onClickHandler} checkDeselect={checkDeselect}>
        {polygonList.map((polygon) => (
          <Polygon
            key={polygon.id.toString()}
            {...polygon}
            onChange={onChangeHandler}
            isSelected={polygon.id === selectedId && mode !== "create"}
            onSelect={() => {
              selectShape(polygon.id);
            }}
          />
        ))}
      </CanvasLayer>
      <Control setMode={setMode} mode={mode} setNewPolygonIndex={() => setNewPolygonIndex(newPolygonIndex + 1)} />
    </main>
  );
};

export default memo(HomePage);
