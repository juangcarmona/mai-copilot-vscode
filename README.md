# MAI Copilot for VSCode

**MAI Copilot** is a Visual Studio Code extension designed to integrate the MAI Copilot API, empowering developers with AI-driven code suggestions and enhanced workflows. **Your AI, your rules.**

---

## Getting Started

### Prerequisites

- **Visual Studio Code** version 1.82.0 or higher.
- **Node.js** version 16 or higher.
- [MAI Copilot API credentials](#configuration).

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/juangcarmona/mai-copilot-vscode.git
   cd mai-copilot-vscode
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Launch the extension in a new VSCode instance:
   ```bash
   code .
   ```
   Then press `F5` to start debugging.

---

## Features

- **AI-Powered Suggestions**: Real-time code suggestions tailored to your coding context.
- **Customizable Models**: Easily switch between supported models such as Starcoder, CodeLlama, and others.
- **Workspace Insights**: Log workspace and active file details for better context management.
- **User Personalization**: Customize prompts, model configurations, and more through settings.

---

## Configuration

MAI Copilot offers a range of customizable settings:

- **API Token**: Required for authentication.
- **Endpoint URL**: Set the base URL for the MAI Copilot API.
- **Auto Suggestion**: Enable or disable automatic suggestions.

### Example Configuration
Add the following settings in your `settings.json`:

```json
{
  "maiCopilot.apiToken": "your-api-token",
  "maiCopilot.endpoint": "https://api.jgcarmona.com",
  "maiCopilot.enableAutoSuggest": true
}
```

---

## Development Workflow

### Building and Watching

1. Install the esbuild problem matcher for better debugging:
   ```bash
   code --install-extension connor4312.esbuild-problem-matchers
   ```

2. Run the build task in VSCode:
   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
   - Select **Run Task** and choose `esbuild`.

   This will automatically rebuild the extension and output logs/errors in the terminal.

### Debugging

1. Configure the extension to launch in a specific folder:
   Edit `.vscode/launch.json` and set your desired `workspaceFolder`.

2. Start debugging:
   Press `F5` to launch the extension in a new VSCode instance.

### Testing

Run unit tests:
```bash
npm run test
```

---

## Roadmap

1. **Initialization Enhancements**:
   - Refactor the initialization process for better dependency management.
2. **Extended User Customization**:
   - Add settings for prompt templates, folder structures, and model-specific options.
3. **Advanced Debugging**:
   - Streamline debugging workflows and add more developer tools.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions, issues, or feedback:

- **Author**: Juan G. Carmona
- **GitHub**: [juangcarmona](https://github.com/juangcarmona)
- **Website**: [jgcarmona.com](https://jgcarmona.com)
