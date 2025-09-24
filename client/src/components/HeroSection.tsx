import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Users, Award } from "lucide-react";

export function HeroSection() {
  const scrollToResources = () => {
    const element = document.getElementById("자료");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      console.log("학습 자료 섹션으로 이동");
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("연락");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      console.log("연락하기 섹션으로 이동");
    }
  };

  return (
    <section id="소개" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/5 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          {/* 프로필 이미지 */}
          <div className="flex justify-center">
            <div className="h-40 w-40 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <BookOpen className="h-20 w-20 text-primary-foreground" />
            </div>
          </div>

          {/* 메인 제목 */}
          <div className="space-y-4">
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight" data-testid="text-hero-title">
              모든 연령을 위한
              <br />
              <span className="text-primary">교육의 즐거움</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-subtitle">
              어린이부터 어르신까지, 모든 분들이 쉽고 재미있게 배울 수 있는 
              교육 자료와 경험을 나누어드립니다.
            </p>
          </div>

          {/* 통계 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <Card className="p-6 text-center hover-elevate" data-testid="card-stat-experience">
              <div className="flex justify-center mb-4">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">15년+</h3>
              <p className="text-lg text-muted-foreground">경험/소개</p>
            </Card>

            <Card className="p-6 text-center hover-elevate" data-testid="card-stat-students">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-secondary" />
              </div>
              <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">1,000명+</h3>
              <p className="text-lg text-muted-foreground">학습자들</p>
            </Card>

            <Card className="p-6 text-center hover-elevate" data-testid="card-stat-awards">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-2xl text-foreground mb-2">다수</h3>
              <p className="text-lg text-muted-foreground">교육 상 수상</p>
            </Card>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button 
              size="lg" 
              onClick={scrollToResources}
              data-testid="button-hero-resources"
              className="text-lg px-8 py-4 h-auto"
            >
              <BookOpen className="h-6 w-6 mr-2" />
              학습 자료 보기
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={scrollToContact}
              data-testid="button-hero-contact"
              className="text-lg px-8 py-4 h-auto"
            >
              연락하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}