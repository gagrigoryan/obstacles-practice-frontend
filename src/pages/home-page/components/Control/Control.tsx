import { isNil } from "lodash";

import UploadButton from "./UploadButton";

import s from "./Control.module.scss";

import { IMode } from "../../HomePage";
import { IPoint } from "../../../../domain/entities/point";
import { BtnsDisable } from "../../../../domain/entities/btns";

type ControlProps = {
  setMode: (mode: IMode) => void;
  mode: IMode;
  onFinishCreate?: () => void;
  onDeletePolygon?: () => void;
  onCalculate?: () => void;
  selectedId: number | null;
  isDisabledBtns: BtnsDisable;
  handleSetPolygonsFromFile: (polygons: IPoint[][]) => void;
  handleClearScreen: () => void;
  onGetPath: () => void;
  onReset?: () => void;
};

const modes: IMode[] = ["create", "edit", "pathPoints"];

const Control: React.FC<ControlProps> = ({
  setMode,
  mode,
  onFinishCreate,
  selectedId,
  onDeletePolygon,
  isDisabledBtns,
  handleSetPolygonsFromFile,
  handleClearScreen,
  onGetPath,
  onReset,
  onCalculate,
}) => {
  return (
    <div className={s.root}>
      <div>
        <UploadButton
          className={s.controlButton}
          handleFile={handleSetPolygonsFromFile}
          isDisabledBtns={isDisabledBtns.load}
        />

        <button className={s.controlButton} onClick={handleClearScreen} disabled={isDisabledBtns.clear}>
          Clear
        </button>

        <button className={s.controlButton} onClick={onGetPath} disabled={isDisabledBtns.getPath}>
          Get path
        </button>

        {modes.map((text) => (
          <button
            key={text}
            className={`${s.controlButton} ${mode === text && s.activeButton}`}
            onClick={() => setMode(text)}
            disabled={isDisabledBtns[text]}>
            {text}
          </button>
        ))}

        {mode === "create" && (
          <button className={s.controlButton} onClick={onFinishCreate} disabled={isDisabledBtns.finish}>
            Finish
          </button>
        )}
        {mode === "edit" && !isNil(selectedId) && (
          <button className={s.controlButton} onClick={onDeletePolygon} disabled={isDisabledBtns.delete}>
            Delete
          </button>
        )}
      </div>
      <div className={s.calculateWrapper}>
        <button type="button" className={s.controlButton} onClick={onCalculate}>
          Calculate
        </button>
        <button type="button" className={s.controlButton} onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Control;
