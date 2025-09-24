import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost, InsertBlogPost } from "@shared/schema";

interface BlogPostFormProps {
  post?: BlogPost;
  onSave: (post: InsertBlogPost) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BlogPostForm({ post, onSave, onCancel, isLoading = false }: BlogPostFormProps) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    summary: post?.summary || "",
    category: post?.category || "교육경험",
    tags: post?.tags || [],
    isPublished: post?.isPublished ?? true
  });
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    console.log(`${field} 필드 업데이트:`, value);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      const updatedTags = [...formData.tags, newTag.trim()];
      setFormData(prev => ({ ...prev, tags: updatedTags }));
      setNewTag("");
      console.log("태그 추가:", newTag.trim());
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = formData.tags.filter(tag => tag !== tagToRemove);
    setFormData(prev => ({ ...prev, tags: updatedTags }));
    console.log("태그 제거:", tagToRemove);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "필수 입력 사항",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave({
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.summary.trim() || null,
        category: formData.category,
        tags: formData.tags.length > 0 ? formData.tags : null,
        isPublished: formData.isPublished
      });
      
      console.log("블로그 글 저장 완료");
      toast({
        title: post ? "글이 수정되었습니다!" : "새 글이 작성되었습니다!",
        description: "성공적으로 저장되었습니다.",
      });
    } catch (error) {
      console.error("블로그 글 저장 실패:", error);
      toast({
        title: "저장 실패",
        description: "글을 저장하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-2" data-testid="text-blog-form-title">
          {post ? "경험/소개 수정" : "새로운 경험/소개 작성"}
        </h2>
        <p className="text-muted-foreground text-lg">
          학습자들과 공유하고 싶은 경험이나 이야기를 작성해주세요.
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
            placeholder="경험/소개의 제목을 입력해주세요..."
            data-testid="input-blog-title"
            disabled={isLoading}
          />
        </div>

        {/* 요약 */}
        <div>
          <Label htmlFor="summary" className="text-lg font-medium">요약 (선택사항)</Label>
          <Input
            id="summary"
            type="text"
            value={formData.summary}
            onChange={(e) => handleInputChange("summary", e.target.value)}
            className="mt-2 text-lg h-12"
            placeholder="간단한 요약을 입력해주세요..."
            data-testid="input-blog-summary"
            disabled={isLoading}
          />
        </div>

        {/* 카테고리 */}
        <div>
          <Label htmlFor="category" className="text-lg font-medium">카테고리</Label>
          <Input
            id="category"
            type="text"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="mt-2 text-lg h-12"
            placeholder="예: 교육경험, 학습팁, 성공사례"
            data-testid="input-blog-category"
            disabled={isLoading}
          />
        </div>

        {/* 태그 */}
        <div>
          <Label className="text-lg font-medium">태그</Label>
          <div className="mt-2 space-y-3">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 text-lg h-12"
                placeholder="태그를 입력하고 추가 버튼을 누르세요..."
                data-testid="input-blog-new-tag"
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={addTag}
                size="lg"
                variant="outline"
                data-testid="button-add-tag"
                disabled={isLoading}
                className="px-6 h-12"
              >
                <Plus className="h-5 w-5 mr-2" />
                추가
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-sm px-3 py-1"
                    data-testid={`badge-tag-${index}`}
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTag(tag)}
                      className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                      data-testid={`button-remove-tag-${index}`}
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 내용 */}
        <div>
          <Label htmlFor="content" className="text-lg font-medium">내용 *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            rows={12}
            className="mt-2 text-lg resize-none"
            placeholder="경험/소개의 자세한 내용을 작성해주세요..."
            data-testid="textarea-blog-content"
            disabled={isLoading}
          />
        </div>

        {/* 공개 설정 */}
        <div className="flex items-center gap-4">
          <Label className="text-lg font-medium">공개 설정:</Label>
          <Button
            type="button"
            variant={formData.isPublished ? "default" : "outline"}
            size="lg"
            onClick={() => handleInputChange("isPublished", !formData.isPublished)}
            data-testid="button-toggle-published"
            disabled={isLoading}
            className="px-6 py-3"
          >
            {formData.isPublished ? (
              <>
                <Eye className="h-5 w-5 mr-2" />
                공개
              </>
            ) : (
              <>
                <EyeOff className="h-5 w-5 mr-2" />
                비공개
              </>
            )}
          </Button>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            data-testid="button-save-blog"
            className="text-lg px-8 py-4 h-auto"
          >
            <Save className="h-5 w-5 mr-2" />
            {isLoading ? "저장 중..." : post ? "수정 완료" : "글 작성"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            disabled={isLoading}
            data-testid="button-cancel-blog"
            className="text-lg px-8 py-4 h-auto"
          >
            취소
          </Button>
        </div>
      </form>
    </Card>
  );
}