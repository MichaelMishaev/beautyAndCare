🤔 What is Spec-Driven Development?
Spec-Driven Development flips the script on traditional software development. For decades, code has been king — specifications were just scaffolding we built and discarded once the "real work" of coding began. Spec-Driven Development changes this: specifications become executable, directly generating working implementations rather than just guiding them.

⚡ Get started
1. Install Specify
Initialize your project depending on the coding agent you're using:

uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>
2. Create the spec
Use the /specify command to describe what you want to build. Focus on the what and why, not the tech stack.

/specify Build an application that can help me organize my photos in separate photo albums. Albums are grouped by date and can be re-organized by dragging and dropping on the main page. Albums are never in other nested albums. Within each album, photos are previewed in a tile-like interface.
3. Create a technical implementation plan
Use the /plan command to provide your tech stack and architecture choices.

/plan The application uses Vite with minimal number of libraries. Use vanilla HTML, CSS, and JavaScript as much as possible. Images are not uploaded anywhere and metadata is stored in a local SQLite database.
4. Break down and implement
Use /tasks to create an actionable task list, then ask your agent to implement the feature.

For detailed step-by-step instructions, see our comprehensive guide.

📚 Core philosophy
Spec-Driven Development is a structured process that emphasizes:

Intent-driven development where specifications define the "what" before the "how"
Rich specification creation using guardrails and organizational principles
Multi-step refinement rather than one-shot code generation from prompts
Heavy reliance on advanced AI model capabilities for specification interpretation
🌟 Development phases
Phase	Focus	Key Activities
0-to-1 Development ("Greenfield")	Generate from scratch	
Start with high-level requirements
Generate specifications
Plan implementation steps
Build production-ready applications
Creative Exploration	Parallel implementations	
Explore diverse solutions
Support multiple technology stacks & architectures
Experiment with UX patterns
Iterative Enhancement ("Brownfield")	Brownfield modernization	
Add features iteratively
Modernize legacy systems
Adapt processes
🎯 Experimental goals
Our research and experimentation focus on:

Technology independence
Create applications using diverse technology stacks
Validate the hypothesis that Spec-Driven Development is a process not tied to specific technologies, programming languages, or frameworks
Enterprise constraints
Demonstrate mission-critical application development
Incorporate organizational constraints (cloud providers, tech stacks, engineering practices)
Support enterprise design systems and compliance requirements
User-centric development
Build applications for different user cohorts and preferences
Support various development approaches (from vibe-coding to AI-native development)
Creative & iterative processes
Validate the concept of parallel implementation exploration
Provide robust iterative feature development workflows
Extend processes to handle upgrades and modernization tasks
🔧 Prerequisites
Linux/macOS (or WSL2 on Windows)
AI coding agent: Claude Code, GitHub Copilot, or Gemini CLI
uv for package management
Python 3.11+
Git
📖 Learn more
Complete Spec-Driven Development Methodology - Deep dive into the full process
Detailed Walkthrough - Step-by-step implementation guide
📋 Detailed process
Click to expand the detailed step-by-step walkthrough
🔍 Troubleshooting
Git Credential Manager on Linux
If you're having issues with Git authentication on Linux, you can install Git Credential Manager:

#!/usr/bin/env bash
set -e
echo "Downloading Git Credential Manager v2.6.1..."
wget https://github.com/git-ecosystem/git-credential-manager/releases/download/v2.6.1/gcm-linux_amd64.2.6.1.deb
echo "Installing Git Credential Manager..."
sudo dpkg -i gcm-linux_amd64.2.6.1.deb
echo "Configuring Git to use GCM..."
git config --global credential.helper manager
echo "Cleaning up..."
rm gcm-linux_amd64.2.6.1.deb
👥 Maintainers
Den Delimarsky (@localden)
John Lam (@jflam)
💬 Support
For support, please open a GitHub issue. We welcome bug reports, feature requests, and questions about using Spec-Driven Development.

🙏 Acknowledgements
This project is heavily influenced by and based on the work and research of John Lam.

📄 License
This project is licensed under the terms of the MIT open source license. Please refer to the LICENSE file for the full terms.