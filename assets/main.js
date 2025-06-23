const URL = 'https://flagcdn.com/pt/codes.json'
const btn = document.querySelector('#send-flag')
const btnNew = document.querySelector('#new-game')
const result = document.querySelector('#result')
const attemptsField = document.querySelector('#attempts-field')
const countryList = document.querySelector('.country-list')
const inputElement = document.querySelector('#country-input')
let nowCountry = null

async function getFlag() {
    const response = await fetch(URL)
    const data = await response.json()
    const dataKeys = Object.keys(data)
    const randomIndex = Math.floor(Math.random() * dataKeys.length)
    const countryCode = dataKeys[randomIndex] // abreviação ex. "br", "fr"
    const countryName = data[countryCode] // nome inteiro ex. "Brasil", "França"

    return { countryCode, countryName }
}

async function showFlag() {
    nowCountry = await getFlag()
    console.log(nowCountry)
    const imageId = nowCountry.countryCode
    document.querySelector('#flagInput').src = `https://flagcdn.com/${imageId}.svg`
}

let attempts = 5
attemptsField.textContent = `Tentativas: 5`
async function hitFlag() {
    const userInput = inputElement.value.trim()
    const normalize = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const inputNormalized = normalize(userInput)
    const countryNormalized = normalize(nowCountry.countryName).replace('-', ' ')

    const li = document.createElement('li')

    if (userInput === '' || userInput.length < 3 ) {
        return
    }

    if (inputNormalized === countryNormalized) {
        result.textContent = `Você Acertou! O país era: ${nowCountry.countryName}`
        inputElement.value = ''
        li.append(nowCountry.countryName)
        countryList.appendChild(li)
        attempts = 5
    } else {
        li.append(userInput.charAt(0).toUpperCase() + userInput.slice(1))
        countryList.appendChild(li)
        inputElement.value = ''
        inputElement.focus()
        attempts--
        attemptsField.textContent = `Tentativas: ${attempts}`;
        if (attempts === 0) {
            result.textContent = `Acabou as tentativas! País: ${nowCountry.countryName}`
            btn.disabled = true
            attempts = 5
        }
        return
    }
    
}


btn.addEventListener('click', () => {
    hitFlag()
})

inputElement.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        hitFlag()
    }
})

btnNew.addEventListener('click', () => {
    reset()
    btn.disabled = false
    result.textContent = ''
    countryList.innerHTML = ''
})

const reset = window.onload = () => {
    showFlag();
    attemptsField.textContent = `Tentativas: ${attempts}`;
} 