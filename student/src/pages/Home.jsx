import React from 'react'
import Footer from '../components/Footer'
import Hero from "../components/Hero"
import TestSection from "../components/TestSection"
import TestimonialSection from "../components/Testimonials"
import ExploreCourse from "../components/ExploreCourse"
import FeaturesSection from '../components/FeaturesSection'
import ExamBlock from "../components/ExamBlock"

const Home = () => {
  return (
    <div>
        <Hero/>
        <ExamBlock/>
        <FeaturesSection/>
        <TestSection/>
        <ExploreCourse/>
        <TestimonialSection/>
        <Footer/>
    </div>
  )
}

export default Home