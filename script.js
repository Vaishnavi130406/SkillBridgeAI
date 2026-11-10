
"use strict";

// ==========================================
// 1. CAREER DATA
// ==========================================

const careerData = {
  frontend: {
    name: "Frontend Developer",
    skills: [
      { id: "html", name: "HTML5" },
      { id: "css", name: "CSS3" },
      { id: "js", name: "JavaScript" },
      { id: "react", name: "React" },
      { id: "git", name: "Git & GitHub" },
      { id: "responsive", name: "Responsive Design" }
    ]
  },

  backend: {
    name: "Backend Developer",
    skills: [
      { id: "python", name: "Python" },
      { id: "sql", name: "SQL & Databases" },
      { id: "api", name: "REST APIs" },
      { id: "git", name: "Git & GitHub" },
      { id: "node", name: "Node.js" },
      { id: "security", name: "Backend Security" }
    ]
  },

  ai: {
    name: "AI / ML Engineer",
    skills: [
      { id: "python", name: "Python" },
      { id: "math", name: "Math & Statistics" },
      { id: "pandas", name: "Pandas & NumPy" },
      { id: "ml", name: "Machine Learning" },
      { id: "data", name: "Data Visualization" },
      { id: "git", name: "Git & GitHub" }
    ]
  },

  data: {
    name: "Data Analyst",
    skills: [
      { id: "excel", name: "Excel" },
      { id: "sql", name: "SQL & Databases" },
      { id: "python", name: "Python" },
      { id: "pandas", name: "Pandas & NumPy" },
      { id: "viz", name: "Power BI / Tableau" },
      { id: "stats", name: "Statistics" }
    ]
  }
};

// ==========================================
// 2. HTML ELEMENTS
// ==========================================

const roleSelect = document.getElementById("role");
const skillList = document.getElementById("skill-list");
const analyzeButton = document.getElementById("analyze-btn");
const results = document.getElementById("results");
const formError = document.getElementById("form-error");

const selectedSkills = new Set();

// ==========================================
// 3. LEARNING TOPICS
// ==========================================

const roadmapTopics = {
  html: [
    "HTML semantic elements",
    "Build a structured webpage"
  ],
  css: [
    "CSS layout and Flexbox",
    "Style a responsive page"
  ],
  js: [
    "JavaScript variables and functions",
    "Build a small interactive feature"
  ],
  react: [
    "React components and props",
    "Create a small React component"
  ],
  git: [
    "Git commits and branches",
    "Publish a practice project on GitHub"
  ],
  responsive: [
    "Responsive design and media queries",
    "Make a page work on mobile"
  ],
  python: [
    "Python fundamentals",
    "Solve three beginner coding problems"
  ],
  sql: [
    "SQL queries and filtering",
    "Practice SELECT and JOIN queries"
  ],
  api: [
    "HTTP methods and REST APIs",
    "Test a public practice API"
  ],
  node: [
    "Node.js and Express basics",
    "Create a small API endpoint"
  ],
  security: [
    "Input validation and secure coding",
    "Review common web vulnerabilities"
  ],
  math: [
    "Probability and statistics",
    "Practice mean, variance, and probability"
  ],
  pandas: [
    "DataFrames and data cleaning",
    "Analyze a small CSV dataset"
  ],
  ml: [
    "Supervised learning fundamentals",
    "Train a simple classification model"
  ],
  data: [
    "Charts and data storytelling",
    "Create a chart from a dataset"
  ],
  excel: [
    "Spreadsheet formulas and data cleaning",
    "Analyze a spreadsheet"
  ],
  viz: [
    "Dashboard and visualization basics",
    "Build a small interactive dashboard"
  ],
  stats: [
    "Descriptive statistics",
    "Summarize a dataset with key metrics"
  ]
};

// ==========================================
// 4. RENDER SKILLS
// ==========================================

function renderSkills() {
  if (!roleSelect || !skillList) return;

  const career = careerData[roleSelect.value];

  if (!career) {
    formError.textContent = "Please select a valid career.";
    return;
  }

  skillList.innerHTML = career.skills.map(skill => `
    <label class="skill-option">
      <input
        type="checkbox"
        value="${skill.id}"
        ${selectedSkills.has(skill.id) ? "checked" : ""}
      >
      <span>${skill.name}</span>
    </label>
  `).join("");

  if (formError) {
    formError.textContent = "";
  }
}

// ==========================================
// 5. GET SELECTED SKILLS
// ==========================================

function getSelectedSkills() {
  selectedSkills.clear();

  skillList
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach(input => {
      selectedSkills.add(input.value);
    });

  return selectedSkills;
}

// ==========================================
// 6. GENERATE SEVEN-DAY ROADMAP
// ==========================================

function makeRoadmap(missingSkills) {
  const plan = [];

  // Focus on up to four missing skills first.
  const firstMissing = missingSkills.slice(0, 4);

  firstMissing.forEach(skill => {
    const topics = roadmapTopics[skill.id];

    plan.push({
      title: `Learn ${skill.name}`,
      task: topics
        ? `${topics[0]}. Then ${topics[1].toLowerCase()}.`
        : `Study ${skill.name} and complete a practical exercise.`
    });
  });

  // Extra plans ensure the roadmap always has seven days.
  const remainingPlans = [
    {
      title: "Build a mini-project",
      task: "Create a small project using the skills you have learned."
    },
    {
      title: "Practice and troubleshoot",
      task: "Solve a practical problem, test your work, and fix errors."
    },
    {
      title: "Review your progress",
      task: "Revisit difficult concepts and write down what you learned."
    },
    {
      title: "Showcase your work",
      task: "Improve your project README and prepare a short demonstration."
    },
    {
      title: "Strengthen your fundamentals",
      task: "Review important concepts and explain them in your own words."
    },
    {
      title: "Explore a practical example",
      task: "Study a real-world example and try building your own version."
    },
    {
      title: "Plan your next steps",
      task: "Choose your next learning goal and a project to practise."
    }
  ];

  while (plan.length < 7) {
    const index = plan.length - firstMissing.length;
    const item = remainingPlans[index];

    plan.push({
      title: item.title,
      task: item.task
    });
  }

  return plan.map((item, index) => ({
    ...item,
    day: index + 1
  }));
}

// ==========================================
// 7. INTERACTIVE ROADMAP AND PROGRESS
// ==========================================

function renderInteractiveRoadmap(roadmap, roleKey, missingSkillIds) {
  const root = document.getElementById("interactive-roadmap-root");

  if (!root) return;

  // Progress is saved separately for each role and skill-gap plan.
  const storageKey =
    `skillbridge-progress-${roleKey}-${missingSkillIds || "all-selected"}`;

  let savedProgress = {};

  try {
    savedProgress = JSON.parse(
      localStorage.getItem(storageKey) || "{}"
    ) || {};
  } catch (error) {
    savedProgress = {};
  }

  root.innerHTML = `
    <section class="interactive-roadmap">
      <div class="roadmap-heading">
        <div>
          <h3>Your 7-Day Learning Roadmap</h3>
          <p class="roadmap-subtitle">
            Complete each task and track your learning progress.
          </p>
        </div>

        <strong id="roadmap-percent">0% Complete</strong>
      </div>

      <div
        class="roadmap-progress-track"
        role="progressbar"
        aria-label="Learning roadmap progress"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow="0"
      >
        <div class="roadmap-progress-fill"></div>
      </div>

      <div class="roadmap-progress-label">
        <span id="roadmap-count">0 of 7 days completed</span>
        <span id="roadmap-status">Keep going!</span>
      </div>

      <div id="roadmap-day-list"></div>

      <button type="button" class="roadmap-reset">
        Reset Progress
      </button>
    </section>
  `;

  const list = root.querySelector("#roadmap-day-list");

  roadmap.forEach(item => {
    const day = item.day;
    const completed = savedProgress[day] === true;

    const card = document.createElement("div");
    card.className = "roadmap-day";

    if (completed) {
      card.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `roadmap-${roleKey}-${day}`;
    checkbox.checked = completed;
    checkbox.setAttribute(
      "aria-label",
      `Mark day ${day} as completed`
    );

    const content = document.createElement("div");
    content.className = "roadmap-day-content";

    const title = document.createElement("div");
    title.className = "roadmap-day-title";
    title.textContent = `DAY ${day} — ${item.title}`;

    const description = document.createElement("div");
    description.className = "roadmap-day-task";
    description.textContent = item.task;

    content.append(title, description);
    card.append(checkbox, content);
    list.appendChild(card);

    checkbox.addEventListener("change", () => {
      savedProgress[day] = checkbox.checked;

      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify(savedProgress)
        );
      } catch (error) {
        console.warn("Progress could not be saved in this browser.");
      }

      card.classList.toggle("completed", checkbox.checked);
      updateProgress();
    });
  });

  function updateProgress() {
    const completedCount = list.querySelectorAll(
      'input[type="checkbox"]:checked'
    ).length;

    const percentage = Math.round((completedCount / 7) * 100);

    root.querySelector(".roadmap-progress-fill").style.width =
      `${percentage}%`;

    root.querySelector("#roadmap-percent").textContent =
      `${percentage}% Complete`;

    root.querySelector("#roadmap-count").textContent =
      `${completedCount} of 7 days completed`;

    root.querySelector(".roadmap-progress-track").setAttribute(
      "aria-valuenow",
      percentage
    );

    root.querySelector("#roadmap-status").textContent =
      percentage === 100
        ? "Roadmap completed!"
        : "Keep going!";
  }

  root.querySelector(".roadmap-reset").addEventListener("click", () => {
    if (!confirm("Reset progress for this learning roadmap?")) return;

    savedProgress = {};

    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn("Progress could not be cleared.");
    }

    list.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
      checkbox.closest(".roadmap-day").classList.remove("completed");
    });

    updateProgress();
  });

  updateProgress();
}

// ==========================================
// 8. DISPLAY ANALYSIS RESULTS
// ==========================================

function renderResults(career, matchedSkills, missingSkills, score) {
  if (!results) return;

  let status = "Your learning journey is underway";

  let advice =
    "Focus on your missing skills and build small projects to gain practical experience.";

  if (score === 100) {
    status = "Excellent skill coverage!";
    advice =
      "You selected every skill in this role's checklist. Strengthen your portfolio with projects and practical experience.";
  } else if (score >= 70) {
    status = "You're building strong foundations!";
    advice =
      "You have a strong match with this checklist. Focus on the remaining gaps and practical projects.";
  } else if (score >= 40) {
    status = "You're making progress!";
    advice =
      "You have some relevant skills. Prioritize the missing fundamentals, then practise them in a project.";
  }

  const matchedHTML = matchedSkills.length
    ? matchedSkills.map(skill =>
        `<span class="tag good">✓ ${skill.name}</span>`
      ).join("")
    : '<span class="tag neutral">No skills selected yet.</span>';

  const missingHTML = missingSkills.length
    ? missingSkills.map(skill =>
        `<span class="tag gap">+ ${skill.name}</span>`
      ).join("")
    : '<span class="tag good">All checklist skills selected</span>';

  const roadmap = makeRoadmap(missingSkills);

  results.innerHTML = `
    <div class="result-top">
      <div>
        <span class="eyebrow">YOUR PERSONAL REPORT</span>
        <h3>Your readiness snapshot</h3>
        <p>${career.name}</p>
      </div>

      <span class="role-pill">Career plan</span>
    </div>

    <div class="score-layout">
      <div
        class="score-ring"
        style="background: conic-gradient(#6254e8 ${score * 3.6}deg, #eeecff 0deg)"
      >
        <div>
          <div class="score-number">${score}<small>%</small></div>
          <div class="score-caption">SKILL MATCH</div>
        </div>
      </div>

      <div class="score-copy">
        <strong>${status}</strong>
        <p>${advice}</p>
      </div>
    </div>

    <div class="result-stats">
      <div class="result-stat good">
        <strong>${matchedSkills.length}</strong>
        <span>Skills matched</span>
      </div>

      <div class="result-stat gap">
        <strong>${missingSkills.length}</strong>
        <span>Skills to develop</span>
      </div>
    </div>

    <h4 class="subheading"><span>✓</span> Skills you selected</h4>
    <div class="tag-list">${matchedHTML}</div>

    <h4 class="subheading"><span>↗</span> Skills to focus on</h4>
    <div class="tag-list">${missingHTML}</div>

    <div id="interactive-roadmap-root"></div>

    <p class="result-note">
      This is an estimated match against a predefined skill checklist,
      not a measure of professional competence or a guarantee of employment.
      Learning suggestions are a starting point; adapt them to your goals.
    </p>
  `;

  const missingSkillIds = missingSkills
    .map(skill => skill.id)
    .join("-");

  renderInteractiveRoadmap(
    roadmap,
    roleSelect.value,
    missingSkillIds
  );

  results.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// ==========================================
// 9. EVENT LISTENERS
// ==========================================

if (roleSelect) {
  roleSelect.addEventListener("change", () => {
    selectedSkills.clear();
    renderSkills();
  });
}

if (skillList) {
  skillList.addEventListener("change", event => {
    if (event.target.matches('input[type="checkbox"]')) {
      getSelectedSkills();

      if (formError) {
        formError.textContent = "";
      }
    }
  });
}

if (analyzeButton) {
  analyzeButton.addEventListener("click", () => {
    const career = careerData[roleSelect.value];
    const selected = getSelectedSkills();

    if (selected.size === 0) {
      formError.textContent =
        "Please select at least one skill to analyze your results.";

      skillList.querySelector("input")?.focus();
      return;
    }

    const matchedSkills = career.skills.filter(skill =>
      selected.has(skill.id)
    );

    const missingSkills = career.skills.filter(skill =>
      !selected.has(skill.id)
    );

    const score = Math.round(
      (matchedSkills.length / career.skills.length) * 100
    );

    formError.textContent = "";

    renderResults(
      career,
      matchedSkills,
      missingSkills,
      score
    );
  });
}

// ==========================================
// 10. INITIALIZE THE WEBSITE
// ==========================================

renderSkills();
