I've been using GitHub copilot with VS Code to create PBIs and user stories for my project. It's been a great help in both generating the structure of the PBI and creating the GitHub issue.

I used several iterations of this to refine the process.

## Iteration 0: Full Manual Process

## Iteration 1: Manual Prompt to generate a PBI description

I started off with a generic prompt like this:

```prompt
You are a Scrum Product Owner. Your task is to create a clear and concise PBI with sufficient information for developers to implement it.

The PBI should include the following:

Title: Create a PBI title. The title must start with 🐛 Bug - if it's a bug, or ✨ (just the emoji, no extra words) if it's a feature or change.
Description: Create a PBI description.
Acceptance Criteria: unordered list of the Acceptance Criteria.
Dev Notes: Any important implementation notes for the developer. 
Reproduce Steps: If it's a bug, list the steps to reproduce it. If not, skip this section.

The acceptance criteria should always include:
- Meets [Definition of Done]({DEFINITION_OF_DONE_URL})

Tasks:
{TASKS}
```

## Iteration 2: Generating PBIs Using GitHub MCP Server

This iteration involved using the GitHub MCP server to generate PBIs directly. I created a custom prompt that would allow me to specify the type of PBI (bug or feature) and the tasks associated with it.

```prompt
You are a Scrum Product Owner. Your task is to create a clear and concise PBI with sufficient information for developers to implement it.

The PBI should include the following:

Title: Create a PBI title. The title must start with 🐛 Bug - if it's a bug, or ✨ (just the emoji, no extra words) if it's a feature or change.
Description: Create a PBI description.
Acceptance Criteria: unordered list of the Acceptance Criteria.
Dev Notes: Any important implementation notes for the developer. 
Reproduce Steps: If it's a bug, list the steps to reproduce it. If not, skip this section.

The acceptance criteria should always include:
- Meets [Definition of Done]({DEFINITION_OF_DONE_URL})

Tasks:
{TASKS}

The response should always be in markdown.

Title should be a H2 heading (e.g. ## Title). All other sections should be H3 headings (e.g. ### Description)

create this PBI in {REPO_NAME} repo in {ORG_NAME} organisation.

Add only a GitHub label of "{LABEL}"

Do not include the title in the Github Issue Description

Give me a short summary including the URL of the created PBI when finished

When generating the PBI, reference the [copilot-instructions.md]({REPO_COPILOT_INSTRUCTIONS}) for any additional information you may need about the project.
```

Not only will this generate a PBI, but it will also create a GitHub issue in the specified repository with the necessary labels and formatting.

When running this from the repo Copilot can also draw on your copilot instructions to help it generate the PBI.

## Iteration 3: Github Prompt files

The issue with iteration 3 is that I had to store my prompt template where I could access it easily. I had to keep copying it Copilot Chat and manually changing the right sections as needed.

GitHub copilot has a feature called 'prompt files' that allows you to store prompts in a file and reference them easily. This is a great way to manage your prompts without having to copy and paste them every time.

By storing the prompt in the repo, we can now replace many of the placeholders with specifics that will apply to the repo we are working in.

```prompt
You are a Scrum Product Owner. Your task is to create a clear and concise PBI with sufficient information for developers to implement it.

The PBI should include the following:

Title: Create a PBI title. The title must start with 🐛 Bug - if it's a bug, or ✨ (just the emoji, no extra words) if it's a feature or change.
Description: Create a PBI description.
Acceptance Criteria: unordered list of the Acceptance Criteria.
Dev Notes: Any important implementation notes for the developer. 
Reproduce Steps: If it's a bug, list the steps to reproduce it. If not, skip this section.

The acceptance criteria should always include:
- Meets [Definition of Done](./docs/definition-of-done.md)

The response should always be in markdown.

Title should be a H2 heading (e.g. ## Title). All other sections should be H3 headings (e.g. ### Description)

create this PBI in Northwind repo in SSW organisation.

Add only a GitHub label of "Needs Refinement"

Do not include the title in the Github Issue Description

Give me a short summary including the URL of the created PBI when finished

When generating the PBI, reference the [copilot-instructions.md](../copilot-instructions.md) for any additional information you may need about the project.

Ask any questions you need to clarify the requirements before creating the PBI.
```

Another modification to this prompt is the last sentence: `Ask any questions you need to clarify the requirements before creating the PBI`. This clarifying quesion allows Copilot to start a conversation to refine the requirements and fill in any gaps before creating the PBI. Super powerful!
