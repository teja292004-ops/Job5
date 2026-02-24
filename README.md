# Job Notification Tracker

A smart job tracking application with intelligent preference-based matching and filtering.

## Features

### 1. Preferences Logic (/settings)
- **Role Keywords**: Comma-separated text input for job role matching
- **Preferred Locations**: Multi-select dropdown for location preferences
- **Preferred Work Mode**: Checkboxes for Remote, Hybrid, Onsite
- **Experience Level**: Dropdown for Entry, Mid, Senior
- **Skills**: Comma-separated text input for skill matching
- **Minimum Match Score**: Slider (0-100, default 40)

All preferences are saved to `localStorage` as `jobTrackerPreferences` and automatically loaded on page refresh.

### 2. Match Score Engine

The match score is calculated using these exact rules:

- **+25 points**: Any roleKeyword appears in job.title (case-insensitive)
- **+15 points**: Any roleKeyword appears in job.description
- **+15 points**: job.location matches preferredLocations
- **+10 points**: job.mode matches preferredMode
- **+10 points**: job.experience matches experienceLevel
- **+15 points**: Any overlap between job.skills and user.skills
- **+5 points**: postedDaysAgo <= 2
- **+5 points**: source is LinkedIn
- **Maximum**: Score capped at 100

### 3. Match Score Display

Match scores are displayed as badges on job cards:
- **80-100**: Green (Excellent match)
- **60-79**: Amber (Good match)
- **40-59**: Blue (Fair match)
- **<40**: Grey (Low match)

### 4. "Show Only Matches" Toggle

Located in the dashboard header. When enabled:
- Filters jobs where matchScore >= minMatchScore (from preferences)
- Works in combination with other filters

### 5. Filter Bar Logic

All filters use AND logic:
- **Keyword Search**: Searches title, description, and company
- **Location Filter**: Exact location match
- **Mode Filter**: Remote, Hybrid, or Onsite
- **Experience Filter**: Entry, Mid, or Senior
- **Source Filter**: LinkedIn, Indeed, or Glassdoor

### 6. Sorting Options

- **Latest**: Sort by postedDaysAgo (ascending)
- **Match Score**: Sort by matchScore (descending)
- **Salary**: Extract numeric value and sort (descending)

### 7. Edge Cases

- **No preferences set**: Banner displays "Set your preferences to activate intelligent matching"
- **No matches found**: Premium empty state with message "No roles match your criteria. Adjust filters or lower threshold"

## How to Use

1. Open `index.html` in your browser
2. Navigate to Settings and configure your preferences
3. Return to Dashboard to see jobs with match scores
4. Use filters and toggle to refine results

## Match Score Calculation Example

**User Preferences:**
- Role Keywords: "developer, frontend"
- Preferred Locations: "San Francisco", "Remote"
- Preferred Mode: "Remote"
- Experience Level: "Senior"
- Skills: "JavaScript, React, TypeScript"
- Min Match Score: 40

**Job Example:**
- Title: "Senior Frontend Developer"
- Location: "San Francisco"
- Mode: "Remote"
- Experience: "Senior"
- Skills: ["JavaScript", "React", "TypeScript", "CSS"]
- Posted: 1 day ago
- Source: "LinkedIn"

**Score Breakdown:**
- Title match ("frontend", "developer"): +25
- Description match: +15 (if keywords in description)
- Location match ("San Francisco"): +15
- Mode match ("Remote"): +10
- Experience match ("Senior"): +10
- Skills match (JavaScript, React, TypeScript): +15
- Posted <= 2 days: +5
- LinkedIn source: +5
- **Total: 100** (capped)

## Verification Steps

1. **Set preferences:**
   - Role Keywords: "developer"
   - Locations: "San Francisco", "Remote"
   - Mode: Remote
   - Experience: Senior
   - Skills: "JavaScript, React"
   - Min Score: 60

2. **Expected behavior:**
   - Jobs matching criteria show high scores (80-100)
   - Toggle "Show only matches" filters to scores >= 60
   - Filters combine with AND logic
   - Sorting works correctly

3. **Test edge cases:**
   - Clear localStorage and reload → banner appears
   - Apply filters with no results → empty state shows
   - Change sort order → list reorders correctly

## Technical Implementation

- Pure vanilla JavaScript (no frameworks)
- localStorage for persistence
- Responsive design
- No external dependencies
- Clean, maintainable code structure
