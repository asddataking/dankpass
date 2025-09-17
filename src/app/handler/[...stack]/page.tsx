import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

export default function StackAuthHandler() {
  return <StackHandler app={stackServerApp} fullPage={true} />;
}
