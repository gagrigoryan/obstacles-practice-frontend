import { TPolygonRequest } from "../../../entities/polygon";
import { apiRequest, RequestMethodType } from "../apiRequest";
import { IVisibilityGraph } from "../../../entities/graph";

export const fetchVisibilityGraph = (body: TPolygonRequest): Promise<IVisibilityGraph> =>
  apiRequest({
    path: "vgf/visibility",
    method: RequestMethodType.POST,
    body,
  });
