class AndroidConsole extends HTMLElement {
  constructor() {
    super();
    // Cria um shadow DOM para isolar o componente
    this.attachShadow({ mode: "open" });
    
    // Criação do elemento <style> com os estilos isolados
    const style = document.createElement("style");
    style.textContent = `
      .container {
        width: 100%;
        max-width: 600px;
        background-color: #1e1e1e;
        border: 2px solid #00FF00;
        border-radius: 8px;
        box-shadow: 0 0 15px rgba(0,255,0,0.5);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: monospace;
      }
      .console-output {
        height: 300px;
        padding: 10px;
        overflow-y: auto;
        font-size: 16px;
        border-bottom: 1px solid #00FF00;
        color: #00FF00;
        background-color: #1e1e1e;
      }
      .console-input {
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        background-color: #1e1e1e;
        border: none;
        outline: none;
        font-size: 16px;
        color: #00FF00;
        font-family: monospace;
      }
      .line.command {
        font-weight: bold;
      }
      .line.error {
        color: #FF4500;
      }
    `;
    
    // Criação do container principal
    const container = document.createElement("div");
    container.classList.add("container");

    // Criação da área de saída do console
    this.consoleOutput = document.createElement("div");
    this.consoleOutput.classList.add("console-output");
    container.appendChild(this.consoleOutput);

    // Criação do campo de input para comandos
    this.input = document.createElement("input");
    this.input.classList.add("console-input");
    this.input.setAttribute("placeholder", "Digite um comando...");
    container.appendChild(this.input);

    // Anexa os elementos ao shadow DOM
    this.shadowRoot.append(style, container);

    // Vincula o listener para tratar os comandos na tecla Enter
    this.input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const command = this.input.value.trim();
        if (command !== "") {
          this.writeToConsole("> " + command, "command");
          this.handleCommand(command);
          this.input.value = "";
        }
      }
    });
    
    // Mensagens de boas-vindas
    this.writeToConsole("Bem-vindo ao Console Android!", "default");
    this.writeToConsole("Digite 'help' para ver os comandos disponíveis.", "default");
  }
  
  // Função para escrever linhas no console
  writeToConsole(text, type = "default") {
    const line = document.createElement("div");
    line.textContent = text;
    line.classList.add("line");
    if (type === "command") {
      line.classList.add("command");
    } else if (type === "error") {
      line.classList.add("error");
    }
    this.consoleOutput.appendChild(line);
    this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
  }
  
  // Função que processa os comandos digitados
  handleCommand(command) {
    const args = command.split(" ");
    const cmd = args[0].toLowerCase();
    switch (cmd) {
      case "help":
        this.writeToConsole("Comandos disponíveis:", "default");
        this.writeToConsole("help                - Exibe este menu.", "default");
        this.writeToConsole("clear               - Limpa o console.", "default");
        this.writeToConsole("sobre               - Informações sobre este console.", "default");
        this.writeToConsole("data                - Mostra data e hora atuais.", "default");
        this.writeToConsole("soma [a] [b]        - Soma dois números.", "default");
        this.writeToConsole("multiplicar [a] [b] - Multiplica dois números.", "default");
        break;
      case "clear":
        this.consoleOutput.innerHTML = "";
        break;
      case "sobre":
        this.writeToConsole("Console Android 2.0 feito totalmente em JavaScript.", "default");
        break;
      case "data":
        this.writeToConsole("Data e hora atuais: " + new Date().toLocaleString(), "default");
        break;
      case "soma":
        if (args.length === 3) {
          let num1 = parseFloat(args[1]);
          let num2 = parseFloat(args[2]);
          if (!isNaN(num1) && !isNaN(num2)) {
            this.writeToConsole("Resultado: " + (num1 + num2), "default");
          } else {
            this.writeToConsole("Erro: Parâmetros inválidos. Use números.", "error");
          }
        } else {
          this.writeToConsole("Uso: soma [num1] [num2]", "error");
        }
        break;
      case "multiplicar":
        if (args.length === 3) {
          let num1 = parseFloat(args[1]);
          let num2 = parseFloat(args[2]);
          if (!isNaN(num1) && !isNaN(num2)) {
            this.writeToConsole("Resultado: " + (num1 * num2), "default");
          } else {
            this.writeToConsole("Erro: Parâmetros inválidos. Use números.", "error");
          }
        } else {
          this.writeToConsole("Uso: multiplicar [num1] [num2]", "error");
        }
        break;
      default:
        this.writeToConsole("Comando desconhecido: " + command, "error");
        break;
    }
  }
}

customElements.define("android-console", AndroidConsole);
export default AndroidConsole;

// ----- Captura global de erros e warnings -----
(function() {
  // Captura erros globais
  window.addEventListener("error", (event) => {
    const message = event.message || "Erro desconhecido";
    document.querySelectorAll("android-console").forEach(consoleElement => {
      if (typeof consoleElement.writeToConsole === 'function') {
        consoleElement.writeToConsole("Erro: " + message, "error");
      }
    });
  });

  // Captura rejeições não tratadas (promises)
  window.addEventListener("unhandledrejection", (event) => {
    const message = event.reason ? event.reason.toString() : "Rejeição sem tratamento";
    document.querySelectorAll("android-console").forEach(consoleElement => {
      if (typeof consoleElement.writeToConsole === 'function') {
        consoleElement.writeToConsole("Erro (rejeição): " + message, "error");
      }
    });
  });

  // Sobrescreve console.error para redirecionar para o componente
  const originalConsoleError = console.error;
  console.error = function(...args) {
    originalConsoleError.apply(console, args);
    const message = args.join(" ");
    document.querySelectorAll("android-console").forEach(consoleElement => {
      if (typeof consoleElement.writeToConsole === 'function') {
        consoleElement.writeToConsole("Console.error: " + message, "error");
      }
    });
  };

  // Sobrescreve console.warn para redirecionar para o componente
  const originalConsoleWarn = console.warn;
  console.warn = function(...args) {
    originalConsoleWarn.apply(console, args);
    const message = args.join(" ");
    document.querySelectorAll("android-console").forEach(consoleElement => {
      if (typeof consoleElement.writeToConsole === 'function') {
        consoleElement.writeToConsole("Console.warn: " + message, "error");
      }
    });
  };
})();