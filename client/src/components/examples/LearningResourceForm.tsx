import { LearningResourceForm } from '../LearningResourceForm';

export default function LearningResourceFormExample() {
  const mockResource = {
    id: "1",
    title: "재미있는 숫자 놀이",
    description: "1-10까지 숫자를 게임으로 배워보는 활동지입니다. 색칠하고 붙이며 자연스럽게 숫자에 친해질 수 있어요.",
    fileName: "number_game_worksheet.pdf",
    fileSize: 2048576, // 2MB
    fileType: "application/pdf",
    category: "어린이용",
    resourceType: "활동지",
    difficulty: "쉬움",
    ageGroup: "5-7세",
    downloadCount: 245,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return (
    <LearningResourceForm
      resource={mockResource}
      onSave={async (formData) => {
        console.log('학습 자료 저장:', formData);
      }}
      onCancel={() => console.log('취소됨')}
    />
  );
}