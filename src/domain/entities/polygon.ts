import { IPoint } from "./point";

export type IPolygon = {
  id: number;
  points: IPoint[];
  linePoints: IPoint[];
};

export type TPolygonRequest = Array<IPoint[]>;
