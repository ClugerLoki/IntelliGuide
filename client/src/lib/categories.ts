import { Shirt, Heart, MapPin, Book, Film, Music } from "lucide-react";

export const categories = [
  {
    id: "fashion",
    name: "Fashion",
    icon: Shirt,
    gradient: "from-pink-500 to-rose-500",
    description: "Get personalized clothing and accessory recommendations based on your style preferences",
  },
  {
    id: "health", 
    name: "Health",
    icon: Heart,
    gradient: "from-green-500 to-emerald-500",
    description: "Receive customized diet plans and wellness advice based on your health goals",
  },
  {
    id: "travel",
    name: "Travel", 
    icon: MapPin,
    gradient: "from-blue-500 to-cyan-500",
    description: "Discover amazing destinations and travel experiences tailored to your interests",
  },
  {
    id: "books",
    name: "Books",
    icon: Book, 
    gradient: "from-purple-500 to-indigo-500",
    description: "Find your next great read with recommendations based on your literary preferences",
  },
  {
    id: "movies",
    name: "Movies",
    icon: Film,
    gradient: "from-red-500 to-orange-500", 
    description: "Discover movies and shows that match your taste and viewing preferences",
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    gradient: "from-yellow-500 to-orange-500",
    description: "Get music recommendations that align with your musical taste and mood",
  },
];
