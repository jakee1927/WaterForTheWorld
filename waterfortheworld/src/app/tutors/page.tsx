import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Droplets } from "lucide-react"
import { User, BookOpen, MessageCircle } from "lucide-react"
import Link from "next/link"

export default function TutorMatchPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center space-x-2">
          <Droplets className="h-8 w-8 text-blue-600" />
          <span className="hidden md:inline text-xl font-bold text-gray-900">WaterForTheWorld</span>
        </Link>
        <nav className="ml-auto flex gap-6">
          <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/quizzes" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Quizzes
          </Link>
          <Link href="/donate" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Donate
          </Link>
          <Link href="/tutors" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Free Tutor
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 bg-blue-600 text-white">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h1 className="text-4xl font-bold sm:text-5xl">Get Matched with a Free Tutor</h1>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Need help with your studies? Our dedicated tutors are ready to assist you <em>at no cost</em>.
            </p>
          </div>
        </section>

        {/* Tutors Showcase */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Meet Our Tutors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { name: 'Aaliyah Smith', subject: 'Mathematics' },
                { name: 'Carlos Rivera', subject: 'Science' },
                { name: 'Emily Chen', subject: 'English' },
                { name: 'José Alvarez', subject: 'History' },
                { name: 'Priya Patel', subject: 'Computer Science' },
                { name: 'Ryan Lee', subject: 'Foreign Languages' }
              ].map((tutor, idx) => (
                <Card key={idx} className="border-2 border-blue-100 hover:border-blue-200 transition-colors h-full flex flex-col">
                  <CardContent className="flex-1 flex flex-col items-center pt-6">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <User className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{tutor.name}</h3>
                    <p className="text-gray-600 mb-4">{tutor.subject}</p>
                    <Button variant="outline" size="sm" className="mt-auto">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Request Form */}
        <section className="w-full py-16 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Request a Tutor</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject / Topic
                </label>
                <select
                  id="topic"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>Mathematics</option>
                  <option>Science</option>
                  <option>English</option>
                  <option>History</option>
                  <option>Computer Science</option>
                  <option>Foreign Languages</option>
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="First and last name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Details
                </label>
                <textarea
                  id="details"
                  rows={4}
                  placeholder="Let us know what you need help with..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12">
                Request Tutor
              </Button>
            </form>
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
            <p>&copy; 2025 WaterForTheWorld. All revenue donated to fight water scarcity.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
