Defico AI --- Master 3-Day Execution Plan

Goal: Build a polished, interview-ready AI Business Investigation
/ Inventory Loss Analyzer that takes raw CSV business events,
processes them asynchronously, detects suspicious patterns using
deterministic rules, calculates potential financial impact, collects
evidence, and uses Gemini only to explain verified findings.

0. 🔒 PROJECT DECISIONS --- DO NOT CHANGE

Product

Defico AI

User promise

Understand where your business may be losing money.

The user uploads a CSV and Defico explains:

What happened?
      ↓
Why is it unusual?
      ↓
How much money may be involved?
      ↓
Which transactions caused the finding?
      ↓
What should the business owner review?

1. 🔒 TECHNOLOGY STACK

Keep:

Frontend
React
Vite
Tailwind CSS

Backend
Node.js
Express.js

Database
MongoDB
Mongoose

Async Processing
Redis
BullMQ
Node Worker

File Processing
Multer
csv-parser
Node Streams

Logging
Pino

AI
Gemini

Development
Git
GitHub
Docker (if already configured)

Do NOT add

❌ Kafka
❌ RabbitMQ
❌ Kubernetes
❌ Elasticsearch
❌ PostgreSQL
❌ Microservices
❌ LangChain
❌ AI agents
❌ ML fraud model

Reason: We have approximately three days. The existing architecture
is already strong enough.

2. 🔒 FINAL ARCHITECTURE

                    DEFICO AI
                        │
                        ▼
                  React Client
                        │
                     REST API
                        │
                        ▼
                   Express.js
                        │
                 Upload CSV
                        │
                        ▼
                     Multer
                        │
                        ▼
                  Dataset Record
                     QUEUED
                        │
                        ▼
                   BullMQ Queue
                        │
                        ▼
                      Redis
                        │
                        ▼
                     Worker
                        │
                 CSV Streaming
                        │
                 Normalize Rows
                        │
                   Batch 500
                        │
                        ▼
                    MongoDB
                        │
                        ▼
                Baseline Analysis
                        │
                        ▼
              Investigation Engine
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
       Refund Rule  After-hours   Void Rule
                        │
                        ▼
                  Findings
                        │
                        ▼
                Risk Calculation
                        │
                        ▼
               Evidence Collection
                        │
                        ▼
                Investigation Case
                        │
                        ▼
                     Gemini
                        │
                        ▼
               Human Explanation
                        │
                        ▼
                  React Client

This architecture is locked.

3. 🧠 MOST IMPORTANT DESIGN PRINCIPLE

The backend decides what happened. Gemini explains what happened.

Backend owns

calculations

thresholds

rules

risk score

potential loss

evidence

transaction IDs

employee IDs

timestamps

Gemini owns

explanation

summary

plain-English interpretation

recommended review areas

Gemini does NOT own

❌ financial calculations
❌ risk calculation
❌ fraud determination
❌ evidence creation
❌ inventing transactions

4. 🗂️ TARGET BACKEND STRUCTURE

Server/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── queue.js
│   │
│   ├── core/
│   │   ├── AppError.js
│   │   └── logger.js
│   │
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── uploadMiddleware.js
│   │
│   ├── domains/
│   │   │
│   │   ├── ingest/
│   │   │   ├── ingestRoutes.js
│   │   │   ├── ingestController.js
│   │   │   ├── ingestService.js
│   │   │   └── csvNormalizer.js
│   │   │
│   │   ├── events/
│   │   │   └── eventModel.js
│   │   │
│   │   ├── datasets/
│   │   │   ├── datasetModel.js
│   │   │   ├── datasetController.js
│   │   │   ├── datasetService.js
│   │   │   └── datasetRoutes.js
│   │   │
│   │   ├── engine/
│   │   │   ├── investigationEngine.js
│   │   │   ├── baseline/
│   │   │   │   └── baselineAnalyzer.js
│   │   │   │
│   │   │   └── rules/
│   │   │       ├── BaseRule.js
│   │   │       ├── AfterHoursRule.js
│   │   │       ├── ExcessiveRefundRule.js
│   │   │       └── HighValueVoidRule.js
│   │   │
│   │   ├── investigations/
│   │   │   ├── investigationModel.js
│   │   │   ├── investigationService.js
│   │   │   └── investigationController.js
│   │   │
│   │   └── ai/
│   │       └── geminiService.js
│   │
│   ├── workers/
│   │   └── ingestWorker.js
│   │
│   └── server.js

This is the target architecture, not something to create all at
once.

DAY 1 --- 🟢 MAKE THE DATA PIPELINE RELIABLE

Step 1 --- server.js

Status: DONE ✅

The missing AppError import was fixed.

Do not modify this file again unless a genuine dependency later requires
it.

Step 2 --- Environment configuration

Verify .env contains:

PORT
MONGO_URI

REDIS_HOST
REDIS_PORT

GEMINI_API_KEY

NODE_ENV
LOG_LEVEL

.gitignore should contain:

.env
uploads/
node_modules/

Goal

No secrets committed to GitHub.

Step 3 --- Database

Review:

config/db.js

Goal:

Application
    ↓
connectDB()
    ↓
MongoDB

Verify:

connection works

error handling works

logging works

Do not redesign it.

Step 4 --- Queue

Review:

config/queue.js

Understand:

API
 ↓
ingestQueue.add()
 ↓
Redis
 ↓
waiting job

Keep:

attempts: 3
exponential backoff

These are good engineering decisions.

Step 5 --- Upload middleware

Review:

middleware/uploadMiddleware.js

Verify:

CSV only
50 MB limit
uploads/

No fancy file validation is necessary.

Step 6 --- Ingestion API

Review:

ingestRoutes.js
ingestController.js
ingestService.js

Final flow:

POST /ingest/dataset
        ↓
Multer
        ↓
Controller
        ↓
Service
        ↓
Generate uploadId
        ↓
Create Dataset
        ↓
Queue job
        ↓
202 Accepted

The API must not wait for the CSV to finish processing.

Step 7 --- Dataset model

Create a simple Dataset model:

Dataset
──────────────
uploadId
originalName
status
processedCount
totalRecords
error
createdAt
completedAt

Status:

QUEUED
PROCESSING
COMPLETED
FAILED

This lets the frontend understand asynchronous processing.

Step 8 --- Worker

Review:

workers/ingestWorker.js

Target:

BullMQ Job
     ↓
Read CSV stream
     ↓
Normalize
     ↓
Batch 500
     ↓
MongoDB
     ↓
Update processedCount
     ↓
Dataset COMPLETED

Also ensure:

Success

delete temporary CSV

Failure

delete temporary CSV
Dataset → FAILED

Make sure retries don't corrupt the dataset.

Step 9 --- CSV normalization

Keep:

csvNormalizer.js

Responsibility:

Raw CSV
   ↓
normalized MongoDB document

Examples:

"refund"
    ↓
"REFUND"

"120"
    ↓
120

"2026-08-20..."
    ↓
Date

Do not put investigation logic here.

Step 10 --- Event model

The current event model is broadly good.

Keep:

uploadId
transactionId
employeeId
employeeName
storeId
registerId
timestamp
eventType
productId
productName
category
quantity
unitPrice
totalAmount
paymentMethod
approvalStatus
approvedBy
reason
customerId

The unique index:

uploadId + transactionId

is useful for dataset-level idempotency.

🏁 DAY 1 FINISH CONDITION

This must work:

Upload CSV
     ↓
202 Accepted
     ↓
Dataset = QUEUED
     ↓
BullMQ
     ↓
Redis
     ↓
Worker
     ↓
CSV streamed
     ↓
MongoDB
     ↓
Dataset = COMPLETED

If this works, Day 1 is successful.

Do not start the fancy frontend yet.

DAY 2 --- 🔴 BUILD DEFICO'S BRAIN

Step 11 --- Baseline analysis

Use:

baselineAnalyzer.js

The baseline determines what is normal.

Example:

Store normally has:
10 refunds/day

Current dataset:
34 refunds/day

Then:

34 / 10 = 3.4× normal

That's meaningful.

Step 12 --- Rule #1: Excessive Refunds

Concept:

Employee refund activity
        ↓
Compare against baseline
        ↓
Deviation detected
        ↓
Finding

Example:

Employee: E102
Refunds: 18
Store average: 5

Deviation: 3.6×

Finding:

Refund activity is significantly higher than the store's normal
pattern.

Step 13 --- Rule #2: After-hours activity

Use the existing idea:

11 PM → 6 AM

Detect:

events during unusual hours

Finding:

14 transactions occurred during the store's low-activity period.

Step 14 --- Rule #3: High-value voids

Example:

Normal void:
₹200–₹500

Transaction:
₹5,800 VOID

Finding:

A high-value void was detected significantly above the typical
transaction amount.

Step 15 --- Rule engine

Create:

investigationEngine.js

Concept:

Dataset
   ↓
Run Rule 1
   ↓
Run Rule 2
   ↓
Run Rule 3
   ↓
Collect findings

Each rule should produce structured output such as:

{
    ruleId,
    ruleName,
    severity,
    score,
    potentialLoss,
    evidence
}

Step 16 --- Risk score

Combine rule signals.

Example:

After-hours       +20
Excessive refunds +35
High-value void   +25
                   ───
                    80

Result:

Investigation Risk Score: 80

Important:

This is not an 80% probability of fraud.

It is:

A rule-based score used to prioritize investigation.

Step 17 --- Potential loss

Do not say:

Confirmed fraud loss = ₹15,000.

Instead use:

Potential associated loss

or

Estimated financial impact

An anomaly does not prove fraud.

Step 18 --- Evidence

Every finding needs evidence.

Example:

Finding
  ↓
Rule triggered
  ↓
Evidence IDs
  ↓
MongoDB events

Example UI:

Why was this flagged?

Refund activity was 3.4× higher
than the store baseline.

Evidence

TX-10482
₹1,250
REFUND
11:42 PM

TX-10503
₹2,100
REFUND
12:18 AM

TX-10541
₹1,850
REFUND
12:32 AM

This is what makes the application feel intelligent.

Step 19 --- Investigation Case

Create:

InvestigationCase
────────────────────
uploadId
status
riskScore
potentialLoss
findings
evidence
summary
aiExplanation
createdAt

Then:

Dataset
   ↓
Investigation
   ↓
InvestigationCase

Now the analysis is persistent.

🏁 DAY 2 FINISH CONDITION

A CSV must produce:

Dataset
 ↓
Findings
 ↓
Risk Score
 ↓
Potential Financial Impact
 ↓
Evidence
 ↓
Investigation Case

At this point:

The backend brain is finished.

DAY 2 / 3 --- 🤖 GEMINI

Step 20 --- Gemini service

Gemini receives only structured facts.

Example:

Risk score: 82

Finding:
Excessive refund activity

Baseline:
5 refunds/day

Observed:
18 refunds/day

Potential associated loss:
₹12,450

Evidence:
TX001
TX002
TX003

Step 21 --- Strict AI prompt

The AI must:

Use only supplied facts.

Do not invent:
- transactions
- amounts
- employees
- dates
- causes
- evidence

Do not claim fraud as confirmed.

Explain the findings in plain language.

Desired output:

Executive Summary

We found unusually high refund activity
compared with this store's normal pattern.

The dataset contains 18 refunds compared
with a typical baseline of 5.

This does not prove fraudulent activity,
but the pattern is worth reviewing.

Potential associated financial impact:
₹12,450.

DAY 3 --- 🎨 FRONTEND

Step 22 --- Design direction

Use a dark, Claude-inspired direction:

Deep charcoal background
Warm off-white text
Subtle borders
Muted surfaces
Restrained accent
Clear typography

Do not clone Claude.

Defico needs its own identity.

Step 23 --- Do NOT make StaffOS 2.0

Avoid:

Top navbar
↓
KPI cards
↓
Charts
↓
Charts
↓
Tables

Instead make Defico feel like an investigation workspace.

Step 24 --- Upload page

Keep it simple:

DEFICO AI

Understand where your business
may be losing money.

Upload your transaction data.

┌──────────────────────────────┐
│                              │
│       Drop CSV here          │
│                              │
│       or browse files        │
│                              │
└──────────────────────────────┘

Maximum file size: 50 MB

[ Analyze dataset ]

Step 25 --- Processing page

Show the pipeline:

Analyzing your dataset

✓ File received
✓ Data validated
✓ Transactions processed
● Investigating unusual activity
○ Preparing findings

This makes your asynchronous architecture visible to the user.

Step 26 --- Analysis page

Instead of generic KPI cards:

Analysis complete

We found 3 areas worth reviewing.

────────────────────────────

Unusual refund activity
HIGH ATTENTION

Refund activity is 3.4× higher
than the store's normal pattern.

₹12,450 potential impact

[ Understand finding ]

────────────────────────────

After-hours activity
REVIEW

14 transactions occurred
between 11 PM and 6 AM.

[ Review evidence ]

────────────────────────────

High-value voids
REVIEW

4 unusually large voids
were detected.

[ Review evidence ]

Step 27 --- Investigation detail page

Example:

← Back to analysis

UNUSUAL REFUND ACTIVITY

Why we noticed this
────────────────────

Your store normally processes
around 5 refunds during this period.

We observed 18.

That's approximately 3.6× the normal level.

Potential associated impact
₹12,450

────────────────────

Evidence

Transaction   Amount   Time
TX-001        ₹1,250   11:42 PM
TX-002        ₹2,100   12:18 AM
TX-003        ₹1,850   12:32 AM

────────────────────

What this means

[ Gemini explanation ]

The user should understand the result without technical knowledge.

Step 28 --- Charts

Charts are allowed only when they answer a question.

Good:

"When did unusual activity happen?"

→ timeline.

Good:

"Which employees generated the most flagged events?"

→ comparison.

Bad:

"We need a chart because dashboards need charts."

No.

Step 29 --- Empty/error states

No file

Upload a CSV to begin your analysis.

Invalid CSV

We couldn't understand this file.
Check that it contains the required transaction columns.

Processing

We're still analyzing your dataset.

Failed

We couldn't complete this analysis.
Please try the dataset again.

No findings

No unusual patterns were detected.

Your dataset did not contain activity
that crossed our investigation thresholds.

Do not force suspicious findings.

30. 🔌 FINAL API PLAN

Keep the API small.

Upload

POST /ingest/dataset

Dataset status

GET /datasets/:uploadId

Investigation

GET /investigations/:uploadId

Optional evidence

GET /investigations/:uploadId/evidence

That's enough.

31. 🧪 TESTING PLAN

Test the critical path rather than building a huge test suite.

Test 1

Valid CSV:

Upload
→ Queue
→ Worker
→ MongoDB

Test 2

Invalid CSV.

Test 3

Empty CSV.

Test 4

Duplicate transaction.

Test 5

Large-ish CSV.

Test 6

Worker failure.

Test 7

Investigation rules.

Test 8

Gemini failure.

Test 9

Frontend processing.

Test 10

No findings.

32. 📦 DEMO DATASET

Create one believable grocery-store CSV containing:

Normal sales
Normal refunds
Some returns
Some voids
Some damage
Some after-hours activity
Some suspicious refund patterns
Some high-value voids

Not everything should be suspicious.

We want:

Normal activity
+
Interesting anomalies

That makes the demo believable.

33. 📖 README

README should eventually explain:

Defico AI
↓
Problem
↓
Solution
↓
Architecture
↓
Data Pipeline
↓
Investigation Engine
↓
AI Boundary
↓
Tech Stack
↓
Screenshots
↓
How to run
↓
Demo

Especially include:

CSV
 ↓
Multer
 ↓
BullMQ
 ↓
Redis
 ↓
Worker
 ↓
MongoDB
 ↓
Investigation Engine
 ↓
Evidence
 ↓
Gemini
 ↓
Investigation Report

34. 🚀 DEPLOYMENT

Only after the local application works.

Target:

Frontend → Vercel
Backend → Render / suitable host
MongoDB → MongoDB Atlas
Redis → compatible hosted Redis

Do not spend hours fighting deployment before local functionality is
complete.

35. 🎯 FINAL DEMO STORY

When a recruiter opens Defico:

1. Product introduction

"This is an Inventory Loss Analyzer for small businesses."

2. Upload

grocery_store_transactions.csv

3. Processing

Processing...

4. Result

We found 3 areas worth reviewing.

5. Investigation

Unusual refund activity

6. Evidence

Normal: 5
Observed: 18
Deviation: 3.6×
Potential impact: ₹12,450

7. Transaction evidence

Show the actual records.

8. AI explanation

Explain the finding in simple language.

The entire product communicates:

What happened → Why it matters → What evidence supports it.

36. 🧑‍💻 INTERVIEW UNDERSTANDING CHECKLIST

By the end, you should confidently answer:

Why BullMQ?

Large CSV processing shouldn't block the HTTP request, so ingestion is
moved into a background worker.

Why Redis?

BullMQ uses Redis as the backing store for queue and job state.

Why streaming?

Loading an entire CSV into memory doesn't scale, so the worker
processes the file as a stream.

Why batch inserts?

Individual MongoDB inserts create unnecessary database overhead, so
events are accumulated and inserted in batches.

Why normalization?

Raw CSV data is inconsistent, so it is converted into a predictable
internal event schema before storage.

Why rules instead of AI?

Financial calculations and anomaly decisions need deterministic and
reproducible behavior.

Why Gemini?

Gemini turns verified findings into explanations that non-technical
users can understand.

Why evidence?

A finding without traceable records isn't useful for investigation.

Why Dataset status?

Processing is asynchronous, so the frontend needs a persistent way to
know whether the job is queued, processing, completed, or failed.

37. 🔒 DEFICO AI PROJECT RULES

╔══════════════════════════════════════╗
║       DEFICO AI — PROJECT RULES     ║
╚══════════════════════════════════════╝

1. Do NOT restart the project.

2. Do NOT replace the architecture.

3. Do NOT add unnecessary technologies.

4. Do NOT build a generic dashboard.

5. Do NOT build an inventory-management system.

6. Do NOT make Gemini responsible for financial truth.

7. Backend calculates.
   AI explains.

8. Every important finding needs evidence.

9. Risk score is a prioritization score,
   NOT probability of fraud.

10. Use "potential/estimated financial impact",
    not unverified "confirmed loss".

11. Prefer understandable UX over fancy UI.

12. Fix 🔴 critical issues.

13. Implement 🟡 required functionality.

14. Ignore 🟢 optional improvements until the
    project is finished.

15. Three-day deadline means:
    FINISH > PERFECTION.

16. Once a decision is locked,
    don't revisit it without a real blocker.

🏆 FINAL PRIORITY ORDER

If time becomes extremely tight:

                MUST WORK
                    │
                    ▼
             CSV Upload
                    │
                    ▼
            BullMQ + Worker
                    │
                    ▼
              MongoDB
                    │
                    ▼
           Investigation Rules
                    │
                    ▼
              Evidence
                    │
                    ▼
           Risk + Impact
                    │
                    ▼
          Investigation Case
                    │
                    ▼
             Gemini Report
                    │
                    ▼
             Good Frontend
                    │
                    ▼
              Polish / README

Never sacrifice the core pipeline to add a fancy feature.

🚦 CURRENT PROJECT STATUS

Completed foundation

Project structure ✅

MongoDB connection ✅

Redis connection configuration ✅

BullMQ queue ✅

Multer upload ✅

CSV normalizer ✅

Event model ✅

Ingestion controller/service/routes ✅

Worker foundation ✅

Logging ✅

Error handling foundation ✅

server.js AppError bug fixed ✅

Remaining

Day 1

Environment initialization check

Dataset model/status

Stabilize worker

Verify complete ingestion pipeline

Day 2

Baseline

3 rules

Investigation engine

Risk

Potential impact

Evidence

InvestigationCase

Gemini

Day 3

API completion

Frontend

UX

Testing

README

Demo dataset

Deployment/presentation

🧭 OUR WORKING ORDER

We will work in this exact dependency order:

queue
  ↓
upload
  ↓
service
  ↓
worker
  ↓
dataset
  ↓
engine
  ↓
investigation
  ↓
AI
  ↓
frontend

For every file review:

🔴 A --- Must fix: real bug, broken logic, security/data
problem.

🟡 B --- Required: needed for the final Defico workflow.

🟢 C --- Optional: improvement we intentionally postpone.

Do not turn every review into a redesign.

The goal is:

FINISH → VERIFY → POLISH → DEMO

not:

PERFECT → REFACTOR → RESTART → GET STUCK