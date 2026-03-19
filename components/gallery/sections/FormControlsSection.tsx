"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { GallerySection } from "@/components/gallery/GallerySection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export function FormControlsSection() {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxValue, setComboboxValue] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const scrollBeforeOpen = useRef(0);

  // Prevent page jump when Combobox opens (focus on CommandInput triggers scroll)
  useEffect(() => {
    if (comboboxOpen) {
      const id = setTimeout(() => window.scrollTo(0, scrollBeforeOpen.current), 0);
      return () => clearTimeout(id);
    }
  }, [comboboxOpen]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "" },
  });

  return (
    <GallerySection
      id="form-controls"
      title="Form Controls"
      description="Input, Textarea, Label, Select, Combobox, Date Picker, Input OTP, Form"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Input</h3>
          <div className="space-y-2">
            <Input placeholder="Enter text..." />
            <Input placeholder="Disabled" disabled />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Textarea</h3>
          <Textarea placeholder="Type your message here..." />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Label</h3>
          <div className="space-y-2">
            <Label htmlFor="demo-input">Email address</Label>
            <Input id="demo-input" type="email" placeholder="you@example.com" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Select</h3>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Combobox (Popover + Command)</h3>
          <Popover
            open={comboboxOpen}
            onOpenChange={(open) => {
              if (open) scrollBeforeOpen.current = window.scrollY;
              setComboboxOpen(open);
            }}
          >
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={comboboxOpen}>
                {comboboxValue
                  ? frameworks.find((f) => f.value === comboboxValue)?.label
                  : "Select framework..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search framework..." />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue: string) => {
                          setComboboxValue(currentValue === comboboxValue ? "" : currentValue);
                          setComboboxOpen(false);
                        }}
                      >
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Date Picker (Popover + Calendar)</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Input OTP</h3>
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Form (with validation)</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe" {...field} />
                    </FormControl>
                    <FormDescription>Your public display name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </GallerySection>
  );
}
