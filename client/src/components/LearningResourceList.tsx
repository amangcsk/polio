import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LearningResourceForm } from "./LearningResourceForm";
import { Plus, Edit, Trash2, Download, Play, FileText, Heart, Book, Baby, Users2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { LearningResource } from "@shared/schema";

interface LearningResourceListProps {
  showManagement?: boolean;
}

export function LearningResourceList({ showManagement = false }: LearningResourceListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<LearningResource | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 학습 자료 목록 조회
  const { data: resources = [], isLoading } = useQuery<LearningResource[]>({
    queryKey: ['/api/learning-resources'],
  });

  // 자료 생성 뮤테이션
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest('POST', '/api/learning-resources', formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning-resources'] });
      setShowForm(false);
    },
    onError: (error) => {
      console.error("학습 자료 생성 실패:", error);
    }
  });

  // 자료 수정 뮤테이션
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await apiRequest('PATCH', `/api/learning-resources/${id}`, formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning-resources'] });
      setEditingResource(null);
    },
    onError: (error) => {
      console.error("학습 자료 수정 실패:", error);
    }
  });

  // 자료 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest('DELETE', `/api/learning-resources/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/learning-resources'] });
    },
    onError: (error) => {
      console.error("학습 자료 삭제 실패:", error);
    }
  });

  // 다운로드 뮤테이션 (다운로드 수 증가)
  const downloadMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest('POST', `/api/learning-resources/${id}/download`),
    onSuccess: () => {
      // 다운로드 후 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['/api/learning-resources'] });
    },
    onError: (error) => {
      console.error("다운로드 처리 실패:", error);
    }
  });

  const handleCreateResource = async (formData: FormData) => {
    await createMutation.mutateAsync(formData);
  };

  const handleUpdateResource = async (formData: FormData) => {
    if (editingResource) {
      await updateMutation.mutateAsync({ id: editingResource.id, formData });
    }
  };

  const handleDeleteResource = async (resource: LearningResource) => {
    if (confirm(`"${resource.title}" 자료를 정말 삭제하시겠습니까?`)) {
      await deleteMutation.mutateAsync(resource.id);
      toast({
        title: "자료가 삭제되었습니다",
        description: "선택하신 자료가 성공적으로 삭제되었습니다.",
      });
    }
  };

  const handleDownload = async (resource: LearningResource) => {
    try {
      // 다운로드 수 증가
      await downloadMutation.mutateAsync(resource.id);
      
      // 실제 파일 다운로드
      const downloadResponse = await fetch(`/api/learning-resources/${resource.id}/file`);
      if (!downloadResponse.ok) {
        throw new Error('다운로드 실패');
      }
      
      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = resource.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "다운로드 시작",
        description: `${resource.title} 파일을 다운로드합니다.`,
      });
    } catch (error) {
      console.error("다운로드 실패:", error);
      toast({
        title: "다운로드 실패",
        description: "파일 다운로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "동영상":
        return Play;
      case "게임":
        return Heart;
      case "안내서":
        return Book;
      default:
        return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  // 카테고리별로 자료 분류
  const childResources = resources.filter(r => r.category === "어린이용" && r.isActive);
  const seniorResources = resources.filter(r => r.category === "어르신용" && r.isActive);
  
  // 관리 모드에서는 모든 자료 표시 (비활성 포함)
  const allResources = showManagement ? resources : resources.filter(r => r.isActive);

  const ResourceCard = ({ resource }: { resource: LearningResource }) => {
    const ResourceIcon = getResourceIcon(resource.resourceType);
    
    return (
      <Card className="p-6 hover-elevate" data-testid={`card-resource-${resource.id}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <ResourceIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-heading font-semibold text-xl text-foreground" data-testid={`text-resource-title-${resource.id}`}>
                {resource.title}
              </h3>
              {showManagement && (
                <div className="flex items-center gap-2 ml-4">
                  {resource.isActive ? (
                    <Badge variant="default" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      활성
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <EyeOff className="h-3 w-3 mr-1" />
                      비활성
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            <p className="text-muted-foreground mb-4 leading-relaxed" data-testid={`text-resource-desc-${resource.id}`}>
              {resource.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="text-sm">
                {resource.resourceType}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {resource.difficulty}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {resource.ageGroup}
              </Badge>
            </div>
            
            {/* 파일 정보 */}
            <div className="text-sm text-muted-foreground mb-4">
              <p>파일: {resource.fileName} ({formatFileSize(resource.fileSize)})</p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground" data-testid={`text-resource-downloads-${resource.id}`}>
                <Download className="h-4 w-4 inline mr-1" />
                {resource.downloadCount}회 다운로드
              </span>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleDownload(resource)}
                  data-testid={`button-download-${resource.id}`}
                  disabled={downloadMutation.isPending}
                >
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
                
                {showManagement && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingResource(resource)}
                      data-testid={`button-edit-resource-${resource.id}`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteResource(resource)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-resource-${resource.id}`}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      삭제
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // 폼이 표시되는 경우
  if (showForm || editingResource) {
    return (
      <LearningResourceForm
        resource={editingResource || undefined}
        onSave={editingResource ? handleUpdateResource : handleCreateResource}
        onCancel={() => {
          setShowForm(false);
          setEditingResource(null);
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-heading font-bold text-3xl text-foreground mb-2" data-testid="text-resources-title">
            {showManagement ? "학습 자료 관리" : "학습 자료 및 교육 팁"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {showManagement 
              ? "학습 자료를 업로드하고 관리해보세요."
              : "연령대별로 맞춤 제작된 학습 자료들을 무료로 제공합니다."
            }
          </p>
        </div>
        {showManagement && (
          <Button
            size="lg"
            onClick={() => setShowForm(true)}
            data-testid="button-create-resource"
            className="text-lg px-6 py-3 h-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            새 자료 추가
          </Button>
        )}
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">자료를 불러오는 중...</p>
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && allResources.length === 0 && (
        <Card className="p-12 text-center">
          <h3 className="font-heading font-semibold text-xl text-foreground mb-4" data-testid="text-empty-resources">
            아직 등록된 학습 자료가 없습니다
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            {showManagement ? "첫 번째 학습 자료를 추가해보세요!" : "곧 다양한 학습 자료를 제공할 예정입니다."}
          </p>
          {showManagement && (
            <Button
              size="lg"
              onClick={() => setShowForm(true)}
              data-testid="button-create-first-resource"
              className="text-lg px-8 py-4 h-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              첫 자료 추가하기
            </Button>
          )}
        </Card>
      )}

      {/* 자료 목록 */}
      {!isLoading && allResources.length > 0 && (
        <>
          {showManagement ? (
            // 관리 모드: 모든 자료를 하나의 목록으로 표시
            <div className="space-y-6">
              {allResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            // 일반 모드: 탭으로 연령대별 분류
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
                {childResources.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {childResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-lg text-muted-foreground">
                      어린이용 자료가 준비 중입니다.
                    </p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="seniors" className="space-y-6">
                {seniorResources.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {seniorResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-lg text-muted-foreground">
                      어르신용 자료가 준비 중입니다.
                    </p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </>
      )}

      {/* 추가 정보 (일반 모드에서만) */}
      {!showManagement && !isLoading && allResources.length > 0 && (
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
                }
              }}
              data-testid="button-custom-request"
              className="text-lg px-8 py-4 h-auto"
            >
              맞춤 자료 요청하기
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}