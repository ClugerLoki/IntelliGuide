import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MoreVertical } from "lucide-react";
import { categories } from "@/lib/categories";

export default function CategoriesPage() {
  const [, setLocation] = useLocation();

  const handleCategorySelect = (categoryId: string) => {
    setLocation(`/chat/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white rounded-2xl shadow-sm mb-6 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Bot className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">IntelliGuide</h1>
                  <p className="text-sm text-gray-600">Guest User</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="p-2">
                <MoreVertical className="text-gray-600" size={20} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What can I help you with today?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose a category and I'll ask you some questions to provide personalized recommendations tailored just for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary group"
              onClick={() => handleCategorySelect(category.id)}
            >
              <CardContent className="p-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${category.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="text-white text-2xl" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
