import {
  Users,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  GraduationCap,
  Target,
  Calendar,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Smart Scheduling",
      description:
        "Organize your study time with intelligent calendar management and deadline tracking.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Study Groups",
      description:
        "Connect with classmates and collaborate on projects in dedicated study spaces.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Tracking",
      description:
        "Set academic goals and monitor your progress with detailed analytics and insights.",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Computer Science Student",
      content:
        "This platform helped me organize my coursework better than any other tool I've tried.",
      rating: 5,
      avatar: "PS",
    },
    {
      name: "Arjun Patel",
      role: "Engineering Student",
      content:
        "This made my college life so much easier. Just a few clicks and I'm all set!",
      rating: 5,
      avatar: "AP",
    },
    {
      name: "Anjali Singh",
      role: "MBA Student",
      content:
        "Clean interface and powerful features. It's become essential for my studies.",
      rating: 5,
      avatar: "AS",
    },
  ];

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-black border-white/20">
        <div className="flex flex-col gap-6 mt-8">
          <a
            href="#features"
            className="text-gray-200 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-gray-200 hover:text-white transition-colors"
          >
            Reviews
          </a>
          <Button
            variant="outline"
            className="justify-start border-white/20 text-gray-200 hover:text-white hover:bg-white/10"
            asChild
          >
            <Link to="/login" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Sign In
            </Link>
          </Button>

          <Button
            className="justify-start bg-white text-black hover:bg-gray-200"
            asChild
          >
            <Link to="/signup" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Get Started
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-semibold">Class-board</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Reviews
              </a>
              <Link to="/login" className="hover:bg-white/10">
                Sign In
              </Link>

              <Button
                asChild
                className="bg-white text-black hover:bg-gray-200 font-medium rounded-lg px-6 py-2 transition-colors duration-200"
              >
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>

            <MobileMenu />
          </div>
        </div>
      </nav>

      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto text-center">
          <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Academic Excellence
              <br />
              <span className="text-gray-400">Made Simple</span>
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              Class-board is your all-in-one platform for managing courses,
              assignments, and grades. Streamline your academic journey with
              powerful tools designed for students.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="px-8 py-6 text-lg h-14 bg-white text-black hover:bg-gray-200 transition-colors duration-200"
              >
                <Link to="/signup" className="flex items-center">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg h-14 border-white/20 hover:bg-white/10"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" />
                No credit card required
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 border-y border-white/10 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Active Students" },
              { number: "1,200", label: "Available Courses" },
              { number: "98%", label: "Success Rate" },
              { number: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Essential tools designed for academic success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4">
                    <div className="text-black">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-xl text-muted-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="px-6 py-24 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Student Reviews</h2>
            <p className="text-xl text-gray-400">
              Feedback from our learning community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-white text-white" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-white text-black font-semibold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-muted-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-white text-black border-white/20">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-4 text-black">
                Ready to Transform Your Studies?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of students who have revolutionized their
                learning experience with Class-board.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="px-8 py-6 text-lg bg-black text-white hover:bg-gray-900 transition-colors duration-200"
                >
                  <Link to="/signup" className="flex items-center">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-lg border-black text-black hover:text-muted-foreground transition-colors duration-200"
                >
                  <Link to="/login" className="flex items-center">
                    Sign In
                  </Link>
                </Button>
              </div>

              <div className="flex justify-center gap-8 mt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-black" />
                  Free to start
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-black" />
                  No commitments
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-black" />
                </div>
                <span className="font-semibold">Class-board</span>
              </div>
              <p className="text-gray-400 text-sm">
                Modern learning platform for academic success.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Updates", "Mobile App"],
              },
              {
                title: "Support",
                links: ["Help Center", "Documentation", "Contact", "Community"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Privacy", "Terms"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h3 className="font-medium mb-4 text-white">{section.title}</h3>
                <div className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <div key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors text-sm block"
                      >
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 mt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 EduPlatform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
