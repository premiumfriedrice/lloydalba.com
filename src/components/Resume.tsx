"use client";

import dynamic from "next/dynamic";

/* iOS < 17.4 lacks Promise.withResolvers, which pdf.js requires */
type ResolversPolyfill = {
  withResolvers?: () => {
    promise: Promise<unknown>;
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  };
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

const ResumeView = dynamic(() => import("./ResumeView"), {
  ssr: false,
  loading: () => <div className="resume-loading" />,
});

export default function Resume() {
  return <ResumeView />;
}
