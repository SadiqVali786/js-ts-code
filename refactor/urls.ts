import z from "zod";

enum STATUS {
  "ACTIVE" = "ACTIVE",
}

const BuildTaskURLSchema = z.object({
  dev: z.boolean().optional(),
  prevTasks: z.boolean().optional(),
  nextTasks: z.boolean().optional(),
  size: z.number().optional(),
  status: z.nativeEnum(STATUS),
});

const buildTaskURL = (options: z.infer<typeof BuildTaskURLSchema>) => {
  const validated = BuildTaskURLSchema.safeParse(options);
  if (!validated.success) return { error: validated.error.flatten() };

  const {
    dev = false,
    prevTasks = true,
    size = 20,
    status = STATUS.ACTIVE,
    nextTasks = false,
  } = validated.data;

  if (nextTasks === prevTasks) return;

  // Pagination takes precedence - prevTasks overrides all other parameters
  if (prevTasks) return { url: "/tasks?hasPrev=true" };

  const baseEndpoint = "/tasks";
  const searchParams = new URLSearchParams();

  // Add dev mode parameters
  if (dev) {
    searchParams.set("status", status);
    searchParams.set("dev", dev.toString());
    searchParams.set("size", size.toString());
  }

  // Add next page parameter if requested
  if (nextTasks) searchParams.set("hasNext", nextTasks.toString());

  // Construct final URL
  const queryString = searchParams.toString();
  const url = queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;

  return { url };
};
