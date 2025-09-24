import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlogPostForm } from "./BlogPostForm";
import { Plus, Edit, Trash2, Calendar, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { BlogPost, InsertBlogPost } from "@shared/schema";

export function BlogPostList() {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // 블로그 글 목록 조회
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
    // 기본 fetcher가 이미 설정되어 있음
  });

  // 블로그 글 생성 뮤테이션
  const createMutation = useMutation({
    mutationFn: async (postData: InsertBlogPost) => {
      const response = await apiRequest('POST', '/api/blog-posts', postData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setShowForm(false);
      console.log("블로그 글 생성 성공");
    },
    onError: (error) => {
      console.error("블로그 글 생성 실패:", error);
    }
  });

  // 블로그 글 수정 뮤테이션
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertBlogPost> }) => {
      const response = await apiRequest('PATCH', `/api/blog-posts/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      setEditingPost(null);
      console.log("블로그 글 수정 성공");
    },
    onError: (error) => {
      console.error("블로그 글 수정 실패:", error);
    }
  });

  // 블로그 글 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest('DELETE', `/api/blog-posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog-posts'] });
      console.log("블로그 글 삭제 성공");
    },
    onError: (error) => {
      console.error("블로그 글 삭제 실패:", error);
    }
  });

  const handleCreatePost = async (postData: InsertBlogPost) => {
    await createMutation.mutateAsync(postData);
  };

  const handleUpdatePost = async (postData: InsertBlogPost) => {
    if (editingPost) {
      await updateMutation.mutateAsync({ id: editingPost.id, data: postData });
    }
  };

  const handleDeletePost = async (post: BlogPost) => {
    if (confirm(`"${post.title}" 글을 정말 삭제하시겠습니까?`)) {
      await deleteMutation.mutateAsync(post.id);
      toast({
        title: "글이 삭제되었습니다",
        description: "선택하신 글이 성공적으로 삭제되었습니다.",
      });
    }
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 폼이 표시되는 경우
  if (showForm || editingPost) {
    return (
      <BlogPostForm
        post={editingPost || undefined}
        onSave={editingPost ? handleUpdatePost : handleCreatePost}
        onCancel={() => {
          setShowForm(false);
          setEditingPost(null);
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
          <h2 className="font-heading font-bold text-3xl text-foreground mb-2" data-testid="text-blog-list-title">
            경험/소개 블로그
          </h2>
          <p className="text-lg text-muted-foreground">
            다양한 경험과 학습 여정을 공유합니다.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => setShowForm(true)}
          data-testid="button-create-blog"
          className="text-lg px-6 py-3 h-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          새 글 작성
        </Button>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">글을 불러오는 중...</p>
        </div>
      )}

      {/* 빈 상태 */}
      {!isLoading && posts.length === 0 && (
        <Card className="p-12 text-center">
          <h3 className="font-heading font-semibold text-xl text-foreground mb-4" data-testid="text-empty-state">
            아직 작성된 글이 없습니다
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            첫 번째 경험을 공유해보세요!
          </p>
          <Button
            size="lg"
            onClick={() => setShowForm(true)}
            data-testid="button-create-first-blog"
            className="text-lg px-8 py-4 h-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
            첫 글 작성하기
          </Button>
        </Card>
      )}

      {/* 블로그 글 목록 */}
      {!isLoading && posts.length > 0 && (
        <div className="space-y-6">
          {posts.map((post: BlogPost) => (
            <Card key={post.id} className="p-6 hover-elevate" data-testid={`card-blog-${post.id}`}>
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* 메인 콘텐츠 */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-xl text-foreground mb-2" data-testid={`text-blog-title-${post.id}`}>
                        {post.title}
                      </h3>
                      {post.summary && (
                        <p className="text-lg text-muted-foreground mb-3" data-testid={`text-blog-summary-${post.id}`}>
                          {post.summary}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {post.isPublished ? (
                        <Badge variant="default" className="text-sm">
                          <Eye className="h-3 w-3 mr-1" />
                          공개
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-sm">
                          <EyeOff className="h-3 w-3 mr-1" />
                          비공개
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* 내용 미리보기 */}
                  <p className="text-muted-foreground leading-relaxed mb-4" data-testid={`text-blog-preview-${post.id}`}>
                    {post.content.length > 200 
                      ? `${post.content.substring(0, 200)}...`
                      : post.content
                    }
                  </p>

                  {/* 메타 정보 */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span data-testid={`text-blog-date-${post.id}`}>
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {post.category}
                    </Badge>
                  </div>

                  {/* 태그 */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, idx) => (
                        <Badge 
                          key={idx} 
                          variant="secondary" 
                          className="text-sm px-2 py-1"
                          data-testid={`badge-blog-tag-${post.id}-${idx}`}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* 액션 버튼들 */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPost(post)}
                      data-testid={`button-edit-blog-${post.id}`}
                      className="px-4 py-2"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePost(post)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-blog-${post.id}`}
                      className="px-4 py-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      삭제
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}