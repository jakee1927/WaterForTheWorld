import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Droplets, Heart, Instagram, BrainCircuit } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">

      <main className="flex-1">
        {/* Hero Section */}
        <section 
          className="w-full py-12 md:py-24 lg:py-32 relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/waterbg.jpg')",
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 relative z-10">
                  Fight Water Insecurity with Your Free <span className="text-blue-600">AI Tutor</span>
                </h1>
                <p className="mx-auto max-w-2xl text-gray-700 md:text-xl lg:text-2xl relative z-10">
                  Get personalized SAT prep or become a pop culture expert, all while providing clean drinking water to those in need.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto max-w-md mx-auto relative z-10 px-4 sm:px-0">
                <Link href="/quizzes" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 cursor-pointer"
                  >
                    <BrainCircuit className="mr-2 h-5 w-5 text-white" />
                    Test Your Skills
                  </Button>
                </Link>
                <Link href="/donate" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 cursor-pointer"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Donate Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Diagram */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 mb-4">How Your Study Time Creates Impact</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                A simple, powerful process that benefits everyone.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <Card className="text-center p-6 border-2 border-blue-100 hover:border-blue-200 transition-colors h-full flex flex-col">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BrainCircuit className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Personalized Quizzes & SAT Prep</h3>
                    <p className="text-gray-600">
                      Train for a top SAT score <em>or</em> flex your trivia skills. Our always-free AI adapts to your goals with endless practice questions and instant feedback.
                    </p>
                  </CardContent>
                </Card>


                {/* Step 2 */}
                <Card className="text-center p-6 border-2 border-green-100 hover:border-green-200 transition-colors h-full flex flex-col">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Support Global Causes</h3>
                    <p className="text-gray-600">
                      Our free services are made possible through unobtrusive ads. Your time on our site helps support our mission.
                    </p>
                  </CardContent>
                </Card>

                {/* Step 3 */}
                <Card className="text-center p-6 border-2 border-red-100 hover:border-red-200 transition-colors h-full flex flex-col">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Droplets className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Provide Clean Water</h3>
                    <p className="text-gray-600">
                      We partner with leading charities to turn your educational efforts into life-saving clean water for communities in need.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="w-full py-16 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 mb-8">
              Who We Are
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              We are Inspire-EDU, a non-profit organization dedicated to developing student leaders through addressing community and global issues. 
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <a href="https://www.instagram.com/joininspireedu" target="_blank" rel="noopener noreferrer">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 text-lg">
                  <Instagram className="mr-2 h-5 w-5" />
                  Follow Us on Instagram
                </Button>
              </a>

            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-16 bg-blue-600">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                Ready to Make a Difference?
              </h2>
              <p className="mx-auto max-w-2xl text-blue-100 text-lg">
                Test your knowledge, challenge your friends, and help provide clean water to those in need. Every quiz makes an impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                <Link href="/donate" className="w-full sm:w-auto max-w-xs">
                  <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 cursor-pointer">
                    <Heart className="mr-2 h-5 w-5" />
                    Donate Now
                  </Button>
                </Link>
                <Link href="/quizzes" className="w-full sm:w-auto max-w-xs">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 cursor-pointer"
                  >
                    <BrainCircuit className="mr-2 h-5 w-5" />
                    Test Your Skills
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-gray-900 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Droplets className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold">WaterForTheWorld</span>
            </div>
            <div className="flex space-x-6">
              <a 
                href="https://inspire-edu.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About Us
              </a>
              <a 
                href="https://inspire-edu.org/contact" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 Inspire-EDU. Empowering students, providing clean water.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
