"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  AlertCircle,
  Camera,
  FileText,
  Lightbulb,
  Loader2,
  MapPin,
  Paintbrush2,
  Shield,
  Tag,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, ElementRef } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { submitReport } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  location: z
    .string()
    .min(10, { message: "Please provide a specific address or intersection." }),
  category: z.string({ required_error: "Please select a category." }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters." })
    .max(500, { message: "Description must be 500 characters or less." }),
  image: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || (files?.[0]?.size <= 5_000_000),
      `Max file size is 5MB.`
    ),
});

const categories = [
  { value: "road_damage", label: "Road Damage", icon: TriangleAlert },
  { value: "vandalism", label: "Vandalism", icon: Paintbrush2 },
  { value: "public_safety", label: "Public Safety", icon: Shield },
  { value: "garbage", label: "Garbage & Waste", icon: Trash2 },
  { value: "lighting", label: "Street Lighting", icon: Lightbulb },
  { value: "other", label: "Other", icon: AlertCircle },
];

export function ReportForm() {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<ElementRef<"input">>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    const formData = new FormData();
    formData.append("location", values.location);
    formData.append("category", values.category);
    formData.append("description", values.description);
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }

    try {
      await submitReport(formData);
    } catch (error) {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        throw error;
      }
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "An unexpected error occurred. Please try again.",
      });
      setIsPending(false);
    }
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <Card className="w-full shadow-md">
      <CardContent className="p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 123 Main St, or corner of Oak & Pine"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be as specific as possible to ensure a quick response.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <Tag className="h-5 w-5 text-primary" />
                    Incident Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <cat.icon className="h-4 w-4 text-muted-foreground" />
                            <span>{cat.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-primary" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about the issue..."
                      className="resize-y min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base">
                    <Camera className="h-5 w-5 text-primary" />
                    Supporting Image (Optional)
                  </FormLabel>
                  <FormControl>
                    <>
                      {imagePreview ? (
                        <div className="relative w-full h-48 rounded-md overflow-hidden border">
                          <Image
                            src={imagePreview}
                            alt="Image preview"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={() => {
                              setImagePreview(null);
                              field.onChange(undefined);
                              if (imageInputRef.current)
                                imageInputRef.current.value = "";
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-center w-full"
                          onClick={() => imageInputRef.current?.click()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              imageInputRef.current?.click();
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-label="Upload an image"
                        >
                          <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG or GIF (MAX. 5MB)
                              </p>
                            </div>
                            <Input
                              ref={imageInputRef}
                              type="file"
                              className="hidden"
                              accept="image/png, image/jpeg, image/gif"
                              onChange={(e) => {
                                field.onChange(e.target.files ?? undefined);
                                handleImageChange(e);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
