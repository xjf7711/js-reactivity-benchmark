import {PerfResultCallback} from "../util/perfLogging";
import { Computed, ReactiveFramework, Signal } from "../util/reactiveFramework";
import {nextTick} from "../util/asyncUtil";

export async function memoryBench(
	framework: ReactiveFramework,
	logPerfResult: PerfResultCallback,
) {
	console.warn('memory bench . performance is ', performance);
	// if (!performance.memory) return;
	// let start = performance.memory.usedJSHeapSize;

	globalThis.gc?.();
	let start = process.memoryUsage().heapUsed;

	// const signals: Signal<number>[] = [];
	// for (let i = 0; i < 10000; i++) {
	// 	signals.push(framework.signal(0));
	// }
	const signals = Array.from({ length: 10000 }, () => framework.signal(0));
	// await nextTick();
	// let end = performance.memory.usedJSHeapSize;

	globalThis.gc?.();
	let end = process.memoryUsage().heapUsed;

	const signalMem = end - start;
	console.log(`signalMem: ${((end - start) / 1024).toFixed(2)} KB`);

	start = end;
	// start = performance.memory.usedJSHeapSize;

	const computeds = Array.from({ length: 10000 }, (_, i) => framework.computed(() => signals[i].read() + 1));
	// await nextTick();

	globalThis.gc?.();
	end = process.memoryUsage().heapUsed;
	//
	// end = performance.memory.usedJSHeapSize;
	//
	// const computedMem = Number(((end - start) / 1024).toFixed(2))
	console.log(`computed: ${((end - start) / 1024).toFixed(2)} KB`);

	start = end;
	// start = performance.memory.usedJSHeapSize;

	Array.from({ length: 10000 }, (_, i) => framework.effect(() => computeds[i].read()));
	// await nextTick();

	// end = performance.memory.usedJSHeapSize;

	globalThis.gc?.();
	end = process.memoryUsage().heapUsed;
	// const effectMem = Number(((end - start) / 1024).toFixed(2));
	console.log(`effect: ${((end - start) / 1024).toFixed(2)} KB`);

	start = end;
	// start = performance.memory.usedJSHeapSize;

	const w = 100;
	const h = 100;
	const src = framework.signal(1);

	for (let i = 0; i < w; i++) {
		let last: Computed<number> | Signal<number>= src;
		for (let j = 0; j < h; j++) {
			const prev = last;
			last = framework.computed(() => prev.read() + 1);
			framework.effect(() => last.read());
		}
	}

	src.write(src.read() + 1);

	await nextTick();

	globalThis.gc?.();
	end = process.memoryUsage().heapUsed;

	// end = performance.memory.usedJSHeapSize
	// const treeMem = Number(((end - start) / 1024).toFixed(2));
	console.log(`tree: ${((end - start) / 1024).toFixed(2)} KB`);

	logPerfResult({
		framework: framework.name,
		test: "memory usage",
		time: signalMem,
	});

}
