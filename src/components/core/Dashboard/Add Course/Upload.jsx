import { useState, useRef } from "react";
import { FiUploadCloud } from "react-icons/fi";
import ReactPlayer from "react-player";

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData || editData || ""
  );
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Save the file in state
      previewFile(file); // Generate a preview
      setValue(name, file, { shouldValidate: true }); // Set the file in react-hook-form and trigger validation
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
    reader.onerror = () => {
      console.error("Error reading file");
      alert("Could not preview file. Please select a different file.");
    };
  };

  const removeFile = () => {
    setPreviewSource(""); // Reset preview source
    setSelectedFile(null); // Clear the selected file
    setValue(name, null, { shouldValidate: true }); // Clear the form value and trigger validation
  };

  return (
    <div className="flex flex-col space-y-2">
      {/* Label */}
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>

      {/* File Input */}
      <div
        className={`${
          previewSource ? "bg-transparent" : "bg-richblack-700"
        } flex min-h-[250px] items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <ReactPlayer
                url={previewSource}
                controls
                width="100%"
                height="auto"
              />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={removeFile}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center p-6">
            <input
              type="file"
              ref={inputRef}
              id={name}
              accept={!video ? "image/" : "video/"}
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              className="flex flex-col items-center justify-center cursor-pointer"
              onClick={() => inputRef.current.click()}
            >
              <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
                <FiUploadCloud className="text-2xl text-yellow-50" />
              </div>
              <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
                Drag and drop or{" "}
                <span className="font-semibold text-yellow-50">Browse</span> an
                {!video ? " image" : " video"}
              </p>
              <ul className="mt-10 flex flex-col space-y-2 text-xs text-richblack-200 text-center">
                <li>Aspect Ratio: 16:9</li>
                <li>Recommended Size: 1024x576</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
}