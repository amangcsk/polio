import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Baby, Users2, Download, Play, FileText, Heart } from "lucide-react";

export function LearningResources() {
  // todo: remove mock functionality - replace with real data
  const childResources = [
    {
      id: 1,
      title: "재미있는 숫자 놀이",
      description: "1-10까지 숫자를 게임으로 배워보는 활동지입니다. 색칠하고 붙이며 자연스럽게 숫자에 친해질 수 있어요.",
      type: "활동지",
      difficulty: "쉬움",
      ageGroup: "5-7세",
      icon: FileText,
      downloads: 245
    },
    {
      id: 2,
      title: "한글 따라쓰기 동영상",
      description: "선생님과 함께 한글을 천천히 따라 써보는 영상입니다. 큰 글씨로 보기 쉽게 제작했어요.",
      type: "동영상",
      difficulty: "쉬움",
      ageGroup: "6-8세",
      icon: Play,
      downloads: 189
    },
    {
      id: 3,
      title: "동물 이름 카드게임",
      description: "귀여운 동물들의 이름을 배우고 기억력도 키울 수 있는 카드게임 세트입니다.",
      type: "게임",
      difficulty: "보통",
      ageGroup: "4-9세",
      icon: Heart,
      downloads: 312
    }
  ];

  const seniorResources = [
    {
      id: 4,
      title: "스마트폰 기초 사용법",
      description: "전화걸기, 문자보내기, 카메라 사용하기 등 기본 기능을 천천히 알려드립니다.",
      type: "안내서",
      difficulty: "쉬움",
      ageGroup: "60세+",
      icon: FileText,
      downloads: 456
    },
    {
      id: 5,
      title: "인터넷 검색하는 방법",
      description: "네이버, 구글에서 원하는 정보를 쉽게 찾는 방법을 단계별로 설명드립니다.",
      type: "동영상",
      difficulty: "쉬움",
      ageGroup: "50세+",
      icon: Play,
      downloads: 378
    },
    {
      id: 6,
      title: "온라인 쇼핑 안전 가이드",
      description: "인터넷으로 안전하게 쇼핑하는 방법과 주의사항을 알려드립니다.",
      type: "안내서",
      difficulty: "보통",
      ageGroup: "55세+",
      icon: FileText,
      downloads: 234
    }
  ];

  const handleDownload = (resource: any) => {
    console.log(`${resource.title} 다운로드 시작`);
    // todo: remove mock functionality - implement real download
  };

  const ResourceCard = ({ resource }: { resource: any }) => (
    <Card className="p-6 hover-elevate" data-testid={`card-resource-${resource.id}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <resource.icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-xl text-foreground mb-2" data-testid={`text-resource-title-${resource.id}`}>
            {resource.title}
          </h3>
          <p className="text-muted-foreground mb-4 leading-relaxed" data-testid={`text-resource-desc-${resource.id}`}>
            {resource.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="text-sm">
              {resource.type}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {resource.difficulty}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {resource.ageGroup}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground" data-testid={`text-resource-downloads-${resource.id}`}>
              <Download className="h-4 w-4 inline mr-1" />
              {resource.downloads}회 다운로드
            </span>
            <Button 
              size="sm" 
              onClick={() => handleDownload(resource)}
              data-testid={`button-download-${resource.id}`}
              className="px-4 py-2"
            >
              <Download className="h-4 w-4 mr-2" />
              다운로드
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <section id="자료" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6" data-testid="text-resources-title">
            학습 자료 및 교육 팁
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-resources-subtitle">
            연령대별로 맞춤 제작된 학습 자료들을 무료로 제공합니다.
          </p>
        </div>

        <Tabs defaultValue="children" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-16">
            <TabsTrigger 
              value="children" 
              className="text-lg px-6 py-4 h-full"
              data-testid="tab-children"
            >
              <Baby className="h-5 w-5 mr-2" />
              어린이용 (5-10세)
            </TabsTrigger>
            <TabsTrigger 
              value="seniors" 
              className="text-lg px-6 py-4 h-full"
              data-testid="tab-seniors"
            >
              <Users2 className="h-5 w-5 mr-2" />
              어르신용 (50세+)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="children" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {childResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="seniors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {seniorResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 추가 정보 */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-secondary/5 border-secondary/20">
            <h3 className="font-heading font-semibold text-2xl text-foreground mb-4" data-testid="text-resources-info-title">
              더 많은 자료가 필요하신가요?
            </h3>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              개별 맞춤 자료 제작이나 특별한 요청사항이 있으시면 언제든 연락 주세요. 
              모든 학습자가 즐겁게 배울 수 있도록 도와드리겠습니다.
            </p>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => {
                const element = document.getElementById("연락");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  console.log("연락하기 섹션으로 이동");
                }
              }}
              data-testid="button-custom-request"
              className="text-lg px-8 py-4 h-auto"
            >
              맞춤 자료 요청하기
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}