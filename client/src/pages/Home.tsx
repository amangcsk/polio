import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { BlogPostList } from "@/components/BlogPostList";
import { LearningResourceList } from "@/components/LearningResourceList";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <section id="경험" className="py-20 bg-muted/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <BlogPostList />
          </div>
        </section>
        <section id="자료" className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <LearningResourceList />
          </div>
        </section>
        <ContactSection />
      </main>
      <footer className="bg-muted/20 border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground text-lg">
            © 2024 놀이 포트폴리오. 모든 연령을 위한 놀이의 즐거움을 전합니다.
          </p>
        </div>
      </footer>
    </div>
  );
}