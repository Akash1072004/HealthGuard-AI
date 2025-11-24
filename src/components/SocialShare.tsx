import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Twitter, Linkedin, Facebook, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SocialShare = () => {
  const { toast } = useToast();
  const url = window.location.href;
  const title = "HealthGuard AI - Personalized Agentic AI for Predictive Healthcare";
  const description = "Revolutionary multi-agent system predicting hospital surges and delivering proactive healthcare advisories. Built at MumbaiHacks 2025.";

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}&hashtags=HealthTech,AI,MumbaiHacks2025`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "The page URL has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: string) => {
    window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-4xl mx-auto text-center animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Share HealthGuard AI</h2>
          <p className="text-lg text-muted-foreground">
            Help spread the word about the future of predictive healthcare
          </p>
        </div>
        
        <Card className="bg-gradient-card shadow-medium border-primary/20 max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Share2 className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Share on Social Media</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-2 border-primary/20 hover:bg-primary/10"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleShare('linkedin')}
                className="flex items-center gap-2 border-primary/20 hover:bg-primary/10"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleShare('facebook')}
                className="flex items-center gap-2 border-primary/20 hover:bg-primary/10"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="flex items-center gap-2 border-primary/20 hover:bg-primary/10"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground italic">
                "{description}"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SocialShare;