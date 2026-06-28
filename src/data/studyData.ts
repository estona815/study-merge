import {
  BlockType,
  ConceptDefinition,
  MergeRecipe,
  Quiz,
  QuizType,
  SubjectDefinition,
  TrackType,
  UnitContent,
} from "../types/models";

interface SubjectSeed {
  id: string;
  name: string;
  mode: TrackType;
  cluster: SubjectDefinition["cluster"];
  headline: string;
  searchTags: string[];
  examTarget?: string;
  unitTitle: string;
  unitSummary: string;
  examImportance: 1 | 2 | 3 | 4 | 5;
  concepts: string[];
  results: string[];
  trapTitle?: string;
}

interface UnitBlueprint {
  id: string;
  title: string;
  summary: string;
  conceptTag: string;
  resultTag: string;
  pairRotation: number;
  durationOffset: number;
  importanceShift: -1 | 0 | 1;
}

interface ContentSummary {
  subjectCount: number;
  unitCount: number;
  conceptCount: number;
  quizCount: number;
  estimatedMinutes: number;
}

const HIGH_SCHOOL_SEEDS: SubjectSeed[] = [
  {
    id: "korean-history",
    name: "한국사",
    mode: "highSchool",
    cluster: "humanities",
    headline: "왕조 흐름과 제도를 짧은 개념 블록으로 묶는 역사 과목",
    searchTags: ["역사", "사탐", "내신", "수능"],
    unitTitle: "한국사 핵심 흐름",
    unitSummary: "선사 문화부터 조선과 전란까지 자주 묶이는 핵심 개념을 정리합니다.",
    examImportance: 5,
    concepts: ["구석기", "신석기", "청동기", "고조선", "8조법", "삼국 시대", "통일 신라", "고려", "조선", "임진왜란"],
    results: ["선사 변화", "국가 형성", "고대 전개", "왕조 흐름", "전란 대응"],
    trapTitle: "시대 혼동",
  },
  {
    id: "integrated-society",
    name: "통합사회",
    mode: "highSchool",
    cluster: "common",
    headline: "권리, 경제, 문화, 정의를 한 화면에서 연결하는 공통 과목",
    searchTags: ["통합사회", "공통", "사회"],
    unitTitle: "통합사회 핵심 개념",
    unitSummary: "권리와 경제, 문화와 정의를 시험 포인트 중심으로 엮어 봅니다.",
    examImportance: 4,
    concepts: ["인간 존엄성", "기본권", "사회 불평등", "시장경제", "세계화", "문화 다양성", "지속가능발전", "민주주의", "정의", "인권"],
    results: ["권리 보장", "사회 구조", "세계 교류", "공공 가치", "시민 정의"],
  },
  {
    id: "society-culture",
    name: "사회·문화",
    mode: "highSchool",
    cluster: "humanities",
    headline: "사회 구조와 개인의 관계를 시험형 키워드로 묶는 과목",
    searchTags: ["사회문화", "사탐", "사회"],
    unitTitle: "사회·문화 핵심 개념",
    unitSummary: "사회화, 계층, 조직 구조를 연관 개념 중심으로 복습합니다.",
    examImportance: 4,
    concepts: ["사회화", "지위", "역할", "일탈", "문화", "하위문화", "사회 계층", "사회 이동", "사회 제도", "관료제"],
    results: ["개인과 사회", "규범과 일탈", "문화 차이", "계층 변동", "조직 구조"],
  },
  {
    id: "life-ethics",
    name: "생활과 윤리",
    mode: "highSchool",
    cluster: "humanities",
    headline: "윤리 이론과 현대 쟁점을 짧은 판단 블록으로 배우는 과목",
    searchTags: ["윤리", "생활과윤리", "사탐"],
    unitTitle: "생활과 윤리 핵심 개념",
    unitSummary: "대표 윤리 이론과 적용 쟁점을 짝으로 묶어 기억합니다.",
    examImportance: 4,
    concepts: ["공리주의", "의무론", "덕 윤리", "생명 윤리", "정보 윤리", "환경 윤리", "직업 윤리", "분배 정의", "시민 불복종", "평화 윤리"],
    results: ["행위 판단", "삶의 가치", "현대 쟁점", "직업과 정의", "시민과 평화"],
  },
  {
    id: "korean-geography",
    name: "한국지리",
    mode: "highSchool",
    cluster: "humanities",
    headline: "자연환경과 국토 변화 흐름을 지역 키워드로 묶는 지리 과목",
    searchTags: ["지리", "한국지리", "사탐"],
    unitTitle: "한국지리 핵심 개념",
    unitSummary: "지형, 산업, 인구와 국토 문제를 연결해서 복습합니다.",
    examImportance: 4,
    concepts: ["산맥", "하천", "기후", "도시화", "수도권", "공업 지역", "농업 지역", "인구 구조", "지역 격차", "지속가능한 국토"],
    results: ["지형 체계", "환경 변화", "산업 집중", "농촌 변화", "균형 발전"],
  },
  {
    id: "world-history",
    name: "세계사",
    mode: "highSchool",
    cluster: "humanities",
    headline: "문명, 혁명, 전쟁의 큰 흐름을 묶어 보는 역사 과목",
    searchTags: ["세계사", "역사", "사탐"],
    unitTitle: "세계사 핵심 흐름",
    unitSummary: "고대 문명부터 냉전까지 시대 전환의 연결 고리를 익힙니다.",
    examImportance: 4,
    concepts: ["고대 문명", "그리스", "로마", "중세 유럽", "르네상스", "절대왕정", "산업혁명", "제국주의", "세계대전", "냉전"],
    results: ["문명 시작", "고전 세계", "근대 준비", "산업 팽창", "현대 질서"],
    trapTitle: "시대 착오",
  },
  {
    id: "integrated-science",
    name: "통합과학",
    mode: "highSchool",
    cluster: "common",
    headline: "물질, 생명, 지구, 에너지를 한 엔진으로 묶는 공통 과학",
    searchTags: ["통합과학", "과학", "공통"],
    unitTitle: "통합과학 핵심 개념",
    unitSummary: "물질과 에너지, 생명과 지구 시스템을 연결해 복습합니다.",
    examImportance: 4,
    concepts: ["물질의 구성", "원소", "화학 결합", "역학적 시스템", "생명 시스템", "지구 시스템", "에너지 전환", "생태계", "유전 정보", "신재생 에너지"],
    results: ["구성 원리", "결합과 운동", "생명과 지구", "에너지 순환", "미래 에너지"],
  },
  {
    id: "biology",
    name: "생명과학",
    mode: "highSchool",
    cluster: "science",
    headline: "세포, 유전, 항상성을 대표 개념 묶음으로 복습하는 과목",
    searchTags: ["생명과학", "과탐", "생물"],
    unitTitle: "생명과학 핵심 개념",
    unitSummary: "세포와 유전, 개체 유지 개념을 짧은 키워드로 정리합니다.",
    examImportance: 5,
    concepts: ["세포", "세포막", "효소", "DNA", "유전자", "염색체", "체세포 분열", "감수 분열", "항상성", "생태계"],
    results: ["세포 구조", "유전 작용", "유전 전달", "분열 비교", "개체와 환경"],
    trapTitle: "분열 혼동",
  },
  {
    id: "chemistry",
    name: "화학",
    mode: "highSchool",
    cluster: "science",
    headline: "입자, 결합, 반응을 짧은 공식형 개념으로 묶는 과목",
    searchTags: ["화학", "과탐"],
    unitTitle: "화학 핵심 개념",
    unitSummary: "입자 구조부터 산염기와 탄소 화합물까지 핵심을 빠르게 익힙니다.",
    examImportance: 4,
    concepts: ["원자", "이온", "공유 결합", "이온 결합", "몰", "화학 반응식", "산화 환원", "산과 염기", "중화 반응", "탄소 화합물"],
    results: ["입자 이해", "결합 구조", "반응 계산", "용액 변화", "유기 화학"],
  },
  {
    id: "earth-science",
    name: "지구과학",
    mode: "highSchool",
    cluster: "science",
    headline: "지권, 기권, 우주를 대표 개념 연결로 복습하는 과목",
    searchTags: ["지구과학", "과탐", "지구"],
    unitTitle: "지구과학 핵심 개념",
    unitSummary: "지각 변동, 대기 순환, 우주 진화를 묶어 시험 포인트를 익힙니다.",
    examImportance: 4,
    concepts: ["판 구조론", "지진", "화산", "대기 대순환", "해수 순환", "기단", "전선", "별의 진화", "태양계", "외계 행성"],
    results: ["지각 변동", "지구 순환", "날씨 형성", "우주 진화", "행성 탐사"],
  },
  {
    id: "informatics",
    name: "정보",
    mode: "highSchool",
    cluster: "technology",
    headline: "알고리즘과 데이터 개념을 짧은 컴퓨팅 블록으로 익히는 과목",
    searchTags: ["정보", "컴퓨팅", "데이터"],
    unitTitle: "정보 핵심 개념",
    unitSummary: "기초 프로그래밍과 데이터 윤리를 한 보드에서 반복 복습합니다.",
    examImportance: 4,
    concepts: ["알고리즘", "변수", "조건문", "반복문", "배열", "데이터베이스", "네트워크", "암호화", "인공지능", "데이터 윤리"],
    results: ["문제 절차", "제어 구조", "데이터 저장", "보안 연결", "AI 책임"],
  },
  {
    id: "technology-home",
    name: "기술·가정",
    mode: "highSchool",
    cluster: "technology",
    headline: "생활 설계와 기술 영역을 함께 묶어 보는 융합 과목",
    searchTags: ["기술가정", "기술", "가정"],
    unitTitle: "기술·가정 핵심 개념",
    unitSummary: "생활과 기술 영역을 짧은 실생활 키워드 중심으로 정리합니다.",
    examImportance: 3,
    concepts: ["생애 설계", "소비 생활", "영양소", "주거", "제조 기술", "건설 기술", "수송 기술", "정보통신 기술", "에너지 기술", "지식 재산"],
    results: ["생활 계획", "의식주 이해", "생산 기술", "이동과 통신", "기술 권리"],
  },
];

const LICENSE_SEEDS: SubjectSeed[] = [
  {
    id: "electrical-industrial-engineer",
    name: "전기산업기사",
    mode: "certification",
    cluster: "certification",
    headline: "전기 이론과 설비 기준을 계산형 개념 블록으로 복습하는 자격증",
    searchTags: ["전기", "산업기사", "회로"],
    examTarget: "전기산업기사",
    unitTitle: "전기산업기사 핵심 개념",
    unitSummary: "회로와 기기, 설비 기준을 자주 나오는 조합 중심으로 익힙니다.",
    examImportance: 5,
    concepts: ["전압", "전류", "저항", "옴의 법칙", "키르히호프 법칙", "교류", "역률", "변압기", "유도전동기", "전기설비기술기준"],
    results: ["회로 기초", "전류 계산", "교류 해석", "기기 원리", "설비 기준"],
  },
  {
    id: "electrical-engineer",
    name: "전기기사",
    mode: "certification",
    cluster: "certification",
    headline: "전력, 기기, 설비를 종합 정리하는 기사 시험형 과목",
    searchTags: ["전기기사", "전력", "설비"],
    examTarget: "전기기사",
    unitTitle: "전기기사 핵심 이론",
    unitSummary: "전기자기학부터 송배전과 보호계전까지 핵심 흐름을 정리합니다.",
    examImportance: 5,
    concepts: ["전기자기학", "회로이론", "전기기기", "전력공학", "송배전", "보호계전", "변압기", "전기설비기술기준", "제어공학 기초", "계산 공식 암기"],
    results: ["기초 이론", "전력 운용", "계전 보호", "설비 제어", "공식 적용"],
  },
  {
    id: "automation-industrial-engineer",
    name: "자동화설비산업기사",
    mode: "certification",
    cluster: "certification",
    headline: "제어와 센서, 설비 보전을 묶어 복습하는 자동화 자격증",
    searchTags: ["자동화", "PLC", "산업기사"],
    examTarget: "자동화설비산업기사",
    unitTitle: "자동화설비 핵심 개념",
    unitSummary: "제어 흐름과 설비 구성 요소를 짝으로 묶어 기억합니다.",
    examImportance: 5,
    concepts: ["PLC", "시퀀스 제어", "릴레이", "센서", "액추에이터", "공압", "유압", "서보 모터", "피드백 제어", "인터록"],
    results: ["제어 논리", "입출력 감지", "구동 장치", "정밀 제어", "안전 차단"],
  },
  {
    id: "industrial-safety-industrial-engineer",
    name: "산업안전산업기사",
    mode: "certification",
    cluster: "certification",
    headline: "재해 이론과 작업 환경 개념을 실무형으로 묶는 안전 자격증",
    searchTags: ["산업안전", "산업기사", "위험성평가"],
    examTarget: "산업안전산업기사",
    unitTitle: "산업안전산업기사 핵심 개념",
    unitSummary: "재해 이론, 보호구, 작업 환경 평가를 한 세트로 복습합니다.",
    examImportance: 5,
    concepts: ["하인리히 법칙", "도미노 이론", "위험성 평가", "보호구", "MSDS", "안전보건관리체계", "산업재해", "작업환경측정", "근골격계 부담작업", "유해위험방지계획서"],
    results: ["재해 이론", "예방 관리", "물질 안전", "현장 측정", "계획 수립"],
    trapTitle: "책임 전가",
  },
  {
    id: "industrial-safety-engineer",
    name: "산업안전기사",
    mode: "certification",
    cluster: "certification",
    headline: "법령과 위험 방지를 체계적으로 묶는 기사 시험형 안전 과목",
    searchTags: ["산업안전기사", "법령", "보호구"],
    examTarget: "산업안전기사",
    unitTitle: "산업안전기사 핵심 개념",
    unitSummary: "관리론, 위험 방지, 법 체계를 시험형 합성 규칙으로 복습합니다.",
    examImportance: 5,
    concepts: ["산업안전관리론", "인간공학", "기계위험방지", "전기위험방지", "화학설비위험방지", "건설안전", "보호구", "산업재해 통계", "위험성 평가", "안전보건관리체계"],
    results: ["관리 원칙", "위험 방지", "현장 안전", "재해 분석", "체계 구축"],
    trapTitle: "개인 부주의",
  },
  {
    id: "data-processing-industrial-engineer",
    name: "정보처리산업기사",
    mode: "certification",
    cluster: "certification",
    headline: "설계, DB, 네트워크를 기본기 위주로 묶는 정보 자격증",
    searchTags: ["정보처리", "산업기사", "소프트웨어"],
    examTarget: "정보처리산업기사",
    unitTitle: "정보처리산업기사 핵심 개념",
    unitSummary: "설계와 구현, 테스트, 보안을 개념 묶음으로 빠르게 익힙니다.",
    examImportance: 4,
    concepts: ["소프트웨어 설계", "데이터베이스", "운영체제", "네트워크", "프로그래밍 언어", "정보보안", "테스트", "SQL", "요구사항 분석", "디자인 패턴"],
    results: ["설계 기반", "시스템 구성", "구현 보안", "검증 질의", "요구 구조"],
  },
  {
    id: "data-processing-engineer",
    name: "정보처리기사",
    mode: "certification",
    cluster: "certification",
    headline: "요구사항부터 네트워크까지 핵심 빈출 개념을 묶는 기사 과목",
    searchTags: ["정보처리기사", "SQL", "트랜잭션"],
    examTarget: "정보처리기사",
    unitTitle: "정보처리기사 핵심 개념",
    unitSummary: "요구사항 분석, DB, 네트워크, 테스트를 자주 나오는 조합으로 복습합니다.",
    examImportance: 5,
    concepts: ["요구사항 분석", "UML", "정규화", "트랜잭션", "ACID", "SQL", "OSI 7계층", "TCP/IP", "디자인 패턴", "테스트 케이스"],
    results: ["모델 설계", "데이터 무결성", "질의 설계", "통신 구조", "품질 검증"],
    trapTitle: "중복 권장",
  },
  {
    id: "office-automation-industrial-engineer",
    name: "사무자동화산업기사",
    mode: "certification",
    cluster: "certification",
    headline: "OA 실무와 데이터 활용을 묶어 복습하는 사무 자동화 자격증",
    searchTags: ["사무자동화", "OA", "산업기사"],
    examTarget: "사무자동화산업기사",
    unitTitle: "사무자동화 핵심 개념",
    unitSummary: "문서, 시트, 프레젠테이션과 시스템 운영 흐름을 함께 익힙니다.",
    examImportance: 4,
    concepts: ["사무자동화 시스템", "사무경영관리", "프로그래밍 일반", "정보통신 개론", "데이터베이스 활용", "스프레드시트", "문서처리", "프레젠테이션", "업무 프로세스", "OA 보안"],
    results: ["업무 시스템", "기초 컴퓨팅", "데이터 활용", "문서 발표", "실무 보안"],
  },
  {
    id: "hazardous-materials-industrial-engineer",
    name: "위험물산업기사",
    mode: "certification",
    cluster: "certification",
    headline: "위험물 분류와 화재 특성을 짧은 법규형 블록으로 익히는 자격증",
    searchTags: ["위험물", "산업기사", "지정수량"],
    examTarget: "위험물산업기사",
    unitTitle: "위험물산업기사 핵심 개념",
    unitSummary: "위험물 종류와 점화 특성, 관리 기준을 빠르게 복습합니다.",
    examImportance: 5,
    concepts: ["제1류 위험물", "제2류 위험물", "제3류 위험물", "제4류 위험물", "제5류 위험물", "제6류 위험물", "인화점", "발화점", "지정수량", "소화방법"],
    results: ["산화성 구분", "자연 발화", "액체 화재", "점화 특성", "관리 기준"],
  },
  {
    id: "construction-safety-industrial-engineer",
    name: "건설안전산업기사",
    mode: "certification",
    cluster: "certification",
    headline: "추락, 붕괴, 작업계획을 현장 안전 블록으로 묶는 자격증",
    searchTags: ["건설안전", "산업기사", "비계"],
    examTarget: "건설안전산업기사",
    unitTitle: "건설안전 핵심 개념",
    unitSummary: "추락과 붕괴, 가설 구조물과 작업 계획을 한 세트로 정리합니다.",
    examImportance: 5,
    concepts: ["추락", "낙하", "비래", "붕괴", "가설통로", "비계", "굴착", "작업발판", "안전난간", "작업계획서"],
    results: ["재해 구분", "붕괴 위험", "가설 구조", "작업 발판", "사전 계획"],
  },
];

const ALL_SEEDS = [...HIGH_SCHOOL_SEEDS, ...LICENSE_SEEDS];

export const LEGAL_REVIEW_NOTE =
  "MVP 샘플 데이터입니다. 실제 서비스화 전에는 교육과정, 자격 기준, 저작권 검토를 반드시 진행해야 합니다.";

const UNIT_BLUEPRINTS: UnitBlueprint[] = [
  {
    id: "core-base",
    title: "핵심 베이스",
    summary: "가장 먼저 잡아야 하는 기본 연결 쌍을 차분하게 정리합니다.",
    conceptTag: "기초",
    resultTag: "핵심 정리",
    pairRotation: 0,
    durationOffset: 0,
    importanceShift: 0,
  },
  {
    id: "frequent-links",
    title: "빈출 연결",
    summary: "시험에서 함께 묶여 나오는 빈출 조합을 반복 복습합니다.",
    conceptTag: "빈출",
    resultTag: "연결 구조",
    pairRotation: 1,
    durationOffset: 1,
    importanceShift: 1,
  },
  {
    id: "flow-setup",
    title: "흐름 정리",
    summary: "앞뒤 흐름으로 묶어야 기억이 오래 가는 연결만 압축합니다.",
    conceptTag: "흐름",
    resultTag: "전개 완성",
    pairRotation: 2,
    durationOffset: 1,
    importanceShift: 0,
  },
  {
    id: "compare-points",
    title: "개념 비교",
    summary: "헷갈리는 유사 개념을 비교해서 선지 구분력을 높입니다.",
    conceptTag: "비교",
    resultTag: "구분 포인트",
    pairRotation: 3,
    durationOffset: 1,
    importanceShift: 0,
  },
  {
    id: "choice-check",
    title: "실전 선택지",
    summary: "선지형 문제에서 자주 흔들리는 포인트를 빠르게 판별합니다.",
    conceptTag: "선지",
    resultTag: "선지 판별",
    pairRotation: 4,
    durationOffset: 2,
    importanceShift: 1,
  },
  {
    id: "weakness-fix",
    title: "약점 보강",
    summary: "낮은 숙련도 개념을 다시 잡는 보강형 루프로 구성했습니다.",
    conceptTag: "약점",
    resultTag: "약점 보강",
    pairRotation: 0,
    durationOffset: 1,
    importanceShift: 1,
  },
  {
    id: "trap-reset",
    title: "오답 구분",
    summary: "함정 보기와 정답 연결을 분리해서 보는 훈련에 초점을 맞춥니다.",
    conceptTag: "함정",
    resultTag: "정답 교정",
    pairRotation: 1,
    durationOffset: 1,
    importanceShift: 0,
  },
  {
    id: "quick-loop",
    title: "빠른 3분",
    summary: "짧은 시간 안에 핵심 조합을 훑는 초압축 세션입니다.",
    conceptTag: "3분",
    resultTag: "3분 압축",
    pairRotation: 2,
    durationOffset: -1,
    importanceShift: -1,
  },
  {
    id: "exam-cram",
    title: "시험 직전",
    summary: "시험 직전에 다시 떠올려야 하는 연결 위주로 재배치했습니다.",
    conceptTag: "시험",
    resultTag: "직전 암기",
    pairRotation: 3,
    durationOffset: 2,
    importanceShift: 1,
  },
  {
    id: "recall-round",
    title: "기초 회상",
    summary: "바로 떠올라야 하는 기초 개념을 회상 중심으로 되짚습니다.",
    conceptTag: "회상",
    resultTag: "즉답 회상",
    pairRotation: 4,
    durationOffset: 0,
    importanceShift: 0,
  },
  {
    id: "review-links",
    title: "연계 복습",
    summary: "단원 사이 연결고리를 자연스럽게 다시 떠올리도록 구성했습니다.",
    conceptTag: "연계",
    resultTag: "연계 묶음",
    pairRotation: 0,
    durationOffset: 1,
    importanceShift: 0,
  },
  {
    id: "short-answer",
    title: "서술 대비",
    summary: "짧은 설명형 답안을 떠올리기 좋은 묶음을 중심으로 복습합니다.",
    conceptTag: "서술",
    resultTag: "서술 완성",
    pairRotation: 1,
    durationOffset: 1,
    importanceShift: 0,
  },
  {
    id: "repeat-memory",
    title: "한 번 더 암기",
    summary: "같은 개념을 다른 순서로 다시 만나는 반복 암기용 라운드입니다.",
    conceptTag: "반복",
    resultTag: "반복 암기",
    pairRotation: 2,
    durationOffset: 0,
    importanceShift: 0,
  },
  {
    id: "condition-judge",
    title: "조건 판단",
    summary: "조건형 문장에서 놓치기 쉬운 기준어를 묶어 판단력을 키웁니다.",
    conceptTag: "조건",
    resultTag: "조건 판단",
    pairRotation: 3,
    durationOffset: 2,
    importanceShift: 1,
  },
  {
    id: "map-structure",
    title: "도식 연결",
    summary: "도식처럼 한 번에 엮어서 기억하기 좋은 핵심 구조를 정리합니다.",
    conceptTag: "도식",
    resultTag: "도식 구조",
    pairRotation: 4,
    durationOffset: 1,
    importanceShift: 0,
  },
  {
    id: "compression-pass",
    title: "압축 점검",
    summary: "중요 연결만 남겨 다시 훑는 최종 점검용 루프입니다.",
    conceptTag: "압축",
    resultTag: "압축 점검",
    pairRotation: 0,
    durationOffset: 0,
    importanceShift: 0,
  },
  {
    id: "last-check",
    title: "마지막 체크",
    summary: "실전 직전에 한 번 더 확인해야 하는 약한 고리를 점검합니다.",
    conceptTag: "최종",
    resultTag: "마지막 체크",
    pairRotation: 1,
    durationOffset: 1,
    importanceShift: 1,
  },
  {
    id: "mastery-round",
    title: "완성 라운드",
    summary: "기본, 빈출, 함정을 다 섞어 숙련도를 끌어올리는 마무리 세션입니다.",
    conceptTag: "숙련",
    resultTag: "숙련 완성",
    pairRotation: 2,
    durationOffset: 2,
    importanceShift: 1,
  },
];

function clampExamImportance(value: number): 1 | 2 | 3 | 4 | 5 {
  return Math.max(1, Math.min(5, value)) as 1 | 2 | 3 | 4 | 5;
}

function createUnitLabel(index: number, title: string): string {
  return `${String(index + 1).padStart(2, "0")}. ${title}`;
}

function inferBlockType(title: string, index: number): BlockType {
  if (title.includes("법") || title.includes("기준")) {
    return "law";
  }
  if (title.includes("분열") || title.includes("평가") || title.includes("계획")) {
    return "process";
  }
  if (title.includes("윤리") || title.includes("정의") || title.includes("이론")) {
    return "principle";
  }
  if (title.includes("위험") || title.includes("재해") || title.includes("불평등")) {
    return "risk";
  }
  if (title.includes("기후") || title.includes("냉전") || title.includes("대전")) {
    return "event";
  }
  if (title.includes("공식") || title.includes("ACID") || title.includes("SQL")) {
    return "formula";
  }
  if (index % 5 === 0) {
    return "term";
  }
  return "definition";
}

function createShortDefinition(subjectName: string, title: string): string {
  return `${title}을 중심으로 ${subjectName}의 핵심 흐름을 짧게 정리하는 개념`;
}

function createExplanation(subjectName: string, title: string, resultTitle: string): string {
  return `${title}은(는) ${subjectName}에서 ${resultTitle}로 이어지는 핵심 연결고리입니다.`;
}

function createExamTip(title: string, resultTitle: string): string {
  return `${title}을(를) ${resultTitle}와 한 묶음으로 보면 선택지 구분이 쉬워집니다.`;
}

function createPracticeQuiz(
  quizId: string,
  subjectName: string,
  title: string,
  explanation: string,
): Quiz {
  return {
    id: quizId,
    type: "ox",
    prompt: `${title}은(는) ${subjectName} 핵심 개념으로 반복 확인할 가치가 있습니다.`,
    correctAnswer: true,
    explanation,
  };
}

function createMergeQuiz(
  quizId: string,
  type: QuizType,
  leftTitle: string,
  rightTitle: string,
  resultTitle: string,
): Quiz {
  const explanation = `${leftTitle}와 ${rightTitle}를 한 세트로 기억하면 ${resultTitle} 정리가 빨라집니다.`;

  if (type === "multipleChoice") {
    return {
      id: quizId,
      type,
      prompt: `${leftTitle}와 ${rightTitle}를 함께 설명하는 핵심 개념은 무엇인가요?`,
      correctOptionId: `${quizId}-a`,
      options: [
        { id: `${quizId}-a`, text: resultTitle },
        { id: `${quizId}-b`, text: leftTitle },
        { id: `${quizId}-c`, text: rightTitle },
      ],
      explanation,
    };
  }

  if (type === "ox") {
    return {
      id: quizId,
      type,
      prompt: `${leftTitle}와 ${rightTitle}는 ${resultTitle} 개념 묶음으로 함께 출제될 수 있습니다.`,
      correctAnswer: true,
      explanation,
    };
  }

  if (type === "fillBlank") {
    return {
      id: quizId,
      type,
      prompt: `${leftTitle}와 ${rightTitle}를 연결하면 ____ 개념으로 정리됩니다.`,
      placeholder: "정답 입력",
      acceptableAnswers: [resultTitle],
      explanation,
    };
  }

  return {
    id: quizId,
    type,
    prompt: "왼쪽 개념을 가장 가까운 짝으로 연결하세요.",
    pairs: [
      { left: leftTitle, right: rightTitle },
      { left: resultTitle, right: "상위 개념" },
    ],
    choices: [rightTitle, "상위 개념", leftTitle],
    explanation,
  };
}

function buildSubjectDefinition(seed: SubjectSeed, units: UnitContent[]): SubjectDefinition {
  return {
    id: seed.id,
    name: seed.name,
    mode: seed.mode,
    cluster: seed.cluster,
    searchTags: seed.searchTags,
    headline: seed.headline,
    unitIds: units.map((unit) => unit.id),
    totalConcepts: units.reduce((sum, unit) => sum + unit.concepts.length, 0),
    totalQuizzes: units.reduce((sum, unit) => sum + unit.quizzes.length, 0),
    estimatedMinutes: units.reduce((sum, unit) => sum + unit.estimatedMinutes, 0),
    isPlayable: units.length > 0,
    examTarget: seed.examTarget,
  };
}

function buildUnitFromSeed(
  seed: SubjectSeed,
  blueprint: UnitBlueprint,
  unitIndex: number,
): UnitContent {
  const unitId = `${seed.id}-unit-${unitIndex + 1}`;
  const concepts: ConceptDefinition[] = [];
  const recipes: MergeRecipe[] = [];
  const quizzes: Quiz[] = [];
  const quizTypes: QuizType[] = [
    "multipleChoice",
    "ox",
    "fillBlank",
    "matching",
    "multipleChoice",
  ];
  const pairCount = seed.results.length;
  const unitTrapId = seed.trapTitle ? `${unitId}-trap` : undefined;

  seed.results.forEach((_, pairIndex) => {
    const basePairIndex = (pairIndex + blueprint.pairRotation) % pairCount;
    const leftIndex = basePairIndex * 2;
    const rightIndex = leftIndex + 1;
    const localLeftIndex = pairIndex * 2;
    const localRightIndex = localLeftIndex + 1;
    const baseLeftTitle =
      seed.concepts[leftIndex] ?? `${seed.name} 기본 개념 ${leftIndex + 1}`;
    const baseRightTitle =
      seed.concepts[rightIndex] ?? `${seed.name} 기본 개념 ${rightIndex + 1}`;
    const baseResultTitle =
      seed.results[basePairIndex] ?? `${seed.name} 핵심 정리 ${basePairIndex + 1}`;
    const leftTitle = `${baseLeftTitle} ${blueprint.conceptTag}`;
    const rightTitle = `${baseRightTitle} ${blueprint.conceptTag}`;
    const resultTitle = `${baseResultTitle} ${blueprint.resultTag}`;
    const leftId = `${unitId}-c${localLeftIndex + 1}`;
    const rightId = `${unitId}-c${localRightIndex + 1}`;
    const resultId = `${unitId}-r${pairIndex + 1}`;
    const mergeGroupId = `${unitId}-g${pairIndex + 1}`;

    const leftExplanation = createExplanation(seed.name, leftTitle, resultTitle);
    const rightExplanation = createExplanation(seed.name, rightTitle, resultTitle);
    const leftFallbackConfuserId = `${unitId}-c${((localRightIndex + 1) % seed.concepts.length) + 1}`;
    const rightFallbackConfuserId = `${unitId}-c${((localRightIndex + 2) % seed.concepts.length) + 1}`;

    concepts.push(
      {
        id: leftId,
        subjectId: seed.id,
        unitId,
        title: leftTitle,
        shortDefinition: createShortDefinition(seed.name, leftTitle),
        blockType: inferBlockType(leftTitle, leftIndex),
        mergeGroupId,
        stage: 0,
        difficulty: ((leftIndex % 5) + 1) as 1 | 2 | 3 | 4 | 5,
        relatedConceptIds: [rightId, resultId],
        wrongConfuserIds: unitTrapId ? [unitTrapId] : [leftFallbackConfuserId],
        explanation: leftExplanation,
        isSpawnable: true,
        spawnWeight: 3,
        examTip: createExamTip(leftTitle, resultTitle),
        practiceQuiz: createPracticeQuiz(`${leftId}-practice`, seed.name, leftTitle, leftExplanation),
      },
      {
        id: rightId,
        subjectId: seed.id,
        unitId,
        title: rightTitle,
        shortDefinition: createShortDefinition(seed.name, rightTitle),
        blockType: inferBlockType(rightTitle, rightIndex),
        mergeGroupId,
        stage: 0,
        difficulty: ((rightIndex % 5) + 1) as 1 | 2 | 3 | 4 | 5,
        relatedConceptIds: [leftId, resultId],
        wrongConfuserIds: unitTrapId ? [unitTrapId] : [rightFallbackConfuserId],
        explanation: rightExplanation,
        isSpawnable: true,
        spawnWeight: 3,
        examTip: createExamTip(rightTitle, resultTitle),
        practiceQuiz: createPracticeQuiz(`${rightId}-practice`, seed.name, rightTitle, rightExplanation),
      },
      {
        id: resultId,
        subjectId: seed.id,
        unitId,
        title: resultTitle,
        shortDefinition: `${leftTitle}와 ${rightTitle}를 한 번에 묶어 보는 상위 개념`,
        blockType: "principle",
        mergeGroupId,
        stage: 1,
        difficulty: Math.min(pairIndex + 2, 5) as 1 | 2 | 3 | 4 | 5,
        relatedConceptIds: [leftId, rightId],
        wrongConfuserIds: unitTrapId ? [unitTrapId] : [],
        explanation: `${resultTitle}은(는) ${leftTitle}와 ${rightTitle}를 함께 설명할 때 쓰는 핵심 묶음입니다.`,
        isSpawnable: false,
        examTip: `${resultTitle}을(를) 떠올릴 때는 ${leftTitle}와 ${rightTitle}를 동시에 기억하세요.`,
        practiceQuiz: createPracticeQuiz(`${resultId}-practice`, seed.name, resultTitle, `${resultTitle}은(는) 핵심 상위 개념입니다.`),
      },
    );

    const quizId = `${unitId}-merge-quiz-${pairIndex + 1}`;
    quizzes.push(
      createMergeQuiz(
        quizId,
        quizTypes[(pairIndex + blueprint.pairRotation) % quizTypes.length] ?? "multipleChoice",
        leftTitle,
        rightTitle,
        resultTitle,
      ),
    );
    recipes.push({
      id: `${unitId}-recipe-${pairIndex + 1}`,
      sourceConceptIds: [leftId, rightId],
      resultConceptId: resultId,
      quizId,
      explanation: `${leftTitle}와 ${rightTitle}는 ${resultTitle}로 함께 정리하면 기억 효율이 높아집니다.`,
      priority: pairIndex + 1,
    });
  });

  if (seed.trapTitle) {
    concepts.push({
      id: unitTrapId!,
      subjectId: seed.id,
      unitId,
      title: `${seed.trapTitle} ${blueprint.conceptTag}`,
      shortDefinition: `${seed.name}에서 헷갈리기 쉬운 오답 유도 개념`,
      blockType: "trap",
      mergeGroupId: `${unitId}-trap`,
      stage: 0,
      difficulty: 3,
      relatedConceptIds: [],
      wrongConfuserIds: concepts.slice(0, 2).map((concept) => concept.id),
      explanation: `${seed.trapTitle}은(는) 실제 정답 구조와 구분해서 봐야 하는 헷갈림 요소입니다.`,
      isSpawnable: true,
      spawnWeight: 1,
      isTrap: true,
      examTip: "비슷해 보여도 정답 개념과 연결 기준을 다시 확인하세요.",
      practiceQuiz: {
        id: `${unitTrapId}-practice`,
        type: "ox",
        prompt: `${seed.trapTitle}은(는) 정답 개념과 구분해서 확인해야 하는 함정 보기입니다.`,
        correctAnswer: true,
        explanation: "헷갈리는 보기일수록 연결 근거를 먼저 확인하는 습관이 중요합니다.",
      },
    });
  }

  return {
    id: unitId,
    subjectId: seed.id,
    title: createUnitLabel(unitIndex, blueprint.title),
    summary: `${seed.unitSummary} ${blueprint.summary}`,
    estimatedMinutes: Math.max(4, 6 + (seed.examImportance - 2) + blueprint.durationOffset),
    examImportance: clampExamImportance(seed.examImportance + blueprint.importanceShift),
    concepts,
    recipes,
    quizzes,
  };
}

const SUBJECT_UNITS = new Map(
  ALL_SEEDS.map((seed) => [
    seed.id,
    UNIT_BLUEPRINTS.map((blueprint, index) => buildUnitFromSeed(seed, blueprint, index)),
  ] as const),
);

export const SAMPLE_UNITS = Array.from(SUBJECT_UNITS.values()).flat();
export const SUBJECT_CATALOG = ALL_SEEDS.map((seed) =>
  buildSubjectDefinition(seed, SUBJECT_UNITS.get(seed.id) ?? []),
);
export const SUBJECT_MAP = new Map(SUBJECT_CATALOG.map((subject) => [subject.id, subject]));
export const UNIT_MAP = new Map(SAMPLE_UNITS.map((unit) => [unit.id, unit]));
export const CONCEPT_MAP = new Map(
  SAMPLE_UNITS.flatMap((unit) => unit.concepts.map((concept) => [concept.id, concept] as const)),
);

function buildContentSummary(subjects: SubjectDefinition[]): ContentSummary {
  return {
    subjectCount: subjects.length,
    unitCount: subjects.reduce((sum, subject) => sum + subject.unitIds.length, 0),
    conceptCount: subjects.reduce((sum, subject) => sum + subject.totalConcepts, 0),
    quizCount: subjects.reduce((sum, subject) => sum + subject.totalQuizzes, 0),
    estimatedMinutes: subjects.reduce((sum, subject) => sum + subject.estimatedMinutes, 0),
  };
}

export function getSubjectCatalog(mode?: TrackType): SubjectDefinition[] {
  if (!mode) {
    return SUBJECT_CATALOG;
  }

  return SUBJECT_CATALOG.filter((subject) => subject.mode === mode);
}

export function getSubjectById(subjectId: string): SubjectDefinition | undefined {
  return SUBJECT_MAP.get(subjectId);
}

export function getUnitContent(unitId: string): UnitContent | undefined {
  return UNIT_MAP.get(unitId);
}

export function getSubjectUnits(subjectId: string): UnitContent[] {
  return SUBJECT_UNITS.get(subjectId) ?? [];
}

export function getConceptById(conceptId: string): ConceptDefinition | undefined {
  return CONCEPT_MAP.get(conceptId);
}

export function getUnitByConceptId(conceptId: string): UnitContent | undefined {
  return SAMPLE_UNITS.find((unit) => unit.concepts.some((concept) => concept.id === conceptId));
}

export function getContentSummary(mode?: TrackType): ContentSummary {
  return buildContentSummary(getSubjectCatalog(mode));
}
