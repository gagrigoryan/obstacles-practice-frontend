import React, { memo, useEffect, useState } from "react";
import Konva from "konva";

import CanvasLayer from "../../components/canvas-layer";
import Polygon from "../../components/polygon";
import { IPolygon } from "../../domain/entities/polygon";
import { IPoint } from "../../domain/entities/point";

import Control from "./components/Control";
import { uniqueId, isNil } from "lodash";
import styles from "./HomePage.module.scss";
import { getPreparedPointForRequest } from "../../utils/getPreparedPointForRequest";
import { fetchVisibilityGraph } from "../../domain/services/api/adapters/visibilityGraph";
import { IPath } from "../../domain/entities/path";
import { Line } from "react-konva";
import { getPreparedPoints } from "../../utils/getPreparedPoints";
import { fetchMinimalPath } from "../../domain/services/api/adapters/minimalPath";

export type IMode = "create" | "edit";

const HomePage: React.FC = () => {
  const [polygonList, setPolygonList] = useState<IPolygon[]>([]);
  const [selectedId, selectShape] = useState<number | null>(null);
  const [mode, setMode] = useState<IMode>("edit");
  const [newPolygonIndex, setNewPolygonIndex] = useState<number>(+uniqueId());
  const [isDisabledEditBtn, setIsDisabledEditBtn] = useState<boolean>(false);

  const [calculatedMinimalPath, setCalculatedMinimalPath] = useState<IPath | null>(null);

  const checkDeselect = (event: Konva.KonvaEventObject<Event>) => {
    // снимаем выбор когда кликаем на пустое место
    const clickedOnEmpty = event.target === event.target.getStage();

    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const onClickHandler = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (mode === "create") {
      setIsDisabledEditBtn(true);
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
    setIsDisabledEditBtn(false);
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
    selectShape(null);
    setCalculatedMinimalPath(null);
  };

  const handleCalculateClick = async () => {
    if (polygonList.length === 0) {
      return;
    }
    try {
      const preparedData = getPreparedPointForRequest(polygonList);
      const response = await fetchVisibilityGraph(preparedData);
      const { length } = response.nodes;
      const minimalPathResponse = await fetchMinimalPath({
        ...response,
        start: length - 2,
        finish: length - 1,
      });

      setCalculatedMinimalPath(minimalPathResponse.path);
    } catch (error) {
      console.error(error);
    }
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
        {calculatedMinimalPath != null && <Line stroke="#0288d1" points={getPreparedPoints(calculatedMinimalPath)} />}
      </CanvasLayer>
      <Control
        setMode={setMode}
        mode={mode}
        onFinishCreate={handleFinishCreate}
        onDeletePolygon={handleDeletePolygon}
        selectedId={selectedId}
        isDisabledEditBtn={isDisabledEditBtn}
        handleSetPolygonsFromFile={handleSetPolygonsFromFile}
        handleClearScreen={handleClearScreen}
        onCalculate={handleCalculateClick}
        onReset={() => setCalculatedMinimalPath(null)}
      />
    </main>
  );
};

export default memo(HomePage);
