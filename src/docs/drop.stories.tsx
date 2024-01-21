import React from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const style = {
  width: 200,
  height: 150,
  border: "1px dotted #888",
};

function getTypeName(src: any): string {
  if (src) {
    return src.constructor.name;
  } else {
    return typeof src;
  }
}

export function DropZoneStroy() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log("acceptedFiles:", getTypeName(acceptedFiles), acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={style}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}
