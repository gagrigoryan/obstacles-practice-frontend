import { IPoint } from "./point";

export type IPath = IPoint[];

export type TMinimalPathRequest = {
  neighbors: any;
  nodes: IPoint[];
  start: number;
  finish: number;
};

export type TMinimalPathResponse = {
  path: IPath;
};
