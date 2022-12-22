import { FC, useRef, ChangeEvent } from "react";
import { IPoint } from "../../../../../domain/entities/point";

type UploadButtonProps = {
  className?: string;
  handleFile: (polygonsPoints: IPoint[][]) => void;
  isDisabledBtns: boolean;
};

const UploadButton: FC<UploadButtonProps> = ({ className, handleFile, isDisabledBtns }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const handleFileLoad = (event: ProgressEvent<FileReader>) => {
    if (event.target && typeof event.target.result === "string") {
      handleFile(JSON.parse(event.target.result));

      if (hiddenFileInput.current) {
        hiddenFileInput.current.value = "";
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const fileUploaded = event.target.files[0];

      const reader = new FileReader();
      reader.onload = handleFileLoad;

      reader.readAsText(fileUploaded);
    }
  };

  return (
    <>
      <button className={className} onClick={handleClick} disabled={isDisabledBtns}>
        Load poly
      </button>
      <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: "none" }} />
    </>
  );
};

export default UploadButton;
