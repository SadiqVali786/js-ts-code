const buildTaskURL = (
  dev = false,
  tasks = { prevTasks: true, nextTasks: false },
  options = { size: 20, status: "ACTIVE" }
) => {
  if (tasks.nextTasks === tasks.prevTasks)
    return { error: "prevTasks & nextTasks should be !==" };

  // Pagination takes precedence - prevTasks overrides all other parameters
  if (tasks.prevTasks) return { url: "/tasks?hasPrev=true" };

  const baseEndpoint = "/tasks";
  const searchParams = new URLSearchParams();

  // Add dev mode parameters
  if (dev) {
    searchParams.set("status", options.status);
    searchParams.set("dev", dev.toString());
    searchParams.set("size", options.size.toString());
  }

  // Add next page parameter if requested
  if (tasks.nextTasks) searchParams.set("hasNext", tasks.nextTasks.toString());

  // Construct final URL
  const queryString = searchParams.toString();
  const url = queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;

  return { url };
};
