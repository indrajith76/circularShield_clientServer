# CircularShield Analysis API Contract

This document describes the expected frontend-to-backend API interface for the
Job Circular Analysis module. The frontend prepares requests and parses
responses according to this contract. No AI/fraud-detection logic is
implemented on the frontend.

## Base Configuration

All API calls are made to `VITE_API_BASE_URL/analysis`.
Timeout is controlled by `VITE_ANALYSIS_TIMEOUT_MS` (default 30s).

---

## Endpoint

### POST /analysis

Submits a job circular for analysis. Supports two content types depending on
the input method:

- **File inputs (PDF, Image):** `multipart/form-data`
- **Text & URL inputs:** `application/json`

The frontend must NOT assume a successful upload until the backend responds
with a successful HTTP status.

---

## Request Formats

### File Upload (PDF or Image)

`Content-Type: multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `input_type` | string | yes | `"pdf"` or `"image"` |
| `file` | File | yes | The uploaded circular file |

Allowed extensions: `.pdf`, `.jpg`, `.jpeg`, `.png`
Allowed MIME types: `application/pdf`, `image/jpeg`, `image/jpg`, `image/png`
Max file size: configured by `VITE_MAX_FILE_SIZE_BYTES` (default 10 MB)

### Text Input

`Content-Type: application/json`

```json
{
  "input_type": "text",
  "text": "Paste the full circular text here..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `input_type` | string | yes | `"text"` |
| `text` | string | yes | Circular text (Unicode/Bangla supported) |

### URL Input

`Content-Type: application/json`

```json
{
  "input_type": "url",
  "url": "https://company.com/career/job-details"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `input_type` | string | yes | `"url"` |
| `url` | string | yes | Job circular web address |

---

## Response Formats

### Success (HTTP 200)

```json
{
  "success": true,
  "data": {
    "id": "ANA-20261123-001",
    "input_type": "pdf",
    "risk_score": 72,
    "risk_level": "high",
    "final_status": "suspicious",
    "fraud_indicators": [
      {
        "id": "financial_demand",
        "title": "Upfront Payment Solicited",
        "severity": "critical",
        "description": "..."
      }
    ],
    "evidence": {
      "payment_keywords_found": ["bKash"],
      "contact_channels": ["whatsapp"]
    },
    "organization_verification": {
      "verified": false,
      "orgName": "Example Corp",
      "confidence": 0.4
    },
    "url_verification": {
      "valid": true,
      "domain": "example.com",
      "matchesOfficial": false
    },
    "suspicious_contact_details": [
      {
        "type": "phone",
        "value": "+8801712345678",
        "reason": "Personal mobile used for recruitment"
      }
    ],
    "explanations": {
      "bn": "এই চাকরিটি সন্দেহজনক...",
      "en": "This job circular is suspicious because..."
    },
    "recommended_safety_actions": [
      "Do not transfer any money.",
      "Verify with the company directly."
    ],
    "processing_time_ms": 2450
  }
}
```

All fields in `data` are optional and may be absent. The frontend safely
defaults missing values (see `adaptAnalysisResponse`).

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique analysis record ID |
| `input_type` | string | The input method used |
| `risk_score` | number | 0–100 risk score from backend |
| `risk_level` | string | `"low"` \| `"medium"` \| `"high"` \| `"critical"` |
| `final_status` | string | `"verified"` \| `"suspicious"` \| `"unverified"` |
| `fraud_indicators` | array | Detected fraud indicators with severity |
| `evidence` | object | Supporting evidence details |
| `organization_verification` | object | Org verification result |
| `url_verification` | object | URL verification result |
| `suspicious_contact_details` | array | Flagged contact details |
| `explanations` | object | `{ bn, en }` bilingual explanations |
| `recommended_safety_actions` | array | Safety recommendations |
| `processing_time_ms` | number | Backend processing duration |

### Error (HTTP 4xx/5xx)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "User-friendly error message"
  }
}
```

| Error Code | HTTP | Meaning | Retryable |
|------------|------|---------|-----------|
| `VALIDATION_ERROR` | 400 | Invalid input (empty text, bad URL, etc.) | No |
| `FILE_TOO_LARGE` | 413 | File exceeds max size | No |
| `INVALID_FILE_TYPE` | 400 | Unsupported file extension/MIME | No |
| `NETWORK_ERROR` | 0 | Client cannot reach backend | Yes |
| `TIMEOUT` | 504 | Request exceeded timeout | Yes |
| `PROCESSING_FAILED` | 500 | Backend analysis failed | Yes |
| `UNSUPPORTED_FORMAT` | 400 | Unknown input type | No |

---

## Frontend State Machine

The frontend tracks analysis through these states:

`idle` → `validating` → `uploading` (files) / `processing` (text/url) → `completed` | `failed`

Progress messages shown during processing are UI representations only and do
not reflect the backend AI model's internal steps. Actual backend progress is
displayed only when the API supports it.

---

## Security Notes

- No API keys or secrets are stored in frontend code.
- File uploads use multipart/form-data; the browser sets the Content-Type
  boundary automatically — do not override it.
- All user-facing strings are localized where applicable (Bangla/English).