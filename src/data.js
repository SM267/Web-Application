// Dummy course data. The API layer can be swapped for a real backend later.
const q = (text, options, answer) => ({ text, options, answer });

export const COURSES = [
  {
    id: "dsa", title: "Data Structures Essentials", level: "Beginner", minutes: 90,
    summary: "Arrays, stacks, queues and hash maps, and when to pick each.",
    description: "Build the mental toolkit behind most coding interviews. Each lesson pairs a core structure with the operations you will use every day.",
    lessons: [
      { id: "dsa-1", title: "Arrays and strings", content: "Arrays give O(1) index access but O(n) inserts in the middle. Two pointers and sliding windows turn many O(n²) loops into O(n)." },
      { id: "dsa-2", title: "Stacks and queues", content: "A stack is last-in-first-out and suits undo, parsing and DFS. A queue is first-in-first-out and suits scheduling and BFS." },
      { id: "dsa-3", title: "Hash maps", content: "Hash maps trade memory for speed: average O(1) lookup and insert. Collisions are handled by chaining or open addressing." },
    ],
    quiz: [
      q("Which structure is last-in-first-out?", ["Queue", "Stack", "Heap", "Graph"], 1),
      q("Average lookup time in a hash map?", ["O(1)", "O(log n)", "O(n)", "O(n²)"], 0),
      q("Which traversal usually uses a queue?", ["DFS", "Inorder", "BFS", "Postorder"], 2),
      q("Inserting in the middle of an array costs…", ["O(1)", "O(log n)", "O(n)", "O(1) amortised"], 2),
    ],
  },
  {
    id: "android", title: "Android with Jetpack Compose", level: "Intermediate", minutes: 120,
    summary: "Declarative UI, state and navigation for modern Android apps.",
    description: "Learn to build screens as functions of state. You will cover composables, state hoisting and navigation between screens.",
    lessons: [
      { id: "and-1", title: "Composable functions", content: "A composable describes UI for a given state. When state changes, Compose re-runs only the composables that read it." },
      { id: "and-2", title: "State and hoisting", content: "Keep state in the caller and pass values and callbacks down. This makes composables reusable and easy to test." },
      { id: "and-3", title: "Navigation", content: "A NavHost maps routes to composables. Pass ids as arguments and load data in a ViewModel." },
    ],
    quiz: [
      q("Compose UI is built with…", ["XML layouts", "Composable functions", "Fragments only", "Storyboards"], 1),
      q("State hoisting means…", ["Storing state globally", "Moving state to the caller", "Saving state to disk", "Deleting state"], 1),
      q("Which component maps routes to screens?", ["NavHost", "Scaffold", "Surface", "Modifier"], 0),
    ],
  },
  {
    id: "web", title: "Web Fundamentals", level: "Beginner", minutes: 75,
    summary: "HTML semantics, CSS layout and the browser event loop.",
    description: "A fast tour of how the web page you are reading works, from markup to layout to JavaScript.",
    lessons: [
      { id: "web-1", title: "Semantic HTML", content: "Use elements for meaning: nav, main, button, article. Screen readers and search engines rely on them." },
      { id: "web-2", title: "Flexbox and Grid", content: "Flexbox lays out in one dimension, Grid in two. Combine them with media queries for responsive pages." },
      { id: "web-3", title: "The event loop", content: "JavaScript runs on one thread. Promises and timers queue callbacks that run when the call stack is empty." },
    ],
    quiz: [
      q("Which element should trigger an action?", ["div", "span", "button", "section"], 2),
      q("CSS Grid lays out in…", ["One dimension", "Two dimensions", "Three dimensions", "No dimensions"], 1),
      q("JavaScript in the browser is…", ["Multi-threaded by default", "Single-threaded", "Compiled to Java", "Only async"], 1),
    ],
  },
  {
    id: "git", title: "Git and GitHub Workflow", level: "Beginner", minutes: 45,
    summary: "Commits, branches and pull requests that teammates enjoy reviewing.",
    description: "Write history that tells a story. Learn the branch-and-PR flow used by almost every team.",
    lessons: [
      { id: "git-1", title: "Commits that explain", content: "Make small commits with messages that say why. Future you will read them during a bug hunt." },
      { id: "git-2", title: "Branches and merging", content: "Branch per feature, merge via pull request, and keep main always deployable." },
    ],
    quiz: [
      q("A good commit message explains…", ["Only what changed", "Why it changed", "Who to blame", "Nothing"], 1),
      q("Which branch should stay deployable?", ["feature", "main", "temp", "stash"], 1),
    ],
  },
];