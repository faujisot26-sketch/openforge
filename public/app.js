const form = document.querySelector("#issue-form");
const issueInput = document.querySelector("#issue-url");
const submitButton = document.querySelector("#submit-button");
const resultSection = document.querySelector("#result-section");
const errorMessage = document.querySelector("#error-message");
const planContent = document.querySelector("#plan-content");
const resultTitle = document.querySelector("#result-title");
const issueSource = document.querySelector("#issue-source");

function addBlock(title, content, { wide = false, list = false, ordered = false, paths = false } = {}) {
  if (!content || (Array.isArray(content) && content.length === 0)) return;
  const section = document.createElement("section");
  section.className = `plan-block${wide ? " plan-block-wide" : ""}`;
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.append(heading);

  if (paths && Array.isArray(content)) {
    const pathList = document.createElement("ul");
    pathList.className = "path-list";
    for (const entry of content) {
      const row = document.createElement("li");
      const path = document.createElement("code");
      path.textContent = entry.path || "Area to inspect";
      const reason = document.createElement("span");
      reason.textContent = entry.reason || "Check whether this area is relevant.";
      row.append(path, reason);
      pathList.append(row);
    }
    section.append(pathList);
  } else if (list && Array.isArray(content)) {
    const listElement = document.createElement(ordered ? "ol" : "ul");
    for (const item of content) {
      const row = document.createElement("li");
      row.textContent = String(item);
      listElement.append(row);
    }
    section.append(listElement);
  } else {
    const paragraph = document.createElement("p");
    paragraph.textContent = String(content);
    section.append(paragraph);
  }
  planContent.append(section);
}

function renderPlan(result) {
  planContent.replaceChildren();
  errorMessage.hidden = true;
  errorMessage.textContent = "";
  resultTitle.textContent = result.plan?.plain_summary ? "Here’s a place to begin." : "Your issue guide is ready.";
  issueSource.href = result.issue.url;
  issueSource.hidden = false;

  const plan = result.plan || {};
  addBlock("The issue, in plain language", plan.plain_summary, { wide: true });
  addBlock("The problem to solve", plan.problem_to_solve, { wide: true });
  addBlock("Start here", plan.first_steps, { list: true, ordered: true });
  addBlock("Areas to inspect", plan.areas_to_inspect, { paths: true });
  addBlock("How to check your work", plan.test_ideas, { list: true });
  addBlock("Questions for the maintainer", plan.maintainer_questions, { list: true });
  addBlock("What’s still uncertain", plan.uncertainties, { list: true });
  addBlock("Model response", plan.notes, { wide: true });
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const issueUrl = issueInput.value.trim();
  errorMessage.hidden = true;
  errorMessage.textContent = "";
  planContent.replaceChildren();
  resultTitle.textContent = "Analyzing the issue with Gemma 4…";
  issueSource.hidden = true;
  resultSection.hidden = false;
  submitButton.disabled = true;
  submitButton.querySelector(".button-label").textContent = "Analyzing with Gemma 4…";

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ issueUrl }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "OpenForge couldn't analyze that issue.");
    renderPlan(result);
  } catch (error) {
    resultTitle.textContent = "Let’s try that again.";
    errorMessage.textContent = error.message || "OpenForge couldn't analyze that issue.";
    errorMessage.hidden = false;
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector(".button-label").textContent = "Build my contribution plan";
  }
});
