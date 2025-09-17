import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

interface StackAuthHandlerProps {
  params: Promise<{ stack: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StackAuthHandler(props: StackAuthHandlerProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  return (
    <StackHandler
      app={stackServerApp}
      routeProps={{ params, searchParams }}
      fullPage={true}
    />
  );
}
