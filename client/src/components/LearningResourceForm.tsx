import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Save, FileText, Play, Heart, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { LearningResource, InsertLearningResource } from "@shared/schema";

interface LearningResourceFormProps {
  resource?: LearningResource;
  onSave: (resource: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function LearningResourceForm({ resource, onSave, onCancel, isLoading = false }: LearningResourceFormProps) {
  const [formData, setFormData] = useState({
    title: resource?.title || "",
    description: resource?.description || "",
    category: resource?.category || "어린이용",
    resourceType: resource?.resourceType || "활동지",
    difficulty: resource?.difficulty || "쉬움",
    ageGroup: resource?.ageGroup || "5-7세",
    isActive: resource?.isActive ?? true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "파일 크기 초과",
          description: "파일 크기는 10MB 이하여야 합니다.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    // 파일 입력 필드 초기화
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: "필수 입력 사항",
        description: "제목과 설명을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!resource && !selectedFile) {
      toast({
        title: "파일 선택 필요",
        description: "업로드할 파일을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('resourceType', formData.resourceType);
      formDataToSend.append('difficulty', formData.difficulty);
      formDataToSend.append('ageGroup', formData.ageGroup);
      formDataToSend.append('isActive', formData.isActive.toString());
      
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      await onSave(formDataToSend);
      
      toast({
        title: resource ? "자료가 수정되었습니다!" : "새 자료가 추가되었습니다!",
        description: "성공적으로 저장되었습니다.",
      });
    } catch (error) {
      console.error("학습 자료 저장 실패:", error);
      toast({
        title: "저장 실패",
        description: "자료를 저장하는 중 오류가 발생했습니다.",
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

  const ResourceIcon = getResourceIcon(formData.resourceType);

  return (
    <Card className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-2" data-testid="text-resource-form-title">
          {resource ? "학습 자료 수정" : "새로운 학습 자료 추가"}
        </h2>
        <p className="text-muted-foreground text-lg">
          학습자들이 사용할 교육 자료를 업로드하고 관리해주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 */}
        <div>
          <Label htmlFor="title" className="text-lg font-medium">제목 *</Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="mt-2 text-lg h-12"
            placeholder="학습 자료의 제목을 입력해주세요..."
            data-testid="input-resource-title"
            disabled={isLoading}
          />
        </div>

        {/* 설명 */}
        <div>
          <Label htmlFor="description" className="text-lg font-medium">설명 *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className="mt-2 text-lg resize-none"
            placeholder="자료에 대한 자세한 설명을 작성해주세요..."
            data-testid="textarea-resource-description"
            disabled={isLoading}
          />
        </div>

        {/* 카테고리와 자료 유형 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label className="text-lg font-medium">대상 연령대</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="mt-2 h-12 text-lg" data-testid="select-resource-category">
                <SelectValue placeholder="대상 연령대 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="어린이용">어린이용 (5-10세)</SelectItem>
                <SelectItem value="어르신용">어르신용 (50세+)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-lg font-medium">자료 유형</Label>
            <Select
              value={formData.resourceType}
              onValueChange={(value) => handleInputChange("resourceType", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="mt-2 h-12 text-lg" data-testid="select-resource-type">
                <SelectValue placeholder="자료 유형 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="활동지">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    활동지
                  </div>
                </SelectItem>
                <SelectItem value="동영상">
                  <div className="flex items-center">
                    <Play className="h-4 w-4 mr-2" />
                    동영상
                  </div>
                </SelectItem>
                <SelectItem value="게임">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    게임
                  </div>
                </SelectItem>
                <SelectItem value="안내서">
                  <div className="flex items-center">
                    <Book className="h-4 w-4 mr-2" />
                    안내서
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 난이도와 세부 연령대 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label className="text-lg font-medium">난이도</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleInputChange("difficulty", value)}
              disabled={isLoading}
            >
              <SelectTrigger className="mt-2 h-12 text-lg" data-testid="select-resource-difficulty">
                <SelectValue placeholder="난이도 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="쉬움">쉬움</SelectItem>
                <SelectItem value="보통">보통</SelectItem>
                <SelectItem value="어려움">어려움</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-lg font-medium">세부 연령대</Label>
            <Input
              type="text"
              value={formData.ageGroup}
              onChange={(e) => handleInputChange("ageGroup", e.target.value)}
              className="mt-2 text-lg h-12"
              placeholder="예: 5-7세, 60세+"
              data-testid="input-resource-age-group"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* 파일 업로드 */}
        <div>
          <Label className="text-lg font-medium">
            파일 {!resource && "*"}
          </Label>
          
          {/* 현재 파일 정보 (수정 시) */}
          {resource && (
            <div className="mt-2 p-4 bg-muted/30 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <ResourceIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{resource.fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {(resource.fileSize / 1024 / 1024).toFixed(2)} MB • {resource.fileType}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-2">
            {!selectedFile ? (
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer text-lg font-medium text-foreground hover:text-primary"
                  >
                    {resource ? "새 파일로 교체" : "파일을 선택하거나 드래그하세요"}
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif"
                    data-testid="input-file-upload"
                    disabled={isLoading}
                  />
                  <p className="text-muted-foreground mt-2">
                    PDF, Word, PowerPoint, 이미지, 동영상 파일 지원 (최대 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <ResourceIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  data-testid="button-remove-file"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            data-testid="button-save-resource"
            className="text-lg px-8 py-4 h-auto"
          >
            <Save className="h-5 w-5 mr-2" />
            {isLoading ? "저장 중..." : resource ? "수정 완료" : "자료 추가"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            disabled={isLoading}
            data-testid="button-cancel-resource"
            className="text-lg px-8 py-4 h-auto"
          >
            취소
          </Button>
        </div>
      </form>
    </Card>
  );
}