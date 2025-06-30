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

        {/* Request Form */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6 mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Request a Tutor</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject / Topic
                    </label>
                    <select
                      id="topic"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
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
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg">
                  Request Tutor
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Ad Space - Top */}
        <div className="w-full bg-gray-100 py-4">
          <div className="container mx-auto px-4 text-center">
            <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
              <p className="text-gray-500">Advertisement</p>
              <div className="h-[90px] w-full bg-gray-200 flex items-center justify-center my-2">
                <span className="text-gray-400">Banner Ad (728x90)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tutors Showcase */}
        <section className="w-full py-16 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Tutors</h2>
            
            <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch">
              {/* Left Ad */}
              <div className="hidden lg:flex flex-col justify-center">
                <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg h-full flex items-center justify-center w-[160px]">
                  <p className="text-gray-500 -rotate-90 whitespace-nowrap">Advertisement</p>
                </div>
              </div>
              
              {/* Tutors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 max-w-5xl">
                {[
                  { 
                    name: 'Aaliyah Smith', 
                    subject: 'Mathematics',
                    bio: '5 years experience helping students excel in algebra, calculus, and geometry.',
                    image: '/tutors/aaliyah.jpg'
                  },
                  { 
                    name: 'Carlos Rivera', 
                    subject: 'Science',
                    bio: 'Specializes in biology and chemistry with engaging, real-world applications.',
                    image: '/tutors/carlos.jpg'
                  },
                  { 
                    name: 'Emily Chen', 
                    subject: 'English',
                    bio: 'Expert in literature analysis, essay writing, and test preparation.',
                    image: '/tutors/emily.jpg'
                  }
                ].map((tutor, idx) => (
                  <Card key={idx} className="border-2 border-blue-100 hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
                    <div className="h-48 bg-blue-100 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-75"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <User className="h-20 w-20 text-white" />
                      </div>
                    </div>
                    <CardContent className="flex-1 flex flex-col p-6">
                      <h3 className="text-2xl font-bold mb-1">{tutor.name}</h3>
                      <p className="text-blue-600 font-medium mb-4">{tutor.subject} Tutor</p>
                      <p className="text-gray-600 mb-6 flex-grow">{tutor.bio}</p>
                      <div className="mt-auto">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Right Ad */}
              <div className="hidden lg:flex flex-col justify-center">
                <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg h-full flex items-center justify-center w-[160px]">
                  <p className="text-gray-500 rotate-90 whitespace-nowrap">Advertisement</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Ad Space - Bottom */}
        <div className="w-full bg-gray-100 py-4">
          <div className="container mx-auto px-4 text-center">
            <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
              <p className="text-gray-500">Advertisement</p>
              <div className="h-[250px] w-full bg-gray-200 flex items-center justify-center my-2">
                <span className="text-gray-400">Large Rectangle Ad (336x280)</span>
              </div>
            </div>
          </div>
        </div>
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
