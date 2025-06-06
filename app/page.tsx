"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ChevronDown,
  ArrowUpDown,
  Sun,
  Moon,
  ChevronRight,
  Atom,
  BookOpen
} from "lucide-react"
import { unit } from "@/lib/data" // Your mock data import
import Image from "next/image"
import { chapterIconMap } from "@/lib/chapter"
const subjects = [
  { id: "physics", name: "Physics PYQs", color: "bg-orange-500", icon: "/phy.png" },
  { id: "chemistry", name: "Chemistry PYQs", color: "bg-green-500", icon: "/chem.png" },
  { id: "mathematics", name: "Mathematics PYQs", color: "bg-blue-500", icon: "/math.png" },
]

const filterOptions = {
  class: ["Class 11", "Class 12", "All Classes"],
  units: ["Mechanics", "Thermodynamics", "Optics", "Modern Physics", "All Units"],
}




const subjectUnits = {
  physics: [
    "Mechanics 1",
    "Mechanics 2",
    "Thermodynamics",
    "Electromagnetism",
    "Optics",
    "Modern Physics",
    "Miscellaneous"
  ],
  chemistry: [
    "Physical Chemistry",
    "Inorganic Chemistry",
    "Organic Chemistry",
    "Miscellaneous"
  ],
  mathematics: [
    "Algebra",
    "Trigonometry",
    "Coordinate Geometry",
    "Calculus",
    "Vectors",
    "Miscellaneous"
  ]
}



export default function JEEMainInterface() {
  const [activeSubject, setActiveSubject] = useState("physics")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [selectedClass, setSelectedClass] = useState("All Classes")
  // const [selectedUnits, setSelectedUnits] = useState("All Units")
  const [showClassDropdown, setShowClassDropdown] = useState(false)
  const [showUnitsDropdown, setShowUnitsDropdown] = useState(false)
  const [sortOrder, setSortOrder] = useState("default")
  const [showNotStarted, setShowNotStarted] = useState(false)
  const [showWeakChapters, setShowWeakChapters] = useState(false)
  const [selectedUnits, setSelectedUnits] = useState("All Units")
  const classDropdownRef = useRef<HTMLDivElement>(null)
  const unitsDropdownRef = useRef<HTMLDivElement>(null)


  // Reset units when subject changes
  useEffect(() => {
    setSelectedUnits("All Units")
  }, [activeSubject])

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      classDropdownRef.current &&
      !(classDropdownRef.current && classDropdownRef.current.contains(event.target as Node))
    ) {
      setShowClassDropdown(false)
    }
    if (
      unitsDropdownRef.current &&
      !(unitsDropdownRef.current && unitsDropdownRef.current.contains(event.target as Node))
    ) {
      setShowUnitsDropdown(false)
    }
  }

  document.addEventListener("mousedown", handleClickOutside)
  return () => {
    document.removeEventListener("mousedown", handleClickOutside)
  }
}, [])




  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  const handleSort = () => {
    const orders = ["default", "alphabetical", "questions-desc", "questions-asc"]
    const currentIndex = orders.indexOf(sortOrder)
    setSortOrder(orders[(currentIndex + 1) % orders.length])
  }

  // Filter chapters by subject, class, and unit
  const filteredChapters = Array.isArray(unit)
    ? unit
      .filter(item =>
        item.subject.toLowerCase() === activeSubject.toLowerCase() &&
        (selectedClass === "All Classes" || item.class === selectedClass) &&
        (selectedUnits === "All Units" || item.unit === selectedUnits) &&
        (!showNotStarted || item.status === "Not Started") &&
        (!showWeakChapters || item.isWeakChapter === true)
      )
      .map(item => {
        const trend: "up" | "down" | "same" =
          item.yearWiseQuestionCount["2025"] > item.yearWiseQuestionCount["2024"]
            ? "up"
            : item.yearWiseQuestionCount["2025"] < item.yearWiseQuestionCount["2024"]
              ? "down"
              : "same";
        return {
          id: item.chapter.toLowerCase().replace(/\s+/g, "-"),
          name: item.chapter,
          stats: {
            "2024": item.yearWiseQuestionCount["2024"],
            "2025": item.yearWiseQuestionCount["2025"],
          },
          trend,
          totalQs: `${item.questionSolved} / ${Object.values(item.yearWiseQuestionCount).reduce((a, b) => a + b, 0)}`,
          status: item.status,
          isWeak: item.isWeakChapter,
        };
      })
    : []

//     interface ChapterUnit {
//   subject: string;
//   class: string;
//   unit: string;
//   chapter: string;
//   status: "Not Started" | "In Progress" | "Completed"; // adjust as per your actual values
//   isWeakChapter: boolean;
//   questionSolved: number;
//   yearWiseQuestionCount: {
//     [year: string]: number; // e.g., "2024": 10, "2025": 15
//   };
// }



  // Sorting logic
  type ChapterSummary = {
    id: string;
    name: string;
    stats: {
      [year: string]: number;
    };
    trend: "up" | "down" | "same";
    totalQs: string;
    status: string;
    isWeak: boolean;
  };

  const getSortedChapters = (chapters: ChapterSummary[]) => {
    const sorted = [...chapters]
    switch (sortOrder) {
      case "alphabetical":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "questions-desc":
        return sorted.sort((a, b) => b.stats["2025"] - a.stats["2025"])
      case "questions-asc":
        return sorted.sort((a, b) => a.stats["2025"] - b.stats["2025"])
      default:
        return sorted
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? "dark bg-slate-900" : "bg-gray-50"}`}>
      <div className="hidden lg:flex">
        {/* Sidebar */}
        <div className={`w-64 border-r min-h-screen fixed left-0 top-0 transition-colors duration-200 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Image src={'/exam.png'} alt="logo" height={20} width={20} />
                <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>JEE Main</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className={`p-1 ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
            <div className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              2025 - 2009 | 173 Papers | 15825 Qs
            </div>
            <div className="space-y-2">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setActiveSubject(subject.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeSubject === subject.id
                    ? isDarkMode
                      ? "bg-slate-700 text-white"
                      : "bg-gray-900 text-white"
                    : isDarkMode
                      ? "text-gray-300 hover:bg-slate-700"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full  flex items-center justify-center text-white text-xs font-bold`}>
                    <Image src={subject.icon} alt="icon" width={20} height={20} />
                  </div>
                  <span className="text-sm">{subject.name}</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 ml-64">
          <div className={`border-b p-6 transition-colors duration-200 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-lg ${subjects.find(s => s.id === activeSubject)?.color} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">
                    {/* {activeSubject[0].toUpperCase()} */}
                    <Atom className="text-xs" />
                  </span>
                </div>
                <div className="flex mx-auto mr-4">
                  {/* <Image src={subjects.find(s => s.id === activeSubject)?.icon ?? "/default.png"} alt="logo" height={30} width={30}/> */}
                  <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {subjects.find(s => s.id === activeSubject)?.name}
                  </h1>
                </div>
              </div>
              {/* <Badge variant="destructive" className="bg-red-500 text-white">
                Anonymous
              </Badge> */}
            </div>
            <p className={`text-sm mb-6 flex justify-center ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Chapter-wise Collection of {subjects.find(s => s.id === activeSubject)?.name}
            </p>
            <div className="flex items-center gap-4 mb-4">
              {/* Class filter */}
              <div className="relative"  ref={classDropdownRef}>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-1 ${isDarkMode ? "border-slate-600 text-gray-300 hover:bg-slate-700" : ""}`}
                  onClick={() => setShowClassDropdown(!showClassDropdown)}
                >
                  Class <ChevronDown className="w-3 h-3" />
                </Button>
                {showClassDropdown && (
                  <div className={`absolute top-full left-0 mt-1 w-32 rounded-md shadow-lg z-10 ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-200"} border`}>
                    {filterOptions.class.map((option) => (
                      <button
                        key={option}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-opacity-50 ${isDarkMode ? "text-gray-300 hover:bg-slate-600" : "text-gray-700 hover:bg-gray-100"}`}
                        onClick={() => {
                          setSelectedClass(option)
                          setShowClassDropdown(false)
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Unit filter */}
              <div className="relative" ref={unitsDropdownRef}>
                <Button
                  variant="outline"
                  size="sm"
                  className={`gap-1 ${isDarkMode ? "border-slate-600 text-gray-300 hover:bg-slate-700" : ""}`}
                  onClick={() => setShowUnitsDropdown(!showUnitsDropdown)}
                >
                  Units <ChevronDown className="w-3 h-3" />
                </Button>
                {showUnitsDropdown && (
                  <div className={`absolute top-full left-0 mt-1 w-40 rounded-md shadow-lg z-10 ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-white border-gray-200"} border`}>
                    <button
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-opacity-50 ${isDarkMode ? "text-gray-300 hover:bg-slate-600" : "text-gray-700 hover:bg-gray-100"}`}
                      onClick={() => {
                        setSelectedUnits("All Units")
                        setShowUnitsDropdown(false)
                      }}
                    >
                      All Units
                    </button>
                    {subjectUnits[activeSubject as keyof typeof subjectUnits].map((unit) => (
                      <button
                        key={unit}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-opacity-50 ${isDarkMode ? "text-gray-300 hover:bg-slate-600" : "text-gray-700 hover:bg-gray-100"}`}
                        onClick={() => {
                          setSelectedUnits(unit)
                          setShowUnitsDropdown(false)
                        }}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                variant={'outline'}
                className={`text-xs px-2 py-1  ${isDarkMode ? "bg-slate-700 text-gray-300 text-sm" : "bg-white text-gray-700"} cursor-pointer`}
                onClick={() => setShowNotStarted(v => !v)}
              >
                Not Started
              </Button>
              <Button
                variant={"outline"}
                className={` text-xs px-2 py-1  ${isDarkMode ? "bg-slate-700 text-gray-300" : "bg-white text-gray-700"} cursor-pointer ${showWeakChapters ? "text-gray-300" : ""}`}
                onClick={() => setShowWeakChapters(v => !v)}
              >
                Weak Chapters
              </Button>

            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Showing all chapters ({filteredChapters.length})
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-blue-500 hover:text-blue-600"
                onClick={handleSort}
              >
                <ArrowUpDown className="w-3 h-3" />
                Sort
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {getSortedChapters(filteredChapters).map((chapter) => (
                <div
                  key={chapter.id}
                  className={`rounded-lg border p-4 hover:shadow-sm transition-all cursor-pointer ${isDarkMode
                    ? "bg-slate-800 border-slate-700 hover:bg-slate-750"
                    : "bg-white border-gray-200 hover:shadow-sm"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {chapterIconMap[chapter.name as keyof typeof chapterIconMap] || <BookOpen className="w-6 h-6 text-gray-400" />}
                      <span className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                        {chapter.name}
                      </span>
                      {chapter.isWeak && (
                        <Badge variant="destructive" className="ml-2 bg-yellow-500 text-black">
                          Weak
                        </Badge>
                      )}
                    </div>
                    <div className={`flex items-center gap-6 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <span className="flex items-center gap-1">
                        2025: {chapter.stats["2025"]}
                        {chapter.trend === "up" && <span className="text-green-500">↑</span>}
                        {chapter.trend === "down" && <span className="text-red-500">↓</span>}
                        {" | "}2024: {chapter.stats["2024"]}
                      </span>
                      <span>{chapter.totalQs} Attempted</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile layout omitted for brevity, but follows similar logic */}
      <div className="lg:hidden">
        {/* Header */}
        <div
          className={`border-b px-4 py-3 transition-colors duration-200 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
            }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ArrowLeft className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
              <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>JEE Main</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={`p-1 ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Subject Tabs */}
        <div
          className={`border-b px-4 py-3 transition-colors duration-200 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
            }`}
        >
          <div className="flex gap-6">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setActiveSubject(subject.id)}
                className={`flex flex-col items-center gap-1 ${activeSubject === subject.id ? "text-orange-500" : isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
              >
                <div className={`w-8 h-8 rounded-full ${subject.color} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">
                    {subject.id === "physics" ? "Phy" : subject.id === "chemistry" ? "Chem" : "Math"}
                  </span>
                </div>
                <span className="text-xs">
                  {subject.id === "physics" ? "Phy" : subject.id === "chemistry" ? "Chem" : "Math"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div
          className={`border-b px-4 py-3 transition-colors duration-200 ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
            }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="outline"
              size="sm"
              className={`gap-1 text-xs ${isDarkMode ? "border-slate-600 text-gray-300 hover:bg-slate-700" : ""}`}
              onClick={() => setShowClassDropdown(!showClassDropdown)}
            >
              Class <ChevronDown className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`gap-1 text-xs ${isDarkMode ? "border-slate-600 text-gray-300 hover:bg-slate-700" : ""}`}
              onClick={() => setShowUnitsDropdown(!showUnitsDropdown)}
            >
              Units <ChevronDown className="w-3 h-3" />
            </Button>
            <Badge
              variant="secondary"
              className={`text-xs ${isDarkMode ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
            >
              Not Started
            </Badge>
            <Badge
              variant="secondary"
              className={`text-xs ${isDarkMode ? "bg-slate-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
            >
              Wea...
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Showing all chapters (34)
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-blue-500 hover:text-blue-600 text-xs"
              onClick={handleSort}
            >
              <ArrowUpDown className="w-3 h-3" />
              Sort
            </Button>
          </div>
        </div>

        {/* Chapter List */}
        <div className="p-4">
          <div className="space-y-3">
            {getSortedChapters(filteredChapters).map((chapter) => (
              <div
                key={chapter.id}
                className={`rounded-lg border p-3 transition-colors cursor-pointer ${isDarkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-750" : "bg-white border-gray-200"
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {chapterIconMap[chapter.name as keyof typeof chapterIconMap] || <BookOpen className="w-6 h-6 text-gray-400" />}
                    <div className="flex-1">
                      <h3
                        className={`font-medium text-sm leading-tight mb-1 ${isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                      >
                        {chapter.name}
                      </h3>
                      <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        2025: {chapter.stats["2025"]} | 2024: {chapter.stats["2024"]}
                      </p>
                    </div>
                  </div>
                  <div className={`text-xs ml-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>0/205 Qs</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
