import { isNil } from "lodash";

import UploadButton from "./UploadButton";

import s from "./Control.module.scss";

import { IMode } from "../../HomePage";
import { IPoint } from "../../../../domain/entities/point";

type ControlProps = {
  setMode: (mode: IMode) => void;
  mode: IMode;
  onFinishCreate: () => void;
  onDeletePolygon: () => void;
  selectedId: number | null;
  isDisabledEditBtn: boolean;
  handleSetPolygonsFromFile: (polygons: IPoint[][]) => void;
  handleClearScreen: () => void;
};

const modes: IMode[] = ["create", "edit"];

const Control: React.FC<ControlProps> = ({
  setMode,
  mode,
  onFinishCreate,
  selectedId,
  onDeletePolygon,
  isDisabledEditBtn,
  handleSetPolygonsFromFile,
  handleClearScreen,
}) => {
  return (
    <div className={s.root}>
      <div>
        <UploadButton className={s.controlButton} handleFile={handleSetPolygonsFromFile} />

        <button className={s.controlButton} onClick={handleClearScreen}>
          Clear
        </button>

        {modes.map((text) => (
          <button
            key={text}
            className={`${s.controlButton} ${mode === text && s.activeButton}`}
            onClick={() => setMode(text)}
            disabled={text === "edit" && isDisabledEditBtn}>
            {text}
          </button>
        ))}
      </div>
      <div className={s.additionalControl}>
        {mode === "create" && (
          <button className={s.controlButton} onClick={onFinishCreate}>
            Finish
          </button>
        )}
        {mode === "edit" && !isNil(selectedId) && (
          <button className={s.controlButton} onClick={onDeletePolygon}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Control;
