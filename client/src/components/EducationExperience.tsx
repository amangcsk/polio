import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar, MapPin, Star } from "lucide-react";

export function EducationExperience() {
  // todo: remove mock functionality - replace with real data
  const experiences = [
    {
      id: 1,
      title: "초등학교 교사",
      organization: "서울 행복초등학교",
      period: "2015 - 현재",
      location: "서울, 대한민국",
      description: "1-6학년 담임을 맡으며 창의적이고 재미있는 교육 방법을 개발했습니다. 특히 어려운 개념을 쉽게 설명하는 것을 전문으로 합니다.",
      highlights: ["우수교사상 수상", "창의교육 프로그램 개발", "학부모 만족도 95%"],
      color: "primary"
    },
    {
      id: 2,
      title: "시니어 교육 강사",
      organization: "지역 평생학습센터",
      period: "2018 - 현재",
      location: "서울, 대한민국",
      description: "50세 이상 어르신들을 대상으로 컴퓨터, 스마트폰 사용법을 가르치며 디지털 격차 해소에 기여하고 있습니다.",
      highlights: ["디지털 문해 교육", "1:1 맞춤 지도", "500명+ 수강생"],
      color: "secondary"
    },
    {
      id: 3,
      title: "교육학 석사",
      organization: "서울대학교 교육대학원",
      period: "2013 - 2015",
      location: "서울, 대한민국",
      description: "초등교육 전공으로 아동 발달과 학습 심리학을 깊이 연구했습니다. 연령별 최적화된 교육 방법론을 학습했습니다.",
      highlights: ["우등 졸업", "논문: '놀이를 통한 학습법'", "교육 심리학 전문"],
      color: "primary"
    }
  ];

  return (
    <section id="경험" className="py-20 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6" data-testid="text-experience-title">
            경험과 소개
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-experience-subtitle">
            다양한 연령대의 학습자들과 함께한 소중한 경험들을 소개합니다.
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={exp.id} className={`p-8 hover-elevate ${index % 2 === 1 ? 'lg:ml-8' : 'lg:mr-8'}`} data-testid={`card-experience-${exp.id}`}>
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* 아이콘과 날짜 */}
                <div className="flex-shrink-0">
                  <div className={`h-16 w-16 rounded-full ${exp.color === 'primary' ? 'bg-primary' : 'bg-secondary'} flex items-center justify-center mb-4`}>
                    <GraduationCap className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-base font-medium">{exp.period}</span>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-base">{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* 내용 */}
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-2xl text-foreground mb-2" data-testid={`text-experience-title-${exp.id}`}>
                    {exp.title}
                  </h3>
                  <h4 className="font-semibold text-xl text-primary mb-4" data-testid={`text-experience-org-${exp.id}`}>
                    {exp.organization}
                  </h4>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6" data-testid={`text-experience-desc-${exp.id}`}>
                    {exp.description}
                  </p>
                  
                  {/* 하이라이트 */}
                  <div className="flex flex-wrap gap-2">
                    {exp.highlights.map((highlight, idx) => (
                      <Badge 
                        key={idx} 
                        variant={exp.color === 'primary' ? 'default' : 'secondary'}
                        className="text-sm px-3 py-1"
                        data-testid={`badge-highlight-${exp.id}-${idx}`}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}