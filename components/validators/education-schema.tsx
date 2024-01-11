import * as z from "zod"

export const educationEntrySchema = z.object({
  school: z.string().min(2, {
    message: "请输入有效的学校名称。",
  }),
  major: z.string().min(2, {
    message: "请输入有效的专业名称。",
  }),
  degree: z.string().min(2, {
    message: "请输入有效的学位名称。",
  }),
  startdate: z.coerce.date({
    errorMap: (issue, {defaultError}) => ({
      message: issue.code === "invalid_date" ? "请输入有效的开始日期。" : defaultError,
    }),
  }),
  isCurrent: z.boolean().optional(),
  enddate: z.coerce.date({
    errorMap: (issue, {defaultError}) => ({
      message: issue.code === "invalid_date" ? "请输入有效的结束日期。" : defaultError,
    }),
  }).optional(),
});

export type educationEntry = z.infer<typeof educationEntrySchema>;

export const educationschema = z.array(educationEntrySchema);
