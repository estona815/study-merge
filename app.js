const storageKey = "gwalsa-routine-state-v1";
const appBuild = "20260612a05";
const FACE_SCAN_MIN_DIMENSION = 220;
const FACE_SCAN_MIN_FILE_BYTES = 64 * 1024;
const FACE_SCAN_MAX_FILE_BYTES = 10 * 1024 * 1024;
const PHOTO_MAX_FILE_BYTES = 20 * 1024 * 1024;
const FACE_SCAN_QUALITY_THRESHOLD = 0.35;
const FACE_SCAN_MIN_POINT_COUNT = 20;
const FACE_SCAN_MIN_POINT_RATIO = 0.25;
const FACE_SCAN_MAX_POINT_RATIO = 0.95;
const FACE_SCAN_PREFERRED_PROVIDERS = ["mediapipe", "tfjs"];
const FACE_SCAN_PLACEHOLDER_LABEL = "placeholder";
const FACE_SCAN_LOGICAL_POINT_COUNT = 72;
const FACE_SCAN_SAMPLE_SIZE = 48;
const FACE_SCAN_MODEL_ASSET_PATH = "./assets/models/face-landmarker/face-landmarker.task";
const FACE_SCAN_RUNTIME_VERSION = "0.10.35";
const FACE_SCAN_RUNTIME_MODULE_URL = `./assets/vendor/mediapipe/tasks-vision/${FACE_SCAN_RUNTIME_VERSION}/vision_bundle.mjs`;
const FACE_SCAN_WASM_ASSET_PATH = `./assets/vendor/mediapipe/tasks-vision/${FACE_SCAN_RUNTIME_VERSION}/wasm`;
const FACE_SCAN_TEST_CAMERA_MESSAGE = "이 화면은 브라우저 테스트 카메라입니다. 실제 휴대폰 카메라 또는 사진 업로드로 확인해 주세요.";
const FACE_SCAN_DARK_MESSAGE = "사진이 너무 어둡습니다. 밝은 정면 조명에서 다시 촬영하거나 사진을 업로드해 주세요.";
const FACE_SCAN_WEAK_FACE_MESSAGE = "동선 기준이 약합니다. 정면 이미지가 프레임을 충분히 채우도록 다시 촬영해 주세요.";
const FACE_SCAN_MODEL_MISSING_MESSAGE = "실제 얼굴 랜드마크 모델 파일이 아직 포함되지 않았습니다. 모델을 추가한 뒤 다시 시도해 주세요.";
const FACE_SCAN_RUNTIME_MISSING_MESSAGE = "실제 얼굴 랜드마크 런타임이 아직 로드되지 않았습니다. MediaPipe 런타임과 모델 파일을 함께 추가해 주세요.";
const FACE_SCAN_MODEL_LOADING_MESSAGE = "실제 얼굴 랜드마크 모델을 준비 중입니다.";
const FACE_SCAN_REAL_MODEL_REQUIRED_MESSAGE = "출시 모드에서는 실제 MediaPipe 얼굴 랜드마크 감지만 사용할 수 있습니다. 참고 모드는 QA 쿼리에서만 허용됩니다.";
const PHOTO_DATA_URL_MAX_CHARS = 900000;
const BACKUP_MAX_BYTES = 6 * 1024 * 1024;
const BACKUP_MAX_LOGS = 1000;
const PUBLIC_POLICY_URL = "./public/privacy-policy.html";
const PUBLIC_TERMS_URL = "./public/terms-disclaimer.html";
const PUBLIC_SUPPORT_URL = "./public/support.html";
const policySummaryText = [
  "사괄 정책 요약",
  "",
  "사괄은 일반적인 뷰티 루틴과 셀프케어 참고용 안내만 제공합니다.",
  "의료 조언, 진단, 치료, 질병 예방 목적이 아닙니다.",
  "의료 진단, 피부질환 판단, 외모 변화나 특정 결과를 약속할 수 없습니다.",
  "상처, 자극, 붉음, 컨디션 불편감이 있는 부위는 피하고 불편함이 느껴지면 즉시 중단하세요.",
  "카메라 또는 업로드 이미지는 브라우저 로컬에서만 가공되며 개인 식별 목적으로 사용하지 않습니다.",
  "기록과 사진은 이 브라우저의 로컬 저장소에만 저장되며, 백업 파일은 사용자가 직접 만들고 보관합니다.",
  "참고 가이드는 동선 표시를 위한 좌표만 사용하며, 원본 얼굴 이미지는 기록/백업에 저장되지 않습니다.",
  "카메라/업로드 이미지는 참고 동선 표시용으로만 처리하고 의료 진단/치료 목적은 아닙니다.",
  "시각 참고 화면은 실제 변화나 미래 피부 변화를 약속하지 않습니다.",
].join("\n");

const baseRoutines = {
  morning: {
    title: "사과 리셋",
    minutes: 7,
    difficulty: "입문",
    tag: "아침 얼굴 정돈",
    situation: "아침 얼굴 컨디션을 가볍게 확인하고 싶을 때",
    description: "목과 얼굴 방향을 낮은 압력으로 차분하게 이어가는 기본 루틴입니다.",
    steps: [
      { zone: "neck", title: "쇄골 열기", seconds: 50, strokes: "8회", pressure: "낮게", cue: "안쪽에서 바깥쪽으로 짧게" },
      { zone: "neck", title: "목선 내리기", seconds: 70, strokes: "10회", pressure: "낮게", cue: "귀 아래에서 쇄골까지" },
      { zone: "jaw", title: "턱선 밀기", seconds: 90, strokes: "12회", pressure: "보통", cue: "턱 중앙에서 귀밑까지" },
      { zone: "cheek", title: "광대 들어올리기", seconds: 90, strokes: "12회", pressure: "보통", cue: "코 옆에서 관자 방향" },
      { zone: "brow", title: "이마 정리", seconds: 60, strokes: "8회", pressure: "낮게", cue: "눈썹 위에서 헤어라인까지" },
      { zone: "neck", title: "마무리 정리", seconds: 60, strokes: "8회", pressure: "낮게", cue: "귀 아래에서 쇄골까지" },
    ],
  },
  jaw: {
    title: "턱선 준비",
    minutes: 6,
    difficulty: "보통",
    tag: "중요한 약속 전",
    situation: "턱 주변을 부드럽게 정리하고 싶을 때",
    description: "턱 주변을 부드럽게 정리하고 목 방향으로 마무리하는 루틴입니다.",
    steps: [
      { zone: "neck", title: "귀밑 풀기", seconds: 60, strokes: "8회", pressure: "낮게", cue: "작은 원으로 천천히" },
      { zone: "jaw", title: "턱 중앙 라인", seconds: 90, strokes: "12회", pressure: "보통", cue: "턱끝에서 귀밑까지" },
      { zone: "jaw", title: "입가 바깥 라인", seconds: 70, strokes: "10회", pressure: "보통", cue: "입꼬리에서 광대 아래까지" },
      { zone: "cheek", title: "볼 아래 받치기", seconds: 70, strokes: "10회", pressure: "낮게", cue: "볼 아래를 위로 밀기" },
      { zone: "neck", title: "쇄골 마감", seconds: 60, strokes: "8회", pressure: "낮게", cue: "목선을 아래로 정리" },
    ],
  },
  neck: {
    title: "목선 마감 루틴",
    minutes: 5,
    difficulty: "입문",
    tag: "목이 먼저 살려달랄 때",
    situation: "예민하거나 가볍게만 하고 싶을 때",
    description: "얼굴보다 목과 쇄골을 먼저 낮은 압력으로 확인하는 루틴입니다.",
    steps: [
      { zone: "neck", title: "쇄골 라인", seconds: 60, strokes: "8회", pressure: "낮게", cue: "중앙에서 바깥쪽" },
      { zone: "neck", title: "옆목 내리기", seconds: 90, strokes: "10회", pressure: "낮게", cue: "턱 아래에서 쇄골까지" },
      { zone: "neck", title: "승모 주변", seconds: 70, strokes: "8회", pressure: "보통", cue: "목 끝에서 어깨 방향" },
      { zone: "jaw", title: "턱 아래 마감", seconds: 50, strokes: "8회", pressure: "낮게", cue: "턱 아래를 부드럽게" },
    ],
  },
  puffiness: {
    title: "저녁 얼굴 정돈",
    minutes: 4,
    difficulty: "쉬움",
    tag: "오늘 급함",
    situation: "아침 얼굴 컨디션이 무겁게 느껴질 때",
    description: "목과 볼 주변을 짧게 확인하는 빠른 컨디션 루틴입니다.",
    steps: [
      { zone: "neck", title: "쇄골 문 열기", seconds: 45, strokes: "6회", pressure: "낮게", cue: "쇄골 주변을 안쪽에서 바깥쪽으로 부드럽게" },
      { zone: "neck", title: "귀밑 내리기", seconds: 55, strokes: "8회", pressure: "낮게", cue: "귀 아래에서 쇄골 방향으로 천천히" },
      { zone: "cheek", title: "볼 옆 환기", seconds: 70, strokes: "8회", pressure: "낮게", cue: "코 옆에서 관자 방향으로 짧게" },
      { zone: "jaw", title: "턱선 마감", seconds: 70, strokes: "8회", pressure: "낮게", cue: "턱끝에서 귀밑까지 가볍게 마무리" },
    ],
  },
  cheek: {
    title: "광대 환기",
    minutes: 5,
    difficulty: "보통",
    tag: "볼 주변 정돈",
    situation: "볼 주변이 답답하게 느껴질 때",
    description: "광대와 볼 주변 방향을 낮은 압력으로 확인하는 루틴입니다.",
    steps: [
      { zone: "neck", title: "목 먼저 정리", seconds: 50, strokes: "8회", pressure: "낮게", cue: "귀 아래에서 쇄골까지 먼저 내려줍니다." },
      { zone: "cheek", title: "볼 아래 받치기", seconds: 80, strokes: "10회", pressure: "낮게", cue: "볼 아래를 받치듯 관자 방향으로" },
      { zone: "cheek", title: "광대 바깥 열기", seconds: 80, strokes: "10회", pressure: "낮게", cue: "코 옆에서 바깥 방향으로 짧게" },
      { zone: "brow", title: "이마 가볍게", seconds: 50, strokes: "6회", pressure: "낮게", cue: "눈가는 피하고 눈썹 위만 짧게" },
      { zone: "neck", title: "목으로 마감", seconds: 40, strokes: "6회", pressure: "낮게", cue: "귀 아래에서 쇄골까지 내려 마무리" },
    ],
  },
  quick: {
    title: "빠른 정돈 3분",
    minutes: 3,
    difficulty: "초간단",
    tag: "회의 5분 전",
    situation: "시간은 없고 얼굴은 봐야 할 때",
    description: "가장 짧게 목, 턱, 볼만 확인하는 비상용 루틴입니다.",
    steps: [
      { zone: "neck", title: "목 급속 정리", seconds: 45, strokes: "6회", pressure: "낮게", cue: "귀 아래에서 쇄골까지 힘을 빼고" },
      { zone: "jaw", title: "턱선 점검", seconds: 60, strokes: "8회", pressure: "낮게", cue: "턱끝에서 귀밑까지 한 방향으로" },
      { zone: "cheek", title: "볼 옆 마감", seconds: 75, strokes: "8회", pressure: "낮게", cue: "코 옆에서 관자 방향으로 짧게" },
    ],
  },
  long: {
    title: "가볍게 정돈 10분",
    minutes: 10,
    difficulty: "차분",
    tag: "괄사력 충전",
    situation: "오늘은 천천히 관리하고 싶을 때",
    description: "목, 턱선, 광대, 이마까지 천천히 이어가는 긴 루틴입니다.",
    steps: [
      { zone: "neck", title: "쇄골 열기", seconds: 70, strokes: "8회", pressure: "낮게", cue: "안쪽에서 바깥쪽으로 천천히" },
      { zone: "neck", title: "옆목 내리기", seconds: 90, strokes: "10회", pressure: "낮게", cue: "귀 아래에서 쇄골까지 길게" },
      { zone: "jaw", title: "턱 중앙", seconds: 95, strokes: "12회", pressure: "보통", cue: "턱끝에서 귀밑까지 한 방향" },
      { zone: "jaw", title: "입가 바깥", seconds: 85, strokes: "10회", pressure: "보통", cue: "입꼬리에서 광대 아래까지" },
      { zone: "cheek", title: "광대 들어올리기", seconds: 105, strokes: "12회", pressure: "낮게", cue: "코 옆에서 관자 방향" },
      { zone: "brow", title: "이마 정리", seconds: 75, strokes: "8회", pressure: "낮게", cue: "눈썹 위에서 헤어라인까지" },
      { zone: "neck", title: "목으로 마감", seconds: 80, strokes: "8회", pressure: "낮게", cue: "귀 아래에서 쇄골 방향으로 마무리" },
    ],
  },
};

const zoneNames = {
  all: "전체",
  neck: "목",
  jaw: "턱선",
  cheek: "광대",
  brow: "이마",
};

const profileDefaults = {
  skinType: "balanced",
  mainConcern: "puffiness",
  experience: "beginner",
  avoidZones: [],
};

const skinTypeLabels = {
  balanced: "보통",
  dry: "건조",
  oily: "유분",
  sensitive: "예민",
};

const concernLabels = {
  puffiness: "아침 컨디션",
  jawline: "턱선",
  tension: "목 타이트함",
  redness: "붉음",
};

const experienceLabels = {
  beginner: "입문",
  steady: "보통",
  skilled: "숙련",
};

const avoidZoneOptions = ["neck", "jaw", "cheek", "brow"];

const safetyCheckDefaults = {
  irritated: false,
  procedure: false,
  breakout: false,
  sun: false,
};

const safetyCheckLabels = {
  irritated: "따가움",
  procedure: "시술 직후",
  breakout: "트러블",
  sun: "햇빛 자극",
};

const safetyCheckOptions = Object.keys(safetyCheckDefaults);

const programDays = [
  { title: "저녁 얼굴 정돈", routine: "puffiness", focus: "목 · 볼 · 턱선", cue: "목과 볼 주변을 짧고 낮은 압력으로 확인합니다." },
  { title: "사과 리셋", routine: "morning", focus: "목 · 턱선 · 광대", cue: "목부터 천천히 시작해 얼굴 전체의 컨디션을 부드럽게 깨웁니다." },
  { title: "목선 마감", routine: "neck", focus: "목 · 쇄골", cue: "자극을 낮추고 목 주변 감각을 가볍게 확인합니다." },
  { title: "턱선 준비", routine: "jaw", focus: "턱선 · 입가", cue: "턱 중앙에서 귀밑까지 천천히 이어가며 방향을 부드럽게 정리합니다." },
  { title: "광대 환기", routine: "cheek", focus: "광대 · 볼", cue: "볼 아래를 받치고 바깥 방향감을 천천히 따라갑니다." },
  { title: "괄사력 충전", routine: "long", focus: "목 · 턱선 · 광대 · 이마", cue: "시간이 있는 날엔 낮은 압력으로 길게 이어가며 반응을 봅니다." },
  { title: "빠른 정돈", routine: "quick", focus: "목 · 턱선 · 볼", cue: "짧게 얼굴 컨디션을 확인할 때 쓰는 루틴입니다. 가볍게, 무리하지 않게." },
];

const zoneGuides = [
  {
    zone: "neck",
    title: "목 · 쇄골",
    routine: "neck",
    pressure: "낮게",
    direction: "귀 아래에서 쇄골 쪽으로 길게 내리고, 중앙 목은 누르지 않습니다.",
    goodFor: "아침 컨디션 · 예민한 날",
    avoid: "갑상선 중앙, 멍든 부위, 따가운 부위",
  },
  {
    zone: "jaw",
    title: "턱선",
    routine: "jaw",
    pressure: "보통",
    direction: "턱끝에서 귀밑으로 밀고, 마무리는 목 방향으로 내려줍니다.",
    goodFor: "턱 주변 타이트함 · 라인 정리",
    avoid: "턱관절 불편감, 여드름이 올라온 부위",
  },
  {
    zone: "cheek",
    title: "광대 · 볼",
    routine: "morning",
    pressure: "낮게",
    direction: "코 옆에서 관자 방향으로 들어 올리고 같은 자리를 반복하지 않습니다.",
    goodFor: "아침 컨디션 · 볼 주변 타이트함",
    avoid: "홍조가 심한 날, 광대 위 얇은 피부",
  },
  {
    zone: "brow",
    title: "이마 정리",
    routine: "morning",
    pressure: "낮게",
    direction: "눈썹 위에서 헤어라인 방향으로 짧게 올리고 눈가는 피합니다.",
    goodFor: "이마 타이트함 · 표정선 느낌 정리",
    avoid: "눈꺼풀, 눈가, 따가움이 남은 부위",
  },
];

const faceZoneLabelMap = {
  jaw: "턱선",
  cheek: "광대",
  cheekbone: "광대뼈",
  jawline: "턱선",
  forehead: "이마",
  neck: "목",
  brow: "이마",
  all: "전체",
};

const faceZoneRenderMap = {
  all: "all",
  jaw: "jaw",
  jawline: "jaw",
  cheek: "cheek",
  cheekbone: "cheekbone",
  forehead: "forehead",
  brow: "forehead",
  neck: "neck",
};

const faceZoneHintMap = {
  jawline: "턱 중심에서 입가 쪽으로 가볍게 밀고 귀 밑으로 내려 목선으로 정리하세요.",
  jaw: "턱 중앙 라인에서 입가·귀 밑 방향으로 부드럽게 밀고 목 라인으로 이어주세요.",
  cheek: "코 옆에서 관자 방향으로 바깥쪽을 받치며 천천히 진행하세요.",
  cheekbone: "광대상단 선을 따라 바깥쪽으로 넓게 열어주세요.",
  forehead: "이마 중앙에서 눈썹 위로 정리 후 눈가 직전에 살짝 멈추세요.",
  brow: "눈썹 라인을 따라 바깥쪽으로 가볍게 정리하세요.",
  neck: "귀 아래에서 쇄골 방향으로 길고 부드럽게 내려주세요.",
};

const faceDirectionMap = {
  jaw: {
    direction: "턱 중심에서 입가 쪽으로 가볍게 밀고, 이어서 귀 밑으로 내려 목선을 정렬해요.",
    label: "턱선 정렬",
    repeat: "10~12회",
    intensity: "보통",
    route: "턱 중심 → 입가 → 귀 밑",
    routeLabel: "턱선 정렬 라인",
  },
  jawline: {
    direction: "입가 쪽에서 시작해 턱 중심과 귀 밑을 따라 내려 목선으로 마무리해요.",
    label: "턱라인 정리",
    repeat: "10~12회",
    intensity: "보통",
    route: "턱 중심 → 입가 → 귀 밑",
    routeLabel: "턱 라인 연결",
  },
  cheek: {
    direction: "코 옆에서 관자 방향으로 바깥쪽을 부드럽게 받치고 위로 밀어주세요.",
    label: "광대 라인",
    repeat: "8~10회",
    intensity: "낮게",
    route: "코 옆 → 관자 → 바깥쪽",
    routeLabel: "광대 라인",
  },
  cheekbone: {
    direction: "광대 상단 라인을 따라 볼 중앙에서 바깥쪽으로 넓게 이어주세요.",
    label: "광대뼈 가이드",
    repeat: "6~8회",
    intensity: "낮게",
    route: "볼 중앙 → 바깥",
    routeLabel: "광대뼈 라인",
  },
  forehead: {
    direction: "이마 중앙에서 눈썹 위로 올라간 뒤 헤어라인 방향으로 정리해 주세요.",
    label: "이마 정렬",
    repeat: "6회",
    intensity: "낮게",
    route: "눈썹 위 → 헤어라인",
    routeLabel: "이마 정렬 라인",
  },
  brow: {
    direction: "눈썹 라인을 따라 바깥쪽으로 미세하게 마감해 주세요.",
    label: "이마 마감",
    repeat: "6회",
    intensity: "낮게",
    route: "눈썹 시작 → 바깥 끝",
    routeLabel: "이마 마감 라인",
  },
  neck: {
    direction: "목 중앙은 힘을 빼고 귀 아래에서 쇄골 쪽으로 길고 느리게 내려주세요.",
    label: "목 라인",
    repeat: "8~10회",
    intensity: "낮게",
    route: "귀 밑 → 쇄골",
    routeLabel: "목 라인",
  },
};

const faceGuideDirectionProfiles = {
  jawline: {
    source: "jaw",
    primary: "jawline",
    guideLabel: "턱선 정렬",
    direction: "턱 중심에서 입가·귀밑 방향으로 길게 밀어 귀 밑 라인으로 정리해요.",
    route: "턱 중심 → 입가 → 귀 밑",
    routeLabel: "턱선 라인",
  },
  jaw: {
    source: "jaw",
    primary: "jaw",
    guideLabel: "턱선 라인",
    direction: "턱 중앙에서 입가를 지나 귀 밑으로 부드럽게 마무리해요.",
    route: "턱 중심 → 입가 → 귀 밑",
    routeLabel: "턱선 라인",
  },
  cheek: {
    source: "cheek",
    primary: "cheek",
    guideLabel: "광대 라인",
    direction: "코 옆에서 관자 방향으로 바깥쪽으로 밀어요.",
    route: "코 옆 → 관자 → 바깥",
    routeLabel: "광대 라인",
  },
  cheekbone: {
    source: "cheekbone",
    primary: "cheekbone",
    guideLabel: "광대뼈",
    direction: "광대 뼈 상단을 따라 볼 중앙에서 바깥으로 열어주세요.",
    route: "볼 중앙 → 바깥",
    routeLabel: "광대뼈 라인",
  },
  forehead: {
    source: "brow",
    primary: "brow",
    guideLabel: "이마 정렬",
    direction: "눈썹 위에서 헤어라인 방향으로 길게 정렬해요.",
    route: "눈썹 위 → 헤어라인",
    routeLabel: "이마 정렬 라인",
  },
  brow: {
    source: "brow",
    primary: "brow",
    guideLabel: "이마 마감",
    direction: "눈썹 라인을 따라 바깥 방향으로 미세하게 마감해요.",
    route: "눈썹 시작 → 바깥",
    routeLabel: "이마 마감",
  },
  neck: {
    source: "neck",
    primary: "neck",
    guideLabel: "목 라인",
    direction: "귀 아래에서 쇄골 아래로 천천히 내려 편안한 느낌을 확인해요.",
    route: "귀 아래 → 쇄골",
    routeLabel: "목 라인",
  },
};

const faceGuideAdviceCatalog = {
  puffiness: {
    title: "얼굴 컨디션 정돈 루틴",
    copy: "오늘은 얼굴 컨디션을 가볍게 확인하는 짧은 루틴이 잘 맞아요.",
  },
  jawline: {
    title: "턱선 준비 루틴",
    copy: "턱선과 볼 주변을 부드럽게 확인하는 5분 루틴으로 시작해요.",
  },
  tension: {
    title: "목선 마감 루틴",
    copy: "저자극 가이드로 목선-쇄골 동선을 천천히 진행해요.",
  },
  redness: {
    title: "조심조심 루틴",
    copy: "초보자용 저자극 가이드로 피부가 준비된 상태에서 진행하세요.",
  },
};

const faceGuideHeadlineCatalog = {
  puffiness: "오늘 얼굴 컨디션을 낮은 압력으로 가볍게 확인해요.",
  jawline: "턱선이 회의 참석 준비 중입니다.",
  cheek: "볼 주변을 부드럽게 환기하는 루틴이 잘 맞아요.",
  cheekbone: "광대 주변 방향을 부드럽게 확인하는 가이드가 적합해요.",
  forehead: "이마 주변 감각을 부드럽게 확인해요.",
  tension: "목선 먼저 살려두는 저자극 가이드.",
  redness: "오늘은 조심조심 저자극 가이드.",
  default: "오늘은 부드러운 루틴으로 가볍게 시작해요.",
};

function getFaceAdviceHeadline(profile, topPriority) {
  const concern = faceGuideAdviceCatalog[profile?.mainConcern] ? profile.mainConcern : "default";
  return faceGuideHeadlineCatalog[topPriority] || faceGuideHeadlineCatalog[concern] || faceGuideHeadlineCatalog.default;
}

function getFaceGuideAdvice(profile, recommendationPriority) {
  if (faceGuideAdviceCatalog[profile.mainConcern]) {
    return {
      title: faceGuideAdviceCatalog[profile.mainConcern].title,
      copy: faceGuideAdviceCatalog[profile.mainConcern].copy,
    };
  }
  const key = recommendationPriority === "jawline" || recommendationPriority === "jaw"
    ? "jawline"
    : recommendationPriority === "cheekbone" || recommendationPriority === "cheek"
      ? "puffiness"
      : recommendationPriority === "forehead"
        ? "redness"
        : recommendationPriority === "neck"
          ? "tension"
          : "puffiness";
  return {
    title: faceGuideAdviceCatalog[key].title,
    copy: recommendationPriority === "forehead"
      ? "초보자용 저자극 가이드로 상태를 확인해 가볍게 시작하세요."
      : faceGuideAdviceCatalog[key].copy,
  };
}

class FaceGuideState {
  constructor(overrides = {}) {
    Object.assign(this, {
      status: "idle",
      lastRunSummary: null,
      detectorSource: null,
      fallbackReason: null,
      lastScanQuality: null,
      scanFailureReason: null,
      sourceType: "camera",
      sourceLabel: "카메라",
      scanReady: false,
      scanImageData: null,
      scanRecommendation: null,
      recommendationVersion: 0,
      recommendation: null,
      scanPrimaryZone: "all",
      scanResult: null,
      routineId: null,
      activeZone: "all",
      mode: "idle",
      running: false,
      runningSeconds: 0,
      lastError: null,
      scanFrameReady: false,
    }, overrides);
  }

  toSnapshot() {
    return {
      status: this.status,
      lastRunSummary: this.lastRunSummary,
      detectorSource: this.detectorSource,
      fallbackReason: this.fallbackReason,
      lastScanQuality: this.lastScanQuality,
      scanFailureReason: this.scanFailureReason,
      sourceType: this.sourceType,
      sourceLabel: this.sourceLabel,
      scanReady: Boolean(this.scanReady),
      scanImageData: this.scanImageData || null,
      scanRecommendation: this.scanRecommendation,
      recommendationVersion: Number(this.recommendationVersion || 0),
      recommendation: this.recommendation,
      routineId: this.routineId,
      scanPrimaryZone: this.scanPrimaryZone || "all",
      activeZone: this.activeZone || "all",
      mode: this.mode,
      scanResult: this.scanResult,
      running: Boolean(this.running),
      lastError: this.lastError,
      scanFrameReady: Boolean(this.scanFrameReady),
      runningSeconds: Math.max(0, Number(this.runningSeconds || 0)),
    };
  }
}

function getFaceStepMeta(step = {}) {
  const zone = toFaceZone(step.zone || "all");
  const profile = faceGuideDirectionProfiles[zone] || faceGuideDirectionProfiles[toFaceZone(zone)] || {};
  const direction = faceDirectionMap[zone] || faceDirectionMap[toFaceZone(zone)] || {};
  const label = profile.guideLabel || profile.label || "";
  const fallbackPressure = step.pressure || getProfilePressureMode();
  const guideLabel = label || faceZoneLabelMap[zone] || "가이드";
  const zoneDisplay = faceZoneLabelMap[zone] || zoneNames[zone] || zone || "전체";
  const route = profile.route || direction.route || "연결 흐름";
  const routeLabel = profile.routeLabel || direction.routeLabel || "연결 라인";
  const routeNormalized = String(route || "연결 흐름").replace(/->/g, "→");
  const guideRouteSteps = Array.isArray(step.guideRouteSteps)
    ? step.guideRouteSteps
    : routeNormalized.split("→").map((part) => part.trim()).filter(Boolean);
  const routeSummary = routeStepsText(guideRouteSteps, routeLabel);
  return {
    zone: zone,
    zoneLabel: zoneDisplay,
    zoneDisplay,
    direction: profile.direction || direction.direction || faceZoneHintMap[zone] || step.cue || "부드럽게 가이드 방향을 따라 진행하세요.",
    guideLabel,
    guideRoute: route,
    guideRouteLabel: routeLabel,
    guideRouteSteps,
    guideRouteSummary: routeSummary,
    zoneProfile: profile,
    directionProfile: direction,
    guideArrowLabel: `${guideLabel} 가이드`,
    repeat: direction.repeat || step.strokes || "8회",
    intensity: direction.intensity || step.pressure || fallbackPressure || "보통",
    progressLabel: "현재 동선",
  };
}

function routeStepsText(steps = [], fallbackLabel = "동선") {
  if (!Array.isArray(steps) || steps.length === 0) return fallbackLabel;
  const normalized = steps.map((step) => String(step || "").trim()).filter(Boolean);
  return normalized.length
    ? `${fallbackLabel} · ${normalized.join(" → ")}`
    : fallbackLabel;
}

function toFiniteNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeFacePoint(point, sourceWidth = 1, sourceHeight = 1) {
  const x = toFiniteNumber(point?.x);
  const y = toFiniteNumber(point?.y);
  if (x === null || y === null) return null;
  const isNormalized = x >= -0.2 && x <= 1.2 && y >= -0.2 && y <= 1.2;
  return {
    x: isNormalized ? x * sourceWidth : x,
    y: isNormalized ? y * sourceHeight : y,
  };
}

function isFinitePoint(point) {
  const x = toFiniteNumber(point?.x);
  const y = toFiniteNumber(point?.y);
  return x !== null && y !== null && Number.isFinite(x) && Number.isFinite(y);
}

function sanitizeFacePoints(points, width, height, minimum = 2) {
  if (!Array.isArray(points)) return [];
  const sourceW = Math.max(1, Number(width || 1));
  const sourceH = Math.max(1, Number(height || 1));
  const filtered = points
    .map((point) => normalizeFacePoint(point, sourceW, sourceH))
    .filter((point) => {
      if (!point || !isFinitePoint(point)) return false;
      return point.x >= -sourceW * 0.1 && point.x <= sourceW * 1.1
        && point.y >= -sourceH * 0.1 && point.y <= sourceH * 1.1;
    });
  return filtered.length >= minimum ? filtered : [];
}

function hasUsableFaceScanResult(scanResult) {
  return getFaceScanFailureReason(scanResult) === null;
}

function getFaceScanFailureReason(scanResult) {
  const width = toFiniteNumber(scanResult?.width) || 0;
  const height = toFiniteNumber(scanResult?.height) || 0;
  const confidence = Number(scanResult?.confidence || 0);
  const points = scanResult?.points || {};
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return "이미지 크기를 확인하지 못했습니다. 다시 촬영하거나 업로드해 주세요.";
  }
  if (width < FACE_SCAN_MIN_DIMENSION || height < FACE_SCAN_MIN_DIMENSION) {
    return "이미지가 너무 작아서 참고 동선 기준을 안정적으로 잡지 못했습니다.";
  }
  if (!Number.isFinite(confidence) || confidence < FACE_SCAN_QUALITY_THRESHOLD) {
    return "참고 동선 기준이 약합니다. 빛을 조금 더 키워서 다시 시도해 주세요.";
  }
  const requiredZones = ["jaw", "cheek", "cheekbone", "forehead", "neck", "brow"];
  const allPoints = Object.values(points || {}).flatMap((zonePoints) => Array.isArray(zonePoints) ? zonePoints : []);
  const inBoundsPoints = allPoints.filter((point) => {
    const x = toFiniteNumber(point?.x);
    const y = toFiniteNumber(point?.y);
    return Number.isFinite(x) && Number.isFinite(y)
      && x >= -width * 0.18 && x <= width * 1.18
      && y >= -height * 0.18 && y <= height * 1.18;
  });
  if (inBoundsPoints.length < FACE_SCAN_MIN_POINT_COUNT) {
    return "동선 기준점이 충분하지 않습니다. 정면 이미지가 프레임을 충분히 채우도록 맞춰 주세요.";
  }
  const quality = scanResult?.quality || {};
  if (quality.pointRatio !== undefined) {
    const pointRatio = Number(quality.pointRatio);
    if (Number.isFinite(pointRatio)
      && (pointRatio < FACE_SCAN_MIN_POINT_RATIO || pointRatio > FACE_SCAN_MAX_POINT_RATIO)) {
      return "참고 동선 기준이 불안정합니다. 정면으로 다시 시도해 주세요.";
    }
  }
  const requiredPoints = requiredZones.every((key) => {
    const zonePoints = sanitizeFacePoints(points?.[key], width, height, 2);
    return Array.isArray(zonePoints) && zonePoints.length >= 2;
  });
  if (!requiredPoints) {
    return "참고 동선 기준 일부가 부족합니다. 밝은 정면 사진으로 다시 시도해 주세요.";
  }
  const sourceType = String(scanResult?.source || "").toLowerCase();
  if (!sourceType) return "참고 가이드 결과 유형이 확인되지 않습니다.";
  if (isReferenceFaceScanResult(scanResult) && !allowsReferenceFaceGuide()) {
    return FACE_SCAN_REAL_MODEL_REQUIRED_MESSAGE;
  }
  return null;
}

function isFaceScanQualityDetectionError(error) {
  const message = String(error || "").toLowerCase();
  return message.includes("no_face")
    || message.includes("no face")
    || message.includes("notfound")
    || message.includes("insufficient_face_landmarks")
    || message.includes("face_scan_quality");
}

function isFaceScanModelError(error) {
  const message = String(error || "").toLowerCase();
  if (isFaceScanQualityDetectionError(message)) {
    return false;
  }
  return message.includes("real_model")
    || message.includes("real_provider")
    || message.includes("real_detect_not_available")
    || message.includes("real_model_required")
    || message.includes("mediaPipe".toLowerCase())
    || message.includes("face landmarker");
}

function getFaceScanStatusForError(error) {
  const message = String(error || "").toLowerCase();
  if (message.includes("no_face") || message.includes("insufficient_face_landmarks")) {
    return "photo-quality-error";
  }
  if (message.includes("real_model_asset_missing") || message.includes("real_model_required")) {
    return "model-missing";
  }
  if (message.includes("real_model_runtime_missing")) {
    return "model-runtime-missing";
  }
  if (message.includes("real_model_init_failed")
    || message.includes("real_detect_not_available")
    || message.includes("real_provider")) {
    return "model-error";
  }
  return "photo-quality-error";
}

function getFaceScanErrorMessage(error) {
  const message = String(error || "").toLowerCase();
  if (message.includes("no_face") || message.includes("notfound")) {
    return "참고 동선 기준을 충분히 찾지 못했습니다. 밝은 정면 사진으로 다시 시도해 주세요.";
  }
  if (message.includes("insufficient_face_landmarks")) {
    return "실제 얼굴 기준점이 충분하지 않습니다. 밝은 정면 사진으로 다시 시도해 주세요.";
  }
  if (message.includes("real_model_asset_missing") || message.includes("real_model_required")) {
    return FACE_SCAN_MODEL_MISSING_MESSAGE;
  }
  if (message.includes("real_model_runtime_missing")) {
    return FACE_SCAN_RUNTIME_MISSING_MESSAGE;
  }
  if (message.includes("real_model_init_failed")) {
    return "실제 얼굴 랜드마크 모델 초기화에 실패했습니다. 모델 파일과 MediaPipe WASM 경로를 확인해 주세요.";
  }
  if (message.includes("real_detect_not_available") || message.includes("real_provider")) {
    return "실제 얼굴 랜드마크 감지를 사용할 수 없습니다. 모델과 런타임을 확인한 뒤 다시 시도해 주세요.";
  }
  if (message.includes("small") || message.includes("dimension")) {
    return "이미지가 너무 작거나 정면 기준이 충분히 보이지 않습니다. 더 가까이에서 다시 촬영해 주세요.";
  }
  if (message.includes("quality") || message.includes("low")) {
    return "표시 기준 품질이 낮습니다. 조명과 프레임을 조정한 뒤 재시도하세요.";
  }
  if (message.includes("permission")) return "카메라 권한이 필요해요. 설정에서 허용 후 다시 시도하세요.";
  if (message.includes("notimplemented") || message.includes("placeholder")) {
    return "현재 참고 동선 모드로 동작 중입니다. 가이드는 계속 진행됩니다.";
  }
  if (message.includes("fallback") || message.includes("provider") || message.includes("offline")) {
    return "실측 랜드마크 연결에 문제가 있습니다. 모델과 런타임을 확인한 뒤 다시 시도해 주세요.";
  }
  if (message.includes("quality") || message.includes("point") || message.includes("ratio")) {
    return "참고 동선 기준을 안정적으로 잡지 못했어요. 정면 이미지가 프레임의 2/3 이상 차도록 맞춰 주세요.";
  }
  if (message.includes("network") || message.includes("offline")) {
    return "네트워크 상태를 확인하고 다시 시도해 주세요.";
  }
  return "참고 동선 기준을 다시 확인하고 업로드 또는 카메라 각도를 조정해 주세요.";
}

function normalizeFaceGuideQuality(scanResult) {
  const pointCount = Number(scanResult?.quality?.pointCount || 0);
  const quality = scanResult?.quality || {};
  return {
    pointCount,
    pointRatio: Number(quality.pointRatio || 0),
    stable: Boolean(quality.stable),
    sourceConfidence: Number(scanResult?.confidence || 0),
    detectorSource: scanResult?.meta?.detectorSource || scanResult?.source || "mock",
    fallbackReason: quality.fallbackReason || null,
    estimated: Boolean(quality.estimated),
    provider: scanResult?.meta?.provider || scanResult?.meta?.sourceHint || null,
    geometryBounds: quality.faceBounds || null,
  };
}

function isReferenceFaceScanResult(scanResult = {}) {
  const meta = scanResult?.meta || {};
  const quality = scanResult?.quality || {};
  const detectorSource = String(meta.detectorSource || scanResult?.source || "").toLowerCase();
  const provider = String(meta.provider || meta.detectorProvider || "").toLowerCase();
  const fallbackReason = String(quality.fallbackReason || meta.fallbackReason || "").toLowerCase();
  const confidenceSource = String(quality.confidenceSource || meta.confidenceSource || "").toLowerCase();
  return detectorSource === "mock"
    || provider === "mock"
    || confidenceSource === "mock"
    || Boolean(meta.fallbackToMock)
    || fallbackReason.includes("mock")
    || fallbackReason.includes("fallback");
}

function getFaceGuideSourceId(scanResult, sourceType = "camera") {
  const normalizedSource = sourceType === "upload" ? "upload" : "camera";
  return isReferenceFaceScanResult(scanResult)
    ? `${normalizedSource}-reference-guide`
    : `${normalizedSource}-landmark`;
}

function buildFaceGuideLogPayload(activeRoutine, step, durationSeconds, runSeconds) {
  const routine = getRoutineCatalog()[activeRoutine] || getSelectedRoutine();
  const totalSteps = routine?.steps?.length || 0;
  const recommendation = state.faceGuide.recommendation || state.faceGuide.scanRecommendation || {};
  const scanUsed = state.faceGuide.scanUsed || (state.faceGuide.sourceType === "upload" ? "upload" : "camera");
  const stepMeta = getFaceStepMeta(step || {});
  const sourceLabel = getFaceRecommendationSourceLabel(recommendation, state.faceGuide.sourceType);
  const referenceOnly = Boolean(recommendation?.referenceOnly) || isReferenceFaceScanResult(state.faceGuide.scanResult);
  const rawSourceConfidence = Number(
    recommendation?.sourceConfidence != null
      ? recommendation.sourceConfidence
      : Math.round((Number(state.faceGuide.scanResult?.confidence || 0) * 100))
  );
  const sourceConfidence = referenceOnly ? null : rawSourceConfidence;
  const quality = state.faceGuide.scanResult?.quality || {};
  const detectorMeta = state.faceGuide.scanResult?.meta || {};
  const detectorSource = state.faceGuide.scanResult?.meta?.detectorSource
    || state.faceGuide.scanResult?.source
    || state.faceGuide.detectorSource
    || "mock";
  const scanFailureReason = state.faceGuide.scanFailureReason || null;
  const route = stepMeta.guideRoute || "연결 라인";
  const routeLabel = stepMeta.guideRouteLabel || "연결 라인";
  const routeSummary = stepMeta.guideRouteSummary || route;
  const routeSteps = Array.isArray(stepMeta.guideRouteSteps) ? stepMeta.guideRouteSteps : [routeLabel];
  const routeStart = routeSteps[0] || route.split("→")[0] || "시작";
  const routeEnd = routeSteps[routeSteps.length - 1]
    || route.split("→").slice(-1)?.[0]
    || "끝";
  const normalizedQuality = normalizeFaceGuideQuality(state.faceGuide.scanResult);
  return {
    date: new Date().toISOString(),
    routine: activeRoutine || "morning",
    routineName: routine?.title || "참고 가이드",
    zone: stepMeta.zone || "all",
    zoneLabel: stepMeta.zoneDisplay || stepMeta.zoneLabel || "전체",
    duration: Number(runSeconds || durationSeconds || 0),
    completedStep: Math.max(1, Math.min(state.activeStep + 1, totalSteps)),
    totalSteps,
    intensity: stepMeta.intensity || getProfilePressureMode(),
    scanUsed,
    detectorSource,
    sourceConfidence,
    note: referenceOnly
      ? `${sourceLabel} 기준으로 단계형 참고 동선을 구성했습니다. 상태 판정이나 결과 확정은 제공하지 않습니다.`
      : `${sourceLabel} 기준으로 단계형 가이드를 구성했습니다.`,
    sourceFailureReason: scanFailureReason || null,
    guideZone: stepMeta.zone || "all",
    guideZoneLabel: stepMeta.zoneLabel || "전체",
    guideStepName: step?.title || stepMeta.zoneLabel || "준비 단계",
    guideIntensity: stepMeta.intensity || getProfilePressureMode(),
    guideRoute: route,
    guideRouteLabel: routeLabel,
    guideRouteSummary: routeSummary,
    guideRouteStart: routeStart,
    guideRouteEnd: routeEnd,
    guideRouteSteps: routeSteps,
    guideRepeat: stepMeta.repeat,
    guideMode: state.faceGuide.status,
    sourceLabel,
    guidanceSource: sourceLabel,
    scanResultConfidence: sourceConfidence,
    faceGuideDuration: Number(durationSeconds || 0),
    faceGuideRunningSeconds: Number(runSeconds || 0),
    scanQuality: {
      ...quality,
      ...normalizedQuality,
      sourceConfidence,
      referenceOnly,
      detectorSource,
      scanFailureReason,
      pointCount: quality.pointCount || 0,
      pointRatio: quality.pointRatio || 0,
      provider: detectorMeta?.provider || detectorMeta?.sourceHint || null,
      sourceType: detectorMeta?.sourceType || null,
    },
  };
}

function getFaceRecommendationSourceLabel(recommendation = {}, sourceType = null) {
  const source = recommendation?.source || "";
  if (source === "camera-reference-guide") {
    return "카메라 참고 동선";
  }
  if (source === "upload-reference-guide") {
    return "사진 참고 동선";
  }
  if (source === "mock-face-landmark") {
    return "QA 참고 동선";
  }
  if (source === "camera-landmark" || source === "camera") {
    return "카메라 참고 가이드";
  }
  if (source === "upload-landmark" || source === "upload") {
    return "사진 참고 가이드";
  }
  if (sourceType === "upload") {
    return "사진 참고 가이드";
  }
  return "참고 동선";
}

class MockFaceDetector {
  getSourceSize(source) {
    return {
      width: Number(source?.videoWidth || source?.naturalWidth || source?.width || source?.offsetWidth || 1024),
      height: Number(source?.videoHeight || source?.naturalHeight || source?.height || source?.offsetHeight || 768),
    };
  }

  normalizeResult(payload) {
    const width = Math.max(1, Math.round(payload.width || 1));
    const height = Math.max(1, Math.round(payload.height || 1));
    const confidence = Number(payload.confidence || 0);
    const points = {
      oval: sanitizeFacePoints(payload.points?.oval || payload.points?.jawline, width, height, 2),
      jaw: sanitizeFacePoints(payload.points?.jaw || payload.points?.jawline, width, height, 2),
      cheek: sanitizeFacePoints(payload.points?.cheek, width, height, 2),
      cheekbone: sanitizeFacePoints(payload.points?.cheekbone, width, height, 2),
      brow: sanitizeFacePoints(payload.points?.brow || payload.points?.forehead, width, height, 2),
      forehead: sanitizeFacePoints(payload.points?.forehead || payload.points?.brow, width, height, 2),
      neck: sanitizeFacePoints(payload.points?.neck, width, height, 2),
    };
    const pointCount = Object.values(points).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
    const quality = {
      ...(payload.quality || {}),
      pointCount,
      pointRatio: pointCount > 0 ? Number((pointCount / 72).toFixed(3)) : 0,
      sourceResolution: `${width}x${height}`,
      stable: confidence > 0.45 && pointCount >= 24,
    };
    return {
      width,
      height,
      source: String(payload.source || "mock"),
      confidence: Math.max(0, Math.min(1, confidence)),
      points,
      metrics: {
        jawline: Number(payload.metrics?.jawline || 0),
        cheek: Number(payload.metrics?.cheek || 0),
        cheekbone: Number(payload.metrics?.cheekbone || 0),
        forehead: Number(payload.metrics?.forehead || 0),
        neck: Number(payload.metrics?.neck || 0),
      },
      quality,
      meta: {
        ...(payload.meta || {}),
        detectorSource: "mock",
        protocolVersion: "1.0",
        estimated: false,
      },
    };
  }

  async detect(source) {
    const { width, height } = this.getSourceSize(source);
    const sourceLabel = source instanceof HTMLImageElement ? "image" : source?.tagName ? "camera" : "upload";
    if (width < 220 || height < 220) {
      return this.normalizeResult({
        width,
        height,
        source: "mock",
        confidence: 0.02,
        reason: "too-small",
        points: {
          oval: [],
          jaw: [],
          cheek: [],
          cheekbone: [],
          brow: [],
          forehead: [],
          neck: [],
        },
        metrics: {
          jawline: 0,
          cheek: 0,
          cheekbone: 0,
          forehead: 0,
          neck: 0,
        },
        quality: {
          fallbackReason: "소스 크기가 너무 작아 실제 좌표 유추에 부적합",
          stable: false,
        },
        meta: {
          adapterSource: sourceLabel,
        },
      });
    }
    const ratio = Math.min(1, Math.max(0.45, width / Math.max(1, height)));
    const widthRatio = 0.25 + (ratio - 0.45) * 0.06;
    const jitter = 0.02 + (width % 11) / 300;
    const cx = width * 0.5;
    const cy = height * 0.62;
    const ovalHeight = height * (0.32 + jitter * 0.6);
    const half = width * (0.18 + widthRatio);
    return this.normalizeResult({
      width,
      height,
      source: "mock",
      confidence: Number((0.93 + jitter * 0.05).toFixed(3)),
      points: {
        oval: [
          { x: cx - half * 0.15, y: cy - ovalHeight * 0.33 },
          { x: cx - half * 0.35, y: cy - ovalHeight * 0.15 },
          { x: cx - half * 0.52, y: cy + ovalHeight * 0.15 },
          { x: cx - half * 0.45, y: cy + ovalHeight * 0.42 },
          { x: cx - half * 0.12, y: cy + ovalHeight * 0.72 },
          { x: cx + half * 0.12, y: cy + ovalHeight * 0.72 },
          { x: cx + half * 0.45, y: cy + ovalHeight * 0.42 },
          { x: cx + half * 0.52, y: cy + ovalHeight * 0.15 },
          { x: cx + half * 0.35, y: cy - ovalHeight * 0.15 },
          { x: cx + half * 0.15, y: cy - ovalHeight * 0.33 },
        ],
        jaw: [
          { x: cx - half * 0.4, y: cy + ovalHeight * 0.4 },
          { x: cx - half * 0.15, y: cy + ovalHeight * 0.72 },
          { x: cx + half * 0.15, y: cy + ovalHeight * 0.72 },
          { x: cx + half * 0.4, y: cy + ovalHeight * 0.4 },
        ],
        cheek: [
          { x: cx - half * 0.42, y: cy - ovalHeight * 0.02 },
          { x: cx - half * 0.64, y: cy + ovalHeight * 0.15 },
          { x: cx - half * 0.34, y: cy + ovalHeight * 0.43 },
          { x: cx + half * 0.34, y: cy + ovalHeight * 0.43 },
          { x: cx + half * 0.64, y: cy + ovalHeight * 0.15 },
          { x: cx + half * 0.42, y: cy - ovalHeight * 0.02 },
        ],
        cheekbone: [
          { x: cx - half * 0.48, y: cy - ovalHeight * 0.06 },
          { x: cx - half * 0.74, y: cy + ovalHeight * 0.08 },
          { x: cx - half * 0.5, y: cy + ovalHeight * 0.48 },
          { x: cx + half * 0.5, y: cy + ovalHeight * 0.48 },
          { x: cx + half * 0.74, y: cy + ovalHeight * 0.08 },
          { x: cx + half * 0.48, y: cy - ovalHeight * 0.06 },
        ],
        brow: [
          { x: cx - half * 0.3, y: cy - ovalHeight * 0.25 },
          { x: cx + half * 0.3, y: cy - ovalHeight * 0.25 },
        ],
        forehead: [
          { x: cx - half * 0.28, y: cy - ovalHeight * 0.28 },
          { x: cx - half * 0.14, y: cy - ovalHeight * 0.34 },
          { x: cx + half * 0.14, y: cy - ovalHeight * 0.34 },
          { x: cx + half * 0.28, y: cy - ovalHeight * 0.28 },
        ],
        neck: [
          { x: cx - half * 0.25, y: cy + ovalHeight * 0.72 },
          { x: cx + half * 0.25, y: cy + ovalHeight * 0.72 },
          { x: cx + half * 0.33, y: cy + ovalHeight * 0.95 },
          { x: cx - half * 0.33, y: cy + ovalHeight * 0.95 },
        ],
      },
      metrics: {
        jawline: Number((0.5 + jitter).toFixed(2)),
        cheek: Number((0.55 + jitter * 0.6).toFixed(2)),
        cheekbone: Number((0.45 + jitter * 0.8).toFixed(2)),
        forehead: Number((0.48 + jitter * 0.7).toFixed(2)),
        neck: Number((0.6 + jitter * 0.5).toFixed(2)),
      },
      quality: {
        sourceType: sourceLabel,
        fallbackReason: "mock",
        stable: true,
        pointRatio: 1,
      },
      meta: {
        detectorProvider: "mock",
      },
    });
  }
}

class RealFaceDetector {
  constructor() {
    this.providers = {
      mediapipe: {
        state: "not-loaded",
        sourceHint: "MediaPipe Face Landmarker",
        modelAssetPath: FACE_SCAN_MODEL_ASSET_PATH,
        wasmAssetPath: FACE_SCAN_WASM_ASSET_PATH,
        detector: null,
        initPromise: null,
      },
      tfjs: {
        state: "not-loaded",
        sourceHint: "TF.js face-landmarks-detection",
        detector: null,
      },
    };
    this.providerModelHints = {
      mediapipe: FACE_SCAN_MODEL_ASSET_PATH,
      tfjs: "./assets/models/tfjs/face-landmarker/",
    };
    this.assetChecks = new Map();
    this.runtimePromise = null;
    this.providers.mediapipe.modelAssetPath = this.providerModelHints.mediapipe;
  }

  async detect(source, options = {}) {
    const {
      preferReal = true,
      providers = FACE_SCAN_PREFERRED_PROVIDERS,
      detectorSource = "scan",
      fallbackToMock = true,
    } = options;
    if (!preferReal) {
      const fallbackReason = this.providers.mediapipe.lastError || this.providers.tfjs?.lastError;
      throw new Error(`real_disabled:${fallbackReason || "Real detector is disabled"}`);
    }
    const { width, height } = this.getSourceSize(source);
    const sourceType = source?.tagName === "VIDEO"
      ? "camera"
      : source?.tagName === "IMG"
        ? "image"
        : "upload";
    const providerList = Array.isArray(providers) && providers.length ? providers : FACE_SCAN_PREFERRED_PROVIDERS;
    const order = providerList.includes("mediapipe")
      ? ["mediapipe", ...providerList.filter((item) => item !== "mediapipe")]
      : providerList;
    const errors = [];
    for (const provider of order) {
      if (!provider || provider === "mock") continue;
      try {
        const raw = await this.detectWithProvider(provider, source, {
          width,
          height,
          sourceType,
          detectorSource,
        });
        return this.normalizeResult(raw, {
          width,
          height,
          source: provider,
          detectorSource,
        });
      } catch (error) {
        const providerName = String(provider || "unknown");
        if (isFaceScanQualityDetectionError(error?.message || error)) {
          throw error;
        }
        const providerState = this.providers[providerName];
        if (providerState) {
          providerState.state = "error";
          providerState.lastError = error?.message || "unknown";
        }
        errors.push({ provider: providerName, message: error?.message || "unknown" });
      }
    }
    if (!fallbackToMock) {
      const detail = errors.length
        ? `${errors.map((entry) => `${entry.provider}: ${entry.message}`).join(" | ")} (providers: ${order.join(", ")})`
        : "no provider";
      throw new Error(`REAL_DETECT_NOT_AVAILABLE: ${detail}`);
    }
    return this.mockedFallback(width, height, detectorSource, {
      fallbackReason: "no-real-provider-ready",
      attemptedProviders: order.join(","),
    });
  }

  getSourceSize(source) {
    return {
      width: Number(source?.videoWidth || source?.naturalWidth || source?.width || source?.offsetWidth || 1024),
      height: Number(source?.videoHeight || source?.naturalHeight || source?.height || source?.offsetHeight || 768),
    };
  }

  async detectWithProvider(provider, source, context = {}) {
    if (provider === "mediapipe") {
      return this.detectWithMediaPipe(source, context);
    }
    if (provider === "tfjs") {
      return this.detectWithTfJs(source, context);
    }
    throw new Error(`지원되지 않는 real provider: ${provider}`);
  }

  async detectWithMediaPipe(source) {
    const mediapipe = this.providers.mediapipe;
    await this.ensureMediaPipeDetector();
    const detector = mediapipe.detector;
    const detectApi = detector?.detect;
    if (!detector || typeof detectApi !== "function") {
      mediapipe.state = "unavailable";
      throw new Error("MediaPipe 디텍터가 준비되지 않았습니다.");
    }
    const canvas = await this.toCanvas(source);
    const start = performance.now();
    const result = await detectApi.call(detector, canvas);
    mediapipe.state = "ready";
    if (!result) {
      mediapipe.state = "error";
      throw new Error("MediaPipe 추론 결과가 비어 있습니다.");
    }
    const landmarkSet = result.faceLandmarks || result.faceLandmarkerResult?.faceLandmarks || [];
    const rawLandmarks = Array.isArray(landmarkSet) && landmarkSet.length
      ? landmarkSet[0]
      : Array.isArray(landmarkSet)
        ? landmarkSet
        : [];
    if (!Array.isArray(rawLandmarks) || rawLandmarks.length < 1) {
      throw new Error("no_face_detected");
    }
    return {
      faceLandmarks: rawLandmarks,
      quality: {
        provider: "mediapipe",
        sourceHint: mediapipe.sourceHint,
        latencyMs: Math.max(0, Math.round(performance.now() - start)),
      },
      confidence: 0.84,
      meta: {
        provider: "mediapipe",
        sourceHint: mediapipe.sourceHint,
        state: mediapipe.state,
        modelAssetPath: mediapipe.modelAssetPath,
        delegate: mediapipe.delegate || null,
      },
    };
  }

  async detectWithTfJs(_source) {
    const tfjs = this.providers.tfjs;
    tfjs.state = "unavailable";
    throw new Error("TF.js face-landmarks-detection provider는 플레이스홀더 상태입니다.");
  }

  async ensureMediaPipeDetector() {
    const mediapipe = this.providers.mediapipe;
    if (mediapipe.detector) return;
    if (mediapipe.state === "loading" && mediapipe.initPromise) return mediapipe.initPromise;
    if (typeof mediapipe.modelAssetPath !== "string" || !mediapipe.modelAssetPath.trim()) {
      mediapipe.state = "unavailable";
      throw new Error(`REAL_MODEL_ASSET_MISSING:${FACE_SCAN_MODEL_MISSING_MESSAGE}`);
    }
    await this.assertAssetAvailable(mediapipe.modelAssetPath, "model");
    const taskRuntime = await this.loadMediaPipeRuntime();
    const faceLandmarker = taskRuntime?.FaceLandmarker || taskRuntime || window.FaceLandmarker;
    const visionResolver = taskRuntime?.FilesetResolver || window.FilesetResolver;
    const createFromOptions = faceLandmarker?.createFromOptions;
    if (!faceLandmarker || !visionResolver || typeof createFromOptions !== "function") {
      mediapipe.state = "unavailable";
      throw new Error(`REAL_MODEL_RUNTIME_MISSING:${FACE_SCAN_RUNTIME_MISSING_MESSAGE}`);
    }
    const forVisionTasks = visionResolver?.forVisionTasks;
    if (typeof forVisionTasks !== "function") {
      mediapipe.state = "unavailable";
      throw new Error(`REAL_MODEL_RUNTIME_MISSING:${FACE_SCAN_RUNTIME_MISSING_MESSAGE}`);
    }
    mediapipe.state = "loading";
    mediapipe.initPromise = (async () => {
      const vision = await forVisionTasks.call(visionResolver, mediapipe.wasmAssetPath || FACE_SCAN_WASM_ASSET_PATH);
      const createDetector = (delegate) => createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: mediapipe.modelAssetPath,
          delegate,
        },
        runningMode: "IMAGE",
        numFaces: 1,
        minFaceDetectionConfidence: 0.12,
        minFacePresenceConfidence: 0.12,
        minTrackingConfidence: 0.12,
      });
      try {
        mediapipe.detector = await createDetector("CPU");
        mediapipe.delegate = "CPU";
      } catch (cpuError) {
        mediapipe.lastCpuError = cpuError?.message || "unknown";
        mediapipe.detector = await createDetector("GPU");
        mediapipe.delegate = "GPU";
      }
      mediapipe.state = "ready";
      return mediapipe.detector;
    })();
    try {
      await mediapipe.initPromise;
    } catch (error) {
      mediapipe.state = "error";
      mediapipe.lastError = error?.message || "unknown";
      throw new Error(`REAL_MODEL_INIT_FAILED: MediaPipe 초기화 실패: ${error?.message || "unknown"}`);
    } finally {
      mediapipe.initPromise = null;
    }
    return mediapipe.detector;
  }

  async loadMediaPipeRuntime() {
    const globalRuntime = window.FaceLandmarker || window.faceLandmarker || window.vision;
    const globalResolver = globalRuntime?.FilesetResolver || window.FilesetResolver;
    if (globalRuntime && globalResolver) {
      return globalRuntime;
    }
    if (this.runtimePromise) return this.runtimePromise;
    this.runtimePromise = import(FACE_SCAN_RUNTIME_MODULE_URL)
      .then((runtimeModule) => {
        if (!runtimeModule?.FaceLandmarker || !runtimeModule?.FilesetResolver) {
          throw new Error("MediaPipe runtime module shape mismatch");
        }
        window.FaceLandmarker = runtimeModule.FaceLandmarker;
        window.FilesetResolver = runtimeModule.FilesetResolver;
        return runtimeModule;
      })
      .catch((error) => {
        this.runtimePromise = null;
        throw new Error(`REAL_MODEL_RUNTIME_MISSING:${FACE_SCAN_RUNTIME_MISSING_MESSAGE} (${error?.message || "import failed"})`);
      });
    return this.runtimePromise;
  }

  async assertAssetAvailable(assetPath, label = "asset") {
    const normalizedPath = String(assetPath || "").trim();
    if (!normalizedPath) {
      throw new Error(`REAL_MODEL_ASSET_MISSING:${FACE_SCAN_MODEL_MISSING_MESSAGE}`);
    }
    if (this.assetChecks.has(normalizedPath)) {
      return this.assetChecks.get(normalizedPath);
    }
    const check = (async () => {
      if (typeof fetch !== "function") {
        throw new Error(`REAL_MODEL_ASSET_MISSING:${FACE_SCAN_MODEL_MISSING_MESSAGE}`);
      }
      let response;
      try {
        response = await fetch(normalizedPath, { method: "HEAD", cache: "no-store" });
      } catch (error) {
        throw new Error(`REAL_MODEL_ASSET_MISSING:${FACE_SCAN_MODEL_MISSING_MESSAGE} (${label}: ${error?.message || "fetch failed"})`);
      }
      if (!response || !response.ok) {
        throw new Error(`REAL_MODEL_ASSET_MISSING:${FACE_SCAN_MODEL_MISSING_MESSAGE} (${label}: ${response?.status || "missing"})`);
      }
      return true;
    })();
    this.assetChecks.set(normalizedPath, check);
    try {
      return await check;
    } catch (error) {
      this.assetChecks.delete(normalizedPath);
      throw error;
    }
  }

  normalizeResult(raw, context = {}) {
    if (!raw) {
      throw new Error("real provider returned empty result");
    }
    const { width, height, source, detectorSource = "scan" } = context;
    if (raw.points) {
      return this.packageResult(raw.points, raw.metrics, raw.quality, {
        confidence: raw.confidence,
        source,
        width,
        height,
        meta: raw.meta,
        detectorSource,
      });
    }
    if (raw.faceLandmarks || raw.landmarks) {
      const landmarkPayload = raw.landmarks || raw.faceLandmarks;
      const face = Array.isArray(landmarkPayload?.[0])
        ? landmarkPayload[0]
        : landmarkPayload;
      return this.normalizeMediaPipeLandmarks(face, width, height, source, { detectorSource });
    }
    throw new Error("real detector output shape mismatch");
  }

  normalizeMediaPipeLandmarks(points, width, height, sourceName = "mediapipe", estimateMeta = {}) {
    const sourcePoints = Array.isArray(points) ? points : [];
    if (!Array.isArray(sourcePoints) || !sourcePoints.length) {
      throw new Error("NO_FACE_DETECTED: 실제 얼굴 랜드마크를 찾지 못했습니다.");
    }
    const normalized = sourcePoints.map((point) => normalizeFacePoint(point, width, height));
    const finite = normalized.filter((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y));
    if (finite.length < 12) {
      throw new Error("INSUFFICIENT_FACE_LANDMARKS: 실제 얼굴 기준점이 충분하지 않습니다.");
    }
    const minX = Math.min(...finite.map((point) => point.x));
    const maxX = Math.max(...finite.map((point) => point.x));
    const minY = Math.min(...finite.map((point) => point.y));
    const maxY = Math.max(...finite.map((point) => point.y));
    const cx = (minX + maxX) / 2;
    const faceWidth = Math.max(1, maxX - minX);
    const faceHeight = Math.max(1, maxY - minY);
    const jaw = finite.filter((point) => point.y >= minY + faceHeight * 0.64);
    const cheek = finite.filter((point) => point.y >= minY + faceHeight * 0.34 && point.y <= minY + faceHeight * 0.74);
    const cheekbone = finite.filter((point) => point.y >= minY + faceHeight * 0.26 && point.y <= minY + faceHeight * 0.58);
    const forehead = finite.filter((point) => point.y >= minY + faceHeight * 0.02 && point.y <= minY + faceHeight * 0.33);
    const brow = finite.filter((point) => point.y >= minY + faceHeight * 0.08 && point.y <= minY + faceHeight * 0.26);
    const zoneCoverageFallback = [jaw, cheek, cheekbone, forehead].some((zone) => zone.length < 2);
    const jawline = pickRepresentativeLine(
      reorderPointsAlongX(jaw.length >= 4 ? jaw : finite.filter((point) => point.y >= minY + faceHeight * 0.58)),
      8
    );
    const estimatedNeck = estimateNeckFromFaceBounds(finite, width, height);
    const cheekOrder = reorderPointsAlongX(cheek.length >= 4 ? cheek : finite);
    const cheekboneOrder = reorderPointsAlongX(cheekbone.length >= 4 ? cheekbone : finite);
    const foreheadOrder = reorderPointsAlongX(forehead.length >= 3 ? forehead : finite);
    const browOrder = reorderPointsAlongX(brow.length >= 3 ? brow : finite);
    const faceOval = finite.filter((point) => {
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return false;
      const dy = Math.abs(point.y - ((minY + maxY) / 2));
      const dx = Math.abs(point.x - cx);
      return (dx / faceWidth) + (dy / faceHeight) < 0.72;
    });
    return this.packageResult({
      jaw: jawline,
      cheek: pickRepresentativeLine(cheekOrder, 10),
      cheekbone: pickRepresentativeLine(cheekboneOrder, 10),
      forehead: pickRepresentativeLine(foreheadOrder, 7),
      brow: pickRepresentativeLine(browOrder, 5),
      neck: estimatedNeck,
      oval: pickRepresentativeLine(faceOval.length >= 6 ? faceOval : finite, 14),
    }, {
      jawline: jawline.length ? Math.min(0.98, 0.45 + jawline.length / 24) : 0.28,
      cheek: cheek.length ? Math.min(0.98, 0.46 + cheek.length / 28) : 0.22,
      cheekbone: cheekbone.length ? Math.min(0.98, 0.43 + cheekbone.length / 28) : 0.2,
      forehead: forehead.length ? Math.min(0.98, 0.4 + forehead.length / 28) : 0.2,
      neck: estimatedNeck.length ? 0.56 : 0.3,
    }, {
      fallbackReason: zoneCoverageFallback ? "real-provider-partial-estimation" : "real-provider-mapped",
      estimated: true,
      faceBounds: {
        minX,
        maxX,
        minY,
        maxY,
        cx,
        faceWidth,
        faceHeight,
      },
      stable: !zoneCoverageFallback,
    }, {
      confidence: zoneCoverageFallback ? 0.68 : 0.82,
      source: sourceName,
      width,
      height,
      meta: {
        sourceHint: "실제 provider output mapping 적용",
        sourceType: zoneCoverageFallback ? "real-partial" : "real-mapped",
        provider: sourceName,
        ...(estimateMeta || {}),
        estimatedGeometry: Boolean(zoneCoverageFallback),
        landmarkCount: finite.length,
        pointSpread: {
          width: faceWidth,
          height: faceHeight,
          centerX: cx,
          centerY: (minY + maxY) / 2,
        },
      },
    });
  }

  mockedFallback(width, height, sourceName, estimateMeta = {}) {
    const midW = Math.max(1, width * 0.5);
    const midH = Math.max(1, height * 0.6);
    return this.packageResult({
      jaw: [
        { x: midW - width * 0.18, y: midH + height * 0.11 },
        { x: midW, y: midH + height * 0.19 },
        { x: midW + width * 0.18, y: midH + height * 0.11 },
      ],
      cheek: [
        { x: midW - width * 0.21, y: midH },
        { x: midW + width * 0.21, y: midH },
      ],
      cheekbone: [
        { x: midW - width * 0.26, y: midH + height * 0.02 },
        { x: midW + width * 0.26, y: midH + height * 0.02 },
      ],
      forehead: [
        { x: midW - width * 0.14, y: height * 0.34 },
        { x: midW + width * 0.14, y: height * 0.34 },
      ],
      brow: [
        { x: midW - width * 0.12, y: height * 0.33 },
        { x: midW + width * 0.12, y: height * 0.33 },
      ],
      neck: estimateNeckFromFaceBounds([{ x: midW - width * 0.12, y: midH + 1 }, { x: midW + width * 0.12, y: midH + 1 }], width, height),
      oval: [
        { x: midW - width * 0.08, y: height * 0.3 },
        { x: midW + width * 0.08, y: height * 0.3 },
      ],
    }, {
      jawline: 0.44,
      cheek: 0.46,
      cheekbone: 0.42,
      forehead: 0.4,
      neck: 0.45,
    }, {
      fallbackReason: "real-provider-unavailable",
      stable: false,
      estimated: true,
    }, {
      confidence: 0.35,
      source: sourceName,
      width,
      height,
      meta: {
        sourceHint: "실제 provider 결과 불충분 시 간이 추정 사용",
        provider: sourceName,
        ...(estimateMeta || {}),
      },
    });
  }

  packageResult(points, metrics, quality, payload) {
    const sourceWidth = Number(payload?.width || 1);
    const sourceHeight = Number(payload?.height || 1);
    const resolvedWidth = Number.isFinite(sourceWidth) && sourceWidth > 0 ? sourceWidth : 1024;
    const resolvedHeight = Number.isFinite(sourceHeight) && sourceHeight > 0 ? sourceHeight : 768;
    return this.createResult({
      width: resolvedWidth || 1024,
      height: resolvedHeight || 768,
      confidence: payload?.confidence || 0.45,
      source: payload?.source || "real",
      points,
      metrics,
      quality: {
        ...quality,
      },
      meta: {
        ...(payload?.meta || {}),
        protocolVersion: "1.0",
        detectorSource: payload?.detectorSource || payload?.source || "real",
        provider: payload?.meta?.provider || payload?.meta?.sourceHint || "mediapipe",
      },
    });
  }

  createResult(payload) {
    const width = Math.max(1, Math.round(payload.width || 1));
    const height = Math.max(1, Math.round(payload.height || 1));
    const normalizedPoints = {
      oval: sanitizeFacePoints(payload.points?.oval || [], width, height, 2),
      jaw: sanitizeFacePoints(payload.points?.jaw || [], width, height, 2),
      cheek: sanitizeFacePoints(payload.points?.cheek || [], width, height, 2),
      cheekbone: sanitizeFacePoints(payload.points?.cheekbone || [], width, height, 2),
      brow: sanitizeFacePoints(payload.points?.brow || [], width, height, 2),
      forehead: sanitizeFacePoints(payload.points?.forehead || [], width, height, 2),
      neck: sanitizeFacePoints(payload.points?.neck || [], width, height, 2),
    };
    const pointCount = Object.values(normalizedPoints).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
    return {
      width,
      height,
      source: String(payload.source || "real"),
      confidence: Math.max(0, Math.min(1, Number(payload.confidence || 0))),
      points: normalizedPoints,
      metrics: {
        jawline: Number(metricsSafe(payload.metrics, "jawline")),
        cheek: Number(metricsSafe(payload.metrics, "cheek")),
        cheekbone: Number(metricsSafe(payload.metrics, "cheekbone")),
        forehead: Number(metricsSafe(payload.metrics, "forehead")),
        neck: Number(metricsSafe(payload.metrics, "neck")),
      },
      quality: {
        ...payload.quality,
        pointCount,
        pointRatio: pointCount > 0 ? Number((pointCount / 72).toFixed(3)) : 0,
      },
      meta: {
        ...payload.meta,
        detectorSource: payload.detectorSource || "real",
      },
    };
  }

  async toCanvas(source) {
    if (source instanceof HTMLCanvasElement) return source;
    const sourceWidth = Number(source?.videoWidth || source?.naturalWidth || source?.width || source?.offsetWidth || 1024);
    const sourceHeight = Number(source?.videoHeight || source?.naturalHeight || source?.height || source?.offsetHeight || 768);
    if (!sourceWidth || !sourceHeight) throw new Error("source image size invalid");
    const canvas = document.createElement("canvas");
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas context unavailable");
    ctx.drawImage(source, 0, 0, sourceWidth, sourceHeight);
    return canvas;
  }
}

function metricsSafe(metrics, key) {
  const value = Number(metrics?.[key]);
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function pickRepresentativeLine(points, maxCount = 4) {
  const list = Array.isArray(points) ? points.slice() : [];
  if (!list.length) return [];
  const sorted = list
    .filter((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y))
    .sort((a, b) => a.x - b.x);
  if (sorted.length <= maxCount) return sorted;
  const step = Math.max(1, Math.floor(sorted.length / maxCount));
  const result = [];
  for (let index = 0; index < sorted.length; index += step) {
    result.push(sorted[index]);
    if (result.length >= maxCount) break;
  }
  while (result.length < maxCount && sorted.length) {
    result.push(sorted[sorted.length - 1]);
  }
  return result.slice(0, maxCount);
}

function reorderPointsAlongX(points, reverse = false) {
  const list = Array.isArray(points) ? points.slice() : [];
  if (!list.length) return [];
  const sorted = list
    .filter((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y))
    .sort((a, b) => (reverse ? b.x - a.x : a.x - b.x));
  return sorted;
}

function reorderPointsAlongY(points, reverse = false) {
  const list = Array.isArray(points) ? points.slice() : [];
  if (!list.length) return [];
  const sorted = list
    .filter((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y))
    .sort((a, b) => (reverse ? b.y - a.y : a.y - b.y));
  return sorted;
}

function estimateNeckFromFaceBounds(points, width, height) {
  const safePoints = Array.isArray(points) ? points.filter((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y)) : [];
  if (!safePoints.length) {
    const cx = width * 0.5;
    const baseY = height * 0.73;
    return [
      { x: cx - width * 0.2, y: baseY },
      { x: cx + width * 0.2, y: baseY },
      { x: cx + width * 0.27, y: baseY + height * 0.22 },
      { x: cx - width * 0.27, y: baseY + height * 0.22 },
    ];
  }
  const pointsX = safePoints.map((point) => point.x);
  const pointsY = safePoints.map((point) => point.y);
  const minY = Math.max(...pointsY);
  const minX = Math.min(...pointsX);
  const maxX = Math.max(...pointsX);
  const cx = (minX + maxX) / 2;
  const span = Math.max(1, maxX - minX);
  return [
    { x: Math.max(0, cx - span * 0.28), y: minY + height * 0.02 },
    { x: cx + span * 0.28, y: minY + height * 0.02 },
    { x: cx + span * 0.36, y: minY + height * 0.24 },
    { x: cx - span * 0.36, y: minY + height * 0.24 },
  ];
}

class FaceGuideAdapter {
  constructor() {
    this.preferReal = true;
    this.mockDetector = new MockFaceDetector();
    this.realDetector = new RealFaceDetector();
  }

  toMockResult(result, reason = null, context = {}) {
    const detectorSource = context?.detectorSource || context?.sourceType || "scan";
    return {
      ...result,
      meta: {
        ...(result.meta || {}),
        detectorSource: "mock",
        fallbackReason: reason || "mock-mode",
        fallbackToMock: true,
        sourceRequest: detectorSource,
        sourceType: context?.sourceType || "unknown",
        realAttempt: context?.realAttempt || false,
        provider: result?.meta?.provider || "mock",
        detectionState: reason ? "fallback" : "resolved",
      },
      quality: {
        ...(result?.quality || {}),
        fallbackReason: reason || (result?.quality?.fallbackReason || null),
        confidenceSource: "mock",
      },
    };
  }

  toRealResult(result, provider = "real", context = {}) {
    const detectorSource = context?.detectorSource || context?.sourceType || "scan";
    return {
      ...result,
      meta: {
        ...(result.meta || {}),
        detectorSource: "real",
        detectorSourceType: provider,
        provider: provider || result?.meta?.provider || "mediapipe",
        sourceRequest: detectorSource,
        sourceType: context?.sourceType || "unknown",
        realAttempt: true,
        detectionState: "resolved",
        confidenceSource: result?.meta?.confidenceSource || "model",
      },
    };
  }

  async detect(source, options = {}) {
    const useReal = options.preferReal === true || (options.preferReal !== false && this.preferReal);
    const allowFallback = options.allowReferenceFallback === true
      || (options.fallbackToMock === true && allowsReferenceFaceGuide());
    const providers = Array.isArray(options.providers)
      ? options.providers
      : ["mediapipe", "tfjs"];
    const sourceType = source?.tagName === "VIDEO"
      ? "camera"
      : source?.tagName === "IMG"
        ? "image"
        : "upload";
    const detectorSource = options.detectorSource || sourceType;
    if (useReal) {
      let lastError;
      try {
        const result = await this.realDetector.detect(source, {
          providers,
          preferReal: true,
          detectorSource,
          fallbackToMock: false,
        });
        return this.toRealResult(result, result?.meta?.provider || providers[0], {
          sourceType,
          detectorSource,
          sourceRequest: options.detectorSource || sourceType,
          realAttempt: true,
        });
      } catch (error) {
        lastError = error;
        const message = String(error?.message || "").toLowerCase();
        if (!allowFallback) {
          throw error;
        }
        if (message.includes("quality") || message.includes("dark") || message.includes("test-pattern")) {
          throw error;
        }
      }
      const fallback = await this.mockDetector.detect(source).catch(() => null);
      if (!fallback) {
        throw lastError;
      }
      return this.toMockResult(fallback, `REFERENCE_GUIDE_ONLY (${lastError?.message || "failed"})`, {
        sourceType,
        detectorSource,
        sourceRequest: options.detectorSource || sourceType,
        realAttempt: true,
      });
    }
    if (!allowFallback) {
      throw new Error(`REAL_MODEL_REQUIRED:${FACE_SCAN_MODEL_MISSING_MESSAGE}`);
    }
    return this.toMockResult(await this.mockDetector.detect(source), "MOCK_ONLY", {
      sourceType,
      sourceRequest: options.detectorSource || sourceType,
      detectorSource,
      realAttempt: false,
    });
  }
}

class FaceGuideRenderer {
  static zoneStyles = {
    all: {
      color: "#e6d7ff",
      glow: "rgba(184, 138, 71, 0.14)",
      lineWidth: 2.4,
      opacity: 0.25,
      activeLineWidth: 2.9,
      arrow: { x: 0, y: -0.28 },
    },
    jaw: {
      source: "jaw",
      label: "턱선",
      color: "#bf6a72",
      glow: "rgba(191, 106, 114, 0.28)",
      lineWidth: 3.2,
      opacity: 0.45,
      activeLineWidth: 5,
      arrow: { x: 0.4, y: 0.25 },
    },
    cheek: {
      source: "cheek",
      label: "광대",
      color: "#b17fc2",
      glow: "rgba(177, 127, 194, 0.24)",
      lineWidth: 3,
      opacity: 0.48,
      activeLineWidth: 4.8,
      arrow: { x: 0.22, y: -0.18 },
    },
    cheekbone: {
      source: "cheekbone",
      label: "광대뼈",
      color: "#c39b5c",
      glow: "rgba(195, 155, 92, 0.24)",
      lineWidth: 2.8,
      opacity: 0.52,
      activeLineWidth: 4.6,
      arrow: { x: -0.25, y: -0.08 },
    },
    brow: {
      source: "brow",
      label: "이마",
      color: "#5f998f",
      glow: "rgba(95, 153, 143, 0.26)",
      lineWidth: 2.8,
      opacity: 0.42,
      activeLineWidth: 4.4,
      arrow: { x: 0, y: -0.36 },
    },
    forehead: {
      source: "forehead",
      label: "이마",
      color: "#5f998f",
      glow: "rgba(95, 153, 143, 0.26)",
      lineWidth: 2.8,
      opacity: 0.42,
      activeLineWidth: 4.4,
      arrow: { x: 0, y: -0.36 },
    },
    neck: {
      source: "neck",
      label: "목",
      color: "#6e8cb0",
      glow: "rgba(110, 140, 176, 0.28)",
      lineWidth: 3.1,
      opacity: 0.48,
      activeLineWidth: 4.9,
      arrow: { x: 0, y: 0.72 },
    },
  };

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext("2d") : null;
  }

  adjustCanvasSize() {
    if (!this.canvas) return;
    const container = this.canvas.parentElement || this.canvas;
    const width = Math.max(1, Math.floor(container.clientWidth || this.canvas.clientWidth || 320));
    const height = Math.max(1, Math.floor(container.clientHeight || this.canvas.clientHeight || 240));
    const ratio = window.devicePixelRatio || 1;
    if (this.canvas.width !== width * ratio || this.canvas.height !== height * ratio) {
      this.canvas.width = width * ratio;
      this.canvas.height = height * ratio;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      this.ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }

  resetCanvas() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getDisplayFrame(sourceWidth, sourceHeight) {
    const width = this.canvas?.clientWidth || 320;
    const height = this.canvas?.clientHeight || 240;
    const sourceW = Math.max(1, Number(sourceWidth || 1));
    const sourceH = Math.max(1, Number(sourceHeight || 1));
    const scale = Math.max(width / sourceW, height / sourceH);
    const fitW = sourceW * scale;
    const fitH = sourceH * scale;
    return {
      width,
      height,
      sourceW,
      sourceH,
      scale,
      offsetX: (width - fitW) / 2,
      offsetY: (height - fitH) / 2,
    };
  }

  resolveZone(zone = "all") {
    return toFaceZone(zone);
  }

  getZoneConfig(zone) {
    return FaceGuideRenderer.zoneStyles[this.resolveZone(zone)] || FaceGuideRenderer.zoneStyles.all;
  }

  getZonePoints(scanResult, zone) {
    const points = scanResult?.points || {};
    const style = this.getZoneConfig(zone);
    const sourceKey = style.source || "oval";
    const data = points[sourceKey];
    return Array.isArray(data) ? data : [];
  }

  toCanvasPoint(point, frame) {
    if (!point || !frame) return null;
    const x = point.x * frame.scale + frame.offsetX;
    const y = point.y * frame.scale + frame.offsetY;
    return { x, y };
  }

  drawGuidePath(points, config, emphasized, frame) {
    if (!this.ctx || !points.length) return;
    const c = this.ctx;
    const color = config.color || "#d39bad";
    const lineWidth = emphasized ? config.activeLineWidth || 4 : config.lineWidth || 3;
    const opacity = emphasized ? 1 : (config.opacity || 0.35);

    c.save();
    c.strokeStyle = color;
    c.fillStyle = color;
    c.lineWidth = lineWidth;
    c.lineJoin = "round";
    c.lineCap = "round";
    c.globalAlpha = opacity;

    c.beginPath();
    points.forEach((point, index) => {
      const p = this.toCanvasPoint(point, frame);
      if (!p) return;
      if (index === 0) c.moveTo(p.x, p.y);
      else c.lineTo(p.x, p.y);
    });
    c.stroke();

    if (config === FaceGuideRenderer.zoneStyles.all) {
      c.restore();
      return;
    }

    if (points.length >= 3 && ["oval", "neck"].includes(config.source)) {
      c.globalAlpha = emphasized ? 0.25 : 0.17;
      c.fillStyle = config.glow || color;
      const firstPoint = this.toCanvasPoint(points[0], frame);
      if (firstPoint) {
        c.lineTo(firstPoint.x, firstPoint.y);
        c.fill();
      }
    }

    c.globalAlpha = emphasized ? 1 : 0.65;
    points.forEach((point) => {
      const p = this.toCanvasPoint(point, frame);
      if (!p) return;
      c.beginPath();
      c.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
      c.fill();
    });
    c.restore();
  }

  fitBadgeText(text, maxWidth) {
    if (!this.ctx || !text) return "";
    const source = String(text).trim();
    if (!source) return "";
    if (this.ctx.measureText(source).width <= maxWidth) return source;
    let value = source;
    while (value.length > 1) {
      const candidate = `${value.slice(0, -1)}…`;
      if (this.ctx.measureText(candidate).width <= maxWidth) return candidate;
      value = value.slice(0, -1);
    }
    return "…";
  }

  drawGuideBadge(text, point, color, frame, isActive) {
    if (!this.ctx || !text || !point) return;
    const c = this.ctx;
    c.save();
    c.font = "600 12px Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif";
    c.textAlign = "left";
    c.textBaseline = "middle";
    const maxWidth = Math.max(88, Math.min(200, frame.width - 24));
    const safeText = this.fitBadgeText(text, maxWidth - 18);
    const textMetrics = c.measureText(safeText);
    const pillW = Math.ceil(textMetrics.width + 14);
    const pillH = 24;
    const x = Math.min(frame.width - (pillW + 10), Math.max(10, point.x - (pillW / 2)));
    const y = Math.max(12, Math.min(point.y - 34, frame.height - (pillH + 10)));

    c.globalAlpha = isActive ? 0.97 : 0.88;
    c.fillStyle = isActive ? "rgba(255, 250, 243, 0.94)" : "rgba(255, 251, 245, 0.88)";
    c.strokeStyle = isActive ? color : "rgba(255, 255, 255, 0.7)";
    c.lineWidth = isActive ? 1.5 : 1;
    if (typeof c.roundRect === "function") {
      c.beginPath();
      c.roundRect(x, y, pillW, pillH, 9);
      c.fill();
      c.stroke();
    } else {
      c.fillRect(x, y, pillW, pillH);
    }
    c.fillStyle = color;
    c.fillText(safeText, x + 7, y + pillH / 2 + 0.5);
    c.restore();
  }

  drawRouteEndpoint(point, color, frame, isEnd = false) {
    if (!this.ctx || !point) return;
    const p = {
      x: Math.max(12, Math.min(point.x, frame.width - 12)),
      y: Math.max(12, Math.min(point.y, frame.height - 12)),
    };
    const c = this.ctx;
    c.save();
    c.globalAlpha = 0.95;
    c.fillStyle = "rgba(255, 250, 243, 0.92)";
    c.strokeStyle = color;
    c.lineWidth = isEnd ? 2 : 1.5;
    c.beginPath();
    c.arc(p.x, p.y, isEnd ? 5.8 : 4.8, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = color;
    c.beginPath();
    c.arc(p.x, p.y, isEnd ? 2.4 : 2, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }

  drawZoneArrow(points, config, frame, meta = {}) {
    if (!this.ctx || !points.length) return;
    const directionText = meta.direction || meta.guideDirection;
    const badgeText = meta.guideArrowLabel || meta.guideLabel || meta.zoneLabel || "가이드";
    if (!directionText && !badgeText) return;
    const c = this.ctx;
    const base = points[Math.floor(points.length / 2)] || points[0];
    const start = this.toCanvasPoint(base, frame);
    if (!start) return;
    const vector = config.arrow || { x: 0.2, y: -0.18 };
    const length = Math.min(frame.width, frame.height) * 0.18;
    const end = {
      x: start.x + vector.x * length,
      y: start.y + vector.y * length,
    };
    const head = 6;
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const color = config.color || "#d39bad";
    const routeSteps = Array.isArray(meta.guideRouteSteps) ? meta.guideRouteSteps : [];
    const routeText = routeSteps.length >= 2
      ? `${meta.guideRouteLabel || badgeText} · ${routeSteps[0]} → ${routeSteps[routeSteps.length - 1]}`
      : typeof meta.guideRouteSummary === "string" && meta.guideRouteSummary
        ? meta.guideRouteSummary
        : routeStepsText(routeSteps, meta.guideRouteLabel || badgeText || "동선");
    const guideMetaText = routeText || badgeText || directionText;

    c.save();
    c.shadowColor = "rgba(255,255,255,0.55)";
    c.shadowBlur = 3;
    c.strokeStyle = color;
    c.fillStyle = color;
    c.lineWidth = 2.1;
    c.lineCap = "round";
    c.globalAlpha = 1;
    c.beginPath();
    c.moveTo(start.x, start.y);
    c.lineTo(end.x, end.y);
    c.stroke();

    c.beginPath();
    c.moveTo(end.x, end.y);
    c.lineTo(end.x - head * Math.cos(angle - Math.PI / 7), end.y - head * Math.sin(angle - Math.PI / 7));
    c.lineTo(end.x - head * Math.cos(angle + Math.PI / 7), end.y - head * Math.sin(angle + Math.PI / 7));
    c.closePath();
    c.fill();
    c.restore();

    if (routeSteps.length >= 2) {
      const first = this.toCanvasPoint(points[0], frame);
      const last = this.toCanvasPoint(points[points.length - 1], frame);
      if (first) this.drawRouteEndpoint(first, color, frame, false);
      if (last) this.drawRouteEndpoint(last, color, frame, true);
    }

    if (guideMetaText) {
      this.drawGuideBadge(guideMetaText, {
        x: frame.width / 2,
        y: 42,
      }, color, frame, true);
    }
  }

  drawFaceOval(points, frame) {
    if (!this.ctx || !Array.isArray(points) || points.length < 5) return;
    const c = this.ctx;
    const canvasPoints = points.map((point) => this.toCanvasPoint(point, frame)).filter(Boolean);
    if (!canvasPoints.length) return;

    c.save();
    const [first, ...rest] = canvasPoints;
    c.beginPath();
    c.moveTo(first.x, first.y);
    rest.forEach((point) => c.lineTo(point.x, point.y));
    c.closePath();
    c.strokeStyle = "rgba(255, 237, 230, 0.38)";
    c.fillStyle = "rgba(255, 237, 230, 0.06)";
    c.lineWidth = 2.2;
    c.stroke();
    c.fill();
    c.restore();
  }

  render(scanResult, zone = "all", meta = {}) {
    if (!this.ctx || !this.canvas) return;
    const { width, height } = scanResult || {};
    const points = scanResult?.points || {};
    const hasPoints = Boolean(points && Object.keys(points).length);
    const frame = this.getDisplayFrame(width, height);
    this.adjustCanvasSize();
    this.resetCanvas();
    if (!hasPoints) return;

    const orderedZones = ["jaw", "cheek", "cheekbone", "forehead", "neck"];
    orderedZones.forEach((zoneName) => {
      const style = this.getZoneConfig(zoneName);
      const zonePoints = this.getZonePoints(scanResult, zoneName);
      this.drawGuidePath(zonePoints, style, zoneName === zone, frame);
      if (zoneName === zone) {
        this.drawZoneArrow(zonePoints, style, frame, {
          guideArrowLabel: meta.guideArrowLabel || meta.guideLabel || style.label || "가이드",
          guideLabel: meta.guideLabel || style.label || "가이드",
          direction: meta.direction || meta.guideDirection || "부드럽게 가볍게 정렬",
          guideRouteSummary: meta.guideRouteSummary,
          guideRoute: meta.guideRoute,
          guideRouteLabel: meta.guideRouteLabel,
          guideRouteSteps: meta.guideRouteSteps,
          zoneLabel: style.label || meta.zoneLabel,
        });
      }
    });

    const sourcePoints = points.oval || [];
    if (Array.isArray(sourcePoints) && sourcePoints.length >= 5) {
      this.drawFaceOval(sourcePoints, frame);
    }
  }
}

function drawRoundedRect(ctx, x, y, width, height, radius = 12) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, safeRadius);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
}

function getCanvasDisplaySize(canvas, fallbackWidth = 640, fallbackHeight = 400) {
  const parent = canvas?.parentElement;
  const width = Math.max(320, Math.round(parent?.clientWidth || canvas?.clientWidth || fallbackWidth));
  const height = Math.max(220, Math.round(parent?.clientHeight || canvas?.clientHeight || fallbackHeight));
  return { width, height };
}

function prepareCanvas(canvas, width, height) {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return ctx;
}

function getImageCoverFrame(sourceWidth, sourceHeight, box) {
  const sourceW = Math.max(1, Number(sourceWidth || 1));
  const sourceH = Math.max(1, Number(sourceHeight || 1));
  const scale = Math.max(box.width / sourceW, box.height / sourceH);
  const fitW = sourceW * scale;
  const fitH = sourceH * scale;
  return {
    ...box,
    sourceW,
    sourceH,
    scale,
    offsetX: box.x + (box.width - fitW) / 2,
    offsetY: box.y + (box.height - fitH) / 2,
  };
}

function drawCoverImage(ctx, image, box, options = {}) {
  const frame = getImageCoverFrame(image.naturalWidth || image.width, image.naturalHeight || image.height, box);
  ctx.save();
  drawRoundedRect(ctx, box.x, box.y, box.width, box.height, options.radius || 16);
  ctx.clip();
  ctx.filter = options.filter || "none";
  ctx.drawImage(
    image,
    frame.offsetX,
    frame.offsetY,
    frame.sourceW * frame.scale,
    frame.sourceH * frame.scale
  );
  ctx.filter = "none";
  if (options.overlay) {
    ctx.fillStyle = options.overlay;
    ctx.fillRect(box.x, box.y, box.width, box.height);
  }
  ctx.restore();
  return frame;
}

function toSimulationPoint(point, frame) {
  if (!point || !frame) return null;
  return {
    x: point.x * frame.scale + frame.offsetX,
    y: point.y * frame.scale + frame.offsetY,
  };
}

function getSimulationZonePoints(scanResult, zone) {
  const style = FaceGuideRenderer.zoneStyles[toFaceZone(zone)] || FaceGuideRenderer.zoneStyles.all;
  const sourceKey = style.source || "oval";
  const points = scanResult?.points?.[sourceKey];
  return Array.isArray(points) ? points : [];
}

function drawSimulationPath(ctx, points, frame, style, active = false) {
  if (!Array.isArray(points) || points.length < 2) return;
  const color = style?.color || "#ddc4f5";
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;
  ctx.lineWidth = active ? 4.5 : 2.4;
  ctx.globalAlpha = active ? 0.96 : 0.48;
  ctx.shadowColor = style?.glow || "rgba(255, 255, 255, 0.42)";
  ctx.shadowBlur = active ? 12 : 6;
  ctx.beginPath();
  points.forEach((point, index) => {
    const p = toSimulationPoint(point, frame);
    if (!p) return;
    if (index === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;
  points.forEach((point, index) => {
    if (!active && index % 2) return;
    const p = toSimulationPoint(point, frame);
    if (!p) return;
    ctx.beginPath();
    ctx.fillStyle = active ? "#fffaf3" : color;
    ctx.globalAlpha = active ? 0.95 : 0.55;
    ctx.arc(p.x, p.y, active ? 3 : 2.2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawSimulationArrow(ctx, points, frame, style, routeLabel) {
  if (!Array.isArray(points) || points.length < 2) return;
  const start = toSimulationPoint(points[0], frame);
  const end = toSimulationPoint(points[points.length - 1], frame);
  if (!start || !end) return;
  const color = style?.color || "#ddc4f5";
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const head = 8;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.2;
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(end.x, end.y);
  ctx.lineTo(end.x - head * Math.cos(angle - Math.PI / 7), end.y - head * Math.sin(angle - Math.PI / 7));
  ctx.lineTo(end.x - head * Math.cos(angle + Math.PI / 7), end.y - head * Math.sin(angle + Math.PI / 7));
  ctx.closePath();
  ctx.fill();
  if (routeLabel) {
    drawCanvasPill(ctx, routeLabel, frame.x + frame.width / 2, frame.y + 26, {
      color,
      align: "center",
      maxWidth: frame.width - 24,
    });
  }
  ctx.restore();
}

function drawCanvasPill(ctx, text, x, y, options = {}) {
  const label = String(text || "").trim();
  if (!label) return;
  const color = options.color || "#17584f";
  const maxWidth = Math.max(80, Number(options.maxWidth || 180));
  ctx.save();
  ctx.font = "800 12px Pretendard, Apple SD Gothic Neo, Noto Sans KR, sans-serif";
  let fitted = label;
  while (ctx.measureText(fitted).width > maxWidth - 20 && fitted.length > 2) {
    fitted = `${fitted.slice(0, -2)}…`;
  }
  const metrics = ctx.measureText(fitted);
  const width = Math.min(maxWidth, Math.ceil(metrics.width + 20));
  const height = 28;
  const left = options.align === "center" ? x - width / 2 : x;
  const safeLeft = Math.max(10, Math.min(left, (options.boundWidth || 9999) - width - 10));
  drawRoundedRect(ctx, safeLeft, y - height / 2, width, height, 10);
  ctx.fillStyle = "rgba(255, 250, 243, 0.93)";
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(fitted, safeLeft + width / 2, y + 0.5);
  ctx.restore();
}

function getAllSimulationPoints(scanResult) {
  const points = scanResult?.points || {};
  return Object.values(points)
    .flatMap((list) => Array.isArray(list) ? list : [])
    .filter((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y));
}

function drawAiScanBands(ctx, box, strength = 0.5) {
  const alpha = Math.max(0.08, Math.min(0.28, Number(strength || 0.5) * 0.28));
  ctx.save();
  drawRoundedRect(ctx, box.x, box.y, box.width, box.height, 14);
  ctx.clip();
  for (let index = 0; index < 6; index += 1) {
    const y = box.y + box.height * (0.18 + index * 0.13);
    const gradient = ctx.createLinearGradient(box.x, y, box.x + box.width, y);
    gradient.addColorStop(0, "rgba(237, 248, 245, 0)");
    gradient.addColorStop(0.5, `rgba(237, 248, 245, ${alpha})`);
    gradient.addColorStop(1, "rgba(237, 248, 245, 0)");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = index === 2 ? 1.6 : 1;
    ctx.beginPath();
    ctx.moveTo(box.x + 10, y);
    ctx.lineTo(box.x + box.width - 10, y + Math.sin(index) * 4);
    ctx.stroke();
  }
  ctx.restore();
}

function drawAiLandmarkMesh(ctx, scanResult, frame, options = {}) {
  if (!frame) return;
  const points = getAllSimulationPoints(scanResult);
  if (!points.length) return;
  const mapped = points
    .map((point) => toSimulationPoint(point, frame))
    .filter((point) => point && Number.isFinite(point.x) && Number.isFinite(point.y));
  if (mapped.length < 4) return;
  const color = options.color || "rgba(237, 248, 245, 0.72)";
  ctx.save();
  drawRoundedRect(ctx, frame.x, frame.y, frame.width, frame.height, 14);
  ctx.clip();
  ctx.globalAlpha = options.alpha || 0.42;
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.75;
  for (let index = 0; index < mapped.length; index += 3) {
    const point = mapped[index];
    const next = mapped[(index + 7) % mapped.length];
    if (!point || !next) continue;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
  }
  mapped.forEach((point, index) => {
    if (index % 3 !== 0) return;
    ctx.beginPath();
    ctx.fillStyle = index % 2 === 0 ? "rgba(255, 250, 243, 0.86)" : "rgba(237, 248, 245, 0.7)";
    ctx.arc(point.x, point.y, options.dotRadius || 1.6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawSimulationEmptyState(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#171923");
  gradient.addColorStop(1, "#2b3043");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2 - 10);
  ctx.strokeStyle = "rgba(255, 250, 243, 0.58)";
  ctx.fillStyle = "rgba(237, 248, 245, 0.12)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, -10, 58, 76, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-44, 22);
  ctx.quadraticCurveTo(0, 46, 44, 22);
  ctx.stroke();
  ctx.restore();
  drawCanvasPill(ctx, "촬영 후 동선 참고 이미지 생성", width / 2, height - 34, {
    color: "#ddf0ec",
    align: "center",
    maxWidth: width - 32,
    boundWidth: width,
  });
}

function getSimulationEffectCards(recommendation, routine, sourceLabel) {
  const zones = Array.isArray(recommendation?.zones) && recommendation.zones.length
    ? recommendation.zones.slice(0, 3)
    : ["jawline", "cheek", "neck"];
  const zoneText = zones.map((zone) => faceZoneLabelMap[zone] || zone).join(" · ");
  const firstZone = zones[0] || "jawline";
  const feelMap = {
    jawline: "턱선 방향 정리",
    jaw: "턱 라인 정돈",
    cheek: "볼 라인 가벼움",
    cheekbone: "광대 방향 열기",
    forehead: "이마 감각 정리",
    brow: "이마 마감",
    neck: "목선 편안함",
  };
  return [
    { label: "집중 부위", value: zoneText },
    { label: "느낌 참고", value: feelMap[firstZone] || "부드러운 정리감" },
    { label: "진행 강도", value: pressureLabel(recommendation?.pressureMode || getProfilePressureMode()).replace(" 압력", "") },
    { label: "동선 이미지", value: sourceLabel || "로컬 참고" },
    { label: "루틴 시간", value: `${recommendation?.estimatedMinutes || routine?.minutes || 0}분` },
    { label: "안전 안내", value: "확정 아님 · 오차 있음" },
  ];
}

function renderSimulationEffectCards(recommendation, routine, sourceLabel) {
  const target = $("#faceSimulationEffects");
  if (!target) return;
  const cards = getSimulationEffectCards(recommendation, routine, sourceLabel);
  target.innerHTML = cards.map((item) => `
    <span><strong>${escapeHtml(item.label)}</strong>${escapeHtml(item.value)}</span>
  `).join("");
}

function drawFaceSimulationCanvas(canvas, image, scanResult, recommendation, routine, sourceLabel) {
  const { width, height } = getCanvasDisplaySize(canvas);
  const ctx = prepareCanvas(canvas, width, height);
  if (!ctx) return false;
  const gap = Math.max(10, Math.round(width * 0.018));
  const pad = Math.max(12, Math.round(width * 0.024));
  const panelWidth = (width - pad * 2 - gap) / 2;
  const panelHeight = height - pad * 2;
  const beforeBox = { x: pad, y: pad, width: panelWidth, height: panelHeight };
  const afterBox = { x: pad + panelWidth + gap, y: pad, width: panelWidth, height: panelHeight };
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#161820");
  bg.addColorStop(0.52, "#25293a");
  bg.addColorStop(1, "#173f3b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const beforeFrame = drawCoverImage(ctx, image, beforeBox, {
    radius: 16,
    filter: "saturate(0.92) contrast(0.98)",
    overlay: "rgba(10, 12, 18, 0.12)",
  });
  const afterFrame = drawCoverImage(ctx, image, afterBox, {
    radius: 16,
    filter: "brightness(1.07) saturate(1.08) contrast(1.03)",
    overlay: "rgba(237, 248, 245, 0.16)",
  });
  drawAiScanBands(ctx, afterBox, 0.74);
  drawAiLandmarkMesh(ctx, scanResult, afterFrame, {
    color: "rgba(237, 248, 245, 0.78)",
    alpha: 0.34,
    dotRadius: 1.7,
  });

  ctx.save();
  ctx.fillStyle = "rgba(15, 18, 24, 0.28)";
  ctx.fillRect(beforeBox.x, beforeBox.y, beforeBox.width, beforeBox.height);
  ctx.restore();

  const zones = Array.isArray(recommendation?.zones) && recommendation.zones.length
    ? recommendation.zones.slice(0, 3)
    : ["jawline", "cheek", "neck"];
  zones.forEach((zone, index) => {
    const normalizedZone = toFaceZone(zone);
    const style = FaceGuideRenderer.zoneStyles[normalizedZone] || FaceGuideRenderer.zoneStyles.all;
    const points = getSimulationZonePoints(scanResult, normalizedZone);
    drawSimulationPath(ctx, points, afterFrame, style, index === 0);
    if (index === 0) {
      const meta = getFaceStepMeta({ zone: normalizedZone, pressure: recommendation?.pressureMode || getProfilePressureMode() });
      drawSimulationArrow(ctx, points, afterFrame, style, meta.guideRouteLabel || faceZoneLabelMap[normalizedZone]);
    }
  });

  const dividerX = beforeBox.x + beforeBox.width + gap / 2;
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.34)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 5]);
  ctx.beginPath();
  ctx.moveTo(dividerX, pad + 12);
  ctx.lineTo(dividerX, height - pad - 12);
  ctx.stroke();
  ctx.restore();

  drawCanvasPill(ctx, "원본", beforeBox.x + 38, beforeBox.y + 28, {
    color: "#bf6a72",
    maxWidth: 82,
    boundWidth: width,
  });
  drawCanvasPill(ctx, "동선 참고", afterBox.x + 58, afterBox.y + 28, {
    color: "#17584f",
    maxWidth: 108,
    boundWidth: width,
  });
  drawCanvasPill(ctx, `${routine?.title || "가이드"} · 동선 참고 · 확정 아님`, width / 2, height - 27, {
    color: "#2f5f58",
    align: "center",
    maxWidth: width - 40,
    boundWidth: width,
  });
  return Boolean(beforeFrame && afterFrame);
}

function getFutureProjectionModel(recommendation = {}, routine = {}, scanResult = {}) {
  recommendation = recommendation || {};
  routine = routine || {};
  scanResult = scanResult || {};
  const referenceOnly = Boolean(recommendation.referenceOnly) || isReferenceFaceScanResult(scanResult);
  const confidence = recommendation.sourceConfidence != null
    ? Number(recommendation.sourceConfidence || 0)
    : Math.round(Number(scanResult.confidence || 0) * 100);
  const routineMinutes = Number(recommendation.estimatedMinutes || routine.minutes || 5);
  const pressureMode = recommendation.pressureMode || getProfilePressureMode();
  const pressureWeight = pressureMode === "soft" ? 0.78 : pressureMode === "medium" ? 0.9 : 0.82;
  const routineWeight = Math.max(0.66, Math.min(1, routineMinutes / 8));
  const confidenceWeight = referenceOnly ? 0.58 : Math.max(0.5, Math.min(0.92, confidence / 100));
  const base = Number((0.34 + confidenceWeight * 0.24 + routineWeight * 0.18 + pressureWeight * 0.1).toFixed(2));
  const uncertainty = referenceOnly
    ? "넓음"
    : confidence >= 76
      ? "낮음"
      : confidence >= 56
        ? "보통"
        : "넓음";
  const zones = Array.isArray(recommendation.zones) && recommendation.zones.length
    ? recommendation.zones
    : ["jawline", "cheek", "neck"];
  const zoneText = zones.slice(0, 2).map((zone) => faceZoneLabelMap[zone] || zone).join(" · ");
  const entries = [
    {
      label: "1회 후",
      value: `${zoneText} 감각 확인`,
      strength: Math.max(0.28, Math.min(0.62, base * 0.62)),
      tone: "#bf6a72",
    },
    {
      label: "7일 후",
      value: "반복 루틴 적응",
      strength: Math.max(0.36, Math.min(0.76, base * 0.82)),
      tone: "#5f998f",
    },
    {
      label: "14일 후",
      value: "기록 기반 보정",
      strength: Math.max(0.42, Math.min(0.88, base)),
      tone: "#b88a47",
    },
  ];
  return {
    confidence,
    referenceOnly,
    uncertainty,
    entries,
    zoneText,
    headline: referenceOnly ? "동선 참고 화면" : "모델 참고 동선",
    disclaimer: "참고 이미지는 습관 설계를 위한 보조 자료이며 실제 결과를 약속하지 않고 오차가 있습니다.",
  };
}

function drawFutureGlow(ctx, box, _color, strength) {
  const safeStrength = Math.max(0, Math.min(1, Number(strength || 0)));
  const gradient = ctx.createRadialGradient(
    box.x + box.width * 0.62,
    box.y + box.height * 0.38,
    0,
    box.x + box.width * 0.62,
    box.y + box.height * 0.38,
    Math.max(box.width, box.height) * 0.72
  );
  gradient.addColorStop(0, `rgba(237, 248, 245, ${0.12 + safeStrength * 0.18})`);
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.save();
  drawRoundedRect(ctx, box.x, box.y, box.width, box.height, 14);
  ctx.clip();
  ctx.fillStyle = gradient;
  ctx.fillRect(box.x, box.y, box.width, box.height);
  ctx.restore();
}

function drawFaceFutureCanvas(canvas, image, scanResult, recommendation, routine, sourceLabel) {
  const { width, height } = getCanvasDisplaySize(canvas, 640, 280);
  const ctx = prepareCanvas(canvas, width, height);
  if (!ctx) return false;
  const model = getFutureProjectionModel(recommendation, routine, scanResult);
  const pad = Math.max(10, Math.round(width * 0.018));
  const gap = 8;
  const panelWidth = (width - pad * 2 - gap * 2) / 3;
  const panelHeight = height - pad * 2;
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "#171923");
  bg.addColorStop(0.55, "#233630");
  bg.addColorStop(1, "#2f5f58");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  const zones = Array.isArray(recommendation?.zones) && recommendation.zones.length
    ? recommendation.zones.slice(0, 2)
    : ["jawline", "cheek"];
  model.entries.forEach((entry, index) => {
    const box = {
      x: pad + index * (panelWidth + gap),
      y: pad,
      width: panelWidth,
      height: panelHeight,
    };
    const frame = drawCoverImage(ctx, image, box, {
      radius: 14,
      filter: `brightness(${1 + entry.strength * 0.12}) saturate(${1 + entry.strength * 0.16}) contrast(${1 + entry.strength * 0.08})`,
      overlay: `rgba(237, 248, 245, ${0.08 + entry.strength * 0.14})`,
    });
    drawFutureGlow(ctx, box, "rgba(237, 248, 245)", entry.strength);
    drawAiScanBands(ctx, box, entry.strength);
    drawAiLandmarkMesh(ctx, scanResult, frame, {
      color: "rgba(255, 250, 243, 0.62)",
      alpha: 0.22 + entry.strength * 0.18,
      dotRadius: 1.25,
    });
    zones.forEach((zone, zoneIndex) => {
      const normalizedZone = toFaceZone(zone);
      const style = FaceGuideRenderer.zoneStyles[normalizedZone] || FaceGuideRenderer.zoneStyles.all;
      const points = getSimulationZonePoints(scanResult, normalizedZone);
      drawSimulationPath(ctx, points, frame, style, zoneIndex === 0);
    });
    drawCanvasPill(ctx, entry.label, box.x + box.width / 2, box.y + 24, {
      color: entry.tone,
      align: "center",
      maxWidth: box.width - 14,
      boundWidth: width,
    });
    drawCanvasPill(ctx, "동선 참고 · 확정 아님", box.x + box.width / 2, box.y + box.height - 24, {
      color: "#17584f",
      align: "center",
      maxWidth: box.width - 14,
      boundWidth: width,
    });
  });
  drawCanvasPill(ctx, `참고 이미지 · ${model.uncertainty} 오차`, width / 2, height - 18, {
    color: "#fffaf3",
    align: "center",
    maxWidth: width - 28,
    boundWidth: width,
  });
  return true;
}

function renderFutureProjectionStrip(model) {
  const target = $("#faceFutureStrip");
  if (!target) return;
  const entries = [
    ...model.entries.map((entry) => ({ label: entry.label, value: entry.value })),
    { label: "오차 범위", value: model.uncertainty },
    { label: "확정 여부", value: "확정 아님" },
    { label: "근거", value: model.referenceOnly ? "참고 동선" : "가이드값" },
  ];
  target.innerHTML = entries.slice(0, 6).map((item) => `
    <span><strong>${escapeHtml(item.label)}</strong>${escapeHtml(item.value)}</span>
  `).join("");
}

function renderFaceSimulationCard() {
  const canvas = $("#faceSimulationCanvas");
  const futureCanvas = $("#faceFutureCanvas");
  const fallback = $("#faceSimulationFallback");
  const futureFallback = $("#faceFutureFallback");
  const badge = $("#faceSimulationBadge");
  const title = $("#faceSimulationTitle");
  const text = $("#faceSimulationText");
  if (!canvas) return;
  const token = ++faceSimulationRenderToken;
  const recommendation = state.faceGuide.recommendation || state.faceGuide.scanRecommendation || {};
  const routine = getRoutineCatalog()[recommendation?.routineId || state.faceGuide.routineId] || getSelectedRoutine();
  const sourceLabel = getFaceRecommendationSourceLabel(recommendation, state.faceGuide.sourceType);
  const sourceText = state.faceGuide.sourceType === "upload" ? "업로드 사진" : "카메라 촬영";
  if (badge) badge.textContent = "동선 참고 이미지";
  if (title) title.textContent = `${sourceText} 기준 동선 참고 화면`;
  if (text) {
    const zones = Array.isArray(recommendation?.zones) && recommendation.zones.length
      ? recommendation.zones.slice(0, 2).map((zone) => faceZoneLabelMap[zone] || zone).join(" · ")
      : "턱선 · 광대";
    text.textContent = `${zones} 동선과 ${pressureLabel(recommendation?.pressureMode || getProfilePressureMode()).replace(" 압력", "")} 강도를 참고 이미지로 표시합니다. 실제 결과를 약속하지 않습니다.`;
  }
  const projectionModel = getFutureProjectionModel(recommendation, routine, state.faceGuide.scanResult);
  const futureTitle = $("#faceFutureTitle");
  const futureRange = $("#faceFutureRange");
  if (futureTitle) futureTitle.textContent = `${projectionModel.headline} · 14일 참고`;
  if (futureRange) futureRange.textContent = `오차 ${projectionModel.uncertainty}`;
  renderFutureProjectionStrip(projectionModel);
  renderSimulationEffectCards(recommendation, routine, sourceLabel);

  requestAnimationFrame(() => {
    if (token !== faceSimulationRenderToken) return;
    const { width, height } = getCanvasDisplaySize(canvas);
    const ctx = prepareCanvas(canvas, width, height);
    if (!ctx) return;
    if (!state.faceGuide.scanImageData || !state.faceGuide.scanResult) {
      drawSimulationEmptyState(ctx, width, height);
      if (futureCanvas) {
        const futureSize = getCanvasDisplaySize(futureCanvas, 640, 280);
        const futureCtx = prepareCanvas(futureCanvas, futureSize.width, futureSize.height);
        if (futureCtx) drawSimulationEmptyState(futureCtx, futureSize.width, futureSize.height);
      }
      fallback?.classList.remove("hidden");
      futureFallback?.classList.remove("hidden");
      return;
    }
    loadImageFromDataUrl(state.faceGuide.scanImageData)
      .then((image) => {
        if (token !== faceSimulationRenderToken) return;
        const rendered = drawFaceSimulationCanvas(canvas, image, state.faceGuide.scanResult, recommendation, routine, sourceLabel);
        const futureRendered = futureCanvas
          ? drawFaceFutureCanvas(futureCanvas, image, state.faceGuide.scanResult, recommendation, routine, sourceLabel)
          : false;
        if (rendered) fallback?.classList.add("hidden");
        else fallback?.classList.remove("hidden");
        if (futureRendered) futureFallback?.classList.add("hidden");
        else futureFallback?.classList.remove("hidden");
      })
      .catch(() => {
        if (token !== faceSimulationRenderToken) return;
        const nextCtx = prepareCanvas(canvas, width, height);
        if (nextCtx) drawSimulationEmptyState(nextCtx, width, height);
        if (futureCanvas) {
          const futureSize = getCanvasDisplaySize(futureCanvas, 640, 280);
          const futureCtx = prepareCanvas(futureCanvas, futureSize.width, futureSize.height);
          if (futureCtx) drawSimulationEmptyState(futureCtx, futureSize.width, futureSize.height);
        }
        fallback?.classList.remove("hidden");
        futureFallback?.classList.remove("hidden");
      });
  });
}

class RoutineGuideController {
  constructor(state) {
    this.state = state;
  }

  buildRecommendation(scanResult) {
    const profile = normalizeProfile(this.state.settings.profile);
    const metrics = scanResult?.metrics || {};
    const confidence = Number(scanResult?.confidence || 0);
    const zones = [
      { key: "jawline", score: metrics.jawline || 0.4 },
      { key: "cheek", score: metrics.cheek || 0.4 },
      { key: "cheekbone", score: metrics.cheekbone || 0.4 },
      { key: "forehead", score: metrics.forehead || 0.4 },
      { key: "neck", score: metrics.neck || 0.4 },
    ].sort((a, b) => b.score - a.score);
    const concernRoutine = {
      puffiness: "morning",
      jawline: "jaw",
      tension: "neck",
      redness: "morning",
    };
    const mappedRoutines = {
      jawline: "jaw",
      cheek: "morning",
      cheekbone: "morning",
      forehead: "morning",
      neck: "neck",
    };
    const requestedSourceType = this.state?.faceGuide?.sourceType === "upload" ? "upload" : "camera";
    const referenceOnly = isReferenceFaceScanResult(scanResult);
    const sourceType = getFaceGuideSourceId(scanResult, requestedSourceType);
    const topPriority = zones[0]?.key || "forehead";
    const routineId = concernRoutine[profile.mainConcern] || mappedRoutines[topPriority] || "morning";
    const fallback = concernRoutine[profile.mainConcern] || "morning";
    const picked = getRoutineCatalog()[routineId] ? routineId : getRoutineCatalog()[fallback] ? fallback : "morning";
    const guidance = getFaceGuideAdvice(profile, topPriority);
    const headline = getFaceAdviceHeadline(profile, topPriority);
    const reason = `${guidance.copy} ${getProfilePressureMode() === "soft"
      ? "오늘은 가볍게 시작해도 충분합니다."
      : "단계별로 천천히 리듬을 유지하면 편안합니다."}`;
    const scoreSummary = zones.slice(0, 3).reduce((obj, entry) => {
      obj[entry.key] = Number(entry.score.toFixed(2));
      return obj;
    }, {});
    return {
      routineId: picked,
      source: sourceType,
      sourceConfidence: referenceOnly ? null : Math.round(Math.max(0, Math.min(confidence, 1)) * 100),
      referenceOnly,
      sourceReliability: referenceOnly ? "reference" : "model",
      headline,
      reason,
      title: guidance.title,
      zones: zones.map((entry) => entry.key).slice(0, 3),
      scoreSummary,
      scoreTrace: zones,
      pressureMode: profile.mainConcern === "redness" ? "soft" : "medium",
      estimatedMinutes: getRoutineCatalog()[picked]?.minutes || 5,
      note: referenceOnly
        ? "카메라/사진 위에 표시한 참고 동선입니다. 상태 판정, 의료 진단, 결과 확정은 제공하지 않습니다."
        : "결과는 피부 컨디션 기준 셀프 가이드입니다. 의료 진단·치료 대체가 아니며 즉각적 변화를 약속하지 않습니다.",
      createdAt: new Date().toISOString(),
    };
  }
}

function getDefaultFaceGuideState() {
  return new FaceGuideState().toSnapshot();
}

function getDefaultSettings() {
  return {
    pressureMode: "soft",
    oilType: "cream",
    reminderTime: "21:30",
    reminderEnabled: false,
    lastReminderDate: "",
    skipSensitiveAreas: true,
    programStartDate: "",
    weeklyGoal: 3,
    safetyDate: "",
    safetyChecks: { ...safetyCheckDefaults },
    photoRetention: "10",
    onboardingSeenBuild: "",
    lastSeenBuild: "",
    profile: { ...profileDefaults },
  };
}

function getDefaultAppState() {
  return {
    selectedRoutine: "morning",
    activeRoutine: null,
    activeStep: 0,
    remaining: 0,
    running: false,
    logs: [],
    logFilter: "all",
    customRoutines: {},
    photoDraft: {
      before: null,
      after: null,
    },
    faceGuide: getDefaultFaceGuideState(),
    settings: getDefaultSettings(),
  };
}

const state = getDefaultAppState();

const faceGuideAdapter = new FaceGuideAdapter();
let faceGuideRenderer = null;
let faceScanRenderer = null;
let faceGuideController = new RoutineGuideController(state);
let faceScanStream = null;
let faceScanFrameId = null;
let faceGuideLastLog = null;
let faceSimulationRenderToken = 0;

let timerId = null;
let reminderCheckId = null;
let toastTimerId = null;
let undoPayload = null;
let updateAvailable = false;
let completionNotice = null;
let faceScanInFlight = false;
let onboardingReturnFocus = null;
const LAUNCH_DEMO_SCREEN_PREFIX = "screen:";
const LAUNCH_DEMO_COMPLETION = "completion";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function getQueryParams() {
  try {
    return new URLSearchParams(window.location.search);
  } catch {
    return new URLSearchParams();
  }
}

function allowsReferenceFaceGuide() {
  const params = getQueryParams();
  return params.get("referenceGuide") === "1"
    || params.get("faceGuideMode") === "reference";
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!saved) return;
    Object.assign(state, saved);
    state.settings = {
      ...getDefaultSettings(),
      ...(saved.settings || {}),
    };
    state.settings.weeklyGoal = normalizeWeeklyGoal(state.settings.weeklyGoal);
    state.settings.photoRetention = normalizePhotoRetention(state.settings.photoRetention);
    state.settings.profile = normalizeProfile(state.settings.profile);
    state.settings.safetyChecks = normalizeSafetyChecks(state.settings.safetyChecks);
    state.logFilter = ["all", "photos", "red", "sensitive"].includes(saved.logFilter) ? saved.logFilter : "all";
    state.faceGuide = new FaceGuideState({
      ...getDefaultFaceGuideState(),
      ...(saved.faceGuide || {}),
    });
    state.faceGuide.mode = state.faceGuide.mode === "live" ? "idle" : state.faceGuide.mode;
    state.faceGuide.status = state.faceGuide.scanReady ? "analyzed" : "idle";
    state.faceGuide.running = false;
    state.faceGuide.runningSeconds = 0;
    state.faceGuide.scanResult = null;
    state.faceGuide.scanImageData = null;
    state.faceGuide.scanReady = Boolean(state.faceGuide.scanRecommendation || saved?.faceGuide?.scanReady);
    state.faceGuide.scanRecommendation = null;
    state.faceGuide.recommendation = null;
    state.faceGuide.recommendationVersion = 0;
    state.faceGuide.lastError = null;
    state.faceGuide.scanFrameReady = false;
    state.photoDraft = { before: null, after: null };
    state.running = false;
  } catch {
    localStorage.removeItem(storageKey);
  }
}

function getPersistedStateSnapshot() {
  return {
    selectedRoutine: state.selectedRoutine,
    activeRoutine: state.activeRoutine,
    activeStep: state.activeStep,
    remaining: state.remaining,
    faceGuide: {
      lastRunSummary: state.faceGuide.lastRunSummary,
      status: state.faceGuide.status,
      sourceType: state.faceGuide.sourceType,
      sourceLabel: state.faceGuide.sourceLabel,
      detectorSource: state.faceGuide.detectorSource,
      fallbackReason: state.faceGuide.fallbackReason,
      lastScanQuality: state.faceGuide.lastScanQuality,
      scanFailureReason: state.faceGuide.scanFailureReason,
      scanReady: Boolean(state.faceGuide.scanReady),
      routineId: state.faceGuide.routineId,
      scanPrimaryZone: state.faceGuide.scanPrimaryZone || "all",
      activeZone: state.faceGuide.activeZone,
      mode: state.faceGuide.mode,
      running: Boolean(state.faceGuide.running),
      runningSeconds: Math.max(0, Number(state.faceGuide.runningSeconds || 0)),
    },
    logs: state.logs,
    logFilter: state.logFilter,
    customRoutines: state.customRoutines,
    settings: state.settings,
  };
}

function applyLaunchDemoMode() {
  const launchDemo = getQueryParams().get("launchDemo");
  if (!launchDemo) {
    return false;
  }
  if (launchDemo.startsWith(LAUNCH_DEMO_SCREEN_PREFIX)) {
    const target = launchDemo.slice(LAUNCH_DEMO_SCREEN_PREFIX.length);
    const allowedScreens = new Set(["today", "routines", "log", "settings", "face-scan", "face-routine", "face-guide", "face-complete", "onboarding"]);
    if (allowedScreens.has(target)) {
      if (target === "onboarding") {
        setScreen("today");
        showOnboarding();
        state.settings.onboardingSeenBuild = appBuild;
        return true;
      }
      setScreen(target);
      state.settings.onboardingSeenBuild = appBuild;
      return true;
    }
  }
  if (launchDemo !== LAUNCH_DEMO_COMPLETION) {
    return false;
  }
  completionNotice = {
    title: "오늘도 루틴을 정돈했어요",
    meta: "오늘의 사괄 루틴 완료가 기록에 반영되었습니다.",
  };
  setScreen("today");
  state.settings.onboardingSeenBuild = appBuild;
  return true;
}

function notifyStorageIssue(message) {
  const toast = typeof document !== "undefined" ? $("#toast") : null;
  if (toast) {
    showToast(message);
  }
}

function trimStoredPhotosForStoragePressure(keepPhotoSessions = 3) {
  let keptSessions = 0;
  let removedPhotos = 0;
  state.logs = state.logs.map((log) => {
    if (!log.photos?.before && !log.photos?.after) return log;
    if (keptSessions < keepPhotoSessions) {
      keptSessions += 1;
      return log;
    }
    removedPhotos += (log.photos.before ? 1 : 0) + (log.photos.after ? 1 : 0);
    const { photos, ...rest } = log;
    return rest;
  });
  return removedPhotos;
}

function saveState() {
  const snapshot = getPersistedStateSnapshot();
  try {
    localStorage.setItem(storageKey, JSON.stringify(snapshot));
    return true;
  } catch {
    const removedPhotos = trimStoredPhotosForStoragePressure();
    const retrySnapshot = getPersistedStateSnapshot();
    try {
      localStorage.setItem(storageKey, JSON.stringify(retrySnapshot));
      notifyStorageIssue(removedPhotos
        ? `저장 공간을 확보하기 위해 오래된 사진 ${removedPhotos}장을 정리했습니다. 기록은 유지됩니다.`
        : "브라우저 저장 공간이 부족합니다. 사진 제외 백업을 만든 뒤 사진을 정리해 주세요.");
      return true;
    } catch {
      notifyStorageIssue("브라우저 저장 공간이 부족해 변경사항을 저장하지 못했습니다. 사진 제외 백업을 먼저 만들어 주세요.");
      return false;
    }
  }
}

function toFaceZone(activeZone) {
  const normalized = typeof activeZone === "string" ? activeZone.trim().toLowerCase() : "all";
  return faceZoneRenderMap[normalized] || normalized;
}

function initFaceGuideModules() {
  const scanCanvas = $("#faceScanCanvas");
  const guideCanvas = $("#faceGuideCanvas");
  if (scanCanvas && !faceScanRenderer) {
    faceScanRenderer = new FaceGuideRenderer(scanCanvas);
  }
  if (guideCanvas && !faceGuideRenderer) {
    faceGuideRenderer = new FaceGuideRenderer(guideCanvas);
  }
  if (!faceGuideController) {
    faceGuideController = new RoutineGuideController(state);
  }
}

function getFaceSourceLabel() {
  return state.faceGuide.sourceType === "upload"
    ? "업로드"
    : state.faceGuide.sourceType === "camera"
      ? "카메라"
      : "로컬 동선";
}

function getFaceScanPreviewMode() {
  const hasImage = Boolean(state.faceGuide.scanImageData);
  if (faceScanStream) return "video";
  if (hasImage) return "upload";
  return "empty";
}

function setFaceScanStatus(message) {
  const statusElement = $("#faceScanStatus");
  if (statusElement) statusElement.textContent = message;
}

function inspectFaceSourceQuality(source, options = {}) {
  const sourceType = options.sourceType === "upload" ? "upload" : "camera";
  const width = Number(source?.videoWidth || source?.naturalWidth || source?.width || 0);
  const height = Number(source?.videoHeight || source?.naturalHeight || source?.height || 0);
  const base = {
    ok: true,
    code: "ok",
    sourceType,
    width,
    height,
    message: "",
    metrics: {},
  };
  if (!width || !height) {
    return {
      ...base,
      ok: false,
      code: "size",
      message: "이미지 크기를 확인하지 못했습니다. 다시 촬영하거나 업로드해 주세요.",
    };
  }
  if (width < FACE_SCAN_MIN_DIMENSION || height < FACE_SCAN_MIN_DIMENSION) {
    return {
      ...base,
      ok: false,
      code: "size",
      message: "이미지가 너무 작습니다. 더 큰 정면 사진으로 다시 시도해 주세요.",
    };
  }
  const sampleCanvas = document.createElement("canvas");
  const sampleSize = FACE_SCAN_SAMPLE_SIZE;
  sampleCanvas.width = sampleSize;
  sampleCanvas.height = sampleSize;
  const context = sampleCanvas.getContext("2d", { willReadFrequently: true });
  if (!context) return base;
  try {
    context.drawImage(source, 0, 0, sampleSize, sampleSize);
    const { data } = context.getImageData(0, 0, sampleSize, sampleSize);
    let greenPixels = 0;
    let brightGreenPixels = 0;
    let darkPixels = 0;
    let luminanceTotal = 0;
    let luminanceSquaredTotal = 0;
    let redTotal = 0;
    let greenTotal = 0;
    let blueTotal = 0;
    let transparentPixels = 0;
    for (let index = 0; index < data.length; index += 4) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];
      const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      luminanceTotal += luminance;
      luminanceSquaredTotal += luminance * luminance;
      redTotal += red;
      greenTotal += green;
      blueTotal += blue;
      if (green > red * 1.55 && green > blue * 1.55) greenPixels += 1;
      if (green > 170 && red < 90 && blue < 90) brightGreenPixels += 1;
      if (luminance < 36) darkPixels += 1;
      if (alpha < 245) transparentPixels += 1;
    }
    const totalPixels = sampleSize * sampleSize;
    const averageLuminance = luminanceTotal / totalPixels;
    const variance = Math.max(0, (luminanceSquaredTotal / totalPixels) - (averageLuminance * averageLuminance));
    const metrics = {
      averageLuminance: Number(averageLuminance.toFixed(2)),
      luminanceStdDev: Number(Math.sqrt(variance).toFixed(2)),
      darkRatio: Number((darkPixels / totalPixels).toFixed(3)),
      greenRatio: Number((greenPixels / totalPixels).toFixed(3)),
      brightGreenRatio: Number((brightGreenPixels / totalPixels).toFixed(3)),
      transparentRatio: Number((transparentPixels / totalPixels).toFixed(3)),
      averageRed: Number((redTotal / totalPixels).toFixed(1)),
      averageGreen: Number((greenTotal / totalPixels).toFixed(1)),
      averageBlue: Number((blueTotal / totalPixels).toFixed(1)),
    };
    const greenGap = metrics.averageGreen - Math.max(metrics.averageRed, metrics.averageBlue);
    const looksLikeTestPattern = metrics.greenRatio > 0.58
      || metrics.brightGreenRatio > 0.28
      || (metrics.greenRatio > 0.42 && greenGap > 56);
    if (looksLikeTestPattern) {
      return {
        ...base,
        ok: false,
        code: "test-pattern",
        message: sourceType === "camera"
          ? FACE_SCAN_TEST_CAMERA_MESSAGE
          : "초록 테스트 패턴처럼 보이는 이미지입니다. 실제 촬영 사진으로 다시 업로드해 주세요.",
        metrics,
      };
    }
    if (sourceType === "upload" && metrics.transparentRatio > 0.12) {
      return {
        ...base,
        ok: false,
        code: "weak-face",
        message: "동선 기준이 약한 이미지입니다. 투명 배경이나 그래픽 대신 밝은 정면 사진으로 다시 업로드해 주세요.",
        metrics,
      };
    }
    if (metrics.averageLuminance < 42 || metrics.darkRatio > 0.68) {
      return {
        ...base,
        ok: false,
        code: "too-dark",
        message: FACE_SCAN_DARK_MESSAGE,
        metrics,
      };
    }
    if (metrics.luminanceStdDev < 7) {
      return {
        ...base,
        ok: false,
        code: "weak-face",
        message: FACE_SCAN_WEAK_FACE_MESSAGE,
        metrics,
      };
    }
    return {
      ...base,
      metrics,
    };
  } catch {
    return base;
  }
}

function isLikelySyntheticCameraFrame(source) {
  return inspectFaceSourceQuality(source, { sourceType: "camera" }).code === "test-pattern";
}

function applyFaceSourceQualityIssue(quality, options = {}) {
  const sourceType = options.sourceType === "upload" ? "upload" : "camera";
  const message = quality?.message || FACE_SCAN_WEAK_FACE_MESSAGE;
  state.faceGuide.status = quality?.code === "test-pattern" && sourceType === "camera" ? "camera-test-pattern" : "photo-quality-error";
  state.faceGuide.scanFrameReady = false;
  state.faceGuide.scanReady = false;
  state.faceGuide.scanResult = null;
  state.faceGuide.scanRecommendation = null;
  state.faceGuide.recommendation = null;
  state.faceGuide.routineId = null;
  state.faceGuide.lastError = message;
  state.faceGuide.scanFailureReason = message;
  state.faceGuide.lastScanQuality = quality || null;
  if (sourceType === "upload") setFaceScanSourceType("upload");
  if (options.clearImage) {
    state.faceGuide.scanImageData = null;
  }
  faceScanRenderer?.resetCanvas();
  setFaceScanStatus(message);
  if (options.toast !== false) showToast(message);
  saveState();
  renderFaceScanScreen();
}

function handleSyntheticCameraFrame(quality = null) {
  const nextQuality = quality || inspectFaceSourceQuality($("#faceScanVideo"), { sourceType: "camera" });
  state.faceGuide.status = "camera-test-pattern";
  state.faceGuide.scanFrameReady = false;
  state.faceGuide.scanReady = false;
  state.faceGuide.scanResult = null;
  state.faceGuide.scanImageData = null;
  state.faceGuide.scanRecommendation = null;
  state.faceGuide.recommendation = null;
  state.faceGuide.routineId = null;
  state.faceGuide.lastError = FACE_SCAN_TEST_CAMERA_MESSAGE;
  state.faceGuide.scanFailureReason = FACE_SCAN_TEST_CAMERA_MESSAGE;
  state.faceGuide.lastScanQuality = nextQuality;
  faceScanRenderer?.resetCanvas();
  setFaceScanStatus(FACE_SCAN_TEST_CAMERA_MESSAGE);
  showToast("테스트 카메라 화면이라 실제 참고 결과가 아닙니다.");
  stopFaceScanSession();
  saveState();
  renderFaceScanScreen();
}

function setFaceScanFrame(mode = "empty") {
  const frame = $("#faceScanCanvas")?.closest(".face-scan-frame");
  const placeholder = $("#faceScanPlaceholder");
  if (!frame) return;
  frame.classList.toggle("show-video", mode === "video");
  frame.classList.toggle("show-upload", mode === "upload");
  if (placeholder) {
    placeholder.classList.toggle("hidden", mode === "video" || mode === "upload");
  }
}

function renderFaceScanFrame() {
  if (!faceScanRenderer) return;
  const mode = getFaceScanPreviewMode();
  const video = $("#faceScanVideo");
  const image = $("#faceScanImage");
  setFaceScanFrame(mode);
  if (mode === "upload" && state.faceGuide.scanImageData && image) {
    image.src = state.faceGuide.scanImageData;
  }
  if (mode === "video" && video) {
    video.style.opacity = "1";
  }
  if (state.faceGuide.scanResult) {
    const recommendation = state.faceGuide.recommendation || state.faceGuide.scanRecommendation || {};
    const zone = recommendation?.zones?.[0] || state.faceGuide.scanPrimaryZone || "all";
    const directionMeta = getFaceStepMeta({ zone, pressure: recommendation?.pressureMode || getProfilePressureMode() });
    faceScanRenderer.render(state.faceGuide.scanResult, toFaceZone(zone), directionMeta);
  } else {
    faceScanRenderer.resetCanvas();
  }
}

function setFaceScanSourceType(type) {
  if (type !== "upload" && type !== "camera") return;
  state.faceGuide.sourceType = type;
  state.faceGuide.sourceLabel = type === "upload" ? "업로드" : "카메라";
}

function stopFaceScanSession() {
  faceScanInFlight = false;
  if (faceScanFrameId) {
    window.clearInterval(faceScanFrameId);
    faceScanFrameId = null;
  }
  if (faceScanStream) {
    faceScanStream.getTracks().forEach((track) => track.stop());
    faceScanStream = null;
  }
  const video = $("#faceScanVideo");
  if (video) {
    video.pause();
    video.srcObject = null;
    video.removeAttribute("src");
  }
  setFaceScanFrame("empty");
}

function clearFaceScanState() {
  state.faceGuide.scanImageData = null;
  state.faceGuide.scanResult = null;
  state.faceGuide.scanFrameReady = false;
  state.faceGuide.scanReady = false;
  state.faceGuide.scanRecommendation = null;
  state.faceGuide.recommendation = null;
  state.faceGuide.routineId = null;
  state.faceGuide.scanPrimaryZone = "all";
  state.faceGuide.lastError = null;
  state.faceGuide.activeZone = "all";
  if (faceScanRenderer) faceScanRenderer.resetCanvas();
  setFaceScanStatus("카메라 또는 사진을 선택하면 브라우저 안에서 실제 얼굴 랜드마크 기준점을 확인합니다.");
}

function toDataUrlFromImageSource(image) {
  const maxSide = 920;
  const width = image.width || 1;
  const height = image.height || 1;
  const ratio = Math.min(1, maxSide / Math.max(width, height));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return "";
  }
  canvas.width = Math.max(1, Math.round(width * ratio));
  canvas.height = Math.max(1, Math.round(height * ratio));
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      loadImageFromDataUrl(reader.result).then(resolve).catch(reject);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fallbackToUploadScan(
  reason = "카메라 권한 또는 사용 환경이 제한되어 업로드로 전환합니다.",
  options = {}
) {
  state.faceGuide.status = "camera-denied";
  state.faceGuide.scanFrameReady = false;
  state.faceGuide.scanResult = null;
  state.faceGuide.scanImageData = null;
  const nextSource = options?.nextSource === "camera" ? "camera" : "upload";
  const openUploadPicker = options?.openUploadPicker !== false && nextSource === "upload";
  setFaceScanSourceType(nextSource);
  setFaceScanStatus(reason);
  showToast(reason);
  const uploadInput = $("#faceUploadInput");
  if (openUploadPicker && uploadInput) {
    uploadInput.value = "";
    window.setTimeout(() => uploadInput.click(), 100);
  }
}

function setFaceCaptureControls(isStreaming) {
  const capture = $("#captureFaceScanButton");
  const camera = $("#startFaceScanCameraButton");
  if (capture) capture.disabled = !isStreaming;
  if (camera) camera.textContent = isStreaming ? "카메라 정지" : "카메라로 준비";
}

function startFaceScanPreviewLoop() {
  if (!faceScanStream) return;
  const video = $("#faceScanVideo");
  if (!video) return;
  if (faceScanFrameId) {
    window.clearInterval(faceScanFrameId);
    faceScanFrameId = null;
  }
  faceScanFrameId = window.setInterval(async () => {
    if (faceScanInFlight) return;
    if (!faceScanStream || !video.videoWidth || !video.videoHeight) return;
    const quality = inspectFaceSourceQuality(video, { sourceType: "camera" });
    state.faceGuide.lastScanQuality = quality;
    if (quality.code === "test-pattern") {
      handleSyntheticCameraFrame(quality);
      return;
    }
    if (!quality.ok) {
      state.faceGuide.status = "photo-quality-error";
      state.faceGuide.scanFrameReady = false;
      state.faceGuide.scanResult = null;
      state.faceGuide.scanFailureReason = quality.message;
      state.faceGuide.lastError = quality.message;
      setFaceScanStatus(quality.message);
      faceScanRenderer?.resetCanvas();
      renderFaceScanScreen();
      return;
    }
    if (state.faceGuide.status === "photo-quality-error") {
      state.faceGuide.status = "scanning";
      state.faceGuide.lastError = null;
      state.faceGuide.scanFailureReason = null;
      setFaceScanStatus("실시간으로 실제 얼굴 랜드마크 기준점을 확인합니다. 테스트 패턴이면 결과를 만들지 않습니다.");
    }
    faceScanInFlight = true;
    try {
      const referenceGuide = allowsReferenceFaceGuide();
      const result = await faceGuideAdapter.detect(video, {
        preferReal: !referenceGuide,
        fallbackToMock: referenceGuide,
        allowReferenceFallback: referenceGuide,
        detectorSource: "camera-preview",
      });
      const failureReason = getFaceScanFailureReason(result);
      if (failureReason) {
        state.faceGuide.scanFrameReady = false;
        state.faceGuide.scanResult = null;
        state.faceGuide.scanFailureReason = failureReason;
        state.faceGuide.lastError = failureReason;
        setFaceScanStatus(failureReason);
        renderFaceScanFrame();
        return;
      }
      state.faceGuide.scanResult = result;
      state.faceGuide.scanFrameReady = true;
      state.faceGuide.lastError = null;
      state.faceGuide.scanFailureReason = null;
      renderFaceScanFrame();
    } catch (error) {
      const modelStatus = getFaceScanStatusForError(error?.message || error);
      if (isFaceScanModelError(error?.message || error)) {
        const message = getFaceScanErrorMessage(error?.message || error);
        state.faceGuide.status = modelStatus;
        state.faceGuide.scanFrameReady = false;
        state.faceGuide.scanResult = null;
        state.faceGuide.scanRecommendation = null;
        state.faceGuide.recommendation = null;
        state.faceGuide.scanFailureReason = message;
        state.faceGuide.lastError = message;
        setFaceScanStatus(message);
        if (faceScanFrameId && !allowsReferenceFaceGuide()) {
          window.clearInterval(faceScanFrameId);
          faceScanFrameId = null;
        }
        renderFaceScanScreen();
      }
    } finally {
      faceScanInFlight = false;
    }
  }, 800);
}

function buildFaceScanSummary(scanResult, recommendation) {
  const zones = Array.isArray(recommendation?.zones) ? recommendation.zones : [];
  const primary = zones[0] || "all";
  return {
    source: recommendation?.source || "unknown",
    confidence: Number(recommendation?.sourceConfidence || 0),
    sourceType: state.faceGuide.sourceType,
    sourceLabel: getFaceSourceLabel(),
    detectedAt: new Date().toISOString(),
    recommendedZone: primary,
    routineId: recommendation?.routineId,
    priorityZones: zones.slice(0, 3),
    scanWidth: Number(scanResult?.width || 0),
    scanHeight: Number(scanResult?.height || 0),
  };
}

function applyFaceScanResult(scanResult, options = {}) {
  const failureReason = getFaceScanFailureReason(scanResult);
  if (failureReason) {
    state.faceGuide.lastError = failureReason || FACE_SCAN_WEAK_FACE_MESSAGE;
    state.faceGuide.scanFailureReason = state.faceGuide.lastError;
    state.faceGuide.status = failureReason === FACE_SCAN_REAL_MODEL_REQUIRED_MESSAGE ? "model-error" : "photo-quality-error";
    state.faceGuide.scanReady = false;
    state.faceGuide.scanResult = null;
    showToast(state.faceGuide.lastError);
    saveState();
    renderFaceScanFrame();
    return;
  }
  const catalog = getRoutineCatalog();
  const recommendation = faceGuideController.buildRecommendation(scanResult) || {};
  const quality = normalizeFaceGuideQuality(scanResult);
  const primaryRoutineId = catalog[recommendation.routineId] ? recommendation.routineId : "morning";
  const routine = catalog[recommendation.routineId] ? recommendation.routineId : "morning";
  state.faceGuide.scanResult = scanResult;
  state.faceGuide.scanRecommendation = recommendation;
  state.faceGuide.recommendation = recommendation;
  state.faceGuide.routineId = primaryRoutineId;
  state.faceGuide.scanReady = true;
  state.faceGuide.scanPrimaryZone = recommendation.zones?.[0] || "all";
  state.faceGuide.activeZone = toFaceZone(state.faceGuide.scanPrimaryZone);
  state.faceGuide.status = "analyzed";
  state.faceGuide.mode = options.mode || "ready";
  state.faceGuide.recommendationVersion += 1;
  state.faceGuide.lastError = null;
  state.faceGuide.scanFailureReason = null;
  state.faceGuide.lastScanQuality = quality;
  state.faceGuide.detectorSource = quality.detectorSource;
  state.faceGuide.fallbackReason = quality.fallbackReason;
  state.faceGuide.lastRunSummary = buildFaceScanSummary(scanResult, recommendation);
  state.selectedRoutine = routine;
  state.faceGuide.running = false;
  state.faceGuide.runningSeconds = 0;
  state.running = false;
  saveState();
  renderFaceRoutineScreen();
  setScreen("face-routine");
}

async function analyzeFaceSource(source, options = {}) {
  const { mode = "ready", sourceType, keepStream = false } = options;
  const canvas = $("#faceScanCanvas");
  const imageElement = typeof source === "string"
    ? await loadImageFromDataUrl(source).catch(() => null)
    : source;
  if (!imageElement) {
    showToast("선택한 이미지를 처리하지 못했습니다.");
    return;
  }
  try {
    const quality = inspectFaceSourceQuality(imageElement, { sourceType: sourceType === "upload" ? "upload" : "camera" });
    state.faceGuide.lastScanQuality = quality;
    if (!quality.ok) {
      applyFaceSourceQualityIssue(quality, {
        sourceType: sourceType === "upload" ? "upload" : "camera",
        clearImage: quality.code === "test-pattern",
      });
      return;
    }
    setFaceScanStatus(FACE_SCAN_MODEL_LOADING_MESSAGE);
    state.faceGuide.status = "processing";
    state.faceGuide.scanFrameReady = false;
    state.faceGuide.lastError = null;
    renderFaceScanFrame();
    const referenceGuide = allowsReferenceFaceGuide();
    const result = await faceGuideAdapter.detect(imageElement, {
      preferReal: !referenceGuide,
      fallbackToMock: referenceGuide,
      allowReferenceFallback: referenceGuide,
      detectorSource: sourceType === "upload" ? "upload" : "camera",
    });
    const failureReason = getFaceScanFailureReason(result);
    if (failureReason) {
      state.faceGuide.scanFailureReason = failureReason;
      throw new Error(`FACE_SCAN_QUALITY:${failureReason}`);
    }
    const imageData = toDataUrlFromImageSource(imageElement);
    state.faceGuide.scanImageData = imageData;
    setFaceScanSourceType(sourceType === "upload" ? "upload" : "camera");
    const recommendation = faceGuideController.buildRecommendation(result);
    const zoneHint = getFaceStepMeta({ zone: recommendation?.zones?.[0] || "neck" });
    if (canvas && imageElement) {
      faceScanRenderer?.adjustCanvasSize();
      faceScanRenderer?.render(result, toFaceZone(recommendation?.zones?.[0] || "neck"), zoneHint);
    }
    if (!keepStream) {
      stopFaceScanSession();
    }
    applyFaceScanResult(result, { mode });
  } catch (error) {
    const qualityMessage = String(error?.message || "").startsWith("FACE_SCAN_QUALITY:")
      ? String(error.message).replace("FACE_SCAN_QUALITY:", "")
      : "";
    const modelError = isFaceScanModelError(error?.message || error);
    const noFace = Boolean(qualityMessage) || (!modelError && !hasUsableFaceScanResult(state.faceGuide.scanResult));
    state.faceGuide.lastError = qualityMessage || getFaceScanErrorMessage(error?.message || error);
    state.faceGuide.scanFailureReason = state.faceGuide.lastError;
    state.faceGuide.status = modelError ? getFaceScanStatusForError(error?.message || error) : "photo-quality-error";
    state.faceGuide.scanFrameReady = false;
    state.faceGuide.scanReady = false;
    setFaceScanStatus(state.faceGuide.lastError || "참고 동선을 준비하지 못했습니다. 조명과 거리를 조정하고 다시 진행해 주세요.");
    if (noFace || modelError) {
      state.faceGuide.scanResult = null;
      state.faceGuide.scanRecommendation = null;
      state.faceGuide.recommendation = null;
      state.faceGuide.routineId = null;
      faceScanRenderer?.resetCanvas();
    }
    showToast(state.faceGuide.lastError);
    saveState();
    renderFaceScanScreen();
  }
}

function openFaceScan(preferredSource = "camera") {
  stopFaceScanSession();
  state.faceGuide.mode = "ready";
  clearFaceScanState();
  state.faceGuide.status = "idle";
  setFaceScanSourceType(preferredSource === "upload" ? "upload" : "camera");
  const uploadInput = $("#faceUploadInput");
  if (uploadInput) uploadInput.value = "";
  setScreen("face-scan");
  renderFaceScanScreen();
}

function openFaceScanUpload() {
  openFaceScan("upload");
  const input = $("#faceUploadInput");
  if (!input) {
    showToast("사진 업로드 입력을 찾지 못했습니다.");
    return;
  }
  input && (input.value = "");
  input?.click();
}

async function startFaceScanCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    fallbackToUploadScan("이 브라우저는 카메라를 지원하지 않습니다. 업로드로 진행할 수 있습니다.");
    state.faceGuide.lastError = "이 브라우저는 카메라를 지원하지 않습니다.";
    renderFaceScanScreen();
    return;
  }
  if (faceScanStream) {
    stopFaceScanSession();
    renderFaceScanScreen();
    return;
  }
  setFaceScanSourceType("camera");
  try {
    setFaceScanStatus("카메라 권한을 확인하고 있습니다.");
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    const video = $("#faceScanVideo");
    if (!video) {
      stream.getTracks().forEach((track) => track.stop());
      state.faceGuide.status = "error";
      state.faceGuide.lastError = "카메라 화면을 찾지 못해 업로드로 전환합니다.";
      setFaceScanStatus(state.faceGuide.lastError);
      fallbackToUploadScan("카메라 화면을 찾지 못해 업로드로 전환합니다.");
      return;
    }
    faceScanStream = stream;
    video.srcObject = stream;
    if (typeof video.play === "function") {
      await video.play().catch(() => {});
    }
    state.faceGuide.status = "scanning";
    state.faceGuide.scanImageData = null;
    state.faceGuide.scanResult = null;
    setFaceScanFrame("video");
    setFaceCaptureControls(true);
    setFaceScanStatus("실시간으로 실제 얼굴 랜드마크 기준점을 확인합니다. 테스트 패턴이면 결과를 만들지 않습니다.");
    state.faceGuide.lastError = null;
    startFaceScanPreviewLoop();
    renderFaceScanScreen();
  } catch (error) {
    const denied = error?.name === "NotAllowedError" || error?.name === "PermissionDeniedError";
    if (denied) {
      state.faceGuide.lastError = getFaceScanErrorMessage("permission denied");
      fallbackToUploadScan(
        "카메라 권한이 거부되었습니다. 크롬에서 사이트 허용 후 '카메라로 준비'를 다시 눌러 주세요.",
        { nextSource: "camera", openUploadPicker: false }
      );
      saveState();
      renderFaceScanScreen();
      return;
    }
    state.faceGuide.status = "error";
    state.faceGuide.lastError = getFaceScanErrorMessage(error?.message || "unknown");
    state.faceGuide.scanFrameReady = false;
    setFaceScanStatus("카메라를 시작할 수 없습니다. 사진 업로드로 진행해주세요.");
    showToast(state.faceGuide.lastError);
    stopFaceScanSession();
    saveState();
  }
}

async function captureFaceScan() {
  const video = $("#faceScanVideo");
  if (!video || !faceScanStream || !video.videoWidth || !video.videoHeight) {
    showToast("카메라를 먼저 시작하세요.");
    return;
  }
  const captureCanvas = document.createElement("canvas");
  captureCanvas.width = video.videoWidth;
  captureCanvas.height = video.videoHeight;
  const context = captureCanvas.getContext("2d");
  if (!context) {
    showToast("카메라 캡처 컨텍스트를 준비하지 못했습니다.");
    stopFaceScanSession();
    return;
  }
  context.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
  const quality = inspectFaceSourceQuality(captureCanvas, { sourceType: "camera" });
  if (quality.code === "test-pattern") {
    handleSyntheticCameraFrame(quality);
    return;
  }
  if (!quality.ok) {
    applyFaceSourceQualityIssue(quality, { sourceType: "camera", toast: true });
    return;
  }
  let dataUrl = "";
  try {
    dataUrl = captureCanvas.toDataURL("image/jpeg", 0.8);
  } catch {
    showToast("이미지 캡처 중 오류가 발생했습니다.");
    stopFaceScanSession();
    return;
  }
  state.faceGuide.scanImageData = dataUrl;
  setFaceScanFrame("upload");
  renderFaceScanFrame();
  stopFaceScanSession();
  try {
    const image = await loadImageFromDataUrl(dataUrl);
    await analyzeFaceSource(image, { mode: "ready", sourceType: "camera", keepStream: false });
  } catch {
    showToast("카메라 캡처 이미지를 처리할 수 없습니다.");
  }
}

async function handleFaceUploadInput(event) {
  const file = event.target?.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("이미지 파일을 선택해 주세요.");
    return;
  }
  if (file.size < FACE_SCAN_MIN_FILE_BYTES) {
    showToast("이미지 파일이 너무 작습니다. 더 큰 해상도로 다시 업로드해 주세요.");
    if (event.target) event.target.value = "";
    return;
  }
  if (file.size > FACE_SCAN_MAX_FILE_BYTES) {
    showToast("이미지 파일이 너무 큽니다. 10MB 이하의 사진으로 업로드해 주세요.");
    if (event.target) event.target.value = "";
    return;
  }
  const originalImage = await loadImageFromFile(file).catch(() => null);
  if (!originalImage) {
    showToast("이미지 미리보기를 로드하지 못했습니다.");
    if (event.target) event.target.value = "";
    return;
  }
  const originalQuality = inspectFaceSourceQuality(originalImage, { sourceType: "upload" });
  if (!originalQuality.ok) {
    applyFaceSourceQualityIssue(originalQuality, { sourceType: "upload", clearImage: true });
    if (event.target) event.target.value = "";
    return;
  }
  const previewDataUrl = toDataUrlFromImageSource(originalImage);
  if (!previewDataUrl) {
    showToast("사진을 불러오지 못했습니다.");
    if (event.target) event.target.value = "";
    return;
  }
  state.faceGuide.scanImageData = previewDataUrl;
  setFaceScanSourceType("upload");
  setFaceScanFrame("upload");
  renderFaceScanFrame();
  if (event.target) event.target.value = "";
  await analyzeFaceSource(originalImage, { mode: "ready", sourceType: "upload", keepStream: false });
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

function formatClock(seconds) {
  const safeSeconds = Math.max(0, seconds);
  return {
    minutes: String(Math.floor(safeSeconds / 60)).padStart(2, "0"),
    seconds: String(safeSeconds % 60).padStart(2, "0"),
  };
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function getSelectedRoutine() {
  const catalog = getRoutineCatalog();
  if (!catalog[state.selectedRoutine]) {
    state.selectedRoutine = "morning";
  }
  return catalog[state.selectedRoutine];
}

function getActiveRoutine() {
  const catalog = getRoutineCatalog();
  return state.activeRoutine ? catalog[state.activeRoutine] : null;
}

function getRoutineCatalog() {
  return { ...baseRoutines, ...state.customRoutines };
}

function getRoutineDescription(routine = {}) {
  if (routine.description) return routine.description;
  return (routine.steps || []).map((step) => zoneNames[step.zone]).slice(0, 3).join(", ");
}

function getRoutineDifficulty(routine = {}) {
  if (routine.difficulty) return routine.difficulty;
  if (routine.custom) return "내 설정";
  const minutes = Number(routine.minutes || 0);
  if (minutes <= 3) return "초간단";
  if (minutes <= 5) return "쉬움";
  if (minutes <= 7) return "보통";
  return "차분";
}

function getRoutineSituation(routine = {}) {
  if (routine.situation) return routine.situation;
  if (routine.custom) return "내 설정 반영";
  return "가볍게 시작";
}

function getRoutineTag(routine = {}, id = "") {
  if (routine.tag) return routine.tag;
  if (routine.custom) return "내 루틴";
  return id === "morning" ? "오늘 얼굴 점검" : "루틴";
}

const faceConditionMood = {
  ready: "덜 부은 감자",
  clear: "사과 복구 중",
  steady: "괄사력 충전 대기",
  caution: "조심스러운 사과",
  pause: "휴식이 필요한 얼굴",
  stop: "오늘은 쉬는 얼굴",
};

const completionCopies = [
  "오늘도 루틴을 정돈했어요",
  "컨디션 점검 완료",
  "목표 라인 마감",
  "사괄 완료 체크",
];

function getFaceConditionMood(guide = {}) {
  return faceConditionMood[guide.level] || faceConditionMood.ready;
}

function getCompletionCopy() {
  return completionCopies[state.logs.length % completionCopies.length];
}

function getCurrentStep() {
  const activeRoutine = getActiveRoutine();
  return activeRoutine?.steps[state.activeStep] || null;
}

function getTotalSessions() {
  return state.logs.length;
}

function getLastSessionLabel() {
  if (!state.logs.length) return "-";
  return formatDate(new Date(state.logs[0].date));
}

function getStreak() {
  const days = new Set(state.logs.map((log) => getDateKey(new Date(log.date))));
  let cursor = new Date();
  let count = 0;
  while (days.has(getDateKey(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

function normalizeWeeklyGoal(value) {
  const goal = Number(value);
  return [2, 3, 5, 7].includes(goal) ? goal : 3;
}

function normalizePhotoRetention(value) {
  const next = String(value || "10");
  return ["all", "10", "5", "3", "0"].includes(next) ? next : "10";
}

function normalizeProfile(profile = {}) {
  const next = { ...profileDefaults, ...(profile || {}) };
  if (!skinTypeLabels[next.skinType]) next.skinType = profileDefaults.skinType;
  if (!concernLabels[next.mainConcern]) next.mainConcern = profileDefaults.mainConcern;
  if (!experienceLabels[next.experience]) next.experience = profileDefaults.experience;
  next.avoidZones = Array.isArray(next.avoidZones)
    ? next.avoidZones.filter((zone) => avoidZoneOptions.includes(zone))
    : [];
  return next;
}

function normalizeSafetyChecks(checks = {}) {
  return safetyCheckOptions.reduce((next, key) => {
    next[key] = Boolean(checks?.[key]);
    return next;
  }, {});
}

function ensureSafetyDate() {
  const todayKey = getDateKey(new Date());
  if (state.settings.safetyDate !== todayKey) {
    state.settings.safetyDate = todayKey;
    state.settings.safetyChecks = { ...safetyCheckDefaults };
  }
}

function getActiveSafetyCheckIds(checks = state.settings.safetyChecks) {
  const normalized = normalizeSafetyChecks(checks);
  return safetyCheckOptions.filter((key) => normalized[key]);
}

function getSafetyCheckLabel(ids) {
  if (!ids.length) return "체크 없음";
  return ids.map((key) => safetyCheckLabels[key]).join(", ");
}

function getSafetySummary() {
  ensureSafetyDate();
  const activeIds = getActiveSafetyCheckIds();
  if (!activeIds.length) {
    return {
      level: "ready",
      badge: "확인",
      title: "피부 체크",
      meta: "오늘 상태를 확인한 뒤 오늘 컨디션에 맞춰 시작하세요.",
    };
  }
  if (activeIds.includes("procedure") || activeIds.includes("irritated")) {
    return {
      level: "stop",
      badge: "쉬기",
      title: "휴식 권장",
      meta: `${getSafetyCheckLabel(activeIds)} 체크됨. 얼굴 루틴은 쉬고 피부가 차분해진 뒤 재개하세요.`,
    };
  }
  return {
    level: "caution",
    badge: "낮게",
    title: "낮은 자극",
    meta: `${getSafetyCheckLabel(activeIds)} 체크됨. 얼굴 반복은 줄이고 목·쇄골 중심으로 짧게 진행하세요.`,
  };
}

function getSafetyConditionOverride() {
  const summary = getSafetySummary();
  if (summary.level === "ready") return null;
  return {
    level: summary.level === "stop" ? "pause" : "caution",
    title: summary.title,
    badge: summary.badge,
    routine: "neck",
    pressureMode: "soft",
    skipSensitiveAreas: true,
    meta: summary.meta,
    tips: summary.level === "stop"
      ? ["얼굴 루틴 쉬기", "따가움이 남으면 도구 사용 중단", "기록만 남기고 다음 날 다시 확인", "필요하면 전문가 상담"]
      : ["목 릴리즈 4분만 진행", "트러블 부위는 건너뛰기", "같은 라인을 반복하지 않기", "마무리 후 반응 기록"],
  };
}

function getProfileRoutineId() {
  const profile = normalizeProfile(state.settings.profile);
  return {
    puffiness: "morning",
    jawline: "jaw",
    tension: "neck",
    redness: "neck",
  }[profile.mainConcern] || getPlanForDate().routine;
}

function getProfilePressureMode() {
  const profile = normalizeProfile(state.settings.profile);
  if (profile.skinType === "sensitive" || profile.mainConcern === "redness" || profile.experience === "beginner") {
    return "soft";
  }
  return state.settings.pressureMode;
}

function getAvoidZoneLabel() {
  const profile = normalizeProfile(state.settings.profile);
  if (!profile.avoidZones.length) return "피할 부위 없음";
  return `피할 부위 ${profile.avoidZones.map((zone) => zoneNames[zone]).join(", ")}`;
}

function getProfileSummary() {
  const profile = normalizeProfile(state.settings.profile);
  return `${skinTypeLabels[profile.skinType]} · ${concernLabels[profile.mainConcern]} · ${experienceLabels[profile.experience]} · ${getAvoidZoneLabel()}`;
}

function buildProfileTips() {
  const profile = normalizeProfile(state.settings.profile);
  const tips = [];
  if (profile.avoidZones.length) tips.push(getAvoidZoneLabel());
  if (profile.skinType === "dry") tips.push("건조 피부는 베이스를 한 번 더 덧바르고 짧게 밀기");
  if (profile.skinType === "oily") tips.push("유분이 많은 날은 젤 베이스와 낮은 압력 유지");
  if (profile.skinType === "sensitive") tips.push("예민 피부는 얼굴 중앙보다 목과 쇄골 방향을 먼저 확인");
  if (profile.mainConcern === "redness") tips.push("붉음 고민은 광대와 이마 반복 횟수 줄이기");
  if (profile.experience === "beginner") tips.push("입문 단계는 같은 라인을 2회 이상 반복하지 않기");
  return tips;
}

function getRecentWeekDays() {
  const today = parseDateKey(getDateKey(new Date()));
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    const dateKey = getDateKey(date);
    return {
      date,
      dateKey,
      done: hasLogOnDate(dateKey),
      today: index === 6,
    };
  });
}

function getWeeklyLogs() {
  const weekStart = parseDateKey(getDateKey(addDays(new Date(), -6)));
  return state.logs.filter((log) => new Date(log.date) >= weekStart);
}

function ensureProgramStartDate() {
  if (!state.settings.programStartDate) {
    state.settings.programStartDate = getDateKey(new Date());
  }
}

function getProgramOffset(date = new Date()) {
  ensureProgramStartDate();
  const start = parseDateKey(state.settings.programStartDate);
  const target = parseDateKey(getDateKey(date));
  const diff = Math.floor((target - start) / 86400000);
  return Math.max(0, diff);
}

function getPlanForDate(date = new Date()) {
  const offset = getProgramOffset(date);
  const plan = programDays[offset % programDays.length];
  const dateKey = getDateKey(date);
  return {
    ...plan,
    dayNumber: (offset % programDays.length) + 1,
    dateKey,
    done: hasLogOnDate(dateKey),
  };
}

function getCurrentCyclePlans() {
  const todayOffset = getProgramOffset();
  const cycleStartOffset = todayOffset - (todayOffset % programDays.length);
  const cycleStart = addDays(parseDateKey(state.settings.programStartDate), cycleStartOffset);
  return programDays.map((plan, index) => {
    const date = addDays(cycleStart, index);
    const dateKey = getDateKey(date);
    return {
      ...plan,
      dayNumber: index + 1,
      date,
      dateKey,
      done: hasLogOnDate(dateKey),
      today: dateKey === getDateKey(new Date()),
    };
  });
}

function hasLogOnDate(dateKey) {
  return state.logs.some((log) => getDateKey(new Date(log.date)) === dateKey);
}

function getLogsByDate() {
  return state.logs.reduce((grouped, log) => {
    const dateKey = getDateKey(new Date(log.date));
    grouped[dateKey] = grouped[dateKey] || [];
    grouped[dateKey].push(log);
    return grouped;
  }, {});
}

function getDailySummary(logs) {
  const priority = ["sensitive", "red", "warm", "calm"];
  const reaction = priority.find((value) => logs.some((log) => log.reaction === value)) || "calm";
  const minutes = Math.round(logs.reduce((sum, log) => sum + Number(log.duration || 0), 0) / 60);
  return {
    count: logs.length,
    minutes,
    reaction,
  };
}

function getLogRelief(log) {
  return Math.max(0, Number(log.before || 0) - Number(log.after || 0));
}

function getBestRoutineFromLogs(logs) {
  const catalog = getRoutineCatalog();
  const grouped = logs.reduce((items, log) => {
    if (!catalog[log.routine]) return items;
    items[log.routine] = items[log.routine] || { count: 0, relief: 0, calm: 0 };
    items[log.routine].count += 1;
    items[log.routine].relief += getLogRelief(log);
    items[log.routine].calm += log.reaction === "calm" ? 1 : 0;
    return items;
  }, {});
  const ranked = Object.entries(grouped).sort((a, b) => {
    const aScore = (a[1].relief / a[1].count) + (a[1].calm * 0.4);
    const bScore = (b[1].relief / b[1].count) + (b[1].calm * 0.4);
    return bScore - aScore || b[1].count - a[1].count;
  });
  return ranked[0]?.[0] || null;
}

function getRhythmReport() {
  const recentLogs = state.logs.slice(0, 7);
  const weeklyLogs = getWeeklyLogs();
  const sensitiveCount = recentLogs.filter((log) => ["red", "sensitive"].includes(log.reaction)).length;
  const averageRelief = recentLogs.length
    ? recentLogs.reduce((sum, log) => sum + getLogRelief(log), 0) / recentLogs.length
    : 0;
  const bestRoutine = getBestRoutineFromLogs(recentLogs);
  const goal = normalizeWeeklyGoal(state.settings.weeklyGoal);
  const stats = [
    { label: "최근", value: `${weeklyLogs.length}회` },
    { label: "변화", value: averageRelief ? averageRelief.toFixed(1) : "0" },
    { label: "주의", value: `${sensitiveCount}회` },
  ];

  if (!recentLogs.length) {
    return {
      title: "기록 시작",
      routine: getProfileRoutineId(),
      pressureMode: getProfilePressureMode(),
      skipSensitiveAreas: true,
      meta: `${getProfileSummary()} 기준으로 첫 기록을 남겨 리듬을 만들 수 있습니다.`,
      stats,
    };
  }

  if (sensitiveCount >= 2 || recentLogs[0].reaction === "sensitive") {
    return {
      title: "휴식 우선",
      routine: "neck",
      pressureMode: "soft",
      skipSensitiveAreas: true,
      meta: "최근 예민 반응이 있어 목 릴리즈와 낮은 압력으로 짧게 이어갑니다.",
      stats,
    };
  }

  if (weeklyLogs.length >= goal) {
    return {
      title: "목표 달성",
      routine: "neck",
      pressureMode: "soft",
      skipSensitiveAreas: true,
      meta: "이번 주 목표를 채웠습니다. 다음 기록은 낮은 자극으로 가볍게 유지하세요.",
      stats,
    };
  }

  if (bestRoutine && averageRelief >= 2) {
    return {
      title: "리듬 유지",
      routine: bestRoutine,
      pressureMode: getProfilePressureMode(),
      skipSensitiveAreas: state.settings.skipSensitiveAreas,
      meta: "최근 기록에서 편안했던 루틴을 한 번 더 적용해 흐름을 이어갑니다.",
      stats,
    };
  }

  return {
    title: "리듬 조정",
    routine: getPlanForDate().routine,
    pressureMode: "soft",
    skipSensitiveAreas: true,
    meta: "전후 느낌 차이가 작아 오늘은 계획 루틴을 낮은 압력으로 천천히 진행합니다.",
    stats,
  };
}

function getWeeklyReportRangeLabel() {
  const today = parseDateKey(getDateKey(new Date()));
  return `${getDateKey(addDays(today, -6))} ~ ${getDateKey(today)}`;
}

function getAverageReliefLabel(logs) {
  if (!logs.length) return "0";
  const average = logs.reduce((sum, log) => sum + getLogRelief(log), 0) / logs.length;
  return average ? average.toFixed(1) : "0";
}

function getReactionSummaryLabel(logs) {
  const reactions = ["calm", "warm", "red", "sensitive"];
  return reactions
    .map((reaction) => `${reactionShortLabel(reaction)} ${logs.filter((log) => log.reaction === reaction).length}`)
    .join(" · ");
}

function getRhythmReportText(report = getRhythmReport()) {
  const weeklyLogs = getWeeklyLogs();
  const routine = getRoutineCatalog()[report.routine] || baseRoutines.morning;
  const goal = normalizeWeeklyGoal(state.settings.weeklyGoal);
  const weeklyMinutes = Math.round(weeklyLogs.reduce((sum, log) => sum + Number(log.duration || 0), 0) / 60);
  const recentLines = weeklyLogs.slice(0, 7).map((log) => {
    const logRoutine = getRoutineCatalog()[log.routine] || routine;
    const note = log.note ? ` · ${log.note}` : "";
    return `- ${getDateKey(new Date(log.date))} · ${logRoutine.title} · ${reactionLabel(log.reaction)} · 전후 느낌 차이 ${getLogRelief(log)}${note}`;
  });
  return [
    "# 사괄 주간 요약",
    `기간: ${getWeeklyReportRangeLabel()}`,
    `목표: ${weeklyLogs.length}/${goal}회 · ${weeklyMinutes}분 · 평균 전후 느낌 차이 ${getAverageReliefLabel(weeklyLogs)}`,
    `반응: ${getReactionSummaryLabel(weeklyLogs)}`,
    `사진: ${getPhotoCount(weeklyLogs)}장`,
    "",
    "추천",
    `- ${report.title}: ${routine.title} · ${pressureLabel(report.pressureMode)}`,
    `- ${report.meta}`,
    "",
    "최근 기록",
    ...(recentLines.length ? recentLines : ["- 기록 없음"]),
  ].join("\n");
}

function getConditionGuide() {
  const safetyOverride = getSafetyConditionOverride();
  if (safetyOverride) return safetyOverride;
  const latest = state.logs[0] || null;
  const recentLogs = state.logs.slice(0, 5);
  const sensitiveCount = recentLogs.filter((log) => ["red", "sensitive"].includes(log.reaction)).length;
  const profileRoutine = getProfileRoutineId();
  const profilePressure = getProfilePressureMode();
  const profileTips = buildProfileTips();
  if (!latest) {
    return {
      level: "ready",
      title: "기록 전",
      badge: "대기",
      routine: profileRoutine,
      pressureMode: profilePressure,
      skipSensitiveAreas: true,
      meta: `${getProfileSummary()} 기준으로 짧게 시작하세요.`,
      tips: ["오일이나 크림을 충분히 바르기", "목과 쇄골 방향으로 먼저 정리", ...profileTips].slice(0, 4),
    };
  }
  if (latest.reaction === "sensitive" || sensitiveCount >= 2) {
    return {
      level: "pause",
      title: "자극 줄이기",
      badge: "예민",
      routine: "neck",
      pressureMode: "soft",
      skipSensitiveAreas: true,
      meta: "최근 예민 반응이 있어 얼굴 중앙보다 목과 쇄골 위주로 짧게 진행하세요.",
      tips: ["광대와 이마 압력 낮추기", "목 릴리즈 4분만 진행", "따가움이 남으면 오늘은 쉬기", ...profileTips].slice(0, 4),
    };
  }
  if (latest.reaction === "red") {
    return {
      level: "caution",
      title: "붉음 체크",
      badge: "주의",
      routine: "neck",
      pressureMode: "soft",
      skipSensitiveAreas: true,
      meta: "마지막 기록에 붉음이 있어 목과 쇄골 중심 루틴을 추천합니다.",
      tips: ["같은 부위를 반복하지 않기", "미는 속도를 절반으로 줄이기", "마무리 후 차분해지는지 기록", ...profileTips].slice(0, 4),
    };
  }
  if (latest.reaction === "warm") {
    return {
      level: "steady",
      title: "가볍게 유지",
      badge: "보통",
      routine: getPlanForDate().routine,
      pressureMode: profilePressure,
      skipSensitiveAreas: true,
      meta: "살짝 따뜻한 반응이면 압력을 낮게 유지하고 계획 루틴을 진행하세요.",
      tips: ["피부가 당기면 베이스 추가", "광대는 1회 덜 반복", "기록으로 전후 느낌 확인", ...profileTips].slice(0, 4),
    };
  }
  return {
    level: "clear",
    title: "진행 가능",
    badge: "차분",
    routine: profileRoutine,
    pressureMode: profilePressure,
    skipSensitiveAreas: state.settings.skipSensitiveAreas,
    meta: `최근 반응이 차분합니다. ${getProfileSummary()} 기준 추천을 적용할 수 있습니다.`,
    tips: ["현재 프로필 루틴 유지", "불편하면 낮은 압력으로 전환", "완료 후 피부 반응 기록", ...profileTips].slice(0, 4),
  };
}

let activeScreenName = "today";

function setScreen(name) {
  const prev = activeScreenName;
  $$(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === `screen-${name}`);
  });
  $$(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === name);
	  });
	  activeScreenName = name;
	  document.body.dataset.activeScreen = name;
	  if (prev !== name) {
    if (prev === "face-scan" && name !== "face-scan") {
      stopFaceScanSession();
    }
    if (prev === "face-guide" && name !== "face-guide") {
      stopFaceGuideTimer();
    }
  }
  if (name === "face-scan") {
    renderFaceScanScreen();
  }
  if (name === "face-routine") {
    renderFaceRoutineScreen();
  }
  if (name === "face-guide") {
    renderFaceGuideScreen();
  }
  if (name === "face-complete") {
    renderFaceCompleteScreen(faceGuideLastLog);
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function selectRoutine(id) {
  if (!getRoutineCatalog()[id]) return;
  state.selectedRoutine = id;
  if (!state.activeRoutine) {
    prepareRoutine(id);
  }
  saveState();
  render();
}

function selectZoneGuideRoutine(zone) {
  const guide = zoneGuides.find((item) => item.zone === zone);
  if (!guide) return;
  selectRoutine(guide.routine);
  setFocus(guide.zone);
  showToast(`${guide.title} 가이드를 선택했습니다.`);
}

function prepareRoutine(id) {
  const catalog = getRoutineCatalog();
  const routineId = catalog[id] ? id : "morning";
  state.activeRoutine = routineId;
  state.activeStep = 0;
  state.remaining = catalog[routineId].steps[0].seconds;
  state.running = false;
  stopTimer();
}

function startSelectedRoutine() {
  prepareRoutine(state.selectedRoutine);
  state.running = true;
  startTimer();
  saveState();
  setScreen("today");
  render();
  scrollToActiveSession();
}

function startRoutineFromCard(id) {
  if (!getRoutineCatalog()[id]) return;
  state.selectedRoutine = id;
  startSelectedRoutine();
}

function selectPlanRoutine() {
  const plan = getPlanForDate();
  selectRoutine(plan.routine);
  setScreen("today");
}

function startPlanRoutine() {
  const planRoutine = getPlanForDate().routine;
  if (hasActiveSession()) {
    state.running = true;
    startTimer();
    saveState();
    render();
    scrollToActiveSession();
    return;
  }
  state.selectedRoutine = planRoutine;
  startSelectedRoutine();
}

function hasActiveSession(routine = getActiveRoutine()) {
  const initialRemaining = routine?.steps?.[0]?.seconds || 0;
  return Boolean(state.activeRoutine && routine && (state.running || state.activeStep > 0 || state.remaining !== initialRemaining));
}

function scrollToActiveSession() {
  window.setTimeout(() => {
    $(".workbench")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
}

function resetPlan() {
  state.settings.programStartDate = getDateKey(new Date());
  saveState();
  render();
}

function applyConditionGuide() {
  const guide = getConditionGuide();
  state.selectedRoutine = getRoutineCatalog()[guide.routine] ? guide.routine : "morning";
  state.settings.pressureMode = guide.pressureMode;
  state.settings.skipSensitiveAreas = guide.skipSensitiveAreas;
  prepareRoutine(state.selectedRoutine);
  saveState();
  render();
  showToast(`${guide.title} 추천을 적용했습니다.`);
}

function applyRhythmReport() {
  const report = getRhythmReport();
  state.selectedRoutine = getRoutineCatalog()[report.routine] ? report.routine : "morning";
  state.settings.pressureMode = report.pressureMode;
  state.settings.skipSensitiveAreas = report.skipSensitiveAreas;
  prepareRoutine(state.selectedRoutine);
  saveState();
  setScreen("today");
  render();
  showToast(`${report.title} 리듬을 적용했습니다.`);
}

async function copyRhythmReport() {
  const text = getRhythmReportText();
  $("#rhythmReportPayload").value = text;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      showToast("주간 요약을 복사했습니다.");
      return;
    }
  } catch {
    // Clipboard permissions vary by browser; fall back to selecting the textarea.
  }
  $("#rhythmReportPayload").focus();
  $("#rhythmReportPayload").select();
  showToast("주간 요약을 선택했습니다.");
}

function downloadRhythmReport() {
  const text = getRhythmReportText();
  $("#rhythmReportPayload").value = text;
  const blob = new Blob([text], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `gwalsa-weekly-report-${getDateKey(new Date())}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("주간 요약 파일을 만들었습니다.");
}

async function enableReminder() {
  if (!("Notification" in window)) {
    state.settings.reminderEnabled = false;
    saveState();
    renderReminderSettings();
    showToast("이 브라우저는 알림을 지원하지 않습니다.");
    return;
  }
  const permission = Notification.permission === "default"
    ? await Notification.requestPermission()
    : Notification.permission;
  state.settings.reminderEnabled = permission === "granted";
  saveState();
  renderReminderSettings();
  startReminderLoop();
  showToast(permission === "granted" ? "알림이 켜졌습니다." : "알림 권한이 꺼져 있습니다.");
}

async function testReminder() {
  if (!state.settings.reminderEnabled || getReminderPermission() !== "granted") {
    showToast("알림을 먼저 켜세요.");
    renderReminderSettings();
    return;
  }
  await sendReminderNotification(true);
  showToast("테스트 알림을 보냈습니다.");
}

function getReminderPermission() {
  if (typeof window.Notification !== "function" || typeof Notification.permission !== "string") {
    return "unsupported";
  }
  return ["default", "granted", "denied"].includes(Notification.permission)
    ? Notification.permission
    : "unsupported";
}

async function getActiveServiceWorkerRegistration() {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return null;
    if (typeof registration.showNotification === "function") {
      return registration;
    }
    return null;
  } catch {
    return null;
  }
}

function startReminderLoop() {
  if (reminderCheckId) {
    window.clearInterval(reminderCheckId);
    reminderCheckId = null;
  }
  if (!state.settings.reminderEnabled) return;
  checkReminderDue();
  reminderCheckId = window.setInterval(checkReminderDue, 60000);
}

async function checkReminderDue() {
  if (!state.settings.reminderEnabled || getReminderPermission() !== "granted") return;
  const now = new Date();
  const todayKey = getDateKey(now);
  if (state.settings.lastReminderDate === todayKey || hasLogOnDate(todayKey)) return;
  const [hour, minute] = state.settings.reminderTime.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return;
  const reminderAt = new Date(now);
  reminderAt.setHours(hour, minute, 0, 0);
  if (now < reminderAt) return;
  await sendReminderNotification(false);
  state.settings.lastReminderDate = todayKey;
  saveState();
  renderReminderSettings();
}

async function sendReminderNotification(isTest) {
  const plan = getPlanForDate();
  const title = isTest ? "사괄 알림 테스트" : "오늘 사괄 루틴";
  const body = isTest
    ? "설정한 시간에 이런 알림이 표시됩니다. 괄사력 충전 대기 중."
    : `${plan.dayNumber}일차 ${plan.title} 루틴을 진행할 시간입니다.`;
  const notificationIcon = "./assets/icon-192.png";
  try {
    const registration = await getActiveServiceWorkerRegistration();
    if (registration) {
      await registration.showNotification(title, {
        body,
        icon: notificationIcon,
        badge: notificationIcon,
        tag: "gwalsa-routine-reminder",
      });
      return;
    }
    new Notification(title, { body, icon: notificationIcon });
  } catch {
    showToast(body);
  }
}

function showToast(message) {
  const toast = $("#toast");
  if ($("#onboardingModal") && !$("#onboardingModal").hidden) {
    hideToast();
    return;
  }
  toast.textContent = message;
  toast.classList.add("show");
  if (toastTimerId) window.clearTimeout(toastTimerId);
  toastTimerId = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function hideToast() {
  const toast = $("#toast");
  if (!toast) return;
  toast.classList.remove("show");
  if (toastTimerId) {
    window.clearTimeout(toastTimerId);
    toastTimerId = null;
  }
}

function isFaceGuideMode() {
  return state.faceGuide.mode === "live";
}

function stopFaceGuideTimer() {
  if (!isFaceGuideMode()) return;
  state.running = false;
  state.faceGuide.running = false;
  stopTimer();
  saveState();
  renderFaceGuideScreen();
}

function startFaceGuideTimer() {
  if (!isFaceGuideMode()) return;
  state.running = true;
  state.faceGuide.running = true;
  startTimer();
  saveState();
  renderFaceGuideScreen();
}

function toggleTimer() {
  if (!state.activeRoutine) {
    startSelectedRoutine();
    return;
  }
  if (isFaceGuideMode()) {
    if (state.faceGuide.running) {
      stopFaceGuideTimer();
    } else {
      startFaceGuideTimer();
    }
    return;
  }
  state.running = !state.running;
  if (state.running) startTimer();
  else stopTimer();
  saveState();
  render();
}

function startTimer() {
  stopTimer();
  timerId = window.setInterval(() => {
    state.remaining -= 1;
    if (isFaceGuideMode()) {
      state.faceGuide.runningSeconds = (state.faceGuide.runningSeconds || 0) + 1;
    }
    if (state.remaining <= 0) {
      advanceStep();
      return;
    }
    if (isFaceGuideMode()) {
      renderFaceGuideScreen();
    } else {
      renderTimer();
    }
    saveState();
  }, 1000);
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function advanceStep() {
  const activeRoutine = getActiveRoutine();
  if (!activeRoutine) return;
  if (isFaceGuideMode()) {
    if (state.activeStep < activeRoutine.steps.length - 1) {
      state.activeStep += 1;
      state.remaining = activeRoutine.steps[state.activeStep].seconds;
      state.faceGuide.activeZone = toFaceZone(activeRoutine.steps[state.activeStep].zone);
      saveState();
      renderFaceGuideScreen();
      return;
    }
    completeRoutine();
    return;
  }
  if (state.activeStep < activeRoutine.steps.length - 1) {
    state.activeStep += 1;
    state.remaining = activeRoutine.steps[state.activeStep].seconds;
    saveState();
    render();
    return;
  }
  completeRoutine();
}

function retreatStep() {
  const activeRoutine = getActiveRoutine();
  if (!activeRoutine || !isFaceGuideMode()) return;
  if (state.activeStep <= 0) {
    showToast("첫 단계입니다.");
    return;
  }
  state.activeStep -= 1;
  state.remaining = activeRoutine.steps[state.activeStep].seconds;
  state.faceGuide.activeZone = toFaceZone(activeRoutine.steps[state.activeStep].zone);
  saveState();
  renderFaceGuideScreen();
}

function completeRoutine() {
  const activeRoutine = getActiveRoutine();
  if (!activeRoutine) return;
  const completedStep = isFaceGuideMode() ? Math.min(state.activeStep + 1, activeRoutine.steps.length) : activeRoutine.steps.length;
  const totalSeconds = activeRoutine.steps.reduce((sum, step) => sum + step.seconds, 0);
  const safetyChecks = getActiveSafetyCheckIds();
  const isFaceGuide = isFaceGuideMode();
  const runSeconds = isFaceGuideMode() ? Number(state.faceGuide.runningSeconds || 0) : totalSeconds;
  const currentStep = getCurrentStep();
  const currentStepMeta = isFaceGuideMode() ? getFaceStepMeta(currentStep || activeRoutine.steps[0] || {}) : {};
  const faceGuideMeta = isFaceGuideMode() ? buildFaceGuideLogPayload(state.activeRoutine, currentStep, totalSeconds, runSeconds) : null;
  const routeSteps = Array.isArray(faceGuideMeta?.guideRouteSteps) ? faceGuideMeta.guideRouteSteps : [];
  const routeStart = routeSteps[0]
    || faceGuideMeta?.guideRouteStart
    || faceGuideMeta?.guideRoute?.split("→")?.[0]
    || "시작";
  const routeEnd = routeSteps.length
    ? routeSteps[routeSteps.length - 1]
    : faceGuideMeta?.guideRouteEnd
      || faceGuideMeta?.guideRoute?.split("→").slice(-1)?.[0]
      || "끝";
  const photos = isFaceGuide ? null : getPhotoDraft();
  const log = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    date: new Date().toISOString(),
    routine: state.activeRoutine,
    reaction: $("#skinReaction").value,
    before: Number($("#tensionBefore").value),
    after: Number($("#tensionAfter").value),
    note: $("#sessionNote").value.trim(),
    duration: isFaceGuide ? runSeconds : totalSeconds,
    photos,
    ...(faceGuideMeta || {}),
    ...(safetyChecks.length ? { safetyChecks } : {}),
  };
  if (isFaceGuide) {
    const guidanceSource = getFaceRecommendationSourceLabel(state.faceGuide.recommendation, state.faceGuide.sourceType);
    const completedZone = currentStepMeta.zoneDisplay || currentStepMeta.zoneLabel || "전체";
    const completedRoute = faceGuideMeta?.guideRouteLabel || currentStepMeta.guideRouteLabel || "연결 라인";
    const route = faceGuideMeta?.guideRoute || currentStepMeta.guideRoute || "연결 라인";
    const stepName = faceGuideMeta?.guideStepName || currentStepMeta.guideLabel || currentStep?.title || "준비 단계";
    log.source = "face-guide";
    log.faceGuide = {
      sourceType: state.faceGuide.sourceType,
      sourceLabel: getFaceSourceLabel(),
      guidanceSource,
      scanUsed: state.faceGuide.sourceType === "upload" ? "upload" : "camera",
      completedStep,
      totalSteps: activeRoutine.steps.length,
      routineId: activeRoutine && state.activeRoutine,
      routineName: activeRoutine.title,
      zone: faceGuideMeta?.guideZoneId || currentStep?.zone || "all",
      zoneLabel: completedZone,
      route,
      routeLabel: completedRoute,
      routeStart,
      routeEnd,
      routeSummary: faceGuideMeta?.guideRouteSummary,
      routeSteps,
      stepName,
      stepMeta: currentStepMeta,
      sourceConfidence: state.faceGuide.recommendation?.sourceConfidence || null,
      sourceConfidenceLabel: state.faceGuide.recommendation?.referenceOnly
        ? "참고용"
        : `${Math.round(state.faceGuide.recommendation?.sourceConfidence || 0)}%`,
      intensity: faceGuideMeta?.guideIntensity || currentStepMeta.intensity || getProfilePressureMode(),
      repeats: faceGuideMeta?.guideRepeat || currentStepMeta.repeat,
      durationSeconds: runSeconds,
      durationMinutes: Math.round((runSeconds || 0) / 60),
      recommendation: state.faceGuide.recommendation,
      confidence: faceGuideMeta?.sourceConfidence,
      activeZone: state.faceGuide.activeZone,
      priorityZone: state.faceGuide.scanPrimaryZone || state.faceGuide.activeZone || "all",
      scanResultConfidence: state.faceGuide.recommendation?.referenceOnly
        ? null
        : Number(state.faceGuide.recommendation?.sourceConfidence || 0),
      scanConfidenceSource: guidanceSource,
      detectedAt: new Date().toISOString(),
      completionSource: state.faceGuide.sourceType === "upload" ? "upload" : "camera",
    };
  }
  state.logs.unshift(log);
  const removedPhotos = enforcePhotoRetentionPolicy();
  clearPhotoDraft(false);
  faceGuideLastLog = log;
  if (isFaceGuide) {
    state.faceGuide.mode = "completed";
    state.faceGuide.running = false;
    completionNotice = null;
    renderFaceCompleteScreen(log);
    setScreen("face-complete");
  } else {
    completionNotice = {
      title: getCompletionCopy(),
      meta: `${activeRoutine.title} ${Math.round(totalSeconds / 60)}분 · ${reactionLabel(log.reaction)} · 완료 기록이 저장되었습니다.${removedPhotos ? ` 사진 ${removedPhotos}장은 보관 정책으로 정리했습니다.` : ""}`,
    };
  }
  state.activeRoutine = null;
  state.activeStep = 0;
  state.remaining = 0;
  state.running = false;
  stopTimer();
  if (isFaceGuide) {
    state.faceGuide.running = false;
    state.faceGuide.status = "complete";
  }
  saveState();
  render();
  showToast(removedPhotos
    ? `사괄 완료 · 사진 ${removedPhotos}장을 보관 정책으로 정리했습니다.`
    : "사괄 완료 · 오늘 기록을 저장했습니다.");
}

function openFaceRoutineRecommendation() {
  const recommendation = state.faceGuide.recommendation || state.faceGuide.scanRecommendation;
  if (!recommendation) {
    showToast("얼굴 참고 동선이 없습니다. 다시 준비해 주세요.");
    setScreen("face-scan");
    renderFaceScanScreen();
    return;
  }
  setScreen("face-routine");
  renderFaceRoutineScreen();
}

function startFaceGuideSession() {
  const recommendation = state.faceGuide.recommendation || state.faceGuide.scanRecommendation;
  if ((recommendation?.referenceOnly || isReferenceFaceScanResult(state.faceGuide.scanResult)) && !allowsReferenceFaceGuide()) {
    state.faceGuide.scanReady = false;
    state.faceGuide.scanRecommendation = null;
    state.faceGuide.recommendation = null;
    state.faceGuide.routineId = null;
    state.faceGuide.lastError = FACE_SCAN_REAL_MODEL_REQUIRED_MESSAGE;
    showToast(FACE_SCAN_REAL_MODEL_REQUIRED_MESSAGE);
    saveState();
    setScreen("face-scan");
    renderFaceScanScreen();
    return;
  }
  const routineId = recommendation?.routineId || state.faceGuide.routineId;
  const catalog = getRoutineCatalog();
  if (!catalog[routineId]) {
    showToast("루틴을 찾지 못했습니다. 다시 동선을 준비해 주세요.");
    return;
  }
  state.faceGuide.mode = "live";
  state.faceGuide.running = false;
  state.running = false;
  state.faceGuide.runningSeconds = 0;
  state.selectedRoutine = routineId;
  prepareRoutine(routineId);
  state.faceGuide.status = "live";
  const firstStep = getCurrentStep();
  const firstStepZone = firstStep?.zone || "all";
  state.faceGuide.activeZone = toFaceZone(firstStepZone);
  state.faceGuide.scanPrimaryZone = firstStepZone;
  state.faceGuide.scanReady = true;
  saveState();
  stopFaceScanSession();
  setScreen("face-guide");
  renderFaceGuideScreen();
}

function resetFaceGuideToScan() {
  stopFaceGuideTimer();
  stopFaceScanSession();
  state.faceGuide.mode = "idle";
  state.faceGuide.status = "idle";
  state.faceGuide.running = false;
  state.activeRoutine = null;
  state.activeStep = 0;
  state.remaining = 0;
  state.running = false;
  state.faceGuide.scanReady = false;
  state.faceGuide.scanFrameReady = false;
  state.faceGuide.scanRecommendation = null;
  state.faceGuide.recommendation = null;
  state.faceGuide.scanImageData = null;
  state.faceGuide.scanResult = null;
  state.faceGuide.routineId = null;
  state.faceGuide.scanPrimaryZone = "all";
  state.faceGuide.activeZone = "all";
  state.faceGuide.lastError = null;
  if (faceGuideRenderer) faceGuideRenderer.resetCanvas();
  if (faceScanRenderer) faceScanRenderer.resetCanvas();
  const noteInput = $("#faceCompleteNote");
  if (noteInput) {
    noteInput.value = "";
  }
  saveState();
  setScreen("face-scan");
  setFaceScanSourceType("camera");
  renderFaceScanScreen();
}

function renderFaceScanScreen() {
  const statusByMode = {
    idle: "카메라 또는 사진으로 오늘의 참고 동선을 준비합니다.",
    scanning: "카메라 화면을 확인하고 있습니다. 준비되면 촬영해 주세요.",
    ready: "참고 동선이 준비됐습니다. 루틴으로 이어갑니다.",
    processing: FACE_SCAN_MODEL_LOADING_MESSAGE,
    analyzed: "동선 준비 완료. 루틴을 확인해 주세요.",
    error: "참고 동선을 그릴 기준을 찾지 못했습니다. 밝은 정면 사진으로 다시 시도해 주세요.",
    "model-missing": FACE_SCAN_MODEL_MISSING_MESSAGE,
    "model-runtime-missing": FACE_SCAN_RUNTIME_MISSING_MESSAGE,
    "model-error": "실제 얼굴 랜드마크 감지를 사용할 수 없습니다. 모델과 런타임을 확인한 뒤 다시 시도해 주세요.",
    "camera-denied": "카메라 권한이 거부되었습니다. 크롬에서 사이트 허용 후 '카메라로 준비'를 다시 눌러 주세요.",
    "camera-test-pattern": FACE_SCAN_TEST_CAMERA_MESSAGE,
    "photo-quality-error": "사진 품질을 확인해 주세요. 밝은 정면 사진 또는 실제 카메라로 다시 시도해 주세요.",
    complete: "완료했습니다. 다시 준비하거나 기록으로 확인하세요.",
  };
  const message = statusByMode[state.faceGuide.status] || "루틴 가이드 흐름을 계속 진행합니다.";
  const panel = $("#screen-face-scan .face-panel");
  if (panel) panel.dataset.faceStatus = state.faceGuide.status || "idle";
  const placeholder = $("#faceScanPlaceholder");
  if (placeholder && getFaceScanPreviewMode() === "empty") {
    const placeholderByStatus = {
      "camera-denied": "허용이 되지 않았습니다. 크롬 설정에서 카메라 권한을 허용한 뒤 '카메라로 준비'를 다시 시도해 주세요.",
      "camera-test-pattern": FACE_SCAN_TEST_CAMERA_MESSAGE,
      error: "밝은 정면 사진으로 다시 맞춰 주세요.",
      "model-missing": FACE_SCAN_MODEL_MISSING_MESSAGE,
      "model-runtime-missing": FACE_SCAN_RUNTIME_MISSING_MESSAGE,
      "model-error": state.faceGuide.lastError || "실측 모델 연결을 확인해 주세요.",
      "photo-quality-error": state.faceGuide.lastError || "밝은 정면 사진으로 다시 맞춰 주세요.",
    };
    placeholder.textContent = placeholderByStatus[state.faceGuide.status] || "밝은 정면 화면이나 사진을 준비하면 참고 동선이 표시됩니다.";
  }
  setFaceScanStatus(["error", "camera-test-pattern", "photo-quality-error", "model-missing", "model-runtime-missing", "model-error"].includes(state.faceGuide.status) && state.faceGuide.lastError
    ? state.faceGuide.lastError
    : message);
  setFaceScanFrame(getFaceScanPreviewMode());
  const image = $("#faceScanImage");
  if (image && state.faceGuide.scanImageData) {
    image.src = state.faceGuide.scanImageData;
  }
  if (state.faceGuide.scanResult && getFaceScanPreviewMode() === "upload") {
    faceScanRenderer?.render(state.faceGuide.scanResult, state.faceGuide.activeZone, getFaceStepMeta({
      zone: state.faceGuide.scanPrimaryZone || state.faceGuide.activeZone,
      pressure: state.faceGuide.recommendation?.pressureMode || state.faceGuide.scanRecommendation?.pressureMode,
    }));
  }
  setFaceCaptureControls(Boolean(faceScanStream));
  const capture = $("#captureFaceScanButton");
  if (capture) capture.disabled = !faceScanStream;
  const routineTag = $("#faceRoutineTag");
  if (routineTag) {
    routineTag.textContent = state.faceGuide.sourceLabel || getFaceSourceLabel();
  }
}

function renderFaceRoutineScreen() {
  const recommendation = state.faceGuide.recommendation || state.faceGuide.scanRecommendation;
  const catalog = getRoutineCatalog();
  const routineId = recommendation?.routineId || state.faceGuide.routineId;
  const routine = catalog[routineId] || getSelectedRoutine();
  const focusZone = recommendation?.zones?.[0] || "all";
  const focusMeta = getFaceStepMeta({ zone: focusZone, pressure: recommendation?.pressureMode || getProfilePressureMode() });
  const sourceLabel = getFaceRecommendationSourceLabel(recommendation, state.faceGuide.sourceType);
  const isReferenceGuide = Boolean(recommendation?.referenceOnly) || isReferenceFaceScanResult(state.faceGuide.scanResult);
  const sourceConfidence = Number(recommendation?.sourceConfidence || 0);
  const sourceText = isReferenceGuide ? "참고용" : sourceConfidence ? `${Math.round(sourceConfidence)}%` : "모델값 없음";
  const pressureText = pressureLabel(recommendation?.pressureMode || getProfilePressureMode()).replace(" 압력", "");
  const careHeadline = recommendation?.headline || "오늘은 부드러운 가이드 루틴으로 시작하면 좋아요.";
  let reason = recommendation?.reason || "피부 컨디션 기준으로 오늘의 케어를 추천합니다. 의료 진단이 아닙니다.";
  const routeSummary = focusMeta.guideRouteSummary || focusMeta.guideRoute || "연결 라인";
  if (getProfilePressureMode() === "soft") {
    reason = `${careHeadline} 오늘은 ${reason} 가볍게 시작해요.`;
  } else {
    reason = `${careHeadline} 오늘은 ${reason} 단계별로 천천히 진행해요.`;
  }
  const zones = Array.isArray(recommendation?.zones) ? recommendation.zones : ["jawline", "cheek", "forehead", "neck"];
  const scoreSummary = recommendation?.scoreSummary || {};
  $("#faceRoutineTitle").textContent = `${routine.title} 참고 루틴`;
  $("#faceRoutineTag").textContent = sourceLabel;
  const sourceMeta = $("#faceRoutineSourceBadge");
  const confidenceMeta = $("#faceRoutineConfidence");
  if (sourceMeta) sourceMeta.textContent = sourceLabel;
  if (confidenceMeta) confidenceMeta.textContent = isReferenceGuide ? `가이드 기준 ${sourceText}` : `모델 참고값 ${sourceText}`;
  $("#faceRoutineReason").textContent = recommendation?.title
    ? `${recommendation.title}. ${careHeadline}`
    : "오늘의 케어 추천";
  const routineSummary = $("#faceRoutineSummary");
  routineSummary.innerHTML = `
    <span><strong>기준</strong>${escapeHtml(sourceLabel)}</span>
    <span><strong>시간</strong>${escapeHtml(String(recommendation?.estimatedMinutes || routine.minutes || 0))}분</span>
    <span><strong>압력</strong>${escapeHtml(pressureText)}</span>
    <span><strong>포인트</strong>${escapeHtml(routeSummary)}</span>
  `;
  if (recommendation?.note) {
    routineSummary.insertAdjacentHTML("beforeend", `<span class="face-summary-note"><strong>안내</strong>${escapeHtml(recommendation.note)}</span>`);
  }
  if (recommendation?.scoreSummary) {
    const scoreText = Object.entries(scoreSummary)
      .map(([key, value]) => `${faceZoneLabelMap[key] || key} ${value.toFixed(2)}`)
      .join(" · ");
    if (scoreText) {
      routineSummary.dataset.priority = scoreText;
    }
  }
  $("#faceRoutineZones").innerHTML = zones.map((zone) => `
    <span class="face-guide-chip">${escapeHtml(faceZoneLabelMap[zone] || zone)} 가이드</span>
  `).join("");
  $("#faceRoutineSteps").innerHTML = routine.steps.map((step, index) => {
    const stepMeta = getFaceStepMeta(step);
    const stepRoute = stepMeta.guideRouteSummary || `${stepMeta.guideRouteLabel} 진행`;
    return `
    <article class="face-guide-step-item">
      <p class="face-guide-meta-label">${escapeHtml(stepMeta.zoneLabel)} · ${escapeHtml(step.strokes || "8회")} · ${escapeHtml(step.pressure || "낮게")}</p>
      <h3>${escapeHtml(`${index + 1}. ${step.title}`)}</h3>
      <p>${escapeHtml(stepMeta.direction)}</p>
      <p class="face-guide-tip">${escapeHtml(stepRoute)} · 반복 ${escapeHtml(stepMeta.repeat)} · 강도 ${escapeHtml(stepMeta.intensity)}</p>
    </article>
  `;}).join("");
  renderFaceSimulationCard();
  const startButton = $("#startFaceGuideButton");
  if (startButton) {
    const referenceBlocked = isReferenceGuide && !allowsReferenceFaceGuide();
    startButton.disabled = referenceBlocked || (!state.faceGuide.scanReady && !state.faceGuide.recommendation);
  }
}

function renderFaceGuideScreen() {
  const activeRoutine = getActiveRoutine();
  const currentStep = getCurrentStep();
  const totalSteps = activeRoutine?.steps?.length || 0;
  const currentStepMeta = getFaceStepMeta(currentStep || {});
  const clock = formatClock(Math.max(0, state.remaining));
  const isReady = Boolean(currentStep);
  $("#faceGuideMinutes").textContent = clock.minutes;
  $("#faceGuideSeconds").textContent = clock.seconds;
  $("#faceGuideTitle").textContent = activeRoutine ? `${activeRoutine.title} 실전 가이드` : "실전 가이드";
  const stepName = currentStep ? `${currentStep.title}` : "단계 없음";
  $("#faceGuideStepText").textContent = currentStep
    ? `현재 단계: ${stepName}`
    : "단계를 확인하고 시작하세요.";
  const stepNameTarget = $("#faceGuideStepName");
  if (stepNameTarget) {
    stepNameTarget.textContent = `현재 단계명: ${currentStep ? stepName : "준비"}`;
  }
  const totalSeconds = activeRoutine?.steps.reduce((sum, step) => sum + Number(step.seconds || 0), 0) || 1;
  const remainingRoutineSeconds = activeRoutine?.steps
    .slice(state.activeStep)
    .reduce((sum, step, index) => sum + Number(step.seconds || 0), 0) || 0;
  const currentStepSeconds = currentStep ? Number(currentStep.seconds || 1) : 1;
  const stepProgress = Math.max(0, 1 - Math.max(0, state.remaining) / currentStepSeconds);
  const safeActiveStep = Math.min(state.activeStep, Math.max(0, totalSteps - 1));
  const progressPercent = totalSteps
    ? Math.round(((safeActiveStep + stepProgress) / totalSteps) * 100)
    : 0;
  const progressText = totalSteps
    ? `단계 ${safeActiveStep + 1}/${totalSteps}`
    : "0/0";
  $("#faceGuideProgress").textContent = progressText;
  const progressFill = $("#faceGuideProgressFill");
  const progressTextElement = $("#faceGuideProgressText");
  if (progressFill) progressFill.style.width = `${progressPercent}%`;
  if (progressTextElement) {
    progressTextElement.textContent = `진행률 ${progressPercent}% · 남은 시간 ${clock.minutes}:${clock.seconds} / ${Math.floor(totalSeconds / 60)}분`;
  }
  const faceGuideAreaMeta = $("#faceGuideAreaMeta");
  const faceGuidePressureMeta = $("#faceGuidePressureMeta");
  if (faceGuideAreaMeta) {
    const currentRoute = currentStepMeta.guideRouteSummary || currentStepMeta.guideRouteLabel;
    faceGuideAreaMeta.textContent = `현재 부위: ${escapeHtml(currentStepMeta.zoneDisplay || currentStepMeta.zoneLabel)} · ${escapeHtml(currentRoute || "연결 라인")}`;
  }
  if (faceGuidePressureMeta) {
    faceGuidePressureMeta.textContent = `권장 강도: ${escapeHtml(currentStepMeta.intensity || getProfilePressureMode())}`;
  }
  $("#faceGuideDirectionMeta").textContent = `방향 ${escapeHtml(currentStepMeta.direction)}`;
  $("#faceGuideRepeatMeta").textContent = `반복 ${escapeHtml(currentStepMeta.repeat)}`;
  $("#faceGuideIntensityMeta").textContent = `강도 ${escapeHtml(currentStepMeta.intensity)}`;
  $("#faceGuideMeta").textContent = currentStep
    ? `${escapeHtml(currentStepMeta.zoneDisplay || currentStepMeta.zoneLabel)} · ${escapeHtml(currentStepMeta.guideRouteSummary || currentStepMeta.guideRouteLabel || "연결 라인")} · ${escapeHtml(currentStep.strokes || "8회")} · ${escapeHtml(currentStepMeta.intensity || "낮게")}`
    : "추천 단계가 없습니다.";
  if ($("#faceGuideCountdown")) {
    $("#faceGuideCountdown").textContent = `남은 루틴 시간: ${Math.floor(remainingRoutineSeconds / 60)}분 ${remainingRoutineSeconds % 60}초`;
  }
  const buttonLabel = state.faceGuide.running ? "일시정지" : "시작";
  $("#faceGuideStartPauseButton").textContent = buttonLabel;
  const isLastStep = totalSteps && state.activeStep >= totalSteps - 1;
  if (currentStep && activeRoutine) {
    state.faceGuide.activeZone = toFaceZone(currentStep.zone);
    const zoneName = escapeHtml(currentStepMeta.zoneLabel);
    $("#faceGuideDirections").innerHTML = activeRoutine.steps.map((step, index) => {
      const stepMeta = getFaceStepMeta(step);
      const stepRoute = stepMeta.guideRouteSummary || `${stepMeta.guideRouteLabel} 진행`;
      return `
      <article class="face-guide-step-item ${index === state.activeStep ? "active" : ""}">
        <strong>${escapeHtml(`${index + 1}. ${stepMeta.zoneLabel}`)}</strong>
        <p>${escapeHtml(stepMeta.direction)}</p>
        <small>${escapeHtml(`${stepRoute} · 반복 ${stepMeta.repeat} · 강도 ${stepMeta.intensity}`)}</small>
      </article>
    `;
    }).join("");
    if (state.faceGuide.scanResult) {
      faceGuideRenderer?.render(state.faceGuide.scanResult, state.faceGuide.activeZone, {
        ...currentStepMeta,
        zoneLabel: zoneName,
      });
    } else {
      faceGuideRenderer?.resetCanvas();
    }
  } else {
    $("#faceGuideDirections").innerHTML = `<div class="empty-state">추천 단계를 불러오지 못했습니다.</div>`;
    faceGuideRenderer?.resetCanvas();
  }
  const next = $("#faceGuideNextStepButton");
  const complete = $("#faceGuideCompleteButton");
  const prev = $("#faceGuidePrevStepButton");
  const startPause = $("#faceGuideStartPauseButton");
  if (prev) prev.disabled = !isReady || state.activeStep <= 0;
  if (next) {
    next.disabled = !isReady || isLastStep;
    next.textContent = isLastStep ? "다음 없음" : "다음";
  }
  if (complete) complete.disabled = !isReady || state.activeRoutine === null;
  if (startPause) startPause.disabled = !isReady;
}

function renderFaceCompleteScreen(log) {
  const data = log || faceGuideLastLog;
  const routine = getRoutineCatalog()[data?.routine] || getSelectedRoutine();
  const minutes = Math.round((Number(data?.duration || 0)) / 60);
  const faceMeta = data?.faceGuide || {};
  const sourceLabel = faceMeta.sourceLabel || data?.sourceLabel || getFaceSourceLabel();
  const sectionText = `단계 ${faceMeta.completedStep || 0}/${faceMeta.totalSteps || 0}`;
  const scanUsed = faceMeta.scanUsed || data?.scanUsed || (data?.source === "face-guide" ? "camera" : "local");
  const scanMode = scanUsed === "upload" ? "사진 업로드" : "카메라 준비";
  const saveIntensity = data?.guideIntensity || faceMeta.intensity || "보통";
  const recordedZone = data?.guideZone || faceMeta.zoneLabel || faceMeta.zone || "전체";
  const recordedRoute = data?.guideRouteLabel || faceMeta.routeLabel || "연결 라인";
  const recordedRouteId = data?.guideRoute || faceMeta.route || "-";
  const recordedStep = data?.guideStepName || faceMeta.stepName || "단계 진행";
  const routeStart = faceMeta.routeStart || recordedRouteId.split("→")[0] || "시작";
  const routeEnd = faceMeta.routeEnd || recordedRouteId.split("→").slice(-1)[0] || "끝";
  const referenceOnly = Boolean(faceMeta.recommendation?.referenceOnly || data?.referenceOnly);
  const confidenceText = referenceOnly
    ? "참고용"
    : Number(faceMeta.scanResultConfidence || faceMeta.recommendation?.sourceConfidence || data?.sourceConfidence || 0);
  $("#faceCompleteTitle").textContent = getCompletionCopy();
  $("#faceCompleteMeta").textContent = `${routine.title} ${minutes}분 · ${reactionLabel(data?.reaction || "calm")} · ${sectionText}`;
  const completionZone = faceMeta.routeZone || faceMeta.guideZone || faceMeta.zone || recordedZone || "전체";
  const completionRoute = recordedRoute || "연결 라인";
  $("#faceCompleteDetail").innerHTML = `
    <p><strong>추천 기준:</strong> ${escapeHtml(sourceLabel)}</p>
    <p><strong>준비 방식:</strong> ${escapeHtml(scanMode)}</p>
    <p><strong>진행 단계:</strong> ${escapeHtml(recordedStep)}</p>
    <p><strong>진행 영역:</strong> ${escapeHtml(completionZone || "전체")} · ${escapeHtml(completionRoute)}</p>
    <p><strong>동선:</strong> ${escapeHtml(routeStart)} → ${escapeHtml(routeEnd)} · 반복 ${escapeHtml(faceMeta.repeats || "-")} · ${escapeHtml(saveIntensity || "-")}</p>
    <p><strong>참고 가이드 기준:</strong> ${escapeHtml(referenceOnly ? confidenceText : confidenceText ? `${confidenceText}% 모델 참고값` : "참고값 미기록")}</p>
    <p><strong>완료 안내:</strong> 비의료형 셀프 가이드만 제공합니다.</p>
    <p><strong>기록 항목:</strong> ${data?.faceGuide ? "참고 가이드 기록" : "루틴 기록"}${data?.faceGuide?.guidanceSource ? ` (${escapeHtml(data.faceGuide.guidanceSource)})` : ""}</p>
    <p><strong>원본 이미지 저장:</strong> ${scanUsed === "upload" ? "업로드 이미지 파일은 기록 외부 보관되지 않습니다." : "카메라 프레임은 로컬에서만 사용"}</p>
    <p><strong>저장 동의:</strong> ${escapeHtml((state.settings.photoRetention || "all") === "0" ? "사진 미저장" : "사진 보관 정책 적용")}</p>
    <p><strong>완료 시간:</strong> ${escapeHtml(formatDate(new Date(data?.date || Date.now())))}</p>
  `;
  const recordMeta = $("#faceCompleteRecordMeta");
  if (recordMeta) {
    recordMeta.textContent = `로컬 기록 저장됨 · 추천 기준 ${escapeHtml(sourceLabel)}`;
  }
  const noteInput = $("#faceCompleteNote");
  if (noteInput) {
    noteInput.value = data?.note || "";
  }
  const noteButton = $("#faceCompleteSaveNoteButton");
  if (noteButton) {
    noteButton.disabled = !data?.id;
  }
}

function saveFaceGuideCompleteNote() {
  const noteInput = $("#faceCompleteNote");
  const noteText = noteInput?.value?.trim() || "";
  if (!faceGuideLastLog?.id) {
    showToast("저장할 완료 기록이 없습니다.");
    return;
  }
  const logIndex = state.logs.findIndex((entry) => entry.id === faceGuideLastLog.id);
  if (logIndex < 0) {
    showToast("기록을 찾지 못했습니다.");
    return;
  }
  const currentLog = state.logs[logIndex];
  state.logs[logIndex] = {
    ...currentLog,
    note: noteText,
    faceGuide: {
      ...currentLog.faceGuide,
      noteSavedAt: new Date().toISOString(),
    },
  };
  faceGuideLastLog = state.logs[logIndex];
  saveState();
  renderFaceCompleteScreen(faceGuideLastLog);
  renderLogs();
  showToast(noteText ? "완료 메모를 저장했습니다." : "메모를 비워둔 상태로 저장했습니다.");
}

function saveManualLog() {
  const safetyChecks = getActiveSafetyCheckIds();
  state.logs.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    date: new Date().toISOString(),
    routine: state.selectedRoutine,
    reaction: $("#skinReaction").value,
    before: Number($("#tensionBefore").value),
    after: Number($("#tensionAfter").value),
    note: $("#sessionNote").value.trim(),
    duration: getSelectedRoutine().minutes * 60,
    photos: getPhotoDraft(),
    ...(safetyChecks.length ? { safetyChecks } : {}),
  });
  const removedPhotos = enforcePhotoRetentionPolicy();
  $("#sessionNote").value = "";
  clearPhotoDraft(false);
  saveState();
  render();
  showToast(removedPhotos
    ? `기록 저장 · 사진 ${removedPhotos}장을 보관 정책으로 정리했습니다.`
    : "기록을 저장했습니다.");
}

function clearLogs() {
  if (!state.logs.length) {
    showToast("삭제할 기록이 없습니다.");
    return;
  }
  undoPayload = {
    type: "all",
    logs: state.logs,
    filter: state.logFilter,
  };
  state.logs = [];
  state.logFilter = "all";
  saveState();
  render();
  showToast("전체 기록을 삭제했습니다. 복원할 수 있습니다.");
}

function deleteLog(id) {
  const index = state.logs.findIndex((log) => log.id === id);
  if (index < 0) return;
  const [deletedLog] = state.logs.splice(index, 1);
  undoPayload = {
    type: "single",
    logs: [deletedLog],
    index,
    filter: state.logFilter,
  };
  saveState();
  render();
  showToast("기록을 삭제했습니다. 복원할 수 있습니다.");
}

function createStateUndoPayload(action) {
  return {
    type: "state",
    action,
    selectedRoutine: state.selectedRoutine,
    activeRoutine: state.activeRoutine,
    activeStep: state.activeStep,
    remaining: state.remaining,
    logs: cloneData(state.logs),
    logFilter: state.logFilter,
    customRoutines: cloneData(state.customRoutines),
    settings: cloneData(state.settings),
  };
}

function restoreStateUndoPayload() {
  state.selectedRoutine = undoPayload.selectedRoutine || "morning";
  state.activeRoutine = undoPayload.activeRoutine || null;
  state.activeStep = undoPayload.activeStep || 0;
  state.remaining = undoPayload.remaining || 0;
  state.logs = cloneData(undoPayload.logs || []);
  state.logFilter = undoPayload.logFilter || "all";
  state.customRoutines = cloneData(undoPayload.customRoutines || {});
  state.settings = cloneData(undoPayload.settings || state.settings);
  state.settings.profile = normalizeProfile(state.settings.profile);
  state.settings.weeklyGoal = normalizeWeeklyGoal(state.settings.weeklyGoal);
  state.settings.photoRetention = normalizePhotoRetention(state.settings.photoRetention);
  state.settings.safetyChecks = normalizeSafetyChecks(state.settings.safetyChecks);
  ensureSafetyDate();
  const catalog = getRoutineCatalog();
  if (!catalog[state.selectedRoutine]) state.selectedRoutine = "morning";
  if (state.activeRoutine && !catalog[state.activeRoutine]) state.activeRoutine = null;
  state.running = false;
  stopTimer();
}

function restoreDeletedLog() {
  if (!undoPayload || (undoPayload.type !== "state" && !undoPayload.logs?.length)) {
    showToast("복원할 기록이 없습니다.");
    return;
  }
  let message = "삭제한 기록을 복원했습니다.";
  if (undoPayload.type === "state") {
    restoreStateUndoPayload();
    message = `${undoPayload.action || "변경"} 전 상태로 되돌렸습니다.`;
  } else if (undoPayload.type === "all") {
    const existingIds = new Set(state.logs.map((log) => log.id));
    const restoredLogs = undoPayload.logs.filter((log) => !existingIds.has(log.id));
    state.logs = [...restoredLogs, ...state.logs];
    state.logFilter = undoPayload.filter || "all";
  } else {
    const index = Math.min(Math.max(undoPayload.index || 0, 0), state.logs.length);
    state.logs.splice(index, 0, undoPayload.logs[0]);
    state.logFilter = undoPayload.filter || state.logFilter;
  }
  undoPayload = null;
  saveState();
  render();
  showToast(message);
}

function clearStoredPhotos() {
  const photoCount = getPhotoCount();
  if (!photoCount) {
    showToast("삭제할 사진이 없습니다.");
    return;
  }
  state.logs = state.logs.map((log) => {
    if (!log.photos) return log;
    const { photos, ...rest } = log;
    return rest;
  });
  clearPhotoDraft(false);
  saveState();
  render();
  $("#backupSummaryValue").textContent = `사진 ${photoCount}장을 삭제했습니다. 기록은 유지됩니다.`;
  showToast(`사진 ${photoCount}장을 삭제했습니다.`);
}

function resetAppData() {
  if (!window.confirm("기록, 사진, 커스텀 루틴, 설정을 이 브라우저에서 초기화할까요?")) return;
  undoPayload = createStateUndoPayload("초기화");
  stopTimer();
  completionNotice = null;
  Object.assign(state, getDefaultAppState());
  ensureProgramStartDate();
  ensureSafetyDate();
  prepareRoutine(state.selectedRoutine);
  saveState();
  render();
  showToast("앱 데이터를 초기화했습니다. 복원할 수 있습니다.");
}

async function copyPolicyText() {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(policySummaryText);
      showToast("정책 요약을 복사했습니다.");
      return;
    }
  } catch {
    // Clipboard permissions vary by browser.
  }
  try {
    const fallback = document.createElement("textarea");
    fallback.value = policySummaryText;
    fallback.setAttribute("readonly", "readonly");
    fallback.style.position = "fixed";
    fallback.style.left = "-9999px";
    fallback.style.opacity = "0";
    document.body.appendChild(fallback);
    fallback.select();
    fallback.setSelectionRange(0, fallback.value.length);
    const copied = document.execCommand("copy");
    fallback.remove();
    if (copied) {
      showToast("정책 요약을 복사했습니다.");
      return;
    }
  } catch {
    // Fallback copy failed as well.
  }
  showToast("브라우저 복사 권한을 확인하세요.");
}

function openPolicyUrl(url, label) {
  if (!url) {
    showToast(`${label} URL이 아직 설정되지 않았습니다. 공개 링크를 먼저 등록하세요.`);
    return;
  }
  const resolvedUrl = (() => {
    try {
      return new URL(url, window.location.href).toString();
    } catch {
      return url;
    }
  })();
  const opened = window.open(resolvedUrl, "_blank", "noopener,noreferrer");
  if (!opened) {
    location.href = resolvedUrl;
  }
}

function getPhotoDraft() {
  const photos = {};
  if (state.photoDraft.before) photos.before = state.photoDraft.before;
  if (state.photoDraft.after) photos.after = state.photoDraft.after;
  return Object.keys(photos).length ? photos : null;
}

function clearPhotoDraft(shouldRender = true) {
  state.photoDraft.before = null;
  state.photoDraft.after = null;
  $("#beforePhoto").value = "";
  $("#afterPhoto").value = "";
  if (shouldRender) render();
}

async function handlePhotoInput(kind, file) {
  if (!file) return;
  try {
    const compressed = await compressPhoto(file);
    state.photoDraft[kind] = {
      dataUrl: compressed.dataUrl,
      width: compressed.width,
      height: compressed.height,
      bytes: compressed.bytes,
      name: file.name,
    };
    renderPhotoDraft();
    if (kind === "before") {
      $("#beforePhoto").value = "";
    } else if (kind === "after") {
      $("#afterPhoto").value = "";
    }
  } catch {
    showToast("이미지 압축에 실패했습니다. 다른 사진을 선택해 주세요.");
    if (kind === "before") {
      $("#beforePhoto").value = "";
    } else if (kind === "after") {
      $("#afterPhoto").value = "";
    }
  }
}

function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file?.type || !file.type.startsWith("image/")) {
      reject(new Error("NOT_IMAGE"));
      return;
    }
    if (file.size > PHOTO_MAX_FILE_BYTES) {
      reject(new Error("FILE_TOO_LARGE"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSide = 520;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("CANVAS_CONTEXT"));
          return;
        }
        context.drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.68);
        resolve({
          dataUrl,
          width,
          height,
          bytes: Math.round((dataUrl.length * 3) / 4),
        });
      };
      image.onerror = reject;
      image.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function createCustomRoutine() {
  const name = $("#customRoutineName").value.trim();
  const focus = $("#customRoutineFocus").value;
  const minutes = Number($("#customRoutineLength").value);
  const id = `custom-${Date.now()}`;
  state.customRoutines[id] = buildCustomRoutine(name, focus, minutes);
  state.selectedRoutine = id;
  prepareRoutine(id);
  $("#customRoutineName").value = "";
  saveState();
  render();
}

function buildCustomRoutine(name, focus, minutes) {
  const template = customTemplates[focus] || customTemplates.balanced;
  const totalSeconds = minutes * 60;
  const baseSeconds = Math.floor(totalSeconds / template.length);
  const extraSeconds = totalSeconds - baseSeconds * template.length;
  return {
    title: name || `${focusLabel(focus)} 루틴`,
    minutes,
    custom: true,
    focus,
    difficulty: minutes <= 3 ? "초간단" : minutes <= 5 ? "쉬움" : "보통",
    tag: "내 얼굴 사정 반영",
    situation: `${focusLabel(focus)}이 필요한 날`,
    description: `${focusLabel(focus)} 중심으로 직접 만든 사괄 루틴입니다.`,
    steps: template.map((step, index) => ({
      ...step,
      seconds: baseSeconds + (index === template.length - 1 ? extraSeconds : 0),
    })),
  };
}

const customTemplates = {
  balanced: [
    { zone: "neck", title: "목 정리", strokes: "8회", pressure: "낮게", cue: "귀 아래에서 쇄골까지" },
    { zone: "jaw", title: "턱선 정리", strokes: "10회", pressure: "보통", cue: "턱끝에서 귀밑까지" },
    { zone: "cheek", title: "광대 라인", strokes: "10회", pressure: "보통", cue: "코 옆에서 관자 방향" },
    { zone: "brow", title: "이마 마감", strokes: "8회", pressure: "낮게", cue: "눈썹 위에서 헤어라인까지" },
  ],
  neck: [
    { zone: "neck", title: "쇄골 열기", strokes: "8회", pressure: "낮게", cue: "중앙에서 바깥쪽" },
    { zone: "neck", title: "옆목 내리기", strokes: "10회", pressure: "낮게", cue: "턱 아래에서 쇄골까지" },
    { zone: "neck", title: "승모 주변", strokes: "8회", pressure: "보통", cue: "목 끝에서 어깨 방향" },
  ],
  jaw: [
    { zone: "neck", title: "귀밑 풀기", strokes: "8회", pressure: "낮게", cue: "작은 원으로 천천히" },
    { zone: "jaw", title: "턱 중앙", strokes: "12회", pressure: "보통", cue: "턱끝에서 귀밑까지" },
    { zone: "jaw", title: "입가 바깥", strokes: "10회", pressure: "보통", cue: "입꼬리에서 광대 아래까지" },
  ],
  cheek: [
    { zone: "neck", title: "목 정리", strokes: "8회", pressure: "낮게", cue: "귀 아래에서 쇄골까지" },
    { zone: "cheek", title: "볼 아래 받치기", strokes: "10회", pressure: "낮게", cue: "볼 아래를 위로 밀기" },
    { zone: "cheek", title: "광대 바깥", strokes: "12회", pressure: "보통", cue: "코 옆에서 관자 방향" },
  ],
  brow: [
    { zone: "neck", title: "목 준비", strokes: "8회", pressure: "낮게", cue: "쇄골 방향으로 내리기" },
    { zone: "brow", title: "눈썹 위", strokes: "8회", pressure: "낮게", cue: "눈썹 위를 바깥쪽으로" },
    { zone: "brow", title: "이마 중앙", strokes: "8회", pressure: "낮게", cue: "중앙에서 헤어라인까지" },
  ],
};

function focusLabel(focus) {
  return {
    balanced: "전체 밸런스",
    neck: "목 집중",
    jaw: "턱선 집중",
    cheek: "광대 집중",
    brow: "이마 집중",
  }[focus] || "커스텀";
}

function deleteCustomRoutine(id) {
  if (!state.customRoutines[id]) return;
  delete state.customRoutines[id];
  if (state.selectedRoutine === id) {
    state.selectedRoutine = "morning";
  }
  if (state.activeRoutine === id) {
    prepareRoutine(state.selectedRoutine);
  }
  saveState();
  render();
}

function getPhotoCount(logs = state.logs) {
  return logs.reduce((sum, log) => {
    return sum + (log.photos?.before ? 1 : 0) + (log.photos?.after ? 1 : 0);
  }, 0);
}

function getPhotoSessionCount(logs = state.logs) {
  return logs.filter((log) => Boolean(log.photos?.before || log.photos?.after)).length;
}

function getPhotoRetentionLabel(value = state.settings.photoRetention) {
  const normalized = normalizePhotoRetention(value);
  if (normalized === "all") return "제한 없음";
  if (normalized === "0") return "저장 안 함";
  return `최근 ${normalized}건`;
}

function enforcePhotoRetentionPolicy() {
  const retention = normalizePhotoRetention(state.settings.photoRetention);
  state.settings.photoRetention = retention;
  if (retention === "all") return 0;

  const limit = Number(retention);
  let keptSessions = 0;
  let removedPhotos = 0;
  state.logs = state.logs.map((log) => {
    if (!log.photos) return log;
    if (!log.photos.before && !log.photos.after) {
      const { photos, ...rest } = log;
      return rest;
    }
    if (keptSessions < limit) {
      keptSessions += 1;
      return log;
    }
    removedPhotos += (log.photos.before ? 1 : 0) + (log.photos.after ? 1 : 0);
    const { photos, ...rest } = log;
    return rest;
  });
  return removedPhotos;
}

function applyPhotoRetentionPolicy() {
  const removedPhotos = enforcePhotoRetentionPolicy();
  saveState();
  render();
  if (removedPhotos) {
    $("#backupSummaryValue").textContent = `사진 ${removedPhotos}장을 보관 정책으로 정리했습니다. 기록은 유지됩니다.`;
    showToast(`사진 ${removedPhotos}장을 정리했습니다.`);
    return;
  }
  showToast("사진 보관 정책에 맞게 정리된 상태입니다.");
}

function createBackupPayload(includePhotos) {
  const logs = includePhotos
    ? state.logs
    : state.logs.map((log) => {
        const { photos, ...rest } = log;
        return rest;
      });
  const payload = {
    version: 1,
    appBuild,
    exportedAt: new Date().toISOString(),
    backupMode: includePhotos ? "full" : "light",
    selectedRoutine: state.selectedRoutine,
    logFilter: state.logFilter,
    customRoutines: state.customRoutines,
    logs,
    settings: state.settings,
  };
  payload.backupCode = getBackupCode(payload);
  return payload;
}

function backupModeLabel(value) {
  return value === "light" ? "사진 제외 백업" : "전체 백업";
}

function getCanonicalBackupValue(value) {
  if (Array.isArray(value)) return value.map(getCanonicalBackupValue);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value)
    .filter((key) => key !== "backupCode" && key !== "backupCodeStatus")
    .sort()
    .reduce((next, key) => {
      next[key] = getCanonicalBackupValue(value[key]);
      return next;
    }, {});
}

function hashBackupText(text) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36).toUpperCase().padStart(7, "0");
}

function getBackupCode(payload) {
  return `GWA-${hashBackupText(JSON.stringify(getCanonicalBackupValue(payload)))}`;
}

function getBackupCodeStatus(payload) {
  const computedCode = getBackupCode(payload);
  const providedCode = typeof payload.backupCode === "string" ? payload.backupCode : "";
  if (!providedCode) return { code: computedCode, status: "missing" };
  if (providedCode !== computedCode) {
    throw new Error("Backup code mismatch");
  }
  return { code: providedCode, status: "matched" };
}

function getBackupCodeLabel(payload) {
  if (payload.backupCodeStatus === "missing") return `검증 ${payload.backupCode} 생성`;
  return `검증 ${payload.backupCode}`;
}

function clampNumber(value, min, max, fallback = min) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function sanitizeBackupText(value, maxLength = 500) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizeImportedPhoto(photo) {
  const src = getSafePhotoSrc(photo);
  if (!src || src.length > PHOTO_DATA_URL_MAX_CHARS) return null;
  return {
    dataUrl: src,
    width: clampNumber(photo?.width, 1, 3000, 1),
    height: clampNumber(photo?.height, 1, 3000, 1),
    bytes: clampNumber(photo?.bytes, 0, 3 * 1024 * 1024, Math.round((src.length * 3) / 4)),
    name: sanitizeBackupText(photo?.name, 120),
  };
}

function normalizeImportedPhotos(photos) {
  if (!photos || typeof photos !== "object") return null;
  const before = normalizeImportedPhoto(photos.before);
  const after = normalizeImportedPhoto(photos.after);
  if (!before && !after) return null;
  return {
    ...(before ? { before } : {}),
    ...(after ? { after } : {}),
  };
}

function normalizeSmallBackupObject(value, maxLength = 12000) {
  if (!value || typeof value !== "object") return null;
  try {
    const text = JSON.stringify(value);
    if (!text || text.length > maxLength) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function normalizeImportedStep(step) {
  if (!step || typeof step !== "object") return null;
  const zone = zoneNames[step.zone] ? step.zone : "neck";
  return {
    zone,
    title: sanitizeBackupText(step.title || zoneNames[zone], 80),
    seconds: clampNumber(step.seconds, 10, 600, 60),
    strokes: sanitizeBackupText(step.strokes || "8회", 24),
    pressure: sanitizeBackupText(step.pressure || "낮게", 24),
    cue: sanitizeBackupText(step.cue || "부드럽게 진행", 160),
  };
}

function normalizeImportedCustomRoutines(customRoutines = {}) {
  if (!customRoutines || typeof customRoutines !== "object" || Array.isArray(customRoutines)) return {};
  return Object.entries(customRoutines).slice(0, 20).reduce((next, [id, routine]) => {
    if (["__proto__", "constructor", "prototype"].includes(id)) return next;
    if (!routine || typeof routine !== "object") return next;
    const steps = Array.isArray(routine.steps)
      ? routine.steps.slice(0, 12).map(normalizeImportedStep).filter(Boolean)
      : [];
    if (!steps.length) return next;
    const safeId = sanitizeBackupText(id, 80) || `custom-${Date.now()}`;
    next[safeId] = {
      title: sanitizeBackupText(routine.title || "내 루틴", 80),
      minutes: clampNumber(routine.minutes, 1, 30, Math.max(1, Math.round(steps.reduce((sum, step) => sum + step.seconds, 0) / 60))),
      custom: true,
      focus: customTemplates[routine.focus] ? routine.focus : "balanced",
      steps,
    };
    return next;
  }, {});
}

function normalizeImportedLog(log, backupCatalog) {
  if (!log || typeof log !== "object" || Array.isArray(log)) return null;
  const rawDate = new Date(log.date || Date.now());
  const date = Number.isNaN(rawDate.getTime()) ? new Date().toISOString() : rawDate.toISOString();
  const routine = backupCatalog[log.routine] ? log.routine : "morning";
  const photos = normalizeImportedPhotos(log.photos);
  const safetyChecks = Array.isArray(log.safetyChecks)
    ? log.safetyChecks.filter((key) => safetyCheckLabels[key]).slice(0, safetyCheckOptions.length)
    : [];
  const faceGuide = normalizeSmallBackupObject(log.faceGuide);
  const normalized = {
    id: sanitizeBackupText(log.id, 80) || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    date,
    routine,
    reaction: ["calm", "warm", "red", "sensitive"].includes(log.reaction) ? log.reaction : "calm",
    before: clampNumber(log.before, 0, 10, 0),
    after: clampNumber(log.after, 0, 10, 0),
    note: sanitizeBackupText(log.note, 800),
    duration: clampNumber(log.duration, 0, 4 * 60 * 60, 0),
    ...(photos ? { photos } : {}),
    ...(safetyChecks.length ? { safetyChecks } : {}),
    ...(log.source === "face-guide" ? { source: "face-guide" } : {}),
    ...(faceGuide ? { faceGuide } : {}),
  };
  return normalized;
}

function writeBackupPayload(payload) {
  const text = JSON.stringify(payload, null, 2);
  const includesPhotos = payload.backupMode !== "light";
  const photoCount = includesPhotos ? getPhotoCount(payload.logs) : getPhotoCount(state.logs);
  $("#backupPayload").value = text;
  $("#backupSummaryValue").textContent = `${backupModeLabel(payload.backupMode)} · ${formatBytes(new Blob([text]).size)} · ${getBackupCodeLabel(payload)} · 사진 ${photoCount}장 ${includesPhotos ? "포함" : "제외"}`;
  renderStorageUsage();
  return text;
}

function getBackupAudit() {
  const fullPayload = createBackupPayload(true);
  const lightPayload = createBackupPayload(false);
  const fullText = JSON.stringify(fullPayload);
  const lightText = JSON.stringify(lightPayload);
  const fullBytes = new Blob([fullText]).size;
  const lightBytes = new Blob([lightText]).size;
  const savedBytes = Math.max(0, fullBytes - lightBytes);
  const savedPercent = fullBytes ? Math.round((savedBytes / fullBytes) * 100) : 0;
  return { fullBytes, lightBytes, savedBytes, savedPercent, fullCode: fullPayload.backupCode, lightCode: lightPayload.backupCode };
}

function getHandoffMemoText() {
  const audit = getBackupAudit();
  const report = getRhythmReport();
  const routine = getRoutineCatalog()[report.routine] || baseRoutines.morning;
  const weeklyLogs = getWeeklyLogs();
  const weeklyMinutes = Math.round(weeklyLogs.reduce((sum, log) => sum + Number(log.duration || 0), 0) / 60);
  return [
    "# 사괄 백업 메모",
    `생성: ${new Date().toLocaleString("ko-KR")}`,
    `앱 빌드: ${appBuild}`,
    "저장 방식: 기록과 사진은 이 브라우저에 저장되며, 백업 파일은 사용자가 직접 보관합니다.",
    "",
    "현재 앱 데이터",
    `- 전체 기록: ${state.logs.length}건`,
    `- 최근 7일: ${weeklyLogs.length}건 · ${weeklyMinutes}분`,
    `- 사진: ${getPhotoCount()}장 · ${getPhotoSessionCount()}건`,
    `- 사진 보관: ${getPhotoRetentionLabel()}`,
    `- 전체 백업: ${formatBytes(audit.fullBytes)}`,
    `- 사진 제외 백업: ${formatBytes(audit.lightBytes)} (${audit.savedPercent}% 절감) · 검증 ${audit.lightCode}`,
    "",
    "추천 상태",
    `- ${report.title}: ${routine.title} · ${pressureLabel(report.pressureMode)}`,
    `- ${report.meta}`,
    "",
    "다음 작업",
    "- 사진이 늘면 사진 제외 백업을 먼저 만들어 보관하기",
    "- 오래된 사진은 보관 정책으로 정리하기",
    "- 새 기기에서 이어 쓰기 전 백업 검증 코드를 확인하기",
  ].join("\n");
}

function refreshHandoffMemo() {
  const memo = getHandoffMemoText();
  $("#handoffMemoPayload").value = memo;
  $("#handoffSummaryValue").textContent = `백업 메모 준비 완료 · ${formatBytes(new Blob([memo]).size)}`;
  $("#handoffStatusValue").textContent = getPhotoCount() ? "사진 주의" : "가벼움";
  return memo;
}

async function copyHandoffMemo() {
  const text = refreshHandoffMemo();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      showToast("백업 메모를 복사했습니다.");
      return;
    }
  } catch {
    // Clipboard permissions vary by browser; fall back to selecting the textarea.
  }
  $("#handoffMemoPayload").focus();
  $("#handoffMemoPayload").select();
  showToast("백업 메모를 선택했습니다.");
}

function exportData() {
  writeBackupPayload(createBackupPayload(true));
}

function exportLightData() {
  writeBackupPayload(createBackupPayload(false));
}

function makeLightBackupFromStorage() {
  writeBackupPayload(createBackupPayload(false));
  $("#backupPayload").focus();
  $("#backupPayload").select();
  showToast("사진 제외 백업을 만들었습니다.");
}

function ensureBackupText() {
  const text = $("#backupPayload").value.trim();
  if (text.startsWith("{") && text.endsWith("}")) return text;
  return writeBackupPayload(createBackupPayload(false));
}

async function copyBackupPayload() {
  const text = ensureBackupText();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      $("#backupSummaryValue").textContent = `백업 데이터 복사 완료 · ${formatBytes(new Blob([text]).size)}`;
      showToast("백업 데이터를 복사했습니다.");
      return;
    }
  } catch {
    // Clipboard permissions vary by browser; fall back to selecting the textarea.
  }
  $("#backupPayload").focus();
  $("#backupPayload").select();
  $("#backupSummaryValue").textContent = "백업 데이터를 선택했습니다. 원하는 위치에 보관할 수 있습니다.";
  showToast("백업 데이터를 선택했습니다.");
}

function downloadBackupPayload() {
  const text = ensureBackupText();
  let mode = "light";
  try {
    mode = JSON.parse(text).backupMode === "full" ? "full" : "light";
  } catch {
    mode = "light";
  }
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `gwalsa-backup-${mode}-${getDateKey(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  $("#backupSummaryValue").textContent = `${backupModeLabel(mode)} 파일 저장 준비 · ${formatBytes(blob.size)}`;
  showToast("백업 파일을 만들었습니다.");
}

function parseBackupPayloadText() {
  const text = $("#backupPayload").value.trim();
  if (!text) {
    throw new Error("Empty backup payload");
  }
  const bytes = new Blob([text]).size;
  if (bytes > BACKUP_MAX_BYTES) {
    throw new Error("Backup payload too large");
  }
  const payload = JSON.parse(text);
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid backup payload");
  }
  if (!Array.isArray(payload.logs)) {
    throw new Error("Invalid backup logs");
  }
  if (payload.logs.length > BACKUP_MAX_LOGS) {
    throw new Error("Too many backup logs");
  }
  const code = getBackupCodeStatus(payload);
  const settings = { ...state.settings, ...(payload.settings || {}) };
  settings.weeklyGoal = normalizeWeeklyGoal(settings.weeklyGoal);
  settings.photoRetention = normalizePhotoRetention(settings.photoRetention);
  settings.profile = normalizeProfile(settings.profile);
  settings.safetyChecks = normalizeSafetyChecks(settings.safetyChecks);
  const customRoutines = normalizeImportedCustomRoutines(payload.customRoutines || {});
  const backupCatalog = { ...baseRoutines, ...customRoutines, ...state.customRoutines };
  const logs = payload.logs
    .map((log) => normalizeImportedLog(log, backupCatalog))
    .filter(Boolean)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  return {
    ...payload,
    customRoutines,
    logs,
    settings,
    backupCode: code.code,
    backupCodeStatus: code.status,
    logFilter: ["all", "photos", "red", "sensitive"].includes(payload.logFilter) ? payload.logFilter : "all",
    selectedRoutine: backupCatalog[payload.selectedRoutine] ? payload.selectedRoutine : "morning",
    backupMode: payload.backupMode === "light" ? "light" : "full",
  };
}

function getLogMergeKey(log) {
  if (log.id) return `id:${log.id}`;
  return [
    "signature",
    log.date || "",
    log.routine || "",
    log.duration || "",
    log.reaction || "",
    log.note || "",
  ].join("|");
}

function getMergedLog(existingLog, incomingLog) {
  const merged = { ...incomingLog, ...existingLog };
  if (!existingLog.note && incomingLog.note) merged.note = incomingLog.note;
  if (!existingLog.safetyChecks && incomingLog.safetyChecks) merged.safetyChecks = incomingLog.safetyChecks;
  if (incomingLog.photos) {
    merged.photos = { ...(incomingLog.photos || {}), ...(existingLog.photos || {}) };
  }
  if (merged.photos && !merged.photos.before && !merged.photos.after) {
    const { photos, ...rest } = merged;
    return rest;
  }
  return merged;
}

function getBackupMergePreview(logs) {
  const existingKeys = new Set(state.logs.map(getLogMergeKey));
  return logs.reduce((preview, log) => {
    const key = getLogMergeKey(log);
    if (existingKeys.has(key)) {
      preview.duplicates += 1;
    } else {
      preview.newLogs += 1;
      existingKeys.add(key);
    }
    return preview;
  }, { newLogs: 0, duplicates: 0 });
}

function mergeBackupLogs(incomingLogs) {
  const indexByKey = new Map();
  const mergedLogs = state.logs.map((log, index) => {
    indexByKey.set(getLogMergeKey(log), index);
    return log;
  });
  let added = 0;
  let updated = 0;
  incomingLogs.forEach((incomingLog) => {
    const key = getLogMergeKey(incomingLog);
    const existingIndex = indexByKey.get(key);
    if (existingIndex === undefined) {
      indexByKey.set(key, mergedLogs.length);
      mergedLogs.push(incomingLog);
      added += 1;
      return;
    }
    const nextLog = getMergedLog(mergedLogs[existingIndex], incomingLog);
    if (JSON.stringify(nextLog) !== JSON.stringify(mergedLogs[existingIndex])) {
      mergedLogs[existingIndex] = nextLog;
      updated += 1;
    }
  });
  mergedLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { logs: mergedLogs, added, updated };
}

function getRetentionPreview(logs, retention) {
  if (retention === "all") return 0;
  const limit = Number(retention);
  let keptSessions = 0;
  return logs.reduce((removed, log) => {
    if (!log.photos?.before && !log.photos?.after) return removed;
    if (keptSessions < limit) {
      keptSessions += 1;
      return removed;
    }
    return removed + (log.photos.before ? 1 : 0) + (log.photos.after ? 1 : 0);
  }, 0);
}

function previewBackupPayload() {
  try {
    const payload = parseBackupPayloadText();
    const size = new Blob([$("#backupPayload").value]).size;
    const photos = getPhotoCount(payload.logs);
    const removedPhotos = getRetentionPreview(payload.logs, payload.settings.photoRetention);
    const mergePreview = getBackupMergePreview(payload.logs);
    $("#backupSummaryValue").textContent = `${backupModeLabel(payload.backupMode)} 미리보기 · ${getBackupCodeLabel(payload)} · 기록 ${payload.logs.length}건 · 병합 새 기록 ${mergePreview.newLogs}건 · 사진 ${photos}장 · ${formatBytes(size)}${removedPhotos ? ` · 가져오면 사진 ${removedPhotos}장 정리` : ""}`;
    showToast("백업 미리보기를 확인했습니다.");
  } catch {
    $("#backupSummaryValue").textContent = "백업 데이터 형식이나 검증 코드가 맞지 않습니다.";
    showToast("백업 데이터 형식이나 검증 코드가 맞지 않습니다.");
  }
}

function mergeBackupPayload() {
  try {
    const payload = parseBackupPayloadText();
    undoPayload = createStateUndoPayload("병합");
    state.customRoutines = { ...payload.customRoutines, ...state.customRoutines };
    const mergeResult = mergeBackupLogs(payload.logs);
    state.logs = mergeResult.logs;
    const removedPhotos = enforcePhotoRetentionPolicy();
    saveState();
    render();
    const changed = mergeResult.added || mergeResult.updated || removedPhotos;
    $("#backupSummaryValue").textContent = changed
      ? `${backupModeLabel(payload.backupMode)} 병합 완료 · 새 기록 ${mergeResult.added}건${mergeResult.updated ? ` · 보강 ${mergeResult.updated}건` : ""}${removedPhotos ? ` · 사진 ${removedPhotos}장 정리` : ""} · 되돌리기 가능`
      : `${backupModeLabel(payload.backupMode)} 병합 완료 · 겹치는 기록만 있습니다. · 되돌리기 가능`;
    showToast("백업 데이터를 병합했습니다.");
  } catch {
    $("#backupPayload").value = "백업 데이터 형식이 맞지 않습니다.";
    $("#backupSummaryValue").textContent = "백업 데이터 형식이나 검증 코드가 맞지 않습니다.";
    showToast("백업 데이터 형식이나 검증 코드가 맞지 않습니다.");
  }
}

function importData() {
  try {
    const payload = parseBackupPayloadText();
    undoPayload = createStateUndoPayload("가져오기");
    state.customRoutines = payload.customRoutines;
    state.logs = payload.logs;
    state.settings = payload.settings;
    state.settings.profile = normalizeProfile(state.settings.profile);
    state.settings.weeklyGoal = normalizeWeeklyGoal(state.settings.weeklyGoal);
    state.settings.photoRetention = normalizePhotoRetention(state.settings.photoRetention);
    state.settings.safetyChecks = normalizeSafetyChecks(state.settings.safetyChecks);
    ensureSafetyDate();
    state.logFilter = payload.logFilter;
    state.selectedRoutine = payload.selectedRoutine;
    prepareRoutine(state.selectedRoutine);
    const removedPhotos = enforcePhotoRetentionPolicy();
    saveState();
    render();
    $("#backupSummaryValue").textContent = `${backupModeLabel(payload.backupMode)} 가져오기 완료 · 기록 ${state.logs.length}건${removedPhotos ? ` · 사진 ${removedPhotos}장 정리` : ""} · 되돌리기 가능`;
  } catch {
    $("#backupPayload").value = "백업 데이터 형식이 맞지 않습니다.";
    $("#backupSummaryValue").textContent = "백업 데이터 형식이나 검증 코드가 맞지 않습니다.";
  }
}

function resetToday() {
  prepareRoutine(state.selectedRoutine);
  saveState();
  render();
}

function setFocus(zone) {
  $$(".zone-pill").forEach((pill) => pill.classList.toggle("active", pill.dataset.focus === zone));
  $$(".zone").forEach((shape) => {
    shape.classList.toggle("highlight", zone === "all" || shape.dataset.zone === zone);
  });
}

function updateSettings() {
  const profile = normalizeProfile(state.settings.profile);
  state.settings.pressureMode = $("#pressureMode").value;
  state.settings.oilType = $("#oilType").value;
  state.settings.reminderTime = $("#reminderTime").value;
  state.settings.weeklyGoal = normalizeWeeklyGoal($("#weeklyGoal").value);
  state.settings.skipSensitiveAreas = $("#skipSensitiveAreas").checked;
  state.settings.profile = {
    skinType: $("#skinType").value,
    mainConcern: $("#mainConcern").value,
    experience: $("#experienceLevel").value,
    avoidZones: avoidZoneOptions.filter((zone) => $(`#avoidZone-${zone}`).checked),
  };
  state.settings.profile = normalizeProfile({ ...profile, ...state.settings.profile });
  saveState();
  startReminderLoop();
  renderConditionGuide();
  renderReminderSettings();
  renderWeeklyGoal();
  renderProfileSettings();
}

function updatePhotoRetentionSetting() {
  state.settings.photoRetention = normalizePhotoRetention($("#photoRetention").value);
  applyPhotoRetentionPolicy();
}

function updateSafetyChecks() {
  ensureSafetyDate();
  state.settings.safetyChecks = safetyCheckOptions.reduce((checks, key) => {
    checks[key] = $(`#safetyCheck-${key}`).checked;
    return checks;
  }, {});
  saveState();
  renderSafetyCheck();
  renderConditionGuide();
}

function clearSafetyChecks() {
  ensureSafetyDate();
  state.settings.safetyChecks = { ...safetyCheckDefaults };
  saveState();
  renderSafetyCheck();
  renderConditionGuide();
  showToast("시작 전 체크를 해제했습니다.");
}

function renderTimer() {
  const activeRoutine = getActiveRoutine();
  const currentStep = getCurrentStep();
  const clock = formatClock(state.remaining);
  const initialRemaining = activeRoutine?.steps?.[0]?.seconds || 0;
  const sessionActive = Boolean(state.running || state.activeStep > 0 || (activeRoutine && state.remaining !== initialRemaining));
  $(".workbench")?.classList.toggle("session-active", sessionActive);
  $("#timerMinutes").textContent = clock.minutes;
  $("#timerSeconds").textContent = clock.seconds;
  $("#activeRoutineLabel").textContent = activeRoutine ? activeRoutine.title : "대기";
  $("#activeStepTitle").textContent = currentStep ? currentStep.title : "루틴을 선택하세요";
  $("#activeStepMeta").textContent = currentStep
    ? `${zoneNames[currentStep.zone]} · ${currentStep.strokes} · ${currentStep.pressure} · ${currentStep.cue} · 오늘은 부드럽게 진행하세요.`
    : "목, 턱선, 광대 루틴을 바로 시작할 수 있습니다. 오늘 컨디션에 맞춰 진행하세요.";
  $("#startPauseButton span").textContent = state.running ? "일시정지" : "시작";
}

function renderCompletionPanel() {
  const panel = $("#completionPanel");
  panel.hidden = !completionNotice;
  if (!completionNotice) return;
  $("#completionTitle").textContent = completionNotice.title;
  $("#completionMeta").textContent = completionNotice.meta;
}

function closeCompletionPanel() {
  completionNotice = null;
  renderCompletionPanel();
}

function viewCompletionLog() {
  completionNotice = null;
  setScreen("log");
  renderCompletionPanel();
}

function renderMetrics() {
  $("#todayLabel").textContent = formatDate(new Date());
  $("#streakValue").textContent = `${getStreak()}일`;
  $("#totalValue").textContent = `${getTotalSessions()}회`;
  $("#lastSessionValue").textContent = getLastSessionLabel();
}

function renderWeeklyGoal() {
  const goal = normalizeWeeklyGoal(state.settings.weeklyGoal);
  const weeklyLogs = getWeeklyLogs();
  const completed = Math.min(goal, weeklyLogs.length);
  const percent = goal ? Math.min(100, Math.round((weeklyLogs.length / goal) * 100)) : 0;
  const remaining = Math.max(0, goal - weeklyLogs.length);
  const weeklyMinutes = Math.round(weeklyLogs.reduce((sum, log) => sum + Number(log.duration || 0), 0) / 60);
  $("#weeklyGoalTitle").textContent = remaining ? `${remaining}회 남음` : "목표 달성";
  $("#weeklyGoalValue").textContent = `${weeklyLogs.length}/${goal}`;
  $("#weeklyGoalBar").style.width = `${percent}%`;
  $("#weeklyGoalMeta").textContent = remaining
    ? `최근 7일 ${weeklyMinutes}분 진행. 오늘 루틴을 마치면 목표에 더 가까워집니다.`
    : `최근 7일 ${weeklyMinutes}분 진행. 피부 반응을 보며 휴식일을 섞어주세요.`;
  $("#weeklyGoalDays").innerHTML = getRecentWeekDays().map((day) => {
    const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(day.date);
    return `
      <div class="goal-day ${day.done ? "done" : ""} ${day.today ? "today" : ""}">
        <span>${weekday}</span>
      </div>
    `;
  }).join("");
}

function renderConditionGuide() {
  const guide = getConditionGuide();
  const routine = getRoutineCatalog()[guide.routine] || baseRoutines.morning;
  const badge = $("#conditionBadge");
  $("#conditionTitle").textContent = guide.title;
  $("#conditionMeta").textContent = `${routine.title} · ${pressureLabel(guide.pressureMode)} · ${guide.meta}`;
  badge.textContent = guide.badge;
  badge.dataset.level = guide.level;
  $("#todayConditionSummary").textContent = guide.badge;
  $("#conditionGuideList").innerHTML = guide.tips.map((tip) => `
    <div class="condition-tip">
      <span></span>
      <p>${escapeHtml(tip)}</p>
    </div>
  `).join("");
}

function renderSafetyCheck() {
  ensureSafetyDate();
  const summary = getSafetySummary();
  const activeIds = getActiveSafetyCheckIds();
  const badge = $("#safetyStatusValue");
  safetyCheckOptions.forEach((key) => {
    $(`#safetyCheck-${key}`).checked = state.settings.safetyChecks[key];
  });
  badge.textContent = summary.badge;
  badge.dataset.level = summary.level;
  $("#safetyMetaValue").textContent = summary.meta;
  $("#clearSafetyCheckButton").disabled = activeIds.length === 0;
}

function renderPlan() {
  const plan = getPlanForDate();
  const cycle = getCurrentCyclePlans();
  const doneCount = cycle.filter((item) => item.done).length;
  const routine = getRoutineCatalog()[plan.routine] || baseRoutines.morning;
  $("#planTitle").textContent = `${plan.dayNumber}일차 · ${plan.title}`;
  $("#planStatus").textContent = plan.done ? "완료" : `${doneCount}/${cycle.length}`;
  $("#planStatus").classList.toggle("done", plan.done);
  $("#planMeta").textContent = `${routine.title} ${routine.minutes}분 · ${plan.focus} · ${plan.cue}`;
  $("#weekPlanList").innerHTML = cycle.map((item) => `
    <button class="plan-day ${item.today ? "today" : ""} ${item.done ? "done" : ""}" type="button" data-routine="${item.routine}">
      <span>${item.dayNumber}일</span>
      <strong>${escapeHtml(item.title)}</strong>
    </button>
  `).join("");
}

function renderTodayHero() {
  const plan = getPlanForDate();
  const guide = getConditionGuide();
  const catalog = getRoutineCatalog();
  const activeRoutine = getActiveRoutine();
  const sessionActive = hasActiveSession(activeRoutine);
  const routine = sessionActive && activeRoutine ? activeRoutine : catalog[plan.routine] || baseRoutines.morning;
  const currentStep = getCurrentStep();
  $("#todayHeroPlanTitle").textContent = sessionActive
    ? `${routine.title} 진행 중`
    : `오늘 얼굴: ${getFaceConditionMood(guide)}`;
  $("#todayHeroMeta").textContent = sessionActive
    ? `${routine.title} ${routine.minutes}분 · ${currentStep ? currentStep.title : "진행 중"}`
    : `${plan.dayNumber}일차 ${plan.title} · ${routine.minutes}분. ${plan.cue}`;
  $("#todayHeroRoutineTitle").textContent = routine.title;
  $("#todayHeroMinutes").textContent = `${routine.minutes}분`;
  $("#todayHeroFocus").textContent = sessionActive ? getRoutineZoneSummary(routine) : plan.focus;
  $("#todayHeroRitualFocus").textContent = sessionActive ? getRoutineZoneSummary(routine) : plan.focus;
  $("#todayHeroRitualMeta").textContent = `${routine.steps.length}단계 · ${routine.minutes}분`;
  $("#todayRoutineStepsMeta").textContent = `${routine.steps.length}단계 · ${routine.minutes}분`;
  $("#startPlanRoutineButton span").textContent = sessionActive
    ? (state.running ? "진행 중 보기" : "루틴 이어가기")
    : "오늘 루틴 시작";
  $("#todayRoutinePreviewList").innerHTML = routine.steps.slice(0, 3).map((step, index) => `
    <article class="routine-preview-step">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <strong>${escapeHtml(step.title)}</strong>
        <small>${escapeHtml(zoneNames[step.zone])} · ${escapeHtml(step.pressure)}</small>
      </div>
    </article>
  `).join("");
}

function renderOnboardingPreview() {
  const routine = getSelectedRoutine();
  const title = $("#onboardingPreviewTitle");
  const meta = $("#onboardingPreviewMeta");
  if (!title || !meta || !routine) return;
  title.textContent = routine.title;
  meta.textContent = `${routine.minutes}분 · ${routine.steps.length}단계 · 낮은 압력`;
}

function renderRoutineCards() {
  $("#routineStrip").innerHTML = Object.entries(getRoutineCatalog()).map(([id, routine]) => `
    <article class="routine-card ${id === state.selectedRoutine ? "selected" : ""}" data-routine="${id}">
      <div>
        <span class="routine-time">${routine.minutes}분 · ${escapeHtml(getRoutineDifficulty(routine))}${routine.custom ? " · 내 루틴" : ""}</span>
        <h3>${escapeHtml(routine.title)}</h3>
        <p>${escapeHtml(getRoutineDescription(routine))}</p>
        <div class="routine-card-tags">
          <span>${escapeHtml(getRoutineTag(routine, id))}</span>
          <span>${escapeHtml(getRoutineSituation(routine))}</span>
        </div>
      </div>
      <div class="routine-card-actions">
        <button class="secondary-button select-routine" type="button" data-routine-action="select">고르기</button>
        <button class="primary-button start-routine-card" type="button" data-routine-action="start">시작</button>
      </div>
    </article>
  `).join("");
}

function renderSteps() {
  const routine = getSelectedRoutine();
  const pressureSummary = getRoutinePressureSummary(routine);
  $("#routineDetailTitle").textContent = routine.title;
  $("#routineDetailMeta").textContent = `${getRoutineTag(routine, state.selectedRoutine)} · ${getRoutineSituation(routine)} · ${getRoutineDescription(routine)}`;
  $("#routineDetailMinutes").textContent = `${routine.minutes}분`;
  $("#routineDetailSteps").textContent = `${routine.steps.length}단계`;
  $("#routineDetailPressure").textContent = `${getRoutineDifficulty(routine)} · ${pressureSummary}`;
  $("#routineFlowSummary").textContent = `${routine.steps.length}단계 · ${routine.minutes}분`;
  $("#routineFlowPreview").innerHTML = routine.steps.slice(0, 3).map((step, index) => `
    <article class="routine-flow-preview-step">
      <span>${String(index + 1).padStart(2, "0")}</span>
      <div>
        <strong>${escapeHtml(step.title)}</strong>
        <small>${escapeHtml(zoneNames[step.zone])} · ${formatClock(step.seconds).minutes}:${formatClock(step.seconds).seconds} · ${escapeHtml(step.pressure)}</small>
      </div>
    </article>
  `).join("");
  $("#stepList").innerHTML = routine.steps.map((step, index) => `
    <article class="step-item ${state.activeRoutine === state.selectedRoutine && state.activeStep === index ? "active" : ""}">
      <h3>${index + 1}. ${escapeHtml(step.title)}</h3>
      <div class="step-meta">
        <span>${escapeHtml(zoneNames[step.zone])}</span>
        <span>${formatClock(step.seconds).minutes}:${formatClock(step.seconds).seconds}</span>
        <span>${escapeHtml(step.strokes)}</span>
        <span>${escapeHtml(step.pressure)}</span>
      </div>
      <p>${escapeHtml(step.cue)}</p>
    </article>
  `).join("");
}

function getRoutineZoneSummary(routine) {
  const zones = [...new Set((routine.steps || []).map((step) => zoneNames[step.zone] || step.zone).filter(Boolean))];
  if (!zones.length) return routine.focus ? focusLabel(routine.focus) : "전체";
  return zones.length > 3 ? `${zones.slice(0, 3).join(" · ")} 외` : zones.join(" · ");
}

function getRoutinePressureSummary(routine) {
  const pressures = [...new Set((routine.steps || []).map((step) => step.pressure).filter(Boolean))];
  if (!pressures.length) return pressureLabel(state.settings.pressureMode);
  return pressures.length > 2 ? `${pressures[0]}-${pressures[pressures.length - 1]}` : pressures.join(" · ");
}

function renderZoneGuides() {
  const catalog = getRoutineCatalog();
  $("#zoneGuideList").innerHTML = zoneGuides.map((guide) => {
    const routine = catalog[guide.routine] || baseRoutines.morning;
    const active = state.selectedRoutine === guide.routine;
    return `
      <article class="guide-card ${active ? "active" : ""}" data-zone="${guide.zone}">
        <div class="guide-card-head">
          <span>${escapeHtml(zoneNames[guide.zone])}</span>
          <strong>${escapeHtml(guide.title)}</strong>
        </div>
        <p>${escapeHtml(guide.direction)}</p>
        <div class="guide-meta">
          <span>${escapeHtml(guide.goodFor)}</span>
          <span>${escapeHtml(guide.pressure)}</span>
          <span>${escapeHtml(routine.title)}</span>
        </div>
        <div class="guide-caution">피하기 · ${escapeHtml(guide.avoid)}</div>
        <button class="secondary-button compact zone-guide-action" type="button" data-zone="${guide.zone}">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
          <span>선택</span>
        </button>
      </article>
    `;
  }).join("");
}

function renderLogs() {
  const list = $("#logList");
  const catalog = getRoutineCatalog();
  const logs = getFilteredLogs();
  if (!state.logs.length) {
    list.innerHTML = `
      <div class="empty-state rich-empty">
        <strong>첫 기록을 기다리는 중</strong>
        <span>오늘 루틴을 마치면 반응과 사진 메모가 여기에 정리됩니다.</span>
      </div>
    `;
    return;
  }
  if (!logs.length) {
    list.innerHTML = `
      <div class="empty-state rich-empty">
        <strong>이 필터에는 기록이 없습니다</strong>
        <span>다른 필터를 선택하거나 새 기록을 남겨보세요.</span>
      </div>
    `;
    return;
  }
  list.innerHTML = logs.slice(0, 20).map((log) => {
    const routine = catalog[log.routine] || getSelectedRoutine();
    const delta = log.before - log.after;
    const note = log.note ? `<p>${escapeHtml(log.note)}</p>` : "";
    const sourceTag = log.source === "face-guide"
      ? `<span>${escapeHtml(log.faceGuide?.sourceLabel || "참고 가이드")}</span>`
      : "";
    const safety = renderLogSafety(log.safetyChecks);
    const photos = renderLogPhotos(log.photos);
    return `
      <article class="log-item">
        <div class="log-head">
          <h3>${escapeHtml(routine.title)}</h3>
          <button class="text-button delete-log" type="button" data-log="${escapeHtml(log.id)}">삭제</button>
        </div>
        <div class="log-meta">
          <span>${formatDate(new Date(log.date))}</span>
          <span>${Math.round(log.duration / 60)}분</span>
          <span>${reactionLabel(log.reaction)}</span>
          <span>변화 ${Math.max(0, delta)}</span>
          ${sourceTag}
        </div>
        ${note}
        ${safety}
        ${photos}
      </article>
    `;
  }).join("");
}

function renderUndoPanel() {
  const panel = $("#undoPanel");
  const hasUndo = Boolean(undoPayload && (undoPayload.type === "state" || undoPayload.logs?.length));
  $("#restoreBackupChangeButton").disabled = !hasUndo;
  panel.hidden = !hasUndo;
  if (!hasUndo) return;
  if (undoPayload.type === "state") {
    $("#undoMetaValue").textContent = `최근 ${undoPayload.action || "변경"} · 이전 상태`;
    $("#undoTitleValue").textContent = `${undoPayload.action || "변경"} 전 앱 상태로 되돌릴 수 있습니다.`;
    return;
  }
  const count = undoPayload.logs.length;
  const firstLog = undoPayload.logs[0];
  const catalog = getRoutineCatalog();
  const routine = catalog[firstLog.routine] || baseRoutines.morning;
  $("#undoMetaValue").textContent = undoPayload.type === "all"
    ? `최근 삭제 · ${count}건`
    : "최근 삭제 · 1건";
  $("#undoTitleValue").textContent = undoPayload.type === "all"
    ? "전체 기록을 복원할 수 있습니다."
    : `${routine.title} 기록을 복원할 수 있습니다.`;
}

function renderLogSafety(checks) {
  if (!Array.isArray(checks) || !checks.length) return "";
  const labels = checks
    .filter((key) => safetyCheckLabels[key])
    .map((key) => safetyCheckLabels[key]);
  if (!labels.length) return "";
  return `<div class="log-safety">시작 체크 · ${escapeHtml(labels.join(", "))}</div>`;
}

function getFilteredLogs() {
  if (state.logFilter === "all") return state.logs;
  return state.logs.filter((log) => {
    if (state.logFilter === "photos") return Boolean(log.photos?.before || log.photos?.after);
    return log.reaction === state.logFilter;
  });
}

function setLogFilter(filter) {
  state.logFilter = ["all", "photos", "red", "sensitive"].includes(filter) ? filter : "all";
  saveState();
  render();
}

function renderInsights() {
  const weeklyLogs = getWeeklyLogs();
  const weeklyMinutes = Math.round(weeklyLogs.reduce((sum, log) => sum + log.duration, 0) / 60);
  const reliefValues = state.logs.map((log) => Math.max(0, Number(log.before) - Number(log.after)));
  const averageRelief = reliefValues.length
    ? (reliefValues.reduce((sum, value) => sum + value, 0) / reliefValues.length).toFixed(1)
    : "0";
  const photoSessions = state.logs.filter((log) => Boolean(log.photos?.before || log.photos?.after)).length;
  $("#weeklySessionsValue").textContent = `${weeklyLogs.length}회`;
  $("#weeklyMinutesValue").textContent = `${weeklyMinutes}분`;
  $("#averageReliefValue").textContent = averageRelief;
  $("#photoSessionsValue").textContent = `${photoSessions}건`;
  $("#logHeroMeta").textContent = state.logs.length
    ? `최근 7일 ${weeklyLogs.length}회 · ${weeklyMinutes}분 케어했습니다. 피부 반응은 필터로 가볍게 확인하세요.`
    : "첫 루틴을 마치면 반응, 느낌, 사진 메모가 여기에 정리됩니다.";
  $$(".filter-chip").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === state.logFilter);
  });
}

function renderHistoryCalendar() {
  const grouped = getLogsByDate();
  const today = parseDateKey(getDateKey(new Date()));
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = addDays(today, index - 13);
    const dateKey = getDateKey(date);
    const logs = grouped[dateKey] || [];
    const summary = logs.length ? getDailySummary(logs) : null;
    return { date, dateKey, summary, today: index === 13 };
  });
  const doneCount = days.filter((day) => day.summary).length;
  const sensitiveCount = days.filter((day) => ["red", "sensitive"].includes(day.summary?.reaction)).length;
  $("#historySummaryValue").textContent = `${doneCount}/14 · 예민 ${sensitiveCount}`;
  $("#historyCalendarList").innerHTML = days.map((day) => {
    const label = `${day.date.getMonth() + 1}.${day.date.getDate()}`;
    const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(day.date);
    const summary = day.summary;
    const reaction = summary ? reactionShortLabel(summary.reaction) : "-";
    const minutes = summary ? `${summary.minutes}분` : "휴식";
    return `
      <div class="history-day ${day.today ? "today" : ""} ${summary ? "done" : ""}" data-reaction="${summary?.reaction || "none"}">
        <span>${weekday}</span>
        <strong>${label}</strong>
        <small>${minutes}</small>
        <em>${reaction}</em>
      </div>
    `;
  }).join("");
}

function renderRhythmReport() {
  const report = getRhythmReport();
  const routine = getRoutineCatalog()[report.routine] || baseRoutines.morning;
  $("#rhythmReportTitle").textContent = report.title;
  $("#rhythmReportMeta").textContent = `${routine.title} · ${pressureLabel(report.pressureMode)} · ${report.meta}`;
  $("#rhythmReportStats").innerHTML = report.stats.map((item) => `
    <div class="rhythm-stat">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
    </div>
  `).join("");
  $("#rhythmReportPayload").value = getRhythmReportText(report);
}

function renderPhotoCompare() {
  const list = $("#photoCompareList");
  const catalog = getRoutineCatalog();
  const photoLogs = state.logs.filter((log) => Boolean(log.photos?.before || log.photos?.after)).slice(0, 6);
  if (!photoLogs.length) {
    list.innerHTML = `<div class="empty-state">사진 기록이 없습니다.</div>`;
    return;
  }
  list.innerHTML = photoLogs.map((log) => {
    const routine = catalog[log.routine] || getSelectedRoutine();
    const before = renderComparePhoto(log.photos?.before, "전");
    const after = renderComparePhoto(log.photos?.after, "후");
    return `
      <article class="compare-card">
        <div class="compare-head">
          <strong>${escapeHtml(routine.title)}</strong>
          <span>${formatDate(new Date(log.date))}</span>
        </div>
        <div class="compare-photos">${before}${after}</div>
      </article>
    `;
  }).join("");
}

function renderComparePhoto(photo, label) {
  const src = getSafePhotoSrc(photo);
  if (!src) {
    return `
      <div class="compare-photo">
        <span>${label}</span>
        <div class="compare-placeholder">없음</div>
      </div>
    `;
  }
  return `
    <div class="compare-photo">
      <span>${label}</span>
      <img src="${escapeHtml(src)}" alt="${label} 사진 비교" />
    </div>
  `;
}

function renderLogPhotos(photos) {
  if (!photos) return "";
  const beforeSrc = getSafePhotoSrc(photos.before);
  const afterSrc = getSafePhotoSrc(photos.after);
  const before = beforeSrc
    ? `<div class="photo-thumb"><span>전</span><img src="${escapeHtml(beforeSrc)}" alt="전 사진" /></div>`
    : "";
  const after = afterSrc
    ? `<div class="photo-thumb"><span>후</span><img src="${escapeHtml(afterSrc)}" alt="후 사진" /></div>`
    : "";
  if (!before && !after) return "";
  return `<div class="photo-pair">${before}${after}</div>`;
}

function renderCustomRoutines() {
  const entries = Object.entries(state.customRoutines);
  const list = $("#customRoutineList");
  if (!entries.length) {
    list.innerHTML = `<div class="empty-state">내 루틴이 없습니다.</div>`;
    return;
  }
  list.innerHTML = entries.map(([id, routine]) => `
    <div class="custom-row">
      <div>
        <strong>${escapeHtml(routine.title)}</strong>
        <span>${routine.minutes}분 · ${escapeHtml(focusLabel(routine.focus))}</span>
      </div>
      <button class="text-button delete-custom" type="button" data-routine="${id}">삭제</button>
    </div>
  `).join("");
}

function reactionLabel(value) {
  return {
    calm: "차분함",
    warm: "따뜻함",
    red: "붉음",
    sensitive: "예민함",
  }[value] || "차분함";
}

function reactionShortLabel(value) {
  return {
    calm: "차분",
    warm: "온기",
    red: "붉음",
    sensitive: "예민",
  }[value] || "-";
}

function pressureLabel(value) {
  return {
    soft: "낮은 압력",
    medium: "보통 압력",
    firm: "단단한 압력",
  }[value] || "낮은 압력";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSafePhotoSrc(photo) {
  const src = String(photo?.dataUrl || "");
  return /^data:image\/(?:jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(src) ? src : "";
}

function renderSettings() {
  $("#pressureMode").value = state.settings.pressureMode;
  $("#oilType").value = state.settings.oilType;
  $("#reminderTime").value = state.settings.reminderTime;
  $("#weeklyGoal").value = String(normalizeWeeklyGoal(state.settings.weeklyGoal));
  $("#photoRetention").value = normalizePhotoRetention(state.settings.photoRetention);
  $("#skipSensitiveAreas").checked = state.settings.skipSensitiveAreas;
  renderProfileSettings();
  renderReminderSettings();
  renderSettingsOverview();
}

function renderProfileSettings() {
  const profile = normalizeProfile(state.settings.profile);
  state.settings.profile = profile;
  $("#skinType").value = profile.skinType;
  $("#mainConcern").value = profile.mainConcern;
  $("#experienceLevel").value = profile.experience;
  avoidZoneOptions.forEach((zone) => {
    $(`#avoidZone-${zone}`).checked = profile.avoidZones.includes(zone);
  });
  $("#profileSummaryValue").textContent = getProfileSummary();
  $("#profileEditBadge").textContent = concernLabels[profile.mainConcern] || "편집";
}

function renderReminderSettings() {
  const permission = getReminderPermission();
  const enabled = state.settings.reminderEnabled && permission === "granted";
  const status = $("#reminderStatusValue");
  const detail = $("#reminderDetailValue");
  status.textContent = getReminderStatusLabel(permission, enabled);
  status.classList.toggle("active", enabled);
  $("#enableReminderButton").textContent =
    permission === "granted" ? "알림 켜짐" : permission === "denied" ? "알림 재요청" : "알림 켜기";
  $("#enableReminderButton").disabled = permission === "unsupported";
  $("#testReminderButton").disabled = !enabled;
  detail.textContent = enabled
    ? `${state.settings.reminderTime} · 기록 없는 날만`
    : getReminderDetailLabel(permission);
  $("#routineSettingsBadge").textContent = `${pressureLabel(state.settings.pressureMode)} · ${normalizeWeeklyGoal(state.settings.weeklyGoal)}회`;
}

function renderSettingsOverview() {
  const profile = normalizeProfile(state.settings.profile);
  const permission = getReminderPermission();
  const reminderEnabled = state.settings.reminderEnabled && permission === "granted";
  const reminderLabel = getReminderStatusLabel(permission, reminderEnabled);
  $("#settingsOverviewSkin").textContent = skinTypeLabels[profile.skinType] || "보통";
  $("#settingsOverviewConcern").textContent = concernLabels[profile.mainConcern] || "아침 컨디션";
  $("#settingsOverviewPressure").textContent = pressureLabel(state.settings.pressureMode).replace(" 압력", "");
  $("#settingsOverviewReminder").textContent = reminderLabel;
  $("#settingsOverviewMeta").textContent = `사괄 설정 · ${getProfileSummary()} · ${pressureLabel(state.settings.pressureMode)} · 알림 ${reminderLabel}`;
}

function getReminderStatusLabel(permission, enabled) {
  if (enabled) return "켜짐";
  if (permission === "denied") return "거부됨";
  if (permission === "unsupported") return "미지원";
  return "꺼짐";
}

function getReminderDetailLabel(permission) {
  if (permission === "denied") return "브라우저 설정에서 권한을 바꿀 수 있습니다.";
  if (permission === "unsupported") return "현재 브라우저에서는 사용할 수 없습니다.";
  return "브라우저 알림을 켤 수 있습니다.";
}

function renderPhotoDraft() {
  renderPhotoPreview("before", "#beforePhotoPreview");
  renderPhotoPreview("after", "#afterPhotoPreview");
}

function renderPhotoPreview(kind, selector) {
  const target = $(selector);
  const photo = state.photoDraft[kind];
  if (!photo) {
    target.textContent = "없음";
    return;
  }
  const src = getSafePhotoSrc(photo);
  if (!src) {
    target.textContent = "표시 불가";
    return;
  }
  target.innerHTML = `<img src="${escapeHtml(src)}" alt="${kind === "before" ? "전" : "후"} 사진 미리보기" />`;
}

function renderSliders() {
  $("#beforeValue").textContent = $("#tensionBefore").value;
  $("#afterValue").textContent = $("#tensionAfter").value;
}

function renderStorageUsage() {
  const exported = {
    selectedRoutine: state.selectedRoutine,
    logFilter: state.logFilter,
    customRoutines: state.customRoutines,
    logs: state.logs,
    settings: state.settings,
  };
  const bytes = new Blob([JSON.stringify(exported)]).size;
  const photos = getPhotoCount();
  const photoSessions = getPhotoSessionCount();
  const retention = normalizePhotoRetention(state.settings.photoRetention);
  state.settings.photoRetention = retention;
  $("#storageUsageValue").textContent = formatBytes(bytes);
  $("#photoCountValue").textContent = `사진 ${photos}장 · ${photoSessions}건`;
  $("#storageDetailValue").textContent = photos
    ? "사진만 삭제하거나 보관 정책으로 오래된 사진만 정리할 수 있습니다."
    : "사진 데이터 없이 가볍게 유지 중입니다.";
  $("#photoRetention").value = retention;
  $("#photoRetentionValue").textContent = retention === "all"
    ? "사진 기록을 제한 없이 보관합니다. 용량이 커지면 최근 보관 수를 줄이세요."
    : `${getPhotoRetentionLabel(retention)} 사진 기록만 유지합니다. 기록과 메모는 삭제하지 않습니다.`;
  renderBackupAudit(getBackupAudit(), photos);
  refreshHandoffMemo();
  $("#clearPhotosButton").disabled = photos === 0;
  $("#applyPhotoRetentionButton").disabled = photos === 0 || retention === "all";
}

function renderBackupAudit(audit, photoCount) {
  $("#fullBackupSizeValue").textContent = formatBytes(audit.fullBytes);
  $("#lightBackupSizeValue").textContent = formatBytes(audit.lightBytes);
  $("#backupSavingsValue").textContent = audit.savedPercent ? `${audit.savedPercent}%` : "0%";
  $("#backupAdviceValue").textContent = photoCount
    ? `사진 제외 백업은 ${formatBytes(audit.savedBytes)}를 줄입니다. 가벼운 백업을 자주 보관하세요. 검증 ${audit.lightCode}`
    : `현재 백업은 이미 가볍습니다. 기록 위주 백업이면 충분합니다. 검증 ${audit.lightCode}`;
  $("#makeLightBackupButton").disabled = false;
}

function getDraftChecklistItems() {
  const audit = getBackupAudit();
  const photos = getPhotoCount();
  return [
    { label: "루틴", value: "완료", detail: `${Object.keys(baseRoutines).length}개 기본 · 커스텀 가능` },
    { label: "안전", value: "완료", detail: "시작 전 체크 · 예민 부위 제외" },
    { label: "기록", value: "완료", detail: "세션 · 리포트 · 전후 사진" },
    { label: "저장", value: "가벼움", detail: photos ? `사진 ${photos}장 관리 중` : "사진 데이터 없음" },
    { label: "백업", value: "검증", detail: `${formatBytes(audit.lightBytes)} · ${audit.lightCode}` },
    { label: "정책", value: "표시", detail: "안내 범위 · 개인정보 · 초기화" },
  ];
}

function renderDraftStatus() {
  const items = getDraftChecklistItems();
  const allReady = items.every((item) => item.value);
  $("#draftStatusTitle").textContent = allReady ? "버전 및 준비 상태" : "상태 점검";
  $("#draftStatusBadge").textContent = appBuild;
  $("#draftStatusMeta").textContent = updateAvailable
    ? `빌드 ${appBuild} · 새 캐시 적용 대기`
    : `사괄 빌드 ${appBuild} · 루틴, 기록, 백업, 정책 화면 준비 완료`;
  $("#draftChecklist").innerHTML = items.map((item) => `
    <article class="release-item">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value)}</strong>
      <small>${escapeHtml(item.detail)}</small>
    </article>
  `).join("");
}

function renderPolicyPanel() {
  $("#appVersionValue").textContent = `빌드 ${appBuild}`;
  const privacyButton = $("#openPrivacyPolicyButton");
  const termsButton = $("#openTermsButton");
  const supportButton = $("#openSupportButton");
  if (privacyButton) {
    privacyButton.disabled = !PUBLIC_POLICY_URL;
    privacyButton.title = PUBLIC_POLICY_URL || "정책 URL 미설정";
  }
  if (termsButton) {
    termsButton.disabled = !PUBLIC_TERMS_URL;
    termsButton.title = PUBLIC_TERMS_URL || "약관 URL 미설정";
  }
  if (supportButton) {
    supportButton.disabled = !PUBLIC_SUPPORT_URL;
    supportButton.title = PUBLIC_SUPPORT_URL || "지원 URL 미설정";
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function render() {
  renderMetrics();
  renderWeeklyGoal();
  renderConditionGuide();
  renderSafetyCheck();
  renderPlan();
  renderTodayHero();
  renderOnboardingPreview();
  renderTimer();
  renderCompletionPanel();
  renderRoutineCards();
  renderSteps();
  renderZoneGuides();
  renderInsights();
  renderHistoryCalendar();
  renderRhythmReport();
  renderLogs();
  renderUndoPanel();
  renderPhotoCompare();
  renderCustomRoutines();
  renderSettings();
  renderPhotoDraft();
  renderSliders();
  renderDraftStatus();
  renderPolicyPanel();
  renderStorageUsage();
  const step = getCurrentStep();
  setFocus(step ? step.zone : "all");
  if (activeScreenName === "face-scan") {
    renderFaceScanScreen();
  }
  if (activeScreenName === "face-routine") {
    renderFaceRoutineScreen();
  }
  if (activeScreenName === "face-guide") {
    renderFaceGuideScreen();
  }
  if (activeScreenName === "face-complete") {
    renderFaceCompleteScreen(faceGuideLastLog);
  }
}

function getFocusableElements(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll([
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(","))).filter((element) => {
    const style = window.getComputedStyle(element);
    return style.visibility !== "hidden" && style.display !== "none";
  });
}

function setOnboardingBackgroundInert(active) {
  [$(".topbar"), $(".screen-stack"), $(".bottom-nav")].filter(Boolean).forEach((element) => {
    if (active) {
      element.dataset.previousAriaHidden = element.getAttribute("aria-hidden") || "";
      element.setAttribute("aria-hidden", "true");
      element.inert = true;
      return;
    }
    if (Object.prototype.hasOwnProperty.call(element.dataset, "previousAriaHidden")) {
      if (element.dataset.previousAriaHidden) {
        element.setAttribute("aria-hidden", element.dataset.previousAriaHidden);
      } else {
        element.removeAttribute("aria-hidden");
      }
      delete element.dataset.previousAriaHidden;
    }
    element.inert = false;
  });
  if (active) {
    document.body.dataset.modalOpen = "onboarding";
  } else if (document.body.dataset.modalOpen === "onboarding") {
    delete document.body.dataset.modalOpen;
  }
}

function focusOnboardingModal() {
  const modal = $("#onboardingModal");
  if (!modal || modal.hidden) return;
  const preferred = $("#finishOnboardingButton") || modal.querySelector(".onboarding-choice.active");
  const target = preferred || getFocusableElements(modal)[0] || modal;
  if (!modal.hasAttribute("tabindex")) modal.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

function trapOnboardingFocus(event) {
  const modal = $("#onboardingModal");
  if (!modal || modal.hidden || event.key !== "Tab") return;
  const focusable = getFocusableElements(modal);
  if (!focusable.length) {
    event.preventDefault();
    modal.focus({ preventScroll: true });
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus({ preventScroll: true });
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus({ preventScroll: true });
  }
}

function handleOnboardingKeydown(event) {
  const modal = $("#onboardingModal");
  if (!modal || modal.hidden) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeOnboarding(true);
    return;
  }
  trapOnboardingFocus(event);
}

function showOnboarding() {
  hideToast();
  const modal = $("#onboardingModal");
  if (!modal) return;
  onboardingReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modal.hidden = false;
  modal.setAttribute("aria-modal", "true");
  setOnboardingBackgroundInert(true);
  $(".onboarding-card").scrollTop = 0;
  focusOnboardingModal();
}

function closeOnboarding(markSeen = true, options = {}) {
  const modal = $("#onboardingModal");
  if (modal) modal.hidden = true;
  setOnboardingBackgroundInert(false);
  if (markSeen) {
    state.settings.onboardingSeenBuild = state.settings.onboardingSeenBuild || appBuild;
    saveState();
  }
  if (options.restoreFocus !== false && onboardingReturnFocus && document.contains(onboardingReturnFocus)) {
    window.setTimeout(() => onboardingReturnFocus?.focus?.({ preventScroll: true }), 0);
  }
  onboardingReturnFocus = null;
}

function maybeShowOnboarding() {
  state.settings.lastSeenBuild = appBuild;
  saveState();
  if (!state.settings.onboardingSeenBuild) {
    window.setTimeout(showOnboarding, 250);
    return;
  }
}

function finishOnboarding() {
  closeOnboarding(true, { restoreFocus: false });
  startSelectedRoutine();
  showToast("오늘 루틴을 시작합니다. 오늘 컨디션에 맞춰 천천히 진행해요.");
}

function selectOnboardingGoal(button) {
  const routineId = button.dataset.onboardingRoutine;
  const concern = button.dataset.onboardingConcern;
  if (concern && concernLabels[concern]) {
    state.settings.profile = normalizeProfile({
      ...state.settings.profile,
      mainConcern: concern,
      experience: "beginner",
    });
  }
  if (routineId && getRoutineCatalog()[routineId]) {
    state.selectedRoutine = routineId;
    prepareRoutine(routineId);
  }
  state.settings.pressureMode = "soft";
  $$(".onboarding-choice").forEach((choice) => choice.classList.toggle("active", choice === button));
  saveState();
  render();
}

function openOnboardingSettings() {
  closeOnboarding(true, { restoreFocus: false });
  setScreen("settings");
  $(".profile-edit-collapse")?.setAttribute("open", "");
  $(".profile-panel").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openBackupPanel() {
  setScreen("settings");
  $(".backup-collapse")?.setAttribute("open", "");
  $(".backup-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  writeBackupPayload(createBackupPayload(false));
  showToast("사진 제외 백업을 준비했습니다.");
}

function openOnboardingBackup() {
  closeOnboarding(true, { restoreFocus: false });
  openBackupPanel();
}

function markUpdateAvailable() {
  updateAvailable = true;
  renderDraftStatus();
}

async function checkAppUpdate() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") {
    showToast(`빌드 ${appBuild} · 파일 실행 모드입니다.`);
    return;
  }
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      showToast(`빌드 ${appBuild} · 캐시 등록 전입니다.`);
      return;
    }
    await registration.update();
    if (registration.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      showToast("새 캐시를 적용합니다.");
      return;
    }
    updateAvailable = false;
    renderDraftStatus();
    showToast(`빌드 ${appBuild} · 최신 상태입니다.`);
  } catch {
    showToast("업데이트 확인을 다시 시도하세요.");
  }
}

function bindEvents() {
  document.addEventListener("keydown", handleOnboardingKeydown);
  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => setScreen(button.dataset.screen));
  });
  $("#routineStrip").addEventListener("click", (event) => {
    const card = event.target.closest(".routine-card");
    if (!card) return;
    const action = event.target.closest("[data-routine-action]");
    if (action?.dataset.routineAction === "start") {
      startRoutineFromCard(card.dataset.routine);
      return;
    }
    selectRoutine(card.dataset.routine);
  });
  $("#customRoutineList").addEventListener("click", (event) => {
    const button = event.target.closest(".delete-custom");
    if (button) deleteCustomRoutine(button.dataset.routine);
  });
  $("#zoneGuideList").addEventListener("click", (event) => {
    const button = event.target.closest(".zone-guide-action");
    if (button) selectZoneGuideRoutine(button.dataset.zone);
  });
  $("#logFilter").addEventListener("click", (event) => {
    const button = event.target.closest(".filter-chip");
    if (button) setLogFilter(button.dataset.filter);
  });
  $("#logList").addEventListener("click", (event) => {
    const button = event.target.closest(".delete-log");
    if (button) deleteLog(button.dataset.log);
  });
  $("#weekPlanList").addEventListener("click", (event) => {
    const button = event.target.closest(".plan-day");
    if (button) selectRoutine(button.dataset.routine);
  });
  $$(".zone-pill").forEach((pill) => {
    pill.addEventListener("click", () => setFocus(pill.dataset.focus));
  });
  $("#startPauseButton").addEventListener("click", toggleTimer);
  $("#nextStepButton").addEventListener("click", advanceStep);
  $("#startFaceScanButton").addEventListener("click", openFaceScan);
  $("#openFaceScanUploadButton").addEventListener("click", openFaceScanUpload);
  $("#startFaceScanCameraButton").addEventListener("click", startFaceScanCamera);
  $("#captureFaceScanButton").addEventListener("click", captureFaceScan);
  $("#faceUploadInput").addEventListener("change", handleFaceUploadInput);
  $("#faceScanBackButton").addEventListener("click", () => {
    stopFaceScanSession();
    setScreen("today");
  });
  $("#startFaceGuideButton").addEventListener("click", startFaceGuideSession);
  $("#rescanFaceRoutineButton").addEventListener("click", resetFaceGuideToScan);
  $("#faceGuideStartPauseButton").addEventListener("click", toggleTimer);
  $("#faceGuidePrevStepButton").addEventListener("click", retreatStep);
  $("#faceGuideNextStepButton").addEventListener("click", advanceStep);
  $("#faceGuideCompleteButton").addEventListener("click", completeRoutine);
  $("#faceCompleteLogButton").addEventListener("click", () => setScreen("log"));
  $("#faceCompleteRerunButton").addEventListener("click", resetFaceGuideToScan);
  $("#faceCompleteHomeButton").addEventListener("click", () => setScreen("today"));
  $("#faceCompleteSaveNoteButton").addEventListener("click", saveFaceGuideCompleteNote);
  $("#closeCompletionButton").addEventListener("click", closeCompletionPanel);
  $("#viewCompletionLogButton").addEventListener("click", viewCompletionLog);
  $("#selectPlanRoutineButton").addEventListener("click", selectPlanRoutine);
  $("#startPlanRoutineButton").addEventListener("click", startPlanRoutine);
  $("#startFaceScanFromHomeButton").addEventListener("click", openFaceScan);
  $("#resetPlanButton").addEventListener("click", resetPlan);
  $("#applyConditionGuideButton").addEventListener("click", applyConditionGuide);
  $("#applyRhythmReportButton").addEventListener("click", applyRhythmReport);
  $("#copyRhythmReportButton").addEventListener("click", copyRhythmReport);
  $("#downloadRhythmReportButton").addEventListener("click", downloadRhythmReport);
  $("#clearSafetyCheckButton").addEventListener("click", clearSafetyChecks);
  $("#startSelectedButton").addEventListener("click", startSelectedRoutine);
  $("#createCustomRoutineButton").addEventListener("click", createCustomRoutine);
  $("#saveManualLogButton").addEventListener("click", saveManualLog);
  $("#restoreDeletedLogButton").addEventListener("click", restoreDeletedLog);
  $("#applyPhotoRetentionButton").addEventListener("click", applyPhotoRetentionPolicy);
  $("#makeLightBackupButton").addEventListener("click", makeLightBackupFromStorage);
  $("#clearPhotosButton").addEventListener("click", clearStoredPhotos);
  $("#clearLogsButton").addEventListener("click", clearLogs);
  $("#openPrivacyPolicyButton")?.addEventListener("click", () => openPolicyUrl(PUBLIC_POLICY_URL, "개인정보 처리방침"));
  $("#openTermsButton")?.addEventListener("click", () => openPolicyUrl(PUBLIC_TERMS_URL, "이용약관"));
  $("#openSupportButton")?.addEventListener("click", () => openPolicyUrl(PUBLIC_SUPPORT_URL, "지원 안내"));
  $("#copyPolicyButton").addEventListener("click", copyPolicyText);
  $("#resetAppDataButton").addEventListener("click", resetAppData);
  $("#refreshHandoffMemoButton").addEventListener("click", () => {
    refreshHandoffMemo();
    showToast("백업 메모를 갱신했습니다.");
  });
  $("#copyHandoffMemoButton").addEventListener("click", copyHandoffMemo);
  $("#clearPhotoDraftButton").addEventListener("click", () => clearPhotoDraft(true));
  $("#beforePhoto").addEventListener("change", (event) => handlePhotoInput("before", event.target.files[0]));
  $("#afterPhoto").addEventListener("change", (event) => handlePhotoInput("after", event.target.files[0]));
  $("#exportDataButton").addEventListener("click", exportData);
  $("#exportLightDataButton").addEventListener("click", exportLightData);
  $("#copyBackupButton").addEventListener("click", copyBackupPayload);
  $("#downloadBackupButton").addEventListener("click", downloadBackupPayload);
  $("#previewBackupButton").addEventListener("click", previewBackupPayload);
  $("#mergeBackupButton").addEventListener("click", mergeBackupPayload);
  $("#importDataButton").addEventListener("click", importData);
  $("#restoreBackupChangeButton").addEventListener("click", restoreDeletedLog);
  $("#showOnboardingButton").addEventListener("click", showOnboarding);
  $("#closeOnboardingButton").addEventListener("click", () => closeOnboarding(true));
  $$(".onboarding-choice").forEach((button) => {
    button.addEventListener("click", () => selectOnboardingGoal(button));
  });
  $("#finishOnboardingButton").addEventListener("click", finishOnboarding);
  $("#onboardingSettingsButton").addEventListener("click", openOnboardingSettings);
  $("#onboardingBackupButton").addEventListener("click", openOnboardingBackup);
  $("#checkUpdateButton").addEventListener("click", checkAppUpdate);
  $("#openBackupPanelButton").addEventListener("click", openBackupPanel);
  $("#enableReminderButton").addEventListener("click", enableReminder);
  $("#testReminderButton").addEventListener("click", testReminder);
  $("#resetTodayButton").addEventListener("click", resetToday);
  $("#pressureMode").addEventListener("change", updateSettings);
  $("#oilType").addEventListener("change", updateSettings);
  $("#reminderTime").addEventListener("change", updateSettings);
  $("#weeklyGoal").addEventListener("change", updateSettings);
  $("#photoRetention").addEventListener("change", updatePhotoRetentionSetting);
  $("#skipSensitiveAreas").addEventListener("change", updateSettings);
  $("#skinType").addEventListener("change", updateSettings);
  $("#mainConcern").addEventListener("change", updateSettings);
  $("#experienceLevel").addEventListener("change", updateSettings);
  avoidZoneOptions.forEach((zone) => {
    $(`#avoidZone-${zone}`).addEventListener("change", updateSettings);
  });
  safetyCheckOptions.forEach((key) => {
    $(`#safetyCheck-${key}`).addEventListener("change", updateSafetyChecks);
  });
  $("#tensionBefore").addEventListener("input", renderSliders);
  $("#tensionAfter").addEventListener("input", renderSliders);
}

async function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js");
      if (registration.waiting) {
        markUpdateAvailable();
      }
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            markUpdateAvailable();
          }
        });
      });
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        updateAvailable = false;
        renderDraftStatus();
      });
    } catch {
      updateAvailable = false;
      renderDraftStatus();
    }
  }
}

loadState();
ensureProgramStartDate();
ensureSafetyDate();
initFaceGuideModules();
if (!state.activeRoutine) {
  prepareRoutine(state.selectedRoutine);
}
bindEvents();
const isLaunchDemo = applyLaunchDemoMode();
render();
if (!isLaunchDemo) {
  maybeShowOnboarding();
}
registerServiceWorker();
startReminderLoop();
