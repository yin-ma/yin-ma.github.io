let display = document.querySelector(".display-mid")
let shuffleBtn = document.querySelector(".btn-shuffle")
let barsSlider = document.querySelector(".slider-bars")
let speedSlider = document.querySelector(".slider-speed")
let sortBtn = document.querySelector(".btn-sort")
let algos = document.querySelectorAll("a.algo")
let hideButt = document.querySelector(".hide-btn")
let controller = document.querySelector(".controller")
let title = document.querySelector("a.title")
let algoList = document.querySelector(".algo-list")

const algoChoice = {
    "bubble sort": bubbleSort,
    "selection sort": selectionSort,
    "quick sort": quickSort,
    "merge sort": mergeSort
}

const sleep = ms => new Promise(res => setTimeout(res, ms))

function genRandPositiveInt(n) {
    return Math.floor(Math.random()*(n) + 1)
}


class Visualizer {
    constructor(displayHTMLElement) {
        this.display = displayHTMLElement
        this.bars = displayHTMLElement.children
        this.numOfBars = 30
        this.initBar()
        this.speed = 1
    }

    initBar() {
        this.genRandomBars()
        this.renderAllBars()
    }

    setBarVal(idx, val) {
        this.bars[idx].setAttribute("value" , val)
    }

    renderBar(idx) {
        this.bars[idx].style["height"] = Math.floor(new Number(this.bars[idx].getAttribute("value"))/this.numOfBars*100) + "%"
    }

    renderAllBars() {
        for (let i=0; i < this.bars.length; i++) { this.renderBar(i) }
        }
    
    genRandomBars() {
        this.display.innerHTML = ""
        for (let i=0; i < this.numOfBars; i++) {
            let node = document.createElement("div")
            node.classList.add("bar")
            const num = genRandPositiveInt(this.numOfBars).toString()
            node.setAttribute("value", num)
            this.display.appendChild(node)
        }
    }

    getBarValue(idx) { return new Number(this.bars[idx].getAttribute("value")) }

    toggleBar(idx, cls) {
        this.bars[idx].classList.toggle(cls)
    }
}

async function bubbleSort() {
    for (let i = 0; i < visualizer.numOfBars; i++) {
        let isSorted = true
        for (let j = 1; j < visualizer.numOfBars-i; j++) {
            let l = visualizer.getBarValue(j-1)
            let r = visualizer.getBarValue(j)
            visualizer.toggleBar(j-1, "active")
            visualizer.toggleBar(j, "active")

            if (l > r) {
                visualizer.setBarVal(j-1, r)
                visualizer.setBarVal(j, l)
                visualizer.renderBar(j)
                visualizer.renderBar(j-1)
                isSorted = false
            }    
            await sleep(visualizer.speed)
            visualizer.toggleBar(j-1, "active")
            visualizer.toggleBar(j, "active")
            await sleep(visualizer.speed)
        }    
        if (isSorted) break
    }    
}    

async function selectionSort() {
    for (let i = 0; i < visualizer.numOfBars; i++) {
        tempMax = -1
        tempIdx = -1
        let lastidx = 0
        for (let j = 0; j < visualizer.numOfBars-i; j++) {
            let val = visualizer.getBarValue(j)
            lastidx = j
            visualizer.toggleBar(j, "active")

            if (val >= tempMax) {
                if (tempIdx >= 0) {
                    await sleep(visualizer.speed)
                    visualizer.toggleBar(tempIdx, "active")
                }
                tempMax = val
                tempIdx = j

            } else {
                await sleep(visualizer.speed)
                visualizer.toggleBar(j, "active")
            }
        }
        
        if (tempIdx !== lastidx) visualizer.toggleBar(lastidx, "active")
        await sleep(visualizer.speed)
        let lastItem = visualizer.getBarValue(lastidx)
        visualizer.setBarVal(lastidx, tempMax)
        visualizer.setBarVal(tempIdx, lastItem)
        
        visualizer.renderBar(tempIdx)
        visualizer.renderBar(lastidx)
        visualizer.toggleBar(tempIdx, "active")
        if (tempIdx !== lastidx) visualizer.toggleBar(lastidx, "active")
    }
}

async function quickSort() {
    async function helper(l, r) {
        if (l >= r) return 
        let pivot = r
        let pointerL = l
        let pointerR = r-1

        visualizer.toggleBar(pivot, "active")
        visualizer.toggleBar(pointerL, "active")
        visualizer.toggleBar(pointerR, "active")
        await sleep(visualizer.speed)
        
        // partition
        while (pointerL <= pointerR) {
            if (visualizer.getBarValue(pointerL) <= visualizer.getBarValue(pivot)) {
                visualizer.toggleBar(pointerL, "active")
                pointerL += 1
                await sleep(visualizer.speed)
                visualizer.toggleBar(pointerL, "active")
                await sleep(visualizer.speed)
            } else {
                while (pointerL <= pointerR) {
                    if (visualizer.getBarValue(pointerR) >= visualizer.getBarValue(pivot)) {
                        visualizer.toggleBar(pointerR, "active")
                        await sleep(visualizer.speed)
                        pointerR -= 1
                        if (pointerR >= 0) {
                            visualizer.toggleBar(pointerR, "active")
                            await sleep(visualizer.speed)
                        } 
                    } else {
                        let tempR = visualizer.getBarValue(pointerR)
                        let tempL = visualizer.getBarValue(pointerL)
                        visualizer.setBarVal(pointerL, tempR)
                        visualizer.setBarVal(pointerR, tempL)
                        visualizer.renderBar(pointerL)
                        visualizer.renderBar(pointerR)
                        visualizer.toggleBar(pointerR, "active")
                        visualizer.toggleBar(pointerL, "active")
                        await sleep(visualizer.speed)
                        pointerL += 1
                        pointerR -= 1
                        visualizer.toggleBar(pointerR, "active")
                        visualizer.toggleBar(pointerL, "active")
                        await sleep(visualizer.speed)
                        break
                    }
                }
            }
        }
        let tempP = visualizer.getBarValue(pivot)
        let tempL = visualizer.getBarValue(pointerL)
        visualizer.setBarVal(pointerL, tempP)
        visualizer.setBarVal(pivot, tempL)
        visualizer.renderBar(pointerL)
        visualizer.renderBar(pivot)
        await sleep(visualizer.speed)
        visualizer.toggleBar(pivot, "active")
        visualizer.toggleBar(pointerL, "active")
        if (pointerR >= 0) {
            visualizer.toggleBar(pointerR, "active")
        }
        await helper(l, pointerL-1)
        await helper(pointerL+1, r)
    }
    await helper(0, visualizer.bars.length-1)
}

async function mergeSort() {
    async function merge(l1, l2, r1, r2) {
        res = []
        let l = l1
        let r = r1
        visualizer.toggleBar(r, "active")
        visualizer.toggleBar(l, "active")
        await sleep(visualizer.speed)
        while (l <= l2 && r <= r2) {
            if (visualizer.getBarValue(l) <= visualizer.getBarValue(r)) {
                visualizer.toggleBar(l, "active")
                await sleep(visualizer.speed)
                res.push(visualizer.getBarValue(l))
                l += 1
                if (l <= l2) {
                    visualizer.toggleBar(l, "active")
                    await sleep(visualizer.speed)
                } else {
                    visualizer.toggleBar(r, "active")
                    await sleep(visualizer.speed)
                }
            } else {
                visualizer.toggleBar(r, "active")
                await sleep(visualizer.speed)
                res.push(visualizer.getBarValue(r))
                r += 1
                if (r <= r2) {
                    visualizer.toggleBar(r, "active")
                    await sleep(visualizer.speed)
                } else {
                    visualizer.toggleBar(l, "active")
                    await sleep(visualizer.speed)
                }
            }
        }

        if (l <= l2) {
            for (let i=l; i < l2+1; i++) {
                if (i !== l) {
                    visualizer.toggleBar(i-1, "active")
                    await sleep(visualizer.speed)
                } 
                visualizer.toggleBar(i, "active")
                await sleep(visualizer.speed)
                res.push(visualizer.getBarValue(i))
            } 
            visualizer.toggleBar(l2, "active")
            await sleep(visualizer.speed)
        } else {
            for (let i=r; i < r2+1; i++) {
                if (i !== r) {
                    visualizer.toggleBar(i-1, "active")
                    await sleep(visualizer.speed)
                } 
                visualizer.toggleBar(i, "active")
                await sleep(visualizer.speed)
                res.push(visualizer.getBarValue(i))
            }
            visualizer.toggleBar(r2, "active")
            await sleep(visualizer.speed)
        } 

        return res
    }

    async function helper(l, r) {
        if (l >= r) return
        let mid = Math.floor((l+r) / 2)
        await helper(l, mid)
        await helper(mid+1, r)
        let temp = await merge(l, mid, mid+1, r)
        let idx = 0
        for (let i = l; i < r+1; i++) {
            visualizer.toggleBar(i, "active")
            await sleep(visualizer.speed)
            visualizer.setBarVal(i, temp[idx])
            visualizer.renderBar(i)
            visualizer.toggleBar(i, "active")
            await sleep(visualizer.speed)
            idx += 1
        }
    }
    await helper(0, visualizer.numOfBars-1)
}

const visualizer = new Visualizer(display)

shuffleBtn.addEventListener("click", () => {
    visualizer.initBar()
})    

barsSlider.addEventListener("input", e => {
    visualizer.numOfBars = e.target.value
    e.target.previousElementSibling.innerHTML = `bar ${e.target.value}`
    visualizer.initBar()
})    

speedSlider.addEventListener("input", e => {
    visualizer.speed = -e.target.value
    e.target.previousElementSibling.innerHTML = `speed ${(1/-e.target.value).toFixed(3)}`
})    

algos.forEach(a => {
    a.addEventListener("click", () => {
        algos.forEach(target => {
            target.classList.remove("active")
        })
        a.classList.add("active")
    })
})

sortBtn.addEventListener("click", async (e) => {
    barsSlider.classList.toggle("sorting")
    e.target.classList.toggle("sorting")
    shuffleBtn.classList.toggle("sorting")
    let targetAlgo
    algos.forEach(al => {
        if (al.matches(".active")) {
            targetAlgo = al.innerHTML
        }
    })

    await algoChoice[targetAlgo]()
    barsSlider.classList.toggle("sorting")
    e.target.classList.toggle("sorting")
    shuffleBtn.classList.toggle("sorting")
})

hideButt.addEventListener("click", () => {
    controller.classList.toggle("active")
})

title.addEventListener("click", (e) => {
    algoList.classList.toggle("active")
    e.target.classList.toggle("active")
})