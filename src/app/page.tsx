import RootLayout from "./layout";
import { AppSidebar } from "@/components/app-sidebar";

export default function Home() {
  return (
    <RootLayout>
      <AppSidebar>
        <main>
          <h1>Hello World</h1>
        </main>
      </AppSidebar>
    </RootLayout>
  );
}
