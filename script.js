let dayDisplayTimer;
let monthDisplayTimer;
let yearDisplayTimer;

const form = document.querySelector("form");
form.addEventListener("submit", validate);
const inputs = [...document.querySelectorAll("input")];
inputs.map(input => {
  input.addEventListener("input", clearWarnings);
})

function validate(e){
  e.preventDefault();
  const [day, month, year] = inputs.map(input => parseInt(input.value));
  
  const inputYear = parseInt(inputs[2].value);
  
  let stageOne = true;
  
  inputs.map((input, index) => {
    if (input.value === ""){
      setWarning(input);
      input.nextElementSibling.textContent = "This field is required";
      stageOne = false;
    }else {
      switch (index) {
        case 0:
          if ((!(parseInt(input.value) >= 1 && parseInt(input.value) <= 31)) || parseInt(input.value) === 0){
            setWarning(input);
            input.nextElementSibling.textContent = "Must be a valid day";
            stageOne = false;
          }
          break;
        case 1:
          if ((!(parseInt(input.value) >= 1 && parseInt(input.value) <= 12) || parseInt(input.value) === 0)) {
            setWarning(input);
            input.nextElementSibling.textContent = "Must be a valid month";
            stageOne = false;
          }
          break;
        case 2:
          const currentYear = new Date().getFullYear();
          if (inputYear === 0){
            setWarning(input);
            input.nextElementSibling.textContent = "Must be a valid year";
            stageOne = false;
          }
          else if(inputYear >= currentYear){
            setWarning(input);
            input.nextElementSibling.textContent = "Must be in the past";
            stageOne = false;
          }
      }
    }
  })
  let stageTwo = stageOne;
  // check if day can be 31
  const thirtyDaysMonth = [4, 6, 9, 11];
  switch ("") {
    case "":
      //check if month only has 30 days
      if (thirtyDaysMonth.includes(month)){
        if (day > 30 && stageOne){
          inputs.map(input => {
            setWarning(input);
          })
          inputs[0].nextElementSibling.textContent = "Must be a valid date";
          stageTwo = false;
          break;
        }
      }
    case "":
      //check if it's february
      if (month === 2) {
        if (isALeapYear(inputYear)) {
          if (day > 29 && passedPhase1) {
            inputs.map(input => {
              setWarning(input);
            })
            inputs[0].nextElementSibling.textContent = "Must be a valid date";
            stageTwo = false;
            break;
          }
        }else{
          if (day > 28 && stageOne){
            inputs.map(input => {
              setWarning(input);
            })
            inputs[0].nextElementSibling.textContent = "Must be a valid date";
            stageTwo = false;
          }
        }
      }
      break;
  }
  stageTwo && calculateAge();
}

function setWarning(el){
  el.previousElementSibling.style.color = "hsl(0, 100%, 67%)";
  el.style.borderColor = "hsl(0, 100%, 67%)";
}

function clearWarnings(){
  inputs.map(input => {
    input.previousElementSibling.style.color = "hsl(0, 1%, 44%)";
    input.style.borderColor = "hsl(0, 0%, 94%)";
    input.nextElementSibling.textContent = "";
  })
}

function isALeapYear(year){
  //using 1972 as leap year reference
  year = (year > 1950) ? year - 1950 : 1950 - year;
  return year % 4 === 0;
}

function calculateAge(){
  const [day, month, year] = inputs.map(input => parseInt(input.value));
  
  const today = new Date();
  const [presentDay, presentMonth, presentYear] = [today.getDate(), today.getMonth() + 1, today.getFullYear()];
  
  let ageYear = (presentMonth > month) ? presentYear - year : presentYear - year - 1;
  ageYear = (presentMonth === month && presentDay >= day) ? ageYear + 1 : ageYear;
  
  let ageMonth = (month < presentMonth) ? presentMonth - month : 12 - month + presentMonth;
  
  let ageDay = (day <= presentDay) ? presentDay - day : day - presentDay;
  
  const displays = [...document.querySelectorAll("span")];
  displays.map(display => {
    display.textContent = "--";
  })
  const [yearDisplay, monthDisplay, dayDisplay] = displays;
  
  animate("dayDisplayTimer", dayDisplay, ageDay);
  animate("monthDisplayTimer", monthDisplay, ageMonth);
  animate("yearDisplayTimer", yearDisplay, ageYear);
}

function animate(timer, element, value){
  const initialValue = (element.textContent === "--") ? 0 : parseInt(element.textContent);
  clearTimeout(eval(timer));
  if (initialValue < value){
    element.textContent = initialValue + 1;
    setTimeout(() => {
      animate(timer, element, value);
    }, 100);
  }
}