"use client";

import dynamic from "next/dynamic";

const ResumeView = dynamic(() => import("./ResumeView"), {
  ssr: false,
  loading: () => <div className="resume-loading" />,
});

export default function Resume() {
  return <ResumeView />;
}
