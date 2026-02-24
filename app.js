// Mock job data
const mockJobs = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco",
        mode: "Remote",
        experience: "Senior",
        salary: "$120k-$160k",
        description: "We're looking for an experienced frontend developer to join our team. You'll work on cutting-edge web applications using React and TypeScript.",
        skills: ["JavaScript", "React", "TypeScript", "CSS"],
        source: "LinkedIn",
        postedDaysAgo: 1
    },
    {
        id: 2,
        title: "Full Stack Engineer",
        company: "StartupXYZ",
        location: "New York",
        mode: "Hybrid",
        experience: "Mid",
        salary: "$90k-$130k",
        description: "Join our growing team as a full stack engineer. Work with Node.js, React, and MongoDB to build scalable applications.",
        skills: ["JavaScript", "Node.js", "React", "MongoDB"],
        source: "Indeed",
        postedDaysAgo: 3
    },
    {
        id: 3,
        title: "React Developer",
        company: "Digital Solutions",
        location: "Remote",
        mode: "Remote",
        experience: "Mid",
        salary: "$100k-$140k",
        description: "Remote React developer position. Build modern web applications with React, Redux, and GraphQL.",
        skills: ["React", "Redux", "GraphQL", "JavaScript"],
        source: "LinkedIn",
        postedDaysAgo: 1
    },
    {
        id: 4,
        title: "Backend Developer",
        company: "CloudTech",
        location: "Austin",
        mode: "Onsite",
        experience: "Senior",
        salary: "$130k-$170k",
        description: "Senior backend developer needed for cloud infrastructure projects. Experience with Python, AWS, and microservices required.",
        skills: ["Python", "AWS", "Docker", "Kubernetes"],
        source: "Glassdoor",
        postedDaysAgo: 5
    },
    {
        id: 5,
        title: "Junior Frontend Developer",
        company: "WebAgency",
        location: "London",
        mode: "Hybrid",
        experience: "Entry",
        salary: "$50k-$70k",
        description: "Entry-level frontend developer position. Learn and grow with our experienced team while building client websites.",
        skills: ["HTML", "CSS", "JavaScript", "React"],
        source: "Indeed",
        postedDaysAgo: 2
    },
    {
        id: 6,
        title: "Software Engineer",
        company: "Enterprise Corp",
        location: "Seattle",
        mode: "Onsite",
        experience: "Mid",
        salary: "$110k-$150k",
        description: "Software engineer role focusing on enterprise applications. Work with Java, Spring Boot, and microservices architecture.",
        skills: ["Java", "Spring Boot", "SQL", "Microservices"],
        source: "LinkedIn",
        postedDaysAgo: 4
    },
    {
        id: 7,
        title: "DevOps Engineer",
        company: "InfraTech",
        location: "Berlin",
        mode: "Remote",
        experience: "Senior",
        salary: "$115k-$155k",
        description: "DevOps engineer to manage CI/CD pipelines and cloud infrastructure. Strong experience with AWS, Terraform, and Kubernetes required.",
        skills: ["AWS", "Terraform", "Kubernetes", "Docker"],
        source: "Glassdoor",
        postedDaysAgo: 2
    },
    {
        id: 8,
        title: "UI/UX Developer",
        company: "DesignHub",
        location: "San Francisco",
        mode: "Hybrid",
        experience: "Mid",
        salary: "$95k-$125k",
        description: "UI/UX developer to create beautiful and intuitive user interfaces. Experience with Figma, React, and modern CSS frameworks.",
        skills: ["React", "CSS", "Figma", "JavaScript"],
        source: "Indeed",
        postedDaysAgo: 1
    }
];

// State management
let preferences = null;
let currentFilters = {
    keyword: '',
    location: '',
    mode: '',
    experience: '',
    source: '',
    sortBy: 'latest',
    showOnlyMatches: false
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadPreferences();
    setupNavigation();
    setupFilters();
    setupSettings();
    renderJobs();
    populateLocationFilter();
});

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateToPage(page);
        });
    });
}

function navigateToPage(page) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.toggle('active', p.id === `${page}-page`);
    });
}

function navigateToSettings() {
    navigateToPage('settings');
}

// Load preferences from localStorage
function loadPreferences() {
    const saved = localStorage.getItem('jobTrackerPreferences');
    if (saved) {
        preferences = JSON.parse(saved);
        document.getElementById('preferenceBanner').classList.add('hidden');
    } else {
        document.getElementById('preferenceBanner').classList.remove('hidden');
    }
}

// Setup filters
function setupFilters() {
    document.getElementById('keywordSearch').addEventListener('input', (e) => {
        currentFilters.keyword = e.target.value.toLowerCase();
        renderJobs();
    });

    document.getElementById('locationFilter').addEventListener('change', (e) => {
        currentFilters.location = e.target.value;
        renderJobs();
    });

    document.getElementById('modeFilter').addEventListener('change', (e) => {
        currentFilters.mode = e.target.value;
        renderJobs();
    });

    document.getElementById('experienceFilter').addEventListener('change', (e) => {
        currentFilters.experience = e.target.value;
        renderJobs();
    });

    document.getElementById('sourceFilter').addEventListener('change', (e) => {
        currentFilters.source = e.target.value;
        renderJobs();
    });

    document.getElementById('sortBy').addEventListener('change', (e) => {
        currentFilters.sortBy = e.target.value;
        renderJobs();
    });

    document.getElementById('matchToggle').addEventListener('change', (e) => {
        currentFilters.showOnlyMatches = e.target.checked;
        renderJobs();
    });
}

// Populate location filter dynamically
function populateLocationFilter() {
    const locations = [...new Set(mockJobs.map(job => job.location))];
    const select = document.getElementById('locationFilter');
    locations.forEach(loc => {
        const option = document.createElement('option');
        option.value = loc;
        option.textContent = loc;
        select.appendChild(option);
    });
}

// Calculate match score
function calculateMatchScore(job) {
    if (!preferences) return 0;

    let score = 0;

    // +25 if any roleKeyword appears in job.title (case-insensitive)
    if (preferences.roleKeywords && preferences.roleKeywords.length > 0) {
        const titleLower = job.title.toLowerCase();
        if (preferences.roleKeywords.some(keyword => titleLower.includes(keyword.toLowerCase()))) {
            score += 25;
        }
    }

    // +15 if any roleKeyword appears in job.description
    if (preferences.roleKeywords && preferences.roleKeywords.length > 0) {
        const descLower = job.description.toLowerCase();
        if (preferences.roleKeywords.some(keyword => descLower.includes(keyword.toLowerCase()))) {
            score += 15;
        }
    }

    // +15 if job.location matches preferredLocations
    if (preferences.preferredLocations && preferences.preferredLocations.includes(job.location)) {
        score += 15;
    }

    // +10 if job.mode matches preferredMode
    if (preferences.preferredMode && preferences.preferredMode.includes(job.mode)) {
        score += 10;
    }

    // +10 if job.experience matches experienceLevel
    if (preferences.experienceLevel && job.experience === preferences.experienceLevel) {
        score += 10;
    }

    // +15 if overlap between job.skills and user.skills (any match)
    if (preferences.skills && preferences.skills.length > 0) {
        const hasSkillMatch = job.skills.some(jobSkill => 
            preferences.skills.some(userSkill => 
                jobSkill.toLowerCase() === userSkill.toLowerCase()
            )
        );
        if (hasSkillMatch) {
            score += 15;
        }
    }

    // +5 if postedDaysAgo <= 2
    if (job.postedDaysAgo <= 2) {
        score += 5;
    }

    // +5 if source is LinkedIn
    if (job.source === 'LinkedIn') {
        score += 5;
    }

    // Cap score at 100
    return Math.min(score, 100);
}

// Get match badge class
function getMatchBadgeClass(score) {
    if (score >= 80) return 'match-excellent';
    if (score >= 60) return 'match-good';
    if (score >= 40) return 'match-fair';
    return 'match-low';
}

// Filter and sort jobs
function filterAndSortJobs() {
    let filtered = mockJobs.map(job => ({
        ...job,
        matchScore: calculateMatchScore(job)
    }));

    // Apply filters (AND logic)
    if (currentFilters.keyword) {
        filtered = filtered.filter(job => 
            job.title.toLowerCase().includes(currentFilters.keyword) ||
            job.description.toLowerCase().includes(currentFilters.keyword) ||
            job.company.toLowerCase().includes(currentFilters.keyword)
        );
    }

    if (currentFilters.location) {
        filtered = filtered.filter(job => job.location === currentFilters.location);
    }

    if (currentFilters.mode) {
        filtered = filtered.filter(job => job.mode === currentFilters.mode);
    }

    if (currentFilters.experience) {
        filtered = filtered.filter(job => job.experience === currentFilters.experience);
    }

    if (currentFilters.source) {
        filtered = filtered.filter(job => job.source === currentFilters.source);
    }

    // Apply match threshold filter
    if (currentFilters.showOnlyMatches && preferences) {
        const threshold = preferences.minMatchScore || 40;
        filtered = filtered.filter(job => job.matchScore >= threshold);
    }

    // Sort
    switch (currentFilters.sortBy) {
        case 'latest':
            filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
            break;
        case 'matchScore':
            filtered.sort((a, b) => b.matchScore - a.matchScore);
            break;
        case 'salary':
            filtered.sort((a, b) => {
                const getSalaryNum = (str) => {
                    const match = str.match(/\$(\d+)k/);
                    return match ? parseInt(match[1]) : 0;
                };
                return getSalaryNum(b.salary) - getSalaryNum(a.salary);
            });
            break;
    }

    return filtered;
}

// Render jobs
function renderJobs() {
    const jobsList = document.getElementById('jobsList');
    const emptyState = document.getElementById('emptyState');
    const jobs = filterAndSortJobs();

    if (jobs.length === 0) {
        jobsList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    jobsList.innerHTML = jobs.map(job => `
        <div class="job-card">
            <div class="job-header">
                <div>
                    <h3 class="job-title">${job.title}</h3>
                    <p class="job-company">${job.company}</p>
                </div>
                ${preferences ? `<span class="match-badge ${getMatchBadgeClass(job.matchScore)}">${job.matchScore}%</span>` : ''}
            </div>
            
            <div class="job-meta">
                <span>📍 ${job.location}</span>
                <span>💼 ${job.mode}</span>
                <span>📊 ${job.experience}</span>
                <span>💰 ${job.salary}</span>
            </div>

            <p class="job-description">${job.description}</p>

            <div class="job-skills">
                ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>

            <div class="job-footer">
                <span class="job-source">via ${job.source}</span>
                <span class="job-posted">${job.postedDaysAgo} day${job.postedDaysAgo !== 1 ? 's' : ''} ago</span>
            </div>
        </div>
    `).join('');
}

// Setup settings form
function setupSettings() {
    const form = document.getElementById('preferencesForm');
    const scoreSlider = document.getElementById('minMatchScore');
    const scoreValue = document.getElementById('scoreValue');

    // Update score display
    scoreSlider.addEventListener('input', (e) => {
        scoreValue.textContent = e.target.value;
    });

    // Load saved preferences into form
    if (preferences) {
        if (preferences.roleKeywords) {
            document.getElementById('roleKeywords').value = preferences.roleKeywords.join(', ');
        }

        if (preferences.preferredLocations) {
            const select = document.getElementById('preferredLocations');
            Array.from(select.options).forEach(option => {
                option.selected = preferences.preferredLocations.includes(option.value);
            });
        }

        if (preferences.preferredMode) {
            document.querySelectorAll('input[name="preferredMode"]').forEach(checkbox => {
                checkbox.checked = preferences.preferredMode.includes(checkbox.value);
            });
        }

        if (preferences.experienceLevel) {
            document.getElementById('experienceLevel').value = preferences.experienceLevel;
        }

        if (preferences.skills) {
            document.getElementById('skills').value = preferences.skills.join(', ');
        }

        if (preferences.minMatchScore !== undefined) {
            scoreSlider.value = preferences.minMatchScore;
            scoreValue.textContent = preferences.minMatchScore;
        }
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const roleKeywords = document.getElementById('roleKeywords').value
            .split(',')
            .map(k => k.trim())
            .filter(k => k);

        const preferredLocations = Array.from(document.getElementById('preferredLocations').selectedOptions)
            .map(opt => opt.value);

        const preferredMode = Array.from(document.querySelectorAll('input[name="preferredMode"]:checked'))
            .map(cb => cb.value);

        const experienceLevel = document.getElementById('experienceLevel').value;

        const skills = document.getElementById('skills').value
            .split(',')
            .map(s => s.trim())
            .filter(s => s);

        const minMatchScore = parseInt(scoreSlider.value);

        preferences = {
            roleKeywords,
            preferredLocations,
            preferredMode,
            experienceLevel,
            skills,
            minMatchScore
        };

        localStorage.setItem('jobTrackerPreferences', JSON.stringify(preferences));

        alert('✅ Preferences saved successfully!');
        navigateToPage('dashboard');
        document.getElementById('preferenceBanner').classList.add('hidden');
        renderJobs();
    });
}
