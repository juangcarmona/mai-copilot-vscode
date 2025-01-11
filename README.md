# MAI Copilot for VSCode
> [!IMPORTANT]
> 🚧 **Work in Progress**: This extension is under active development and may not work as expected. Use at your own risk! 🚧

---

## **About the Project**

**MAI Copilot** aims to be a lightweight and efficient VSCode extension to assist developers with contextual AI-driven features, such as:

- Real-time code completion.
- Context-aware AI chat.
- Commit message generation based on pending changes.

The primary goal is to leverage project and file-level information directly from your workspace to enhance the quality of AI prompts and outputs. This includes insights like:

- Current file and cursor position.
- Recently modified files.
- Project structure and relevant metadata.

**Your AI, your rules.** Build your workflow around what works best for you.

---

## **Getting Started**

### **Prerequisites**

- Visual Studio Code version 1.82.0 or higher.
- Node.js version 16 or higher.

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/juangcarmona/mai-copilot-vscode.git
   cd mai-copilot-vscode
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the extension in a new VSCode instance:
   ```bash
   code .
   ```
   Then press `F5` to start debugging.

---

## **Core Features**

1. **Contextual AI Suggestions**
   - Understand the project context (open files, recent edits, etc.) to generate tailored code suggestions.

2. **Chat with Context** *(Planned)*
   - Have AI-powered discussions directly in VSCode, using workspace and project data for better responses.

3. **Commit Message Generator** *(Planned)*
   - Generate meaningful commit messages by analyzing changes in your project.

4. **Logs and Insights** *(In Progress)*
   - Use a `.mai` folder in the workspace to store:
     - Recent file activity.
     - Project metadata.
     - Temporary logs for AI request optimization.

---

## **File System Design**

The extension uses a `.mai` folder in the workspace to maintain:

- **Logs**: Stored in `.mai/logs/events.log` to track file events and workspace activities.
- **Settings**: Default configuration saved in `.mai/settings.json`.
- **Metadata**: Includes project structure and recent activity insights.

This design ensures better context handling and user control without cluttering the main workspace.

---

## **Roadmap**

- [ ] **Basic Functionality**: Code completion and contextual suggestions.
- [ ] **Workspace Insights**: Better parsing of project structure and activity logs.
- [ ] **Chat Integration**: Enable AI chat features within VSCode.
- [ ] **Extended Customization**: Allow users to define prompt templates and AI behavior.
- [ ] **Hugging Face API Support** *(Potential Feature)*: Integrate with Hugging Face models for advanced users.

---

## **Contributing**

Contributions are welcome! To get started:

1. Fork this repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Contact**

For questions or feedback:

- **Author**: Juan G. Carmona
- **GitHub**: [juangcarmona](https://github.com/juangcarmona)
- **Website**: [jgcarmona.com](https://jgcarmona.com)
