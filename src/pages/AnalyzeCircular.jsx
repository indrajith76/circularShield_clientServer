
import {
  useState,
  useRef,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  extractCircularText,
  analyzeCircular,
} from "../services/analysisApi";


const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TEXT_LENGTH = 50000;
const MIN_TEXT_LENGTH = 20;


export const AnalyzeCircular = () => {

  const navigate = useNavigate();
  const fileInputRef = useRef(null);


  // ==============================
  // 1. Input States
  // ==============================

  const [activeTab, setActiveTab] = useState("PDF");

  const [language, setLanguage] = useState("en");

  const [selectedFile, setSelectedFile] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [extractedText, setExtractedText] = useState("");

  const [url, setUrl] = useState("");


  // ==============================
  // 2. Processing States
  // ==============================

  const [extracting, setExtracting] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);

  const [dragging, setDragging] = useState(false);

  const [error, setError] = useState("");

  const [status, setStatus] = useState("idle");


  const tabs = ["PDF", "Image", "Paste Text", "URL"];

  const isFileTab =
    activeTab === "PDF" || activeTab === "Image";

  const isBusy = extracting || analyzing;


  // Check whether extracted text is ready
  const isTextReady =
    extractedText.trim().length >= MIN_TEXT_LENGTH &&
    extractedText.length <= MAX_TEXT_LENGTH;


  // ==============================
  // 3. Generate File Preview
  // ==============================

  useEffect(() => {

    if (!selectedFile) {

      setPreviewUrl("");

      return;
    }

    const objectUrl =
      URL.createObjectURL(selectedFile);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };

  }, [selectedFile]);


  // ==============================
  // 4. Change Input Tab
  // ==============================

  const handleTabChange = (tab) => {

    if (isBusy || tab === activeTab) return;

    setActiveTab(tab);
    setSelectedFile(null);
    setExtractedText("");
    setUrl("");
    setError("");
    setStatus("idle");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  };


  // ==============================
  // 5. Change Language
  // ==============================

  const handleLanguageChange = (value) => {

    if (isBusy || value === language) return;

    setLanguage(value);
    setError("");

    // Extract again if OCR language changes
    if (isFileTab) {

      setExtractedText("");

      setStatus(
        selectedFile
          ? "file-selected"
          : "idle"
      );

    }

  };


  // ==============================
  // 6. Validate Uploaded File
  // ==============================

  const validateFile = (file) => {

    if (!file) {
      return "Please select a file.";
    }

    if (file.size === 0) {
      return "The selected file is empty.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must not exceed 10 MB.";
    }

    const extension = file.name
      .split(".")
      .pop()
      .toLowerCase();


    if (
      activeTab === "PDF" &&
      extension !== "pdf"
    ) {
      return "Please select a valid PDF file.";
    }


    if (
      activeTab === "Image" &&
      !["png", "jpg", "jpeg"].includes(extension)
    ) {
      return "Only PNG, JPG and JPEG images are supported.";
    }

    return null;

  };


  // ==============================
  // 7. Select File
  // ==============================

  const handleFileSelect = (file) => {

    if (!file || isBusy) return;

    setError("");

    const validationError = validateFile(file);

    if (validationError) {

      setError(validationError);

      return;
    }

    setSelectedFile(file);
    setExtractedText("");
    setStatus("file-selected");

  };


  // ==============================
  // 8. Drag and Drop
  // ==============================

  const handleDrop = (event) => {

    event.preventDefault();

    setDragging(false);

    if (isBusy) return;

    const file = event.dataTransfer.files[0];

    handleFileSelect(file);

  };


  // ==============================
  // 9. Remove File
  // ==============================

  const handleRemoveFile = () => {

    if (isBusy) return;

    setSelectedFile(null);
    setExtractedText("");
    setError("");
    setStatus("idle");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  };


  // ==============================
  // 10. Extract Text from File
  // ==============================

  const handleExtractText = async () => {

    if (isBusy) return;

    setError("");

    if (!selectedFile) {

      setError("Please select a file first.");

      return;
    }

    setExtracting(true);
    setExtractedText("");
    setStatus("extracting");

    try {

      const response = await extractCircularText(
        selectedFile,
        language
      );


      if (response.success === false) {

        throw new Error(
          response.message || "Text extraction failed."
        );

      }


      const text =
        response.text ??
        response.result?.text ??
        response.data?.text ??
        "";


      if (
        typeof text !== "string" ||
        !text.trim()
      ) {

        throw new Error(
          "No readable text was found in this file."
        );

      }


      const cleanText = text.trim();


      if (cleanText.length < MIN_TEXT_LENGTH) {

        throw new Error(
          "Not enough readable text was extracted. Please upload a clearer circular."
        );

      }


      if (cleanText.length > MAX_TEXT_LENGTH) {

        throw new Error(
          "Extracted text exceeds 50,000 characters. Please upload a shorter document."
        );

      }


      // Store extracted text internally
      setExtractedText(cleanText);


      // Change button to Analyze Circular
      setStatus("extracted");


    } catch (err) {

      console.error(
        "Text extraction failed:",
        err
      );

      setError(
        err.message || "Unable to extract text."
      );

      setStatus("error");

    } finally {

      setExtracting(false);

    }

  };


  // ==============================
  // 11. Determine Source Type
  // ==============================

  const getSourceType = () => {

    switch (activeTab) {

      case "PDF":
        return "pdf";

      case "Image":
        return "image";

      case "URL":
        return "url";

      default:
        return "text";

    }

  };


  // ==============================
  // 12. Analyze Circular
  // ==============================

  const handleAnalyze = async () => {

    if (isBusy) return;

    setError("");


    if (activeTab === "URL") {

      setError(
        "URL extraction is not connected yet."
      );

      return;

    }


    const text = extractedText.trim();


    if (text.length < MIN_TEXT_LENGTH) {

      setError(
        "Please provide at least 20 characters of circular text."
      );

      return;

    }


    if (text.length > MAX_TEXT_LENGTH) {

      setError(
        "Circular text must not exceed 50,000 characters."
      );

      return;

    }


    setAnalyzing(true);
    setStatus("analyzing");


    try {

      const sourceType = getSourceType();


      const response = await analyzeCircular(
        text,
        language,
        sourceType
      );


      if (
        response.success === false ||
        !response.result ||
        !response.analysis_id
      ) {

        throw new Error(
          response.message ||
          "The server returned an incomplete analysis result."
        );

      }


      setStatus("completed");


      // Navigate to the dynamic result page
      navigate("/analysis-result", {

        state: {

          analysisId: response.analysis_id,

          result: response.result,

          text: text,

          language: language,

          sourceType: sourceType,

          fileName: selectedFile?.name || null,

          sourceUrl: null,

        },

      });


    } catch (err) {

      console.error(
        "Analysis failed:",
        err
      );

      setError(
        err.message ||
        "Unable to analyze the circular."
      );

      setStatus("error");

      // Do not clear extracted text.
      // User can retry the analysis.

    } finally {

      setAnalyzing(false);

    }

  };


  // ==============================
  // 13. Single Dynamic Action Button
  // ==============================

  const handlePrimaryAction = () => {

    if (isBusy) return;


    if (isFileTab) {

      if (isTextReady) {

        handleAnalyze();

      } else {

        handleExtractText();

      }

      return;

    }


    if (activeTab === "Paste Text") {

      handleAnalyze();

    }

  };


  // Determine button label
  const getButtonLabel = () => {

    if (extracting) {
      return "Extracting Text...";
    }

    if (analyzing) {
      return "Analyzing Circular...";
    }

    if (isFileTab && !isTextReady) {
      return "Extract Text";
    }

    return "Analyze Circular";

  };


  // Determine button color
  const isAnalyzeButton =
    activeTab === "Paste Text" || isTextReady;


  // ==============================
  // 14. Status Configuration
  // ==============================

  const statusConfig = {

    idle: {
      label: "Waiting for input",
      style: "bg-[#F1F5F9] text-[#64748B]",
    },

    "file-selected": {
      label: "File selected",
      style: "bg-blue-50 text-blue-600",
    },

    extracting: {
      label: "Extracting text...",
      style: "bg-[#FFFBEB] text-[#D99A28]",
    },

    extracted: {
      label: "Text extraction complete",
      style: "bg-[#ECFDF5] text-[#16A36A]",
    },

    ready: {
      label: "Text ready for analysis",
      style: "bg-[#ECFDF5] text-[#16A36A]",
    },

    analyzing: {
      label: "Analyzing circular...",
      style: "bg-[#FFFBEB] text-[#D99A28]",
    },

    completed: {
      label: "Analysis complete",
      style: "bg-[#ECFDF5] text-[#16A36A]",
    },

    error: {
      label: "Please check the error",
      style: "bg-red-50 text-red-600",
    },

  };


  const currentStatus =
    statusConfig[status] || statusConfig.idle;


  // ==============================
  // 15. User Interface
  // ==============================

  return (

    <div className="space-y-6">


      {/* Page Header */}

      <div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
          Analyze a Job Circular
        </h1>

        <p className="text-sm text-[#64748B] mt-1">
          Upload a PDF or image, paste circular text,
          or enter a job circular URL.
        </p>

      </div>


      {/* Format Selector and Language */}

      <div className="flex flex-wrap items-center justify-between gap-4">


        {/* Input Format Tabs */}

        <div className="flex flex-wrap items-center gap-2">

          {tabs.map((tab) => (

            <button
              key={tab}
              type="button"
              disabled={isBusy}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
                activeTab === tab
                  ? "bg-[#0F172A] text-white shadow-xs"
                  : "bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
              }`}
            >
              {tab}
            </button>

          ))}

        </div>


        {/* Language Selector */}

        <div className="flex items-center gap-2">

          <label
            htmlFor="circular-language"
            className="text-xs font-semibold text-[#64748B]"
          >
            Circular Language:
          </label>

          <select
            id="circular-language"
            value={language}
            disabled={isBusy}
            onChange={(event) =>
              handleLanguageChange(event.target.value)
            }
            className="px-3 py-2 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#087F70]"
          >

            <option value="en">
              English
            </option>

            <option value="bn">
              বাংলা (Bangla)
            </option>

          </select>

        </div>

      </div>


      {/* Error Message */}

      {error && (

        <div
          role="alert"
          className="flex items-start justify-between gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm"
        >

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="font-bold cursor-pointer"
            aria-label="Dismiss error"
          >
            ×
          </button>

        </div>

      )}


      {/* Single Column Workspace */}

      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 border border-[#E2E8F0] shadow-xs space-y-5">


        {/* Workspace Title */}

        <h2 className="text-sm font-bold text-[#0F172A]">

          {isFileTab
            ? "File Preview"
            : activeTab === "Paste Text"
            ? "Circular Text Input"
            : "Circular URL"}

        </h2>


        {/* ========================== */}
        {/* PDF and Image Upload       */}
        {/* ========================== */}

        {isFileTab && (

          <>

            {/* Hidden File Input */}

            <input
              ref={fileInputRef}
              type="file"
              accept={
                activeTab === "PDF"
                  ? ".pdf,application/pdf"
                  : ".png,.jpg,.jpeg,image/png,image/jpeg"
              }
              disabled={isBusy}
              className="hidden"
              onChange={(event) => {

                handleFileSelect(
                  event.target.files[0]
                );

                event.target.value = "";

              }}
            />


            {/* Upload Dropzone */}

            {!selectedFile && (

              <div
                onDragOver={(event) => {

                  event.preventDefault();

                  if (!isBusy) {
                    setDragging(true);
                  }

                }}
                onDragLeave={() =>
                  setDragging(false)
                }
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl min-h-[350px] flex flex-col items-center justify-center p-6 text-center transition-colors ${
                  dragging
                    ? "border-[#087F70] bg-[#ECFDF5]"
                    : "border-[#CBD5E1] hover:border-[#087F70] hover:bg-[#F8FAFC]"
                }`}
              >

                <svg
                  className="w-12 h-12 text-[#94A3B8] mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />

                </svg>


                <p className="text-sm font-semibold text-[#0F172A]">
                  Drop a {activeTab} here
                </p>

                <p className="text-xs text-[#94A3B8] mt-2">
                  Maximum file size: 10 MB
                </p>


                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="mt-4 px-5 py-2.5 rounded-lg bg-[#0F172A] text-white text-xs font-semibold hover:bg-[#1E293B] transition-colors cursor-pointer"
                >
                  Browse Files
                </button>


                <p className="text-[11px] text-[#94A3B8] mt-3">

                  {activeTab === "PDF"
                    ? "Supported format: PDF"
                    : "Supported formats: PNG, JPG, JPEG"}

                </p>

              </div>

            )}


            {/* Selected File Preview */}

            {selectedFile && (

              <div className="space-y-4">


                {/* File Information */}

                <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">

                  <div className="min-w-0">

                    <p className="text-sm font-semibold text-[#0F172A] break-all">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-[#64748B] mt-1">

                      {(selectedFile.size / 1024 / 1024).toFixed(2)}
                      {" "}MB

                    </p>

                  </div>


                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleRemoveFile}
                    className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50 cursor-pointer"
                  >
                    Remove
                  </button>

                </div>


                {/* Image Preview */}

                {activeTab === "Image" && previewUrl && (

                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">

                    <img
                      src={previewUrl}
                      alt="Uploaded job circular"
                      className="w-full max-h-[650px] object-contain rounded-lg"
                    />

                  </div>

                )}


                {/* Full Width PDF Preview */}

                {activeTab === "PDF" && previewUrl && (

                  <div className="space-y-3">

                    <iframe
                      src={previewUrl}
                      title="PDF circular preview"
                      className="w-full h-[400px] sm:h-[550px] lg:h-[650px] rounded-xl border border-[#E2E8F0]"
                    />

                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs text-[#087F70] font-semibold hover:underline"
                    >
                      Open PDF Preview
                    </a>

                  </div>

                )}


                {/* Extraction Success Message */}

                {isTextReady && (

                  <div className="flex items-start gap-3 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] p-4">

                    <svg
                      className="w-5 h-5 text-[#16A36A] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />

                    </svg>


                    <div>

                      <p className="text-sm font-semibold text-[#087F70]">
                        Text extracted successfully
                      </p>

                      <p className="text-xs text-[#64748B] mt-1">

                        {extractedText.length.toLocaleString()}
                        {" "}characters extracted. Your circular
                        is ready for analysis.

                      </p>

                    </div>

                  </div>

                )}


                {/* Processing Message */}

                {extracting && (

                  <div className="rounded-xl bg-[#FFFBEB] border border-amber-200 p-4">

                    <p className="text-xs font-medium text-amber-800">
                      Extracting text from your circular.
                      Please wait...
                    </p>

                  </div>

                )}


                {analyzing && (

                  <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4">

                    <p className="text-xs font-medium text-[#087F70]">
                      Analyzing the circular using the
                      machine learning model and fraud
                      detection rules. Please wait...
                    </p>

                  </div>

                )}

              </div>

            )}

          </>

        )}


        {/* ========================== */}
        {/* Paste Text Tab             */}
        {/* ========================== */}

        {activeTab === "Paste Text" && (

          <div className="space-y-3">

            <textarea
              rows={14}
              value={extractedText}
              disabled={isBusy}
              maxLength={MAX_TEXT_LENGTH}
              placeholder={
                language === "bn"
                  ? "এখানে নিয়োগ বিজ্ঞপ্তির লেখা পেস্ট করুন..."
                  : "Paste the complete job circular here..."
              }
              onChange={(event) => {

                const value = event.target.value;

                setExtractedText(value);
                setError("");

                setStatus(
                  value.trim().length >= MIN_TEXT_LENGTH
                    ? "ready"
                    : "idle"
                );

              }}
              className="w-full p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFCFD] text-sm text-[#182B36] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70] resize-y"
            />


            <div className="flex flex-wrap items-center justify-between gap-2">

              <p className="text-xs text-[#64748B]">
                Paste the complete circular for better
                analysis results.
              </p>

              <p className="text-xs text-[#64748B]">

                {extractedText.length.toLocaleString()}
                {" / "}
                {MAX_TEXT_LENGTH.toLocaleString()}

              </p>

            </div>

          </div>

        )}


        {/* ========================== */}
        {/* URL Tab                    */}
        {/* ========================== */}

        {activeTab === "URL" && (

          <div className="space-y-4">

            <label
              htmlFor="circular-url"
              className="text-xs font-semibold text-[#64748B]"
            >
              Job Circular URL
            </label>

            <input
              id="circular-url"
              type="url"
              value={url}
              disabled={isBusy}
              onChange={(event) =>
                setUrl(event.target.value)
              }
              placeholder="https://example.com/job-circular"
              className="w-full p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFCFD] text-sm focus:outline-none focus:border-[#087F70]"
            />

            <button
              type="button"
              disabled
              className="w-full py-3 rounded-xl bg-[#0F172A] text-white text-sm font-semibold opacity-50 cursor-not-allowed"
            >
              Extract from URL
            </button>

            <div className="p-4 rounded-xl bg-[#FFFBEB] border border-amber-200 text-xs text-amber-800">
              URL extraction is not connected in this
              component yet. For now, copy the circular
              text and use the Paste Text option.
            </div>

          </div>

        )}


        {/* ========================== */}
        {/* Status and Primary Action  */}
        {/* ========================== */}

        {(
          (isFileTab && selectedFile) ||
          activeTab === "Paste Text"
        ) && (

          <div className="space-y-4 pt-2">


            {/* Dynamic Status */}

            <div
              aria-live="polite"
              className="flex flex-wrap items-center gap-2 text-xs"
            >

              <span className="font-medium text-[#64748B]">
                Status:
              </span>

              <span
                className={`px-2.5 py-1 rounded-full font-semibold ${currentStatus.style}`}
              >
                {currentStatus.label}
              </span>

            </div>


            {/* Single Dynamic Button */}

            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={
                isBusy ||
                (isFileTab && !selectedFile) ||
                (activeTab === "Paste Text" && !isTextReady)
              }
              className={`w-full py-3.5 px-4 rounded-xl text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                isAnalyzeButton
                  ? "bg-[#087F70] hover:bg-[#066559]"
                  : "bg-[#0F172A] hover:bg-[#1E293B]"
              }`}
            >

              {isBusy && (

                <span className="loading loading-spinner loading-sm"></span>

              )}

              {getButtonLabel()}

            </button>


            {/* Disclaimer */}

            <p className="text-[11px] text-[#94A3B8] leading-relaxed text-center">

              Analysis results are AI-based risk estimates
              and do not guarantee whether a circular is
              genuine or fraudulent.

            </p>

          </div>

        )}

      </div>

    </div>

  );

};


export default AnalyzeCircular;
