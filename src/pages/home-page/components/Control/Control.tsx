import { IMode } from "../../HomePage";
import { isNil } from "lodash";

import s from "./Control.module.scss";

type ControlProps = {
  setMode: (mode: IMode) => void;
  mode: IMode;
  onFinishCreate: () => void;
  onDeletePolygon: () => void;
  selectedId: number | null;
};

const modes: IMode[] = ["create", "edit"];

const Control: React.FC<ControlProps> = ({ setMode, mode, onFinishCreate, selectedId, onDeletePolygon }) => {
  return (
    <div className={s.root}>
      <div>
        {modes.map((text) => (
          <button
            key={text}
            className={`${s.controlButton} ${mode === text && s.activeButton}`}
            onClick={() => setMode(text)}>
            {text}
          </button>
        ))}
      </div>
      {mode === "create" && (
        <div className={s.additionalControl}>
          <button className={s.controlButton} onClick={onFinishCreate}>
            Finish
          </button>
        </div>
      )}
      {mode === "edit" && !isNil(selectedId) && (
        <div className={s.additionalControl}>
          <button className={s.controlButton} onClick={onDeletePolygon}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Control;
