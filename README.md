# THE WORKING AI

USE THE IMAGE AS DESIGN EXAMPLE                                                    BUILT ME AN APP WITH THE FOLLOWING:"Build a single-page SaaS dashboard named 'THE WORKERS AI' using React and Tailwind CSS. Design a clean sidebar navigation on the left with the app title 'THE WORKERS AI' at the top and links to 5 main tools: 1. Smart Email Generator, 2. Meeting Notes Summarizer, 3. AI Task Planner, 4. AI Research Assistant, 5. AI Chatbot. The main content section must dynamically switch views based on the active sidebar selection.

UI/UX Requirements: - Clean, modern, responsive SaaS design with slate/indigo color palette. - Input sections on the left, rendered output cards on the right for each tool. - All generated AI outputs must be editable in place and feature a 'Copy to Clipboard' button. - Include a subtle, persistent 'Responsible AI Disclaimer' footer on every tab stating: 'AI outputs are generated algorithmically and should be reviewed for accuracy before professional use.'

Feature Requirements: 1. Email Generator: Inputs for recipient, topic/key points, and a Tone selector (Formal, Friendly, Persuasive). 2. Meeting Summarizer: Text area input for raw meeting notes, output divided into three distinct structured cards: 'Key Summary', 'Action Items & Owners', and 'Decisions & Deadlines'. 3. AI Task Planner: Inputs for goals and working hours. Output renders a prioritized daily time-blocked schedule with priority badges (High, Medium, Low). 4. AI Research Assistant: Topic input with depth toggle (Brief Overview vs Deep Dive). Output structured with 'Executive Summary', 'Key Insights', and 'Actionable Recommendations'. 5. AI Chatbot: Interactive chat UI feed with quick-prompt suggestion chips."

2. Core System & Prompt Engineering Templates

Use these system prompts inside your app logic:

Smart Email Generator Prompt:

Plaintext

You are an executive communications assistant for THE WORKERS AI. Draft a professional email based on these inputs:
- Recipient: {recipient}
- Tone: {formal | friendly | persuasive}
- Core Points: {key_points}

Format output strictly as:
Subject Line: [Insert Clear Subject]
Body: [Insert Email Body]
Call to Action: [Insert Clear Next Step]


Meeting Notes Summarizer Prompt:

Plaintext

You are an AI meeting assistant for THE WORKERS AI. Analyze the raw meeting notes below and output structured cards:
Raw Notes: {raw_notes}

Required Sections:
1. Executive Summary (2-3 concise sentences)
2. Action Items & Assignees (Bulleted list with names)
3. Decisions & Deadlines (Bullet list with specific dates)


AI Task Planner Prompt:

Plaintext

You are a productivity coach for THE WORKERS AI. Convert the following tasks into an optimized daily schedule:
- Task List & Goals: {tasks}
- Shift Duration: {hours}

Output a time-blocked schedule featuring: Time Slot, Task Name, Priority Badge (High/Medium/Low), and Estimated Duration. Group high-cognitive tasks in peak energy hours.


3. GitHub Repository README.md Content

Copy and paste this formatted code block into your GitHub README.md:

Markdown

# THE WORKERS AI

An all-in-one SaaS platform built to automate everyday corporate workflows, optimize scheduling, and synthesize meeting data using targeted generative AI tools.

## 🚀 Key Features

* **Smart Email Generator:** Instantly craft professional, targeted emails across custom tones (Formal, Friendly, Persuasive).
* **Meeting Notes Summarizer:** Transform unstructured meeting notes into actionable insights, key decisions, and assigned tasks.
* **AI Task Planner:** Auto-generate prioritized, time-blocked daily and weekly work schedules.
* **AI Research Assistant:** Condense topics into executive summaries, insights, and tactical recommendations.
* **AI Chatbot Interface:** Interactive assistant equipped with context-aware prompt templates for real-time workplace help.

## 🛠️ Tools & Tech Stack

* **Frontend:** React, Tailwind CSS, Lucide Icons
* **Prototyping & Layout:** Lovable AI
* **Language Model:** OpenAI API (GPT-4o) / ChatGPT System Prompts
* **Version Control:** GitHub

## ⚙️ Setup & Installation Instructions

1. Clone the repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/THE-WORKERS-AI.git](https://github.com/YOUR_USERNAME/THE-WORKERS-AI.git)


Navigate to the project directory:

Bash

cd THE-WORKERS-AI


Install dependencies:

Bash

npm install


Set up environment variables: Create a .env file in the root directory and add your API key:

Code snippet

VITE_OPENAI_API_KEY=your_openai_api_key_here


Run the application locally:

Bash

npm run dev


⚖️ Responsible AI Policy

This application utilizes artificial intelligence to generate text, schedules, and summaries.

Human Oversight: AI outputs can contain errors or hallucinations. Users must review and verify critical outputs before sending or publishing.

Data Privacy: Do not input sensitive corporate credentials, personal identity numbers, or confidential financial records into the prompt interfaces.                 NAME THE APP:  THE WORKING AI  ABBREVIATION:TWA

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9974a339-7b83-4503-a067-84ea219120a0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
