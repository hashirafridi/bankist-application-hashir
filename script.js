'use strict'
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z'
  ],
  currency: 'EUR',
  locale: 'pt-PT' // de-DE
}

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2024-09-18T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z'
  ],
  currency: 'USD',
  locale: 'en-US'
}

const accounts = [account1, account2]

/////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome')
const labelDate = document.querySelector('.date')
const labelBalance = document.querySelector('.balance__value')
const labelSumIn = document.querySelector('.summary__value--in')
const labelSumOut = document.querySelector('.summary__value--out')
const labelSumInterest = document.querySelector('.summary__value--interest')
const labelTimer = document.querySelector('.timer')

const containerApp = document.querySelector('.app')
const containerMovements = document.querySelector('.movements')

const btnLogin = document.querySelector('.login__btn')
const btnTransfer = document.querySelector('.form__btn--transfer')
const btnLoan = document.querySelector('.form__btn--loan')
const btnClose = document.querySelector('.form__btn--close')
const btnSort = document.querySelector('.btn--sort')

const inputLoginUsername = document.querySelector('.login__input--user')
const inputLoginPin = document.querySelector('.login__input--pin')
const inputTransferTo = document.querySelector('.form__input--to')
const inputTransferAmount = document.querySelector('.form__input--amount')
const inputLoanAmount = document.querySelector('.form__input--loan-amount')
const inputCloseUsername = document.querySelector('.form__input--user')
const inputClosePin = document.querySelector('.form__input--pin')

/////////////////////////////////////////////////
//////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling']
])

let currentAccount;
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//////  Display dates on transictions
const displayDates= function(date,locale){
  const calcDaysPassed = (date,date2) =>{
    return Math.round(Math.abs((date - date2)/(1000 *60 *60*24)));
}
const daysPassed = calcDaysPassed(new Date(),date);
if(daysPassed === 0) return `Today`;
if(daysPassed===1) return `One day ago`;
if(daysPassed===2) return `Two day ago`;
if(daysPassed <= 7) return `${daysPassed} days ago`;
else{                                ///// we can remove else because iff if stat not exec below willl execution

  //// we dont ned time so need for minuters and hours
  return new Intl.DateTimeFormat(locale).format(date);
}}

function displayMovements (acc, sort = false) {
  
  containerMovements.innerHTML = '';
  const mov = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  mov.forEach((value, i) => {
  const type = value > 0 ? 'deposit' : 'withdrawal';
  const date = new Date(acc.movementsDates[i]);
  const displayDate = displayDates(date,acc.locale);
  const amountFormat = amountFormater(value);
    const html = `
  <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i +
      1}  :  ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${amountFormat}</div>
  </div>
  `
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}

function DisplayBalance (account) {
  account.Balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  const balanceFormat = amountFormater(account.Balance);
  labelBalance.textContent = `${balanceFormat}`
}

// DisplayBalance(accounts);
function DisplaySummary (acc) {
  const totalSummary = acc.movements
    .filter(val => val > 0)
    .reduce((acc, val) => acc + val, 0);
    const totalSummaryFormat = amountFormater(totalSummary)
  labelSumIn.textContent = `${totalSummaryFormat}`
  const totalOutGoing = acc.movements
    .filter(val => val < 0)
    .reduce((acc, val) => acc + val, 0);
  const totalOutFormat = amountFormater(totalOutGoing);
  labelSumOut.textContent = `${totalOutFormat}`;
  const totalInterest = acc.movements
    .filter(val => val > 0)
    .map(val => (val * acc.interestRate) / 100)
    .filter(val => val >= 1)
    .reduce((acc, int) => acc + int, 0);
    const interestFormat = amountFormater(totalInterest);
  labelSumInterest.textContent = `${interestFormat}`
}
///// usernames
const createUserNAmes = function (accs) {
  accs.forEach(function (x) {
    x.user = x.owner
      .toLowerCase()
      .split(' ')
      .map(n => n[0])
      .join('')
  })
}
createUserNAmes(accounts)
//// Display UI
const displayUI = function (currentAccount) {
  displayMovements(currentAccount)
  DisplayBalance(currentAccount)
  DisplaySummary(currentAccount)
}
////////// transfer code      ////////////////
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault()
  const reciever = accounts.find(acc => inputTransferTo.value === acc.user)
  const amount = +inputTransferAmount.value
  if (
    amount > 0 &&
    reciever &&
    amount <= currentAccount.Balance &&
    reciever.user !== currentAccount.user
  ) {
    reciever.movements.push(amount);
    currentAccount.movements.push(-amount);
    //// dispaly date for transfer and recieve
    currentAccount.movementsDates.push(new Date().toISOString());
    reciever.movementsDates.push(new Date().toISOString());
    // displayUI(); udated
    displayUI(currentAccount)
  }
  inputTransferTo.value = inputTransferAmount.value = ''
})
////////////////////  Delete acc ////////////////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault()
  if (
    inputCloseUsername.value === currentAccount.user &&
    +inputClosePin.value === currentAccount.pin
  ) {
    let index = accounts.findIndex(acc => acc.user === currentAccount.user)
    accounts.splice(index, 1)
    containerApp.style.opacity = 0
  }
  inputCloseUsername.value = inputClosePin.value = ''
  inputClosePin.blur()
})
//////////// loan amount //////////
btnLoan.addEventListener('click', function (e) {
  e.preventDefault()
  const loan = Math.round(inputLoanAmount.value);

  if (loan > 0 && currentAccount.movements.some(val => val >= loan * 0.1)) {
       setTimeout (function() {
    currentAccount.movements.push(loan);
    /// loan date update
    currentAccount.movementsDates.push(new Date().toISOString());
    displayUI(currentAccount);
          },2000)
  }
  inputLoanAmount.value = ''
})
//////////////////// sort amount ////////////////////////
let sorted = false
btnSort.addEventListener('click', function (e) {
  e.preventDefault()
  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted
})

///////// login Code   ////////////

btnLogin.addEventListener('click', function (e) {
  e.preventDefault()
  currentAccount = accounts.find(acc => inputLoginUsername.value === acc.user)
  //// Display UI and Msg
  if (currentAccount?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 100
    labelWelcome.textContent = `WellCome \u00A0 ${
      currentAccount.owner.split(' ')[0]
    } `
    //////////////////////////////
////// Update dates
const now = new Date();
// const locale = navigator.language;          //// give your current lang and country from brwoser
const options = {
  year: 'numeric',
  day: '2-digit',
  month:'2-digit',
  hour:'2-digit',
  minute: '2-digit',
  // weekday: 'long'
}
labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,options).format(now);
  }
  //// clear input fields
  inputLoginPin.value = inputLoginUsername.value = ''
  inputLoginPin.blur()
  //// Display whole UI   {movements       balance     summary}
  displayUI(currentAccount);
});

//////// update amounts formate
function amountFormater(amount) {
 return new Intl.NumberFormat(currentAccount.locale,{
    style: 'currency',
    currency: currentAccount.currency,
    }).format(amount);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////
//// fake login

currentAccount = account1
displayUI(currentAccount)
containerApp.style.opacity = 100

///// practicewith date API





