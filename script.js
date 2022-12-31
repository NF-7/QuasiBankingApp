'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Nejc Furh',
  movements: [200, 255.23, -306.5, 2000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-12-10T23:36:17.929Z',
    '2022-12-15T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-UK', // de-DE
};

const account2 = {
  owner: 'Iris Ivanis',
  movements: [2000, 1400, -150, -790, -3210, -1000, 3500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const welcomeDate = document.querySelector('.welcome_date');
const clockWelcome = document.querySelector('.clock');
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// LIVE CLOCK

const liveClock = setInterval(function () {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return (clockWelcome.textContent = `${hours}:${minutes}:${seconds}`);
}, 1000);

// LIVE DATE

const liveDate = function () {
  const today = new Date();
  const locale = 'en-UK';
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return (welcomeDate.textContent = new Intl.DateTimeFormat(
    locale,
    options
  ).format(today));
};

liveDate();

const sortMovements = function (movs, dates) {
  const arrCombined = [],
    sortedMovs = [],
    sortedDates = [];

  movs.forEach((el, i) => arrCombined.push([movs[i], dates[i]]));

  arrCombined.sort((a, b) => a[0] - b[0]);
  arrCombined.forEach(el => {
    sortedMovs.push(el[0]);
    sortedDates.push(el[1]);
  });
  return [sortedMovs, sortedDates];
};

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today'.toUpperCase();
  if (daysPassed === 1) return 'Yesterday'.toUpperCase();
  if (daysPassed <= 7) return `${daysPassed} days ago`.toUpperCase();
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formattedCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const [movs, dates] = sort
    ? sortMovements(account.movements, account.movementsDates)
    : [account.movements, account.movementsDates];

  // const movs = sort
  //   ? account.movements.slice().sort((a, b) => a - b)
  //   : account.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(dates[i]);
    const displayDate = formatMovementDate(date, account.locale);

    const formattedMovement = formattedCur(
      mov,
      account.locale,
      account.currency
    );

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}"> ${
      i + 1
    } ${type} </div>
    <div class"movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMovement}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formattedCur(
    account.balance,
    account.locale,
    account.currency
  );
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formattedCur(
    incomes,
    account.locale,
    account.currency
  );

  const calcDisplayOut = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formattedCur(
    Math.abs(calcDisplayOut),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1; // interest higher than 1€
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formattedCur(
    interest,
    account.locale,
    account.currency
  );
};

const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(initials => initials[0])
      .join('');
  });
};

createUsernames(accounts);

// UPDATE UI

const updateUI = function (account) {
  // DISPLAY MOVEMENTS

  displayMovements(account);

  // DISPLAY BALANCE

  calcPrintBalance(account);

  // DISPLAY SUMMARY

  calcDisplaySummary(account);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const seconds = String(time % 60).padStart(2, 0);
    // in each call, print remaining time to UI
    labelTimer.textContent = `${min}:${seconds}`;

    // when 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started ...`;
      containerApp.style.opacity = 0;
    }

    // Decrease 1 second

    time--;
  };

  // Set time to 5 min

  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// EVENT HANDLERS

let currentAccount, timer;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // DISPLAY UI and message

    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    } ...`;

    containerApp.style.opacity = 100;

    // CREATE CURRENT DATE

    const currentDate = new Date();
    const options = {
      day: 'numeric',
      month: 'long', // 'numeric'
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
    };

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(currentDate);

    // CLEAR INPUT FIELDS

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // TIMEOUT TIMER
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // UPDATE UI

    updateUI(currentAccount);
  }
});

// IMPLEMENTING TRANSFERS

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // ADD TRANSFER DATE

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // UPDATE UI

    updateUI(currentAccount);

    // RESET TIMER

    clearInterval(timer);
    timer = startLogOutTimer();
  }

  // CLEAR INPUT FIELDS

  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
});

// REQUESTING A LOAN

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // ADD MOVEMENT
      currentAccount.movements.push(amount);

      // ADD DATE
      currentAccount.movementsDates.push(new Date().toISOString());

      // UPDATE UI
      updateUI(currentAccount);

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// CLOSING ACCOUNTS - FINDINDEX METHOD

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  // CHECK CREDENTIALS

  if (
    inputCloseUsername.value === currentAccount?.username &&
    +inputClosePin.value === currentAccount?.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // DELETE ACCOUNT

    accounts.splice(index, 1);

    // HIDE UI

    containerApp.style.opacity = 0;

    // UPDATE WELCOME MESSAGE

    labelWelcome.textContent = `Log in to get started ...`;
  }

  // CLEAR FIELDS

  inputCloseUsername.value = inputClosePin.value = '';
});

// SORTING MOVEMENTS

let sortState = false;

btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount, !sortState);
  sortState = !sortState;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*

// NUMBERS IN JS

// All numbers in JS are base 2 - binary 0, 1

// We are used to Base 10 - 0 --> 9

console.log(23 === 23.0);

// Funny error

console.log(0.1 + 0.2 === 0.3); // false but it should be true

// Converting string to number

console.log(Number('23'));
console.log(+'23'); // both are the same, this is a trick

// PARSING

// PARSE INTEGERS

console.log('parseInt -->');

console.log(Number.parseInt('30px', 10)); // string needs to start with a number - if letter = NaN --> need to add 10 when using base 10 system

// PARSE FLOAT

console.log('parseFloat -->');

console.log(Number.parseInt('2.5rem')); // only to the decimal
console.log(Number.parseFloat('2.5rem', 10)); // full number

// call parseFloat or parseInt on Number due to name space

// NaN

console.log('NaN -->');

console.log(Number.isNaN(20)); // false as it is a number
console.log(Number.isNaN('20')); // false

console.log(Number.isNaN(+'20x')); // true

console.log(Number.isNaN(23 / 0)); // false as it is infinity === exists in JS

// isFinite

console.log('isFinite -->');

console.log(Number.isFinite(20)); // true

console.log(Number.isFinite('20')); // false

console.log(Number.isFinite(23 / 0)); // false as inifiniy is not finite

// isFinite is the best way to check if any value is a number when working with FloatingPoint numbers

// isInteger

console.log('isInteger -->');

console.log(Number.isInteger(20)); // true

console.log(Number.isInteger('20')); // false

console.log(Number.isInteger(23 / 0)); // false

// MATH AND ROUNDING

// SquareRoot

console.log(Math.sqrt(25)); // 5

console.log(25 ** (1 / 2)); // 5 both are the same
console.log(8 ** (1 / 3)); // 2 - cubic root --> one of the only ways to calculate it

console.log(Math.max(5, 18, 19, 21), 'max'); // returns maximum value --> .max does not do parsing

console.log(Math.min(5, 18, 19, 21), 'min');

console.log(Math.PI * Number.parseFloat('10px') ** 2, 'radius'); // calculate the radius

console.log(Math.trunc(Math.random() * 6) + 1, 'random');

// Random NUMBER

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1 + min);

console.log(randomInt(10, 20), 'randomInt');

// Rounding Integers

console.log('Rounding Integers');

console.log(Math.trunc(23.3), 'trunc');

console.log(Math.round(23.9), 'round'); // 24
console.log(Math.round(23.3), 'round'); // round will round it to the nearest integer --> 23

console.log(Math.ceil(23.9), 'ceil'); // ceil will round up
console.log(Math.ceil(23.3), 'ceil');

console.log(Math.floor(23.9), 'floor'); // floor will round down
console.log(Math.floor(23.3), 'floor');

// all these function do type coercion

// trunc and floor are similar, but the work only with positive numbers --> floor is a bit better, as it works in all situations

// ROUNDING FLOATINT POINT NUMBERS (decimals)

console.log('Rounding FP Numbers (Decimals)');

console.log((2.7).toFixed(0), '--> toFixed 0 decimals'); // to fixed always returns a string --> to fixed defines the number of decimal places

console.log(+(2.34327).toFixed(3), '--> toFixed 3 decimals'); // + sign converts to a number

// THE REMAINDER OPERATOR

console.log(5 % 2); // 5 = 2*2 + 1 --> (remainder)

console.log(8 % 3); // 8 = 3*2 + 2 --> (remainder)

// EVEN or ODD

console.log(6 % 2); // remainder 0 --> even numbers do not have  remainders

console.log(7 % 2); // 3*2 = 6 + 1 ---> odd numbers have remainders

const isEven = n => n % 2 === 0;
console.log(isEven(8)); // true
console.log(isEven(23)); // false
console.log(isEven(9)); // false
console.log(isEven(231312)); // true

// Nice use of remainder

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0, 2, 4, 6 - line will be orange red
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    // 0, 3, 6, 9 - line will be blue
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

// NUMERIC SEPARATORS --> ES 2021 for easier reading

const diameterSolarSystem = 287_460_000_000; // underscore makes it easier to read

console.log(diameterSolarSystem); // JS engine ignores the underscores

const price = 354_99; // cents

console.log(price);

const transferFee = 15_00; // fifteen dollars
const transferFee2 = 1_500; // thousand fivehundred
console.log(transferFee);

const PI = 3.1415; // cannot use two underscores in a row, not on a begining of the number
console.log(PI);

console.log(Number('230_000')); // converting strings to numbers with numeric separators does not work --> returns a NaN

// BIG INT --> added in ES2020

// SPECIAL TYPE OF INTEGER

console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1); // wrong result

console.log(3243242342342342324233242342n); // bigInt

// OPERATIONS

console.log(100000n + 100000n); // operations do work
console.log(100000n * 100000n);

// !!!cannot mix bigInt with regular numbers!!!

const huge = 223423423424232n;
const num = 23;

console.log(huge * BigInt(num)); // fix mixing bigInt with regular number

console.log(20n > 15); // true
console.log(15n === 15); // false --> due to strict equality operator;
console.log(15n == 15); // true ---> loose equality operator does type coercion

console.log(huge + ' is really BIG');

// MATH OPERATIONS DO NOT WORK WITH BIG INT

// DIVISIONS

console.log(10n / 3n); // --> returns the closest bigInt


// DATES AND TIMES

// Create a date

const now = new Date();
console.log(now);

console.log(new Date('Fri Dec 16 2022 11:14:25'));

console.log(new Date('December 24, 2015')); // not exactly reliable

console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5)); // months in JS are zero based

console.log(new Date(2037, 10, 33, 15, 23, 5)); // JS autocorrects dates if the date does not exist to next month

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000)); // 3 days, 24 hours, 60 minutes, 60 seconds, 1000 miliseconds

// DATES ARE SPECIAL TYPE OF OBJECTS --> they have their own methods

const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getMonth()); // 0 based
console.log(future.toISOString()); // ISO standard
console.log(future.getTime());

console.log(new Date(2142253380000)); // you can create dates by simple timestamps of the miliseconds that have passed since 1970

console.log(Date.now()); // timestamp of this moment

future.setFullYear(2040); // set the year to 2040
console.log(future);

// OPERATIONS WITH DATES

const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

const calcDaysPast = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calcDaysPast(new Date(2037, 10, 19), new Date(2037, 10, 22));

console.log(`${days1} days have passed`);

// BASIC NUMBER FORMATTING

const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false,
};

const num = 232131231.23;

console.log('US:', new Intl.NumberFormat('en-US', options).format(num));

console.log('GER:', new Intl.NumberFormat('de-DE', options).format(num));

console.log('Browser', new Intl.NumberFormat(navigator.language).format(num));

// SET TIMEOUT

const ingredients = ['olives', 'spinach'];

const pizzaTimeout = setTimeout(
  (ing1, ing2) => console.log(`here is your pizza with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
); // number of miliseconds

// third, fourth, ... etc are arguments that can be used in a callback function

if (ingredients.includes('spinach')) clearTimeout(pizzaTimeout); // timeout clears

// CLOCK

setInterval(function () {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  return console.log(`${hours}:${minutes}:${seconds}`);
}, 1000);

*/
