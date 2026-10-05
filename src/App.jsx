import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchCourses } from "./api.js";
import { usePersistent } from "./storage.js";
import Quiz from "./Quiz.jsx";

function useRoute() {
  const parse = () =>
    window.location.hash.replace(/^#\/?/, "").split("?")[0].split("/").filter(Boolean);
  const [parts, setParts] = useState(parse);

  useEffect(() => {
    const onChange = () => setParts(parse());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return parts;
}

const navigate = (path) => {
  window.location.hash = path;
};

const percent = (done, total) => (total ? Math.round((done / total) * 100) : 0);

function Progress({ value, label }) {
  return (
    <div className="progress" role="progressbar" aria-label={label}
      aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
      <i style={{ width: value + "%" }} />
    </div>
  );
}

export default function App() {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState("");
  const [completed, setCompleted] = usePersistent("doit.completed", []);
  const [scores, setScores] = usePersistent("doit.scores", {});
  const [dark, setDark] = usePersistent(
    "doit.dark",
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );
  const [query, setQuery] = useState("");
  const route = useRoute();

  const loadCourses = useCallback(() => {
    setCourses(null);
    setError("");
    fetchCourses().then(setCourses).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const completedSet = useMemo(() => new Set(completed), [completed]);

  const getCourseProgress = (course) =>
    percent(
      course.lessons.filter((lesson) => completedSet.has(lesson.id)).length,
      course.lessons.length
    );

  const overallProgress = useMemo(() => {
    if (!courses) return 0;
    const lessons = courses.flatMap((course) => course.lessons);
    return percent(
      lessons.filter((lesson) => completedSet.has(lesson.id)).length,
      lessons.length
    );
  }, [courses, completedSet]);

  const toggleLesson = (lessonId) => {
    setCompleted((current) =>
      current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId]
    );
  };

  const setCourseCompleted = (course, value) => {
    setCompleted((current) => {
      const remaining = current.filter(
        (id) => !course.lessons.some((lesson) => lesson.id === id)
      );
      return value
        ? [...remaining, ...course.lessons.map((lesson) => lesson.id)]
        : remaining;
    });
  };

  const selectedCourse =
    courses && route[0] === "course"
      ? courses.find((course) => course.id === route[1])
      : null;

  let content;

  if (error) {
    content = (
      <section className="state" role="alert">
        <h2>Courses didn't load</h2>
        <p className="muted">{error}</p>
        <button className="btn primary" onClick={loadCourses}>Try again</button>
      </section>
    );
  } else if (!courses) {
    content = (
      <div className="grid" aria-busy="true">
        {[0, 1, 2, 3].map((item) => <div className="card skeleton" key={item} />)}
      </div>
    );
  } else if (route[0] === "course" && !selectedCourse) {
    content = (
      <section className="state">
        <h2>Course not found</h2>
        <button className="btn primary" onClick={() => navigate("/")}>See all courses</button>
      </section>
    );
  } else if (selectedCourse && route[2] === "quiz") {
    content = (
      <>
        <button className="link" onClick={() => navigate("/course/" + selectedCourse.id)}>
          Back to {selectedCourse.title}
        </button>
        <h1 className="title">{selectedCourse.title} quiz</h1>
        <Quiz
          course={selectedCourse}
          bestScore={scores[selectedCourse.id]}
          onFinish={(score) =>
            setScores((current) => ({
              ...current,
              [selectedCourse.id]: Math.max(current[selectedCourse.id] ?? 0, score)
            }))
          }
          onExit={() => navigate("/course/" + selectedCourse.id)}
        />
      </>
    );
  } else if (selectedCourse) {
    const courseProgress = getCourseProgress(selectedCourse);

    content = (
      <>
        <button className="link" onClick={() => navigate("/")}>All courses</button>
        <h1 className="title">{selectedCourse.title}</h1>
        <p className="lede">{selectedCourse.description}</p>

        <section className="panel">
          <div className="between row">
            <strong>{courseProgress}% complete</strong>
            <span className="muted">
              {selectedCourse.lessons.filter((lesson) => completedSet.has(lesson.id)).length}
              {" "}of{" "}{selectedCourse.lessons.length} lessons
            </span>
          </div>

          <Progress value={courseProgress} label={selectedCourse.title + " progress"} />

          <div className="row">
            <button
              className={"btn " + (courseProgress === 100 ? "" : "primary")}
              onClick={() => setCourseCompleted(selectedCourse, courseProgress !== 100)}
            >
              {courseProgress === 100 ? "Mark as not completed" : "Mark course as completed"}
            </button>

            <button className="btn" onClick={() => navigate("/course/" + selectedCourse.id + "/quiz")}>
              Take the quiz
            </button>
          </div>
        </section>

        <h2>Lessons</h2>
        <ul className="lessons">
          {selectedCourse.lessons.map((lesson) => {
            const done = completedSet.has(lesson.id);
            return (
              <li className={done ? "done" : ""} key={lesson.id}>
                <div>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.content}</p>
                </div>
                <button className="btn small" aria-pressed={done} onClick={() => toggleLesson(lesson.id)}>
                  {done ? "Completed" : "Mark complete"}
                </button>
              </li>
            );
          })}
        </ul>
      </>
    );
  } else {
    const filteredCourses = courses.filter((course) =>
      (course.title + " " + course.summary + " " + course.level)
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    content = (
      <>
        <h1 className="title">Learn by doing.</h1>
        <p className="lede">Pick a course, complete lessons, then test what you learned.</p>

        <section className="panel">
          <div className="between row">
            <strong>Overall progress</strong>
            <span className="muted">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} label="Overall learning progress" />
        </section>

        <input
          className="search"
          aria-label="Search courses"
          placeholder="Search courses..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {filteredCourses.length ? (
          <div className="grid">
            {filteredCourses.map((course) => {
              const courseProgress = getCourseProgress(course);
              return (
                <article className="card" key={course.id}>
                  <div className="between row">
                    <span className="tag">{course.level}</span>
                    <span className="tag">{course.minutes} min</span>
                  </div>

                  <h2>
                    <button className="link" onClick={() => navigate("/course/" + course.id)}>
                      {course.title}
                    </button>
                  </h2>

                  <p>{course.summary}</p>

                  <div className="between row">
                    <span className="muted">{courseProgress}% complete</span>
                    <span className="muted">{course.lessons.length} lessons</span>
                  </div>

                  <Progress value={courseProgress} label={course.title + " progress"} />

                  <div className="row">
                    <button className="btn primary small" onClick={() => navigate("/course/" + course.id)}>
                      Open course
                    </button>
                    <button className="btn small" onClick={() => navigate("/course/" + course.id + "/quiz")}>
                      Quiz
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <section className="state">
            <h2>No courses found</h2>
            <p className="muted">Try a different search term.</p>
          </section>
        )}
      </>
    );
  }

  return (
    <>
      <header className="top">
        <button className="brand" onClick={() => navigate("/")}>Doit</button>
        <button className="btn small" onClick={() => setDark((value) => !value)}>
          {dark ? "Light mode" : "Dark mode"}
        </button>
      </header>
      <main className="wrap">{content}</main>
    </>
  );
}
