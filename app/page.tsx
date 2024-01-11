"use client"

import React, { useState } from "react"

import { cn } from "@/lib/utils"
import { format } from "date-fns"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"

import { CalendarIcon } from "lucide-react"
import { educationschema, educationEntry } from "@/components/validators/education-schema"

export default function Page() {
  const { toast } = useToast();

  // set education
  const [educations, setEducations] = useState<educationEntry[]>(
    [
      {
        school: "",
        major: "",
        degree: "",
        startdate: new Date(),
        enddate: new Date(),
        isCurrent: false,
      },
    ]
  );

  const currentYear = new Date().getFullYear();

  const defaultEduValue = {
    school: "test",
    major: "test",
    degree: "test",
    startdate: new Date(),
    enddate: new Date(),
    isCurrent: false,
  }

  const form = useForm({
    resolver: zodResolver(educationschema),
    defaultValues: {
      educations: [
        defaultEduValue,
      ]
    }
  });

  const { control, handleSubmit } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: "educations"
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof educationschema>) {
    console.log('[ values ] >', values)
    toast({
      title: "You submitted the following values:",
      description: (
        <p className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </p>
      ),
    })
    //console.log(values)
  }

  const handleCurrentChange = (index: number, isCurrent: boolean) => {
    const updatedEducation = [...educations];
    updatedEducation[index].isCurrent = isCurrent;
    setEducations(updatedEducation);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 my-4">
        {
          fields.map((item, index) => (
            <div key={index}>
              <FormField
                control={control}
                name={`educations.${index}.school`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>学校</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Université xxx"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`educations.${index}.major`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>专业</FormLabel>
                    <FormControl>
                      <Input placeholder="比如: Design" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`educations.${index}.degree`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>学位</FormLabel>
                    <FormControl>
                      <Input placeholder="比如: Master Design" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`educations.${index}.startdate`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>开始时间</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>选择出生日期</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={currentYear}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`educations.${index}.isCurrent`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>是否目前就读?</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {!item.isCurrent && (
                <FormField
                  control={form.control}
                  name={`educations.${index}.enddate`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>结束日期</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>选择结束日期</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown-buttons"
                            fromYear={1900}
                            toYear={currentYear}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="space-x-10 pt-4">
                {
                  index > 0 && <Button variant="secondary" type="button" onClick={() => remove(index)}>Delete</Button>
                }
                <Button
                  type="button"
                  onClick={() => append(defaultEduValue)}
                >
                  append
                </Button>
              </div>
            </div>
          ))
        }
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
