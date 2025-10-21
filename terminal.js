// Interactive Terminal Interface
class InteractiveTerminal {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.commandHistory = [];
        this.historyIndex = -1;
        this.data = null;
        
        this.init();
        this.loadData();
    }
    
    async loadData() {
        try {
            const response = await fetch('data.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }
    
    init() {
        this.container.innerHTML = `
            <div class="terminal-output" id="terminal-output">
                <div class="terminal-line">
                    <span class="terminal-prompt">root@portfolio:~$</span> Welcome to the interactive terminal!
                </div>
                <div class="terminal-line">Type <span class="terminal-command">help</span> to see available commands.</div>
                <div class="terminal-line"></div>
            </div>
            <div class="terminal-input-line">
                <span class="terminal-prompt">root@portfolio:~$</span>
                <input type="text" class="terminal-input" id="terminal-input" autocomplete="off" spellcheck="false" />
            </div>
        `;
        
        this.output = document.getElementById('terminal-output');
        this.input = document.getElementById('terminal-input');
        
        this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.input.focus();
        
        // Refocus input when clicking anywhere in terminal
        this.container.addEventListener('click', () => this.input.focus());
    }
    
    handleKeyDown(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.commandHistory.push(command);
                this.historyIndex = this.commandHistory.length;
                this.executeCommand(command);
            }
            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.commandHistory[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.input.value = this.commandHistory[this.historyIndex];
            } else {
                this.historyIndex = this.commandHistory.length;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autocomplete();
        }
    }
    
    executeCommand(command) {
        const parts = command.toLowerCase().split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        
        this.printLine(`<span class="terminal-prompt">root@portfolio:~$</span> ${command}`);
        
        switch(cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'about':
                this.showAbout();
                break;
            case 'skills':
                this.showSkills();
                break;
            case 'projects':
                this.showProjects(args[0]);
                break;
            case 'ctf':
                this.showCTF();
                break;
            case 'articles':
                this.showArticles();
                break;
            case 'contact':
                this.showContact();
                break;
            case 'clear':
                this.clear();
                break;
            case 'whoami':
                this.printLine('root');
                break;
            case 'ls':
                this.printLine('about.html  projects.html  articles.html  videos.html  contact.html');
                break;
            case 'pwd':
                this.printLine('/home/portfolio');
                break;
            case 'date':
                this.printLine(new Date().toString());
                break;
            case 'echo':
                this.printLine(args.join(' '));
                break;
            case 'banner':
                this.showBanner();
                break;
            default:
                this.printLine(`Command not found: ${cmd}. Type 'help' for available commands.`);
        }
        
        this.printLine('');
    }
    
    showHelp() {
        const commands = [
            { cmd: 'help', desc: 'Display this help message' },
            { cmd: 'about', desc: 'Show information about me' },
            { cmd: 'skills', desc: 'List my technical skills' },
            { cmd: 'projects [number]', desc: 'Show projects (optional: specific project number)' },
            { cmd: 'ctf', desc: 'Display CTF achievements' },
            { cmd: 'articles', desc: 'List recent articles' },
            { cmd: 'contact', desc: 'Show contact information' },
            { cmd: 'clear', desc: 'Clear the terminal screen' },
            { cmd: 'banner', desc: 'Display ASCII banner' },
            { cmd: 'ls', desc: 'List files' },
            { cmd: 'pwd', desc: 'Print working directory' },
            { cmd: 'whoami', desc: 'Display current user' },
            { cmd: 'date', desc: 'Show current date and time' },
            { cmd: 'echo [text]', desc: 'Print text to terminal' }
        ];
        
        this.printLine('<span class="terminal-success">Available Commands:</span>');
        this.printLine('');
        commands.forEach(({ cmd, desc }) => {
            this.printLine(`  <span class="terminal-command">${cmd.padEnd(20)}</span> ${desc}`);
        });
    }
    
    showAbout() {
        if (this.data && this.data.about) {
            this.printLine('<span class="terminal-success">[+] About Me:</span>');
            this.printLine('');
            this.printLine(this.data.about);
        } else {
            this.printLine('Loading data...');
        }
    }
    
    showSkills() {
        if (this.data && this.data.skills) {
            this.printLine('<span class="terminal-success">[+] Technical Skills:</span>');
            this.printLine('');
            
            const columns = 3;
            const skillsPerColumn = Math.ceil(this.data.skills.length / columns);
            
            for (let i = 0; i < skillsPerColumn; i++) {
                let line = '';
                for (let col = 0; col < columns; col++) {
                    const index = i + (col * skillsPerColumn);
                    if (index < this.data.skills.length) {
                        line += `  • ${this.data.skills[index]}`.padEnd(30);
                    }
                }
                this.printLine(line);
            }
        } else {
            this.printLine('Loading data...');
        }
    }
    
    showProjects(number) {
        if (this.data && this.data.projects) {
            if (number && !isNaN(number)) {
                const index = parseInt(number) - 1;
                if (index >= 0 && index < this.data.projects.length) {
                    const project = this.data.projects[index];
                    this.printLine(`<span class="terminal-success">[+] Project ${number}: ${project.title}</span>`);
                    this.printLine('');
                    this.printLine(`<span class="terminal-info">Description:</span> ${project.description}`);
                    if (project.link) {
                        this.printLine(`<span class="terminal-info">Link:</span> ${project.link}`);
                    }
                } else {
                    this.printLine(`Project ${number} not found. Available: 1-${this.data.projects.length}`);
                }
            } else {
                this.printLine('<span class="terminal-success">[+] Projects:</span>');
                this.printLine('');
                this.data.projects.forEach((project, index) => {
                    this.printLine(`  ${index + 1}. <span class="terminal-command">${project.title}</span>`);
                    this.printLine(`     ${project.description.substring(0, 80)}...`);
                    this.printLine('');
                });
                this.printLine('Tip: Use "projects [number]" for detailed view');
            }
        } else {
            this.printLine('Loading data...');
        }
    }
    
    showCTF() {
        if (this.data && this.data.ctf) {
            this.printLine('<span class="terminal-success">[+] CTF Achievements:</span>');
            this.printLine('');
            this.data.ctf.forEach((achievement, index) => {
                this.printLine(`  [${achievement.date}] <span class="terminal-command">${achievement.event}</span>`);
                this.printLine(`  Rank: ${achievement.rank}`);
                this.printLine(`  ${achievement.description}`);
                this.printLine('');
            });
        } else {
            this.printLine('Loading data...');
        }
    }
    
    showArticles() {
        if (this.data && this.data.articles) {
            this.printLine('<span class="terminal-success">[+] Recent Articles:</span>');
            this.printLine('');
            this.data.articles.slice(0, 5).forEach((article, index) => {
                this.printLine(`  ${index + 1}. <span class="terminal-command">${article.title}</span>`);
                this.printLine(`     ${article.date} • ${article.readTime}`);
                this.printLine(`     ${article.link}`);
                this.printLine('');
            });
        } else {
            this.printLine('Loading data...');
        }
    }
    
    showContact() {
        if (this.data && this.data.contact) {
            this.printLine('<span class="terminal-success">[+] Contact Information:</span>');
            this.printLine('');
            Object.entries(this.data.contact).forEach(([key, value]) => {
                this.printLine(`  <span class="terminal-info">${key.toUpperCase()}:</span> ${value}`);
            });
        } else {
            this.printLine('Loading data...');
        }
    }
    
    showBanner() {
        const banner = `
   ▄████████ ▄██   ▄   ▀█████████▄     ▄████████    ▄████████ 
  ███    ███ ███   ██▄   ███    ███   ███    ███   ███    ███ 
  ███    █▀  ███▄▄▄███   ███    ███   ███    █▀    ███    ███ 
  ███        ▀▀▀▀▀▀███  ▄███▄▄▄██▀   ▄███▄▄▄      ▄███▄▄▄▄██▀ 
  ███        ▄██   ███ ▀▀███▀▀▀██▄  ▀▀███▀▀▀     ▀▀███▀▀▀▀▀   
  ███    █▄  ███   ███   ███    ██▄   ███    █▄  ▀███████████ 
  ███    ███ ███   ███   ███    ███   ███    ███   ███    ███ 
  ████████▀   ▀█████▀  ▄█████████▀    ██████████   ███    ███ 
                                                    ███    ███ 
        CYBERSECURITY PORTFOLIO - INTERACTIVE TERMINAL
        `;
        this.printLine(`<span class="terminal-success">${banner}</span>`);
    }
    
    clear() {
        this.output.innerHTML = '';
    }
    
    printLine(text) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = text;
        this.output.appendChild(line);
        this.output.scrollTop = this.output.scrollHeight;
    }
    
    autocomplete() {
        const commands = ['help', 'about', 'skills', 'projects', 'ctf', 'articles', 'contact', 'clear', 'banner', 'ls', 'pwd', 'whoami', 'date', 'echo'];
        const input = this.input.value.toLowerCase();
        
        const matches = commands.filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            this.printLine(`<span class="terminal-prompt">root@portfolio:~$</span> ${input}`);
            this.printLine(matches.join('  '));
            this.printLine('');
        }
    }
}

// Initialize terminal if container exists
document.addEventListener('DOMContentLoaded', () => {
    const terminalContainer = document.getElementById('interactive-terminal');
    if (terminalContainer) {
        new InteractiveTerminal('interactive-terminal');
    }
});