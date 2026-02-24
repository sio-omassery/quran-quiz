
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Moon,
  Star,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Menu,
  X,
  Calendar,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

// Types
type View = 'landing' | 'form' | 'quiz' | 'confirmation'
type AgeCategory = 'cat1' | 'cat2' | 'cat3'
type Gender = 'male' | 'female'

interface ParticipantInfo {
  fullName: string
  age: string
  gender: Gender | ''
  category: AgeCategory | ''
  schoolOrMosque: string
  contactNumber: string
}

interface Quiz {
  id: number
  title: string
  date: string
  ramadanDay: number
  focus: string[]
  questions: string[]
}

const quizzes: Quiz[] = [
  {
    id: 1,
    title: 'Part 1: Surah Al-Mumtahina',
    date: '2026-02-26',
    ramadanDay: 1,
    focus: ['Surah Al-Mumtahina', 'Quran Study', 'Part 1'],
    questions: [
      "Explain the context of revelation (Sabab al-Nuzul) of Surah Al-Mumtahina.",
      "What are the key lessons taught in the first five verses of the Surah regarding friendship and enmity?",
      "Discuss the significance of Prophet Ibrahim (AS) as an example mentioned in this Surah.",
      "How does the Surah address the issue of family ties versus faith?",
      "Summarize the guidelines given for interacting with non-Muslims who are not at war with believers."
    ]
  },
  {
    id: 2,
    title: 'Part 2: Surah Al-Mumtahina',
    date: '2026-03-06',
    ramadanDay: 6,
    focus: ['Surah Al-Mumtahina', 'Quran Study', 'Part 2'],
    questions: ["Questions will be available soon..."]
  },
  {
    id: 3,
    title: 'Part 3: Surah Al-Mumtahina',
    date: '2026-03-14',
    ramadanDay: 14,
    focus: ['Surah Al-Mumtahina', 'Quran Study', 'Part 3'],
    questions: ["Questions will be available soon..."]
  }
]

function App() {
  // View State
  const [currentView, setCurrentView] = useState<View>('landing')
  const [menuOpen, setMenuOpen] = useState(false)

  // Participant Info
  const [participantInfo, setParticipantInfo] = useState<ParticipantInfo>({
    fullName: '',
    age: '',
    gender: '',
    category: '',
    schoolOrMosque: '',
    contactNumber: ''
  })

  // Quiz State
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMessage, setDialogMessage] = useState({ title: '', description: '' })

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const scheduleRef = useRef<HTMLDivElement>(null)

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (currentView === 'quiz' && quizStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - quizStartTime.getTime()) / 1000))
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [currentView, quizStartTime])

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Check quiz availability
  const checkQuizAvailability = () => {
    console.log('checkQuizAvailability called')
    const now = new Date()
    const targetQuiz = quizzes.find(q => {
      const qDate = new Date(q.date)
      return qDate.toDateString() === now.toDateString()
    })

    if (!targetQuiz) {
      setDialogMessage({
        title: 'Quiz Not Available',
        description: 'No quiz is scheduled for today. Please check the schedule for upcoming dates.'
      })
      setDialogOpen(true)
      return
    }

    setCurrentQuiz(targetQuiz)
    setAnswers(new Array(targetQuiz.questions.length).fill(''))
    setCurrentView('form')
  }

  // Start quiz after form
  const startQuiz = () => {
    if (!participantInfo.fullName || !participantInfo.age || !participantInfo.category || !participantInfo.gender) {
      setDialogMessage({
        title: 'Information Incomplete',
        description: 'Please provide your name, age, category, and gender to proceed.'
      })
      setDialogOpen(true)
      return
    }
    setQuizStartTime(new Date())
    setCurrentView('quiz')
  }

  // Submit quiz
  const submitQuiz = () => {
    setCurrentView('confirmation')
  }

  // Reset and return home
  const returnHome = () => {
    setCurrentView('landing')
    setCurrentQuiz(null)
    setCurrentQuestionIndex(0)
    setAnswers([])
    setQuizStartTime(null)
    setElapsedTime(0)
    setParticipantInfo({
      fullName: '',
      age: '',
      gender: '',
      category: '',
      schoolOrMosque: '',
      contactNumber: ''
    })
  }

  // Scroll animations
  useEffect(() => {
    if (currentView !== 'landing') return

    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo('.hero-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.3 }
      )

      gsap.fromTo('.hero-bg',
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
      )

      // About section
      ScrollTrigger.create({
        trigger: aboutRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.about-title',
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
          )
          gsap.fromTo('.about-text',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.2 }
          )
          gsap.fromTo('.about-image',
            { opacity: 0, x: 50, scale: 0.98 },
            { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power2.out', delay: 0.3 }
          )
        },
        once: true
      })

      // Schedule section
      ScrollTrigger.create({
        trigger: scheduleRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.schedule-title',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
          )
          gsap.fromTo('.timeline-line',
            { scaleY: 0 },
            { scaleY: 1, duration: 1.2, ease: 'power2.out', delay: 0.2 }
          )
          gsap.fromTo('.quiz-card',
            { opacity: 0, x: (i) => i % 2 === 0 ? -50 : 50 },
            { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out', delay: 0.4 }
          )
        },
        once: true
      })

    })

    return () => ctx.revert()
  }, [currentView])

  // Render Landing Page
  const renderLanding = () => (
    <div className="relative">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Moon className="w-6 h-6 text-gold" />
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-lavender uppercase">Ramadan Reflections</p>
            <p className="font-serif text-lg text-cream leading-none">2026</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={checkQuizAvailability}
            className="hidden sm:flex bg-gold text-midnight hover:bg-gold-light font-medium px-6 rounded-pill"
          >
            Start Quiz
          </Button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-cream hover:text-gold transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-midnight/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8">
          <a href="#about" onClick={() => setMenuOpen(false)} className="font-serif text-2xl text-cream hover:text-gold transition-colors">About</a>
          <a href="#schedule" onClick={() => setMenuOpen(false)} className="font-serif text-2xl text-cream hover:text-gold transition-colors">Schedule</a>
          <Button
            onClick={() => {
              setMenuOpen(false)
              checkQuizAvailability()
            }}
            className="bg-gold text-midnight hover:bg-gold-light font-medium px-8 py-3 rounded-pill mt-4"
          >
            Start Quiz
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div className="hero-bg absolute inset-0">
          <img
            src="hero_desert_moon.jpg"
            alt="Desert at night"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 vignette" />

        {/* Content */}
        <div className="hero-content absolute left-6 lg:left-[10vw] top-1/2 -translate-y-1/2 w-[88vw] lg:w-[46vw] z-10">
          <p className="font-mono text-xs tracking-[0.15em] text-lavender uppercase mb-4">
            Ramadan Reflections 2026
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl xl:text-8xl text-cream leading-[1.1] sm:leading-[0.95] mb-6">
            Ramadan Reflections<br />
            <span className="text-gold">Quiz</span> 2026
          </h1>
          <p className="text-lavender text-base lg:text-lg leading-relaxed mb-8 max-w-lg">
            An online quiz competition based on Surah Al-Mumtahina. Use this opportunity to make your Ramadan more productive and spiritually enriching.
          </p>
          <div className="bg-gold/10 border border-gold/20 p-4 rounded-xl mb-8 max-w-lg">
            <p className="text-gold text-sm font-sans">
              * The competition is exclusive to residents of SIO Omassery Area.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start w-full sm:w-auto">
            <Button
              onClick={checkQuizAvailability}
              className="btn-gold w-full sm:w-auto px-8 py-6 rounded-pill text-base font-medium"
            >
              Start Quiz
            </Button>
            <a
              href="#about"
              className="w-full sm:w-auto px-8 py-3 sm:py-6 text-cream hover:text-gold transition-colors text-base font-medium flex items-center justify-center gap-2"
            >
              Read the guidelines <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="relative py-16 sm:py-24 lg:py-32 px-6 lg:px-0 bg-midnight">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Text Content */}
            <div className="lg:pl-[10vw]">
              <h2 className="about-title font-serif text-3xl sm:text-4xl lg:text-5xl text-cream mb-6 sm:mb-8">
                About the <span className="text-gold">Competition</span>
              </h2>
              <div className="space-y-6">
                <p className="about-text text-lavender leading-relaxed">
                  A golden opportunity to get closer to the words of Allah during the holy days of Ramadan. This quiz competition is based on Surah Al-Mumtahina.
                </p>
                <p className="about-text text-lavender leading-relaxed">
                  There will be separate competitions for men and women. In each category, two prizes will be awarded for men and two for women.
                </p>
                <p className="about-text text-lavender leading-relaxed">
                  A total of 12 winners across 3 categories will receive prizes. Participants will have one day to submit their answers for each quiz.
                </p>
              </div>

              {/* Stats */}
              <div className="about-text grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-cream/10">
                <div>
                  <p className="font-mono text-xs tracking-[0.12em] text-gold uppercase mb-2">Format</p>
                  <p className="text-cream text-sm">Paragraph answers</p>
                </div>
                <div>
                  <p className="font-mono text-xs tracking-[0.12em] text-gold uppercase mb-2">Evaluation</p>
                  <p className="text-cream text-sm">Clarity & depth</p>
                </div>
                <div>
                  <p className="font-mono text-xs tracking-[0.12em] text-gold uppercase mb-2">Rounds</p>
                  <p className="text-cream text-sm">3 quizzes</p>
                </div>
              </div>
            </div>

            {/* Image Card */}
            <div className="about-image lg:sticky lg:top-24">
              <div className="relative rounded-2xl overflow-hidden shadow-card">
                <img
                  src="about_desert_card.jpg"
                  alt="Desert dunes"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 mb-3">
                    <BookOpen className="w-5 h-5 text-gold" />
                    <span className="font-mono text-xs tracking-[0.12em] text-lavender uppercase">Knowledge</span>
                  </div>
                  <p className="font-serif text-xl text-cream">Deepen your understanding through reflection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" ref={scheduleRef} className="relative py-24 lg:py-32 bg-midnight">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="schedule-title font-serif text-4xl lg:text-5xl text-cream text-center mb-16">
            Quiz <span className="text-gold">Schedule</span>
          </h2>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="timeline-line absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gold/30 origin-top" />

            {/* Quiz Cards */}
            <div className="space-y-12">
              {quizzes.map((quiz, index) => (
                <div key={quiz.id} className={`quiz-card relative flex ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-start gap-4 lg:gap-8`}>
                  {/* Dot */}
                  <div className="absolute left-2 lg:left-1/2 -translate-x-1/2 w-3 h-3 lg:w-4 lg:h-4 rounded-full bg-gold shadow-glow z-10 top-1.5" />

                  {/* Content */}
                  <div className={`ml-8 lg:ml-0 lg:w-5/12 ${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:pl-12'}`}>
                    <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                      <Calendar className="w-3 h-3 text-gold" />
                      <span className="font-mono text-xs tracking-[0.12em] text-gold uppercase">
                        {quiz.date}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl sm:text-2xl text-cream mb-2">{quiz.title}</h3>
                    <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                      {quiz.focus.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 bg-midnight-light border border-cream/10 rounded-full text-[10px] sm:text-xs text-lavender">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Spacer for other side */}
                  <div className="hidden lg:block lg:w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="relative py-12 bg-midnight border-t border-cream/10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-gold" />
            <span className="font-serif text-lg text-cream">Ramadan Reflections 2026</span>
          </div>
          <p className="text-lavender text-sm">Online Quran Quiz Competition</p>
          <p className="font-mono text-xs text-lavender/60">SIO OMASSERY AREA</p>
        </div>
      </footer>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-midnight-light border-cream/10 text-cream max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{dialogMessage.title}</DialogTitle>
            <DialogDescription className="text-lavender">
              {dialogMessage.description}
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => setDialogOpen(false)}
            className="bg-gold text-midnight hover:bg-gold-light mt-4"
          >
            Understood
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )

  // Render Pre-Quiz Form
  const renderForm = () => (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-6">
      <div className="noise-overlay" />

      <div className="relative w-full max-w-lg">
        {/* Back Button */}
        <button
          onClick={() => setCurrentView('landing')}
          className="absolute -top-16 left-0 flex items-center gap-2 text-lavender hover:text-gold transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Back to Home
        </button>

        <div className="bg-midnight-light border border-cream/10 rounded-2xl p-8 lg:p-10 shadow-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
              <Users className="w-7 h-7 text-gold" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-2">Participant Information</h2>
            <p className="text-lavender text-xs sm:text-sm">
              {currentQuiz && `Quiz: ${currentQuiz.title}`}
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <Label className="text-cream mb-2 block">Full Name <span className="text-gold">*</span></Label>
              <Input
                value={participantInfo.fullName}
                onChange={(e) => setParticipantInfo({ ...participantInfo, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="bg-midnight border-cream/10 text-cream placeholder:text-lavender/50 focus:border-gold focus:ring-gold/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-cream mb-2 block">Age <span className="text-gold">*</span></Label>
                <Input
                  type="number"
                  value={participantInfo.age}
                  onChange={(e) => setParticipantInfo({ ...participantInfo, age: e.target.value })}
                  placeholder="Age"
                  className="bg-midnight border-cream/10 text-cream placeholder:text-lavender/50 focus:border-gold focus:ring-gold/20"
                />
              </div>
              <div>
                <Label className="text-cream mb-2 block">Category <span className="text-gold">*</span></Label>
                <Select
                  value={participantInfo.category}
                  onValueChange={(value) => setParticipantInfo({ ...participantInfo, category: value as AgeCategory })}
                >
                  <SelectTrigger className="bg-midnight border-cream/10 text-cream focus:ring-gold/20">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-midnight-light border-cream/10 text-white">
                    <SelectItem value="cat1">Category 1 (Up to 30 years)</SelectItem>
                    <SelectItem value="cat2">Category 2 (Up to 50 years)</SelectItem>
                    <SelectItem value="cat3">Category 3 (Above 50 years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="text-cream mb-2 block">Gender <span className="text-gold">*</span></Label>
                <Select
                  value={participantInfo.gender}
                  onValueChange={(value) => setParticipantInfo({ ...participantInfo, gender: value as Gender })}
                >
                  <SelectTrigger className="bg-midnight border-cream/10 text-cream focus:ring-gold/20">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-midnight-light border-cream/10 text-white">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-cream mb-2 block">School / Madrasa / Mahallu <span className="text-lavender/60">(optional)</span></Label>
              <Input
                value={participantInfo.schoolOrMosque}
                onChange={(e) => setParticipantInfo({ ...participantInfo, schoolOrMosque: e.target.value })}
                placeholder="Enter name"
                className="bg-midnight border-cream/10 text-cream placeholder:text-lavender/50 focus:border-gold focus:ring-gold/20"
              />
            </div>

            <div>
              <Label className="text-cream mb-2 block">Phone Number <span className="text-lavender/60">(optional)</span></Label>
              <Input
                value={participantInfo.contactNumber}
                onChange={(e) => setParticipantInfo({ ...participantInfo, contactNumber: e.target.value })}
                placeholder="Enter contact number"
                className="bg-midnight border-cream/10 text-cream placeholder:text-lavender/50 focus:border-gold focus:ring-gold/20"
              />
            </div>

            <Button
              onClick={startQuiz}
              className="w-full btn-gold py-4 sm:py-6 rounded-pill text-base font-medium mt-4 sm:mt-6"
            >
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // Render Quiz Interface
  const renderQuiz = () => {
    if (!currentQuiz) return null

    const currentQuestion = currentQuiz.questions[currentQuestionIndex]
    const isFirstQuestion = currentQuestionIndex === 0
    const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1

    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="quiz_background_desert.jpg"
            alt="Desert background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-midnight/70" />
          <div className="absolute inset-0 vignette" />
        </div>

        {/* Noise */}
        <div className="noise-overlay" />

        {/* Top HUD */}
        <div className="relative z-10 px-4 sm:px-12 py-4 flex justify-between items-center bg-midnight/50 backdrop-blur-md">
          <div className="max-w-[150px] sm:max-w-none">
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.12em] text-gold uppercase truncate">{currentQuiz.title}</p>
          </div>

          {/* Progress Dots */}
          <div className="hidden sm:flex items-center gap-2">
            {currentQuiz.questions.map((_, i) => (
              <div
                key={i}
                className={`progress-dot ${i === currentQuestionIndex ? 'active w-6' : i < currentQuestionIndex ? 'active' : 'inactive'}`}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            <span className="font-mono text-sm text-cream">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        {/* Main Question Card */}
        <div className="relative z-10 px-4 sm:px-12 py-4 flex items-center justify-center min-h-[calc(100vh-160px)]">
          <div className="w-full max-w-4xl bg-midnight-light/80 backdrop-blur-lg border border-cream/10 rounded-xl sm:rounded-2xl p-6 sm:p-12 shadow-card">
            {/* Question Number */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-sm tracking-[0.12em] text-gold uppercase">
                Question {currentQuestionIndex + 1} / {currentQuiz.questions.length}
              </span>
            </div>

            {/* Question */}
            <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-cream mb-6 sm:mb-8 leading-relaxed">
              {currentQuestion}
            </h3>

            {/* Answer Textarea */}
            <Textarea
              value={answers[currentQuestionIndex] || ''}
              onChange={(e) => {
                const newAnswers = [...answers]
                newAnswers[currentQuestionIndex] = e.target.value
                setAnswers(newAnswers)
              }}
              placeholder="Write your answer here..."
              className="min-h-[200px] bg-midnight border-cream/10 text-cream placeholder:text-lavender/50 focus:border-gold focus:ring-gold/20 textarea-glow ambient-glow resize-none"
            />

            {/* Word Count */}
            <p className="text-right text-lavender/60 text-sm mt-2">
              {answers[currentQuestionIndex]?.split(/\s+/).filter(w => w.length > 0).length || 0} words
            </p>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="relative z-10 px-4 sm:px-12 py-6 flex justify-between items-center bg-midnight/80 backdrop-blur-md border-t border-cream/10">
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            disabled={isFirstQuestion}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-pill transition-all text-sm sm:text-base ${isFirstQuestion
              ? 'text-lavender/30 cursor-not-allowed'
              : 'text-cream hover:text-gold hover:bg-cream/5'
              }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Previous
          </button>

          <span className="font-mono text-[10px] sm:text-sm text-lavender hidden md:block">
            Question {currentQuestionIndex + 1} / {currentQuiz.questions.length}
          </span>

          {isLastQuestion ? (
            <Button
              onClick={submitQuiz}
              className="btn-gold px-6 sm:px-8 py-3 rounded-pill flex items-center gap-2 text-sm sm:text-base"
            >
              Submit Quiz <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="flex items-center gap-2 px-6 sm:px-8 py-3 rounded-pill bg-gold text-midnight font-medium hover:bg-gold-light transition-all text-sm sm:text-base"
            >
              Next <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>
    )
  }

  // Render Confirmation Screen
  const renderConfirmation = () => (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-6 relative overflow-hidden">
      {/* Crescent Moon Background */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] opacity-10">
        <svg viewBox="0 0 200 200" className="w-full">
          <path
            d="M100 10 A90 90 0 1 0 100 190 A60 60 0 1 1 100 10"
            fill="currentColor"
            className="text-gold"
          />
        </svg>
      </div>

      {/* Stars */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(30)].map((_, i) => (
          <Star
            key={i}
            className="star absolute w-3 h-3 text-gold"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="noise-overlay" />

      <div className="relative text-center max-w-xl">
        {/* Checkmark */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-full border-2 border-gold flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-gold" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream mb-6">
          Your answers have been <span className="text-gold">submitted.</span>
        </h1>

        <p className="text-lavender text-base sm:text-lg leading-relaxed mb-4">
          Thank you for participating in the quiz, {participantInfo.fullName}.
        </p>

        <p className="text-lavender/80 mb-10 text-sm sm:text-base">
          May this blessed month bring clarity and growth to your spiritual journey.
        </p>

        <div className="flex flex-col gap-4 justify-center w-full max-w-sm mx-auto">
          <Button
            onClick={returnHome}
            className="btn-gold px-8 py-5 sm:py-6 rounded-pill w-full"
          >
            Return Home
          </Button>
          <a
            href="https://chat.whatsapp.com/FDHO2iy5x898gnX3YNx5vj"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white hover:bg-[#128C7E] px-8 py-5 sm:py-6 rounded-pill flex items-center justify-center gap-2 font-medium w-full text-sm sm:text-base"
          >
            Join WhatsApp Group
          </a>
        </div>

        <p className="font-mono text-xs tracking-[0.12em] text-lavender/50 uppercase mt-12">
          ജസാക്കല്ലാഹു ഖൈറൻ
        </p>
      </div>
    </div>
  )

  return (
    <div className="bg-midnight min-h-screen">
      {currentView === 'landing' && renderLanding()}
      {currentView === 'form' && renderForm()}
      {currentView === 'quiz' && renderQuiz()}
      {currentView === 'confirmation' && renderConfirmation()}
    </div>
  )
}

export default App
