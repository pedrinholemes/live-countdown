export function render(countDown) {
  const hours = countDown.getHours()
  const minutes = countDown.getMinutes()
  const seconds = countDown.getSeconds()

  const hoursElement = document.querySelector('span#hour')
  const minutesElement = document.querySelector('span#minute')
  const secondsElement = document.querySelector('span#second')

  if(hours > 0) {
    hoursElement.style.display = 'inline'
    document.querySelector('span#hour-divider').style.display = 'inline'
  } else {
    hoursElement.style.display = 'none'
    document.querySelector('span#hour-divider').style.display = 'none'
  }
  hoursElement.innerHTML = String(hours).padStart(2, '0')
  minutesElement.innerHTML = String(minutes).padStart(2, '0')
  secondsElement.innerHTML = String(seconds).padStart(2, '0')
}
