
import { useState } from "react";

import {
    checkBackendHealth,
    analyzeCircular,
    extractCircularText
} from "../services/analysisApi";


const ApiTest = () => {

    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [language, setLanguage] = useState("en");
    const [sourceType, setSourceType] = useState("text");

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Test backend connection
    const handleHealthCheck = async () => {

        setLoading(true);
        setError("");

        try {
            const data = await checkBackendHealth();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    // Test file extraction
    const handleExtract = async () => {

        if (!file) {
            setError("Please select a file");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await extractCircularText(
                file,
                language
            );

            setText(data.text);
            setSourceType(data.source_type);
            setResult(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    // Test circular analysis
    const handleAnalyze = async () => {

        if (text.trim().length < 20) {
            setError("Provide at least 20 characters");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const data = await analyzeCircular(
                text,
                language,
                sourceType
            );

            setResult(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6 space-y-5">

            <h1 className="text-2xl font-bold">
                CircularShield API Test
            </h1>

            <button
                className="btn btn-outline"
                onClick={handleHealthCheck}
                disabled={loading}
            >
                Test Backend Connection
            </button>

            <select
                className="select select-bordered w-full"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={loading}
            >
                <option value="en">English</option>
                <option value="bn">Bangla</option>
            </select>

            <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="file-input file-input-bordered w-full"
                disabled={loading}
                onChange={(e) => {
                    setFile(e.target.files[0] || null);
                    setText("");
                    setSourceType("text");
                    setResult(null);
                }}
            />

            <button
                className="btn btn-secondary"
                onClick={handleExtract}
                disabled={loading || !file}
            >
                Extract Text
            </button>

            <textarea
                className="textarea textarea-bordered w-full"
                rows={8}
                placeholder="Paste circular text here..."
                value={text}
                disabled={loading}
                onChange={(e) => setText(e.target.value)}
            />

            <button
                className="btn btn-primary"
                onClick={handleAnalyze}
                disabled={loading || text.trim().length < 20}
            >
                Analyze Circular
            </button>

            {loading && (
                <div className="flex items-center gap-2">
                    <span className="loading loading-spinner"></span>
                    Processing...
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {result && (
                <pre className="bg-base-200 p-4 rounded-lg overflow-auto whitespace-pre-wrap break-words">
                    {JSON.stringify(result, null, 2)}
                </pre>
            )}

        </div>
    );
};

export default ApiTest;
