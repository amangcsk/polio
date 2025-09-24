import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Book, User, Heart, MessageCircle, Settings, Gamepad2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useLocation } from "wouter";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const isHomePage = location === "/";

  const menuItems = [
    { id: "소개", icon: User, label: "소개" },
    { id: "경험", icon: Book, label: "경험/소개" },
    { id: "자료", icon: Heart, label: "학습 자료" },
    { id: "연락", icon: MessageCircle, label: "연락하기" },
  ];

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center">
            <Book className="h-8 w-8 text-primary mr-3" />
            <span className="font-heading font-bold text-xl text-foreground hover:text-primary transition-colors" data-testid="text-logo">
              교육 포트폴리오
            </span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-2">
            {isHomePage ? (
              // 홈페이지에서는 섹션 스크롤
              menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="lg"
                  onClick={() => scrollToSection(item.id)}
                  data-testid={`button-nav-${item.id}`}
                  className="text-base px-6 py-3 h-auto"
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.label}
                </Button>
              ))
            ) : (
              // 다른 페이지에서는 홈으로 이동
              <Link href="/">
                <Button
                  variant="ghost"
                  size="lg"
                  data-testid="button-nav-home"
                  className="text-base px-6 py-3 h-auto"
                >
                  <User className="h-5 w-5 mr-2" />
                  홈으로
                </Button>
              </Link>
            )}
            
            {/* 놀이터 링크 */}
            <Link href="/playground">
              <Button
                variant={location === "/playground" ? "default" : "outline"}
                size="lg"
                data-testid="button-nav-playground"
                className="text-base px-6 py-3 h-auto"
              >
                <Gamepad2 className="h-5 w-5 mr-2" />
                놀이터
              </Button>
            </Link>
            
            {/* 관리자 링크 */}
            <Link href="/admin/resources">
              <Button
                variant={location === "/admin/resources" ? "default" : "outline"}
                size="lg"
                data-testid="button-nav-admin"
                className="text-base px-6 py-3 h-auto"
              >
                <Settings className="h-5 w-5 mr-2" />
                자료 관리
              </Button>
            </Link>
            
            <ThemeToggle />
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
              className="ml-2 h-10 w-10"
              aria-label="메뉴 열기"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isHomePage ? (
                // 홈페이지에서는 섹션 스크롤
                menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="lg"
                    onClick={() => scrollToSection(item.id)}
                    data-testid={`button-mobile-nav-${item.id}`}
                    className="w-full justify-start text-lg px-6 py-4 h-auto"
                  >
                    <item.icon className="h-6 w-6 mr-3" />
                    {item.label}
                  </Button>
                ))
              ) : (
                // 다른 페이지에서는 홈으로 이동
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => setIsMenuOpen(false)}
                    data-testid="button-mobile-nav-home"
                    className="w-full justify-start text-lg px-6 py-4 h-auto"
                  >
                    <User className="h-6 w-6 mr-3" />
                    홈으로
                  </Button>
                </Link>
              )}
              
              {/* 놀이터 링크 */}
              <Link href="/playground">
                <Button
                  variant={location === "/playground" ? "default" : "ghost"}
                  size="lg"
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="button-mobile-nav-playground"
                  className="w-full justify-start text-lg px-6 py-4 h-auto"
                >
                  <Gamepad2 className="h-6 w-6 mr-3" />
                  놀이터
                </Button>
              </Link>
              
              {/* 관리자 링크 */}
              <Link href="/admin/resources">
                <Button
                  variant={location === "/admin/resources" ? "default" : "ghost"}
                  size="lg"
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="button-mobile-nav-admin"
                  className="w-full justify-start text-lg px-6 py-4 h-auto"
                >
                  <Settings className="h-6 w-6 mr-3" />
                  자료 관리
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}