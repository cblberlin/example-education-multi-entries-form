"use client"

import React, { useState } from "react"

import { cn } from "@/lib/utils"
import { format } from "date-fns"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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

  const currentYear = new Date().getFullYear()

  // 1. Define your form.
  const form = useForm<z.infer<typeof educationschema>>({
    resolver: zodResolver(educationschema),
    defaultValues: [{
      school: "",
      major: "",
      degree: "",
      startdate: new Date(),
      enddate: new Date(),
      isCurrent: false,
    }],
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof educationschema>) {
    console.log("submited values: ", form.getValues());
    toast({
      title: "You submitted the following values:",
      description: (
        <p className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </p>
      ),
    })
    console.log(values)
  }

  // allow to add more education entries
  function addEducation() {
    setEducations([
      ...educations, 
      {
        school: "",
        major: "",
        degree: "",
        startdate: new Date(),
        enddate: new Date(),
        isCurrent: false,
      },
    ]);
  };

  // delete education entry, but keep at least one entry
  function deleteEducation(index: number) {
    if (educations.length > 1) {
      const newEducations = [...educations];
      newEducations.splice(index, 1);
      setEducations(newEducations);
    } else {
      alert("at least one entry is required");
    }
  };

  const handleCurrentChange = (index: number, isCurrent: boolean) => {
    const updatedEducation = [...educations];
    updatedEducation[index].isCurrent = isCurrent;
    setEducations(updatedEducation);
  };

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-4">
        {educations.map((edu, index) => (
          <div key={index}>
            <FormField
              control={form.control}
              name={`${index}.school`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>school name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="University xxx" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`${index}.major`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>major</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`${index}.degree`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>diploma</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Master Design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`${index}.startdate`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>start day</FormLabel>
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
                            <span>select start day</span>
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

            {/* a checkbox isCurrent: if not selected then show enddate, else show nothing */}
            <FormField
              control={form.control}
              name={`${index}.isCurrent`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>is current?</FormLabel>
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={(isCurrent) => handleCurrentChange(index, Boolean(isCurrent))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {!edu.isCurrent && (
              <FormField
                control={form.control}
                name={`${index}.enddate`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>end day</FormLabel>
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
                              <span>select end day</span>
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

            {index === educations.length - 1 && (
              <div className="flex-wrap-gap-2 mb-2">
                {index !== 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => deleteEducation(index)}
                  >
                    Delete
                  </Button>
                )}
                <Button type="button" onClick={addEducation}>
                  Add
                </Button>
              </div>
            )}
          </div>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
