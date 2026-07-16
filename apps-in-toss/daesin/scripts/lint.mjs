import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const source = readFileSync(join(projectRoot, "src", "index.tsx"), "utf8");
const required = ["TDSMobileProvider", "Button", "TextField", "의료·치료 서비스가 아닙니다"];
const prohibitedFeaturePhrases = ["결제하기", "진단 결과", "처방 제공", "로그인하기", "광고 보기"];

for (const token of required) {
  if (!source.includes(token)) throw new Error(`필수 토스 출시 경계 문구 또는 TDS 사용이 없습니다: ${token}`);
}
for (const token of prohibitedFeaturePhrases) {
  if (source.includes(token)) throw new Error(`현재 AIT RC 범위에 포함하지 않는 기능 문구가 있습니다: ${token}`);
}

console.log("DAESIN AIT lint passed");
