
import { useState, useRef, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  extractCircularText,
  extractCircularFromUrl,
  analyzeCircular,
} from "../services/analysisApi";


const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_TEXT_LENGTH = 50000;
const MIN_TEXT_LENGTH = 20;

const TABS = ["PDF", "Image", "Paste Text", "URL"];


// =====================================
// Status Configuration
// =====================================

const STATUS_CONFIG = {
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


// =====================================
// Main Component
// =====================================

export const AnalyzeCircular = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);


  // ===================================
  // 1. Input States
  // ===================================

  const [activeTab, setActiveTab] = useState("PDF");

  const [language, setLanguage] = useState("en");

  const [selectedFile, setSelectedFile] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [extractedText, setExtractedText] = useState("");

  const [url, setUrl] = useState("");

  const [urlTitle, setUrlTitle] = useState("");

  const [extractedSourceUrl, setExtractedSourceUrl] =
    useState("");


  // ===================================
  // 2. Processing States
  // ===================================

  const [extracting, setExtracting] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);

  const [dragging, setDragging] = useState(false);

  const [error, setError] = useState("");

  const [status, setStatus] = useState("idle");


  const isFileTab =
    activeTab === "PDF" || activeTab === "Image";

  const isUrlTab = activeTab === "URL";

  const isBusy = extracting || analyzing;

  const isTextReady =
    extractedText.trim().length >= MIN_TEXT_LENGTH &&
    extractedText.length <= MAX_TEXT_LENGTH;


  // ===================================
  // 3. Generate File Preview
  // ===================================

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);


  // ===================================
  // 4. Reset URL Metadata
  // ===================================

  const resetUrlMetadata = () => {
    setUrlTitle("");
    setExtractedSourceUrl("");
  };


  // ===================================
  // 5. Change Input Tab
  // ===================================

  const handleTabChange = (tab) => {
    if (isBusy || tab === activeTab) return;

    setActiveTab(tab);

    setSelectedFile(null);

    setExtractedText("");

    setUrl("");

    resetUrlMetadata();

    setError("");

    setStatus("idle");

    setDragging(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  // ===================================
  // 6. Change Language
  // ===================================

  const handleLanguageChange = (value) => {
    if (isBusy || value === language) return;

    setLanguage(value);

    setError("");

    if (isFileTab || isUrlTab) {
      setExtractedText("");

      resetUrlMetadata();

      setStatus(
        selectedFile ? "file-selected" : "idle"
      );
    }
  };


  // ===================================
  // 7. Validate File
  // ===================================

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


  // ===================================
  // 8. Select File
  // ===================================

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


  // ===================================
  // 9. Drag and Drop
  // ===================================

  const handleDrop = (event) => {
    event.preventDefault();

    setDragging(false);

    if (isBusy) return;

    handleFileSelect(event.dataTransfer.files[0]);
  };


  // ===================================
  // 10. Remove File
  // ===================================

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


  // ===================================
  // 11. Validate Extracted Text
  // ===================================

  const getExtractedText = (response) => {
    const text =
      response.text ??
      response.result?.text ??
      response.data?.text ??
      "";

    if (typeof text !== "string") {
      throw new Error(
        "The server returned invalid extracted text."
      );
    }

    const cleanText = text.trim();

    if (cleanText.length < MIN_TEXT_LENGTH) {
      throw new Error(
        "Not enough readable text was found."
      );
    }

    if (cleanText.length > MAX_TEXT_LENGTH) {
      throw new Error(
        "Extracted text exceeds 50,000 characters."
      );
    }

    return cleanText;
  };


  // ===================================
  // 12. Extract Text from File
  // ===================================

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

      const cleanText = getExtractedText(response);

      setExtractedText(cleanText);

      setStatus("extracted");

    } catch (err) {
      console.error("File extraction failed:", err);

      setError(
        err.message || "Unable to extract text."
      );

      setStatus("error");

    } finally {
      setExtracting(false);
    }
  };


  // ===================================
  // 13. Handle URL Input
  // ===================================

  const handleUrlChange = (value) => {
    if (isBusy) return;

    setUrl(value);

    setExtractedText("");

    resetUrlMetadata();

    setError("");

    setStatus("idle");
  };


  // ===================================
  // 14. Validate URL
  // ===================================

  const validateUrl = (value) => {
    try {
      const parsedUrl = new URL(value);

      if (
        !["http:", "https:"].includes(
          parsedUrl.protocol
        )
      ) {
        return false;
      }

      if (
        parsedUrl.username ||
        parsedUrl.password ||
        !parsedUrl.hostname
      ) {
        return false;
      }

      return true;

    } catch {
      return false;
    }
  };


  // ===================================
  // 15. Extract Text from URL
  // ===================================

  const handleExtractUrl = async () => {
    if (isBusy) return;

    setError("");

    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setError("Please enter a job circular URL.");
      return;
    }

    if (!validateUrl(cleanUrl)) {
      setError(
        "Please enter a valid HTTP or HTTPS URL."
      );
      return;
    }

    setExtracting(true);

    setExtractedText("");

    resetUrlMetadata();

    setStatus("extracting");

    try {
      const response = await extractCircularFromUrl(
        cleanUrl,
        language
      );

      const cleanText = getExtractedText(response);

      setExtractedText(cleanText);

      setUrlTitle(
        response.title ||
        response.url_title ||
        ""
      );

      setExtractedSourceUrl(
        response.source_url || cleanUrl
      );

      setStatus("extracted");

    } catch (err) {
      console.error("URL extraction failed:", err);

      setError(
        err.message ||
        "Unable to extract text from the URL."
      );

      setStatus("error");

    } finally {
      setExtracting(false);
    }
  };


  // ===================================
  // 16. Determine Source Type
  // ===================================

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


  // ===================================
  // 17. Analyze Circular
  // ===================================

  const handleAnalyze = async () => {
    if (isBusy) return;

    setError("");

    const text = extractedText.trim();

    if (text.length < MIN_TEXT_LENGTH) {
      setError(
        "Please provide at least 20 characters."
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

      const metadata = {
        fileName: selectedFile?.name || null,

        sourceUrl: isUrlTab
          ? extractedSourceUrl || url.trim()
          : null,

        urlTitle: isUrlTab
          ? urlTitle || null
          : null,
      };

      const response = await analyzeCircular(
        text,
        language,
        sourceType,
        metadata
      );

      if (
        !response.result ||
        !response.analysis_id
      ) {
        throw new Error(
          "The server returned an incomplete analysis result."
        );
      }

      setStatus("completed");

      navigate("/analysis-result", {
        state: {
          analysisId: response.analysis_id,

          result: response.result,

          text,

          language,

          sourceType,

          fileName: metadata.fileName,

          sourceUrl: metadata.sourceUrl,

          urlTitle: metadata.urlTitle,
        },
      });

    } catch (err) {
      console.error("Analysis failed:", err);

      setError(
        err.message ||
        "Unable to analyze the circular."
      );

      setStatus("error");

      // Keep extracted text so analysis can be retried.

    } finally {
      setAnalyzing(false);
    }
  };


  // ===================================
  // 18. Dynamic Primary Action
  // ===================================

  const handlePrimaryAction = () => {
    if (isBusy) return;

    if (
      activeTab === "Paste Text" ||
      isTextReady
    ) {
      handleAnalyze();
      return;
    }

    if (isFileTab) {
      handleExtractText();
      return;
    }

    if (isUrlTab) {
      handleExtractUrl();
    }
  };


  // ===================================
  // 19. Dynamic Button Label
  // ===================================

  const getButtonLabel = () => {
    if (extracting) {
      return isUrlTab
        ? "Extracting from URL..."
        : "Extracting Text...";
    }

    if (analyzing) {
      return "Analyzing Circular...";
    }

    if (
      activeTab === "Paste Text" ||
      isTextReady
    ) {
      return "Analyze Circular";
    }

    if (isUrlTab) {
      return "Extract from URL";
    }

    return "Extract Text";
  };


  const isAnalyzeButton =
    activeTab === "Paste Text" || isTextReady;

  const currentStatus =
    STATUS_CONFIG[status] || STATUS_CONFIG.idle;


  // ===================================
  // 20. User Interface
  // ===================================

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


      {/* Input Format and Language */}

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => (
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
            <option value="en">English</option>

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


      {/* Main Workspace */}

      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 border border-[#E2E8F0] shadow-xs space-y-5">

        <h2 className="text-sm font-bold text-[#0F172A]">
          {isFileTab
            ? "File Preview"
            : activeTab === "Paste Text"
            ? "Circular Text Input"
            : "Circular URL"}
        </h2>


        {/* PDF and Image Tabs */}

        {isFileTab && (
          <>
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


            {/* File Upload Dropzone */}

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

                <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A] break-all">
                      {selectedFile.name}
                    </p>

                    <p className="text-xs text-[#64748B] mt-1">
                      {(
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
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


                {/* PDF Preview */}

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

              </div>
            )}
          </>
        )}


        {/* Paste Text Tab */}

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


        {/* URL Tab */}

        {isUrlTab && (
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
              maxLength={2048}
              onChange={(event) =>
                handleUrlChange(event.target.value)
              }
              placeholder="https://example.com/job-circular"
              className="w-full p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFCFD] text-sm text-[#182B36] focus:outline-none focus:ring-2 focus:ring-[#087F70]/20 focus:border-[#087F70]"
            />

            <p className="text-xs text-[#64748B]">
              Enter a public webpage containing the
              complete job circular.
            </p>


            {/* Extracted Webpage Information */}

            {isTextReady && (
              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-2">

                <p className="text-xs font-semibold text-[#64748B]">
                  Extracted Webpage
                </p>

                <p className="text-sm font-bold text-[#0F172A] break-words">
                  {urlTitle || "Job Circular Webpage"}
                </p>

                <p className="text-xs text-[#087F70] break-all">
                  {extractedSourceUrl || url}
                </p>

              </div>
            )}


            {/* URL Information */}

            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">

              <p className="text-xs text-[#64748B] leading-relaxed">
                Some websites require login or block
                automated extraction. If extraction fails,
                use the PDF, Image or Paste Text option.
              </p>

            </div>

          </div>
        )}


        {/* Extraction Success Message */}

        {(isFileTab || isUrlTab) && isTextReady && (
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
                {extractedText.length.toLocaleString()}{" "}
                characters extracted. Your circular is
                ready for analysis.
              </p>
            </div>

          </div>
        )}


        {/* Extraction Loading Message */}

        {extracting && (
          <div className="rounded-xl bg-[#FFFBEB] border border-amber-200 p-4">

            <p className="text-xs font-medium text-amber-800">
              {isUrlTab
                ? "Retrieving and extracting text from the webpage. Please wait..."
                : "Extracting text from your circular. Please wait..."}
            </p>

          </div>
        )}


        {/* Analysis Loading Message */}

        {analyzing && (
          <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4">

            <p className="text-xs font-medium text-[#087F70]">
              Analyzing the circular using the machine
              learning model and fraud detection rules.
              Please wait...
            </p>

          </div>
        )}


        {/* Status and Primary Action */}

        {(
          (isFileTab && selectedFile) ||
          activeTab === "Paste Text" ||
          isUrlTab
        ) && (
          <div className="space-y-4 pt-2">

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
                (activeTab === "Paste Text" && !isTextReady) ||
                (isUrlTab && !url.trim())
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
