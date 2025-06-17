import { useConstructTasksStore } from "@/stores/construct-tasks-store";

export default function ConstructTableView() {
  const { tasks } = useConstructTasksStore.getState();

  return <div>ConstructTableView</div>;
}
