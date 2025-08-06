import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Welcome to Next.js + ShadCN
          </h1>
          <p className="text-muted-foreground text-lg">
            A modern, beautiful, and accessible component library
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <Button className="w-full" size="lg">
              Primary Button
            </Button>
            
            <Button variant="secondary" className="w-full">
              Secondary Button
            </Button>
            
            <Button variant="outline" className="w-full">
              Outline Button
            </Button>
            
            <Button variant="ghost" className="w-full">
              Ghost Button
            </Button>
            
            <Button variant="destructive" className="w-full">
              Destructive Button
            </Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Built with Next.js 15, TypeScript, Tailwind CSS, and ShadCN UI
          </p>
        </div>
      </div>
    </div>
  );
}
