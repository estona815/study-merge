import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ContentValidationDataset,
  validateStudyContent,
} from "../src/validation/contentValidator";
import { Quiz, SubjectDefinition, UnitContent } from "../src/types/models";

function makePracticeQuiz(id: string): Quiz {
  return {
    id,
    type: "ox",
    prompt: "개념 확인 문항",
    correctAnswer: true,
    explanation: "확인용 해설",
  };
}

function makeValidDataset(): ContentValidationDataset {
  const subject: SubjectDefinition = {
    id: "subject-1",
    name: "테스트 과목",
    mode: "highSchool",
    cluster: "common",
    searchTags: ["테스트"],
    headline: "검증용 과목",
    unitIds: ["unit-1"],
    totalConcepts: 3,
    totalQuizzes: 2,
    estimatedMinutes: 10,
    isPlayable: true,
    reviewStatus: "approved",
    sourceRef: "internal://curriculum/spec-1",
    copyrightStatus: "cleared",
  };

  const unit: UnitContent = {
    id: "unit-1",
    subjectId: "subject-1",
    title: "테스트 단원",
    summary: "검증용 단원",
    estimatedMinutes: 10,
    examImportance: 3,
    reviewStatus: "approved",
    sourceRef: "internal://curriculum/spec-1#unit-1",
    copyrightStatus: "cleared",
    concepts: [
      {
        id: "concept-left",
        subjectId: "subject-1",
        unitId: "unit-1",
        title: "왼쪽 개념",
        shortDefinition: "왼쪽 설명",
        blockType: "term",
        mergeGroupId: "group-1",
        stage: 0,
        difficulty: 1,
        relatedConceptIds: ["concept-right", "concept-result"],
        wrongConfuserIds: [],
        explanation: "왼쪽 개념 해설",
        isSpawnable: true,
        examTip: "왼쪽 팁",
        reviewStatus: "approved",
        sourceRef: "internal://curriculum/spec-1#left",
        copyrightStatus: "cleared",
        practiceQuiz: {
          ...makePracticeQuiz("quiz-left-practice"),
          reviewStatus: "approved",
          sourceRef: "internal://curriculum/spec-1#quiz-left",
          copyrightStatus: "cleared",
        },
      },
      {
        id: "concept-right",
        subjectId: "subject-1",
        unitId: "unit-1",
        title: "오른쪽 개념",
        shortDefinition: "오른쪽 설명",
        blockType: "definition",
        mergeGroupId: "group-1",
        stage: 0,
        difficulty: 1,
        relatedConceptIds: ["concept-left", "concept-result"],
        wrongConfuserIds: [],
        explanation: "오른쪽 개념 해설",
        isSpawnable: true,
        examTip: "오른쪽 팁",
        reviewStatus: "approved",
        sourceRef: "internal://curriculum/spec-1#right",
        copyrightStatus: "cleared",
        practiceQuiz: {
          ...makePracticeQuiz("quiz-right-practice"),
          reviewStatus: "approved",
          sourceRef: "internal://curriculum/spec-1#quiz-right",
          copyrightStatus: "cleared",
        },
      },
      {
        id: "concept-result",
        subjectId: "subject-1",
        unitId: "unit-1",
        title: "결과 개념",
        shortDefinition: "결과 설명",
        blockType: "principle",
        mergeGroupId: "group-1",
        stage: 1,
        difficulty: 2,
        relatedConceptIds: ["concept-left", "concept-right"],
        wrongConfuserIds: [],
        explanation: "결과 개념 해설",
        isSpawnable: false,
        examTip: "결과 팁",
        reviewStatus: "approved",
        sourceRef: "internal://curriculum/spec-1#result",
        copyrightStatus: "cleared",
        practiceQuiz: {
          ...makePracticeQuiz("quiz-result-practice"),
          reviewStatus: "approved",
          sourceRef: "internal://curriculum/spec-1#quiz-result",
          copyrightStatus: "cleared",
        },
      },
    ],
    recipes: [
      {
        id: "recipe-1",
        sourceConceptIds: ["concept-left", "concept-right"],
        resultConceptId: "concept-result",
        quizId: "quiz-merge-1",
        explanation: "왼쪽과 오른쪽을 합치면 결과 개념이 됩니다.",
        priority: 1,
      },
    ],
    quizzes: [
      {
        id: "quiz-merge-1",
        type: "multipleChoice",
        prompt: "둘을 합친 결과는?",
        options: [
          { id: "a", text: "결과 개념" },
          { id: "b", text: "왼쪽 개념" },
        ],
        correctOptionId: "a",
        explanation: "결과 개념이 정답입니다.",
        reviewStatus: "approved",
        sourceRef: "internal://curriculum/spec-1#merge-quiz",
        copyrightStatus: "cleared",
      },
    ],
  };

  return {
    subjects: [subject],
    units: [unit],
  };
}

describe("contentValidator", () => {
  it("passes a release-ready fixture", () => {
    const report = validateStudyContent(makeValidDataset());

    assert.equal(report.structuralErrorCount, 0);
    assert.equal(report.releaseBlockerCount, 0);
    assert.equal(report.isReleaseReady, true);
  });

  it("catches duplicate ids and broken references", () => {
    const dataset = makeValidDataset();
    const baseSubject = dataset.subjects[0];
    const baseUnit = dataset.units[0];
    const baseConcept = baseUnit?.concepts[0];
    const baseRecipe = baseUnit?.recipes[0];
    assert.ok(baseSubject);
    assert.ok(baseUnit);
    assert.ok(baseConcept);
    assert.ok(baseRecipe);
    const duplicateUnit = {
      ...baseUnit,
      subjectId: "missing-subject",
      concepts: [
        {
          ...baseConcept,
          id: "concept-left",
          relatedConceptIds: ["missing-concept"],
        },
      ],
      recipes: [
        {
          ...baseRecipe,
          resultConceptId: "missing-result",
        },
      ],
      quizzes: baseUnit.quizzes,
    };

    const report = validateStudyContent({
      subjects: [
        baseSubject,
        { ...baseSubject },
      ],
      units: [baseUnit, duplicateUnit],
    });

    assert.ok(report.findings.some((item) => item.code === "subject.id_duplicate"));
    assert.ok(report.findings.some((item) => item.code === "unit.subject_missing"));
    assert.ok(report.findings.some((item) => item.code === "concept.related_missing"));
    assert.ok(report.findings.some((item) => item.code === "recipe.result_concept_missing"));
  });

  it("catches quiz shape errors", () => {
    const dataset = makeValidDataset();
    const baseUnit = dataset.units[0];
    assert.ok(baseUnit);
    dataset.units[0] = {
      ...baseUnit,
      quizzes: [
        {
          id: "quiz-merge-1",
          type: "multipleChoice",
          prompt: "",
          options: [
            { id: "a", text: "중복" },
            { id: "b", text: "중복" },
          ],
          correctOptionId: "missing",
          explanation: "",
        },
        {
          id: "quiz-merge-2",
          type: "fillBlank",
          prompt: "빈칸",
          placeholder: "입력",
          acceptableAnswers: [""],
          explanation: "설명",
        },
        {
          id: "quiz-merge-3",
          type: "matching",
          prompt: "짝맞추기",
          pairs: [{ left: "A", right: "" }],
          choices: ["B"],
          explanation: "설명",
        },
      ],
      recipes: [
        {
          id: "recipe-1",
          sourceConceptIds: ["concept-left", "concept-right"],
          resultConceptId: "concept-result",
          quizId: "quiz-merge-1",
          explanation: "설명",
          priority: 1,
        },
      ],
    };

    const report = validateStudyContent(dataset);

    assert.ok(report.findings.some((item) => item.code === "quiz.prompt_missing"));
    assert.ok(
      report.findings.some(
        (item) => item.code === "quiz.multiple_choice_option_duplicate_text",
      ),
    );
    assert.ok(
      report.findings.some(
        (item) => item.code === "quiz.multiple_choice_correct_option_missing",
      ),
    );
    assert.ok(
      report.findings.some((item) => item.code === "quiz.fill_blank_answers_missing"),
    );
    assert.ok(report.findings.some((item) => item.code === "quiz.matching_pair_invalid"));
    assert.ok(report.findings.some((item) => item.code === "quiz.orphan"));
  });

  it("flags approved content that lacks release metadata or uses placeholder wording", () => {
    const dataset = makeValidDataset();
    const baseUnit = dataset.units[0];
    const baseConcept = baseUnit?.concepts[0];
    assert.ok(baseUnit);
    assert.ok(baseConcept);
    baseUnit.concepts[0] = {
      ...baseConcept,
      title: "샘플 개념",
      sourceRef: undefined,
      copyrightStatus: undefined,
    };

    const report = validateStudyContent(dataset);

    assert.ok(
      report.findings.some((item) => item.code === "release_metadata.source_ref_missing"),
    );
    assert.ok(
      report.findings.some((item) => item.code === "release_metadata.copyright_missing"),
    );
    assert.ok(
      report.findings.some((item) => item.code === "release_metadata.placeholder_copy"),
    );
  });
});
