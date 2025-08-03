import zod from "zod";

export const FileValidForm = zod.object({
  file: zod.file({ message: "File is required" }),
});

export type FileValidFormType = zod.infer<typeof FileValidForm>;
