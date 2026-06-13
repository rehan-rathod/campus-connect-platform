import { useCreateReview } from "@/lib/api";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ReviewsSectionProps {
  event: any;
}

export function ReviewsSection({ event }: ReviewsSectionProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const createReviewMutation = useCreateReview();

  const handleSubmitReview = () => {
    if (!comment.trim()) {
      toast({
        title: "Review Comment Required",
        description: "Please write a comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate(
      { eventId: event.id, rating, comment },
      {
        onSuccess: () => {
          toast({
            title: "Review Submitted",
            description: "Thank you for your feedback!",
          });
          setComment("");
          setRating(5);
          setIsOpen(false);
        },
        onError: (err: any) => {
          toast({
            title: "Failed to Submit Review",
            description: err.message || "Something went wrong.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const reviews = event.reviews || [];
  const avgRating = typeof event.avgRating === "number" ? event.avgRating : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Reviews & Ratings</h3>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="font-semibold">{avgRating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({reviews.length})</span>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" /> Leave a Review
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Your Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">Rating</Label>
              <RadioGroup value={rating.toString()} onValueChange={(v) => setRating(parseInt(v))}>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <div key={r} className="flex items-center space-x-2">
                      <RadioGroupItem value={r.toString()} id={`rating-${r}`} />
                      <Label htmlFor={`rating-${r}`} className="cursor-pointer flex gap-1">
                        {[...Array(r)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                placeholder="Share your thoughts about this event..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none"
              />
            </div>

            <Button onClick={handleSubmitReview} className="w-full" disabled={createReviewMutation.isPending}>
              {createReviewMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review: any) => {
            const reviewDate = review.createdAt ? new Date(review.createdAt) : new Date();
            return (
              <div key={review.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{review.userName ? review.userName.charAt(0) : "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{review.userName || "User"}</p>
                      <p className="text-xs text-muted-foreground">{reviewDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
