import React, { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  GraduationCap,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const initialSubjects = [
  { id: 1, code: "CS301", name: "Data Structures & Algorithms", mse: 25, ese: 61 },
  { id: 2, code: "CS302", name: "Database Management Systems", mse: 27, ese: 64 },
  { id: 3, code: "CS303", name: "Operating Systems", mse: 22, ese: 58 },
  { id: 4, code: "CS304", name: "Web Technology", mse: 28, ese: 66 },
];

function formatMark(mark) {
  return Number.isInteger(mark) ? mark : mark.toFixed(1);
}

function App() {
  const [subjects, setSubjects] = useState(initialSubjects);

  const summary = useMemo(() => {
    const earned = subjects.reduce((total, subject) => total + subject.mse + subject.ese, 0);
    const maximum = subjects.length * 100;
    return {
      earned,
      maximum,
      percentage: maximum ? (earned / maximum) * 100 : 0,
    };
  }, [subjects]);

  function updateMark(id, field, value, max) {
    if (value !== "" && (!Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > max)) {
      return;
    }

    setSubjects((current) =>
      current.map((subject) =>
        subject.id === id ? { ...subject, [field]: value === "" ? "" : Number(value) } : subject,
      ),
    );
  }

  function resetResults() {
    setSubjects(initialSubjects);
  }

  function downloadResult() {
    const rows = [
      ["Subject code", "Subject", "MSE (30)", "ESE (70)", "Total (100)"],
      ...subjects.map(({ code, name, mse, ese }) => [code, name, mse, ese, Number(mse) + Number(ese)]),
      ["", "Semester total", "", "", summary.earned],
      ["", "Semester average", "", "", `${summary.percentage.toFixed(1)}%`],
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = "vit-semester-result.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="VIT result home">
          <span className="brand-mark"><GraduationCap size={21} strokeWidth={2.2} /></span>
          <span className="brand-name">VIT<span>RESULTS</span></span>
        </a>
        <div className="topbar-right">
          <span className="term-label"><span className="status-dot" /> Semester 1 · 2026</span>
          <button className="profile-button" aria-label="Student profile">NN</button>
        </div>
      </header>

      <section className="page-content">
        <div className="breadcrumb"><span>Student portal</span><span className="crumb-slash">/</span><strong>Semester result</strong></div>

        <section className="welcome-row">
          <div>
            <div className="eyebrow"><Sparkles size={14} /> YOUR ACADEMIC OVERVIEW</div>
            <h1>Semester result<span className="heading-period">.</span></h1>
            <p className="intro">A clear view of your performance, all in one place.</p>
          </div>
          <button className="term-select" type="button" aria-label="Selected semester">
            <span className="term-select-icon"><BookOpen size={16} /></span>
            <span><small>ACADEMIC TERM</small><strong>Semester 1, 2026</strong></span>
            <ChevronDown size={16} className="select-chevron" />
          </button>
        </section>

        <section className="student-card" aria-label="Student information">
          <div className="student-avatar">NN</div>
          <div className="student-details">
            <span className="student-overline">STUDENT</span>
            <strong>Nikhil Nikalje</strong>
          </div>
          <div className="student-divider" />
          <div className="student-details prn-details">
            <span className="student-overline">PRN</span>
            <strong>422604</strong>
          </div>
          <div className="student-card-spacer" />
          <span className="record-badge"><Check size={13} strokeWidth={2.6} /> Result ready</span>
        </section>

        <section className="summary-grid" aria-label="Semester summary">
          <article className="summary-card score-summary">
            <div className="summary-topline"><span>SEMESTER TOTAL</span><span className="summary-icon lavender"><GraduationCap size={17} /></span></div>
            <div className="summary-number">{summary.earned}<span> / {summary.maximum}</span></div>
            <div className="summary-footnote"><span className="tiny-indicator" /> Across {subjects.length} subjects</div>
          </article>
          <article className="summary-card average-summary">
            <div className="summary-topline"><span>OVERALL AVERAGE</span><span className="summary-icon mint"><Sparkles size={16} /></span></div>
            <div className="summary-number">{summary.percentage.toFixed(1)}<span>%</span></div>
            <div className="average-track" aria-label={`Overall average ${summary.percentage.toFixed(1)} percent`}>
              <span style={{ width: `${summary.percentage}%` }} />
            </div>
          </article>
          <article className="summary-card subjects-summary">
            <div className="summary-topline"><span>SUBJECTS</span><span className="summary-icon peach"><BookOpen size={16} /></span></div>
            <div className="summary-number">{subjects.length}<span> / {subjects.length}</span></div>
            <div className="summary-footnote"><span className="completion-dot" /> Marks entered</div>
          </article>
        </section>

        <section className="results-section">
          <div className="section-heading">
            <div>
              <h2>Subject breakdown</h2>
              <p>Enter your marks to see your weighted results.</p>
            </div>
            <button type="button" className="download-button" onClick={downloadResult}>
              <ArrowDownToLine size={16} /> <span>Export result</span>
            </button>
          </div>

          <div className="results-card">
            <div className="table-heading">
              <span className="subject-column">SUBJECT</span>
              <span className="mark-column">MSE <i>30%</i></span>
              <span className="mark-column">ESE <i>70%</i></span>
              <span className="total-column">TOTAL <i>/ 100</i></span>
            </div>
            <div className="subject-list">
              {subjects.map((subject) => {
                const total = Number(subject.mse || 0) + Number(subject.ese || 0);
                return (
                  <article className="subject-row" key={subject.id}>
                    <div className="subject-info">
                      <span className="subject-icon"><BookOpen size={16} /></span>
                      <span className="subject-text"><strong>{subject.name}</strong><small>{subject.code}</small></span>
                    </div>
                    <div className="mark-entry">
                      <label className="visually-hidden" htmlFor={`mse-${subject.id}`}>{subject.name} MSE marks out of 30</label>
                      <input
                        id={`mse-${subject.id}`}
                        type="number"
                        min="0"
                        max="30"
                        step="1"
                        value={subject.mse}
                        onChange={(event) => updateMark(subject.id, "mse", event.target.value, 30)}
                      />
                      <span>/ 30</span>
                    </div>
                    <div className="mark-entry">
                      <label className="visually-hidden" htmlFor={`ese-${subject.id}`}>{subject.name} ESE marks out of 70</label>
                      <input
                        id={`ese-${subject.id}`}
                        type="number"
                        min="0"
                        max="70"
                        step="1"
                        value={subject.ese}
                        onChange={(event) => updateMark(subject.id, "ese", event.target.value, 70)}
                      />
                      <span>/ 70</span>
                    </div>
                    <div className="subject-total">
                      <strong>{formatMark(total)}</strong><span>/ 100</span>
                      <div className="row-track"><span style={{ width: `${total}%` }} /></div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="results-footer">
              <div className="weighting-note"><CircleHelp size={15} /><span>Final score = MSE marks (out of 30) + ESE marks (out of 70)</span></div>
              <button type="button" className="reset-button" onClick={resetResults}><RotateCcw size={14} /> Reset marks</button>
            </div>
          </div>
        </section>

        <footer className="page-footer">
          <span>Made for your academic journey <span className="footer-heart">✦</span></span>
          <span>Created by <strong>Nikhil Nikalje</strong><span className="footer-separator">·</span>PRN: <strong>422604</strong></span>
        </footer>
      </section>
    </main>
  );
}

export default App;
