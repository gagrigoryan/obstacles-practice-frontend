import { IPoint } from "../domain/entities/point";

export const getPreparedPoints = (sourcePoints: IPoint[]): number[] => {
    return sourcePoints.reduce((previousValue: number[], currentValue) => {
        return [...previousValue, currentValue.x, currentValue.y];
    }, []);
};
