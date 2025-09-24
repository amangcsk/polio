import { BlogPostForm } from '../BlogPostForm';

export default function BlogPostFormExample() {
  const mockPost = {
    id: "1",
    title: "즐거운 수학 시간 만들기",
    content: "아이들이 수학을 재미있어하도록 게임과 놀이를 활용한 교육 방법을 소개합니다. 구체적인 활동 사례와 효과적인 지도 방법을 공유합니다.",
    summary: "게임을 활용한 수학 교육 방법",
    category: "교육경험",
    tags: ["수학교육", "놀이학습", "초등교육"],
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return (
    <BlogPostForm
      post={mockPost}
      onSave={async (data) => {
        console.log('블로그 글 저장:', data);
      }}
      onCancel={() => console.log('취소됨')}
    />
  );
}