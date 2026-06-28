import {
  ConceptDefinition,
  MatchingQuiz,
  MultipleChoiceQuiz,
  Quiz,
  SubjectDefinition,
  UnitContent,
} from "../types/models";

export type ContentValidationSeverity = "error" | "release_blocker" | "warning";

export interface ContentValidationFinding {
  severity: ContentValidationSeverity;
  code: string;
  path: string;
  message: string;
}

export interface ContentValidationReport {
  findings: ContentValidationFinding[];
  structuralErrorCount: number;
  releaseBlockerCount: number;
  warningCount: number;
  isStructurallyValid: boolean;
  isReleaseReady: boolean;
}

export interface ContentValidationDataset {
  subjects: SubjectDefinition[];
  units: UnitContent[];
}

const PLACEHOLDER_PATTERN = /sample|mock|placeholder|todo|tbd|샘플|임시|예시/i;

type MetaCarrier = {
  sourceRef?: string;
  reviewStatus?: string;
  copyrightStatus?: string;
};

function addFinding(
  findings: ContentValidationFinding[],
  severity: ContentValidationSeverity,
  code: string,
  path: string,
  message: string,
) {
  findings.push({ severity, code, path, message });
}

function isBlank(value: string | undefined): boolean {
  return !value || value.trim().length === 0;
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function validateMetadataCoverage(params: {
  findings: ContentValidationFinding[];
  label: string;
  items: MetaCarrier[];
  path: string;
}) {
  const withReviewStatus = params.items.filter((item) => Boolean(item.reviewStatus)).length;
  const withSourceRef = params.items.filter((item) => Boolean(item.sourceRef)).length;
  const withCopyrightStatus = params.items.filter(
    (item) => Boolean(item.copyrightStatus),
  ).length;

  if (params.items.length === 0) {
    return;
  }

  if (withReviewStatus === 0 || withSourceRef === 0 || withCopyrightStatus === 0) {
    addFinding(
      params.findings,
      "release_blocker",
      "release_metadata.coverage_missing",
      params.path,
      `${params.label} release metadata coverage is incomplete. reviewStatus ${withReviewStatus}/${params.items.length}, sourceRef ${withSourceRef}/${params.items.length}, copyrightStatus ${withCopyrightStatus}/${params.items.length}.`,
    );
  }
}

function validateApprovedMetadata(params: {
  findings: ContentValidationFinding[];
  item: MetaCarrier & { title?: string; explanation?: string; prompt?: string; shortDefinition?: string };
  path: string;
  label: string;
}) {
  if (params.item.reviewStatus !== "approved") {
    return;
  }

  if (isBlank(params.item.sourceRef)) {
    addFinding(
      params.findings,
      "release_blocker",
      "release_metadata.source_ref_missing",
      params.path,
      `${params.label} is marked approved but is missing sourceRef.`,
    );
  }

  if (isBlank(params.item.copyrightStatus)) {
    addFinding(
      params.findings,
      "release_blocker",
      "release_metadata.copyright_missing",
      params.path,
      `${params.label} is marked approved but is missing copyrightStatus.`,
    );
  }

  const releaseTexts = [
    params.item.title,
    params.item.shortDefinition,
    params.item.explanation,
    params.item.prompt,
  ]
    .filter(Boolean)
    .join(" ");

  if (PLACEHOLDER_PATTERN.test(releaseTexts)) {
    addFinding(
      params.findings,
      "release_blocker",
      "release_metadata.placeholder_copy",
      params.path,
      `${params.label} is marked approved but still contains sample/mock/placeholder wording.`,
    );
  }
}

function validateQuizShape(
  quiz: Quiz,
  path: string,
  findings: ContentValidationFinding[],
) {
  if (isBlank(quiz.id)) {
    addFinding(findings, "error", "quiz.id_missing", path, "Quiz id is missing.");
  }

  if (isBlank(quiz.prompt)) {
    addFinding(findings, "error", "quiz.prompt_missing", path, "Quiz prompt is empty.");
  }

  if (isBlank(quiz.explanation)) {
    addFinding(
      findings,
      "error",
      "quiz.explanation_missing",
      path,
      "Quiz explanation is empty.",
    );
  }

  validateApprovedMetadata({
    findings,
    item: quiz,
    path,
    label: `Quiz ${quiz.id}`,
  });

  if (quiz.type === "ox" && typeof quiz.correctAnswer !== "boolean") {
    addFinding(
      findings,
      "error",
      "quiz.ox_invalid_answer",
      path,
      "OX quiz correctAnswer must be a boolean.",
    );
  }

  if (quiz.type === "multipleChoice") {
    const choiceQuiz = quiz as MultipleChoiceQuiz;

    if (choiceQuiz.options.length < 2) {
      addFinding(
        findings,
        "error",
        "quiz.multiple_choice_too_short",
        path,
        "Multiple-choice quiz must have at least 2 options.",
      );
    }

    const optionIds = new Set<string>();
    const optionTexts = new Set<string>();
    for (const option of choiceQuiz.options) {
      if (isBlank(option.id) || isBlank(option.text)) {
        addFinding(
          findings,
          "error",
          "quiz.multiple_choice_option_invalid",
          path,
          "Multiple-choice option id/text must be non-empty.",
        );
      }

      if (optionIds.has(option.id)) {
        addFinding(
          findings,
          "error",
          "quiz.multiple_choice_option_duplicate_id",
          path,
          `Multiple-choice option id "${option.id}" is duplicated.`,
        );
      }
      optionIds.add(option.id);

      const normalized = normalizeText(option.text);
      if (optionTexts.has(normalized)) {
        addFinding(
          findings,
          "error",
          "quiz.multiple_choice_option_duplicate_text",
          path,
          `Multiple-choice option text "${option.text}" is duplicated.`,
        );
      }
      optionTexts.add(normalized);
    }

    if (!choiceQuiz.options.some((option) => option.id === choiceQuiz.correctOptionId)) {
      addFinding(
        findings,
        "error",
        "quiz.multiple_choice_correct_option_missing",
        path,
        `correctOptionId "${choiceQuiz.correctOptionId}" does not match any option.`,
      );
    }
  }

  if (quiz.type === "fillBlank") {
    const validAnswers = quiz.acceptableAnswers.filter((answer) => answer.trim().length > 0);
    if (validAnswers.length === 0) {
      addFinding(
        findings,
        "error",
        "quiz.fill_blank_answers_missing",
        path,
        "Fill-in quiz must have at least one non-empty accepted answer.",
      );
    }
  }

  if (quiz.type === "matching") {
    const matchingQuiz = quiz as MatchingQuiz;
    if (matchingQuiz.pairs.length === 0) {
      addFinding(
        findings,
        "error",
        "quiz.matching_pairs_missing",
        path,
        "Matching quiz must contain at least one pair.",
      );
    }

    const seenLeft = new Set<string>();
    for (const pair of matchingQuiz.pairs) {
      if (isBlank(pair.left) || isBlank(pair.right)) {
        addFinding(
          findings,
          "error",
          "quiz.matching_pair_invalid",
          path,
          "Matching quiz pairs must have non-empty left/right values.",
        );
      }

      if (seenLeft.has(pair.left)) {
        addFinding(
          findings,
          "error",
          "quiz.matching_pair_duplicate_left",
          path,
          `Matching quiz left label "${pair.left}" is duplicated.`,
        );
      }
      seenLeft.add(pair.left);

      if (!matchingQuiz.choices.includes(pair.right)) {
        addFinding(
          findings,
          "error",
          "quiz.matching_choice_missing",
          path,
          `Matching quiz choice list is missing "${pair.right}".`,
        );
      }
    }
  }
}

export function validateStudyContent(
  dataset: ContentValidationDataset,
): ContentValidationReport {
  const findings: ContentValidationFinding[] = [];
  const subjectIdCounts = new Map<string, number>();
  const unitIdCounts = new Map<string, number>();
  const conceptIdCounts = new Map<string, number>();
  const quizIdCounts = new Map<string, number>();
  const allConcepts: ConceptDefinition[] = [];
  const allQuizzes: Quiz[] = [];

  for (const subject of dataset.subjects) {
    subjectIdCounts.set(subject.id, (subjectIdCounts.get(subject.id) ?? 0) + 1);
  }

  for (const unit of dataset.units) {
    unitIdCounts.set(unit.id, (unitIdCounts.get(unit.id) ?? 0) + 1);
    for (const concept of unit.concepts) {
      conceptIdCounts.set(concept.id, (conceptIdCounts.get(concept.id) ?? 0) + 1);
      allConcepts.push(concept);
      quizIdCounts.set(
        concept.practiceQuiz.id,
        (quizIdCounts.get(concept.practiceQuiz.id) ?? 0) + 1,
      );
      allQuizzes.push(concept.practiceQuiz);
    }

    for (const quiz of unit.quizzes) {
      quizIdCounts.set(quiz.id, (quizIdCounts.get(quiz.id) ?? 0) + 1);
      allQuizzes.push(quiz);
    }
  }

  const subjectIds = new Set(dataset.subjects.map((subject) => subject.id));
  const unitIds = new Set(dataset.units.map((unit) => unit.id));
  const conceptIds = new Set(allConcepts.map((concept) => concept.id));
  const quizIds = new Set(allQuizzes.map((quiz) => quiz.id));

  validateMetadataCoverage({
    findings,
    label: "Subject",
    items: dataset.subjects,
    path: "dataset:subjects",
  });
  validateMetadataCoverage({
    findings,
    label: "Unit",
    items: dataset.units,
    path: "dataset:units",
  });
  validateMetadataCoverage({
    findings,
    label: "Concept",
    items: allConcepts,
    path: "dataset:concepts",
  });
  validateMetadataCoverage({
    findings,
    label: "Quiz",
    items: allQuizzes,
    path: "dataset:quizzes",
  });

  for (const [id, count] of subjectIdCounts.entries()) {
    if (isBlank(id)) {
      addFinding(findings, "error", "subject.id_missing", "dataset:subjects", "A subject id is missing.");
    }
    if (count > 1) {
      addFinding(findings, "error", "subject.id_duplicate", `subject:${id}`, `Subject id "${id}" is duplicated ${count} times.`);
    }
  }

  for (const subject of dataset.subjects) {
    const path = `subject:${subject.id}`;
    validateApprovedMetadata({
      findings,
      item: subject,
      path,
      label: `Subject ${subject.id}`,
    });

    if (subject.unitIds.length === 0) {
      addFinding(findings, "error", "subject.units_missing", path, "Subject has no units.");
    }

    for (const unitId of subject.unitIds) {
      if (!unitIds.has(unitId)) {
        addFinding(
          findings,
          "error",
          "subject.unit_missing",
          path,
          `Subject references missing unit "${unitId}".`,
        );
      }
    }
  }

  for (const [id, count] of unitIdCounts.entries()) {
    if (isBlank(id)) {
      addFinding(findings, "error", "unit.id_missing", "dataset:units", "A unit id is missing.");
    }
    if (count > 1) {
      addFinding(findings, "error", "unit.id_duplicate", `unit:${id}`, `Unit id "${id}" is duplicated ${count} times.`);
    }
  }

  for (const unit of dataset.units) {
    const path = `unit:${unit.id}`;
    validateApprovedMetadata({
      findings,
      item: unit,
      path,
      label: `Unit ${unit.id}`,
    });

    if (!subjectIds.has(unit.subjectId)) {
      addFinding(
        findings,
        "error",
        "unit.subject_missing",
        path,
        `Unit references missing subject "${unit.subjectId}".`,
      );
    }

    if (unit.concepts.length === 0) {
      addFinding(findings, "error", "unit.concepts_missing", path, "Unit has no concepts.");
    }

    const recipeQuizIds = new Set<string>();
    for (const recipe of unit.recipes) {
      const recipePath = `${path}.recipe:${recipe.id}`;
      if (isBlank(recipe.id)) {
        addFinding(findings, "error", "recipe.id_missing", recipePath, "Recipe id is missing.");
      }

      if (!conceptIds.has(recipe.sourceConceptIds[0])) {
        addFinding(
          findings,
          "error",
          "recipe.source_concept_missing",
          recipePath,
          `Recipe references missing source concept "${recipe.sourceConceptIds[0]}".`,
        );
      }

      if (!conceptIds.has(recipe.sourceConceptIds[1])) {
        addFinding(
          findings,
          "error",
          "recipe.source_concept_missing",
          recipePath,
          `Recipe references missing source concept "${recipe.sourceConceptIds[1]}".`,
        );
      }

      if (!conceptIds.has(recipe.resultConceptId)) {
        addFinding(
          findings,
          "error",
          "recipe.result_concept_missing",
          recipePath,
          `Recipe resultConceptId "${recipe.resultConceptId}" does not exist.`,
        );
      }

      if (!quizIds.has(recipe.quizId)) {
        addFinding(
          findings,
          "error",
          "recipe.quiz_missing",
          recipePath,
          `Recipe quizId "${recipe.quizId}" does not exist.`,
        );
      }

      if (isBlank(recipe.explanation)) {
        addFinding(
          findings,
          "error",
          "recipe.explanation_missing",
          recipePath,
          "Recipe explanation is empty.",
        );
      }

      recipeQuizIds.add(recipe.quizId);
    }

    for (const quiz of unit.quizzes) {
      validateQuizShape(quiz, `${path}.quiz:${quiz.id}`, findings);
      if (!recipeQuizIds.has(quiz.id)) {
        addFinding(
          findings,
          "error",
          "quiz.orphan",
          `${path}.quiz:${quiz.id}`,
          "Unit quiz is not referenced by any merge recipe.",
        );
      }
    }
  }

  for (const [id, count] of conceptIdCounts.entries()) {
    if (isBlank(id)) {
      addFinding(findings, "error", "concept.id_missing", "dataset:concepts", "A concept id is missing.");
    }
    if (count > 1) {
      addFinding(findings, "error", "concept.id_duplicate", `concept:${id}`, `Concept id "${id}" is duplicated ${count} times.`);
    }
  }

  for (const concept of allConcepts) {
    const path = `concept:${concept.id}`;
    validateApprovedMetadata({
      findings,
      item: concept,
      path,
      label: `Concept ${concept.id}`,
    });

    if (!subjectIds.has(concept.subjectId)) {
      addFinding(
        findings,
        "error",
        "concept.subject_missing",
        path,
        `Concept references missing subject "${concept.subjectId}".`,
      );
    }

    if (!unitIds.has(concept.unitId)) {
      addFinding(
        findings,
        "error",
        "concept.unit_missing",
        path,
        `Concept references missing unit "${concept.unitId}".`,
      );
    }

    if (isBlank(concept.title)) {
      addFinding(findings, "error", "concept.title_missing", path, "Concept title is empty.");
    }

    if (isBlank(concept.shortDefinition)) {
      addFinding(
        findings,
        "error",
        "concept.short_definition_missing",
        path,
        "Concept shortDefinition is empty.",
      );
    }

    if (isBlank(concept.explanation)) {
      addFinding(
        findings,
        "error",
        "concept.explanation_missing",
        path,
        "Concept explanation is empty.",
      );
    }

    for (const relatedId of concept.relatedConceptIds) {
      if (!conceptIds.has(relatedId)) {
        addFinding(
          findings,
          "error",
          "concept.related_missing",
          path,
          `Concept references missing relatedConceptId "${relatedId}".`,
        );
      }
    }

    if (Array.isArray(concept.prerequisiteConceptIds)) {
      for (const prerequisiteId of concept.prerequisiteConceptIds) {
        if (!conceptIds.has(prerequisiteId)) {
          addFinding(
            findings,
            "error",
            "concept.prerequisite_missing",
            path,
            `Concept references missing prerequisiteConceptId "${prerequisiteId}".`,
          );
        }
      }
    }

    validateQuizShape(concept.practiceQuiz, `${path}.practiceQuiz:${concept.practiceQuiz.id}`, findings);
  }

  for (const [id, count] of quizIdCounts.entries()) {
    if (isBlank(id)) {
      addFinding(findings, "error", "quiz.id_missing", "dataset:quizzes", "A quiz id is missing.");
    }
    if (count > 1) {
      addFinding(findings, "error", "quiz.id_duplicate", `quiz:${id}`, `Quiz id "${id}" is duplicated ${count} times.`);
    }
  }

  const structuralErrorCount = findings.filter((item) => item.severity === "error").length;
  const releaseBlockerCount = findings.filter(
    (item) => item.severity === "release_blocker",
  ).length;
  const warningCount = findings.filter((item) => item.severity === "warning").length;

  return {
    findings,
    structuralErrorCount,
    releaseBlockerCount,
    warningCount,
    isStructurallyValid: structuralErrorCount === 0,
    isReleaseReady: structuralErrorCount === 0 && releaseBlockerCount === 0,
  };
}
