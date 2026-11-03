import assert from "node:assert/strict";
import test from "node:test";
import { answer } from "../dist/app.js";

test("policy uses the active source even when an archived source appears first", () => {
  let modelCalls = 0;
  const result = answer({ kind: "policy", topic: "returns-window" }, {
    documents: [
      { id: "returns-archived", revision: "1", topic: "returns-window", state: "archived", text: "Returns window: 60 days." },
      { id: "returns-current", revision: "2", topic: "returns-window", state: "active", text: "Returns window: 21 days." }
    ],
    lookup: () => assert.fail("Policy requests must not look up accounts"),
    model: source => { modelCalls++; return `Policy: ${source.text}`; }
  });

  assert.equal(result.status, "ok");
  assert.equal(result.text, "Policy: Returns window: 21 days.");
  assert.deepEqual(result.citations, ["returns-current"]);
  assert.equal(modelCalls, 1);
  assert.deepEqual(result.trace.filter(event => event.stage === "retrieval"), [
    { stage: "retrieval", sourceId: "returns-current", revision: "2" }
  ]);
});

test("policy refuses an archived-only topic without calling the model", () => {
  let modelCalls = 0;
  const result = answer({ kind: "policy", topic: "returns-window" }, {
    documents: [
      { id: "returns-archived", revision: "1", topic: "returns-window", state: "archived", text: "Returns window: 60 days." },
      { id: "warranty-current", revision: "1", topic: "warranty", state: "active", text: "Warranty lasts 2 years." }
    ],
    lookup: () => assert.fail("Policy requests must not look up accounts"),
    model: source => { modelCalls++; return `Policy: ${source.text}`; }
  });

  assert.equal(modelCalls, 0);
  assert.equal(result.status, "refused");
  assert.deepEqual(result.citations, []);
  assert.equal(result.trace.some(event => event.stage === "model"), false);
});
