// Project Filtering System
class ProjectFilter {
    constructor() {
        this.projects = [];
        this.currentFilter = 'all';
        this.init();
    }
    
    async init() {
        await this.loadProjects();
        this.createFilterButtons();
        this.displayProjects();
    }
    
    async loadProjects() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            this.projects = data.projects.map(project => ({
                ...project,
                tags: project.tags || this.inferTags(project)
            }));
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }
    
    inferTags(project) {
        const tags = [];
        const text = (project.title + ' ' + project.description).toLowerCase();
        
        const tagMap = {
            'python': ['python'],
            'web': ['web', 'website', 'application', 'http', 'html', 'javascript'],
            'network': ['network', 'packet', 'traffic', 'scanning'],
            'security': ['security', 'vulnerability', 'pentest', 'penetration'],
            'ctf': ['ctf', 'capture the flag', 'challenge'],
            'crypto': ['cryptography', 'encryption', 'cipher'],
            'tool': ['tool', 'framework', 'scanner', 'analyzer'],
            'research': ['research', 'analysis', 'investigation']
        };
        
        for (const [tag, keywords] of Object.entries(tagMap)) {
            if (keywords.some(keyword => text.includes(keyword))) {
                tags.push(tag);
            }
        }
        
        return tags.length > 0 ? tags : ['other'];
    }
    
    getAllTags() {
        const tags = new Set();
        this.projects.forEach(project => {
            project.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }
    
    createFilterButtons() {
        const container = document.getElementById('filter-container');
        if (!container) return;
        
        const tags = this.getAllTags();
        
        container.innerHTML = `
            <span class="filter-label">Filter by:</span>
            <button class="filter-btn active" data-filter="all">All</button>
            ${tags.map(tag => `<button class="filter-btn" data-filter="${tag}">${this.capitalizeTag(tag)}</button>`).join('')}
        `;
        
        container.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    }
    
    capitalizeTag(tag) {
        const specialCases = {
            'ctf': 'CTF',
            'python': 'Python',
            'web': 'Web Security'
        };
        return specialCases[tag] || tag.charAt(0).toUpperCase() + tag.slice(1);
    }
    
    handleFilter(e) {
        const filter = e.target.dataset.filter;
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        this.displayProjects();
    }
    
    displayProjects() {
        const container = document.getElementById('projects-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        const filteredProjects = this.currentFilter === 'all' 
            ? this.projects 
            : this.projects.filter(project => project.tags.includes(this.currentFilter));
        
        if (filteredProjects.length === 0) {
            container.innerHTML = '<div class="card"><p>No projects found for this category.</p></div>';
            return;
        }
        
        filteredProjects.forEach(project => {
            const projectDiv = document.createElement('div');
            projectDiv.className = 'card';
            projectDiv.innerHTML = `
                <div class="card-meta">[PROJECT]</div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${this.capitalizeTag(tag)}</span>`).join('')}
                </div>
                ${project.link ? `<a href="${project.link}" target="_blank">View Project →</a>` : ''}
            `;
            container.appendChild(projectDiv);
        });
        
        // Trigger animations
        document.querySelectorAll('.card').forEach(el => {
            if (typeof observer !== 'undefined') {
                observer.observe(el);
            }
        });
    }
}

// Initialize on projects page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('filter-container')) {
        new ProjectFilter();
    }
});