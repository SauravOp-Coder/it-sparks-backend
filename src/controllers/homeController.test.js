import test from "node:test";
import assert from "node:assert/strict";
import { parseFaqs } from "./homeController.js";

test("parseFaqs supports alternative faq field names from client payloads", () => {
  const result = parseFaqs([
    { faqQuestion: "What is this course?", faqAnswer: "It helps you learn." },
    { questionText: "How long does it take?", answerText: "About 3 months." },
  ]);

  assert.deepEqual(result, [
    { question: "What is this course?", answer: "It helps you learn.", order: 0 },
    { question: "How long does it take?", answer: "About 3 months.", order: 1 },
  ]);
});
