'use strict';

import { renderTable } from './serverlogic.js';
renderTable();

const formEl = document.getElementById('validation-form');
const emailField = document.getElementById('email');

formEl.addEventListener('submit', function (e) {
  e.preventDefault();

  const errorsObj = {};

  // First name
  const firstName = document.getElementById('fName').value;
  if (firstName == '') {
    errorsObj.firstName = 'First name field can not be empty';
  }

  // Last name
  const lastName = document.getElementById('lName').value;
  if (lastName == '') {
    errorsObj.lastName = 'Last name field can not be empty';
  }

  // Check email
  const emailInputValue = emailField.value;
  if (emailInputValue == '') {
    errorsObj.eMail = 'Email field can not be empty';
  }

  // Check box
  const confirm = document.getElementById('confirmation').checked;
  if (!confirm) {
    errorsObj.confirmation = 'Confirmation action is required';
  }

  console.log(errorsObj);

  formEl.querySelectorAll('.error').forEach((el) => {
    el.innerText = '';
  });

  for (let item in errorsObj) {
    // console.log(item); //object keys
    let errorElement = document.getElementById('error-' + item);
    console.log(errorElement);

    // If error happens(if p is selected) tha means errorElement is true
    if (errorElement) {
      errorElement.innerText = errorsObj[item];
    }
  }

  if (Object.keys(errorsObj).length === 0) {
    formEl.submit();
    popUponLoad.classList.toggle('active-modal');
  }
});

// Email regex: /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;

function validEmail() {
  const emailValue = document.getElementById('email').value;
  const regexEmail = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
  const emailErr = document.getElementById('error-eMail');

  if (emailValue.match(regexEmail)) {
    emailErr.innerHTML = 'Good job!';
    emailErr.style.color = 'green';
  } else {
    emailErr.innerHTML = 'Enter valid email!';
    emailErr.style.color = 'red';
  }
  if (emailValue == '') {
    emailErr.innerHTML = '';
  }
}
emailField.addEventListener('keyup', validEmail);

// Reset button event
const resetBtn = document.getElementById('resetInfo');
function resetInfo() {
  formEl.reset();
}
resetBtn.addEventListener('click', resetInfo);

// Bootstrap tooltip
const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

// On page load pop-up

const popUponLoad = document.querySelector('.modal');
window.addEventListener('load', function () {
  setTimeout(function appear(event) {
    popUponLoad.classList.toggle('active-modal');
  }, 2000);
});

// Close pop-up

const doLater = document.getElementById('do-later');
doLater.addEventListener('click', function () {
  popUponLoad.style.display = 'none';
});

// Comments GET, PUT, DELETE

const commentsDiv = document.getElementById('commentsDiv');
const overlayDiv = document.querySelector('.overlay');
const overlayContent = document.getElementById('content');
const closeBtn = document.getElementById('closeBtn');

// https://jsonplaceholder.typicode.com/posts

async function AjaxGetComments(url, callback) {
  try {
    const response = await axios.get(url);
    // console.log(response.data);

    callback(response.data);

    // })
  } catch (error) {
    console.error(error);
  }
}

AjaxGetComments('https://jsonplaceholder.typicode.com/posts', function (data) {
  data.forEach((element) => {
    createDiv(element);
  });
});

// Create div post
const fragment = new DocumentFragment();

function createDiv(item) {
  const commDiv = document.createElement('div');
  commDiv.classList.add('comments');

  const titleID = document.createElement('h3');
  titleID.innerText = item.id;
  const headingCom = document.createElement('h2');
  headingCom.innerText = item.title;
  commDiv.setAttribute('data-id', item.id);

  commDiv.appendChild(titleID);
  commDiv.appendChild(headingCom);

  commDiv.addEventListener('mouseover', function () {
    commDiv.style.cursor = 'pointer';
  });
  commDiv.addEventListener('click', function () {
    overlayDiv.classList.add('active');
    // console.log(this)

    overlayContent.innerHTML = '';

    let divId = this.getAttribute('data-id');
    // console.log(divId);
    let newUrl = `https://jsonplaceholder.typicode.com/posts/${divId}`;
    // console.log(newUrl)
    AjaxGetComments(newUrl, function (dataInfo) {
      console.log(dataInfo);
      const pDescr = document.createElement('p');
      pDescr.innerText = dataInfo.body;
      overlayContent.appendChild(pDescr);
    });
  });

  fragment.appendChild(commDiv);
  commentsDiv.appendChild(fragment);
}

closeBtn.addEventListener('click', function () {
  overlayDiv.classList.remove('active');
});
