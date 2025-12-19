import { useRef, useEffect, useCallback } from 'react'
import './App.css'

// Paper component with drag functionality
function Paper({ children, className = '' }) {
  const paperRef = useRef(null)
  const stateRef = useRef({
    holdingPaper: false,
    mouseTouchX: 0,
    mouseTouchY: 0,
    mouseX: 0,
    mouseY: 0,
    prevMouseX: 0,
    prevMouseY: 0,
    velX: 0,
    velY: 0,
    rotation: Math.random() * 30 - 15,
    currentPaperX: 0,
    currentPaperY: 0,
    rotating: false,
  })

  const highestZRef = useRef(1)

  const handleMouseMove = useCallback((e) => {
    const state = stateRef.current
    const paper = paperRef.current
    if (!paper) return

    if (!state.rotating) {
      state.mouseX = e.clientX
      state.mouseY = e.clientY

      state.velX = state.mouseX - state.prevMouseX
      state.velY = state.mouseY - state.prevMouseY
    }

    const dirX = e.clientX - state.mouseTouchX
    const dirY = e.clientY - state.mouseTouchY
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY)
    const dirNormalizedX = dirX / dirLength
    const dirNormalizedY = dirY / dirLength

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX)
    let degrees = (180 * angle) / Math.PI
    degrees = (360 + Math.round(degrees)) % 360
    if (state.rotating) {
      state.rotation = degrees
    }

    if (state.holdingPaper) {
      if (!state.rotating) {
        state.currentPaperX += state.velX
        state.currentPaperY += state.velY
      }
      state.prevMouseX = state.mouseX
      state.prevMouseY = state.mouseY

      paper.style.transform = `translateX(${state.currentPaperX}px) translateY(${state.currentPaperY}px) rotateZ(${state.rotation}deg)`
    }
  }, [])

  const handleMouseDown = useCallback((e) => {
    const state = stateRef.current
    const paper = paperRef.current
    if (!paper) return

    if (state.holdingPaper) return
    state.holdingPaper = true

    highestZRef.current += 1
    paper.style.zIndex = highestZRef.current

    if (e.button === 0) {
      state.mouseTouchX = state.mouseX
      state.mouseTouchY = state.mouseY
      state.prevMouseX = state.mouseX
      state.prevMouseY = state.mouseY
    }
    if (e.button === 2) {
      state.rotating = true
    }
  }, [])

  const handleMouseUp = useCallback(() => {
    const state = stateRef.current
    state.holdingPaper = false
    state.rotating = false
  }, [])

  // Touch event handlers for mobile
  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    const state = stateRef.current
    const paper = paperRef.current
    if (!paper) return

    if (!state.rotating) {
      state.mouseX = e.touches[0].clientX
      state.mouseY = e.touches[0].clientY

      state.velX = state.mouseX - state.prevMouseX
      state.velY = state.mouseY - state.prevMouseY
    }

    const dirX = e.touches[0].clientX - state.mouseTouchX
    const dirY = e.touches[0].clientY - state.mouseTouchY
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY)
    const dirNormalizedX = dirX / dirLength
    const dirNormalizedY = dirY / dirLength

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX)
    let degrees = (180 * angle) / Math.PI
    degrees = (360 + Math.round(degrees)) % 360
    if (state.rotating) {
      state.rotation = degrees
    }

    if (state.holdingPaper) {
      if (!state.rotating) {
        state.currentPaperX += state.velX
        state.currentPaperY += state.velY
      }
      state.prevMouseX = state.mouseX
      state.prevMouseY = state.mouseY

      paper.style.transform = `translateX(${state.currentPaperX}px) translateY(${state.currentPaperY}px) rotateZ(${state.rotation}deg)`
    }
  }, [])

  const handleTouchStart = useCallback((e) => {
    const state = stateRef.current
    const paper = paperRef.current
    if (!paper) return

    if (state.holdingPaper) return
    state.holdingPaper = true

    highestZRef.current += 1
    paper.style.zIndex = highestZRef.current

    state.mouseTouchX = e.touches[0].clientX
    state.mouseTouchY = e.touches[0].clientY
    state.prevMouseX = state.mouseTouchX
    state.prevMouseY = state.mouseTouchY
  }, [])

  const handleTouchEnd = useCallback(() => {
    const state = stateRef.current
    state.holdingPaper = false
    state.rotating = false
  }, [])

  useEffect(() => {
    const paper = paperRef.current
    if (!paper) return

    // Set initial rotation
    paper.style.transform = `rotateZ(${stateRef.current.rotation}deg)`

    // Add mouse event listeners
    document.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div
      ref={paperRef}
      className={`paper ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </div>
  )
}

function App() {
  return (
    <div className="app-container">
      {/* Heart paper */}
      <Paper className="heart" />

      {/* Image papers */}
      <Paper className="image">
        <p>and I fallen in</p>
        <p>Love with You 😍</p>
        <img src="/images/1.jpeg" alt="Love" />
      </Paper>

      <Paper className="image">
        <p></p>
        <img src="/images/2.jpeg" alt="Memory" />
      </Paper>

      <Paper className="image">
        <p>How can be</p>
        <p>someone so cute ❤️</p>
        <img src="/images/3.jpg" alt="Cute" />
      </Paper>

      {/* Text papers */}
      <Paper className="red">
        <p className="p1">and My Favorite</p>
        <p className="p2">Person 😍</p>
      </Paper>

      <Paper>
        <p className="p1">You are Cute</p>
        <p className="p1">Amazing <span style={{ color: 'red' }}>❤️</span></p>
      </Paper>

      <Paper>
        <p className="p1">Drag the papers to move!</p>
      </Paper>
    </div>
  )
}

export default App
