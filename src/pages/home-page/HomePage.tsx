import React, { memo, useEffect, useState } from "react";
import Konva from "konva";

import CanvasLayer from "../../components/canvas-layer";
import Polygon from "../../components/polygon";
import { IPolygon } from "../../domain/entities/polygon";
import { IPoint } from "../../domain/entities/point";

import Control from "./components/Control";
import { uniqueId, isNil } from "lodash";
import styles from "./HomePage.module.scss";
import Path from "../../components/path";

export type IMode = "create" | "edit";

const mockPath = [
  [
    {
      x: 618,
      y: 14,
    },
    {
      x: 601,
      y: 35,
    },
    {
      x: 674,
      y: 80,
    },
    {
      x: 581,
      y: 124,
    },
  ],
];

const HomePage: React.FC = () => {
  const [polygonList, setPolygonList] = useState<IPolygon[]>([]);
  const [path, setPath] = useState<IPolygon>();
  const [selectedId, selectShape] = useState<number | null>(null);
  const [mode, setMode] = useState<IMode>("edit");
  const [newPolygonIndex, setNewPolygonIndex] = useState<number>(+uniqueId());
  const [isDisabledBtns, setIsDisabledBtns] = useState<boolean>(false);

  const checkDeselect = (event: Konva.KonvaEventObject<Event>) => {
    // снимаем выбор когда кликаем на пустое место
    const clickedOnEmpty = event.target === event.target.getStage();

    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const onClickHandler = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (mode === "create") {
      setIsDisabledBtns(true);
      const point: IPoint = event.target.getRelativePointerPosition();

      const isOldPolygon = polygonList?.find((item) => item.id === newPolygonIndex);
      const currentPolygon: IPolygon = isOldPolygon || {
        id: newPolygonIndex,
        linePoints: [],
        points: [],
      };

      currentPolygon.linePoints.push(point);
      currentPolygon.points.push(point);

      if (!isOldPolygon) {
        setPolygonList([...polygonList, currentPolygon]);
      } else {
        setPolygonList([...[...polygonList].filter((item) => item.id !== currentPolygon.id), currentPolygon]);
      }
    }
  };

  const onChangeHandler = (sourcePolygon: IPolygon) => {
    setPolygonList(polygonList.map((polygon) => (polygon.id === sourcePolygon.id ? sourcePolygon : polygon)));
  };

  const handleFinishCreate = () => {
    setNewPolygonIndex(+uniqueId());
    setMode("edit");
    setIsDisabledBtns(false);
  };

  const handleDeletePolygon = () => {
    if (!isNil(selectedId)) {
      setPolygonList([...polygonList].filter((polygon) => polygon.id !== selectedId));
      selectShape(null);
    }
  };

  const handleSetPolygonsFromFile = (polygonsPoints: IPoint[][]) => {
    const polygons = polygonsPoints.reduce((acc, item) => {
      acc.push({
        id: +uniqueId(),
        points: item,
        linePoints: item,
      });

      return acc;
    }, [] as IPolygon[]);

    setPolygonList([...polygonList, ...polygons]);
  };

  const handleClearScreen = () => {
    setPolygonList([]);
    setPath(undefined);
    selectShape(null);
  };

  const handleGetPath = () => {
    const polygons = mockPath.reduce((acc, item) => {
      acc.push({
        id: +uniqueId(),
        points: item,
        linePoints: item,
      });

      return acc;
    }, [] as IPolygon[]);
    setPath(polygons[0]);
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
        {path && <Path key={path.id.toString()} {...path} />}
      </CanvasLayer>
      <Control
        setMode={setMode}
        mode={mode}
        onFinishCreate={handleFinishCreate}
        onDeletePolygon={handleDeletePolygon}
        selectedId={selectedId}
        isDisabledBtns={isDisabledBtns}
        handleSetPolygonsFromFile={handleSetPolygonsFromFile}
        handleClearScreen={handleClearScreen}
        onGetPath={handleGetPath}
      />
    </main>
  );
};

export default memo(HomePage);
