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
import { Colors } from "../../domain/entities/colors";
import { BtnsDisable } from "../../domain/entities/btns";
import { getPreparedPointForRequest } from "../../utils/getPreparedPointForRequest";
import { fetchVisibilityGraph } from "../../domain/services/api/adapters/visibilityGraph";
import { IPath } from "../../domain/entities/path";
import { Line } from "react-konva";
import { getPreparedPoints } from "../../utils/getPreparedPoints";
import { fetchMinimalPath } from "../../domain/services/api/adapters/minimalPath";
export type IMode = "create" | "edit" | "pathPoints";

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
  const [startFinishPoints, setStartFinishPoints] = useState<IPolygon[]>([]);
  const [selectedId, selectShape] = useState<number | null>(null);
  const [mode, setMode] = useState<IMode>("edit");
  const [newPolygonIndex, setNewPolygonIndex] = useState<number>(+uniqueId());
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isDisabledBtns, setIsDisabledBtns] = useState<BtnsDisable>({
    load: false,
    clear: false,
    getPath: false,
    create: false,
    edit: false,
    pathPoints: false,
    delete: false,
    finish: false,
    reset: false,
  });

  const [calculatedMinimalPath, setCalculatedMinimalPath] = useState<IPath | null>(null);

  const checkDeselect = (event: Konva.KonvaEventObject<Event>) => {
    // снимаем выбор когда кликаем на пустое место
    const clickedOnEmpty = event.target === event.target.getStage();

    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const enableAllBtns = () => {
    setIsDisabledBtns({
      load: false,
      clear: false,
      getPath: false,
      create: false,
      edit: false,
      pathPoints: false,
      delete: false,
      finish: false,
      reset: false,
    });
  };

  const onClickHandler = (event: Konva.KonvaEventObject<MouseEvent>) => {
    if (mode === "create") {
      setIsDisabledBtns({
        ...isDisabledBtns,
        load: true,
        clear: true,
        getPath: true,
        create: true,
        edit: true,
        pathPoints: true,
        delete: true,
        reset: true,
      });
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
    } else if (mode === "pathPoints") {
      setIsDisabledBtns({
        ...isDisabledBtns,
        load: true,
        clear: true,
        getPath: true,
        create: true,
        edit: true,
        pathPoints: true,
        delete: true,
        finish: true,
        reset: true,
      });
      const point: IPoint = event.target.getRelativePointerPosition();
      const currentPolygon: IPolygon = {
        id: newPolygonIndex,
        linePoints: [],
        points: [],
      };
      currentPolygon.linePoints.push(point);
      currentPolygon.points.push(point);
      setStartFinishPoints([...startFinishPoints, currentPolygon]);
      setNewPolygonIndex(+uniqueId());
    }
  };

  const onChangeHandler = (sourcePolygon: IPolygon) => {
    setPolygonList(polygonList.map((polygon) => (polygon.id === sourcePolygon.id ? sourcePolygon : polygon)));
    setStartFinishPoints(
      startFinishPoints.map((polygon) => (polygon.id === sourcePolygon.id ? sourcePolygon : polygon))
    );
  };

  const handleFinishCreate = () => {
    setNewPolygonIndex(+uniqueId());
    setMode("edit");
    enableAllBtns();
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
    setCalculatedMinimalPath(null);
    setStartFinishPoints([]);
    enableAllBtns();
  };

  const handleCalculateClick = async () => {
    if (polygonList.length === 0) {
      return;
    }
    try {
      const preparedData = getPreparedPointForRequest([...polygonList, ...startFinishPoints]);
      setIsFetching(true);
      const response = await fetchVisibilityGraph(preparedData);
      const { length } = response.nodes;
      const minimalPathResponse = await fetchMinimalPath({
        ...response,
        start: response.nodes.findIndex(
          (node) => node.x === startFinishPoints[0].points[0].x && node.y === startFinishPoints[0].points[0].y
        ),
        finish: response.nodes.findIndex(
          (node) => node.x === startFinishPoints[1].points[0].x && node.y === startFinishPoints[1].points[0].y
        ),
      });

      setCalculatedMinimalPath(minimalPathResponse.path);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
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
    if (startFinishPoints.length === 2 && mode === "pathPoints") {
      setMode("edit");
      setIsDisabledBtns({
        ...isDisabledBtns,
        load: false,
        clear: false,
        getPath: false,
        create: false,
        edit: false,
        delete: false,
        finish: false,
        reset: false,
      });
    }
  }, [startFinishPoints, isDisabledBtns, setIsDisabledBtns]);

  useEffect(() => {
    if (mode === "create") {
      selectShape(null);
    }
  }, [mode]);

  return (
    <main className={isFetching ? styles.containerOpacity : ""}>
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
        {startFinishPoints &&
          startFinishPoints.map((polygon, i) => (
            <Polygon
              key={polygon.id.toString()}
              {...polygon}
              onChange={onChangeHandler}
              pointsColor={i === 0 ? Colors.dodgerBlue : Colors.darkOrange}
              pointsRadius={5}
            />
          ))}
        {calculatedMinimalPath != null && (
          <Line stroke={Colors.pastelGreen} strokeWidth={3} points={getPreparedPoints(calculatedMinimalPath)} />
        )}
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
        onGetPath={handleCalculateClick}
        onReset={() => setCalculatedMinimalPath(null)}
      />
    </main>
  );
};

export default memo(HomePage);
