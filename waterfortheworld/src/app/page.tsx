import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Play, Brain, Droplets, Users, BookOpen, Heart } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center space-x-2">
          <Droplets className="h-8 w-8 text-blue-600" />
          <span className="hidden md:inline text-xl font-bold text-gray-900">WaterForTheWorld</span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link href="#videos" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Videos
          </Link>
          <Link href="#quizzes" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Quizzes
          </Link>
          <Link href="#impact" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Impact
          </Link>
        </nav>
      </header>

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
                  Learn. Watch. Make a <span className="text-blue-600">Difference</span>
                </h1>
                <p className="mx-auto max-w-2xl text-gray-700 md:text-xl lg:text-2xl relative z-10">
                  Educational content about water insecurity and math that turns your engagement into real impact. Every
                  video watched and quiz completed generates revenue donated to fight water scarcity.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 cursor-pointer">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Videos
                </Button>
                <Link href="/quizzes">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 cursor-pointer"
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    Take Quizzes
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                A simple process that turns learning into impact
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Step 1 */}
                <Card className="text-center p-6 border-2 border-blue-100 hover:border-blue-200 transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">You Learn</h3>
                    <p className="text-gray-600">
                      Watch educational videos and take quizzes about water insecurity and math
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow */}
                <div className="hidden md:hidden justify-center">
                  <ArrowRight className="h-8 w-8 text-blue-400" />
                </div>

                {/* Step 2 */}
                <Card className="text-center p-6 border-2 border-green-100 hover:border-green-200 transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Droplets className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">We Generate Revenue</h3>
                    <p className="text-gray-600">
                      Ad revenue and affiliate commissions are generated from your engagement
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow */}
                <div className="hidden md:hidden justify-center md:col-span-1">
                  <ArrowRight className="h-8 w-8 text-blue-400" />
                </div>

                {/* Step 3 */}
                <Card className="text-center p-6 border-2 border-purple-100 hover:border-purple-200 transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">We Donate 100%</h3>
                    <p className="text-gray-600">
                      All revenue goes directly to organizations fighting water scarcity worldwide
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Play className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Educational Videos</h3>
                  <p className="text-gray-600">
                    Engaging video content that explores water insecurity issues and mathematical concepts in an
                    accessible way.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Brain className="h-12 w-12 text-green-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Interactive Quizzes</h3>
                  <p className="text-gray-600">
                    Test your knowledge with quizzes that reinforce learning while generating revenue for our cause.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Users className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Real Impact</h3>
                  <p className="text-gray-600">
                    Track how your learning contributes to real-world solutions for water scarcity around the globe.
                  </p>
                </CardContent>
              </Card>
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
                Start learning today and help us fight water scarcity one video and quiz at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 cursor-pointer">
                  <Play className="mr-2 h-5 w-5" />
                  Start Watching
                </Button>
                <Link href="/quizzes">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-gray-100 hover:text-blue-600 px-8 py-3 cursor-pointer"
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    Take a Quiz
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
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 WaterForTheWorld. All revenue donated to fight water scarcity.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
