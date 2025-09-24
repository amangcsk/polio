import { Navigation } from "@/components/Navigation";
import { LearningResourceList } from "@/components/LearningResourceList";

export default function ResourceManagement() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <LearningResourceList showManagement={true} />
          </div>
        </section>
      </main>
      <footer className="bg-muted/20 border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground text-lg">
            © 2024 교육 포트폴리오. 학습 자료 관리 시스템
          </p>
        </div>
      </footer>
    </div>
  );
}