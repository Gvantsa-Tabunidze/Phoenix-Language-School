'use strict';

// Fetch DATA from REST API

let serverData = [];

export async function renderTable() {
  await getData();
}

let teachersRows = '';

async function getData() {
  try {
    const response = await axios.get('http://localhost:3000/posts');
    const receivedData = response.data;
    serverData = receivedData;
    serverData.forEach((element) => {
      teachersRows += '<tr>';
      teachersRows += `<td><img src = '${element.photo}' style = 'border-radius: 8px; width:56px; vertical-align:middle'></img></td>`;
      teachersRows += `<td style = 'vertical-align:middle'>${element.name}</td>`;
      teachersRows += `<td style = 'vertical-align:middle'>${element.subject}</td>`;
      teachersRows += `<td style = 'vertical-align:middle'>${element.experience}</td>`;
      teachersRows += `<td style = 'vertical-align:middle'><img src = '${element.flag}' style = 'border-radius: 100px; width:56px'></img></td>`;
      ('</tr>');
    });

    let newList = document.getElementById('data');
    newList.innerHTML = teachersRows;
    let children = newList.children;
    let output = Array.from(children);
    // console.log(output);

    let display = 2;
    let currentPage = 1;
    let paginationNumbers = document.querySelector('.paginationNumbers');
    let pagesCount = Math.ceil(output.length / display);
    // console.log(pageCount);

    for (let i = 1; i <= pagesCount; i++) {
      let buttoN = document.createElement('button');
      buttoN.innerHTML = i;
      paginationNumbers.appendChild(buttoN);
    }

    document.getElementById('Previous').addEventListener('click', prev);
    document.getElementById('Next').addEventListener('click', next);

    function main(pageNum) {
      let nextPage = display * pageNum;
      let prevPage = display * (pageNum - 1);
      for (let index = 0; index < output.length; index++) {
        output[index].style.display = 'none';

        if (index < nextPage && index >= prevPage) {
          output[index].style.display = 'table-row';
        }
      }
    }
    main(currentPage);

    let buttonnumbers = paginationNumbers.getElementsByTagName('button');
    for (let i = 0; i < buttonnumbers.length; i++) {
      buttonnumbers[i].addEventListener('click', buttonClick);
    }

    buttonnumbers[currentPage - 1].classList.add('active-btn');

    function buttonClick() {
      buttonnumbers[currentPage - 1].classList.remove('active-btn');
      if (this.innerHTML == pagesCount) {
        document.getElementById('Next').classList.add('disabled');
        document.getElementById('Previous').classList.remove('disabled');
      } else if (this.innerHTML == 1) {
        document.getElementById('Previous').classList.add('disabled');
        document.getElementById('Next').classList.remove('disabled');
      } else {
        document.getElementById('Previous').classList.remove('disabled');
        document.getElementById('Next').classList.remove('disabled');
      }
      currentPage = this.innerHTML;
      this.classList.add('active-btn');
      main(currentPage);
    }

    function prev() {
      document.getElementById('Next').classList.remove('disabled');
      if (currentPage !== 1) {
        buttonnumbers[currentPage - 1].classList.remove('active-btn');
        buttonnumbers[currentPage - 2].classList.add('active-btn');

        currentPage--;
      }

      if (currentPage == 1) {
        document.getElementById('Previous').classList.add('disabled');
      }
      main(currentPage);
    }

    function next() {
      document.getElementById('Previous').classList.remove('disabled');
      if (currentPage !== pagesCount) {
        buttonnumbers[currentPage - 1].classList.remove('active-btn');
        buttonnumbers[currentPage].classList.add('active-btn');
        currentPage++;
      }
      if (currentPage == pagesCount) {
        document.getElementById('Next').classList.add('disabled');
      }
      main(currentPage);
    }
  } catch (error) {
    console.error(error);
  }
}
