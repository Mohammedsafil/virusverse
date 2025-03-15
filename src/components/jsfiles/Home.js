import React from 'react'
import Header from './Header'
import Hero from './Hero'
import SnowflakeCursor from './SnowflakeCursor'
// import Footer from './Footer'

const Home = () => {
  return (
    <div className="home-container">
      <SnowflakeCursor/>
      <Header />
      <Hero />
      {/* <Footer /> */}
    </div>
  )
}

export default Home
