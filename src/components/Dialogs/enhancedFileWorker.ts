import { update } from "lodash-es";

interface EnhancedFileWorker {
  id: number;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  url: string;
  status: "pending" | "uploading" | "success" | "error";
}

const tasks = new Map<number, EnhancedFileWorker>();

self.onmessage = (event) => {
  const {
    id,
    file,
    name,
    size,
    type,
    progress,
    url,
    status,
    // 分片大小, 默认10M
    chunkSize = 1024 * 1024 * 10,
  } = event.data;

  switch (type) {
    case "ADD_TASK":
      tasks.set(id, {
        id,
        file,
        name,
        size,
        type,
        progress,
        url,
        status: "pending",
      });
      break;
    case "CANCEL_TASK":
      tasks.delete(id);
      break;
  }
};
function updateTaskProgress(task: EnhancedFileWorker, progress: number) {
  if (task) {
    task.progress = progress;
    self.postMessage({
      type: "TASK_PROGRESS",
      id: task.id,
      progress,
    });
  }
}
async function processNextTask() {
  const task = Array.from(tasks.values()).find(
    (task) => task.status === "pending"
  );

  if (!task) return;
  task.status = "uploading";
  updateTaskProgress(task, 0);
}
