import { dynamicBench } from "./benches/reactively/dynamicBench";
import { cellxbench } from "./benches/cellxBench";
import { sbench } from "./benches/sBench";
import { molBench } from "./benches/molBench";
import { kairoBench } from "./benches/kairoBench";
import { promiseDelay } from "./util/asyncUtil";
import type { FrameworkInfo } from "./util/frameworkTypes";
import { PerfResultCallback } from "./util/perfLogging";
import {memoryBench} from "./benches/memoryUsage";

export type { ReactiveFramework } from "./util/reactiveFramework";
export {
  perfResultHeaders,
  formatPerfResult,
  formatPerfResultStrings,
  type PerfResult,
  type PerfResultStrings,
  type PerfResultCallback,
} from "./util/perfLogging";
export { frameworkInfo, allFrameworks } from "./frameworksList";
export type { FrameworkInfo };

export async function runTests(
  frameworkInfo: FrameworkInfo[],
  logPerfResult: PerfResultCallback,
) {
  await promiseDelay(0);

  console.warn('runTests, frameworkInfo is ', frameworkInfo);
  for (const { framework } of frameworkInfo) {
    await kairoBench(framework, logPerfResult);
    await promiseDelay(1000);
  }

  // for (const { framework } of frameworkInfo) {
  //   console.warn('then memoryBench . '); // node 端运行
  //   await memoryBench(framework, logPerfResult);
  //   await promiseDelay(1000);
  // }

  for (const { framework } of frameworkInfo) {
    await molBench(framework, logPerfResult);
    await promiseDelay(1000);
  }

  for (const { framework } of frameworkInfo) {
    await sbench(framework, logPerfResult);
    await promiseDelay(1000);
  }

  for (const { framework } of frameworkInfo) {
    await cellxbench(framework, logPerfResult);
    await promiseDelay(1000);
  }

  for (const frameworkTest of frameworkInfo) {
    await dynamicBench(frameworkTest, logPerfResult);
    await promiseDelay(1000);
  }
}
