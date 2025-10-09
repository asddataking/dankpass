import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

export default function StackAuthPage(props: any) {
  return <StackHandler app={stackServerApp} routeProps={props} fullPage />;
}
