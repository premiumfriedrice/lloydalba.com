"use client";

import dynamic from "next/dynamic";

/* iOS < 18 lacks Promise.withResolvers and Promise.try, which pdf.js 6 requires */
type ResolversPolyfill = {
  withResolvers?: () => {
    promise: Promise<unknown>;
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  };
  try?: (impl: () => unknown) => Promise<unknown>;
};

const P = Promise as unknown as ResolversPolyfill;
if (typeof P.withResolvers !== "function") {
  P.withResolvers = function () {
    let resolve!: (value: unknown) => void;
    let reject!: (reason: unknown) => void;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}
if (typeof P.try !== "function") {
  P.try = function (impl: () => unknown) {
    try {
      return Promise.resolve(impl());
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

const ResumeView = dynamic(() => import("./ResumeView"), {
  ssr: false,
  loading: () => <div className="resume-loading" />,
});

export default function Resume() {
  return <ResumeView />;
}
