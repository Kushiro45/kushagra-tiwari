// Dynamic content loading for index.html
document.addEventListener('DOMContentLoaded', () => {
    const featuredContainer = document.getElementById('featured-content');
    
    if (featuredContainer) {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                // Clear existing content
                featuredContainer.innerHTML = '';
                
                // Load featured items if they exist
                if (data.featured && data.featured.length > 0) {
                    data.featured.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'card';
                        card.innerHTML = `
                            <div class="card-meta">${item.category} • ${item.meta}</div>
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        `;
                        featuredContainer.appendChild(card);
                    });
                } else {
                    // Fallback: Show first 3 items from projects, ctf, and articles
                    const featured = [];
                    
                    if (data.projects && data.projects[0]) {
                        featured.push({
                            category: '[PROJECT]',
                            meta: 'RECENT',
                            title: data.projects[0].title,
                            description: data.projects[0].description
                        });
                    }
                    
                    if (data.ctf && data.ctf[0]) {
                        featured.push({
                            category: '[CTF]',
                            meta: data.ctf[0].rank,
                            title: data.ctf[0].event,
                            description: data.ctf[0].description
                        });
                    }
                    
                    if (data.articles && data.articles[0]) {
                        featured.push({
                            category: '[ARTICLE]',
                            meta: 'NEW',
                            title: data.articles[0].title,
                            description: data.articles[0].excerpt
                        });
                    }
                    
                    featured.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'card';
                        card.innerHTML = `
                            <div class="card-meta">${item.category} • ${item.meta}</div>
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        `;
                        featuredContainer.appendChild(card);
                    });
                }
                
                // Observe cards for animation
                document.querySelectorAll('#featured-content .card').forEach(el => {
                    if (typeof observer !== 'undefined') {
                        observer.observe(el);
                    }
                });
            })
            .catch(error => {
                console.error('Error loading featured content:', error);
            });
    }
});