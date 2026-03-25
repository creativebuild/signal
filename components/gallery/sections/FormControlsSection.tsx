"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
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

/** cmdk calls scrollIntoView on items; that can scroll the window. No-op inside our popover. */
let galleryComboboxScrollGuardDepth = 0;
let galleryComboboxSavedScrollIntoView: typeof Element.prototype.scrollIntoView | null =
  null;

function installGalleryComboboxScrollGuard() {
  if (galleryComboboxScrollGuardDepth === 0) {
    galleryComboboxSavedScrollIntoView = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function (
      this: Element,
      ...args: Parameters<Element["scrollIntoView"]>
    ) {
      if (this.closest("[data-gallery-combobox-no-document-scroll]")) {
        return;
      }
      return galleryComboboxSavedScrollIntoView!.apply(this, args);
    };
  }
  galleryComboboxScrollGuardDepth += 1;
}

function removeGalleryComboboxScrollGuard() {
  galleryComboboxScrollGuardDepth = Math.max(0, galleryComboboxScrollGuardDepth - 1);
  if (
    galleryComboboxScrollGuardDepth === 0 &&
    galleryComboboxSavedScrollIntoView != null
  ) {
    Element.prototype.scrollIntoView = galleryComboboxSavedScrollIntoView;
    galleryComboboxSavedScrollIntoView = null;
  }
}

export function FormControlsSection() {
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [comboboxValue, setComboboxValue] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const comboboxInputRef = useRef<HTMLInputElement>(null);

  const handleComboboxOpenChange = useCallback((open: boolean) => {
    if (open) {
      // Must run before React commits cmdk (same tick), or first scrollIntoView wins.
      installGalleryComboboxScrollGuard();
    } else {
      removeGalleryComboboxScrollGuard();
    }
    setComboboxOpen(open);
  }, []);

  useLayoutEffect(() => {
    if (!comboboxOpen) return;
    const id = requestAnimationFrame(() => {
      comboboxInputRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [comboboxOpen]);

  useEffect(() => {
    return () => {
      while (galleryComboboxScrollGuardDepth > 0) {
        removeGalleryComboboxScrollGuard();
      }
    };
  }, []);

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
      <div className="gallery-grid">
        <div className="gallery-stack-loose">
          <h3 className="gallery-sample-title">Input</h3>
          <div className="gallery-stack">
            <Input placeholder="Enter text..." />
            <Input placeholder="Disabled" disabled />
          </div>
        </div>

        <div className="gallery-stack-loose">
          <h3 className="gallery-sample-title">Textarea</h3>
          <Textarea placeholder="Type your message here..." />
        </div>

        <div className="gallery-stack-loose">
          <h3 className="gallery-sample-title">Label</h3>
          <div className="gallery-stack">
            <Label htmlFor="demo-input">Email address</Label>
            <Input id="demo-input" type="email" placeholder="you@example.com" />
          </div>
        </div>

        <div className="gallery-stack-loose">
          <h3 className="gallery-sample-title">Select</h3>
          <Select>
            <SelectTrigger className="select-trigger--full">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="gallery-stack-loose">
          <h3 className="gallery-sample-title">Combobox (Popover + Command)</h3>
          <Popover
            modal={false}
            open={comboboxOpen}
            onOpenChange={handleComboboxOpenChange}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={comboboxOpen}
              >
                {comboboxValue
                  ? frameworks.find((f) => f.value === comboboxValue)?.label
                  : "Select framework..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              variant="command"
              className="gallery-popover-combobox-width"
              align="start"
              initialFocus={false}
              data-gallery-combobox-no-document-scroll=""
            >
              <Command>
                <CommandInput
                  ref={comboboxInputRef}
                  placeholder="Search framework..."
                />
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

        <div className="gallery-stack-loose">
          <h3 className="gallery-sample-title">Date Picker (Popover + Calendar)</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent variant="flush" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="gallery-stack-loose">
          <h3 className="gallery-sample-title">Input OTP</h3>
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

        <div className="gallery-stack-loose">
          <h3 className="gallery-sample-title">Form (with validation)</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})} className="gallery-form">
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
