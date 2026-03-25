"use client";

import { toast } from "sonner";

import { GallerySection } from "@/components/gallery/GallerySection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function FeedbackSection() {
  return (
    <GallerySection
      id="feedback"
      title="Feedback"
      description="Alert, AlertDialog, Badge, Sonner toast, Spinner"
    >
      <div className="gallery-grid">
        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Alert</h3>
          <div className="gallery-stack">
            <Alert>
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                You can add components to your app using the cli.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Your session has expired. Please log in again.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">AlertDialog</h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Show Alert Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Badge variants</h3>
          <div className="gallery-row">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Toast (Sonner)</h3>
          <div className="gallery-row">
            <Button
              variant="outline"
              onClick={() => toast.success("Success toast!")}
            >
              Success toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.error("Error toast!")}
            >
              Error toast
            </Button>
          </div>
        </div>

        <div className="gallery-sample">
          <h3 className="gallery-sample-title">Spinner</h3>
          <div className="gallery-inline">
            <Spinner className="spinner--6" />
            <Spinner className="spinner--8" />
            <Button disabled>
              <Spinner className="spinner--btn" />
              Loading
            </Button>
          </div>
        </div>
      </div>
    </GallerySection>
  );
}
