import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Star, Shuffle, Palette, Calculator, BookOpen, Trophy, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

type GameType = "number" | "color" | "word" | "memory";

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  type: GameType;
  difficulty: "쉬움" | "보통" | "어려움";
  isActive: boolean;
}

const games: Game[] = [
  {
    id: "number-game",
    title: "숫자 맞추기",
    description: "1부터 10까지 숫자를 순서대로 맞춰보세요!",
    icon: Calculator,
    type: "number",
    difficulty: "쉬움",
    isActive: true
  },
  {
    id: "color-game", 
    title: "색깔 찾기",
    description: "같은 색깔을 찾아 클릭해보세요!",
    icon: Palette,
    type: "color",
    difficulty: "쉬움", 
    isActive: true
  },
  {
    id: "word-game",
    title: "단어 배우기",
    description: "동물 이름을 배워보아요!",
    icon: BookOpen,
    type: "word",
    difficulty: "보통",
    isActive: true
  },
  {
    id: "memory-game",
    title: "기억력 게임",
    description: "카드를 뒤집어서 같은 그림을 찾아보세요!",
    icon: Star,
    type: "memory",
    difficulty: "보통",
    isActive: false
  }
];

// 숫자 맞추기 게임 컴포넌트
function NumberGame() {
  const [currentNumber, setCurrentNumber] = useState(1);
  const [shuffledNumbers, setShuffledNumbers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const initializeGame = () => {
    const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
    setShuffledNumbers(numbers.sort(() => Math.random() - 0.5));
    setCurrentNumber(1);
    setScore(0);
    setGameComplete(false);
  };

  const handleNumberClick = (number: number) => {
    if (number === currentNumber) {
      setScore(score + 10);
      if (currentNumber === 10) {
        setGameComplete(true);
      } else {
        setCurrentNumber(currentNumber + 1);
      }
    } else {
      setScore(Math.max(0, score - 5));
    }
  };

  if (shuffledNumbers.length === 0) {
    return (
      <div className="text-center p-8">
        <Calculator className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-4">숫자 맞추기 게임</h3>
        <p className="text-lg mb-6">1부터 10까지 순서대로 클릭해보세요!</p>
        <Button 
          size="lg" 
          onClick={initializeGame}
          data-testid="button-start-number-game"
          className="text-lg px-8 py-4"
        >
          게임 시작
        </Button>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="text-center p-8">
        <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
        <h3 className="text-2xl font-bold mb-4">축하합니다! 🎉</h3>
        <p className="text-lg mb-4">점수: {score}점</p>
        <Button 
          size="lg" 
          onClick={initializeGame}
          data-testid="button-restart-number-game"
          className="text-lg px-8 py-4"
        >
          다시 하기
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">숫자 {currentNumber}을(를) 찾아주세요!</h3>
        <p className="text-lg">점수: {score}점</p>
      </div>
      
      <div className="grid grid-cols-5 gap-4 max-w-md mx-auto">
        {shuffledNumbers.map((number) => (
          <Button
            key={number}
            size="lg"
            variant={number < currentNumber ? "secondary" : "outline"}
            onClick={() => handleNumberClick(number)}
            disabled={number < currentNumber}
            data-testid={`button-number-${number}`}
            className="h-16 w-16 text-xl font-bold"
          >
            {number}
          </Button>
        ))}
      </div>
    </div>
  );
}

// 색깔 찾기 게임 컴포넌트
function ColorGame() {
  const colors = [
    { name: "빨강", color: "bg-red-500", value: "red" },
    { name: "파랑", color: "bg-blue-500", value: "blue" },
    { name: "초록", color: "bg-green-500", value: "green" },
    { name: "노랑", color: "bg-yellow-500", value: "yellow" },
    { name: "보라", color: "bg-purple-500", value: "purple" },
    { name: "주황", color: "bg-orange-500", value: "orange" }
  ];

  const [targetColor, setTargetColor] = useState<typeof colors[0] | null>(null);
  const [shuffledColors, setShuffledColors] = useState<typeof colors>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  const initializeGame = () => {
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    setShuffledColors(shuffled);
    setTargetColor(shuffled[0]);
    setScore(0);
    setRound(1);
  };

  const handleColorClick = (selectedColor: typeof colors[0]) => {
    if (selectedColor.value === targetColor?.value) {
      setScore(score + 10);
      if (round < 5) {
        // 다음 라운드
        const newShuffled = [...colors].sort(() => Math.random() - 0.5);
        setShuffledColors(newShuffled);
        setTargetColor(newShuffled[0]);
        setRound(round + 1);
      } else {
        // 게임 완료
        setTargetColor(null);
      }
    } else {
      setScore(Math.max(0, score - 5));
    }
  };

  if (!targetColor && round === 0) {
    return (
      <div className="text-center p-8">
        <Palette className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-bold mb-4">색깔 찾기 게임</h3>
        <p className="text-lg mb-6">말하는 색깔을 찾아 클릭해보세요!</p>
        <Button 
          size="lg" 
          onClick={initializeGame}
          data-testid="button-start-color-game"
          className="text-lg px-8 py-4"
        >
          게임 시작
        </Button>
      </div>
    );
  }

  if (!targetColor && round > 0) {
    return (
      <div className="text-center p-8">
        <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
        <h3 className="text-2xl font-bold mb-4">훌륭해요! 🎨</h3>
        <p className="text-lg mb-4">최종 점수: {score}점</p>
        <Button 
          size="lg" 
          onClick={initializeGame}
          data-testid="button-restart-color-game"
          className="text-lg px-8 py-4"
        >
          다시 하기
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">
          <span className="text-3xl">{targetColor?.name}</span> 색을 찾아주세요!
        </h3>
        <p className="text-lg">라운드: {round}/5 | 점수: {score}점</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {shuffledColors.slice(0, 6).map((color, index) => (
          <Button
            key={`${color.value}-${index}`}
            size="lg"
            variant="outline"
            onClick={() => handleColorClick(color)}
            data-testid={`button-color-${color.value}`}
            className="h-20 border-2 hover:border-primary"
          >
            <div className={`w-12 h-12 rounded-full ${color.color} border-2 border-white shadow-md`} />
          </Button>
        ))}
      </div>
    </div>
  );
}

// 단어 배우기 게임 컴포넌트  
function WordGame() {
  const animals = [
    { name: "강아지", emoji: "🐶", sound: "멍멍" },
    { name: "고양이", emoji: "🐱", sound: "야옹" },
    { name: "토끼", emoji: "🐰", sound: "깡총깡총" },
    { name: "코끼리", emoji: "🐘", sound: "뿌우우" },
    { name: "사자", emoji: "🦁", sound: "어흥" },
    { name: "원숭이", emoji: "🐵", sound: "끼끼" }
  ];

  const [currentAnimal, setCurrentAnimal] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const nextAnimal = () => {
    setShowAnswer(false);
    setCurrentAnimal((prev) => (prev + 1) % animals.length);
  };

  const prevAnimal = () => {
    setShowAnswer(false);
    setCurrentAnimal((prev) => (prev - 1 + animals.length) % animals.length);
  };

  const animal = animals[currentAnimal];

  return (
    <div className="text-center p-8">
      <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
      <h3 className="text-2xl font-bold mb-6">동물 이름 배우기</h3>
      
      <div className="mb-8">
        <div className="text-8xl mb-4">{animal.emoji}</div>
        <div className="text-2xl font-bold mb-2">
          {showAnswer ? animal.name : "?"}
        </div>
        <div className="text-lg text-muted-foreground">
          "{animal.sound}"
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
        <Button
          size="lg"
          variant="outline"
          onClick={prevAnimal}
          data-testid="button-prev-animal"
          className="text-lg px-6 py-3"
        >
          이전 동물
        </Button>
        
        <Button
          size="lg"
          onClick={() => setShowAnswer(!showAnswer)}
          data-testid="button-show-answer"
          className="text-lg px-6 py-3"
        >
          {showAnswer ? "숨기기" : "답 보기"}
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          onClick={nextAnimal}
          data-testid="button-next-animal"
          className="text-lg px-6 py-3"
        >
          다음 동물
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {currentAnimal + 1} / {animals.length}
      </p>
    </div>
  );
}

export default function Playground() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const renderGame = () => {
    if (!selectedGame) return null;

    switch (selectedGame.type) {
      case "number":
        return <NumberGame />;
      case "color":
        return <ColorGame />;
      case "word":
        return <WordGame />;
      default:
        return (
          <div className="text-center p-8">
            <p className="text-lg">이 게임은 준비 중입니다! 🚧</p>
          </div>
        );
    }
  };

  if (selectedGame) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedGame(null)}
              data-testid="button-back-to-games"
              className="text-lg px-6 py-3"
            >
              ← 게임 목록으로
            </Button>
          </div>
          
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl flex items-center justify-center gap-3">
                <selectedGame.icon className="h-8 w-8" />
                {selectedGame.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderGame()}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-6">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            data-testid="button-back-to-home"
            className="bg-background/80 hover:bg-primary hover:text-primary-foreground transform transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg active:scale-95 border border-border hover:border-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            홈으로
          </Button>
        </Link>
      </div>
      
      <div className="text-center mb-12">
        <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-heading font-bold mb-4" data-testid="text-playground-title">
          교육 놀이터 🎮
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          재미있는 게임으로 공부해보아요! 어린이부터 어른까지 모두 즐길 수 있는 교육 게임들이 준비되어 있어요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {games.map((game) => (
          <Card 
            key={game.id} 
            className={`transition-all duration-200 hover-elevate ${!game.isActive ? 'opacity-50' : 'cursor-pointer'}`}
            onClick={() => game.isActive && setSelectedGame(game)}
            data-testid={`card-game-${game.id}`}
          >
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-2">
                <game.icon className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">{game.title}</CardTitle>
              <div className="flex justify-center gap-2 mt-2">
                <Badge 
                  variant={
                    game.difficulty === "쉬움" ? "default" : 
                    game.difficulty === "보통" ? "secondary" : "destructive"
                  }
                >
                  {game.difficulty}
                </Badge>
                {!game.isActive && (
                  <Badge variant="outline">준비중</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-lg">
                {game.description}
              </CardDescription>
              {game.isActive && (
                <div className="text-center mt-4">
                  <Button 
                    size="lg"
                    className="w-full text-lg py-3"
                    data-testid={`button-play-${game.id}`}
                  >
                    게임 시작하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-lg text-muted-foreground">
          더 많은 게임이 곧 추가될 예정이에요! 🎯
        </p>
      </div>
    </div>
  );
}