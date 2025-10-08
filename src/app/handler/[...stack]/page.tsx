import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

export default function StackAuthPage() {
  return <StackHandler app={stackServerApp} fullPage />;
}
