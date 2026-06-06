import { useEffect, useRef } from 'react'

const rand = (min: number, max: number) => Math.random() * (max - min) + min

/* ---------- color palette ---------- */
const C = {
  forestDeep:   [3, 0, 20],
  forestMid:    [5, 0, 26],
  emerald:      [20, 0, 102],
  gold:         [0, 200, 255],
  goldBright:   [0, 255, 255],
  warmWhite:    [240, 244, 255],
  skyTone:      [100, 150, 255],
  leaf:         [140, 100, 255],
  leafLight:    [180, 150, 255],
}

function rgba(c: number[], a: number) {
  return `rgba(${c[0]},${c[1]},${c[2]},${a})`
}

/* ---------- types ---------- */
interface Star { x:number; y:number; size:number; opacity:number; speed:number; phase:number }
interface SunRay { angle:number; width:number; opacity:number; speed:number; phase:number; length:number }
interface Landscape { yOffset:number; color:number[]; opacity:number; speed:number; points:number[]; parallax:number }
interface GridLine { x:number; y:number; w:number; h:number; pulsePhase:number; pulseSpeed:number; opacity:number }
interface WindLine { points:{x:number;y:number}[]; speed:number; phase:number; opacity:number; width:number }
interface Pathway { angle:number; particles:PathParticle[]; opacity:number }
interface PathParticle { dist:number; speed:number; size:number; opacity:number }
interface Leaf { x:number; y:number; vx:number; vy:number; rotation:number; rotSpeed:number; scale:number; opacity:number; phase:number }
interface Ring { radius:number; speed:number; angle:number; opacity:number; tilt:number }
interface Flare { angle:number; length:number; maxLen:number; opacity:number; width:number; life:number; maxLife:number }
interface Wave { radius:number; maxR:number; speed:number; opacity:number; width:number }

export default function ThemeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const c = canvas.getContext('2d')
    if (!c) return
    const ctx: CanvasRenderingContext2D = c

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let W = window.innerWidth
    let H = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const cx = () => W / 2
    const cy = () => H * 0.38

    /* ---------- init ---------- */

    // Layer 1: atmospheric particles (stars → energy motes)
    const motes: Star[] = []
    for (let i = 0; i < 60; i++) {
      motes.push({
        x: rand(0, W), y: rand(0, H * 0.7),
        size: rand(0.5, 2.5), opacity: rand(0.15, 0.5),
        speed: rand(0.3, 1.2), phase: rand(0, Math.PI * 2),
      })
    }

    // Layer 2: sunlight rays
    const sunRays: SunRay[] = []
    for (let i = 0; i < 12; i++) {
      sunRays.push({
        angle: (i / 12) * Math.PI * 2 + rand(-0.15, 0.15),
        width: rand(20, 60), opacity: rand(0.02, 0.06),
        speed: rand(0.3, 0.8), phase: rand(0, Math.PI * 2),
        length: rand(W * 0.4, W * 0.7),
      })
    }

    // Layer 3: landscape layers (now cosmic nebulas/mountains)
    const landscapes: Landscape[] = []
    const landColors = [
      [5, 0, 26], [10, 0, 51], [15, 0, 77], [20, 0, 102],
    ]
    for (let i = 0; i < 4; i++) {
      const pts: number[] = []
      for (let p = 0; p <= 10; p++) pts.push(rand(-30, 40))
      landscapes.push({
        yOffset: H * (0.55 + i * 0.1),
        color: landColors[i],
        opacity: 0.3 + i * 0.15,
        speed: rand(0.001, 0.003),
        points: pts,
        parallax: 0.2 + i * 0.3,
      })
    }

    // Layer 4: solar grids
    const gridLines: GridLine[] = []
    for (let i = 0; i < 5; i++) {
      gridLines.push({
        x: rand(W * 0.05, W * 0.8),
        y: rand(H * 0.5, H * 0.85),
        w: rand(60, 140), h: rand(40, 90),
        pulsePhase: rand(0, Math.PI * 2),
        pulseSpeed: rand(0.02, 0.05),
        opacity: rand(0.04, 0.1),
      })
    }

    // Layer 5: wind currents
    const windLines: WindLine[] = []
    for (let i = 0; i < 10; i++) {
      const pts: {x:number;y:number}[] = []
      let wx = -50
      const wy = rand(H * 0.1, H * 0.8)
      for (let p = 0; p < 6; p++) {
        pts.push({ x: wx, y: wy + rand(-60, 60) })
        wx += (W + 100) / 5
      }
      windLines.push({
        points: pts, speed: rand(0.4, 1.0),
        phase: rand(0, Math.PI * 2), opacity: rand(0.06, 0.15),
        width: rand(0.5, 2),
      })
    }

    // Layer 6: energy pathways
    const pathways: Pathway[] = []
    const angles = [-0.5, -0.25, 0, 0.25, 0.5]
    angles.forEach((ang, i) => {
      const parts: PathParticle[] = []
      for (let p = 0; p < 6; p++) {
        parts.push({ dist: rand(0, 1), speed: rand(0.3, 0.7), size: rand(1.5, 3.5), opacity: rand(0.2, 0.5) })
      }
      pathways.push({ angle: ang + rand(-0.06, 0.06), particles: parts, opacity: 0.08 + i * 0.02 })
    })

    // Layer 7: floating stardust / energy
    const leaves: Leaf[] = []
    for (let i = 0; i < 8; i++) {
      leaves.push({
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.3, 0.3), vy: rand(-0.2, -0.05),
        rotation: rand(0, Math.PI * 2), rotSpeed: rand(-0.008, 0.008),
        scale: rand(0.2, 0.5), opacity: rand(0.3, 0.6),
        phase: rand(0, Math.PI * 2),
      })
    }

    // Layer 8: orbital rings
    const rings: Ring[] = []
    for (let i = 0; i < 5; i++) {
      rings.push({
        radius: 100 + i * 50, speed: rand(0.04, 0.15) * (i % 2 === 0 ? 1 : -1),
        angle: rand(0, Math.PI * 2), opacity: rand(0.03, 0.08),
        tilt: rand(0.12, 0.35),
      })
    }

    // Layer 9: solar core
    const flares: Flare[] = []
    for (let i = 0; i < 10; i++) {
      flares.push({
        angle: (i / 10) * Math.PI * 2 + rand(-0.3, 0.3),
        length: 0, maxLen: rand(25, 60), opacity: 0,
        width: rand(0.5, 2), life: rand(0, 120), maxLife: rand(50, 150),
      })
    }
    const waves: Wave[] = []
    for (let i = 0; i < 4; i++) {
      waves.push({ radius: 15 + i * 12, maxR: 180 + i * 50, speed: rand(0.25, 0.5), opacity: rand(0.08, 0.18), width: rand(0.5, 1.5) })
    }

    /* ---------- draw helpers ---------- */

    function drawSkyBase() {
      // Cosmic void → deep space gradient base
      const grad = ctx.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, rgba(C.forestDeep, 1))
      grad.addColorStop(0.5, rgba(C.forestMid, 1))
      grad.addColorStop(1, rgba(C.emerald, 1))
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)

      // Atmospheric light layer (neon glow from top)
      const atmo = ctx.createRadialGradient(cx(), -H * 0.1, 0, cx(), H * 0.3, W * 0.8)
      atmo.addColorStop(0, rgba(C.gold, 0.06))
      atmo.addColorStop(0.5, 'rgba(0,200,255,0)')
      ctx.fillStyle = atmo
      ctx.fillRect(0, 0, W, H)
    }

    function drawMotes(t: number) {
      motes.forEach(m => {
        const twinkle = Math.sin(t * 0.008 * m.speed + m.phase) * 0.3 + 0.7
        const o = m.opacity * twinkle

        // Golden-green energy motes
        ctx.beginPath()
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2)
        ctx.fillStyle = rgba(C.goldBright, o * 0.5)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(m.x, m.y, m.size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = rgba(C.warmWhite, o)
        ctx.fill()

        if (m.size > 1.5) {
          ctx.beginPath()
          ctx.arc(m.x, m.y, m.size * 4, 0, Math.PI * 2)
          const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size * 4)
          g.addColorStop(0, rgba(C.gold, o * 0.15))
          g.addColorStop(1, 'rgba(0,200,255,0)')
          ctx.fillStyle = g
          ctx.fill()
        }
      })
    }

    function drawSunRays(t: number) {
      const scx = cx()
      const scy = cy()

      sunRays.forEach(r => {
        const sway = Math.sin(t * 0.003 * r.speed + r.phase) * 0.04
        const ang = r.angle + sway
        const o = r.opacity * (0.6 + Math.sin(t * 0.005 + r.phase) * 0.4)

        ctx.save()
        ctx.translate(scx, scy)
        ctx.rotate(ang)

        const grad = ctx.createLinearGradient(0, 0, r.length, 0)
        grad.addColorStop(0, rgba(C.goldBright, o * 0.6))
        grad.addColorStop(0.3, rgba(C.gold, o * 0.2))
        grad.addColorStop(1, 'rgba(0,200,255,0)')

        ctx.fillStyle = grad
        ctx.fillRect(0, -r.width / 2, r.length, r.width)
        ctx.restore()
      })
    }

    function drawLandscapes(t: number) {
      landscapes.forEach((l, li) => {
        const parallaxX = Math.sin(t * 0.001 * l.parallax) * 15
        const baseY = l.yOffset + Math.sin(t * 0.0008 * l.speed) * 5

        ctx.save()
        ctx.globalAlpha = l.opacity * 0.4

        ctx.beginPath()
        ctx.moveTo(0, H)
        ctx.lineTo(0, baseY)

        for (let p = 0; p < l.points.length; p++) {
          const px = (p / (l.points.length - 1)) * W + parallaxX
          const py = baseY + l.points[p] * (1 + li * 0.5)
          if (p === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }

        ctx.lineTo(W, baseY)
        ctx.lineTo(W, H)
        ctx.closePath()

        const grad = ctx.createLinearGradient(0, baseY - 20, 0, H)
        grad.addColorStop(0, rgba(l.color, 0.3))
        grad.addColorStop(1, rgba(l.color, 0.8))
        ctx.fillStyle = grad
        ctx.fill()
        ctx.restore()
      })
    }

    function drawSolarGrids(t: number) {
      gridLines.forEach(g => {
        const pulse = Math.sin(t * g.pulseSpeed + g.pulsePhase) * 0.5 + 0.5

        ctx.save()
        ctx.globalAlpha = g.opacity
        ctx.strokeStyle = rgba(C.leafLight, 0.5)
        ctx.lineWidth = 0.5

        const cols = 5
        const rows = 3
        const cw = g.w / cols
        const ch = g.h / rows

        for (let r = 0; r <= rows; r++) {
          ctx.beginPath()
          ctx.moveTo(g.x, g.y + r * ch)
          ctx.lineTo(g.x + g.w, g.y + r * ch)
          ctx.stroke()
        }
        for (let c = 0; c <= cols; c++) {
          ctx.beginPath()
          ctx.moveTo(g.x + c * cw, g.y)
          ctx.lineTo(g.x + c * cw, g.y + g.h)
          ctx.stroke()
        }

        // Energy pulse traveling through grid
        const pulseX = g.x + (pulse * g.w)
        const pulseY = g.y + g.h / 2
        ctx.beginPath()
        ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2)
        const gGrad = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 8)
        gGrad.addColorStop(0, rgba(C.goldBright, 0.8))
        gGrad.addColorStop(1, 'rgba(0,255,255,0)')
        ctx.fillStyle = gGrad
        ctx.fill()

        ctx.restore()
      })
    }

    function drawWindCurrents(t: number) {
      windLines.forEach(wl => {
        const sway = Math.sin(t * 0.004 + wl.phase) * 20

        ctx.save()
        ctx.globalAlpha = wl.opacity

        const pts = wl.points.map((p, i) => ({
          x: p.x,
          y: p.y + Math.sin(t * 0.006 + i * 1.3) * 12 + sway * (i / wl.points.length),
        }))

        // Draw flowing curve
        ctx.strokeStyle = rgba(C.skyTone, 0.4)
        ctx.lineWidth = wl.width
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let i = 1; i < pts.length - 2; i++) {
          const cpx = (pts[i].x + pts[i + 1].x) / 2
          const cpy = (pts[i].y + pts[i + 1].y) / 2
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, cpx, cpy)
        }
        if (pts.length > 2) {
          const last = pts[pts.length - 1]
          ctx.quadraticCurveTo(pts[pts.length - 2].x, pts[pts.length - 2].y, last.x, last.y)
        }
        ctx.stroke()

        // Traveling particles along wind
        const tp = (t * wl.speed * 0.01 + wl.phase) % 1
        const idx = tp * (pts.length - 1)
        const i0 = Math.floor(idx)
        const i1 = Math.min(i0 + 1, pts.length - 1)
        const f = idx - i0
        const px = pts[i0].x + (pts[i1].x - pts[i0].x) * f
        const py = pts[i0].y + (pts[i1].y - pts[i0].y) * f

        ctx.beginPath()
        ctx.arc(px, py, 2, 0, Math.PI * 2)
        ctx.fillStyle = rgba(C.warmWhite, 0.5)
        ctx.fill()

        ctx.restore()
      })
    }

    function drawPathways() {
      const scx = cx()
      const scy = cy() + H * 0.12

      pathways.forEach(pw => {
        ctx.save()
        ctx.globalAlpha = pw.opacity

        const dx = Math.sin(pw.angle)
        const dy = -Math.cos(pw.angle)
        const sx = scx - dx * W * 0.7
        const sy = scy - dy * H * 0.6
        const ex = scx + dx * W * 0.25
        const ey = scy + dy * H * 0.2

        // Pathway line
        const grad = ctx.createLinearGradient(sx, sy, ex, ey)
        grad.addColorStop(0, rgba(C.leaf, 0.05))
        grad.addColorStop(0.5, rgba(C.gold, 0.15))
        grad.addColorStop(1, rgba(C.goldBright, 0.35))
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(ex, ey)
        ctx.stroke()

        // Traveling energy particles
        pw.particles.forEach(p => {
          p.dist += p.speed * 0.003
          if (p.dist > 1) p.dist = 0

          const px = sx + (ex - sx) * p.dist
          const py = sy + (ey - sy) * p.dist
          const bright = 0.5 + p.dist * 0.5

          ctx.beginPath()
          ctx.arc(px, py, p.size * bright, 0, Math.PI * 2)
          ctx.fillStyle = rgba(C.goldBright, p.opacity * bright)
          ctx.fill()

          // Glow
          ctx.beginPath()
          ctx.arc(px, py, p.size * 3, 0, Math.PI * 2)
          const g = ctx.createRadialGradient(px, py, 0, px, py, p.size * 3)
          g.addColorStop(0, rgba(C.gold, p.opacity * bright * 0.2))
          g.addColorStop(1, 'rgba(0,200,255,0)')
          ctx.fillStyle = g
          ctx.fill()
        })

        ctx.restore()
      })
    }

    function drawLeaves(t: number) {
      leaves.forEach(leaf => {
        leaf.x += leaf.vx + Math.sin(t * 0.002 + leaf.phase) * 0.3
        leaf.y += leaf.vy + Math.cos(t * 0.0015 + leaf.phase) * 0.1
        leaf.rotation += leaf.rotSpeed

        if (leaf.y < -30) { leaf.y = H + 30; leaf.x = rand(0, W) }
        if (leaf.x < -30) leaf.x = W + 30
        if (leaf.x > W + 30) leaf.x = -30

        ctx.save()
        ctx.translate(leaf.x, leaf.y)
        ctx.rotate(leaf.rotation)
        ctx.scale(leaf.scale, leaf.scale)
        ctx.globalAlpha = leaf.opacity

        // Stardust shape (diamond star)
        ctx.beginPath()
        ctx.moveTo(0, -15)
        ctx.quadraticCurveTo(2, -2, 15, 0)
        ctx.quadraticCurveTo(2, 2, 0, 15)
        ctx.quadraticCurveTo(-2, 2, -15, 0)
        ctx.quadraticCurveTo(-2, -2, 0, -15)
        
        ctx.fillStyle = rgba(C.leafLight, 0.9)
        ctx.fill()

        // Glow
        ctx.beginPath()
        ctx.arc(0, 0, 25, 0, Math.PI * 2)
        const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, 25)
        sg.addColorStop(0, rgba(C.leaf, 0.5))
        sg.addColorStop(1, 'rgba(140,100,255,0)')
        ctx.fillStyle = sg
        ctx.fill()

        ctx.restore()
      })
    }

    function drawRings(t: number) {
      rings.forEach(r => {
        const rot = r.angle + t * r.speed * 0.01

        ctx.save()
        ctx.translate(cx(), cy())
        ctx.rotate(rot)
        ctx.scale(1, r.tilt)

        ctx.beginPath()
        ctx.arc(0, 0, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = rgba(C.leaf, r.opacity)
        ctx.lineWidth = 0.8
        ctx.stroke()

        // Dashed segments
        for (let s = 0; s < 4; s++) {
          const sa = (s / 4) * Math.PI * 2 + t * 0.01
          const sx = Math.cos(sa) * r.radius
          const sy = Math.sin(sa) * r.radius
          ctx.beginPath()
          ctx.arc(sx, sy, 2, 0, Math.PI * 2)
          ctx.fillStyle = rgba(C.gold, r.opacity * 1.5)
          ctx.fill()
        }

        ctx.restore()
      })
    }

    function drawSolarCore(t: number) {
      const ccx = cx()
      const ccy = cy()

      // Warm cosmic glow
      const glow = ctx.createRadialGradient(ccx, ccy, 0, ccx, ccy, 140)
      glow.addColorStop(0, rgba(C.gold, 0.12))
      glow.addColorStop(0.3, rgba(C.gold, 0.04))
      glow.addColorStop(1, 'rgba(0,200,255,0)')
      ctx.beginPath()
      ctx.arc(ccx, ccy, 140, 0, Math.PI * 2)
      ctx.fillStyle = glow
      ctx.fill()

      // Expanding energy waves
      waves.forEach(w => {
        w.radius += w.speed
        w.opacity -= 0.001
        if (w.opacity <= 0 || w.radius > w.maxR) {
          w.radius = 15 + waves.indexOf(w) * 12
          w.opacity = rand(0.1, 0.18)
        }
        ctx.save()
        ctx.globalAlpha = Math.max(0, w.opacity)
        ctx.beginPath()
        ctx.arc(ccx, ccy, w.radius, 0, Math.PI * 2)
        ctx.strokeStyle = rgba(C.goldBright, 0.8)
        ctx.lineWidth = w.width
        ctx.stroke()
        ctx.restore()
      })

      // Solar flares
      flares.forEach(f => {
        f.life++
        if (f.life > f.maxLife) {
          f.life = 0
          f.maxLife = rand(50, 150)
          f.angle += rand(-0.4, 0.4)
        }
        const lr = f.life / f.maxLife
        f.opacity = lr < 0.2 ? lr / 0.2 : lr > 0.8 ? (1 - lr) / 0.2 : 1
        f.length = f.maxLen * Math.sin(lr * Math.PI)

        if (f.length > 2) {
          const sr = 8
          const sfx = ccx + Math.cos(f.angle) * sr
          const sfy = ccy + Math.sin(f.angle) * sr
          const efx = ccx + Math.cos(f.angle) * (sr + f.length)
          const efy = ccy + Math.sin(f.angle) * (sr + f.length)

          ctx.save()
          ctx.globalAlpha = f.opacity * 0.35
          ctx.strokeStyle = rgba(C.goldBright, 0.9)
          ctx.lineWidth = f.width
          ctx.beginPath()
          ctx.moveTo(sfx, sfy)
          ctx.lineTo(efx, efy)
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(efx, efy, f.width * 2.5, 0, Math.PI * 2)
          const fg = ctx.createRadialGradient(efx, efy, 0, efx, efy, f.width * 2.5)
          fg.addColorStop(0, rgba(C.warmWhite, f.opacity * 0.5))
          fg.addColorStop(1, 'rgba(240,237,229,0)')
          ctx.fillStyle = fg
          ctx.fill()
          ctx.restore()
        }
      })

      // Core orb
      ctx.save()
      ctx.beginPath()
      ctx.arc(ccx, ccy, 7, 0, Math.PI * 2)
      const cg = ctx.createRadialGradient(ccx, ccy, 0, ccx, ccy, 7)
      cg.addColorStop(0, rgba(C.warmWhite, 1))
      cg.addColorStop(0.5, rgba(C.goldBright, 0.8))
      cg.addColorStop(1, rgba(C.gold, 0.4))
      ctx.fillStyle = cg
      ctx.fill()

      // Inner ring
      ctx.beginPath()
      ctx.arc(ccx, ccy, 13 + Math.sin(t * 0.018) * 2, 0, Math.PI * 2)
      ctx.strokeStyle = rgba(C.gold, 0.2 + Math.sin(t * 0.012) * 0.1)
      ctx.lineWidth = 0.8
      ctx.stroke()

      // Outer ring
      ctx.beginPath()
      ctx.arc(ccx, ccy, 20 + Math.cos(t * 0.01) * 3, 0, Math.PI * 2)
      ctx.strokeStyle = rgba(C.leafLight, 0.1 + Math.sin(t * 0.008) * 0.06)
      ctx.lineWidth = 0.5
      ctx.stroke()

      ctx.restore()
    }

    /* ---------- main loop ---------- */
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      timeRef.current++
      const t = timeRef.current

      if (reduced) {
        drawSkyBase()
        drawSolarCore(0)
        return
      }

      // Base with subtle trail
      drawSkyBase()

      // Layer 1: energy motes
      drawMotes(t)

      // Layer 2: sunlight rays
      drawSunRays(t)

      // Layer 3: landscapes
      drawLandscapes(t)

      // Layer 4: solar grids
      drawSolarGrids(t)

      // Layer 5: wind currents
      drawWindCurrents(t)

      // Layer 6: energy pathways
      drawPathways()

      // Layer 7: nature leaves
      drawLeaves(t)

      // Layer 8: orbital rings
      drawRings(t)

      // Layer 9: solar core
      drawSolarCore(t)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
