import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log(`${name} 필드 업데이트:`, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("연락처 폼 제출:", formData);
    // todo: remove mock functionality - implement real form submission
    toast({
      title: "메시지 전송 완료!",
      description: "곧 답변드리겠습니다. 감사합니다.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "이메일",
      value: "amangcsk@hotmail.com",
      description: "언제든 문의하세요"
    },
    {
      icon: Phone,
      title: "전화번호",
      value: "010-2909-7950",
      description: "평일 9:00-18:00"
    },
    {
      icon: MapPin,
      title: "위치",
      value: "서울시 은평구",
      description: "직접 만나서 상담 가능"
    }
  ];

  return (
    <section id="연락" className="py-20 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6" data-testid="text-contact-title">
            연락하기
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-contact-subtitle">
            궁금한 점이 있으시거나 맞춤 교육이 필요하시면 언제든 연락 주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 연락처 정보 */}
          <div className="space-y-8">
            <div>
              <h3 className="font-heading font-semibold text-2xl text-foreground mb-6" data-testid="text-contact-info-title">
                연락처 정보
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="p-6 hover-elevate" data-testid={`card-contact-info-${index}`}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <info.icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-foreground mb-1" data-testid={`text-contact-info-title-${index}`}>
                          {info.title}
                        </h4>
                        <p className="font-medium text-lg text-primary mb-1" data-testid={`text-contact-info-value-${index}`}>
                          {info.value}
                        </p>
                        <p className="text-muted-foreground" data-testid={`text-contact-info-desc-${index}`}>
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* 추가 안내 */}
            <Card className="p-6 bg-secondary/5 border-secondary/20">
              <div className="flex items-start gap-4">
                <MessageSquare className="h-8 w-8 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg text-foreground mb-2" data-testid="text-contact-note-title">
                    빠른 답변을 위한 팁
                  </h4>
                  <ul className="text-muted-foreground space-y-1 text-base" data-testid="text-contact-note-list">
                    <li>• 연령대와 학습 목적을 명시해 주세요</li>
                    <li>• 어려워하는 부분을 구체적으로 알려주세요</li>
                    <li>• 선호하는 학습 방식이 있다면 알려주세요</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* 연락처 폼 */}
          <Card className="p-8">
            <h3 className="font-heading font-semibold text-2xl text-foreground mb-6" data-testid="text-contact-form-title">
              메시지 보내기
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-base font-medium">이름 *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-2 text-base h-12"
                    placeholder="성함을 입력해 주세요"
                    data-testid="input-contact-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base font-medium">이메일 *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-2 text-base h-12"
                    placeholder="이메일을 입력해 주세요"
                    data-testid="input-contact-email"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject" className="text-base font-medium">제목 *</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="mt-2 text-base h-12"
                  placeholder="문의 제목을 입력해 주세요"
                  data-testid="input-contact-subject"
                />
              </div>
              
              <div>
                <Label htmlFor="message" className="text-base font-medium">메시지 *</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="mt-2 text-base resize-none"
                  placeholder="자세한 문의 내용을 적어주세요..."
                  data-testid="textarea-contact-message"
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-lg py-4 h-auto"
                data-testid="button-contact-submit"
              >
                <Send className="h-5 w-5 mr-2" />
                메시지 보내기
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}