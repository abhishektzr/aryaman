/**
 * Teams Data - IPL & World Cup squads
 */

function mk(name, role, bat, bowl) {
  return { name, role, bat, bowl };
}

function gen(arr) {
  return arr.map(p => mk(p[0], p[1], p[2], p[3]));
}

export const TEAMS = {
  ipl: {
    MI: {
      name: 'Mumbai Indians',
      flag: '🔵',
      players: gen([
        ['Rohit Sharma', 'BAT', 92, 15],
        ['Suryakumar Yadav', 'BAT', 90, 8],
        ['Tilak Varma', 'BAT', 83, 30],
        ['Hardik Pandya', 'ALL', 82, 76],
        ['Naman Dhir', 'ALL', 74, 58],
        ['Robin Minz', 'WK', 72, 5],
        ['Karn Sharma', 'BOWL', 38, 80],
        ['Jasprit Bumrah', 'BOWL', 22, 97],
        ['Trent Boult', 'BOWL', 28, 88],
        ['Deepak Chahar', 'BOWL', 42, 83],
        ['Ashwani Kumar', 'BOWL', 22, 78]
      ])
    },
    CSK: {
      name: 'Chennai Super Kings',
      flag: '🟡',
      players: gen([
        ['Ruturaj Gaikwad', 'BAT', 88, 10],
        ['Rachin Ravindra', 'ALL', 80, 72],
        ['Shivam Dube', 'ALL', 82, 56],
        ['MS Dhoni', 'WK', 80, 5],
        ['Ravindra Jadeja', 'ALL', 73, 87],
        ['Sam Curran', 'ALL', 70, 81],
        ['Matheesha Pathirana', 'BOWL', 26, 87],
        ['Deepak Chahar', 'BOWL', 42, 83],
        ['Noor Ahmad', 'BOWL', 30, 82],
        ['Khaleel Ahmed', 'BOWL', 26, 83],
        ['Nathan Ellis', 'BOWL', 30, 82]
      ])
    },
    RCB: {
      name: 'Royal Challengers Bengaluru',
      flag: '🔴',
      players: gen([
        ['Virat Kohli', 'BAT', 96, 20],
        ['Phil Salt', 'WK', 82, 5],
        ['Rajat Patidar', 'BAT', 82, 10],
        ['Liam Livingstone', 'ALL', 82, 72],
        ['Jitesh Sharma', 'WK', 78, 5],
        ['Krunal Pandya', 'ALL', 70, 78],
        ['Swapnil Singh', 'ALL', 66, 70],
        ['Bhuvneshwar Kumar', 'BOWL', 40, 85],
        ['Josh Hazlewood', 'BOWL', 22, 90],
        ['Yash Dayal', 'BOWL', 26, 80],
        ['Suyash Sharma', 'BOWL', 30, 80]
      ])
    },
    KKR: {
      name: 'Kolkata Knight Riders',
      flag: '🟣',
      players: gen([
        ['Ajinkya Rahane', 'BAT', 80, 8],
        ['Quinton de Kock', 'WK', 88, 5],
        ['Venkatesh Iyer', 'ALL', 82, 56],
        ['Andre Russell', 'ALL', 84, 82],
        ['Rinku Singh', 'BAT', 83, 10],
        ['Sunil Narine', 'ALL', 76, 87],
        ['Angkrish Raghuvanshi', 'BAT', 76, 8],
        ['Varun Chakaravarthy', 'BOWL', 35, 86],
        ['Harshit Rana', 'BOWL', 28, 82],
        ['Spencer Johnson', 'BOWL', 26, 82],
        ['Anrich Nortje', 'BOWL', 28, 89]
      ])
    },
    DC: {
      name: 'Delhi Capitals',
      flag: '🟦',
      players: gen([
        ['Jake Fraser-McGurk', 'BAT', 84, 10],
        ['Faf du Plessis', 'BAT', 86, 8],
        ['Axar Patel', 'ALL', 67, 83],
        ['Tristan Stubbs', 'BAT', 80, 10],
        ['Rishabh Pant', 'WK', 88, 5],
        ['Ashutosh Sharma', 'ALL', 76, 55],
        ['Karun Nair', 'BAT', 78, 5],
        ['T Natarajan', 'BOWL', 26, 84],
        ['Kuldeep Yadav', 'BOWL', 32, 87],
        ['Mukesh Kumar', 'BOWL', 25, 80],
        ['Mitchell Starc', 'BOWL', 30, 93]
      ])
    },
    PBKS: {
      name: 'Punjab Kings',
      flag: '🟥',
      players: gen([
        ['Shashank Singh', 'BAT', 78, 10],
        ['Prabhsimran Singh', 'WK', 80, 5],
        ['Josh Inglis', 'WK', 78, 5],
        ['Nehal Wadhera', 'BAT', 76, 10],
        ['Glenn Maxwell', 'ALL', 84, 68],
        ['Azmatullah Omarzai', 'ALL', 74, 70],
        ['Harpreet Brar', 'ALL', 64, 79],
        ['Arshdeep Singh', 'BOWL', 32, 87],
        ['Yuzvendra Chahal', 'BOWL', 35, 87],
        ['Harshal Patel', 'BOWL', 40, 84],
        ['Marco Jansen', 'ALL', 56, 83]
      ])
    },
    RR: {
      name: 'Rajasthan Royals',
      flag: '🌸',
      players: gen([
        ['Yashasvi Jaiswal', 'BAT', 88, 10],
        ['Sanju Samson', 'WK', 86, 5],
        ['Riyan Parag', 'ALL', 80, 56],
        ['Dhruv Jurel', 'WK', 78, 5],
        ['Shimron Hetmyer', 'BAT', 84, 15],
        ['Wanindu Hasaranga', 'ALL', 68, 86],
        ['Sandeep Sharma', 'BOWL', 26, 82],
        ['Trent Boult', 'BOWL', 30, 90],
        ['Jofra Archer', 'BOWL', 28, 91],
        ['Kumar Kartikeya', 'BOWL', 30, 80],
        ['Maheesh Theekshana', 'BOWL', 40, 84]
      ])
    },
    SRH: {
      name: 'Sunrisers Hyderabad',
      flag: '🟧',
      players: gen([
        ['Travis Head', 'BAT', 87, 40],
        ['Abhishek Sharma', 'ALL', 83, 62],
        ['Ishan Kishan', 'WK', 82, 5],
        ['Heinrich Klaasen', 'WK', 86, 5],
        ['Nitish Reddy', 'ALL', 78, 63],
        ['Aniket Verma', 'BAT', 72, 8],
        ['Harshal Patel', 'BOWL', 40, 84],
        ['Pat Cummins', 'BOWL', 40, 92],
        ['Mohammed Shami', 'BOWL', 26, 91],
        ['Zeeshan Ansari', 'BOWL', 28, 78],
        ['Brydon Carse', 'BOWL', 30, 80]
      ])
    },
    GT: {
      name: 'Gujarat Titans',
      flag: '🦁',
      players: gen([
        ['Shubman Gill', 'BAT', 91, 10],
        ['Shahrukh Khan', 'BAT', 78, 10],
        ['Jos Buttler', 'WK', 90, 5],
        ['Sai Sudharsan', 'BAT', 82, 10],
        ['Rahul Tewatia', 'ALL', 72, 62],
        ['Rashid Khan', 'ALL', 60, 93],
        ['Dasun Shanaka', 'ALL', 74, 70],
        ['Mohammed Siraj', 'BOWL', 24, 87],
        ['Prasidh Krishna', 'BOWL', 26, 84],
        ['Noor Ahmad', 'BOWL', 30, 82],
        ['R Sai Kishore', 'BOWL', 35, 80]
      ])
    },
    LSG: {
      name: 'Lucknow Super Giants',
      flag: '🟢',
      players: gen([
        ['KL Rahul', 'WK', 86, 5],
        ['Quinton de Kock', 'WK', 88, 5],
        ['Aiden Markram', 'ALL', 83, 66],
        ['Nicholas Pooran', 'WK', 86, 5],
        ['Marcus Stoinis', 'ALL', 78, 70],
        ['Krunal Pandya', 'ALL', 70, 78],
        ['Ayush Badoni', 'ALL', 74, 55],
        ['Avesh Khan', 'BOWL', 26, 83],
        ['Ravi Bishnoi', 'BOWL', 32, 82],
        ['Mohsin Khan', 'BOWL', 24, 82],
        ['Shardul Thakur', 'ALL', 56, 78]
      ])
    }
  }
};
