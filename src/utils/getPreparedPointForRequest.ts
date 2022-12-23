import { IPolygon, TPolygonRequest } from "../domain/entities/polygon";

export const getPreparedPointForRequest = (polygonList: IPolygon[]): TPolygonRequest => {
  return polygonList.map((polygon) => {
    return polygon.points;
  });
};
