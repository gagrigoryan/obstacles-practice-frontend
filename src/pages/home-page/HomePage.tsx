import React, { memo, useState } from "react";
import styles from "./HomePage.module.scss";
import CanvasLayer from "../../components/canvas-layer";
import Polygon from "../../components/polygon";
import { IPolygon } from "../../domain/entities/polygon";
import Konva from "konva";
import { IPoint } from "../../domain/entities/point";

const HomePage: React.FC = () => {
    const [polygonList, setPolygonList] = useState<IPolygon[]>([]);

    const onClickHandler = (event: Konva.KonvaEventObject<MouseEvent>) => {
        const point: IPoint = event.target.getRelativePointerPosition();
        // Пока для одного полигона
        const currentPolygon: IPolygon = polygonList?.[0] ?? { id: 1, points: [] };
        currentPolygon.points.push(point);
        setPolygonList([currentPolygon]);
    };

    const onChangeHandler = (sourcePolygon: IPolygon) => {
        setPolygonList(polygonList.map((polygon) => (polygon.id === sourcePolygon.id ? sourcePolygon : polygon)));
    };

    return (
        <main className={styles.container}>
            <CanvasLayer onClick={onClickHandler}>
                {polygonList.map((polygon) => (
                    <Polygon key={polygon.id.toString()} {...polygon} onChange={onChangeHandler} />
                ))}
            </CanvasLayer>
        </main>
    );
};

export default memo(HomePage);
