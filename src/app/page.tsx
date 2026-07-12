import { redirect } from "next/navigation";
import { paths } from "lib/utils/paths";

// "/" redirige al dashboard (como hacía getServerAuth en Pages Router).
export default function Home() {
  redirect(paths.dashboard.path);
}
